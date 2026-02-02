import { Link } from "react-router-dom";
import { Mail, Twitter, Linkedin, Github } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "/pricing" },
    { name: "Deals", href: "/deals" },
    { name: "Enterprise", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ],
  resources: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Developers", href: "#" },
  ],
  portals: [
    { name: "Customer Portal", href: "/portal/customer" },
    { name: "Partner Portal", href: "/portal/partner" },
    { name: "Admin Portal", href: "/portal/admin" },
    { name: "H1 Demo", href: "/h1" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Security", href: "#" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "#" },
  { name: "LinkedIn", icon: Linkedin, href: "#" },
  { name: "GitHub", icon: Github, href: "#" },
  { name: "Email", icon: Mail, href: "#" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center mb-4">
              <span className="font-bold text-lg text-background">perksnest.</span>
            </div>
            <p className="text-background/70 text-sm mb-6">
              The #1 platform for exclusive SaaS deals. Save big on the tools you love.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 rounded-lg bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Portals Links */}
          <div>
            <h4 className="font-semibold mb-4">Portals</h4>
            <ul className="space-y-3">
              {footerLinks.portals.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-background/60 text-sm">
              © 2026 PerksNest. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-background/60 text-sm">Made with</span>
              <span className="text-slack-red">❤️</span>
              <span className="text-background/60 text-sm">for startups worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
