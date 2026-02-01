import { Mail, Twitter, Linkedin, Github } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#pricing" },
    { name: "Deals", href: "#" },
    { name: "Enterprise", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
  ],
  resources: [
    { name: "Help Center", href: "#" },
    { name: "Community", href: "#" },
    { name: "Partners", href: "#" },
    { name: "Developers", href: "#" },
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <svg width="24" height="24" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.712 35.746c0 3.218-2.61 5.828-5.828 5.828-3.219 0-5.829-2.61-5.829-5.828 0-3.219 2.61-5.829 5.829-5.829h5.828v5.829z" fill="#E01E5A"/>
                <path d="M22.608 35.746c0-3.219 2.61-5.829 5.828-5.829 3.219 0 5.829 2.61 5.829 5.829v14.571c0 3.218-2.61 5.828-5.829 5.828-3.218 0-5.828-2.61-5.828-5.828V35.746z" fill="#E01E5A"/>
                <path d="M28.436 19.712c-3.218 0-5.828-2.61-5.828-5.828 0-3.219 2.61-5.829 5.828-5.829 3.219 0 5.829 2.61 5.829 5.829v5.828h-5.829z" fill="#36C5F0"/>
                <path d="M28.436 22.608c3.219 0 5.829 2.61 5.829 5.828 0 3.219-2.61 5.829-5.829 5.829H13.884c-3.218 0-5.828-2.61-5.828-5.829 0-3.218 2.61-5.828 5.828-5.828h14.552z" fill="#36C5F0"/>
                <path d="M44.471 28.436c0-3.218 2.61-5.828 5.828-5.828 3.219 0 5.829 2.61 5.829 5.828 0 3.219-2.61 5.829-5.829 5.829h-5.828v-5.829z" fill="#2EB67D"/>
                <path d="M41.575 28.436c0 3.219-2.61 5.829-5.829 5.829-3.218 0-5.828-2.61-5.828-5.829V13.884c0-3.218 2.61-5.828 5.828-5.828 3.219 0 5.829 2.61 5.829 5.828v14.552z" fill="#2EB67D"/>
                <path d="M35.746 44.471c3.219 0 5.829 2.61 5.829 5.828 0 3.219-2.61 5.829-5.829 5.829-3.218 0-5.828-2.61-5.828-5.829v-5.828h5.828z" fill="#ECB22E"/>
                <path d="M35.746 41.575c-3.218 0-5.828-2.61-5.828-5.829 0-3.218 2.61-5.828 5.828-5.828h14.571c3.218 0 5.828 2.61 5.828 5.828 0 3.219-2.61 5.829-5.828 5.829H35.746z" fill="#ECB22E"/>
              </svg>
              <span className="font-bold text-lg">PerksNest</span>
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
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
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
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
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
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
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
                  <a href={link.href} className="text-background/70 hover:text-background text-sm transition-colors">
                    {link.name}
                  </a>
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