import { Link } from "react-router-dom";
import { Mail, Twitter, Linkedin, Github } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "/deals" },
    { name: "Pricing", href: "/pricing" },
    { name: "Deals", href: "/deals" },
],
  company: [
    { name: "About", href: "mailto:hello@perksnest.co?subject=About PerksNest" },
    { name: "Blog", href: "/blog" },
    { name: "Careers", href: "mailto:jobs@perksnest.co?subject=Careers" },
    { name: "Press", href: "mailto:press@perksnest.co?subject=Press Inquiry" },
  ],
  resources: [
    { name: "Help Center", href: "mailto:support@perksnest.co" },
    { name: "Community", href: "/deals" },
    { name: "Become a Partner", href: "/partner" },
],
  portals: [
    { name: "Customer Portal", href: "/customer" },
    { name: "Partner Portal", href: "/partner" },
    { name: "Admin Portal", href: "/admin" },
    { name: "Login", href: "/login" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Security", href: "/" },
  ],
};

const socialLinks = [
  { name: "Twitter", icon: Twitter, href: "https://twitter.com/perksnest" },
  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com/company/perksnest" },
  { name: "GitHub", icon: Github, href: "https://github.com/perksnest" },
  { name: "Email", icon: Mail, href: "mailto:hello@perksnest.co" },
];

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container-wide">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-background/10 pb-12 mb-8">
            <div className="max-w-sm">
                <div className="flex flex-col items-start mb-4">
                  <span className="font-bold text-2xl text-background">perksnest.</span>
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
            <div className="flex flex-col items-start md:items-end gap-6">
               <div className="flex flex-wrap gap-6 text-sm">
                 <Link to="/privacy" className="text-background/70 hover:text-background transition-colors">Privacy Policy</Link>
                 <Link to="/terms" className="text-background/70 hover:text-background transition-colors">Terms of Service</Link>
                 <a href="mailto:hello@perksnest.co" className="text-background/70 hover:text-background transition-colors">Contact Us</a>
               </div>
               <Link to="/signup" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90">
                 Claim Your Deals Now
               </Link>
            </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left text-xs text-background/50">
           <p>© 2026 PerksNest by Stirring Minds LLC. All rights reserved.</p>
           <div className="flex items-center gap-2">
              <span>Made with</span>
              <span className="text-slack-red">❤️</span>
              <span>for startups worldwide</span>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
