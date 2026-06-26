import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import mongoose from 'mongoose';

export async function GET() {
  try {
    // Attempt to connect to database
    const conn = await dbConnect();
    
    // Check connection state
    const state = mongoose.connection.readyState;
    const stateMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    // Get database stats
    const stats = await mongoose.connection.db.stats();
    
    return NextResponse.json({
      success: true,
      message: '✅ Database connection successful!',
      details: {
        state: stateMap[state] || 'unknown',
        database: mongoose.connection.name,
        host: mongoose.connection.host,
        collections: stats.collections || 0,
        indexes: stats.indexes || 0,
        dataSize: stats.dataSize ? (stats.dataSize / 1024 / 1024).toFixed(2) + ' MB' : '0 MB',
        timestamp: new Date().toISOString()
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Database test failed:', error);
    return NextResponse.json({
      success: false,
      message: '❌ Database connection failed',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}