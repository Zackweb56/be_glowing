import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StoreSettings from "@/lib/models/StoreSettings";
import { checkAdminAuth, unauthorizedResponse } from "@/lib/api-auth";

export async function GET() {
  try {
    const session = await checkAdminAuth();
    if (!session) {
      return unauthorizedResponse();
    }

    await dbConnect();
    
    // Find settings or create default if not exists
    let settings = await StoreSettings.findOne();
    if (!settings) {
      settings = await StoreSettings.create({});
    }

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("GET Store Settings Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const session = await checkAdminAuth();
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    await dbConnect();

    // Find settings or create new one
    let settings = await StoreSettings.findOne();
    
    const fields = [
      'storeName', 'logoUrl', 'siteTitle', 'seoDescription', 'seoKeywords',
      'contactEmail', 'contactPhone', 'address', 'currency',
      'instagram', 'facebook', 'tiktok', 'whatsapp',
      'shippingPolicy', 'privacyPolicy', 'returnPolicy',
      'themePrimaryColor', 'themeSecondaryColor', 'themePrimaryFont', 'themeSecondaryFont',
      'heroType', 'heroBackgroundImage', 'heroTitle', 'heroSubtitle',
    ];

    if (settings) {
      // Update all known fields
      for (const field of fields) {
        if (body[field] !== undefined) {
          settings[field] = body[field];
        }
      }
      if (body.announcements !== undefined) {
        settings.announcements = body.announcements;
      }
      await settings.save();
    } else {
      const createData = {};
      for (const field of fields) {
        if (body[field] !== undefined) createData[field] = body[field];
      }
      if (body.announcements !== undefined) {
        createData.announcements = body.announcements;
      }
      settings = await StoreSettings.create(createData);
    }

    return NextResponse.json({ success: true, message: "Settings updated successfully", settings });
  } catch (error) {
    console.error("PUT Store Settings Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
