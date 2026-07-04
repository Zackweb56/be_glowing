import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';
import Category from '@/lib/models/Category';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

export async function GET() {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    await dbConnect();
    const products = await Product.find({})
      .populate('category', 'name')
      .sort({ sortOrder: 1, createdAt: -1 });

    const stocks = await Stock.find({}).lean();
    const stockMap = {};
    for (const s of stocks) {
      stockMap[s.product.toString()] = { quantity: s.quantity, alertThreshold: s.alertThreshold, _id: s._id };
    }

    const result = products.map((p) => {
      const info = stockMap[p._id.toString()] || { quantity: 0, alertThreshold: 5 };
      return { ...p.toObject(), stock: info.quantity, alertThreshold: info.alertThreshold, stockId: info._id };
    });

    return NextResponse.json({ success: true, products: result });
  } catch (error) {
    console.error('GET /api/admin/products error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const body = await request.json();
    const { name, description, price, compareAtPrice, images, category, sku, status, featured, isActive, initialStock, alertThreshold } = body;

    if (!name?.trim()) return NextResponse.json({ success: false, message: 'Product name is required' }, { status: 400 });
    if (price === undefined || price === null || isNaN(price) || Number(price) < 0) {
      return NextResponse.json({ success: false, message: 'Product price must be 0 or greater' }, { status: 400 });
    }
    if (!category) return NextResponse.json({ success: false, message: 'Product category is required' }, { status: 400 });

    await dbConnect();

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 });

    if (sku?.trim()) {
      const existingSku = await Product.findOne({ sku: sku.trim() });
      if (existingSku) return NextResponse.json({ success: false, message: 'SKU already in use' }, { status: 400 });
    }

    // Next sortOrder within this category
    const last = await Product.findOne({ category }).sort({ sortOrder: -1 }).lean();
    const sortOrder = last ? (last.sortOrder ?? 0) + 1 : 0;

    const product = await Product.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      compareAtPrice: compareAtPrice != null && compareAtPrice !== '' ? Number(compareAtPrice) : null,
      images: images || [],
      category,
      sku: sku?.trim() || undefined,
      status: status || 'draft',
      featured: !!featured,
      isActive: isActive !== false,
      sortOrder,
    });

    // Auto-create stock record
    let stockRecord;
    try {
      stockRecord = await Stock.create({
        product: product._id,
        quantity: Number(initialStock) >= 0 ? Math.floor(Number(initialStock)) : 0,
        alertThreshold: Number(alertThreshold) >= 0 ? Math.floor(Number(alertThreshold)) : 5,
      });
    } catch (stockErr) {
      await Product.findByIdAndDelete(product._id);
      throw new Error('Failed to create stock record: ' + stockErr.message);
    }

    const populated = await Product.findById(product._id).populate('category', 'name');
    return NextResponse.json({
      success: true,
      product: { ...populated.toObject(), stock: stockRecord.quantity, alertThreshold: stockRecord.alertThreshold, stockId: stockRecord._id },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/products error:', error);
    if (error.code === 11000) return NextResponse.json({ success: false, message: 'SKU already in use' }, { status: 400 });
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
