import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Stock from '@/lib/models/Stock';
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
    const { quantity, alertThreshold } = body;

    // Validate inputs
    if (quantity === undefined || quantity === null || isNaN(quantity) || quantity < 0) {
      return NextResponse.json({ success: false, message: 'Stock quantity must be a non-negative number' }, { status: 400 });
    }

    const updateFields = {
      quantity: parseInt(quantity)
    };

    if (alertThreshold !== undefined && alertThreshold !== null) {
      if (isNaN(alertThreshold) || alertThreshold < 0) {
        return NextResponse.json({ success: false, message: 'Alert threshold must be a non-negative number' }, { status: 400 });
      }
      updateFields.alertThreshold = parseInt(alertThreshold);
    }

    await dbConnect();

    const updatedStock = await Stock.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    ).populate({
      path: 'product',
      select: 'name sku price images status category',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    if (!updatedStock) {
      return NextResponse.json({ success: false, message: 'Stock record not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, stock: updatedStock }, { status: 200 });
  } catch (error) {
    console.error('Error updating stock record:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
