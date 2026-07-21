import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { checkAdminAuth, unauthorizedResponse } from "@/lib/api-auth";
import mongoose from "mongoose";

export async function PUT(req, { params }) {
  try {
    const session = await checkAdminAuth();
    if (!session) return unauthorizedResponse();

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, location, stars, comment, isActive, sortOrder } = body;

    if (!name?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name and comment are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const testimonial = await Testimonial.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        location: location?.trim() || "",
        stars: Math.min(5, Math.max(1, Number(stars) || 5)),
        comment: comment.trim(),
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Testimonial updated",
      testimonial: { ...testimonial.toObject(), _id: testimonial._id.toString() },
    });
  } catch (error) {
    console.error("PUT Testimonial Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await checkAdminAuth();
    if (!session) return unauthorizedResponse();

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    await dbConnect();
    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
      return NextResponse.json(
        { success: false, message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Testimonial deleted" });
  } catch (error) {
    console.error("DELETE Testimonial Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
