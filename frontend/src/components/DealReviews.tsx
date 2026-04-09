import { useState, useEffect } from 'react';
import { Star, ThumbsUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/lib/auth';
import { getReviews, getAverageRating, getUserReview, addReview, markHelpful } from '@/lib/reviews';
import { getClaimEvents } from '@/lib/store';

interface DealReviewsProps {
  dealId: string;
  dealName: string;
}

export function DealReviews({ dealId, dealName }: DealReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<import("@/lib/reviews").Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [hasUserReviewed, setHasUserReviewed] = useState(false);
  const [hasUserClaimed, setHasUserClaimed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        const userReview = await getUserReview(dealId, user.id);
        setHasUserReviewed(!!userReview);

        // Check if user has claimed this deal
        const claims = await getClaimEvents(user.id);
        const hasClaimed = claims.some(c => c.dealId === dealId && c.userId === user.id);
        setHasUserClaimed(hasClaimed);
      }
    };
    loadData();
  }, [dealId, user?.id]);

  const [avgRating, setAvgRating] = useState(0);
  const reviewCount = reviews.length;

  // Calculate rating breakdown
  const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(r => r.rating === stars).length;
    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
    return { stars, count, percentage };
  });

  const handleSubmitReview = async () => {
    if (!user || !rating || !reviewText.trim()) return;

    setIsSubmitting(true);
    try {
      const newReview = await addReview(dealId, user.id, user.name, rating, reviewText.trim());
      if (newReview) {
        setReviews([newReview, ...reviews]);
        setHasUserReviewed(true);
        setRating(0);
        setReviewText('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkHelpful = (reviewId: string) => {
    markHelpful(reviewId).then(() => {
      getReviews(dealId).then(setReviews); getAverageRating(dealId).then(setAvgRating);
    });
  };

  const maskName = (name: string) => {
    const parts = name.split(' ');
    return parts.map(part => part.charAt(0) + '***' + (part.length > 1 ? ' ' + part.split(' ').slice(1).map(p => p.charAt(0) + '***').join(' ') : '')).join(' ').replace(/\s+/g, ' ');
  };

  const renderStars = (count: number, filled: boolean = true) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className="text-lg">
        {i < count ? (filled ? '★' : '☆') : '☆'}
      </span>
    ));
  };

  return (
    <div className="space-y-6 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewCount > 0 ? (
            <div className="space-y-6">
              {/* Average Rating */}
              <div className="flex items-start gap-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-purple-600">
                    {avgRating?.toFixed(1) || '—'}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500 mt-2">
                    {renderStars(Math.round(avgRating || 0))}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                  </p>
                </div>

                {/* Rating Breakdown */}
                <div className="flex-1 space-y-2">
                  {ratingBreakdown.map(({ stars, count, percentage }) => (
                    <div key={stars} className="flex items-center gap-3">
                      <span className="text-sm w-8">{stars}★</span>
                      <Progress value={percentage} className="h-2 flex-1" />
                      <span className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="space-y-4 pt-6 border-t">
                {reviews.map(review => (
                  <div key={review.id} className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{maskName(review.userName)}</span>
                          <div className="flex items-center gap-1 text-yellow-500 text-sm">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed">{review.text}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkHelpful(review.id)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Helpful ({review.helpful})
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-4xl text-muted-foreground mb-2">☆☆☆☆☆</div>
              <p className="text-muted-foreground">No reviews yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Be the first to review {dealName}
              </p>
            </div>
          )}

          {/* Write Review Section */}
          {user && hasUserClaimed && !hasUserReviewed && (
            <div className="pt-6 border-t mt-6">
              <h3 className="font-semibold mb-4">Write a Review</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Rating</label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setRating(i + 1)}
                        onMouseEnter={() => setHoverRating(i + 1)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="text-3xl text-yellow-500 hover:scale-110 transition-transform"
                      >
                        {i < (hoverRating || rating) ? '★' : '☆'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Review</label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience with this deal..."
                    rows={4}
                    className="resize-none"
                  />
                </div>
                <Button
                  onClick={handleSubmitReview}
                  disabled={!rating || !reviewText.trim() || isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          )}

          {user && !hasUserClaimed && !hasUserReviewed && (
            <div className="pt-6 border-t mt-6">
              <p className="text-sm text-muted-foreground text-center py-4">
                You need to claim this deal before you can write a review.
              </p>
            </div>
          )}

          {user && hasUserReviewed && (
            <div className="pt-6 border-t mt-6">
              <p className="text-sm text-muted-foreground text-center py-4">
                Thank you for your review!
              </p>
            </div>
          )}

          {!user && (
            <div className="pt-6 border-t mt-6">
              <p className="text-sm text-muted-foreground text-center py-4">
                Please log in to write a review.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
