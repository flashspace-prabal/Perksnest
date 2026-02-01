interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatarInitial: string;
  avatarColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Aaron Artille",
    role: "Co-Founder",
    quote: "PerksNest was the best investment I made in the early days of my company. Pays for itself more or less instantly with Premium, very responsive staff, new offerings get added frequently. Great deal. Recommended.",
    avatarInitial: "A",
    avatarColor: "bg-primary" // Slack aubergine
  },
  {
    name: "David Velardo",
    role: "Founder & CEO",
    quote: "The team at PerksNest have been extremely responsive and helpful to my startup. Their offers have worked perfectly and saved my startup tons of $$",
    avatarInitial: "D",
    avatarColor: "bg-[hsl(38,92%,50%)]" // Slack yellow/orange
  },
  {
    name: "Josh Bartolomucci",
    role: "Marketing Manager",
    quote: "PerksNest has helped us discover new tools as well as get free usage for tools we already use. It's like free money. Sounds too good to be true, but... it's real!",
    avatarInitial: "J",
    avatarColor: "bg-foreground" // Dark aubergine
  },
];

const TestimonialCards = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container-wide">
        {/* Header */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground text-center mb-12">
          They're growing more and spending less with PerksNest
        </h2>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow"
            >
              {/* Author Info */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full ${testimonial.avatarColor} flex items-center justify-center text-white font-bold text-lg`}>
                  {testimonial.avatarInitial}
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-primary">{testimonial.role}</p>
                </div>
              </div>

              {/* Quote */}
              <p className="text-muted-foreground leading-relaxed">
                {testimonial.quote}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialCards;
