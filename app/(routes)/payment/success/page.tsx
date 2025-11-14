// app/payment/success/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import Logo from '@/components/svgIcons/Logo'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get parameters from URL
  const reference = searchParams.get('reference')
  const storeId = searchParams.get('store_id')
  
  const [countdown, setCountdown] = useState(10)
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // Retrieve order details from localStorage
    const savedOrder = localStorage.getItem('pending_order')
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      setOrderDetails(order)
      
      // Clear the pending order after successful payment
      localStorage.removeItem('pending_order')
    }
  }, [])

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      // Redirect when countdown reaches 0
      if (storeId) {
        router.push(`/storefront/${storeId}`)
      } else if (orderDetails?.customerDetails) {
        // Fallback: try to get storeId from order details if available
        router.push('/')
      }
    }
  }, [countdown, router, storeId, orderDetails])

  const handleRedirectNow = () => {
    if (storeId) {
      router.push(`/storefront/${storeId}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Success Card */}
        <Card className="shadow-2xl border-0">
          <CardContent className="pt-12 pb-8 px-6 md:px-12">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <CheckCircle2 className="w-24 h-24 text-green-500 relative animate-bounce" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Payment Successful! 
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Your order has been confirmed and is being processed
              </p>
            </div>

            {/* Order Details */}
            {(reference || orderDetails) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 space-y-3">
                {reference && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Payment Reference</span>
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {reference}
                    </span>
                  </div>
                )}
                {orderDetails?.orderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Order ID</span>
                    <span className="font-mono text-sm font-semibold text-gray-900 dark:text-white">
                      {orderDetails.orderId}
                    </span>
                  </div>
                )}
                {orderDetails?.total && (
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Paid</span>
                    <span className="text-lg font-bold text-green-600 dark:text-green-400">
                      ₦{orderDetails.total.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* What's Next */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3">
                <Package className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    What happens next?
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      You&apos;ll receive an email confirmation shortly
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      The vendor will process your order
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      You&apos;ll be notified when your order ships
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Countdown */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Redirecting in
                </span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400 min-w-[3rem] text-center">
                  {countdown}s
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRedirectNow}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-base"
              >
                Return to Store Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>

            {/* Contact Support */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Need help? Contact{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                support@swiftree.app
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Thank you for shopping with Swiftree! 🌳
        </p>
      </div>
    </div>
  )
}