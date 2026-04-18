import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";
import { generateAvatarUrl, getAvatarColor } from "@/lib/avatar-generator";
import { dealReviews } from "@/data/reviews";

interface ReviewsSectionProps {
  deal: ComprehensiveDealDetail;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ deal }) => {
  // Get 5 reviews specific to this deal from dealReviews array
  const reviewsForDeal = dealReviews
    .filter((r) => r.dealId === deal.id)
    .slice(0, 5);

  // Fallback to deal.reviews if no dealReviews found
  const displayReviews = reviewsForDeal.length > 0 ? reviewsForDeal : deal.reviews || [];

  const averageRating =
    displayReviews && displayReviews.length > 0
      ? (
          displayReviews.reduce((sum, r: any) => sum + (r.rating || 5), 0) /
          displayReviews.length
        ).toFixed(1)
      : deal.rating.toFixed(1);

  // Generate realistic avatars based on name and detected gender
  const getReviewAvatar = (author: string, avatar?: string) => {
    return avatar || generateAvatarUrl(author);
  };

  return (
    <section id="reviews-section" className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-1">
              <h2 
                className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
                style={{
                  fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                }}
              >
                Reviews & Testimonials
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 ${
                        i < Math.floor(parseFloat(averageRating as string))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <div>
                  <span 
                    className="font-bold text-gray-900 text-lg"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    }}
                  >
                    {averageRating}/5
                  </span>
                  <span 
                    className="text-gray-600 ml-2"
                    style={{
                      fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: '14px',
                    }}
                  >
                    ({displayReviews?.length || 0} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {displayReviews && displayReviews.length > 0 ? (
          <div className="space-y-6">
            {displayReviews.map((review: any, index: number) => (
              <div
                key={review.id || index}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 hover:shadow-lg transition"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-16 h-16 shadow-md border-2 border-gray-100">
                      <AvatarImage 
                        src={getReviewAvatar(review.author, review.avatar)} 
                        alt={review.author}
                        className="object-cover"
                      />
                      <AvatarFallback 
                        className={`${getAvatarColor(review.author)} text-white font-bold text-lg`}
                      >
                        {review.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 
                        className="font-bold text-gray-900 text-lg"
                        style={{
                          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        }}
                      >
                        {review.author}
                      </h3>
                      <p 
                        className="text-gray-600 text-sm mt-1"
                        style={{
                          fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                          fontSize: '13px',
                        }}
                      >
                        {review.role}
                        {review.company && ` • ${review.company}`}
                      </p>
                    </div>
                  </div>
                  {review.date && (
                    <span 
                      className="text-gray-500 text-sm whitespace-nowrap ml-4"
                      style={{
                        fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        fontSize: '13px',
                      }}
                    >
                      {review.date}
                    </span>
                  )}
                </div>

                {/* Star Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Review Quote */}
                <p 
                  className="text-gray-700 italic leading-relaxed"
                  style={{
                    fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: '15px',
                    lineHeight: '1.6',
                  }}
                >
                  "{review.quote || "Great product and excellent service!"}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
            <p 
              className="text-gray-600"
              style={{
                fontFamily: 'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
              }}
            >
              No reviews available yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
