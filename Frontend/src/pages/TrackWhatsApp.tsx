import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MessageCircle, Phone, Package, ExternalLink, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TrackWhatsApp = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [awbNumber, setAwbNumber] = useState("");
  const [consent, setConsent] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const generateWhatsAppMessage = () => {
    return `🚚 *DaakBox Tracking Request*

📦 *AWB Number:* ${awbNumber}
📱 *Phone:* ${phoneNumber}

I would like to receive WhatsApp updates for my shipment.

Track at: https://daakbox.com/track

Thanks for choosing DaakBox! 📱`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || !awbNumber || !consent) {
      toast({
        title: "Please fill all required fields",
        description: "Phone number, AWB number, and consent are required",
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
    toast({
      title: "Preview Ready!",
      description: "Review your WhatsApp message below",
    });
  };

  const handleWhatsAppOpen = () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent(generateWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // TODO: Replace with Supabase call to save subscription
    toast({
      title: "WhatsApp opened successfully!",
      description: "Your tracking request has been sent",
    });
  };

  const howItWorksSteps = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Enter Details",
      description: "Provide your phone number and AWB number"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Send Request",
      description: "We'll create a WhatsApp message for you"
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: "Get Updates",
      description: "Receive real-time tracking updates on WhatsApp"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft pt-20 pb-16">
      <Navbar />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            WhatsApp Tracking
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant shipment updates directly on your WhatsApp. Stay informed about your package every step of the way.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-success" />
                  WhatsApp Tracking Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number (with country code) *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="border-2 border-brand-red bg-background focus:ring-2 focus:ring-brand-red/50"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Include country code (e.g., +1 for US, +91 for India)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="awb" className="text-sm font-medium">
                      AWB Number *
                    </Label>
                    <Input
                      id="awb"
                      type="text"
                      placeholder="Enter your AWB number"
                      value={awbNumber}
                      onChange={(e) => setAwbNumber(e.target.value)}
                      className="border-2 border-brand-red bg-background focus:ring-2 focus:ring-brand-red/50"
                      required
                    />
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="consent"
                      checked={consent}
                      onCheckedChange={(checked) => setConsent(checked as boolean)}
                      className="border-2 border-brand-red"
                    />
                    <Label htmlFor="consent" className="text-sm leading-5">
                      I consent to receive WhatsApp messages from DaakBox regarding my shipment tracking updates. 
                      Standard message and data rates may apply.
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-success hover:bg-success/90 text-white"
                  >
                    Generate WhatsApp Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Preview Section */}
            {showPreview && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="border-2 border-brand-red bg-card-light">
                  <CardHeader>
                    <CardTitle className="text-lg">Message Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-background/80 p-4 rounded-lg border border-brand-red/30 mb-4">
                      <pre className="text-sm whitespace-pre-wrap font-mono text-muted-foreground">
                        {generateWhatsAppMessage()}
                      </pre>
                    </div>
                    
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleWhatsAppOpen}
                        className="w-full bg-success hover:bg-success/90 text-white flex items-center gap-2"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open WhatsApp
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle>How WhatsApp Tracking Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {howItWorksSteps.map((step, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success border-2 border-success/20">
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{step.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                      </div>
                      {index < howItWorksSteps.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground mt-2" />
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-success/5 rounded-lg border border-success/20">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success mt-0.5" />
                    <div>
                      <h4 className="font-medium text-success">Benefits</h4>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>• Real-time tracking updates</li>
                        <li>• Delivery notifications</li>
                        <li>• Exception alerts</li>
                        <li>• No app installation required</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TrackWhatsApp;