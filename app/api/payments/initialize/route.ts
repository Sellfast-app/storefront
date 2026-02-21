// app/api/payments/initialize/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const INTERNAL_SECRET = process.env.SWIFTREE_INTERNAL_SECRET;

export async function POST(request: NextRequest) {
  try {
    // Check if internal secret is configured
    if (!INTERNAL_SECRET) {
      console.error('❌ SWIFTREE_INTERNAL_SECRET is not configured')
      return NextResponse.json(
        {
          status: 'error',
          message: 'Server configuration error'
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    
    console.log('💰 Payment initialization request body:', body)
    
    // Get auth token from request headers (if user is logged in)
    const authToken = request.headers.get('authorization')
    
    const {
      store_id,
      email,
      amount,
      currency = 'NGN',
      order_id,
      items_total,
      delivery_fee,
      platform_fee_percent = 3
    } = body

    // Validate required fields
    if (!store_id || !email || !amount || !order_id || !items_total || !delivery_fee) {
      console.log('❌ Missing required fields:', {
        store_id, email, amount, order_id, items_total, delivery_fee
      })
      return NextResponse.json(
        {
          status: 'error',
          message: 'Missing required fields'
        },
        { status: 400 }
      )
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Internal-Secret': INTERNAL_SECRET, // Add internal secret here
    }

    // Add auth token if provided (for logged-in users)
    if (authToken) {
      headers['Authorization'] = authToken
    }

    const payload = {
      store_id,
      email,
      amount: Math.round(amount), // Ensure amount is integer
      currency,
      order_id,
      items_total: Math.round(items_total),
      delivery_fee: Math.round(delivery_fee),
      platform_fee_percent
    }

    console.log('💰 Sending payload to Swiftree API:', payload)

    const response = await fetch(
      `${API_BASE_URL}/api/payments/initialize`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      }
    )

    console.log('💰 Swiftree API response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Swiftree API error response:', errorText)
      
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch {
        errorData = { message: errorText }
      }
      
      return NextResponse.json(
        {
          status: 'error',
          message: errorData.message || `HTTP error! status: ${response.status}`
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('✅ Swiftree API success response:', data)
    
    return NextResponse.json(data, { status: 200 })
    
  } catch (error) {
    console.error('❌ Error initializing payment:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Internal server error while initializing payment'
      },
      { status: 500 }
    )
  }
}