// app/api/stores/[storeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL
  ?.trim()
  .replace(/\/+$/, "");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params

  try {
    if (!API_BASE_URL) {
      return NextResponse.json(
        {
          status: "error",
          message: "Store API is not configured",
        },
        { status: 500 }
      );
    }

    const upstreamUrl = `${API_BASE_URL}/api/stores/${encodeURIComponent(storeId)}`;
    const response = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-stf-org-c': '39fda25f3410a85a0fe5e2a2d81ac2c7d8c8694bf43304fe0db413e6494f024b',
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const responseText = await response.text();
      let upstreamMessage = responseText;

      try {
        const errorData = JSON.parse(responseText);
        upstreamMessage =
          errorData.message || errorData.error || responseText;
      } catch {
        // Keep the backend's plain-text response.
      }

      console.error("Store details upstream request failed", {
        upstreamUrl,
        status: response.status,
        statusText: response.statusText,
        response: responseText,
      });

      return NextResponse.json(
        { 
          status: 'error', 
          message:
            upstreamMessage ||
            `Failed to fetch store details: ${response.statusText}`,
        },
        {
          status: response.status,
          headers: { "Cache-Control": "no-store" },
        }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    })
    
  } catch (error) {
    console.error('Error fetching store details:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Internal server error while fetching store details' 
      },
      { status: 500 }
    )
  }
}
