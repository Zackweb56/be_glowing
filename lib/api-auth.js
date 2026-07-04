// lib/api-auth.js
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth"; // Import from lib/auth instead

/**
 * Checks if the current request is from an authenticated admin.
 * Returns the session if valid, false otherwise.
 */
export async function checkAdminAuth() {
  try {
    console.log('🔐 Checking authentication...');
    const session = await getServerSession(authOptions);
    console.log('📌 Session:', session ? 'Found' : 'Not found');
    
    if (!session || !session.user) {
      console.log('❌ No valid session found');
      return false;
    }
    
    console.log('✅ User authenticated:', session.user.email);
    return session;
  } catch (error) {
    console.error("❌ Auth check error:", error);
    return false;
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { success: false, message: "Unauthorized - Please log in" },
    { status: 401 }
  );
}