import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FAQ from "@/lib/models/FAQ";
import { checkAdminAuth, unauthorizedResponse } from "@/lib/api-auth";

export async function GET() {
  try {
    const session = await checkAdminAuth();
    if (!session) return unauthorizedResponse();

    await dbConnect();
    const faqs = await FAQ.find().sort({ sortOrder: 1, createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      faqs: faqs.map(f => ({ ...f, _id: f._id.toString() })),
    });
  } catch (error) {
    console.error("GET FAQs Error:", error);
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
    const { question, answer, isActive, sortOrder } = body;

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json(
        { success: false, message: "Question and answer are required" },
        { status: 400 }
      );
    }

    await dbConnect();
    const faq = await FAQ.create({
      question: question.trim(),
      answer: answer.trim(),
      isActive: isActive !== false,
      sortOrder: Number(sortOrder) || 0,
    });

    return NextResponse.json(
      { success: true, message: "FAQ created", faq: { ...faq.toObject(), _id: faq._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST FAQ Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
