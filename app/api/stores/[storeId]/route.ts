// app/api/stores/[storeId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = "https://api.swiftree.app";

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