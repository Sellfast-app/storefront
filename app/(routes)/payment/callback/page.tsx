// app/payment/callback/page.tsx
'use client'

import React, { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function PaymentCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from Paystack
        const reference = searchParams.get('reference')
        const trxref = searchParams.get('trxref')
        
        if (!reference && !trxref) {
          console.error('No payment reference found in URL')
          router.push('/payment/failed?error=no_reference')
          return
        }

        // Use reference or trxref
        const paymentReference = reference || trxref
        
        console.log('🔄 Processing payment callback:', paymentReference)
        
        // Get store ID from localStorage
        const storeId = localStorage.getItem('current_store_id') || ''
        
        // Call server-side verification API
        const verifyResponse = await fetch('/api/payments/verify/server', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            reference: paymentReference,
            storeId: storeId 
          })
        })

        const result = await verifyResponse.json()
        console.log('✅ Verification result:', result)
        
        // Redirect based on verification result
        if (result.redirectTo) {
          let redirectUrl = result.redirectTo
          
          // Add store_id if available
          if (storeId) {
            redirectUrl += `?store_id=${storeId}`
          }
          
          // Add reference if available
          if (paymentReference) {
            redirectUrl += `${storeId ? '&' : '?'}reference=${paymentReference}`
          }
          
          // Add any additional query params from verification
          if (result.queryParams) {
            redirectUrl += `${storeId || paymentReference ? '&' : '?'}${result.queryParams}`
          }
          
          // Clean up localStorage on success
          if (result.redirectTo === '/payment/success') {
            localStorage.removeItem('pending_order')
            localStorage.removeItem('payment_reference')
            // Keep store ID for now, it might be needed for "continue shopping"
          }
          
          console.log('🔄 Redirecting to:', redirectUrl)
          router.push(redirectUrl)
        } else {
          // Fallback redirect with store ID if available
          const fallbackUrl = `/payment/failed?reference=${paymentReference}${storeId ? `&store_id=${storeId}` : ''}`
          router.push(fallbackUrl)
        }
        
      } catch (error) {
        console.error('Callback processing error:', error)
        const storeId = localStorage.getItem('current_store_id') || ''
        router.push(`/payment/failed?error=callback_error${storeId ? `&store_id=${storeId}` : ''}`)
      }
    }

    handleCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="text-center max-w-md p-8">
        <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          Processing Payment...
        </h1>
        <p className="text-gray-600 mb-2">
          Please wait while we verify your payment.
        </p>
        <p className="text-sm text-gray-500">
          This will only take a moment.
        </p>
      </div>
    </div>
  )
}