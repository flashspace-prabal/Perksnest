import { Link, useLocation } from "react-router-dom";
import { Instagram, Linkedin, ArrowRight } from "lucide-react";

const footerLinks = {
  products: [
    { name: "Browse Deals", href: "/deals" },
    { name: "SaaS Perks", href: "/deals" },
    { name: "Pricing", href: "/pricing" },
    { name: "Featured Picks", href: "/deals" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "mailto:hello@perksnest.co" },
    { name: "Press", href: "/press" },
    { name: "Careers", href: "/careers" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/privacy" },
  ],
};

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.965 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
  </svg>
);

const socialLinks = [
  { name: "X", icon: XIcon, href: "https://x.com/perksnest" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/perksnest" },
  { name: "Instagram", icon: Instagram, href: "https://instagram.com/perksnest" },
];

const MainFooter = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-14 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tighter mb-6 inline-block">
              perksnest.
            </Link>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">
              Scaling your startup shouldn't be expensive. We negotiate the best perks so you can focus on growth.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#5c2169] hover:text-white hover:bg-white/5"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([name, links]) => (
            <div key={name} className="col-span-1">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">{name}</h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 PerksNest by Stirring Minds LLC. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-ping" />
              <span className="text-xs text-gray-400 font-medium">All systems operational</span>
            </div>
            <Link to="/signup" className="flex items-center gap-2 text-xs font-bold text-[#5c2169] group">
              Join the ecosystem
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MainFooter;
