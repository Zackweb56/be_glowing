import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';
import mongoose from 'mongoose';

const generateSlug = (name) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

function badId() {
  return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
}

export async function PUT(request, { params }) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return badId();

    const body = await request.json();
    const { name, description, image } = body;

    if (!name?.trim()) {
      return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 });
    }

    await dbConnect();

    const trimmed = name.trim();
    const existing = await Category.findOne({ _id: { $ne: id }, name: { $regex: new RegExp(`^${trimmed}$`, 'i') } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Category name already exists' }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name: trimmed, slug: generateSlug(trimmed), description: description?.trim() || '', image: image?.trim() || '' },
      { new: true, runValidators: true }
    );

    if (!category) return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('PUT /api/admin/categories/[id] error:', error);
    if (error.code === 11000) {
      return NextResponse.json({ success: false, message: 'Category name already exists' }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return badId();

    const body = await request.json();
    await dbConnect();

    // Accept any field patch (e.g. isActive, sortOrder)
    const allowedFields = ['isActive', 'sortOrder'];
    const update = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update' }, { status: 400 });
    }

    const category = await Category.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!category) return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });

    return NextResponse.json({ success: true, category });
  } catch (error) {
    console.error('PATCH /api/admin/categories/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return badId();

    await dbConnect();

    // Delete all products in this category (and their stock records)
    const products = await Product.find({ category: id }).select('_id').lean();
    const productIds = products.map((p) => p._id);

    if (productIds.length > 0) {
      await Stock.deleteMany({ product: { $in: productIds } });
      await Product.deleteMany({ category: id });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });

    return NextResponse.json({ success: true, message: 'Category and all its products deleted' });
  } catch (error) {
    console.error('DELETE /api/admin/categories/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}