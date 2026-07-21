import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import StoreSettings from '@/lib/models/StoreSettings';

export const dynamic = 'force-dynamic';

// Public endpoint — only exposes non-sensitive branding fields
export async function GET() {
  try {
    await dbConnect();
    const settings = await StoreSettings.findOne().lean();

    const data = {
      storeName: settings?.storeName || 'Be Glowing',
      logoUrl: settings?.logoUrl || '',
      siteTitle: settings?.siteTitle || 'Be Glowing | Premium Jewelry & Accessories',
      seoDescription: settings?.seoDescription || '',
      seoKeywords: settings?.seoKeywords || '',
      whatsapp: settings?.whatsapp || '+212',
    };

    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    console.error('Public settings fetch error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
