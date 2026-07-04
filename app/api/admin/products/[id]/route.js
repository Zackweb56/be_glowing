import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';
import Category from '@/lib/models/Category';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';
import mongoose from 'mongoose';

function badId() {
  return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
}

export async function GET(request, { params }) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return badId();
    await dbConnect();
    const product = await Product.findById(id).populate('category', 'name');
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    const stock = await Stock.findOne({ product: id });
    return NextResponse.json({ success: true, product: { ...product.toObject(), stock: stock?.quantity ?? 0, alertThreshold: stock?.alertThreshold ?? 5, stockId: stock?._id ?? null } });
  } catch (error) {
    console.error('GET /api/admin/products/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();
    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) return badId();

    const body = await request.json();
    const { name, description, price, compareAtPrice, images, category, sku, status, featured, isActive } = body;

    if (!name?.trim()) return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
      return NextResponse.json({ success: false, message: 'Product price must be 0 or greater' }, { status: 400 });
    }
    if (!category) return NextResponse.json({ success: false, message: 'Product category is required' }, { status: 400 });

    await dbConnect();

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 });

    if (sku?.trim()) {
      const existingSku = await Product.findOne({ _id: { $ne: id }, sku: sku.trim() });
      if (existingSku) return NextResponse.json({ success: false, message: 'SKU already in use' }, { status: 400 });
    }

    const update = {
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      compareAtPrice: compareAtPrice != null && compareAtPrice !== '' ? Number(compareAtPrice) : null,
      images: images || [],
      category,
      sku: sku?.trim() || undefined,
      status: status || 'draft',
      featured: !!featured,
    };
    if (isActive !== undefined) update.isActive = isActive;

    const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate('category', 'name');
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    const stock = await Stock.findOne({ product: id });
    return NextResponse.json({ success: true, product: { ...product.toObject(), stock: stock?.quantity ?? 0, alertThreshold: stock?.alertThreshold ?? 5, stockId: stock?._id ?? null } });
  } catch (error) {
    console.error('PUT /api/admin/products/[id] error:', error);
    if (error.code === 11000) return NextResponse.json({ success: false, message: 'SKU already in use' }, { status: 400 });
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

    const allowedFields = ['isActive', 'sortOrder', 'status', 'featured'];
    const update = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update' }, { status: 400 });
    }

    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true });
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('PATCH /api/admin/products/[id] error:', error);
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
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    await Stock.findOneAndDelete({ product: id });

    return NextResponse.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('DELETE /api/admin/products/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
