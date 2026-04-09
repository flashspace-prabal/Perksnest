import { useParams, Link } from 'react-router-dom';
import { dealsData } from '@/data/deals';
import Footer from '@/components/Footer';
import DealCard from '@/components/DealCard';
import { Button } from '@/components/ui/button';
import { Building2, TrendingUp, Users, DollarSign } from 'lucide-react';

const slugify = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const PartnerProfile = () => {
  const { slug } = useParams<{ slug: string }>();

  // Find company by slug
  const companyDeals = dealsData.filter(deal => {
    const dealCompany = deal.company || deal.name;
    return slugify(dealCompany) === slug;
  });

  if (companyDeals.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Partner Not Found</h1>
          <p className="text-muted-foreground mb-6">
            We couldn't find a partner with that profile.
          </p>
          <Link to="/deals">
            <Button className="bg-purple-600 hover:bg-purple-700">
              Browse All Deals
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const companyName = companyDeals[0].company || companyDeals[0].name;
  const companyLogo = companyDeals[0].logo;
  const totalClaims = companyDeals.reduce((sum, deal) => sum + deal.memberCount, 0);
  const avgSavings = companyDeals.reduce((sum, deal) => {
    const savingsNum = parseFloat(deal.savings.replace(/[$,]/g, ''));
    return sum + savingsNum;
  }, 0) / companyDeals.length;

  // Get company initials for avatar
  const initials = companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Company Avatar */}
            <div className="w-32 h-32 rounded-2xl bg-white flex items-center justify-center shadow-lg">
              {companyLogo ? (
                <img
                  src={companyLogo}
                  alt={companyName}
                  className="w-20 h-20 object-contain"
                />
              ) : (
                <span className="text-4xl font-bold text-purple-600">{initials}</span>
              )}
            </div>

            {/* Company Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Building2 className="h-5 w-5" />
                <span className="text-sm font-medium">Partner</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{companyName}</h1>
              <p className="text-lg text-purple-100 max-w-2xl">
                {companyDeals[0].description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5" />
                <span className="text-sm font-medium">Deals Available</span>
              </div>
              <div className="text-4xl font-bold">{companyDeals.length}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">Total Claims</span>
              </div>
              <div className="text-4xl font-bold">{totalClaims.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="h-5 w-5" />
                <span className="text-sm font-medium">Avg Savings</span>
              </div>
              <div className="text-4xl font-bold">${avgSavings.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Available Deals from {companyName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyDeals.map(deal => (
            <DealCard key={deal.id} {...deal} />
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-y border-purple-200 dark:border-purple-800">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">Want to list your product on PerksNest?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join hundreds of partners offering exclusive deals to our community of startups and entrepreneurs.
          </p>
          <Link to="/partner">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Join as a Partner
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PartnerProfile;
