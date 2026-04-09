import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/lib/runtime";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        toast.error("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Send to backend
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Failed to send message: ${res.status}`);
      }

      const data = await res.json();
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("Failed to send message. Please try emailing us directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-20 lg:py-28 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Get in Touch</h1>
          <p className="text-base sm:text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Have questions about PerksNest? Our team is here to help. Reach out to us anytime.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 md:mb-16">
            {/* Email */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email Us</h3>
              <p className="text-muted-foreground text-sm mb-3">We typically respond within 2 hours</p>
              <a href="mailto:hello@perksnest.co" className="text-primary font-medium hover:underline">
                hello@perksnest.co
              </a>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Call Us</h3>
              <p className="text-gray-600 mb-3">Monday–Friday, 9 AM–6 PM EST</p>
              <a href="tel:+14155551234" className="text-primary font-medium hover:underline">
                +1 (415) 555-1234
              </a>
            </div>

            {/* Live Chat */}
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
              <p className="text-gray-600 mb-3">San Francisco, CA</p>
              <p className="text-primary font-medium">Stirring Minds LLC</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <h2 className="text-2xl font-bold text-foreground mb-8">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@company.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 h-auto gap-2 flex items-center justify-center"
                >
                  {loading ? "Sending..." : "Send Message"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </Button>
                <p className="text-center text-sm text-gray-600">
                  We typically respond within 2 business hours
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">Quick Help</h2>
            <p className="text-gray-600">Check out our resources to find answers faster</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/help" className="p-6 bg-white border border-gray-200 rounded-xl hover:border-primary transition">
              <h3 className="font-semibold text-lg mb-2">Help Center</h3>
              <p className="text-gray-600 text-sm">Browse FAQs and documentation</p>
            </Link>
            <Link to="/pricing" className="p-6 bg-white border border-gray-200 rounded-xl hover:border-primary transition">
              <h3 className="font-semibold text-lg mb-2">Pricing</h3>
              <p className="text-gray-600 text-sm">Compare our plans and features</p>
            </Link>
            <Link to="/white-label" className="p-6 bg-white border border-gray-200 rounded-xl hover:border-primary transition">
              <h3 className="font-semibold text-lg mb-2">White-Label Program</h3>
              <p className="text-gray-600 text-sm">Learn about enterprise solutions</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
