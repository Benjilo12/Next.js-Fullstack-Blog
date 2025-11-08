import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose"; // Use your existing connect function
import Watchlist from "@/lib/models/watchlist.model";

export async function POST(request) {
  try {
    await connect(); // Use your existing function

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const subscriber = await Watchlist.findOne({ email: normalizedEmail });

    if (!subscriber) {
      return NextResponse.json(
        { success: false, error: "Email not found in our subscription list" },
        { status: 404 }
      );
    }

    if (!subscriber.isActive) {
      return NextResponse.json(
        { success: false, error: "This email is already unsubscribed" },
        { status: 409 }
      );
    }

    subscriber.isActive = false;
    await subscriber.save();

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to unsubscribe from newsletter" },
      { status: 500 }
    );
  }
}
