import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { BookmarksProvider } from "@/lib/bookmarks";
import Index from "./pages/Index";
import HomeStripe from "./pages/HomeStripe";
import Deals from "./pages/Deals";
import DealRedeem from "./pages/DealRedeem";
import DealRoute from "./pages/DealRoute";
import Pricing from "./pages/Pricing";
import BlogPage from "./pages/BlogPage";
import Invite from "./pages/Invite";
import Newsletter from "./pages/Newsletter";
import Collections from "./pages/Collections";
import CollectionDetail from "./pages/CollectionDetail";
import Categories from "./pages/Categories";
import Category from "./pages/Category";
import Leaderboard from "./pages/Leaderboard";
import ComparePage from "./pages/ComparePage";
import Login from "./pages/Login";
import ReferralRedirect from "./pages/ReferralRedirect";
import Communities from "./pages/Communities";
import AdminPortal from "./pages/portal/AdminPortal";
import PartnerPortal from "./pages/portal/PartnerPortal";
import CustomerPortal from "./pages/portal/CustomerPortal";
import Tickets from "./pages/customer/Tickets";
import TicketDetail from "./pages/customer/TicketDetail";
import BrandProfile from "./pages/BrandProfile";
import WhiteLabel from "./pages/WhiteLabel";
import Docs from "./pages/Docs";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";
import NotFound from "./pages/NotFound";
import OAuthHandler from "./components/OAuthHandler";
import ScrollToTop from "./components/ScrollToTop";
import ReferralCodeCapture from "./components/ReferralCodeCapture";
import AppSeo from "./components/AppSeo";
import HelpCenter from "./pages/HelpCenter";
import MainNavbar from "./components/MainNavbar";
import MainFooter from "./components/MainFooter";
import ComingSoon from "./pages/ComingSoon";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BookmarksProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppSeo />
            <OAuthHandler />
            <ReferralCodeCapture />
            <div className="flex flex-col min-h-screen">
              <MainNavbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomeStripe />} />
                  <Route path="/deals" element={<Deals />} />
                  <Route path="/deals/:dealId" element={<DealRoute />} />
                  <Route path="/deals/:dealId/redeem" element={<DealRedeem />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:postId" element={<BlogPage />} />
                  <Route path="/invite" element={<Invite />} />
                  <Route path="/newsletter" element={<Newsletter />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/collections/:id" element={<CollectionDetail />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/category/:slug" element={<Category />} />
                  <Route path="/leaderboard" element={<Leaderboard />} />
                  <Route path="/compare/:slug" element={<ComparePage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Login />} />
                  <Route path="/ref/:referralCode" element={<ReferralRedirect />} />
                  <Route path="/communities" element={<Communities />} />
                  <Route path="/accelerators" element={<Communities />} />
                  <Route path="/white-label" element={<WhiteLabel />} />
                  <Route path="/docs" element={<Docs />} />
                  <Route path="/help" element={<HelpCenter />} />
                  
                  {/* Coming Soon / Placeholder Routes */}
                  <Route path="/solutions" element={<ComingSoon />} />
                  <Route path="/developers" element={<ComingSoon />} />
                  <Route path="/resources" element={<ComingSoon />} />
                  <Route path="/about" element={<ComingSoon />} />
                  <Route path="/press" element={<ComingSoon />} />
                  <Route path="/careers" element={<ComingSoon />} />
                  <Route path="/partner" element={<ComingSoon />} />

                  {/* Clean portal URLs */}
                  <Route path="/admin" element={<AdminPortal />} />
                  <Route path="/customer" element={<CustomerPortal />} />
                  <Route path="/customer/tickets" element={<Tickets />} />
                  <Route path="/customer/tickets/:ticketId" element={<TicketDetail />} />
                  {/* Partner public profiles */}
                  <Route path="/brand/:brandId" element={<BrandProfile />} />
                  {/* Legacy redirects */}
                  <Route path="/portal/admin" element={<Navigate to="/admin" replace />} />
                  <Route path="/portal/partner" element={<Navigate to="/partner" replace />} />
                  <Route path="/portal/customer" element={<Navigate to="/customer" replace />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="*" element={<ComingSoon />} />
                </Routes>
              </main>
              <MainFooter />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </BookmarksProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
