import TestimonialCard, { type Testimonial } from "@/components/TestimonialCard";

const testimonials: Testimonial[] = [
  {
    name: "Aarav Mehta",
    role: "Founder",
    company: "SprintLayer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    review: "PerksNest saved us $24K in our first 6 months. We activated Notion, AWS, and HubSpot in one afternoon and immediately cut software burn.",
    metric: "$24K saved",
    rating: 5,
    verified: true,
  },
  {
    name: "Nina Brooks",
    role: "Growth Lead",
    company: "LumaForge",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    review: "We used the Typeform, Mixpanel, and Intercom deals during launch. The savings were real, and the platform made claiming each perk surprisingly easy.",
    metric: "$18K saved",
    rating: 4,
    verified: true,
  },
  {
    name: "Rohan Iyer",
    role: "CTO",
    company: "LoopPilot",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    review: "Supabase, GitHub, and Datadog through PerksNest shaved more than $18K off our dev stack. For an early-stage team, that extra runway matters.",
    metric: "$18K saved",
    rating: 5,
    verified: true,
  },
  {
    name: "Emily Carter",
    role: "CEO",
    company: "Northstack",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    review: "The marketplace feels curated instead of noisy. We found tools we needed, saved roughly $11K, and onboarded faster than through partner pages.",
    metric: "$11K saved",
    rating: 5,
    verified: true,
  },
  {
    name: "Karan Bhatia",
    role: "Product Manager",
    company: "RelayMint",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    review: "PerksNest helped us roll out Linear, Miro, and OpenAI credits without hunting across startup programs. Smoother product ops setup.",
    metric: "7 tools activated",
    rating: 4,
    verified: true,
  },
  {
    name: "Sophia Nguyen",
    role: "Founder",
    company: "OrbitNest",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    review: "The savings covered a contractor for a month. We claimed Google Cloud, HubSpot, and Typeform and kept momentum without overspending.",
    metric: "$15K saved",
    rating: 5,
    verified: true,
  },
  {
    name: "Marcus Reed",
    role: "Engineering Lead",
    company: "PatchScale",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    review: "The GitLab and Sentry offers alone made it worth signing up. We saved $9K already, and the claim flow was cleaner than expected.",
    metric: "$9K saved",
    rating: 3,
    verified: true,
  },
  {
    name: "Priya Sethi",
    role: "Head of Marketing",
    company: "BloomGrid",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    review: "We rebuilt our growth stack with HubSpot, Typeform, and Notion. Saved budget and gave us a cleaner setup for our small team.",
    metric: "$12K saved",
    rating: 5,
    verified: true,
  },
  {
    name: "Daniel Kim",
    role: "Co-founder",
    company: "VectorDock",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    review: "The offers were actually useful. Between DigitalOcean, GitHub, and Intercom, we saved about $14K in year one.",
    metric: "$14K saved",
    rating: 5,
    verified: true,
  },
  {
    name: "Tanya Lewis",
    role: "Operations Manager",
    company: "BrightBase",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    review: "What I liked most was speed. We found Airtable, Monday, and Zendesk deals in one place and got our ops stack sorted without research.",
    metric: "Saved $10K",
    rating: 4,
    verified: true,
  },
  {
    name: "Ishaan Kapoor",
    role: "Founder",
    company: "MetricBloom",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    review: "Mixpanel, Supabase, and AWS through PerksNest gave us breathing room right when we needed it. Highest-ROI startup resource.",
    metric: "$22K saved",
    rating: 5,
    verified: true,
  },
  {
    name: "Olivia Grant",
    role: "Customer Success Lead",
    company: "SignalCraft",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    review: "We moved support flow onto Intercom and Zendesk perks and saved enough to invest more into onboarding. User experience is genuinely polished.",
    metric: "$8K saved",
    rating: 3,
    verified: true,
  },
];

const firstRow = testimonials.slice(0, 6);
const secondRow = testimonials.slice(6);

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
            What our members are saying
          </h2>
          <p className="mt-4 text-base leading-8 text-stone-600">
            Founders, operators, and builders use PerksNest to cut software spend, claim startup credits faster, and get more leverage from their stack.
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
