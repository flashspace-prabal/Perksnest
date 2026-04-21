/**
 * PremiumUpgradeButton - Reusable component for premium upgrade
 * Can be used on pricing page, deal detail page, or any CTA
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRazorpayPayment } from '@/lib/razorpay';
import { useAuth } from '@/lib/auth';
import { Loader2, Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PremiumUpgradeButtonProps {
  /**
   * Size of the button
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Full width button
   */
  fullWidth?: boolean;

  /**
   * Custom className
   */
  className?: string;

  /**
   * Callback on successful upgrade
   */
  onSuccess?: (user: any) => void;

  /**
   * Callback on failed upgrade
   */
  onError?: (error: string) => void;

  /**
   * Custom button text
   */
  buttonText?: string;

  /**
   * Show icon
   */
  showIcon?: boolean;
}

export default function PremiumUpgradeButton({
  size = 'md',
  fullWidth = false,
  className = '',
  onSuccess,
  onError,
  buttonText = 'Upgrade to Premium – $20',
  showIcon = true,
}: PremiumUpgradeButtonProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const { isProcessing, isLoading, handlePremiumUpgrade, error } = useRazorpayPayment(onSuccess, onError);

  // If user is already premium, show different button
  if (user?.plan === 'premium') {
    return (
      <Button disabled className={`${fullWidth ? 'w-full' : ''} ${className}`} size={size}>
        <Zap className="h-4 w-4 mr-2" />
        Already Premium ✓
      </Button>
    );
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <>
        <Button
          onClick={() => setShowLoginPrompt(true)}
          className={`${fullWidth ? 'w-full' : ''} ${className}`}
          size={size}
          variant="default"
        >
          {showIcon && <Lock className="h-4 w-4 mr-2" />}
          Sign in to Upgrade
        </Button>

        {/* Simple login prompt modal */}
        {showLoginPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-4">Sign in Required</h3>
              <p className="text-gray-600 mb-6">
                Please sign in to your PerksNest account to upgrade to Premium.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowLoginPrompt(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    navigate('/login?returnUrl=/pricing');
                  }}
                  className="flex-1"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Main upgrade button
  return (
    <Button
      onClick={handlePremiumUpgrade}
      disabled={isProcessing || isLoading}
      className={`${fullWidth ? 'w-full' : ''} ${className} bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800`}
      size={size}
    >
      {isProcessing || isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          {showIcon && <Zap className="h-4 w-4 mr-2" />}
          {buttonText}
        </>
      )}
    </Button>
  );
}
