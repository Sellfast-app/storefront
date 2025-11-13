import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = "https://api.swiftree.app";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ storeId: string; productId: string }> }
) {
  // Await the params Promise
  const { storeId, productId } = await params

  try {
    // Fetch all products and find the specific one
    const response = await fetch(
      `${API_BASE_URL}/api/products/store/global/${storeId}?page=1&pageSize=100&status=ready`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }
      }
    )

    if (!response.ok) {
      return NextResponse.json(
        { 
          status: 'error', 
          message: `Failed to fetch products: ${response.statusText}` 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Find the specific product by ID
    if (data.status === 'success' && data.data && data.data.items) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = data.data.items.find((p: any) => p.id === productId)
      
      if (product) {
        return NextResponse.json(
          {
            status: 'success',
            message: 'Product retrieved successfully',
            data: product
          },
          { status: 200 }
        )
      } else {
        return NextResponse.json(
          { 
            status: 'error', 
            message: 'Product not found' 
          },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Failed to fetch product' 
      },
      { status: 500 }
    )
    
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { 
        status: 'error', 
        message: 'Internal server error while fetching product' 
      },
      { status: 500 }
    )
  }
}