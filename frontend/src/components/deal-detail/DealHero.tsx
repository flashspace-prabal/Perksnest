import React from "react";
import { ArrowRight, Share2, Bookmark, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { generateAvatarUrl, getAvatarColor } from "@/lib/avatar-generator";
import { DealPageReview } from "@/lib/deal-review-normalizer";
import { getReviewerAvatar } from "@/lib/reviewer-avatars";
import { generateSocialProofNames } from "@/lib/social-proof-names";

interface DealHeroProps {
  deal: ComprehensiveDealDetail;
  onClaim: () => void;
  onBookmark: () => void;
  onShare: () => void;
  isClaimed?: boolean;
  isBookmarked?: boolean;
  isLoading?: boolean;
  requireUpgrade?: boolean;
  reviews?: DealPageReview[];
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
  reviews = [],
}) => {
  const dealTestimonial = reviews[0];
  const reviewCount = reviews.length || deal.reviewCount;
  const reviewRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : deal.rating.toFixed(1);
  const redeemedCount = deal.socialProof?.redeemedCount || deal.memberCount || 15979;
  const socialProofNames = generateSocialProofNames(deal.id, 5);

  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {/* Left Column: Main Content */}
          <div className="lg:col-span-2 space-y-8 sm:space-y-10 lg:space-y-12 min-w-0">
            {/* Logo and Product Name */}
            <div className="flex flex-col min-[420px]:flex-row items-start gap-4 sm:gap-6">
              <img
                src={deal.logo}
                alt={deal.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-white border border-gray-200 shadow-sm flex-shrink-0"
              />
              <div className="pt-1 min-w-0">
                <h1 
                  className="break-anywhere text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3"
                >
                  {deal.name}
                </h1>
                <p 
                  className="text-base sm:text-lg text-gray-600 leading-7"
                >
                  {deal.title}
                </p>
              </div>
            </div>

            {/* Rich Description & Benefits */}
            <div className="space-y-8">
              <p 
                className="text-base sm:text-lg text-gray-700 leading-7 sm:leading-8 max-w-3xl"
              >
                {deal.shortDescription}
              </p>

              {/* Key Benefits */}
              {deal.general?.useCases && deal.general.useCases.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deal.general.useCases.slice(0, 4).map((useCase: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 min-w-0">
                      <span className="text-green-600 font-bold text-lg flex-shrink-0 mt-0.5">✓</span>
                      <span 
                        className="text-sm text-gray-700 leading-6"
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
              <div className="grid grid-cols-1 min-[420px]:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <p className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
                    {redeemedCount.toLocaleString()}
                  </p>
                  <p 
                    className="text-sm sm:text-base text-gray-600"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: '14px',
                    }}
                  >
                    Redeemed deals
                  </p>
                  <p 
                    className="text-xs sm:text-sm text-gray-500 mt-2"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: '12px',
                    }}
                  >
                    Verified discount • April 2026
                  </p>
                </div>

                <div className="flex flex-col justify-start">
                  <div className="flex -space-x-2 mb-3">
                    {socialProofNames.map((name, idx) => (
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
                    className="text-sm text-gray-700 font-medium"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: '14px',
                    }}
                  >
                    Join thousands of founders
                  </p>
                </div>
              </div>
            </div>

            {/* Premium Testimonial Block */}
            {dealTestimonial && (
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 sm:p-8 shadow-sm">
                <p 
                  className="text-base sm:text-lg text-gray-800 italic mb-6 leading-7"
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
                      src={getReviewerAvatar(dealTestimonial.author, dealTestimonial.avatar, `${deal.id}:hero-testimonial`)} 
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
          <div className="lg:sticky lg:top-24 h-fit min-w-0">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200 p-5 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
              {/* Deal Card Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={deal.logo}
                    alt={deal.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-contain border border-gray-100"
                  />
                  <div className="min-w-0">
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
                        {reviewRating} ({reviewCount})
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
                <p className="break-anywhere text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900">
                  {deal.dealHighlight.savings}
                </p>
                <p 
                  className="break-anywhere text-base sm:text-lg font-semibold text-gray-900 pt-2 leading-7"
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
