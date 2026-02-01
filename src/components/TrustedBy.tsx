const companies = [
  { name: "YCombinator", logo: "Y Combinator" },
  { name: "Techstars", logo: "Techstars" },
  { name: "500 Startups", logo: "500" },
  { name: "Sequoia", logo: "Sequoia" },
  { name: "Andreessen", logo: "a16z" },
  { name: "Accel", logo: "Accel" },
];

const TrustedBy = () => {
  return (
    <section className="py-12 bg-muted/30 border-y border-border">
      <div className="container-wide">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Trusted by startups backed by
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
          {companies.map((company) => (
            <div
              key={company.name}
              className="text-xl md:text-2xl font-bold text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default"
            >
              {company.logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;