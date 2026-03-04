import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const sectionsRef = useRef<{ [key: string]: HTMLElement | null }>({});

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "authentication", label: "Authentication" },
    { id: "deals-api", label: "Deals API" },
    { id: "partner-api", label: "Partner API" },
    { id: "white-label", label: "White Label" },
    { id: "webhooks", label: "Webhooks" },
    { id: "rate-limits", label: "Rate Limits" },
  ];

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -35% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.values(sectionsRef.current).forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = sectionsRef.current[sectionId];
    if (section) {
      const headerOffset = 100;
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language, id }: { code: string; language: string; id: string }) => (
    <div className="relative group">
      <pre className="bg-[#1e1e2e] text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => copyToClipboard(code, id)}
      >
        {copiedCode === id ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 container-wide py-8">
        <div className="flex gap-8">
          {/* Sticky Sidebar */}
          <aside className="w-64 shrink-0">
            <nav className="sticky top-24 space-y-1">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                Documentation
              </h3>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-purple-600 text-white font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-4xl">
            <div className="space-y-12">
              {/* Overview */}
              <section
                id="overview"
                ref={(el) => (sectionsRef.current.overview = el)}
                className="scroll-mt-24"
              >
                <h1 className="text-4xl font-bold mb-4">PerksNest API Documentation</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  Welcome to the PerksNest API. Build powerful integrations with our platform to
                  manage deals, partners, and white label instances programmatically.
                </p>
                <div className="bg-muted/50 border rounded-lg p-6 mb-6">
                  <h3 className="font-semibold mb-2">Base URL</h3>
                  <code className="text-sm bg-[#1e1e2e] text-gray-100 px-3 py-1 rounded">
                    https://api.perksnest.co/v1
                  </code>
                </div>
                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-semibold mt-6 mb-3">Quick Start</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Generate an API key from your account settings</li>
                    <li>Include your API key in the Authorization header</li>
                    <li>Make requests to our REST endpoints</li>
                    <li>Handle responses in JSON format</li>
                  </ol>
                </div>
              </section>

              {/* Authentication */}
              <section
                id="authentication"
                ref={(el) => (sectionsRef.current.authentication = el)}
                className="scroll-mt-24"
              >
                <h2 className="text-3xl font-bold mb-4">Authentication</h2>
                <p className="text-muted-foreground mb-6">
                  All API requests require authentication using an API key. Include your API key in
                  the Authorization header of each request.
                </p>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">API Key Header</h3>
                    <CodeBlock
                      id="auth-header"
                      language="bash"
                      code={`curl -H "Authorization: Bearer pk_live_1234567890abcdef" \\
  https://api.perksnest.co/v1/deals`}
                    />
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      <strong>Security:</strong> Keep your API keys secure. Never expose them in
                      client-side code or public repositories.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3">JWT Specification</h3>
                    <p className="text-muted-foreground mb-3">
                      For white label clients, we support JWT tokens for SSO integration:
                    </p>
                    <CodeBlock
                      id="jwt-example"
                      language="json"
                      code={`{
  "iss": "your-domain.com",
  "sub": "user-id-12345",
  "email": "user@example.com",
  "exp": 1735689600,
  "iat": 1735603200
}`}
                    />
                  </div>
                </div>
              </section>

              {/* Deals API */}
              <section
                id="deals-api"
                ref={(el) => (sectionsRef.current["deals-api"] = el)}
                className="scroll-mt-24"
              >
                <h2 className="text-3xl font-bold mb-4">Deals API</h2>
                <p className="text-muted-foreground mb-6">
                  Retrieve and manage deals available on the platform.
                </p>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-semibold rounded">
                        GET
                      </span>
                      <code className="text-sm">/api/deals</code>
                    </div>
                    <p className="text-muted-foreground mb-3">
                      Get a list of all active deals with optional filtering.
                    </p>
                    <h4 className="font-semibold text-sm mb-2">Query Parameters</h4>
                    <div className="border rounded-lg overflow-hidden mb-4">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 font-semibold">Parameter</th>
                            <th className="text-left p-3 font-semibold">Type</th>
                            <th className="text-left p-3 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="p-3">
                              <code>category</code>
                            </td>
                            <td className="p-3 text-muted-foreground">string</td>
                            <td className="p-3 text-muted-foreground">Filter by category</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <code>limit</code>
                            </td>
                            <td className="p-3 text-muted-foreground">number</td>
                            <td className="p-3 text-muted-foreground">Max results (default: 50)</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <code>offset</code>
                            </td>
                            <td className="p-3 text-muted-foreground">number</td>
                            <td className="p-3 text-muted-foreground">Pagination offset</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <h4 className="font-semibold text-sm mb-2">Response Schema</h4>
                    <CodeBlock
                      id="deals-response"
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
                  </div>
                </div>
              </section>

              {/* Partner API */}
              <section
                id="partner-api"
                ref={(el) => (sectionsRef.current["partner-api"] = el)}
                className="scroll-mt-24"
              >
                <h2 className="text-3xl font-bold mb-4">Partner API</h2>
                <p className="text-muted-foreground mb-6">
                  Manage partner accounts and deal submissions.
                </p>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold rounded">
                        POST
                      </span>
                      <code className="text-sm">/api/partners/deals</code>
                    </div>
                    <p className="text-muted-foreground mb-3">Submit a new deal for approval.</p>
                    <CodeBlock
                      id="partner-post"
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
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs font-semibold rounded">
                        GET
                      </span>
                      <code className="text-sm">/api/partners/deals</code>
                    </div>
                    <p className="text-muted-foreground">Get all deals for the authenticated partner.</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 text-xs font-semibold rounded">
                        PUT
                      </span>
                      <code className="text-sm">/api/partners/deals/:id</code>
                    </div>
                    <p className="text-muted-foreground">Update an existing deal.</p>
                  </div>
                </div>
              </section>

              {/* White Label */}
              <section
                id="white-label"
                ref={(el) => (sectionsRef.current["white-label"] = el)}
                className="scroll-mt-24"
              >
                <h2 className="text-3xl font-bold mb-4">White Label</h2>
                <p className="text-muted-foreground mb-6">
                  Configure and manage white label instances for your organization.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">SSO Flow</h3>
                    <p className="text-muted-foreground mb-3">
                      White label clients can implement Single Sign-On using JWT tokens:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
                      <li>Generate a JWT token with user claims from your auth system</li>
                      <li>Redirect user to your white label domain with the token</li>
                      <li>PerksNest validates the token and creates/authenticates the user</li>
                      <li>User is redirected to the white label instance</li>
                    </ol>
                    <CodeBlock
                      id="sso-url"
                      language="bash"
                      code={`https://perks.yourclient.com/auth/sso?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Configuration</h3>
                    <p className="text-muted-foreground mb-3">
                      White label instances can be customized with:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>Custom domain (CNAME record)</li>
                      <li>Brand colors and logo</li>
                      <li>Custom email templates</li>
                      <li>SSO configuration</li>
                      <li>Deal visibility controls</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Webhooks */}
              <section
                id="webhooks"
                ref={(el) => (sectionsRef.current.webhooks = el)}
                className="scroll-mt-24"
              >
                <h2 className="text-3xl font-bold mb-4">Webhooks</h2>
                <p className="text-muted-foreground mb-6">
                  Receive real-time notifications when events occur in your account.
                </p>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Available Events</h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-3 font-semibold">Event</th>
                            <th className="text-left p-3 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          <tr>
                            <td className="p-3">
                              <code>deal.approved</code>
                            </td>
                            <td className="p-3 text-muted-foreground">Deal approved by admin</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <code>deal.rejected</code>
                            </td>
                            <td className="p-3 text-muted-foreground">Deal rejected by admin</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <code>deal.claimed</code>
                            </td>
                            <td className="p-3 text-muted-foreground">User claimed a deal</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <code>partner.created</code>
                            </td>
                            <td className="p-3 text-muted-foreground">New partner registered</td>
                          </tr>
                          <tr>
                            <td className="p-3">
                              <code>whitelabel.user_joined</code>
                            </td>
                            <td className="p-3 text-muted-foreground">
                              User joined white label instance
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Payload Example</h3>
                    <CodeBlock
                      id="webhook-payload"
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
                  </div>
                </div>
              </section>

              {/* Rate Limits */}
              <section
                id="rate-limits"
                ref={(el) => (sectionsRef.current["rate-limits"] = el)}
                className="scroll-mt-24"
              >
                <h2 className="text-3xl font-bold mb-4">Rate Limits</h2>
                <p className="text-muted-foreground mb-6">
                  API requests are rate limited to ensure fair usage and system stability.
                </p>
                <div className="space-y-6">
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-3 font-semibold">Plan</th>
                          <th className="text-left p-3 font-semibold">Requests/Hour</th>
                          <th className="text-left p-3 font-semibold">Burst</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-3 font-medium">Free</td>
                          <td className="p-3 text-muted-foreground">1,000</td>
                          <td className="p-3 text-muted-foreground">100/min</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Pro</td>
                          <td className="p-3 text-muted-foreground">10,000</td>
                          <td className="p-3 text-muted-foreground">500/min</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium">Enterprise</td>
                          <td className="p-3 text-muted-foreground">100,000</td>
                          <td className="p-3 text-muted-foreground">2,000/min</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Error Codes</h3>
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4">
                        <code className="text-sm font-semibold">429 Too Many Requests</code>
                        <p className="text-muted-foreground text-sm mt-1">
                          You've exceeded your rate limit. Wait before making more requests.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <code className="text-sm font-semibold">401 Unauthorized</code>
                        <p className="text-muted-foreground text-sm mt-1">
                          Invalid or missing API key. Check your Authorization header.
                        </p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <code className="text-sm font-semibold">403 Forbidden</code>
                        <p className="text-muted-foreground text-sm mt-1">
                          You don't have permission to access this resource.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Footer CTA */}
              <div className="border-t pt-12">
                <div className="text-center space-y-4">
                  <h3 className="text-2xl font-bold">Need Help?</h3>
                  <p className="text-muted-foreground">
                    Have questions about the API? Reach out to our developer support team.
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button asChild>
                      <a href="mailto:dev@perksnest.co">Contact Support</a>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link to="/communities">Join Community</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;
