import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, MessageCircle, ShoppingCart, Phone, Mail, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  service?: string;
  budget?: string;
}

const StickyTabs = () => {
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [salesOpen, setSalesOpen] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [enquiryFormData, setEnquiryFormData] = useState<FormData>({
    name: "", email: "", phone: "", company: "", message: ""
  });
  const [salesFormData, setSalesFormData] = useState<FormData>({
    name: "", email: "", phone: "", company: "", message: "", service: "", budget: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Color animation - changes every second
  const colors = [
    "from-blue-900 to-blue-700", // Night blue
    "from-primary to-primary/80", // Teal
    "from-purple-900 to-purple-700", // Purple
    "from-indigo-900 to-indigo-700", // Indigo
    "from-slate-900 to-slate-700", // Slate
    "from-cyan-900 to-cyan-700", // Cyan
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Enquiry Submitted Successfully!",
      description: "Thank you for your enquiry. Our team will contact you within 24 hours.",
    });

    setEnquiryFormData({ name: "", email: "", phone: "", company: "", message: "" });
    setEnquiryOpen(false);
    setIsSubmitting(false);
  };

  const handleSalesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Sales Inquiry Submitted Successfully!",
      description: "Thank you for your interest. Our sales team will reach out to you soon.",
    });

    setSalesFormData({ name: "", email: "", phone: "", company: "", message: "", service: "", budget: "" });
    setSalesOpen(false);
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Sticky Tabs */}
      <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-40 flex flex-col gap-2">
        {/* Enquiry Tab */}
        <motion.button
          onClick={() => setEnquiryOpen(true)}
          className={`bg-gradient-to-b ${colors[colorIndex]} text-white px-3 py-6 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex flex-col items-center gap-2 relative z-10">
            <MessageCircle className="h-5 w-5 transform rotate-90" />
            <span className="text-sm font-semibold tracking-wider">ENQUIRY</span>
          </div>
          
          {/* Animated border effect */}
          <div className="absolute left-0 top-0 h-full w-1 bg-white/30 group-hover:bg-white/60 transition-colors duration-300" />
        </motion.button>

        {/* Sales Inquiry Tab */}
        <motion.button
          onClick={() => setSalesOpen(true)}
          className={`bg-gradient-to-b ${colors[(colorIndex + 3) % colors.length]} text-white px-3 py-6 rounded-l-lg shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden`}
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          whileHover={{ x: -5, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex flex-col items-center gap-2 relative z-10">
            <ShoppingCart className="h-5 w-5 transform rotate-90" />
            <span className="text-sm font-semibold tracking-wider">SALES</span>
          </div>
          
          {/* Animated border effect */}
          <div className="absolute left-0 top-0 h-full w-1 bg-white/30 group-hover:bg-white/60 transition-colors duration-300" />
        </motion.button>
      </div>

      {/* Enquiry Modal */}
      <Dialog open={enquiryOpen} onOpenChange={setEnquiryOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="relative">
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              General Enquiry
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-6 w-6 rounded-full"
              onClick={() => setEnquiryOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <form onSubmit={handleEnquirySubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="enquiry-name" className="text-sm font-medium">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="enquiry-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={enquiryFormData.name}
                  onChange={(e) => setEnquiryFormData({...enquiryFormData, name: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="enquiry-email" className="text-sm font-medium">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="enquiry-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={enquiryFormData.email}
                  onChange={(e) => setEnquiryFormData({...enquiryFormData, email: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="enquiry-phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="enquiry-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={enquiryFormData.phone}
                  onChange={(e) => setEnquiryFormData({...enquiryFormData, phone: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="enquiry-company" className="text-sm font-medium">
                Company Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="enquiry-company"
                  type="text"
                  placeholder="Enter your company name"
                  value={enquiryFormData.company}
                  onChange={(e) => setEnquiryFormData({...enquiryFormData, company: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="enquiry-message" className="text-sm font-medium">
                Message *
              </Label>
              <Textarea
                id="enquiry-message"
                placeholder="Please describe your enquiry..."
                value={enquiryFormData.message}
                onChange={(e) => setEnquiryFormData({...enquiryFormData, message: e.target.value})}
                className="border-2 border-primary/30 focus:border-primary min-h-20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 
                       hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/25"
            >
              {isSubmitting ? "Submitting..." : "Submit Enquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sales Inquiry Modal */}
      <Dialog open={salesOpen} onOpenChange={setSalesOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto" onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="relative">
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <ShoppingCart className="h-6 w-6" />
              Sales Inquiry
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-6 w-6 rounded-full"
              onClick={() => setSalesOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <form onSubmit={handleSalesSubmit} className="space-y-4 mt-4">
            <div>
              <Label htmlFor="sales-name" className="text-sm font-medium">
                Full Name *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sales-name"
                  type="text"
                  placeholder="Enter your full name"
                  value={salesFormData.name}
                  onChange={(e) => setSalesFormData({...salesFormData, name: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sales-email" className="text-sm font-medium">
                Email Address *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sales-email"
                  type="email"
                  placeholder="Enter your email address"
                  value={salesFormData.email}
                  onChange={(e) => setSalesFormData({...salesFormData, email: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sales-phone" className="text-sm font-medium">
                Phone Number *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sales-phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={salesFormData.phone}
                  onChange={(e) => setSalesFormData({...salesFormData, phone: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sales-company" className="text-sm font-medium">
                Company Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="sales-company"
                  type="text"
                  placeholder="Enter your company name"
                  value={salesFormData.company}
                  onChange={(e) => setSalesFormData({...salesFormData, company: e.target.value})}
                  className="pl-10 border-2 border-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="sales-service" className="text-sm font-medium">
                Service Interested In *
              </Label>
              <Select onValueChange={(value) => setSalesFormData({...salesFormData, service: value})}>
                <SelectTrigger className="border-2 border-primary/30 focus:border-primary">
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="courier">Courier Services</SelectItem>
                  <SelectItem value="logistics">Logistics Solutions</SelectItem>
                  <SelectItem value="express">Express Delivery</SelectItem>
                  <SelectItem value="international">International Shipping</SelectItem>
                  <SelectItem value="warehousing">Warehousing</SelectItem>
                  <SelectItem value="custom">Custom Solution</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sales-budget" className="text-sm font-medium">
                Monthly Budget Range
              </Label>
              <Select onValueChange={(value) => setSalesFormData({...salesFormData, budget: value})}>
                <SelectTrigger className="border-2 border-primary/30 focus:border-primary">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10k">₹0 - ₹10,000</SelectItem>
                  <SelectItem value="10k-50k">₹10,000 - ₹50,000</SelectItem>
                  <SelectItem value="50k-100k">₹50,000 - ₹1,00,000</SelectItem>
                  <SelectItem value="100k-500k">₹1,00,000 - ₹5,00,000</SelectItem>
                  <SelectItem value="500k+">₹5,00,000+</SelectItem>
                  <SelectItem value="discuss">Discuss Later</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sales-message" className="text-sm font-medium">
                Requirements *
              </Label>
              <Textarea
                id="sales-message"
                placeholder="Please describe your requirements and any specific needs..."
                value={salesFormData.message}
                onChange={(e) => setSalesFormData({...salesFormData, message: e.target.value})}
                className="border-2 border-primary/30 focus:border-primary min-h-20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 
                       hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/25"
            >
              {isSubmitting ? "Submitting..." : "Submit Sales Inquiry"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StickyTabs;
