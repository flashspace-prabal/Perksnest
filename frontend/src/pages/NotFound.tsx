import { Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center py-20">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-9xl font-extrabold text-primary mb-4">404</h1>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link to="/">
              <Button size="lg" className="gap-2">
                <Home className="h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            <Link to="/deals">
              <Button size="lg" variant="outline" className="gap-2">
                <Search className="h-5 w-5" />
                Browse Deals
              </Button>
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">Looking for something specific? Try these popular pages:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link to="/pricing" className="text-primary hover:underline">Pricing</Link>
              <span>•</span>
              <Link to="/blog" className="text-primary hover:underline">Blog</Link>
              <span>•</span>
              <Link to="/invite" className="text-primary hover:underline">Refer & Earn</Link>
              <span>•</span>
              <Link to="/portal/customer" className="text-primary hover:underline">My Account</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
