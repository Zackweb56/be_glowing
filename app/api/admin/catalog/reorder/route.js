import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

/**
 * POST /api/admin/catalog/reorder
 * Accepts one of:
 *   { type: 'categories', items: [{ id, sortOrder }] }
 *   { type: 'products',   items: [{ id, sortOrder }] }
 * Performs a bulk update of sortOrder for each item.
 */
export async function POST(request) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const body = await request.json();
    const { type, items } = body;

    if (!type || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payload: type and items[] are required' },
        { status: 400 }
      );
    }

    await dbConnect();

    const Model = type === 'categories' ? Category : Product;

    const ops = items.map(({ id, sortOrder }) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { sortOrder } },
      },
    }));

    await Model.bulkWrite(ops);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST /api/admin/catalog/reorder error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
