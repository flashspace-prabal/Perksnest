import { Star } from "lucide-react";

export interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  review: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <article className="w-[300px] shrink-0 rounded-[1.75rem] border border-stone-200/80 bg-white/95 p-5 shadow-[0_18px_45px_-28px_rgba(28,25,23,0.28)] backdrop-blur-sm sm:w-[340px]">
      <div className="flex items-center gap-3">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="h-12 w-12 rounded-full object-cover ring-1 ring-stone-200"
          loading="lazy"
        />
        <div className="min-w-0">
          <h3 className="truncate text-sm font-bold text-stone-900">{testimonial.name}</h3>
          <p className="truncate text-sm text-stone-500">
            {testimonial.role} at {testimonial.company}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-amber-500">
        {Array.from({ length: 5 }).map((_, index) => (
          <Star key={index} className="h-4 w-4 fill-current" />
        ))}
      </div>

      <p className="mt-4 text-sm leading-7 text-stone-700">{testimonial.review}</p>
    </article>
  );
};

export default TestimonialCard;
