import TestimonialCard, { type Testimonial } from "@/components/TestimonialCard";

const testimonials: Testimonial[] = [
  {
    name: "Aarav Mehta",
    role: "Founder",
    company: "SprintLayer",
    image: "https://i.pravatar.cc/120?img=12",
    review: "PerksNest saved us close to $24k in our first 6 months. We activated Notion, AWS, and HubSpot in one afternoon and immediately cut software burn.",
  },
  {
    name: "Nina Brooks",
    role: "Growth Lead",
    company: "LumaForge",
    image: "https://i.pravatar.cc/120?img=32",
    review: "We used the Typeform, Mixpanel, and Intercom deals during launch. The savings were real, and the platform made claiming each perk surprisingly easy.",
  },
  {
    name: "Rohan Iyer",
    role: "CTO",
    company: "LoopPilot",
    image: "https://i.pravatar.cc/120?img=15",
    review: "Supabase, GitHub, and Datadog through PerksNest shaved more than $18k off our dev stack. For an early-stage team, that extra runway matters a lot.",
  },
  {
    name: "Emily Carter",
    role: "CEO",
    company: "Northstack",
    image: "https://i.pravatar.cc/120?img=47",
    review: "The marketplace feels curated instead of noisy. We found tools we already needed, saved roughly $11k, and onboarded faster than through partner pages directly.",
  },
  {
    name: "Karan Bhatia",
    role: "Product Manager",
    company: "RelayMint",
    image: "https://i.pravatar.cc/120?img=68",
    review: "PerksNest helped us roll out Linear, Miro, and OpenAI credits without hunting across startup programs. It made our product ops setup a lot smoother.",
  },
  {
    name: "Sophia Nguyen",
    role: "Founder",
    company: "OrbitNest",
    image: "https://i.pravatar.cc/120?img=5",
    review: "No exaggeration, the savings covered a contractor for a month. We claimed Google Cloud, HubSpot, and Typeform and kept momentum without overspending.",
  },
  {
    name: "Marcus Reed",
    role: "Engineering Lead",
    company: "PatchScale",
    image: "https://i.pravatar.cc/120?img=53",
    review: "The GitLab and Sentry offers alone made it worth signing up. We probably saved $9k already, and the claim flow was cleaner than I expected.",
  },
  {
    name: "Priya Sethi",
    role: "Head of Marketing",
    company: "BloomGrid",
    image: "https://i.pravatar.cc/120?img=25",
    review: "We used PerksNest to rebuild our growth stack with HubSpot, Typeform, and Notion. It saved budget and gave us a much cleaner setup for our small team.",
  },
  {
    name: "Daniel Kim",
    role: "Co-founder",
    company: "VectorDock",
    image: "https://i.pravatar.cc/120?img=41",
    review: "I expected a generic perks list, but the offers were actually useful. Between DigitalOcean, GitHub, and Intercom, we saved about $14k in year one.",
  },
  {
    name: "Tanya Lewis",
    role: "Operations Manager",
    company: "BrightBase",
    image: "https://i.pravatar.cc/120?img=36",
    review: "What I liked most was speed. We found Airtable, Monday, and Zendesk deals in one place and got our ops stack sorted without endless research.",
  },
  {
    name: "Ishaan Kapoor",
    role: "Founder",
    company: "MetricBloom",
    image: "https://i.pravatar.cc/120?img=20",
    review: "Mixpanel, Supabase, and AWS through PerksNest gave us breathing room right when we needed it. Easily one of the highest-ROI startup resources we used.",
  },
  {
    name: "Olivia Grant",
    role: "Customer Success Lead",
    company: "SignalCraft",
    image: "https://i.pravatar.cc/120?img=44",
    review: "We moved our support flow onto Intercom and Zendesk perks from PerksNest and saved enough to invest more into onboarding. The user experience is genuinely polished.",
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
    <section className="overflow-hidden bg-[#faf9f5] py-12">
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
