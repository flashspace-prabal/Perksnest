import { useParams, Link } from "react-router-dom";
import { Star, ArrowRight, ExternalLink } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { Button } from "@/components/ui/button";
import { getComparisonBySlug, comparisons } from "@/data/comparisons";

const Compare = () => {
  const { slug } = useParams<{ slug: string }>();
  const comparison = getComparisonBySlug(slug || "");

  if (!comparison) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-wide py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Comparison Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the comparison you're looking for.
          </p>
          <Link to="/deals">
            <Button>Browse Deals</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const tableOfContents = [
    { id: "overview", label: `${comparison.tool1.name} vs ${comparison.tool2.name}: overview` },
    { id: "difference", label: `What's the difference between ${comparison.tool1.name} and ${comparison.tool2.name}?` },
    { id: "tool1-pros-cons", label: `${comparison.tool1.name} pros and cons` },
    { id: "tool2-pros-cons", label: `${comparison.tool2.name} pros and cons` },
    { id: "tool1-vs-tool2", label: `${comparison.tool1.name} compared to ${comparison.tool2.name}` },
    { id: "tool2-vs-tool1", label: `${comparison.tool2.name} compared to ${comparison.tool1.name}` },
    { id: "features", label: "Features comparison" },
    { id: "verdict", label: `${comparison.tool1.name} vs ${comparison.tool2.name}: Which is the best for your business?` },
    { id: "alternatives-tool1", label: `Alternatives to ${comparison.tool1.name}` },
    { id: "alternatives-tool2", label: `Alternatives to ${comparison.tool2.name}` },
  ];

  const renderStars = (score: number) => {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        <span className="font-medium">{score.toFixed(1)}/5</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="border-b">
        <div className="container-wide py-4">
          <nav className="text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/deals" className="hover:text-foreground">{comparison.category}</Link>
            <span className="mx-2">/</span>
            <span className="hover:text-foreground">{comparison.subcategory}</span>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">{comparison.tool1.name} vs {comparison.tool2.name}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-background">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left: Title and Logos */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-white border p-2 flex items-center justify-center">
                  <SafeImage 
                    src={comparison.tool1.logo} 
                    alt={comparison.tool1.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-2xl text-muted-foreground">⚡</span>
                <div className="w-16 h-16 rounded-xl bg-white border p-2 flex items-center justify-center">
                  <SafeImage 
                    src={comparison.tool2.logo} 
                    alt={comparison.tool2.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {comparison.tool1.name} vs {comparison.tool2.name}: {comparison.headline}
              </h1>

              <div className="mt-12 relative">
                <p className="text-muted-foreground italic text-lg transform -rotate-2">
                  Save BIG on<br />
                  {comparison.tool1.name} and<br />
                  {comparison.tool2.name}
                </p>
                <ArrowRight className="absolute right-1/3 top-1/2 w-12 h-12 text-muted-foreground/50 transform rotate-12" />
              </div>

              {/* SaaS promotion banner */}
              <div className="mt-12 flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-primary/10 border flex items-center justify-center text-xs font-bold text-primary">
                      {["N", "S", "☁", "B", "M"][i]}
                    </div>
                  ))}
                </div>
                <span className="font-medium">Save big on 570+ SaaS</span>
                <Link to="/deals">
                  <Button variant="outline" size="sm">Explore marketplace</Button>
                </Link>
              </div>
            </div>

            {/* Right: Discount Cards */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">
                Discounts on {comparison.tool1.name} & {comparison.tool2.name}
              </h3>
              
              {/* Tool 1 Card */}
              <div className="p-4 bg-card border rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white border p-1.5 flex items-center justify-center">
                    <SafeImage 
                      src={comparison.tool1.logo} 
                      alt={comparison.tool1.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{comparison.tool1.name}</h4>
                    <p className="text-sm text-muted-foreground">Used by {comparison.tool1.members} members</p>
                  </div>
                </div>
                <p className="text-primary font-semibold">{comparison.tool1.deal}</p>
                <p className="text-sm text-muted-foreground">Save up to ${comparison.tool1.savings}</p>
              </div>

              {/* Tool 2 Card */}
              <div className="p-4 bg-card border rounded-xl">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-white border p-1.5 flex items-center justify-center">
                    <SafeImage 
                      src={comparison.tool2.logo} 
                      alt={comparison.tool2.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{comparison.tool2.name}</h4>
                    <p className="text-sm text-muted-foreground">Used by {comparison.tool2.members} members</p>
                  </div>
                  <Link to="/deals">
                    <Button size="sm" className="gap-1">
                      Get deal for free <ExternalLink className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
                <p className="text-primary font-semibold">{comparison.tool2.deal}</p>
                <p className="text-sm text-muted-foreground">Save up to ${comparison.tool2.savings}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-muted/30">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Intro */}
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  {comparison.intro}
                </p>
                <p className="text-muted-foreground">
                  Some of the best <strong>{comparison.subcategory.toLowerCase()}</strong> includes{" "}
                  <Link to="#" className="text-primary hover:underline">{comparison.tool1.name}</Link> and{" "}
                  <Link to="#" className="text-primary hover:underline">{comparison.tool2.name}</Link>. 
                  In this guide, we compare the differences and features of the two solutions to help you 
                  find the best software for your business.
                </p>
              </div>

              {/* Table of Contents */}
              <div className="bg-background p-6 rounded-xl border">
                <nav className="space-y-2">
                  {tableOfContents.map((item, index) => (
                    <a 
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-baseline gap-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <span className="text-sm font-medium w-6">{(index + 1).toString().padStart(2, '0')}</span>
                      <span>{item.label}</span>
                    </a>
                  ))}
                </nav>
              </div>

              {/* Section 1: Overview */}
              <div id="overview" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">
                  01 {comparison.tool1.name} vs {comparison.tool2.name}: overview
                </h2>
                <p className="text-muted-foreground mb-6">{comparison.overviewIntro}</p>
                <p className="text-muted-foreground mb-8">
                  To help you choose the software solution best suited to your business needs, we've put together a 
                  comparison table of the key features of each platform. Each criterion is rated by a star system 
                  and accompanied by a commentary to make it easier for you to read the table below.
                </p>

                {/* Comparison Table */}
                <div className="bg-background rounded-xl border overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-4 border-b bg-muted/30">
                    <div></div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-white border rounded-lg p-2">
                        <SafeImage 
                          src={comparison.tool1.logo} 
                          alt={comparison.tool1.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-semibold">{comparison.tool1.name}</p>
                      <Button variant="outline" size="sm" className="mt-2">View Reviews</Button>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-white border rounded-lg p-2">
                        <SafeImage 
                          src={comparison.tool2.logo} 
                          alt={comparison.tool2.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="font-semibold">{comparison.tool2.name}</p>
                      <Button variant="outline" size="sm" className="mt-2">View Reviews</Button>
                    </div>
                    <div></div>
                  </div>
                  
                  {comparison.ratings.map((rating, index) => (
                    <div 
                      key={rating.category}
                      className={`grid grid-cols-4 gap-4 p-4 items-center ${index % 2 === 0 ? 'bg-muted/20' : ''}`}
                    >
                      <p className="text-sm text-muted-foreground font-medium">{rating.category}</p>
                      <div className="text-center">{renderStars(rating.tool1Score)}</div>
                      <div className="text-center">{renderStars(rating.tool2Score)}</div>
                      <p className="text-sm text-muted-foreground">{rating.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: What's the difference */}
              <div id="difference" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6">
                  02 What's the difference between {comparison.tool1.name} and {comparison.tool2.name}?
                </h2>
                
                <div className="space-y-8">
                  <div className="bg-background p-6 rounded-xl border">
                    <h3 className="text-xl font-bold mb-2">{comparison.tool1.name}</h3>
                    <p className="text-muted-foreground">{comparison.tool1.description}</p>
                  </div>
                  <div className="bg-background p-6 rounded-xl border">
                    <h3 className="text-xl font-bold mb-2">{comparison.tool2.name}</h3>
                    <p className="text-muted-foreground">{comparison.tool2.description}</p>
                  </div>
                </div>

                <p className="text-muted-foreground mt-6">{comparison.tool1Details.description}</p>
                <p className="text-muted-foreground mt-4">{comparison.tool2Details.description}</p>
              </div>

              {/* Section 3: Tool 1 Pros and Cons */}
              <div id="tool1-pros-cons" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6">
                  03 {comparison.tool1.name} pros and cons
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                    <h4 className="font-semibold text-primary mb-4">Pros</h4>
                    <ul className="space-y-2">
                      {comparison.tool1Details.prosCons.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary">✓</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-destructive/5 p-6 rounded-xl border border-destructive/20">
                    <h4 className="font-semibold text-destructive mb-4">Cons</h4>
                    <ul className="space-y-2">
                      {comparison.tool1Details.prosCons.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive">✗</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-muted-foreground mt-6">{comparison.tool1Details.bestFor}</p>

                {/* Compare to other tools */}
                <h3 className="text-xl font-bold mt-8 mb-4">Compare {comparison.tool1.name} to other tools</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {comparison.relatedTool1.map((related, i) => (
                    <Link 
                      key={i}
                      to={`/compare/${related.slug}`}
                      className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex -space-x-1">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                          {related.tool1.charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                          {related.tool2.charAt(0)}
                        </div>
                      </div>
                      <span className="text-sm">{related.tool1} vs {related.tool2}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Section 4: Tool 2 Pros and Cons */}
              <div id="tool2-pros-cons" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6">
                  04 {comparison.tool2.name} pros and cons
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                    <h4 className="font-semibold text-primary mb-4">Pros</h4>
                    <ul className="space-y-2">
                      {comparison.tool2Details.prosCons.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary">✓</span> {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-destructive/5 p-6 rounded-xl border border-destructive/20">
                    <h4 className="font-semibold text-destructive mb-4">Cons</h4>
                    <ul className="space-y-2">
                      {comparison.tool2Details.prosCons.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-destructive">✗</span> {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className="text-muted-foreground mt-6">{comparison.tool2Details.bestFor}</p>

                {/* Compare to other tools */}
                <h3 className="text-xl font-bold mt-8 mb-4">Compare {comparison.tool2.name} to other tools</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {comparison.relatedTool2.map((related, i) => (
                    <Link 
                      key={i}
                      to={`/compare/${related.slug}`}
                      className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex -space-x-1">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                          {related.tool1.charAt(0)}
                        </div>
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                          {related.tool2.charAt(0)}
                        </div>
                      </div>
                      <span className="text-sm">{related.tool1} vs {related.tool2}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Section 5: Tool 1 compared to Tool 2 */}
              <div id="tool1-vs-tool2" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">
                  05 {comparison.tool1.name} compared to {comparison.tool2.name}
                </h2>
                <p className="text-muted-foreground mb-6">{comparison.tool1VsTool2}</p>

                <h3 className="text-lg font-semibold mb-2">❖ Is {comparison.tool1.name} better than {comparison.tool2.name}?</h3>
                <p className="text-muted-foreground mb-6">
                  The choice between two SaaS tools always depends on many factors, such as the size of the company, 
                  the skills of its technical team, its budget and its specific needs. {comparison.tool1.name} may 
                  be better for certain use cases while {comparison.tool2.name} excels in others.
                </p>

                <h3 className="text-lg font-semibold mb-2">❖ What is {comparison.tool1.name} best used for?</h3>
                <p className="text-muted-foreground">{comparison.tool1Details.bestFor}</p>
              </div>

              {/* Section 6: Tool 2 compared to Tool 1 */}
              <div id="tool2-vs-tool1" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">
                  06 {comparison.tool2.name} compared to {comparison.tool1.name}
                </h2>
                <p className="text-muted-foreground mb-6">{comparison.tool2VsTool1}</p>

                <h3 className="text-lg font-semibold mb-2">❖ Is {comparison.tool2.name} better than {comparison.tool1.name}?</h3>
                <p className="text-muted-foreground mb-6">
                  Each tool has its strengths. {comparison.tool2.name} offers advantages in specific scenarios 
                  while {comparison.tool1.name} might be preferable in others. Consider your specific requirements 
                  when making your decision.
                </p>

                <h3 className="text-lg font-semibold mb-2">❖ What is {comparison.tool2.name} best used for?</h3>
                <p className="text-muted-foreground">{comparison.tool2Details.bestFor}</p>
              </div>

              {/* Section 7: Features comparison */}
              <div id="features" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-6">07 Features comparison</h2>
                <div className="bg-background rounded-xl border overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/30">
                        <th className="text-left p-4">Feature</th>
                        <th className="text-center p-4">{comparison.tool1.name}</th>
                        <th className="text-center p-4">{comparison.tool2.name}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.ratings.map((rating, index) => (
                        <tr key={rating.category} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                          <td className="p-4 font-medium">{rating.category}</td>
                          <td className="p-4 text-center">{renderStars(rating.tool1Score)}</td>
                          <td className="p-4 text-center">{renderStars(rating.tool2Score)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 8: Verdict */}
              <div id="verdict" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">
                  08 {comparison.tool1.name} vs {comparison.tool2.name}: Which is the best for your business?
                </h2>
                <p className="text-muted-foreground mb-6">{comparison.verdict}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                    <h4 className="font-bold mb-2">Choose {comparison.tool1.name} if:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {comparison.tool1Details.prosCons.pros.slice(0, 3).map((pro, i) => (
                        <li key={i}>• You value {pro.toLowerCase()}</li>
                      ))}
                    </ul>
                    <Link to="/deals" className="inline-block mt-4">
                      <Button size="sm" variant="outline">Get {comparison.tool1.name} deal</Button>
                    </Link>
                  </div>
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-xl">
                    <h4 className="font-bold mb-2">Choose {comparison.tool2.name} if:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {comparison.tool2Details.prosCons.pros.slice(0, 3).map((pro, i) => (
                        <li key={i}>• You value {pro.toLowerCase()}</li>
                      ))}
                    </ul>
                    <Link to="/deals" className="inline-block mt-4">
                      <Button size="sm">Get {comparison.tool2.name} deal</Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Alternatives sections */}
              <div id="alternatives-tool1" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">09 Alternatives to {comparison.tool1.name}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {comparison.relatedTool1.map((related, i) => (
                    <Link 
                      key={i}
                      to={`/compare/${related.slug}`}
                      className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <span className="text-sm">{related.tool1} vs {related.tool2}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div id="alternatives-tool2" className="scroll-mt-20">
                <h2 className="text-2xl font-bold mb-4">10 Alternatives to {comparison.tool2.name}</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {comparison.relatedTool2.map((related, i) => (
                    <Link 
                      key={i}
                      to={`/compare/${related.slug}`}
                      className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <span className="text-sm">{related.tool1} vs {related.tool2}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar - Table of Contents (sticky) */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                <div className="bg-background p-6 rounded-xl border">
                  <h4 className="font-semibold mb-4">On this page</h4>
                  <nav className="space-y-2 text-sm">
                    {tableOfContents.map((item, index) => (
                      <a 
                        key={item.id}
                        href={`#${item.id}`}
                        className="block text-muted-foreground hover:text-foreground transition-colors py-1"
                      >
                        {(index + 1).toString().padStart(2, '0')} {item.label.length > 40 ? item.label.slice(0, 40) + '...' : item.label}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* More Comparisons */}
                <div className="bg-background p-6 rounded-xl border">
                  <h4 className="font-semibold mb-4">More comparisons</h4>
                  <div className="space-y-2">
                    {comparisons
                      .filter(c => c.slug !== slug)
                      .slice(0, 5)
                      .map(c => (
                        <Link
                          key={c.slug}
                          to={`/compare/${c.slug}`}
                          className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                        >
                          {c.tool1.name} vs {c.tool2.name}
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Compare;
