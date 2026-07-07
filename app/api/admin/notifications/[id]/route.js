import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';
import mongoose from 'mongoose';

export async function PATCH(request, { params }) {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, message: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    await dbConnect();

    const notification = await Notification.findByIdAndUpdate(
      id,
      { $set: { read: body.read ?? true } },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({ success: false, message: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, notification });
  } catch (error) {
    console.error('PATCH /api/admin/notifications/[id] error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
