import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import Index from "./pages/Index";
import HomeStripe from "./pages/HomeStripe";
import Deals from "./pages/Deals";
import DealDetail from "./pages/DealDetail";
import DealRedeem from "./pages/DealRedeem";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Invite from "./pages/Invite";
import Compare from "./pages/Compare";
import Login from "./pages/Login";
import Communities from "./pages/Communities";
import AdminPortal from "./pages/portal/AdminPortal";
import PartnerPortal from "./pages/portal/PartnerPortal";
import CustomerPortal from "./pages/portal/CustomerPortal";
import PartnerProfile from "./pages/PartnerProfile";
import WhiteLabel from "./pages/WhiteLabel";
import Docs from "./pages/Docs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/h1" element={<HomeStripe />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/deals/:dealId" element={<DealDetail />} />
            <Route path="/deals/:dealId/redeem" element={<DealRedeem />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<Blog />} />
            <Route path="/invite" element={<Invite />} />
            <Route path="/compare/:slug" element={<Compare />} />
            <Route path="/login" element={<Login />} />
            <Route path="/communities" element={<Communities />} />
            <Route path="/accelerators" element={<Communities />} />
            <Route path="/white-label" element={<WhiteLabel />} />
            <Route path="/docs" element={<Docs />} />
            {/* Clean portal URLs */}
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/partner" element={<PartnerPortal />} />
            <Route path="/customer" element={<CustomerPortal />} />
            {/* Partner public profiles */}
            <Route path="/brand/:slug" element={<PartnerProfile />} />
            {/* Legacy redirects */}
            <Route path="/portal/admin" element={<Navigate to="/admin" replace />} />
            <Route path="/portal/partner" element={<Navigate to="/partner" replace />} />
            <Route path="/portal/customer" element={<Navigate to="/customer" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
