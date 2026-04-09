interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatarInitial: string;
  avatarColor: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Rajan Mehta",
    role: "Co-Founder at Launchpad AI",
    quote: "PerksNest was the best investment I made in the early days of my company. Pays for itself instantly with Premium — very responsive team, new deals added every week. Highly recommended.",
    avatarInitial: "R",
    avatarColor: "bg-primary"
  },
  {
    name: "Priya Nair",
    role: "CEO at Orbit Health",
    quote: "The PerksNest team has been incredibly responsive and helpful to our startup. Every offer has worked perfectly and saved us a huge amount on tools we use daily.",
    avatarInitial: "P",
    avatarColor: "bg-[hsl(38,92%,50%)]"
  },
  {
    name: "Marcus Osei",
    role: "Head of Engineering at BuildFast",
    quote: "PerksNest helped us discover great tools and claim free credits on ones we already use. Sounds too good to be true — but it's completely real!",
    avatarInitial: "M",
    avatarColor: "bg-foreground"
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
