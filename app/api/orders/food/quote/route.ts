// app/api/orders/food/quote/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INTERNAL_SECRET = process.env.SWIFTREE_INTERNAL_SECRET;
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

async function geocodeAddress(address: string, city: string, state: string, country: string) {
  if (!MAPBOX_ACCESS_TOKEN) return null;

  const cleanAddress = address.replace(/[.,\s]+$/, '').trim();
  const addressVariations = [
    `${cleanAddress}, ${city}, ${state}, ${country}`,
    `${cleanAddress}, ${city}, ${state}`,
    `${cleanAddress}, ${city}`,
    `${city}, ${state}, ${country}`,
  ];

  for (const testAddress of addressVariations) {
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(testAddress)}&access_token=${MAPBOX_ACCESS_TOKEN}&limit=1&country=${country}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        return { lat: coordinates[1], lng: coordinates[0] };
      }
    } catch (error) {
      console.error('Mapbox error for:', testAddress, error);
    }
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    if (!INTERNAL_SECRET) {
      return NextResponse.json(
        { status: "error", message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('🍔 Fetching food delivery quote for:', body.delivery_method);

    let quotePayload = { ...body };

    // 🔑 FIX: Add relay to the geocoding condition
    if (body.delivery_method === 'gig' || body.delivery_method === 'relay') {
      const customerInfo = body.customer_info;
      if (!customerInfo?.address || !customerInfo?.city || !customerInfo?.state || !customerInfo?.country) {
        return NextResponse.json(
          { status: "error", message: "Complete address information is required for delivery quote" },
          { status: 400 }
        );
      }

      const coordinates = await geocodeAddress(
        customerInfo.address, customerInfo.city, customerInfo.state, customerInfo.country
      );

      if (!coordinates) {
        return NextResponse.json(
          { status: "error", message: "Could not validate your address. Please ensure it is complete and accurate." },
          { status: 400 }
        );
      }

      quotePayload = {
        ...body,
        customer_info: { ...customerInfo, lat: coordinates.lat, lng: coordinates.lng }
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/food/quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify(quotePayload),
    });

    const responseText = await response.text();
    console.log('📥 Food quote response status:', response.status);
    console.log('📥 Food quote response:', responseText);

    if (!response.ok) {
      let errorMessage = `Failed to get quote: ${response.status}`;
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

    const result = JSON.parse(responseText);
    return NextResponse.json(result);

  }    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Food quote error:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}