// app/api/tracking/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://api.swiftree.app";

export async function GET(request: NextRequest) {
  try {
    // Extract code from query parameters
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { status: "error", message: "Tracking code is required. Use ?code=YOUR_TRACKING_CODE" },
        { status: 400 }
      );
    }

    console.log('🔍 Fetching tracking info for code:', code);

    const response = await fetch(
      `${API_BASE_URL}/api/sendbox/tracking/${code}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const responseText = await response.text();
    console.log('🔍 Tracking response status:', response.status);
    console.log('🔍 Tracking response:', responseText);

    if (!response.ok) {
      let errorMessage = `Failed to fetch tracking info: ${response.status}`;
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }

      return NextResponse.json(
        { status: "error", message: errorMessage },
        { status: response.status }
      );
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { status: "error", message: "Invalid response from tracking service" },
        { status: 500 }
      );
    }

    console.log('✅ Tracking data retrieved successfully');
    return NextResponse.json(result);

  } // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (error: any) {
    console.error("❌ Error fetching tracking info:", error);
    return NextResponse.json(
      { status: "error", message: "Internal server error" },
      { status: 500 }
    );
  }
}