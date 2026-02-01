import { Cloud, PenTool, Users, TrendingUp, Shield, Zap } from "lucide-react";

interface FeatureSection {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  bgColor: string;
  reverse?: boolean;
}

const features: FeatureSection[] = [
  {
    title: "Computation and analytics",
    description: (
      <>
        Deploy your applications on <strong>AWS, Digital Ocean,</strong> use{" "}
        <strong>Zoho Flow,</strong> amongst several other automators.
      </>
    ),
    icon: (
      <div className="relative">
        {/* Analytics illustration */}
        <div className="flex items-end gap-4">
          <div className="relative">
            <div className="w-32 h-24 bg-primary/10 rounded-lg" />
            <TrendingUp className="absolute bottom-2 left-2 w-28 h-20 text-primary/40" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-[hsl(38,92%,50%)] flex items-center justify-center">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-white rotate-[30deg]" />
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-white rotate-[-60deg] -ml-2" />
            </div>
          </div>
        </div>
        {/* Doodle characters */}
        <div className="absolute -bottom-4 left-8 text-6xl opacity-80">📊</div>
        <div className="absolute -bottom-4 right-8 text-5xl opacity-80">📈</div>
      </div>
    ),
    bgColor: "bg-primary/5",
    reverse: false,
  },
  {
    title: "Productivity Tools",
    description: (
      <>
        Keep yourself and your team organized with tools like{" "}
        <strong>Notion, Clickup, Miro, Typeform</strong> so you build even better!
      </>
    ),
    icon: (
      <div className="relative flex items-center justify-center">
        <div className="text-8xl">✏️</div>
        <PenTool className="absolute w-16 h-16 text-[hsl(38,92%,50%)] -rotate-12" />
      </div>
    ),
    bgColor: "bg-background",
    reverse: true,
  },
  {
    title: "Team Collaboration",
    description: (
      <>
        Connect your team with <strong>Slack, Zoom, Microsoft Teams,</strong> and{" "}
        <strong>Loom</strong> to communicate seamlessly across the globe.
      </>
    ),
    icon: (
      <div className="relative flex items-center justify-center">
        <Users className="w-24 h-24 text-primary/60" />
        <div className="absolute -top-2 -right-2 text-4xl">💬</div>
        <div className="absolute -bottom-2 -left-2 text-3xl">🎥</div>
      </div>
    ),
    bgColor: "bg-primary/5",
    reverse: false,
  },
  {
    title: "Marketing & Growth",
    description: (
      <>
        Supercharge your marketing with <strong>HubSpot, Mailchimp, Semrush,</strong> and{" "}
        <strong>Brevo</strong> to reach more customers effectively.
      </>
    ),
    icon: (
      <div className="relative flex items-center justify-center">
        <Zap className="w-20 h-20 text-[hsl(38,92%,50%)]" />
        <div className="absolute top-0 right-0 text-4xl">🚀</div>
        <div className="absolute bottom-0 left-0 text-3xl">📧</div>
      </div>
    ),
    bgColor: "bg-background",
    reverse: true,
  },
  {
    title: "Security & Compliance",
    description: (
      <>
        Keep your data safe with <strong>1Password, Okta,</strong> and{" "}
        <strong>Auth0</strong> for enterprise-grade security solutions.
      </>
    ),
    icon: (
      <div className="relative flex items-center justify-center">
        <Shield className="w-24 h-24 text-primary/60" />
        <div className="absolute -top-1 right-4 text-3xl">🔒</div>
      </div>
    ),
    bgColor: "bg-primary/5",
    reverse: false,
  },
];

const FeatureCategoriesSection = () => {
  return (
    <section className="py-16">
      {features.map((feature, index) => (
        <div key={index} className={`${feature.bgColor} py-16 lg:py-24`}>
          <div className="container-wide">
            <div className={`flex flex-col ${feature.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-12 lg:gap-20`}>
              {/* Text Content */}
              <div className="flex-1 max-w-xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Illustration */}
              <div className="flex-1 flex items-center justify-center">
                <div className="w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">
                  {feature.icon}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeatureCategoriesSection;
