import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import HomeStripe from "./pages/HomeStripe";
import Deals from "./pages/Deals";
import DealDetail from "./pages/DealDetail";
import DealRedeem from "./pages/DealRedeem";
import Pricing from "./pages/Pricing";
import Blog from "./pages/Blog";
import Invite from "./pages/Invite";
import Compare from "./pages/Compare";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;