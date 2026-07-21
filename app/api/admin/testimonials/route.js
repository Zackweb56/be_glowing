import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Testimonial from "@/lib/models/Testimonial";
import { checkAdminAuth, unauthorizedResponse } from "@/lib/api-auth";

export async function GET() {
  try {
    const session = await checkAdminAuth();
    if (!session) return unauthorizedResponse();

    await dbConnect();
    const testimonials = await Testimonial.find()
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      testimonials: testimonials.map(t => ({ ...t, _id: t._id.toString() })),
    });
  } catch (error) {
    console.error("GET Testimonials Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const session = await checkAdminAuth();
    if (!session) return unauthorizedResponse();

    const body = await req.json();
    const { name, location, stars, comment, isActive, sortOrder } = body;

    if (!name?.trim() || !comment?.trim()) {
      return NextResponse.json(
        { success: false, message: "Name and comment are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const testimonial = await Testimonial.create({
      name: name.trim(),
      location: location?.trim() || "",
      stars: Math.min(5, Math.max(1, Number(stars) || 5)),
      comment: comment.trim(),
      isActive: isActive !== false,
      sortOrder: Number(sortOrder) || 0,
    });

    return NextResponse.json(
      { success: true, message: "Testimonial created", testimonial: { ...testimonial.toObject(), _id: testimonial._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Testimonial Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
