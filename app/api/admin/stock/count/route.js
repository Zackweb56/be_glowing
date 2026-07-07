import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/lib/models/Stock';
import { checkAdminAuth } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return NextResponse.json({ success: false, count: 0 }, { status: 401 });

    await dbConnect();
    // Count active products whose stock is NOT yet initialized
    const count = await Stock.countDocuments({ isInitialized: false });

    return NextResponse.json({ success: true, count }, { status: 200 });
  } catch (error) {
    console.error('Error fetching uninitialized stock count:', error);
    return NextResponse.json({ success: false, count: 0 }, { status: 500 });
  }
}
