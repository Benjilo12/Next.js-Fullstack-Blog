import { NextResponse } from "next/server";
import { connect } from "@/lib/mongodb/mongoose"; // Use your existing connect function
import Watchlist from "@/lib/models/watchlist.model";

export async function GET(request) {
  try {
    await connect(); // Use your existing function

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const activeOnly = searchParams.get("activeOnly") !== "false";

    const query = activeOnly ? { isActive: true } : {};

    const subscribers = await Watchlist.find(query)
      .sort({ subscribedAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select("-metadata.ipAddress -metadata.userAgent");

    const total = await Watchlist.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        subscribers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Fetch subscribers error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
