// app/api/subscription/check/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = 'https://reliable-charis-adsorbable.ngrok-free.dev/subscription';

export async function GET(request: NextRequest) {
  try {
    // Get user_id from cookies
    const cookieHeader = request.headers.get("cookie");
    let vendorId = null;

    if (cookieHeader) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [name, value] = cookie.trim().split("=");
        acc[name] = value;
        return acc;
      }, {} as Record<string, string>);
      
      vendorId = cookies.vendor_id || null;
    }

    if (!vendorId) {
      console.log("[SUBSCRIPTION_CHECK] No user ID found in cookies");
      return NextResponse.json(
        { 
          status: "error", 
          message: "User ID not found",
          hasActiveSubscription: false 
        },
        { status: 401 }
      );
    }

    console.log(`[SUBSCRIPTION_CHECK] Checking subscription for user: ${vendorId}`);

    // Call external API to check subscription
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(`${API_BASE_URL}/api/subscription/find/${vendorId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`[SUBSCRIPTION_CHECK] API response status: ${response.status}`);

      // Handle different response statuses
      if (response.status === 404) {
        // No subscription found
        console.log("[SUBSCRIPTION_CHECK] ❌ No active subscription found");
        return NextResponse.json({
          status: "success",
          message: "No active subscription",
          hasActiveSubscription: false,
          data: null
        });
      }

      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
        console.log("[SUBSCRIPTION_CHECK] API response:", JSON.stringify(result, null, 2));
      } else {
        const textResponse = await response.text();
        console.error("[SUBSCRIPTION_CHECK] Non-JSON response:", textResponse.substring(0, 200));
        return NextResponse.json({
          status: "error",
          message: "Invalid response from server",
          hasActiveSubscription: false
        });
      }

      if (!response.ok) {
        console.error(`[SUBSCRIPTION_CHECK] Failed with status: ${response.status}`);
        return NextResponse.json({
          status: "error",
          message: result.message || "Failed to check subscription",
          hasActiveSubscription: false
        });
      }

      // Check if subscription is active and not expired
      const subscriptionData = result.data;
      const hasActiveSubscription = subscriptionData && new Date(subscriptionData.expireAt) > new Date();

      console.log(`[SUBSCRIPTION_CHECK] ✅ Subscription status:`, {
        hasActiveSubscription,
        ref: subscriptionData?.ref,
        expireAt: subscriptionData?.expireAt,
        isTrial: subscriptionData?.isTrial
      });

      return NextResponse.json({
        status: "success",
        message: result.msg || "Subscription found",
        hasActiveSubscription,
        data: subscriptionData
      });

    }   // eslint-disable-next-line @typescript-eslint/no-explicit-any 
    catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        console.error("[SUBSCRIPTION_CHECK] Request timeout");
        return NextResponse.json({
          status: "error",
          message: "Request timed out",
          hasActiveSubscription: false
        });
      }

      console.error("[SUBSCRIPTION_CHECK] API connection error:", fetchError);
      return NextResponse.json({
        status: "error",
        message: "Unable to connect to subscription service",
        hasActiveSubscription: false
      });
    }

  } 
  catch (error) {
    console.error("[SUBSCRIPTION_CHECK] Unexpected error:", error);
    return NextResponse.json({
      status: "error",
      message: "Internal server error",
      hasActiveSubscription: false
    });
  }
}