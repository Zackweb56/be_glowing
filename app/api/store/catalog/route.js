import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();

    // Fetch active categories
    const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean();

    // Fetch active products
    const products = await Product.find({ isActive: true, status: 'active' }).sort({ sortOrder: 1 }).lean();

    // Fetch stock for these products
    const productIds = products.map(p => p._id);
    const stocks = await Stock.find({ product: { $in: productIds } }).lean();

    // Map stocks to products
    const stockMap = stocks.reduce((acc, stock) => {
      acc[stock.product.toString()] = { quantity: stock.quantity, alertThreshold: stock.alertThreshold };
      return acc;
    }, {});

    const populatedProducts = products.map(p => ({
      ...p,
      stock: stockMap[p._id.toString()] || { quantity: 0, alertThreshold: 5 }
    }));

    // Map products to categories
    const catalog = categories.map(c => ({
      ...c,
      products: populatedProducts.filter(p => p.category?.toString() === c._id.toString())
    }));

    return NextResponse.json({ success: true, catalog }, { status: 200 });
  } catch (error) {
    console.error('Store catalog fetch error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
