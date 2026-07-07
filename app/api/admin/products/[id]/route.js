import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';
import Category from '@/lib/models/Category';
import Notification from '@/lib/models/Notification';
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
    return NextResponse.json({
      success: true,
      product: {
        ...product.toObject(),
        stockInfo: stock ? stock.toObject() : null,
        stockId: stock?._id ?? null,
      },
    });
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
    const { name, description, price, compareAtPrice, images, category, status, featured } = body;

    if (!name?.trim()) return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
      return NextResponse.json({ success: false, message: 'Product price must be 0 or greater' }, { status: 400 });
    }
    if (compareAtPrice !== undefined && compareAtPrice !== null && compareAtPrice !== '') {
      if (Number(compareAtPrice) < Number(price)) {
        return NextResponse.json({ success: false, message: 'Compare price cannot be less than regular price' }, { status: 400 });
      }
    }
    if (!category) return NextResponse.json({ success: false, message: 'Product category is required' }, { status: 400 });

    await dbConnect();

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 });

    const newStatus = status || 'draft';
    const wasActive = existingProduct.status === 'active';
    const nowActive = newStatus === 'active';

    const update = {
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      compareAtPrice: compareAtPrice != null && compareAtPrice !== '' ? Number(compareAtPrice) : null,
      images: images || [],
      category,
      status: newStatus,
      featured: !!featured,
      isActive: false, // Always controlled by stock
    };

    const product = await Product.findByIdAndUpdate(id, update, { new: true, runValidators: true }).populate('category', 'name');

    // If product just became active and no stock record exists → create one
    if (!wasActive && nowActive) {
      const existingStock = await Stock.findOne({ product: id });
      if (!existingStock) {
        await Stock.create({
          product: product._id,
          quantity: 0,
          initialQuantity: 0,
          soldQuantity: 0,
          alertThreshold: 5,
          isInitialized: false,
          isActive: false,
        });
        await Notification.create({
          title: 'New Product Needs Stock',
          message: `Initialize the stock for: ${product.name}`,
          type: 'stock_alert',
          link: '/admin/stock',
        });
      }
    }

    const stock = await Stock.findOne({ product: id });
    return NextResponse.json({
      success: true,
      product: {
        ...product.toObject(),
        stockInfo: stock ? stock.toObject() : null,
        stockId: stock?._id ?? null,
      },
    });
  } catch (error) {
    console.error('PUT /api/admin/products/[id] error:', error);
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

    const allowedFields = ['sortOrder', 'status', 'featured'];
    const update = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) update[field] = body[field];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update' }, { status: 400 });
    }

    const existingProduct = await Product.findById(id);
    if (!existingProduct) return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });

    const wasActive = existingProduct.status === 'active';
    const nowActive = update.status === 'active';

    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true });

    // Create stock if transitioned to active
    if (!wasActive && nowActive) {
      const existingStock = await Stock.findOne({ product: id });
      if (!existingStock) {
        await Stock.create({
          product: product._id,
          quantity: 0,
          initialQuantity: 0,
          soldQuantity: 0,
          alertThreshold: 5,
          isInitialized: false,
          isActive: false,
        });
        await Notification.create({
          title: 'New Product Needs Stock',
          message: `Initialize the stock for: ${product.name}`,
          type: 'stock_alert',
          link: '/admin/stock',
        });
      }
    }

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
