import analyticsIllustration from "@/assets/illustrations/analytics-illustration.png";
import marketingIllustration from "@/assets/illustrations/marketing-illustration.png";

interface FeatureSection {
  title: string;
  description: React.ReactNode;
  illustration: string;
}

const features: FeatureSection[] = [
  {
    title: "Discover deals tailored for you",
    description: (
      <>
        Browse <strong>350+ exclusive perks</strong> across categories like cloud hosting, 
        marketing tools, and productivity apps. Every deal is <strong>directly negotiated</strong> to 
        give founders the best possible savings.
      </>
    ),
    illustration: analyticsIllustration,
  },
  {
    title: "Scale faster, spend smarter",
    description: (
      <>
        Stop overpaying for essential tools. Access <strong>$250,000+ in credits</strong> from 
        top SaaS providers and reinvest your savings back into <strong>growing your startup</strong>.
      </>
    ),
    illustration: marketingIllustration,
  },
];

const FeatureCategoriesSection = () => {
  return (
    <section className="py-16 space-y-8">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="relative overflow-hidden min-h-[400px] lg:min-h-[500px]"
        >
          {/* Background Image - much lighter with increased transparency */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{ backgroundImage: `url(${feature.illustration})` }}
          />
          
          {/* Light overlay to further soften the image */}
          <div className="absolute inset-0 bg-background/50" />
          
          {/* Content */}
          <div className="relative h-full min-h-[400px] lg:min-h-[500px] flex items-center">
            <div className="w-full lg:w-1/2 px-6 md:px-12 lg:px-20 py-8">
              <div className="backdrop-blur-xl bg-background/80 border border-white/30 rounded-2xl p-8 lg:p-10 shadow-xl max-w-xl">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeatureCategoriesSection;
