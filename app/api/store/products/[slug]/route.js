import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Category from '@/lib/models/Category';
import Stock from '@/lib/models/Stock';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    await dbConnect();

    const product = await Product.findOne({ slug, isActive: true, status: 'active' }).populate('category').lean();
    if (!product) {
      return NextResponse.json({ success: false, message: 'Product not found' }, { status: 404 });
    }

    const stock = await Stock.findOne({ product: product._id }).lean();
    
    return NextResponse.json({ 
      success: true, 
      product: {
        ...product,
        stock: stock ? { quantity: stock.quantity, alertThreshold: stock.alertThreshold } : { quantity: 0, alertThreshold: 5 }
      } 
    }, { status: 200 });
  } catch (error) {
    console.error('Store product fetch error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
