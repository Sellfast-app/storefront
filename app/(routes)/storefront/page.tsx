// app/storefront/page.tsx
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function StorefrontIndex() {
  const router = useRouter()

  // You can set a default store ID here or redirect to a store selection page
  const DEFAULT_STORE_ID = 'e4a18e22-b3c4-4af9-9fd0-baf5ae22b2f1'

  useEffect(() => {
    // Automatically redirect to default store after 2 seconds
    const timer = setTimeout(() => {
      router.push(`/storefront/${DEFAULT_STORE_ID}`)
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className='flex items-center justify-center h-screen bg-[#FCFCFC]'>
      <div className='text-center max-w-md px-6'>
        <div className='animate-pulse mb-6'>
          <div className='w-20 h-20 bg-[#4FCA6A] rounded-full mx-auto mb-4 flex items-center justify-center'>
            <svg className='w-10 h-10 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' />
            </svg>
          </div>
        </div>
        <h2 className='text-2xl font-bold mb-4'>Welcome to Swiftree Storefront</h2>
        <p className='text-gray-600 mb-6'>Redirecting to store...</p>
        <Button 
          onClick={() => router.push(`/storefront/${DEFAULT_STORE_ID}`)}
          className='bg-[#4FCA6A] hover:bg-[#45b85e]'
        >
          Go to Store Now
        </Button>
        <p className='text-sm text-gray-500 mt-4'>
          Looking for a specific store? Use the full URL with store ID.
        </p>
      </div>
    </div>
  )
}