import React, { useState, useEffect } from "react";
import { ArrowRight, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface DealHeroProps {
  deal: ComprehensiveDealDetail;
  onClaim: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isClaimed?: boolean;
  isBookmarked?: boolean;
  isLoading?: boolean;
}

export const DealHero: React.FC<DealHeroProps> = ({
  deal,
  onClaim,
  onBookmark,
  onShare,
  isClaimed,
  isBookmarked,
  isLoading,
}) => {
  return (
    <section className=" bg-gradient-to-br from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Logo and Product Name */}
            <div className="flex items-center gap-4">
              <img
                src={deal.logo}
                alt={deal.name}
                className="w-16 h-16 rounded-lg object-cover bg-white border"
              />
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold text-slate-900">
                  {deal.name}
                </h1>
                <p className="text-lg text-slate-500 mt-2">
                  {deal.title}
                </p>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-4">
              <p className="text-xl text-slate-700 leading-relaxed">
                {deal.shortDescription}
              </p>

              {/* Social Proof */}
              <div className="flex items-center gap-6 py-4 border-y border-slate-200">
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {deal.socialProof?.redeemedCount?.toLocaleString() || 0}
                  </p>
                  <p className="text-sm text-slate-600">Redeemed deals</p>
                </div>

                {deal.socialProof?.avatars && deal.socialProof?.avatars.length > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {deal.socialProof?.avatars?.map((avatar, idx) => (
                        <Avatar key={idx} className="w-10 h-10 border-2 border-white">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="text-sm text-slate-600 ml-2">
                      Join thousands of users
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Testimonial */}
            {deal.socialProof?.testimonialQuote && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-slate-700 italic">
                  "{deal.socialProof.testimonialQuote}"
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="font-semibold text-slate-900">
                    {deal.socialProof.testimonialAuthor || "User"}
                  </span>
                  <span className="text-slate-600">
                    • {deal.socialProof.testimonialRole || "Team Member"}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Deal Card */}
          <div className="lg:sticky lg:top-20 h-fit">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
              {/* Deal Card Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={deal.logo}
                    alt={deal.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900">{deal.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-semibold text-yellow-500">
                        ★
                      </span>
                      <span className="text-sm text-slate-600">
                        {deal.rating.toFixed(1)} ({deal.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deal Values */}
              <div className="space-y-2 border-b border-slate-200 pb-6">
                <p className="text-sm text-slate-600">Save up to</p>
                <p className="text-4xl font-bold text-slate-900">
                  {deal.dealHighlight.savings}
                </p>
                <p className="text-lg font-semibold text-slate-900 mt-4">
                  {deal.dealHighlight.headline}
                </p>
              </div>

              {/* Main CTA */}
              <Button
                onClick={onClaim}
                disabled={isClaimed || isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold h-12 flex items-center justify-center gap-2"
              >
                {isClaimed ? "Deal Claimed" : "Get the deal"}
                {!isClaimed && <ArrowRight className="w-4 h-4" />}
              </Button>

              {/* Eligibility Note */}
              <p className="text-xs text-slate-600 text-center">
                All applications are manually approved by our Customer Success Team.
              </p>

              {/* Secondary Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-200">
                <button
                  onClick={onBookmark}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isBookmarked ? "fill-current text-blue-600" : "text-slate-600"
                    }`}
                  />
                  <span className="text-sm font-medium text-slate-700">Save</span>
                </button>
                <button
                  onClick={onShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg border border-slate-300 hover:bg-slate-50 transition"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
