import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/lib/models/Stock';
import Product from '@/lib/models/Product';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

export async function GET() {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    await dbConnect();

    const stockItems = await Stock.find({})
      .populate({
        path: 'product',
        select: 'name price images status category',
        populate: {
          path: 'category',
          select: 'name',
        },
      })
      .sort({ createdAt: -1 });

    const validStockItems = stockItems.filter((item) => item.product);

    return NextResponse.json({ success: true, stock: validStockItems }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stock items:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
