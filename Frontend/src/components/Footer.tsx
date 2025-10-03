import { Facebook, Twitter, Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import navData from "@/data/nav.json";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Replace with Supabase integration for newsletter signup
    alert("Newsletter signup coming soon!");
  };

  return (
    <footer className="bg-black border-t-2 border-brand-red text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-2xl font-bold">{navData.logo.text}</h3>
            </div>
            <p className="text-white/80">
              {navData.logo.tagline} - Your trusted partner for fast, secure, and reliable courier services across the globe.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4" />
                <span className="text-sm">support@daakbox.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">123 Logistics Ave, Courier City</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-brand-red pb-2">Services</h4>
            <ul className="space-y-2">
              {navData.navigation.find(nav => nav.label === "Services")?.items?.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href} 
                    className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-brand-red pb-2">Company</h4>
            <ul className="space-y-2">
              {navData.navigation.find(nav => nav.label === "Company")?.items?.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href} 
                    className="text-white/80 hover:text-white transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight className="w-3 h-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold border-b border-brand-red pb-2">Stay Updated</h4>
            <p className="text-white/80 text-sm">
              Subscribe to our newsletter for the latest updates and shipping tips.
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                required
              />
              <Button 
                type="submit" 
                className="w-full bg-brand-red hover:bg-brand-red-dark text-white border-0"
              >
                Subscribe
              </Button>
            </form>

            {/* Social Media */}
            <div className="pt-4">
              <p className="text-sm text-white/80 mb-3">Follow Us</p>
              <div className="flex space-x-3">
                <a 
                  href="https://facebook.com/daakbox" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors duration-200"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://twitter.com/daakbox" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white hover:text-primary transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-yellow-400 border-t border-black/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-black text-sm">
              © {currentYear} DaakBox. All rights reserved. | Privacy Policy | Terms of Service
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-black">
              <span>Powered by DaakBox Logistics Network</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;