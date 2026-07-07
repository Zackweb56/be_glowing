import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';
import Category from '@/lib/models/Category';
import Notification from '@/lib/models/Notification';
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
      stockMap[s.product.toString()] = {
        quantity: s.quantity,
        initialQuantity: s.initialQuantity,
        soldQuantity: s.soldQuantity,
        alertThreshold: s.alertThreshold,
        isInitialized: s.isInitialized,
        isActive: s.isActive,
        _id: s._id,
      };
    }

    const result = products.map((p) => {
      const info = stockMap[p._id.toString()] || { quantity: 0, alertThreshold: 5 };
      return { ...p.toObject(), stockInfo: info, stockId: info._id };
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

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return NextResponse.json({ success: false, message: 'Invalid category' }, { status: 400 });

    // Next sortOrder within this category
    const last = await Product.findOne({ category }).sort({ sortOrder: -1 }).lean();
    const sortOrder = last ? (last.sortOrder ?? 0) + 1 : 0;

    const productStatus = status || 'draft';

    const product = await Product.create({
      name: name.trim(),
      description: description?.trim() || '',
      price: Number(price),
      compareAtPrice: compareAtPrice != null && compareAtPrice !== '' ? Number(compareAtPrice) : null,
      images: images || [],
      category,
      status: productStatus,
      featured: !!featured,
      // isActive is managed by Stock from now on — keep on product for public store filtering
      isActive: false, // Will be controlled via Stock.isActive
      sortOrder,
    });

    // Only create Stock record if the product is ACTIVE (not draft)
    let stockRecord = null;
    if (productStatus === 'active') {
      try {
        stockRecord = await Stock.create({
          product: product._id,
          quantity: 0,
          initialQuantity: 0,
          soldQuantity: 0,
          alertThreshold: 5,
          isInitialized: false,
          isActive: false,
        });

        // Notify admin to initialize stock
        await Notification.create({
          title: 'New Product Needs Stock',
          message: `Initialize the stock for: ${product.name}`,
          type: 'stock_alert',
          link: '/admin/stock',
        });
      } catch (stockErr) {
        await Product.findByIdAndDelete(product._id);
        throw new Error('Failed to create stock record: ' + stockErr.message);
      }
    }

    const populated = await Product.findById(product._id).populate('category', 'name');
    return NextResponse.json({
      success: true,
      product: { ...populated.toObject(), stockInfo: stockRecord || null, stockId: stockRecord?._id || null },
    }, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/products error:', error);
    return NextResponse.json({ success: false, message: error.message || 'Internal server error' }, { status: 500 });
  }
}
