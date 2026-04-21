import React, { useState, useEffect } from "react";
import { ArrowRight, Share2, Bookmark, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { generateAvatarUrl, getAvatarColor } from "@/lib/avatar-generator";
import { generateSocialProofNames } from "@/lib/social-proof-names";
import { dealReviews } from "@/data/reviews";

interface DealHeroProps {
  deal: ComprehensiveDealDetail;
  onClaim: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isClaimed?: boolean;
  isBookmarked?: boolean;
  isLoading?: boolean;
  requireUpgrade?: boolean;
}

export const DealHero: React.FC<DealHeroProps> = ({
  deal,
  onClaim,
  onBookmark,
  onShare,
  isClaimed,
  isBookmarked,
  isLoading,
  requireUpgrade,
}) => {
  // Get the first review for this deal to use as testimonial
  const dealTestimonial = dealReviews.find((r) => r.dealId === deal.id);

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Logo and Product Name */}
            <div className="flex items-start gap-6">
              <img
                src={deal.logo}
                alt={deal.name}
                className="w-20 h-20 rounded-2xl object-cover bg-white border border-gray-200 shadow-sm flex-shrink-0"
              />
              <div className="pt-1">
                <h1 
                  className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-3"
                  style={{
                    fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: '48px',
                    lineHeight: '1.2',
                  }}
                >
                  {deal.name}
                </h1>
                <p 
                  className="text-xl text-gray-600"
                  style={{
                    fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: '16px',
                    fontWeight: '400',
                  }}
                >
                  {deal.title}
                </p>
              </div>
            </div>

            {/* Rich Description & Benefits */}
            <div className="space-y-8">
              <p 
                className="text-lg text-gray-700 leading-relaxed max-w-2xl"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                  fontSize: '16px',
                  lineHeight: '1.6',
                }}
              >
                {deal.shortDescription}
              </p>

              {/* Key Benefits */}
              {deal.general?.useCases && deal.general.useCases.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deal.general.useCases.slice(0, 4).map((useCase: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <span className="text-green-600 font-bold text-lg flex-shrink-0 mt-0.5">✓</span>
                      <span 
                        className="text-gray-700"
                        style={{
                          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                          fontSize: '14px',
                        }}
                      >
                        {useCase}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Social Proof - Enhanced */}
            <div className="border-t border-b border-gray-200 py-8">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-5xl font-bold text-gray-900 mb-2">
                    {deal.socialProof?.redeemedCount?.toLocaleString() || '15,979'}
                  </p>
                  <p 
                    className="text-gray-600"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: '14px',
                    }}
                  >
                    Redeemed deals
                  </p>
                  <p 
                    className="text-sm text-gray-500 mt-2"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: '12px',
                    }}
                  >
                    Verified discount • April 2026
                  </p>
                </div>

                {deal.socialProof?.avatars && deal.socialProof?.avatars.length > 0 && (
                  <div className="flex flex-col justify-start">
                    <div className="flex -space-x-2 mb-3">
                      {/* Generate real people avatars for social proof based on deal */}
                      {generateSocialProofNames(deal.id, 5).map((name, idx) => (
                        <Avatar key={idx} className="w-12 h-12 border-2 border-white shadow-md">
                          <AvatarImage 
                            src={generateAvatarUrl(name)} 
                            alt={name}
                            className="object-cover"
                          />
                          <AvatarFallback>{name.split(" ")[0][0]}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <p 
                      className="text-gray-700 font-medium"
                      style={{
                        fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontSize: '14px',
                      }}
                    >
                      Join thousands of founders
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Testimonial Block */}
            {dealTestimonial && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 shadow-sm">
                <p 
                  className="text-lg text-gray-800 italic mb-6 leading-relaxed"
                  style={{
                    fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.6',
                  }}
                >
                  "{dealTestimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 shadow-md border-2 border-blue-200 flex-shrink-0">
                    <AvatarImage 
                      src={generateAvatarUrl(dealTestimonial.author)} 
                      alt={dealTestimonial.author}
                      className="object-cover"
                    />
                    <AvatarFallback 
                      className={`${getAvatarColor(dealTestimonial.author)} text-white font-bold`}
                    >
                      {dealTestimonial.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p 
                      className="font-bold text-gray-900"
                      style={{
                        fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontSize: '15px',
                      }}
                    >
                      {dealTestimonial.author}
                    </p>
                    <p 
                      className="text-gray-600"
                      style={{
                        fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontSize: '13px',
                      }}
                    >
                      {dealTestimonial.role}
                      {dealTestimonial.company && ` • ${dealTestimonial.company}`}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Deal Card - Premium Edition */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-8 space-y-8">
              {/* Deal Card Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={deal.logo}
                    alt={deal.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100"
                  />
                  <div>
                    <h3 
                      className="font-bold text-gray-900"
                      style={{
                        fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontSize: '15px',
                      }}
                    >
                      {deal.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-yellow-500">★</span>
                      <span 
                        className="text-gray-700"
                        style={{
                          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                          fontSize: '13px',
                        }}
                      >
                        {deal.rating.toFixed(1)} ({deal.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Deal Values - Premium Highlight */}
              <div className="space-y-3 border-b border-gray-100 pb-8">
                <p 
                  className="text-sm text-gray-600 uppercase tracking-wide font-semibold"
                  style={{
                    fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: '12px',
                  }}
                >
                  Save up to
                </p>
                <p className="text-5xl font-bold text-gray-900">
                  {deal.dealHighlight.savings}
                </p>
                <p 
                  className="text-lg font-semibold text-gray-900 pt-2"
                  style={{
                    fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: '16px',
                  }}
                >
                  {deal.dealHighlight.headline}
                </p>
              </div>

              {/* Main CTA - Premium Button */}
              {requireUpgrade ? (
                <Button
                  onClick={onClaim}
                  className="w-full bg-[#5c2169] text-white py-3 rounded-lg font-semibold h-12 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
                >
                  <Lock className="w-4 h-4" />
                  Upgrade to Access Deal
                </Button>
              ) : (
                <Button
                  onClick={onClaim}
                  disabled={isClaimed || isLoading}
                  className="w-full bg-[#5c2169] text-white py-3 rounded-lg font-semibold h-12 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition"
                >
                  {isClaimed ? "✓ Deal Claimed" : "Get deal for free"}
                  {!isClaimed && <ArrowRight className="w-4 h-4" />}
                </Button>
              )}

              {/* Eligibility Note */}
              <p 
                className="text-xs text-gray-600 text-center leading-relaxed"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                  fontSize: '12px',
                }}
              >
                All applications are manually approved by our Customer Success Team.
              </p>

              {/* Secondary Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <button
                  onClick={onBookmark}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      isBookmarked ? "fill-current text-blue-600" : "text-gray-600"
                    }`}
                  />
                  <span 
                    className="text-sm font-medium text-gray-700"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    }}
                  >
                    Save
                  </span>
                </button>
                <button
                  onClick={onShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
                >
                  <Share2 className="w-4 h-4 text-gray-600" />
                  <span 
                    className="text-sm font-medium text-gray-700"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    }}
                  >
                    Share
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
