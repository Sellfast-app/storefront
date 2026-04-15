// app/api/orders/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INTERNAL_SECRET = process.env.SWIFTREE_INTERNAL_SECRET;
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

// Helper function for Mapbox geocoding
async function geocodeAddress(address: string, city: string, state: string, country: string) {
  if (!MAPBOX_ACCESS_TOKEN) {
    console.error('❌ MAPBOX_ACCESS_TOKEN is not configured');
    return null;
  }

  // Clean address — strip trailing dots, spaces, commas
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
      
      console.log(`🔍 Mapbox attempt: "${testAddress}" → features: ${data.features?.length || 0}`);
      
      if (data.features && data.features.length > 0) {
        const coordinates = data.features[0].geometry.coordinates;
        console.log('✅ Mapbox geocoding succeeded with:', testAddress);
        return {
          lat: coordinates[1],  // Mapbox returns [lng, lat]
          lng: coordinates[0]
        };
      }
    } catch (error) {
      console.error('Mapbox error for:', testAddress, error);
    }
  }
  
  return null;
}

export async function POST(request: NextRequest) {
  try {
    // Check if internal secret is configured
    if (!INTERNAL_SECRET) {
      console.error('❌ SWIFTREE_INTERNAL_SECRET is not configured');
      return NextResponse.json(
        { status: "error", message: "Server configuration error" },
        { status: 500 }
      );
    }

    const body = await request.json();
    
    console.log('🔍 Creating order with data:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!body.store_id) {
      return NextResponse.json(
        { status: "error", message: "Store ID is required" },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { status: "error", message: "Items are required and must be a non-empty array" },
        { status: 400 }
      );
    }

    if (!body.customer_info || !body.customer_info.email) {
      return NextResponse.json(
        { status: "error", message: "Customer information with email is required" },
        { status: 400 }
      );
    }

    // Prepare the payload for the backend
    let orderPayload = { ...body };

    // If delivery method is 'gig', geocode the address and add lat/lng
    if (body.delivery_method === 'gig') {
      console.log('📍 GIG delivery detected, geocoding address with Mapbox...');
      
      const customerInfo = body.customer_info;
      
      // Validate required address fields for GIG
      if (!customerInfo.address || !customerInfo.city || !customerInfo.state || !customerInfo.country) {
        return NextResponse.json(
          { 
            status: "error", 
            message: "Complete address information (address, city, state, country) is required for GIG delivery" 
          },
          { status: 400 }
        );
      }

      // Get coordinates from Mapbox
      const coordinates = await geocodeAddress(
        customerInfo.address,
        customerInfo.city,
        customerInfo.state,
        customerInfo.country
      );

      if (!coordinates) {
        // For GIG orders, coordinates are MANDATORY - block the order
        return NextResponse.json(
          { 
            status: "error", 
            message: "Could not validate your address for GIG delivery. Please ensure your address is complete and accurate.",
            details: {
              provided_address: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}, ${customerInfo.country}`
            }
          },
          { status: 400 }
        );
      }

      // Add coordinates to customer_info
      orderPayload = {
        ...body,
        customer_info: {
          ...customerInfo,
          lat: coordinates.lat,
          lng: coordinates.lng
        }
      };

      console.log('📍 Added coordinates to GIG order:', { lat: coordinates.lat, lng: coordinates.lng });
    }

    // Forward the request to your backend API
    const response = await fetch(
      `${API_BASE_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Internal-Secret": INTERNAL_SECRET,
        },
        body: JSON.stringify(orderPayload),
      }
    );

    const responseText = await response.text();
    console.log('🔍 Order creation response status:', response.status);
    console.log('🔍 Order creation response:', responseText);

    if (!response.ok) {
      let errorMessage = `Failed to create order: ${response.status}`;
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
      result = { status: "success", message: "Order created successfully" };
    }

    console.log('✅ Order created successfully:', result);
    return NextResponse.json(result);

  } 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { status: "error", message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}