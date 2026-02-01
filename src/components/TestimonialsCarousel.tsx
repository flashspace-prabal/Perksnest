import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Aaron Artille",
    role: "Co-Founder",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=faces",
    quote: "Secret was the best investment I made in the early days of my company. Pays for itself more or less instantly with Premium, very responsive staff, new offerings get added frequently. Great deal. Recommended.",
  },
  {
    name: "David Velardo",
    role: "Founder & CEO",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    quote: "Jean-Loup and Secret have been extremely responsive and helpful to my startup. Their offers have worked perfectly and saved my startup tons of $$",
  },
  {
    name: "Josh Bartolomucci",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    quote: "Secret has helped us discover new tools as well as get free usage for tools we already use. It's like free money. Sounds too good to be true, but... it's real!",
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-8 bg-secondary/50">
      <div className="container-wide">
        <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-6">
          They're growing more and spending less with Secret
        </h2>
        
        <div className="flex items-center justify-center gap-8 overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`flex items-center gap-4 transition-all duration-300 ${
                index === currentIndex ? "opacity-100" : "opacity-50"
              }`}
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="max-w-xs">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm text-foreground">{testimonial.name}</span>
                  <span className="text-xs text-muted-foreground">{testimonial.role}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{testimonial.quote}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;
