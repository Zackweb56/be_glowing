import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { checkAdminAuth, unauthorizedResponse } from "@/lib/api-auth";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const session = await checkAdminAuth();
    if (!session) {
      return unauthorizedResponse();
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select("-password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("GET Profile API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const session = await checkAdminAuth();
    if (!session) {
      return unauthorizedResponse();
    }

    const body = await req.json();
    const { action } = body;

    await dbConnect();
    const user = await User.findById(session.user.id).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (action === "update-profile") {
      const { name, email, currentPassword } = body;

      if (!name || !email) {
        return NextResponse.json(
          { success: false, message: "Name and email are required" },
          { status: 400 }
        );
      }

      // Check if email format is valid
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: "Please provide a valid email address" },
          { status: 400 }
        );
      }

      // If email is changing, verify the password for security
      if (email.toLowerCase() !== user.email.toLowerCase()) {
        if (!currentPassword) {
          return NextResponse.json(
            { success: false, message: "Current password is required to change email address" },
            { status: 400 }
          );
        }

        const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordMatch) {
          return NextResponse.json(
            { success: false, message: "Incorrect current password" },
            { status: 400 }
          );
        }

        // Check if email is already in use by another user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
          return NextResponse.json(
            { success: false, message: "Email is already in use" },
            { status: 400 }
          );
        }
      }

      user.name = name;
      user.email = email.toLowerCase();
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Profile updated successfully",
        user: { name: user.name, email: user.email },
      });
    }

    if (action === "change-password") {
      const { currentPassword, newPassword, confirmNewPassword } = body;

      if (!currentPassword || !newPassword || !confirmNewPassword) {
        return NextResponse.json(
          { success: false, message: "All password fields are required" },
          { status: 400 }
        );
      }

      if (newPassword !== confirmNewPassword) {
        return NextResponse.json(
          { success: false, message: "New passwords do not match" },
          { status: 400 }
        );
      }

      // Password strength validation: Min 8 characters
      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, message: "New password must be at least 8 characters long" },
          { status: 400 }
        );
      }

      if (newPassword.length > 128) {
        return NextResponse.json(
          { success: false, message: "New password must be less than 128 characters long" },
          { status: 400 }
        );
      }

      // Verify current password
      const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordMatch) {
        return NextResponse.json(
          { success: false, message: "Incorrect current password" },
          { status: 400 }
        );
      }

      // Hash and update password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      return NextResponse.json({
        success: true,
        message: "Password updated successfully",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Profile API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
