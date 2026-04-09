import { useState } from "react";
import { Book, Key, ShoppingBag, Handshake, Globe, Webhook, Gauge, AlertTriangle, Copy, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sections = [
  { id: "overview", label: "Overview", icon: Book },
  { id: "authentication", label: "Authentication", icon: Key },
  { id: "deals", label: "Deals API", icon: ShoppingBag },
  { id: "partners", label: "Partner API", icon: Handshake },
  { id: "whitelabel", label: "White Label", icon: Globe },
  { id: "webhooks", label: "Webhooks", icon: Webhook },
  { id: "ratelimits", label: "Rate Limits", icon: Gauge },
];

const CodeBlock = ({ code, language = "bash" }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-xl overflow-hidden border border-border/50 my-4">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border/50">
        <span className="text-xs font-mono text-muted-foreground">{language}</span>
        <button onClick={handleCopy} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto bg-foreground/[0.03]">
        <code className="text-sm font-mono text-foreground/90 leading-relaxed">{code}</code>
      </pre>
    </div>
  );
};

const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: "bg-accent/15 text-accent border-accent/20",
    POST: "bg-primary/15 text-primary border-primary/20",
    PUT: "bg-warning/15 text-warning border-warning/20",
    DELETE: "bg-destructive/15 text-destructive border-destructive/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold font-mono border ${colors[method] || ""}`}>
      {method}
    </span>
  );
};

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white">

      <div className="container-wide py-10 md:py-16">
        <div className="flex gap-10">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="sticky top-24">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Documentation</h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollToSection(s.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                      activeSection === s.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <s.icon className="w-4 h-4 flex-shrink-0" />
                    {s.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">PerksNest API Documentation</h1>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              Welcome to the PerksNest API. Build powerful integrations with our platform to manage deals, partners, and white label instances programmatically.
            </p>

            {/* Overview */}
            <section id="overview" className="mb-16">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-foreground mb-2">Base URL</h3>
                  <div className="inline-flex items-center px-4 py-2 rounded-lg bg-muted font-mono text-sm text-foreground">
                    https://api.perksnest.co/v1
                  </div>
                </CardContent>
              </Card>

              <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Quick Start</h3>
              <ol className="space-y-3 text-muted-foreground">
                {[
                  "Generate an API key from your account settings",
                  "Include your API key in the Authorization header",
                  "Make requests to our REST endpoints",
                  "Handle responses in JSON format",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {/* Authentication */}
            <section id="authentication" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Authentication</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                All API requests require authentication using an API key. Include your API key in the Authorization header of each request.
              </p>

              <h3 className="text-lg font-bold text-foreground mb-2">API Key Header</h3>
              <CodeBlock
                language="bash"
                code={`curl -H "Authorization: Bearer pk_live_1234567890abcdef" \\
  https://api.perksnest.co/v1/deals`}
              />

              <Card className="border-warning/30 bg-warning/5 mt-4">
                <CardContent className="pt-4 pb-4 flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    <strong>Security:</strong> Keep your API keys secure. Never expose them in client-side code or public repositories.
                  </p>
                </CardContent>
              </Card>

              <h3 className="text-lg font-bold text-foreground mt-8 mb-2">JWT Specification</h3>
              <p className="text-muted-foreground mb-4">For white label clients, we support JWT tokens for SSO integration:</p>
              <CodeBlock
                language="json"
                code={`{
  "iss": "your-domain.com",
  "sub": "user-id-12345",
  "email": "user@example.com",
  "exp": 1735689600,
  "iat": 1735603200
}`}
              />
            </section>

            {/* Deals API */}
            <section id="deals" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Deals API</h2>
              <p className="text-muted-foreground mb-6">Retrieve and manage deals available on the platform.</p>

              <div className="flex items-center gap-3 mb-4">
                <MethodBadge method="GET" />
                <code className="text-sm font-mono text-foreground">/api/deals</code>
              </div>
              <p className="text-muted-foreground mb-4">Get a list of all active deals with optional filtering.</p>

              <h4 className="font-semibold text-foreground mb-3">Query Parameters</h4>
              <div className="rounded-xl border border-border/50 overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Parameter</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="px-4 py-3 font-mono text-primary">category</td><td className="px-4 py-3 text-muted-foreground">string</td><td className="px-4 py-3 text-muted-foreground">Filter by category</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-primary">limit</td><td className="px-4 py-3 text-muted-foreground">number</td><td className="px-4 py-3 text-muted-foreground">Max results (default: 50)</td></tr>
                    <tr><td className="px-4 py-3 font-mono text-primary">offset</td><td className="px-4 py-3 text-muted-foreground">number</td><td className="px-4 py-3 text-muted-foreground">Pagination offset</td></tr>
                  </tbody>
                </table>
              </div>

              <h4 className="font-semibold text-foreground mb-3">Response Schema</h4>
              <CodeBlock
                language="json"
                code={`{
  "deals": [
    {
      "id": "deal_123",
      "title": "50% off Notion",
      "company": "Notion",
      "category": "Productivity",
      "discount": "50%",
      "description": "Get 50% off Notion for 1 year",
      "regular_price": 96,
      "discounted_price": 48,
      "savings": 48,
      "active": true,
      "partner_id": "partner_456"
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}`}
              />
            </section>

            {/* Partner API */}
            <section id="partners" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Partner API</h2>
              <p className="text-muted-foreground mb-6">Manage partner accounts and deal submissions.</p>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <MethodBadge method="POST" />
                    <code className="text-sm font-mono text-foreground">/api/partners/deals</code>
                  </div>
                  <p className="text-muted-foreground mb-3">Submit a new deal for approval.</p>
                  <CodeBlock
                    language="json"
                    code={`{
  "title": "30% off Premium Plan",
  "company": "Your Company",
  "category": "Developer Tools",
  "discount": "30%",
  "description": "Get 30% off our premium plan for 6 months",
  "regular_price": 99,
  "discounted_price": 69,
  "redemption_url": "https://yourcompany.com/perksnest"
}`}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <MethodBadge method="GET" />
                    <code className="text-sm font-mono text-foreground">/api/partners/deals</code>
                  </div>
                  <p className="text-muted-foreground">Get all deals for the authenticated partner.</p>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <MethodBadge method="PUT" />
                    <code className="text-sm font-mono text-foreground">/api/partners/deals/:id</code>
                  </div>
                  <p className="text-muted-foreground">Update an existing deal.</p>
                </div>
              </div>
            </section>

            {/* White Label */}
            <section id="whitelabel" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">White Label</h2>
              <p className="text-muted-foreground mb-6">Configure and manage white label instances for your organization.</p>

              <h3 className="text-lg font-bold text-foreground mb-3">SSO Flow</h3>
              <ol className="space-y-3 text-muted-foreground mb-6">
                {[
                  "Generate a JWT token with user claims from your auth system",
                  "Redirect user to your white label domain with the token",
                  "PerksNest validates the token and creates/authenticates the user",
                  "User is redirected to the white label instance",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
              <CodeBlock language="url" code="https://perks.yourclient.com/auth/sso?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." />

              <h3 className="text-lg font-bold text-foreground mt-8 mb-3">Configuration</h3>
              <p className="text-muted-foreground mb-4">White label instances can be customized with:</p>
              <ul className="space-y-2 text-muted-foreground">
                {["Custom domain (CNAME record)", "Brand colors and logo", "Custom email templates", "SSO configuration", "Deal visibility controls"].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Webhooks */}
            <section id="webhooks" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Webhooks</h2>
              <p className="text-muted-foreground mb-6">Receive real-time notifications when events occur in your account.</p>

              <h3 className="text-lg font-bold text-foreground mb-3">Available Events</h3>
              <div className="rounded-xl border border-border/50 overflow-hidden mb-6">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Event</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {[
                      ["deal.approved", "Deal approved by admin"],
                      ["deal.rejected", "Deal rejected by admin"],
                      ["deal.claimed", "User claimed a deal"],
                      ["partner.created", "New partner registered"],
                      ["whitelabel.user_joined", "User joined white label instance"],
                    ].map(([event, desc]) => (
                      <tr key={event}>
                        <td className="px-4 py-3 font-mono text-primary">{event}</td>
                        <td className="px-4 py-3 text-muted-foreground">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-3">Payload Example</h3>
              <CodeBlock
                language="json"
                code={`{
  "event": "deal.claimed",
  "timestamp": "2026-03-04T12:34:56Z",
  "data": {
    "deal_id": "deal_123",
    "user_id": "user_456",
    "company": "Notion",
    "discount": "50%"
  }
}`}
              />
            </section>

            {/* Rate Limits */}
            <section id="ratelimits" className="mb-16">
              <h2 className="text-2xl font-bold text-foreground mb-4">Rate Limits</h2>
              <p className="text-muted-foreground mb-6">API requests are rate limited to ensure fair usage and system stability.</p>

              <div className="rounded-xl border border-border/50 overflow-hidden mb-8">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Plan</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Requests/Hour</th>
                      <th className="text-left px-4 py-3 font-semibold text-foreground">Burst</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="px-4 py-3 text-foreground">Free</td><td className="px-4 py-3 text-muted-foreground">1,000</td><td className="px-4 py-3 text-muted-foreground">100/min</td></tr>
                    <tr><td className="px-4 py-3 text-foreground">Pro</td><td className="px-4 py-3 text-muted-foreground">10,000</td><td className="px-4 py-3 text-muted-foreground">500/min</td></tr>
                    <tr><td className="px-4 py-3 text-foreground font-semibold">Enterprise</td><td className="px-4 py-3 text-muted-foreground">100,000</td><td className="px-4 py-3 text-muted-foreground">2,000/min</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-bold text-foreground mb-4">Error Codes</h3>
              <div className="space-y-3">
                {[
                  { code: "429", title: "Too Many Requests", desc: "You've exceeded your rate limit. Wait before making more requests." },
                  { code: "401", title: "Unauthorized", desc: "Invalid or missing API key. Check your Authorization header." },
                  { code: "403", title: "Forbidden", desc: "You don't have permission to access this resource." },
                ].map((err) => (
                  <Card key={err.code} className="border-border/50">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="font-mono text-destructive border-destructive/30">{err.code}</Badge>
                        <span className="font-semibold text-foreground">{err.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{err.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Help CTA */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-8 pb-8 text-center">
                <h3 className="text-xl font-bold text-foreground mb-2">Need Help?</h3>
                <p className="text-muted-foreground mb-6">Have questions about the API? Reach out to our developer support team.</p>
                <Button className="gap-2">
                  Contact Developer Support
                </Button>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

    </div>
  );
};

export default Docs;
