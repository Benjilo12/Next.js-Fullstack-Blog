// app/api/newsletter/subscribe/route.js
import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose"; // Use your existing connect function
import Watchlist from "@/lib/models/watchlist.model";

export async function POST(request) {
  try {
    // Connect to database using your existing function
    await connect();

    const { email, preferences = {}, metadata = {} } = await request.json();

    // Validate email
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const existingSubscriber = await Watchlist.findOne({
      email: normalizedEmail,
    });

    if (existingSubscriber) {
      if (existingSubscriber.isActive) {
        return NextResponse.json(
          { success: false, error: "This email is already subscribed" },
          { status: 409 }
        );
      } else {
        // Reactivate inactive subscription
        existingSubscriber.isActive = true;
        existingSubscriber.preferences = {
          ...existingSubscriber.preferences,
          ...preferences,
        };
        existingSubscriber.metadata = {
          ...existingSubscriber.metadata,
          ...metadata,
        };
        await existingSubscriber.save();

        return NextResponse.json({
          success: true,
          message: "Successfully resubscribed to newsletter",
          data: existingSubscriber,
        });
      }
    }

    // Create new subscription
    const newSubscriber = await Watchlist.create({
      email: normalizedEmail,
      preferences,
      metadata,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter",
        data: newSubscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "This email is already subscribed" },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, error: errors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to subscribe to newsletter" },
      { status: 500 }
    );
  }
}
