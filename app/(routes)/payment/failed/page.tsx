// app/payment/failed/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { XCircle, ArrowLeft, RefreshCcw } from 'lucide-react'
import Logo from '@/components/svgIcons/Logo'

export default function PaymentFailedPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const reference = searchParams.get('reference')
  const storeId = searchParams.get('store_id')
  
  const [countdown, setCountdown] = useState(15)
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orderDetails, setOrderDetails] = useState<any>(null)

  useEffect(() => {
    // Retrieve order details from localStorage
    const savedOrder = localStorage.getItem('pending_order')
    if (savedOrder) {
      const order = JSON.parse(savedOrder)
      setOrderDetails(order)
      // Don't clear pending order - they might retry
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
      // Redirect to store
      if (storeId) {
        router.push(`/storefront/${storeId}`)
      } else {
        router.push('/')
      }
    }
  }, [countdown, router, storeId])

  const handleRetryPayment = () => {
    if (storeId) {
      router.push(`/storefront/${storeId}/checkout`)
    } else {
      router.push('/')
    }
  }

  const handleReturnToStore = () => {
    if (storeId) {
      router.push(`/storefront/${storeId}`)
    } else {
      router.push('/')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        {/* Failed Card */}
        <Card className="shadow-2xl border-0">
          <CardContent className="pt-12 pb-8 px-6 md:px-12">
            {/* Failed Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-red-400 rounded-full blur-xl opacity-50"></div>
                <XCircle className="w-24 h-24 text-red-500 relative animate-bounce" />
              </div>
            </div>

            {/* Failed Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                Payment Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                We couldn&apos;t process your payment. Please try again.
              </p>
            </div>

            {/* Possible Reasons */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Common reasons for payment failure:
              </h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                  Insufficient funds in your account
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                  Incorrect card details or expired card
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                  Payment was cancelled
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full"></div>
                  Network connectivity issues
                </li>
              </ul>
            </div>

            {/* Order Details */}
            {(reference || orderDetails) && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 space-y-3">
                {reference && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Transaction Reference</span>
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
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₦{orderDetails.total.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Countdown */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-full">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Redirecting to store in
                </span>
                <span className="text-2xl font-bold text-red-600 dark:text-red-400 min-w-[3rem] text-center">
                  {countdown}s
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRetryPayment}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-6 text-base"
              >
                <RefreshCcw className="mr-2 w-5 h-5" />
                Try Again
              </Button>
              <Button
                onClick={handleReturnToStore}
                variant="outline"
                className="flex-1 py-6 text-base"
              >
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back to Store
              </Button>
            </div>

            {/* Contact Support */}
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
              Still having issues?{' '}
              <a href="#" className="text-green-600 hover:text-green-700 font-medium">
                Contact Support
              </a>
            </p>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Your cart items are still saved. You can complete your purchase anytime.
        </p>
      </div>
    </div>
  )
}