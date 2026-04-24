/**
 * useRazorpayPayment - Custom hook for Razorpay payment integration
 * Handles premium upgrade workflow
 */

import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/lib/runtime';

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
  };
}

export interface UseRazorpayPaymentReturn {
  isProcessing: boolean;
  isLoading: boolean;
  handlePremiumUpgrade: () => Promise<void>;
  error: string | null;
}

/**
 * Hook to handle Razorpay payment for premium upgrade
 */
export function useRazorpayPayment(
  onSuccess?: (user: any) => void,
  onError?: (error: string) => void
): UseRazorpayPaymentReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRazorpayScript = useCallback(async (): Promise<boolean> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handlePremiumUpgrade = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Step 1: Load Razorpay script
      console.log('[PAYMENT] Loading Razorpay script...');
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay script');
      }

      // Step 2: Create order on backend
      console.log('[PAYMENT] Creating order on backend...');
      const orderResponse = await fetch(`${API_BASE_URL}/api/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': localStorage.getItem('perksnest_user_id') || '',
        },
        body: JSON.stringify({}),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.error || 'Failed to create order');
      }

      const orderData = await orderResponse.json();
      console.log('[PAYMENT] Order created:', orderData);

      if (!orderData.order_id) {
        throw new Error('No order ID received from server');
      }

      // Step 3: Get Razorpay public key from environment
      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY;
      if (!razorpayKey) {
        throw new Error('Razorpay key not configured');
      }

      // Step 4: Prepare Razorpay options
      const options: RazorpayOptions = {
        key: razorpayKey,
        amount: orderData.amount, // Amount in paise
        currency: orderData.currency || 'INR',
        name: 'PerksNest',
        description: 'Premium Membership Upgrade',
        order_id: orderData.order_id,
        prefill: {
          name: localStorage.getItem('perksnest_user_name') || 'User',
          email: localStorage.getItem('perksnest_user_email') || '',
        },
        notes: {
          purpose: 'premium_upgrade',
        },
        theme: {
          color: '#7c3aed', // Purple color matching PerksNest theme
        },
      };

      // Step 5: Open Razorpay checkout
      console.log('[PAYMENT] Opening Razorpay checkout...');
      const Razorpay = (window as any).Razorpay;

      if (!Razorpay) {
        throw new Error('Razorpay not loaded');
      }

      setIsProcessing(true);

      const razorpayInstance = new Razorpay({
        ...options,
        handler: async (response: any) => {
          try {
            console.log('[PAYMENT] Payment handler called:', {
              payment_id: response.razorpay_payment_id,
              order_id: response.razorpay_order_id,
            });

            // Step 6: Verify payment on backend
            setIsProcessing(true);
            const verifyResponse = await fetch(`${API_BASE_URL}/api/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'x-user-id': localStorage.getItem('perksnest_user_id') || '',
              },
              body: JSON.stringify({
                payment_id: response.razorpay_payment_id,
                order_id: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json();
              throw new Error(errorData.error || 'Payment verification failed');
            }

            const verifyData = await verifyResponse.json();
            console.log('[PAYMENT] Payment verified successfully');

            if (verifyData.notification) {
              window.dispatchEvent(
                new CustomEvent('perksnest:notification-created', {
                  detail: { notification: verifyData.notification },
                })
              );
            }

            // Step 7: Success - update user data and redirect
            toast.success('Premium Activated 🎉', {
              description: 'You now have access to all premium deals.',
            });
            
            // Update user in localStorage for quick UI update
            if (verifyData.user) {
              localStorage.setItem('perksnest_user_plan', 'premium');
            }

            // Call success callback
            if (onSuccess) {
              onSuccess(verifyData.user);
            }

            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
              window.location.href = '/customer';
            }, 1500);
          } catch (verifyError) {
            const errorMsg = verifyError instanceof Error ? verifyError.message : 'Payment verification failed';
            console.error('[PAYMENT] Verification error:', errorMsg);
            setError(errorMsg);
            toast.error(`❌ ${errorMsg}`);
            if (onError) {
              onError(errorMsg);
            }
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('[PAYMENT] Checkout closed by user');
            setIsProcessing(false);
            toast.info('Payment cancelled');
          },
        },
      });

      razorpayInstance.open();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Payment failed';
      console.error('[PAYMENT] Error:', errorMsg);
      setError(errorMsg);
      setIsProcessing(false);
      toast.error(`❌ ${errorMsg}`);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [loadRazorpayScript, onSuccess, onError]);

  return {
    isProcessing,
    isLoading,
    handlePremiumUpgrade,
    error,
  };
}

/**
 * Direct function to create order (for API calls)
 */
export async function createPaymentOrder(): Promise<{ order_id: string; amount: number; currency: string }> {
  const response = await fetch(`${API_BASE_URL}/api/create-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': localStorage.getItem('perksnest_user_id') || '',
    },
    body: JSON.stringify({}),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  return response.json();
}

/**
 * Direct function to verify payment (for API calls)
 */
export async function verifyPayment(
  paymentId: string,
  orderId: string,
  signature: string
): Promise<{ success: boolean; user?: any }> {
  const response = await fetch(`${API_BASE_URL}/api/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-id': localStorage.getItem('perksnest_user_id') || '',
    },
    body: JSON.stringify({
      payment_id: paymentId,
      order_id: orderId,
      signature,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Payment verification failed');
  }

  return response.json();
}
