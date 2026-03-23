// components/SubscriptionModal.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface SubscriptionModalProps {
  isOpen: boolean;
  onSubscribe: () => void;
}

export function SubscriptionModal({ isOpen, onSubscribe }: SubscriptionModalProps) {
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    const subscribeToast = toast.loading('Creating subscription...');

    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'monthly',
          isTrial: false,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create subscription');
      }

      const checkoutUrl = result.data?.checkout_url;
      
      if (!checkoutUrl) {
        throw new Error('No checkout URL received');
      }

      toast.dismiss(subscribeToast);
      toast.success('Redirecting to payment...');
      
      // Open Paystack checkout
      window.open(checkoutUrl, '_blank');
      
      // Call the onSubscribe callback
      onSubscribe();

    } catch (error) {
      console.error('Subscription error:', error);
      toast.dismiss(subscribeToast);
      toast.error(error instanceof Error ? error.message : 'Failed to create subscription');
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
       <DialogOverlay className="backdrop-blur-xs bg-[#06140033] dark:bg-black/50" />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <DialogTitle className="text-center text-2xl">
            Subscribe to Continue
          </DialogTitle>
          <DialogDescription className="text-center">
            To access your storefront and start selling, you need an active subscription.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Features */}
          <div className="bg-muted rounded-lg p-4">
            <h3 className="font-semibold mb-3">
              What you get:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Full access to your storefront</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>WhatsApp integration for orders</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Analytics and insights</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 text-primary mr-2 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Priority customer support</span>
              </li>
            </ul>
          </div>

          {/* Pricing */}
          <div className="text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              ₦5,000<span className="text-lg text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-muted-foreground">Cancel anytime</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <Button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="w-full"
              size="lg"
            >
              {isSubscribing ? 'Processing...' : 'Subscribe Now'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}