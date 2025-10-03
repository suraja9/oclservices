import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, ExternalLink, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Shipment {
  awb: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery?: string;
}

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment: Shipment;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose, shipment }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateWhatsAppMessage = () => {
    return `🚚 *DaakBox Tracking Update*

📦 *AWB:* ${shipment.awb}
📍 *Status:* ${shipment.status}
🌍 *Route:* ${shipment.origin} → ${shipment.destination}
${shipment.estimatedDelivery ? `⏰ *Estimated Delivery:* ${new Date(shipment.estimatedDelivery).toLocaleDateString()}` : ''}

Track your package: https://daakbox.com/track

Thanks for choosing DaakBox! 📱`;
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    toast({
      title: "Message copied!",
      description: "WhatsApp message copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter a phone number to continue",
        variant: "destructive",
      });
      return;
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const message = encodeURIComponent(generateWhatsAppMessage());
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    // TODO: Replace with Supabase call to save subscription
    toast({
      title: "WhatsApp subscription activated!",
      description: "You'll receive updates on WhatsApp for this shipment",
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-2 border-brand-red bg-card-light max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-success" />
            WhatsApp Notifications
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number (with country code)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="border-2 border-brand-red bg-background focus:ring-2 focus:ring-brand-red/50"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include your country code (e.g., +1 for US, +91 for India)
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Message Preview:
            </Label>
            <Card className="border border-brand-red/30">
              <CardContent className="p-3">
                <pre className="text-xs whitespace-pre-wrap font-mono text-muted-foreground">
                  {generateWhatsAppMessage()}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopyMessage}
            className="flex items-center gap-2 border-brand-red"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Message'}
          </Button>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleOpenWhatsApp}
              className="bg-success hover:bg-success/90 text-white flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open WhatsApp
            </Button>
          </motion.div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};