import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Rajan Mehta",
    role: "Co-Founder",
    company: "Launchpad AI",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    quote: "PerksNest paid for itself in the first week. We stacked deals on Notion, AWS, and HubSpot and saved more than our entire annual SaaS budget. Absolutely wild.",
  },
  {
    name: "Priya Nair",
    role: "Founder & CEO",
    company: "Orbit Health",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=faces",
    quote: "The PerksNest team is incredibly responsive. Every deal we've claimed has worked flawlessly. It's become a core part of how we onboard new tools.",
  },
  {
    name: "Marcus Osei",
    role: "Head of Engineering",
    company: "BuildFast Studio",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    quote: "I was skeptical at first — free credits and big discounts sound too good. But every single offer we've redeemed delivered exactly what was promised.",
  },
  {
    name: "Anika Sharma",
    role: "Operations Lead",
    company: "NovaSpark Ventures",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces",
    quote: "We saved over $60,000 in our first year with PerksNest. The platform is clean, the support is fast, and new deals get added every week. Highly recommend.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <section className="py-20 gradient-slack">
      <div className="container-wide">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Startups scale faster with PerksNest
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join 212,980+ businesses who trust PerksNest to find the best SaaS deals
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
              {/* Quote Text */}
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8 max-w-2xl">
                "{testimonials[currentIndex].quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={testimonials[currentIndex].avatar}
                  alt={testimonials[currentIndex].name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20"
                />
                <div className="text-left">
                  <div className="font-semibold text-foreground">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
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
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;