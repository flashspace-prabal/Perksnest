import analyticsIllustration from "@/assets/illustrations/analytics-illustration.png";
import productivityIllustration from "@/assets/illustrations/productivity-illustration.png";
import collaborationIllustration from "@/assets/illustrations/collaboration-illustration.png";
import marketingIllustration from "@/assets/illustrations/marketing-illustration.png";
import securityIllustration from "@/assets/illustrations/security-illustration.png";

interface FeatureSection {
  title: string;
  description: React.ReactNode;
  illustration: string;
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
    illustration: analyticsIllustration,
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
    illustration: productivityIllustration,
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
    illustration: collaborationIllustration,
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
    illustration: marketingIllustration,
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
    illustration: securityIllustration,
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
                <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={feature.illustration} 
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
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
