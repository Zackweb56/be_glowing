import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

// Configure Cloudinary
const isCloudinaryConfigured =
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
  process.env.CLOUDINARY_API_SECRET &&
  process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function POST(request) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    // Validate size (limit to 2MB for free tier)
    const MAX_SIZE = 2 * 1024 * 1024; // 2MB
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, message: 'File size exceeds 2MB limit' }, { status: 400 });
    }

    // Validate file type
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ success: false, message: 'Only JPEG, PNG, and WEBP images are allowed' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      return new Promise((resolve) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'be_glowing_products',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error, falling back to base64:', error);
              resolve(
                NextResponse.json({
                  success: true,
                  url: `data:${file.type};base64,${buffer.toString('base64')}`,
                  warning: 'Cloudinary upload failed, using Base64 URI fallback'
                }, { status: 200 })
              );
            } else {
              resolve(
                NextResponse.json({
                  success: true,
                  url: result.secure_url,
                }, { status: 200 })
              );
            }
          }
        ).end(buffer);
      });
    } else {
      // Fallback to Base64 Data URI
      const base64Image = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Image,
        message: 'Uploaded as Base64 (configure Cloudinary for permanent storage)',
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ success: false, message: 'No URL provided' }, { status: 400 });
    }

    if (!isCloudinaryConfigured || !url.includes('cloudinary.com')) {
      return NextResponse.json({ success: true, message: 'Not a Cloudinary URL or Cloudinary not configured' });
    }

    // Extract public_id from Cloudinary URL
    // Format usually: https://res.cloudinary.com/<cloud_name>/image/upload/v<version>/<folder>/<filename>.<ext>
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    if (uploadIndex === -1) {
      return NextResponse.json({ success: false, message: 'Invalid Cloudinary URL format' }, { status: 400 });
    }
    
    // Everything after 'upload/' and an optional 'v<version>/' forms the public_id, minus the file extension
    let pathParts = urlParts.slice(uploadIndex + 1);
    if (pathParts[0].startsWith('v') && !isNaN(pathParts[0].substring(1))) {
      pathParts.shift(); // Remove version part
    }
    
    const fileWithExt = pathParts.join('/');
    const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf('.'));

    return new Promise((resolve) => {
      cloudinary.uploader.destroy(publicId, (error, result) => {
        if (error) {
          console.error('Cloudinary delete error:', error);
          resolve(NextResponse.json({ success: false, message: 'Failed to delete from Cloudinary' }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ success: true, result }));
        }
      });
    });
  } catch (error) {
    console.error('Error during file deletion:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
