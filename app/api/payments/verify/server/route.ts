// app/api/payments/verify/server/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://api.swiftree.app";
const INTERNAL_SECRET = process.env.SWIFTREE_INTERNAL_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reference, storeId } = body;

    if (!reference) {
      return NextResponse.json(
        { 
          status: "error", 
          message: "Payment reference is required",
          redirectTo: "/payment/failed",
          queryParams: "error=no_reference"
        },
        { status: 200 }
      );
    }

    console.log('🔍 Server-side payment verification for reference:', reference);

    // Verify payment with Swiftree API
    const response = await fetch(
      `${API_BASE_URL}/api/payments/verify/${reference}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": INTERNAL_SECRET || "",
        },
      }
    );

    if (!response.ok) {
      console.error('❌ Payment verification failed:', response.status);
      return NextResponse.json(
        {
          status: "error",
          message: "Payment verification failed",
          redirectTo: "/payment/failed",
          queryParams: `reference=${reference}&error=verification_failed`
        },
        { status: 200 }
      );
    }

    const result = await response.json();
    console.log('✅ Server verification result:', result);

    // Determine redirect based on transaction status
    let redirectTo = "/payment/failed";
    let queryParams = `reference=${reference}`;
    
    if (result.data?.transaction_status === 1) {
      redirectTo = "/payment/success";
      queryParams = `reference=${reference}`;
      
      // Add amount and currency if available
      if (result.data?.amount) {
        queryParams += `&amount=${result.data.amount}`;
      }
      if (result.data?.currency) {
        queryParams += `&currency=${result.data.currency}`;
      }
    } else if (result.data?.transaction_status === 0) {
      redirectTo = "/payment/failed";
      queryParams = `reference=${reference}&status=pending`;
    } else {
      queryParams = `reference=${reference}&status=failed`;
    }
    
    // Add store ID to query params if available
    if (storeId) {
      queryParams += `&store_id=${storeId}`;
    }

    return NextResponse.json({
      status: "success",
      message: "Payment verification completed",
      transactionStatus: result.data?.transaction_status,
      redirectTo,
      queryParams,
      data: result.data
    });

  } // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  catch (error: any) {
    console.error("Server-side verification error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Internal server error",
        redirectTo: "/payment/failed",
        queryParams: "error=server_error"
      },
      { status: 200 }
    );
  }
}