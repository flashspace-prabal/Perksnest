import React from "react";
import { Star } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ComprehensiveDealDetail } from "@/data/deal-details-schema";

interface ReviewsSectionProps {
  deal: ComprehensiveDealDetail;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({ deal }) => {
  const averageRating =
    deal.reviews && deal.reviews.length > 0
      ? (
          deal.reviews.reduce((sum, r) => sum + r.rating, 0) /
          deal.reviews.length
        ).toFixed(1)
      : deal.rating.toFixed(1);

  return (
    <section id="reviews-section" className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">
                {deal.name} Reviews
              </h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(parseFloat(averageRating as string))
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-bold text-slate-900">
                  {averageRating}/5
                </span>
                <span className="text-slate-600">
                  ({deal.reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {deal.reviews && deal.reviews.length > 0 ? (
          <div className="space-y-6">
            {deal.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-lg p-8 border border-slate-200"
              >
                {/* Review Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={review.avatar} />
                      <AvatarFallback>{review.author[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {review.author}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {review.role}
                        {review.company && ` • ${review.company}`}
                      </p>
                    </div>
                  </div>
                  {review.date && (
                    <span className="text-sm text-slate-500">{review.date}</span>
                  )}
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-slate-700 leading-relaxed italic">
                  "{review.quote}"
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center border border-slate-200">
            <p className="text-slate-600">No reviews available yet</p>
          </div>
        )}
      </div>
    </section>
  );
};
