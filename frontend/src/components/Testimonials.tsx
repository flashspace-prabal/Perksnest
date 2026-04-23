import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, CheckCircle } from "lucide-react";
import { allTestimonials } from "@/data/testimonials";

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + allTestimonials.length) % allTestimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % allTestimonials.length);
  };

  const currentTestimonial = allTestimonials[currentIndex];

  return (
    <section className="py-20 gradient-slack">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Startups scale faster with PerksNest
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join 5,000+ verified startups who've saved millions with exclusive SaaS deals
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 p-3 rounded-full bg-card border border-border shadow-lg hover:bg-secondary transition-colors z-10"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 p-3 rounded-full bg-card border border-border shadow-lg hover:bg-secondary transition-colors z-10"
          >
            <ChevronRight className="h-5 w-5 text-foreground" />
          </button>

          {/* Testimonial Card */}
          <div className="bg-card rounded-2xl border border-border p-8 md:p-12 shadow-lg">
            <div className="flex flex-col items-center text-center">
              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < currentTestimonial.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Quote Text */}
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-6 max-w-2xl">
                "{currentTestimonial.quote}"
              </blockquote>

              {/* Outcome Metric */}
              <div className="mb-6 px-4 py-2 bg-primary/10 rounded-lg">
                <p className="text-sm font-semibold text-primary">
                  📊 {currentTestimonial.outcome}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 justify-center">
                <img
                  src={currentTestimonial.avatar}
                  alt={currentTestimonial.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-foreground">
                      {currentTestimonial.name}
                    </div>
                    {currentTestimonial.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentTestimonial.role}, {currentTestimonial.company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {allTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentIndex(index);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-border w-2.5 hover:bg-muted-foreground/50"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;