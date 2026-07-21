import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim();

    if (!q || q.length < 3) {
      return NextResponse.json({ success: true, results: [] });
    }

    await dbConnect();

    // Case-insensitive regex search on name
    const regex = new RegExp(q, 'i');
    const products = await Product.find({
      isActive: true,
      status: 'active',
      name: { $regex: regex },
    })
      .select('name slug images price')
      .limit(6)
      .lean();

    const results = products.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      image: p.images?.[0] || '',
      price: p.price,
    }));

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
