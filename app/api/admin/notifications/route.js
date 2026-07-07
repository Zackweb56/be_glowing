import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/lib/models/Notification';
import { checkAdminAuth, unauthorizedResponse } from '@/lib/api-auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const isAuthed = await checkAdminAuth();
    if (!isAuthed) return unauthorizedResponse();

    await dbConnect();
    const notifications = await Notification.find({ read: false })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    const count = await Notification.countDocuments({ read: false });

    return NextResponse.json({ success: true, notifications, count }, { status: 200 });
  } catch (error) {
    console.error('GET /api/admin/notifications error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
