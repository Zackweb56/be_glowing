import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

const generateSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export async function GET() {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();
    await dbConnect();
    const categories = await Category.find({}).sort({ sortOrder: 1, name: 1 });
    return NextResponse.json({ success: true, categories });
  } catch (error) {
    console.error('GET /api/admin/categories error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const body = await request.json();
    const { name, description, image } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    await dbConnect();

    const trimmed = name.trim();

    // Duplicate check
    const existing = await Category.findOne({ name: { $regex: new RegExp(`^${trimmed}$`, 'i') } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Category name already exists' }, { status: 400 });
    }

    // Calculate next sortOrder
    const last = await Category.findOne({}).sort({ sortOrder: -1 }).lean();
    const sortOrder = last ? (last.sortOrder ?? 0) + 1 : 0;

    const category = await Category.create({
      name: trimmed,
      slug: generateSlug(trimmed),
      description: description?.trim() || '',
      image: image?.trim() || '',
      sortOrder,
    });

    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/categories error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Category name already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}