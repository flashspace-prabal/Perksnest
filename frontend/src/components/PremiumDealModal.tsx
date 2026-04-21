import React from "react";
import { X, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PremiumDealModalProps {
  isOpen: boolean;
  dealName?: string;
  onClose: () => void;
  onUpgrade: () => void;
  isLoading?: boolean;
}

export const PremiumDealModal: React.FC<PremiumDealModalProps> = ({
  isOpen,
  dealName = "This deal",
  onClose,
  onUpgrade,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>

          <Lock className="w-12 h-12 text-white mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-white">Premium Deal</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-8 space-y-6">
          <div className="space-y-3">
            <p className="text-gray-700 leading-relaxed">
              <span className="font-semibold">{dealName}</span> is exclusively available for premium members.
            </p>
            <p className="text-gray-600 text-sm">
              Upgrade to access exclusive deals, unlock additional benefits, and grow your startup faster.
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-purple-50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-semibold text-gray-900 mb-3">Premium Perks:</p>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">✓</span>
                <span>Access to exclusive premium deals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">✓</span>
                <span>Priority support and resources</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-1">✓</span>
                <span>Unlock hidden opportunities</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Later
            </button>
            <Button
              onClick={onUpgrade}
              disabled={isLoading}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white gap-2"
            >
              Upgrade Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
