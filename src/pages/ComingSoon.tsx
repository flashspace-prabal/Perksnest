import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Rocket, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white px-6">
      <div className="max-w-xl w-full text-center">
        {/* Icon Container */}
        <div className="w-20 h-20 bg-[#5c2169]/10 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-pulse text-[#5c2169]">
          <Rocket className="h-10 w-10" />
        </div>

        {/* Content */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
          We're building something <span className="text-[#5c2169]">special.</span>
        </h1>
        
        <p className="text-lg text-gray-600 mb-10 leading-relaxed">
          This feature is currently under development. We're working hard to bring you the best perks infrastructure for your startup. Join our waitlist to be the first to know when it's live!
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            variant="outline" 
            className="rounded-full px-8 h-12 border-gray-200 hover:border-gray-300 gap-2 flex items-center"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </Button>
          <Link
            to="/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-[#5c2169] hover:bg-[#4a1a52] text-white font-medium rounded-full transition-colors shadow-lg shadow-[#5c2169]/20 h-12"
          >
            Join waitlist
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-16 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Mail className="h-4 w-4" />
          <span>Questions? Email us at <a href="mailto:hello@perksnest.co" className="text-[#5c2169] font-medium hover:underline">hello@perksnest.co</a></span>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
