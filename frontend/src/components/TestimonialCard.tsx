import { Star, CheckCircle } from "lucide-react";
import { type Testimonial } from "@/data/testimonials";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const avatarUrl = testimonial.avatar;
  const reviewText = testimonial.quote;

  return (
    <article className="flex h-full w-[320px] shrink-0 flex-col rounded-[1.9rem] border border-stone-200/80 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(28,25,23,0.26)] backdrop-blur-sm transition-transform duration-200 hover:-translate-y-1 sm:w-[360px]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={testimonial.name}
              className="h-12 w-12 rounded-full object-cover ring-1 ring-stone-200 flex-shrink-0"
              loading="lazy"
            />
          )}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-stone-900">{testimonial.name}</h3>
            <p className="truncate text-xs font-medium text-stone-500">
              {testimonial.role}
            </p>
            <p className="truncate text-xs text-stone-400">{testimonial.company}</p>
          </div>
        </div>

        {testimonial.verified && (
          <div className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            <CheckCircle className="h-3.5 w-3.5" />
            Verified
          </div>
        )}
      </div>

      <div className="mb-4 flex items-center gap-2">
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
        <span className="text-xs font-medium text-stone-500">{testimonial.rating}.0/5</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {testimonial.metric && (
          <span className="inline-flex rounded-full bg-[#5c2169]/8 px-2.5 py-1 text-xs font-semibold text-[#5c2169]">
            {testimonial.metric}
          </span>
        )}
        {testimonial.outcome && (
          <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
            {testimonial.outcome}
          </span>
        )}
      </div>

      <p className="mt-1 flex-1 text-sm leading-6 text-stone-700">
        "{reviewText}"
      </p>
    </article>
  );
};

export default TestimonialCard;
