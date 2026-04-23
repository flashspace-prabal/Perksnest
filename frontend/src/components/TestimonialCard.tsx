import { Star, CheckCircle } from "lucide-react";

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  image?: string;
  avatar?: string;
  review?: string;
  quote?: string;
  outcome?: string;
  metric?: string;
  rating: number;
  verified?: boolean;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const avatarUrl = testimonial.image || testimonial.avatar;
  const reviewText = testimonial.review || testimonial.quote;

  return (
    <article className="w-[300px] shrink-0 rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-6 shadow-[0_18px_45px_-28px_rgba(28,25,23,0.28)] backdrop-blur-sm sm:w-[340px] flex flex-col h-full">
      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < testimonial.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        {testimonial.verified && (
          <CheckCircle className="h-4 w-4 text-green-500 ml-auto" />
        )}
      </div>

      {/* Metric/Outcome */}
      {testimonial.metric && (
        <div className="mb-3">
          <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">
            {testimonial.metric}
          </span>
        </div>
      )}

      {/* Quote/Review */}
      <p className="mt-3 text-sm leading-6 text-stone-700 flex-1 mb-4">
        "{reviewText}"
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-stone-200">
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt={testimonial.name}
            className="h-10 w-10 rounded-full object-cover ring-1 ring-stone-200 flex-shrink-0"
            loading="lazy"
          />
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-bold text-stone-900">{testimonial.name}</h3>
          <p className="truncate text-xs text-stone-500">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
};

export default TestimonialCard;
