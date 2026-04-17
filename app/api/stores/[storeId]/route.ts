// app/api/stores/[storeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string }> }
) {
  const { storeId } = await params

  try {
    const response = await fetch(`${API_BASE_URL}/api/stores/${storeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-stf-org-c': '39fda25f3410a85a0fe5e2a2d81ac2c7d8c8694bf43304fe0db413e6494f024b',
      },
      next: { revalidate: 60 }
    })

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Failed to fetch store details: ${response.statusText}` 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
    
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