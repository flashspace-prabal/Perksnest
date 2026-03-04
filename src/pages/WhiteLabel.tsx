import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Globe,
  Zap,
  Shield,
  Users,
  BarChart3,
  Palette,
  Check,
} from "lucide-react";

const WhiteLabel = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    size: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("https://api.perksnest.co/api/notify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "white_label_inquiry",
          to: "pranav@stirringminds.com",
          name: formData.name,
          dealName: formData.company,
          reason: `Role: ${formData.role}, Size: ${formData.size}, Contact: ${formData.email}`,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when dialog closes
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          company: "",
          role: "",
          size: "",
        });
      }, 300);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-purple-800 text-white py-24 lg:py-32">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Power Your Community with Exclusive SaaS Deals
            </h1>
            <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Offer 500+ exclusive SaaS deals to your portfolio companies,
              community members, or employees with our white-label platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8"
                  >
                    Book a Demo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Book a Demo</DialogTitle>
                  </DialogHeader>
                  {!isSubmitted ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          placeholder="John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="john@company.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company *</Label>
                        <Input
                          id="company"
                          required
                          value={formData.company}
                          onChange={(e) =>
                            setFormData({ ...formData, company: e.target.value })
                          }
                          placeholder="Acme Inc."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Select
                          required
                          value={formData.role}
                          onValueChange={(value) =>
                            setFormData({ ...formData, role: value })
                          }
                        >
                          <SelectTrigger id="role">
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VC/Accelerator">
                              VC/Accelerator
                            </SelectItem>
                            <SelectItem value="Community Leader">
                              Community Leader
                            </SelectItem>
                            <SelectItem value="HR/People Ops">
                              HR/People Ops
                            </SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="size">Community Size *</Label>
                        <Select
                          required
                          value={formData.size}
                          onValueChange={(value) =>
                            setFormData({ ...formData, size: value })
                          }
                        >
                          <SelectTrigger id="size">
                            <SelectValue placeholder="Select community size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="<1K">&lt;1K</SelectItem>
                            <SelectItem value="1-10K">1-10K</SelectItem>
                            <SelectItem value="10-50K">10-50K</SelectItem>
                            <SelectItem value="50K+">50K+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Request"}
                      </Button>
                    </form>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        Thank you!
                      </h3>
                      <p className="text-muted-foreground">
                        We'll be in touch soon.
                      </p>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8"
                >
                  See How It Works
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-wide">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-gray-600">Exclusive Deals</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                150K+
              </div>
              <div className="text-gray-600">Active Members</div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                $50K
              </div>
              <div className="text-gray-600">Average Savings</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get your white-label perks platform up and running in days, not
              months
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Deals</h3>
              <p className="text-muted-foreground">
                Select from our curated library of 500+ exclusive SaaS deals or
                let us manage the entire catalog for you
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">
                White-Label Setup
              </h3>
              <p className="text-muted-foreground">
                We customize the platform with your branding, domain, and SSO
                integration
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Launch & Support</h3>
              <p className="text-muted-foreground">
                Go live in days with ongoing support and regular deal updates
                from our team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to deliver value to your community
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Globe className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Custom Domain</h3>
              <p className="text-muted-foreground">
                Host the platform on your own domain with full SSL support and
                custom branding
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">SSO Integration</h3>
              <p className="text-muted-foreground">
                Seamlessly integrate with your existing authentication system
                using SAML or OAuth
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Zap className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Deal Curation</h3>
              <p className="text-muted-foreground">
                Choose which deals to feature or let our team handle curation
                based on your audience
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Team Management</h3>
              <p className="text-muted-foreground">
                Manage user access, permissions, and member onboarding with
                built-in admin tools
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Analytics Dashboard
              </h3>
              <p className="text-muted-foreground">
                Track engagement, popular deals, and ROI with comprehensive
                analytics and reporting
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <Palette className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                White-Label Branding
              </h3>
              <p className="text-muted-foreground">
                Fully customize colors, logos, and messaging to match your
                brand identity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Who Is This For?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trusted by leading organizations worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-purple-900">
                VCs & Accelerators
              </h3>
              <p className="text-purple-800 mb-4">
                Provide immediate value to your portfolio companies with
                exclusive deals that help them scale faster and save on tools
                they need.
              </p>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Differentiate your program</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Increase portfolio success</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Track engagement metrics</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-purple-900">
                Communities & DAOs
              </h3>
              <p className="text-purple-800 mb-4">
                Monetize your community and add member value with exclusive
                perks that drive engagement and retention.
              </p>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>New revenue stream</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Boost member engagement</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Strengthen community value</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
              <h3 className="text-2xl font-bold mb-4 text-purple-900">
                Enterprise HR
              </h3>
              <p className="text-purple-800 mb-4">
                Enhance your employee benefits package with valuable SaaS deals
                that improve productivity and satisfaction.
              </p>
              <ul className="space-y-2 text-purple-800">
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Attract top talent</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Improve employee satisfaction</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Cost-effective benefits</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tailored to your organization's needs
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-purple-600">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  Custom Pricing
                </div>
                <p className="text-muted-foreground">
                  Based on your community size and requirements
                </p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Full white-label customization</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Access to 500+ SaaS deals</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Custom domain & SSO</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Advanced analytics dashboard</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Dedicated account manager</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Priority support (SLA)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-purple-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span>Regular deal updates</span>
                </li>
              </ul>
              <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6">
                    Book a Demo
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container-wide">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">
                  How long does setup take?
                </AccordionTrigger>
                <AccordionContent>
                  Most white-label implementations are completed within 2-4
                  weeks. This includes custom branding, domain configuration,
                  SSO integration, and team onboarding. We'll work with your
                  timeline to ensure a smooth launch.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">
                  What does white-label pricing include?
                </AccordionTrigger>
                <AccordionContent>
                  Our white-label pricing is customized based on your community
                  size and specific needs. It includes platform access, full
                  customization, ongoing support, regular deal updates, and
                  analytics. Contact us for a detailed quote tailored to your
                  organization.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">
                  Can we choose which deals to offer?
                </AccordionTrigger>
                <AccordionContent>
                  Yes, you have complete control over which deals appear on
                  your platform. You can manually curate deals, or we can
                  manage the entire catalog based on your audience preferences
                  and industry focus. You can update your deal selection at any
                  time.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">
                  How does the integration work?
                </AccordionTrigger>
                <AccordionContent>
                  We support multiple integration options including SSO via
                  SAML or OAuth, API access for custom implementations, and
                  embeddable widgets. Our team handles the technical setup and
                  provides documentation for your developers. We also offer
                  white-glove integration support.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">
                  What kind of support do you provide?
                </AccordionTrigger>
                <AccordionContent>
                  Enterprise clients receive a dedicated account manager,
                  priority support with SLA guarantees, regular business
                  reviews, and proactive deal recommendations. We also provide
                  training materials, ongoing platform updates, and technical
                  support for your team and members.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-purple-100 mb-8">
              Join 500+ organizations delivering value to their communities with
              our white-label platform.
            </p>
            <Dialog open={open} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-12 py-6"
                >
                  Book a Demo Today
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WhiteLabel;
