import { useState, useEffect } from "react";
import { Star, CheckCircle } from "lucide-react";
import { authentictestimonials } from "@/data/testimonials";

const TestimonialsCarousel = () => {
  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container-wide">
        
        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-2xl border border-primary/10">
            <span className="text-4xl md:text-5xl font-bold text-primary mb-2">100+</span>
            <span className="text-muted-foreground font-medium">Exclusive Deals</span>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-success/5 rounded-2xl border border-success/10">
            <span className="text-4xl md:text-5xl font-bold text-success mb-2">$2M+</span>
            <span className="text-muted-foreground font-medium">Savings Unlocked</span>
          </div>
          <div className="flex flex-col items-center justify-center p-8 bg-accent/5 rounded-2xl border border-accent/10">
            <span className="text-4xl md:text-5xl font-bold text-accent mb-2">5,000+</span>
            <span className="text-muted-foreground font-medium">Startups Joined</span>
          </div>
        </div>

        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why should I trust this?
          </h2>
          <p className="text-muted-foreground text-lg">
            Don't just take our word for it. Hear from founders who are growing faster and spending less with PerksNest.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {authentictestimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
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
                  <div className="flex items-center gap-1 ml-auto">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-semibold text-green-600">Verified</span>
                  </div>
                )}
              </div>

              {/* Outcome Badge */}
              <div className="mb-4">
                <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                  {testimonial.metric}
                </span>
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground leading-relaxed italic flex-1 mb-6">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary/10"
                />
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
