// app/api/orders/food/create/route.ts
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
    console.log('🍔 Creating food order:', JSON.stringify(body, null, 2));

    let orderPayload = { ...body };

    if (body.delivery_method === 'gig') {
      const customerInfo = body.customer_info;
      if (!customerInfo?.address || !customerInfo?.city || !customerInfo?.state || !customerInfo?.country) {
        return NextResponse.json(
          { status: "error", message: "Complete address information is required for GIG delivery" },
          { status: 400 }
        );
      }

      const coordinates = await geocodeAddress(
        customerInfo.address, customerInfo.city, customerInfo.state, customerInfo.country
      );

      if (!coordinates) {
        return NextResponse.json(
          { status: "error", message: "Could not validate your address for GIG delivery. Please ensure it is complete and accurate." },
          { status: 400 }
        );
      }

      orderPayload = {
        ...body,
        customer_info: { ...customerInfo, lat: coordinates.lat, lng: coordinates.lng }
      };
    }

    const response = await fetch(`${API_BASE_URL}/api/orders/food/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Secret": INTERNAL_SECRET,
      },
      body: JSON.stringify(orderPayload),
    });

    const responseText = await response.text();
    console.log('📥 Food order response status:', response.status);
    console.log('📥 Food order response:', responseText);

    if (!response.ok) {
      let errorMessage = `Failed to create food order: ${response.status}`;
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
      result = { status: "success", message: "Food order created successfully" };
    }

    console.log('✅ Food order created:', JSON.stringify(result, null, 2));
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error creating food order:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}