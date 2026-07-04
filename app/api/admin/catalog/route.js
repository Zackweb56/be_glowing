import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Category from '@/lib/models/Category';
import Product from '@/lib/models/Product';
import Stock from '@/lib/models/Stock';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

/**
 * GET /api/admin/catalog
 * Returns all categories sorted by sortOrder,
 * each with their products embedded (also sorted by sortOrder).
 */
export async function GET() {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    await dbConnect();

    const categories = await Category.find({}).sort({ sortOrder: 1, createdAt: 1 }).lean();

    const products = await Product.find({})
      .sort({ sortOrder: 1, createdAt: 1 })
      .lean();

    // Attach stock info
    const stocks = await Stock.find({}).lean();
    const stockMap = {};
    for (const s of stocks) {
      stockMap[s.product.toString()] = { quantity: s.quantity, alertThreshold: s.alertThreshold, _id: s._id };
    }

    // Group products by category
    const productsByCat = {};
    for (const p of products) {
      const catId = p.category.toString();
      if (!productsByCat[catId]) productsByCat[catId] = [];
      productsByCat[catId].push({
        ...p,
        _id: p._id.toString(),
        category: catId,
        stock: stockMap[p._id.toString()] || { quantity: 0, alertThreshold: 5 },
      });
    }

    const result = categories.map((cat) => ({
      ...cat,
      _id: cat._id.toString(),
      products: productsByCat[cat._id.toString()] || [],
    }));

    return NextResponse.json({ success: true, catalog: result });
  } catch (error) {
    console.error('GET /api/admin/catalog error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
