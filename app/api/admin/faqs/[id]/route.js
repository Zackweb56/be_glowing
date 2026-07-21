import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FAQ from "@/lib/models/FAQ";
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
    const { question, answer, isActive, sortOrder } = body;

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json(
        { success: false, message: "Question and answer are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const faq = await FAQ.findByIdAndUpdate(
      id,
      {
        question: question.trim(),
        answer: answer.trim(),
        isActive: isActive !== false,
        sortOrder: Number(sortOrder) || 0,
      },
      { new: true, runValidators: true }
    );

    if (!faq) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "FAQ updated",
      faq: { ...faq.toObject(), _id: faq._id.toString() },
    });
  } catch (error) {
    console.error("PUT FAQ Error:", error);
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
    const faq = await FAQ.findByIdAndDelete(id);

    if (!faq) {
      return NextResponse.json(
        { success: false, message: "FAQ not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "FAQ deleted" });
  } catch (error) {
    console.error("DELETE FAQ Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
