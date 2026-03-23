// hooks/useSubscriptionCheck.ts
import { useEffect, useState } from 'react';

const MODAL_DISMISSED_KEY = 'subscription_modal_dismissed';
const MODAL_DISMISSED_TIMESTAMP = 'subscription_modal_dismissed_at';
const DISMISS_DURATION = 24 * 60 * 60 * 1000;

interface UseSubscriptionCheckReturn {
  showModal: boolean;
  isLoading: boolean;
  hasActiveSubscription: boolean;
  dismissModal: () => void;
  checkSubscription: () => Promise<void>;
}

export function useSubscriptionCheck(vendorId?: string): UseSubscriptionCheckReturn {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);

  const checkSubscription = async () => {
    // Don't run until we have a vendorId
    if (!vendorId) {
      console.log('⏳ Waiting for vendorId before checking subscription...');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🔍 Checking subscription status for vendor:', vendorId);

      const response = await fetch('/api/subscription/check');
      const result = await response.json();

      console.log('📥 Subscription check result:', result);

      const isActive = result.hasActiveSubscription === true;
      setHasActiveSubscription(isActive);

      if (isActive) {
        console.log('✅ User has active subscription');
        setShowModal(false);
        localStorage.removeItem(MODAL_DISMISSED_KEY);
        localStorage.removeItem(MODAL_DISMISSED_TIMESTAMP);
      } else {
        console.log('❌ No active subscription found');

        const dismissed = localStorage.getItem(MODAL_DISMISSED_KEY);
        const dismissedAt = localStorage.getItem(MODAL_DISMISSED_TIMESTAMP);

        if (dismissed === 'true' && dismissedAt) {
          const dismissedTime = parseInt(dismissedAt, 10);
          const now = Date.now();

          if (now - dismissedTime < DISMISS_DURATION) {
            console.log('⏰ Modal dismissed recently, not showing');
            setShowModal(false);
          } else {
            console.log('⏰ Dismissal expired, showing modal');
            setShowModal(true);
            localStorage.removeItem(MODAL_DISMISSED_KEY);
            localStorage.removeItem(MODAL_DISMISSED_TIMESTAMP);
          }
        } else {
          console.log('📢 Showing subscription modal');
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setShowModal(false);
    } finally {
      setIsLoading(false);
    }
  };

  const dismissModal = () => {
    console.log('👋 User dismissed subscription modal');
    setShowModal(false);
    localStorage.setItem(MODAL_DISMISSED_KEY, 'true');
    localStorage.setItem(MODAL_DISMISSED_TIMESTAMP, Date.now().toString());
  };

  // Re-run whenever vendorId becomes available
  useEffect(() => {
    checkSubscription();
  }, [vendorId]);

  return {
    showModal,
    isLoading,
    hasActiveSubscription,
    dismissModal,
    checkSubscription,
  };
}