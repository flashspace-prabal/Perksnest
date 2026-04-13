import { Link, useLocation } from "react-router-dom";
import { Mail, Twitter, Linkedin, Github, ArrowRight } from "lucide-react";

const footerLinks = {
  products: [
    { name: "Browse Deals", href: "/deals" },
    { name: "SaaS Perks", href: "/deals" },
    { name: "Pricing", href: "/pricing" },
    { name: "Featured Picks", href: "/deals" },
  ],
  solutions: [
    { name: "For Startups", href: "/deals" },
    { name: "For Agencies", href: "/deals" },
    { name: "For Developers", href: "/deals" },
    { name: "Success Stories", href: "/deals" },
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

const MainFooter = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-tighter mb-6 inline-block">
              perksnest.
            </Link>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed max-w-xs">
              Scaling your startup shouldn't be expensive. We negotiate the best perks so you can focus on growth.
            </p>
            <div className="flex gap-4">
              <a href="https://twitter.com/perksnest" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="https://linkedin.com/company/perksnest" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="https://github.com/perksnest" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors"><Github className="h-5 w-5" /></a>
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
