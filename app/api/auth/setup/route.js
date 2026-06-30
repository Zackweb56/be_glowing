import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();

    // Check if any user exists
    const usersCount = await User.countDocuments();
    if (usersCount > 0) {
      return NextResponse.json({ message: 'Admin user already exists. Setup disabled.' }, { status: 403 });
    }

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    return NextResponse.json({ message: 'Admin user created successfully', user: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email } }, { status: 201 });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}
