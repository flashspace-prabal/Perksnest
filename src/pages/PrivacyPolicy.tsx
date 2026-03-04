import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">Last updated: March 1, 2026</p>
        </div>
        <div className="space-y-8 text-foreground">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">We collect information you provide directly:</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>Account information: name, email address, password (hashed)</li>
              <li>Profile information: company name, role, plan type</li>
              <li>Deal activity: deals viewed, claimed, bookmarked, reviewed</li>
              <li>Communications: messages sent through the platform, support requests</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-2">We also collect usage data automatically: pages visited, clicks, device type, browser, IP address, and referral source.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1">
              <li>To provide and improve the PerksNest platform</li>
              <li>To match you with relevant deals and partners</li>
              <li>To send transactional emails (deal confirmations, account updates)</li>
              <li>To send our weekly digest if you subscribe (unsubscribe anytime)</li>
              <li>To prevent fraud and enforce our Terms of Service</li>
              <li>To comply with legal obligations</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
            <p className="text-muted-foreground leading-relaxed">We do not sell your personal data. We share information only:</p>
            <ul className="list-disc pl-5 text-muted-foreground space-y-1 mt-2">
              <li>With Partners when you claim their deal (name, email for redemption)</li>
              <li>With service providers who help us operate the platform (Supabase, Resend)</li>
              <li>When required by law or to protect our legal rights</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">4. Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">We use industry-standard security measures including encrypted data transmission (HTTPS), hashed password storage, and access controls. We self-host our database on secure servers in the EU.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed">You may request to access, correct, or delete your personal data at any time by emailing <a href="mailto:privacy@perksnest.co" className="text-primary hover:underline">privacy@perksnest.co</a>. Account deletion removes all personal data within 30 days.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">6. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">We use essential cookies for session management and localStorage for user preferences. We do not use third-party advertising cookies.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">7. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">PerksNest is not directed at individuals under 18. We do not knowingly collect personal information from minors.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-3">8. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">Privacy questions? Contact us at <a href="mailto:privacy@perksnest.co" className="text-primary hover:underline">privacy@perksnest.co</a> — Stirring Minds LLC, 1320 Avoset Terrace, Sunnyvale, CA 94087</p>
          </section>
        </div>
        <div className="mt-10 pt-6 border-t border-border flex gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/" className="hover:text-primary transition-colors">← Back to Home</Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
