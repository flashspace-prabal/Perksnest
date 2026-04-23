import React from "react";
import { Loader2, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarColor } from "@/lib/avatar-generator";
import { DealPageReview } from "@/lib/deal-review-normalizer";

interface ReviewsSectionProps {
  reviews: DealPageReview[];
  isLoading?: boolean;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  isLoading = false,
}) => {
  const averageRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <section id="reviews-section" className="py-20 bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <div className="flex items-start gap-6 mb-8">
            <div className="flex-1">
              <h2
                className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
                style={{
                  fontFamily:
                    'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                }}
              >
                Reviews & Testimonials
              </h2>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-6 h-6 ${
                        index < Math.floor(Number(averageRating))
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
                      fontFamily:
                        'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    }}
                  >
                    {averageRating}/5
                  </span>
                  <span
                    className="text-gray-600 ml-2"
                    style={{
                      fontFamily:
                        'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: "14px",
                    }}
                  >
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
            <Loader2 className="w-6 h-6 animate-spin text-[#5c2169] mx-auto mb-4" />
            <p className="text-gray-600">Loading customer reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#caa8d1] hover:shadow-lg transition duration-200"
              >
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <Avatar className="w-16 h-16 shadow-md border-2 border-gray-100">
                      <AvatarImage src={review.avatar} alt={review.author} className="object-cover" />
                      <AvatarFallback className={`${getAvatarColor(review.author)} text-white font-bold text-lg`}>
                        {review.author[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <h3
                        className="font-bold text-gray-900 text-lg"
                        style={{
                          fontFamily:
                            'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                        }}
                      >
                        {review.author}
                      </h3>
                      <p
                        className="text-gray-600 text-sm mt-1 truncate"
                        style={{
                          fontFamily:
                            'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                          fontSize: "13px",
                        }}
                      >
                        {review.role}
                        {review.company ? ` • ${review.company}` : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-gray-500 text-sm whitespace-nowrap"
                    style={{
                      fontFamily:
                        'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                      fontSize: "13px",
                    }}
                  >
                    {review.date}
                  </span>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-4 h-4 ${
                        index < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>

                <p
                  className="text-gray-700 italic leading-relaxed"
                  style={{
                    fontFamily:
                      'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
                    fontSize: "15px",
                    lineHeight: "1.6",
                  }}
                >
                  "{review.quote}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-2xl p-12 text-center border border-gray-200">
            <p
              className="text-gray-600"
              style={{
                fontFamily:
                  'Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
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
