import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground text-sm">Last updated: March 1, 2026</p>
        </div>
        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">By accessing or using PerksNest ("the Platform"), you agree to be bound by these Terms of Service. PerksNest is operated by Stirring Minds LLC ("we", "us", "our"). If you do not agree to these terms, please do not use our platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">PerksNest is a curated marketplace connecting startups, entrepreneurs, and growing businesses with software deals, discounts, and credits from technology partners. We act as an intermediary between deal providers ("Partners") and recipients ("Customers").</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Account Registration</h2>
            <p className="text-muted-foreground leading-relaxed">You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your credentials. You must be at least 18 years old. One account per person or organization.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Deals and Redemptions</h2>
            <p className="text-muted-foreground leading-relaxed">All deals are provided by third-party Partners. PerksNest does not guarantee the availability or accuracy of any deal. Claimed deals are non-transferable. One redemption per account per deal unless otherwise stated.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Membership Plans</h2>
            <p className="text-muted-foreground leading-relaxed">PerksNest offers Free and Premium membership plans. Premium plans auto-renew unless cancelled. Refunds available within 14 days of purchase for annual plans if no premium deals have been redeemed. Monthly plans are non-refundable.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Partner Terms</h2>
            <p className="text-muted-foreground leading-relaxed">Partners agree to honor published deal terms for all eligible redemptions. Partners must not submit misleading information. PerksNest may remove deals or suspend accounts that violate these terms.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Prohibited Use</h2>
            <p className="text-muted-foreground leading-relaxed">You may not create multiple accounts to claim deals more than once, share or resell redemption codes, use automated scripts, post false reviews, or attempt to reverse engineer the Platform.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">All content on PerksNest including the name, logo, design, and software is owned by Stirring Minds LLC or licensed to us. You may not reproduce or distribute any content without written permission.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">PerksNest is provided "as is". We are not liable for indirect or consequential damages. Our total liability shall not exceed the amount you paid us in the preceding 12 months.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">These terms are governed by the laws of the State of California, USA. Disputes shall be resolved in the courts of Santa Clara County, California.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">11. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">Questions? Email us at <a href="mailto:legal@perksnest.co" className="text-primary hover:underline">legal@perksnest.co</a></p>
          </section>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex gap-4 text-sm text-muted-foreground">
          <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/" className="hover:text-primary transition-colors">← Back to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
