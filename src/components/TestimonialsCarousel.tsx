import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Rajan Mehta",
    role: "Co-Founder",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    quote: "PerksNest was the best investment I made in the early days of my company. Pays for itself instantly with Premium, very responsive team, new deals added every week.",
  },
  {
    name: "Priya Nair",
    role: "Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=faces",
    quote: "The PerksNest team has been incredibly responsive and helpful. Every offer has worked perfectly and saved us thousands of dollars.",
  },
  {
    name: "Marcus Osei",
    role: "Head of Engineering",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    quote: "PerksNest helped us discover new tools and get free credits on ones we already use. It's like free money — sounds too good to be true, but it's completely real!",
  },
];

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
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-card p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary/10"
                />
                <div>
                  <h4 className="font-semibold text-foreground text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <blockquote className="text-muted-foreground leading-relaxed italic flex-1">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
