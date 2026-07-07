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
    
    if (settings) {
      // Update existing
      settings.storeName = body.storeName !== undefined ? body.storeName : settings.storeName;
      settings.contactEmail = body.contactEmail !== undefined ? body.contactEmail : settings.contactEmail;
      settings.contactPhone = body.contactPhone !== undefined ? body.contactPhone : settings.contactPhone;
      settings.address = body.address !== undefined ? body.address : settings.address;
      settings.currency = body.currency !== undefined ? body.currency : settings.currency;
      settings.instagram = body.instagram !== undefined ? body.instagram : settings.instagram;
      settings.facebook = body.facebook !== undefined ? body.facebook : settings.facebook;
      settings.tiktok = body.tiktok !== undefined ? body.tiktok : settings.tiktok;
      settings.whatsapp = body.whatsapp !== undefined ? body.whatsapp : settings.whatsapp;
      settings.shippingPolicy = body.shippingPolicy !== undefined ? body.shippingPolicy : settings.shippingPolicy;
      settings.privacyPolicy = body.privacyPolicy !== undefined ? body.privacyPolicy : settings.privacyPolicy;
      settings.returnPolicy = body.returnPolicy !== undefined ? body.returnPolicy : settings.returnPolicy;
      
      await settings.save();
    } else {
      // Create settings
      settings = await StoreSettings.create({
        storeName: body.storeName,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        address: body.address,
        currency: body.currency,
        instagram: body.instagram,
        facebook: body.facebook,
        tiktok: body.tiktok,
        whatsapp: body.whatsapp,
        shippingPolicy: body.shippingPolicy,
        privacyPolicy: body.privacyPolicy,
        returnPolicy: body.returnPolicy,
      });
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
