import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/lib/models/Stock';
import Product from '@/lib/models/Product';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { action } = body;

    await dbConnect();

    const stockItem = await Stock.findById(id);
    if (!stockItem) {
      return NextResponse.json({ success: false, message: 'Stock record not found' }, { status: 404 });
    }

    let updateFields = {};

    if (action === 'initialize') {
      // First-time initialization of stock quantity
      const { quantity, alertThreshold } = body;
      if (quantity === undefined || isNaN(quantity) || parseInt(quantity) < 0) {
        return NextResponse.json({ success: false, message: 'Quantity must be 0 or greater' }, { status: 400 });
      }
      const qty = parseInt(quantity);
      const threshold = alertThreshold !== undefined && !isNaN(alertThreshold) ? parseInt(alertThreshold) : 5;

      updateFields = {
        quantity: qty,
        initialQuantity: qty,
        soldQuantity: 0,
        alertThreshold: threshold,
        isInitialized: true,
        isActive: qty > 0, // Auto-activate if qty > 0
      };

      // Also sync Product.isActive
      await Product.findByIdAndUpdate(stockItem.product, { isActive: qty > 0 });

    } else if (action === 'add_sales') {
      // Record new sales (sold units from WhatsApp or manual)
      if (!stockItem.isInitialized) {
        return NextResponse.json({ success: false, message: 'Cannot record sales before initializing stock' }, { status: 400 });
      }
      const { soldCount } = body;
      if (!soldCount || isNaN(soldCount) || parseInt(soldCount) <= 0) {
        return NextResponse.json({ success: false, message: 'Sold count must be a positive number' }, { status: 400 });
      }
      const newSold = parseInt(soldCount);
      if (newSold > stockItem.quantity) {
        return NextResponse.json({ success: false, message: `Cannot sell ${newSold} units — only ${stockItem.quantity} available` }, { status: 400 });
      }
      const newQty = stockItem.quantity - newSold;
      updateFields = {
        quantity: newQty,
        soldQuantity: (stockItem.soldQuantity || 0) + newSold,
        isActive: newQty > 0,
      };

      // Sync Product.isActive
      await Product.findByIdAndUpdate(stockItem.product, { isActive: newQty > 0 });

    } else if (action === 'update_threshold') {
      const { alertThreshold } = body;
      if (alertThreshold === undefined || isNaN(alertThreshold) || parseInt(alertThreshold) < 0) {
        return NextResponse.json({ success: false, message: 'Alert threshold must be 0 or greater' }, { status: 400 });
      }
      updateFields = { alertThreshold: parseInt(alertThreshold) };

    } else if (action === 'toggle_active') {
      const { isActive } = body;
      updateFields = { isActive: !!isActive };
      await Product.findByIdAndUpdate(stockItem.product, { isActive: !!isActive });

    } else {
      return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
    }

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    ).populate({
      path: 'product',
      select: 'name price images status category',
      populate: { path: 'category', select: 'name' },
    });

    return NextResponse.json({ success: true, stock: updatedStock }, { status: 200 });
  } catch (error) {
    console.error('Error updating stock record:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
