import { useParams, Link } from "react-router-dom";
import { ArrowRight, TrendingUp, Users, DollarSign, Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import { dealsData } from "@/data/deals";

const BrandProfile = () => {
  const { brandId } = useParams<{ brandId: string }>();

  const brandDeals = dealsData.filter(
    (d) => d.id === brandId || d.name.toLowerCase().replace(/\s+/g, "-") === brandId
  );

  const brand = brandDeals[0];

  if (!brand) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container-wide py-32 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Partner Not Found</h1>
          <p className="text-muted-foreground mb-8">We couldn't find a partner with that name.</p>
          <Button asChild>
            <Link to="/deals">Browse All Deals</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const totalMembers = brandDeals.reduce((sum, d) => sum + d.memberCount, 0);
  const avgSavings = brandDeals[0]?.savings || "$0";

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Banner — flat solid aubergine */}
      <section className="bg-primary">
        <div className="container-wide py-14 md:py-20">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Logo */}
            <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-card flex items-center justify-center p-4">
              <SafeImage
                src={brand.logo}
                alt={brand.name}
                className="w-full h-full object-contain"
                fallbackClassName="text-2xl font-bold"
              />
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground border-0 text-xs">
                  Partner
                </Badge>
                {brand.isPick && (
                  <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground border-0 text-xs">
                    <Star className="w-3 h-3 mr-1" /> Top Pick
                  </Badge>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3">
                {brand.name}
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-lg">
                {brand.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            {[
              { icon: TrendingUp, label: "Deals Available", value: String(brandDeals.length) },
              { icon: Users, label: "Total Claims", value: totalMembers.toLocaleString() },
              { icon: DollarSign, label: "Avg Savings", value: avgSavings },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 bg-primary-foreground/10 rounded-xl px-6 py-5"
              >
                <stat.icon className="w-5 h-5 text-primary-foreground/60" />
                <div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                  <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Available Deals from {brand.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brandDeals.map((deal) => (
              <Card key={deal.id} className="border-border/60 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
                {deal.isPick && <div className="h-1 bg-primary" />}
                <CardContent className="pt-6 pb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center p-2 flex-shrink-0">
                      <SafeImage
                        src={deal.logo}
                        alt={deal.name}
                        className="w-full h-full object-contain"
                        fallbackClassName="text-sm font-bold"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-foreground">{deal.name}</h3>
                        {deal.isPick && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px]">
                            <Star className="w-3 h-3 mr-0.5" /> Featured
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{deal.description}</p>
                    </div>
                  </div>
                  <p className="text-sm text-foreground mb-3 leading-relaxed">{deal.dealText}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-primary">Save up to {deal.savings}</span>
                    <span className="text-xs text-muted-foreground">{deal.memberCount.toLocaleString()} members</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <Button asChild size="sm" className="w-full gap-2">
                      <Link to={`/deals/${deal.id}/redeem`}>
                        Get free deal
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="py-16 md:py-20 bg-secondary/40">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Want to list your product on PerksNest?
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-8">
            Join hundreds of partners offering exclusive deals to our community of startups and entrepreneurs.
          </p>
          <Button size="lg" className="gap-2 px-8 py-6 text-base">
            Join as a Partner
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrandProfile;
