import TestimonialCard from "@/components/TestimonialCard";
import { homepageTestimonials } from "@/data/testimonials";

const firstRow = homepageTestimonials.slice(0, 5);
const secondRow = homepageTestimonials.slice(5);

const TestimonialsSection = () => {
  const rows = [
    { key: "row-one", items: firstRow, animationClass: "animate-marquee-forward" },
    { key: "row-two", items: secondRow, animationClass: "animate-marquee-reverse" },
  ];

  return (
    <section className="overflow-hidden bg-[#faf9f5] py-1">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">Testimonials</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            Trusted by founders who watch every software dollar
          </h2>
          <p className="mt-4 text-base leading-8 text-stone-600">
            Specific wins from real startup teams using PerksNest to reduce tool spend, activate credits faster, and keep more runway for product and growth.
          </p>
        </div>

        <div className="mt-12 space-y-5">
          {rows.map((row) => {
            const marqueeItems = [...row.items, ...row.items];

            return (
              <div key={row.key} className="testimonial-fade-edge group overflow-hidden">
                <div className={`flex w-max gap-5 py-2 ${row.animationClass} group-hover:[animation-play-state:paused]`}>
                  {marqueeItems.map((testimonial, index) => (
                    <TestimonialCard key={`${row.key}-${testimonial.name}-${index}`} testimonial={testimonial} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
