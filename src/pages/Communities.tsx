import { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Building2, ArrowRight, CheckCircle } from "lucide-react";

const Communities = () => {
  const [formData, setFormData] = useState({ name: "", email: "", org: "", size: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.includes("@") || !formData.name) {
      toast.error("Please fill in your name and email");
      return;
    }
    setSubmitted(true);
    toast.success("Thanks! We'll be in touch within 24 hours 🎉");
  };

  const { pathname } = useLocation();
  const isAccelerators = pathname.includes("accelerators");

  const title = isAccelerators ? "Accelerators, Incubators & VCs" : "Communities & Content Creators";
  const subtitle = isAccelerators
    ? "Empower your portfolio companies with exclusive SaaS perks. White-label our platform under your brand."
    : "Reward your community with exclusive SaaS deals. Add real value to your membership.";
  const icon = isAccelerators ? Building2 : Users;
  const Icon = icon;

  const benefits = isAccelerators ? [
    "White-label platform under your brand",
    "All 563+ deals for your portfolio companies",
    "Custom deal additions for your ecosystem",
    "Dedicated account manager",
    "Portfolio performance analytics",
    "Co-marketing opportunities",
  ] : [
    "White-label platform with your branding",
    "Exclusive deals for your community members",
    "Referral revenue share program",
    "Custom landing pages per creator",
    "Audience growth tools built-in",
    "Priority support & onboarding",
  ];

  return (
    <div className="min-h-screen bg-white">
      <main className="py-20">
        <div className="container max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{title}</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-card border rounded-2xl p-8">
              <h2 className="text-xl font-bold mb-6">What's included</h2>
              <ul className="space-y-3">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Get a custom quote</h2>
                <p className="text-muted-foreground mb-6">Pricing is based on community size and deal volume. Book a 30-minute demo and we'll build a custom package for you.</p>
              </div>
              <div className="space-y-3">
                <Button className="w-full gap-2" size="lg" onClick={() => window.location.href = "mailto:partnerships@perksnest.co"}>
                  <a href="mailto:hello@perksnest.co?subject=Demo Request" className="flex items-center gap-2">Book a demo <ArrowRight className="w-4 h-4" /></a>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/pricing">View standard pricing</Link>
                </Button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-4">Already have a standard account?</p>
            <Link to="/deals" className="text-primary hover:underline font-medium">Browse all deals →</Link>
          </div>
        </div>
      <div className="max-w-lg mx-auto px-4 pb-10">
          <div className="bg-card border border-border rounded-2xl p-6">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-3">
                <h3 className="font-semibold text-foreground text-center mb-4">Book a Free Demo</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input placeholder="Your name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  <Input type="email" placeholder="Work email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                  <Input placeholder="Organisation name" value={formData.org} onChange={e => setFormData({...formData, org: e.target.value})} />
                  <Input placeholder="Community size" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} />
                </div>
                <Button type="submit" className="w-full gap-2 h-11">
                  <ArrowRight className="h-4 w-4" /> Request Demo
                </Button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">🎉</div>
                <p className="text-sm text-muted-foreground">We will reach out to {formData.email} within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
        </main>
    </div>
  );
};

export default Communities;
