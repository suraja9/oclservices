import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Timeline } from "./Timeline";
import { WhatsAppModal } from "./WhatsAppModal";
import { 
  Package, 
  MapPin, 
  Clock, 
  Weight, 
  Truck,
  CheckCircle,
  AlertCircle,
  MessageCircle
} from "lucide-react";

interface Shipment {
  awb: string;
  status: string;
  origin: string;
  destination: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  weight: string;
  service: string;
  timeline: {
    status: string;
    location: string;
    timestamp: string;
    description: string;
  }[];
}

interface TrackingResultCardProps {
  shipment: Shipment;
  index: number;
}

export const TrackingResultCard: React.FC<TrackingResultCardProps> = ({ shipment, index }) => {
  const [showTimeline, setShowTimeline] = useState(false);
  const [whatsappSubscribe, setWhatsappSubscribe] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'in transit':
        return <Truck className="w-5 h-5 text-primary" />;
      case 'processing':
        return <Package className="w-5 h-5 text-warning" />;
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-success text-success-foreground';
      case 'in transit':
        return 'bg-primary text-primary-foreground';
      case 'processing':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const handleWhatsappSubscribe = (checked: boolean) => {
    setWhatsappSubscribe(checked);
    if (checked) {
      setShowWhatsappModal(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="border-2 border-brand-red bg-card-light shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <Package className="w-6 h-6 text-brand-red" />
              <span className="text-xl font-bold">AWB: {shipment.awb}</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              {getStatusIcon(shipment.status)}
              <Badge className={getStatusColor(shipment.status)}>
                {shipment.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Shipment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red" />
                <span className="text-sm text-muted-foreground">Origin:</span>
                <span className="font-medium">{shipment.origin}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-red" />
                <span className="text-sm text-muted-foreground">Destination:</span>
                <span className="font-medium">{shipment.destination}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Weight className="w-4 h-4 text-brand-red" />
                <span className="text-sm text-muted-foreground">Weight:</span>
                <span className="font-medium">{shipment.weight}</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-brand-red" />
                <span className="text-sm text-muted-foreground">Service:</span>
                <span className="font-medium">{shipment.service}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          {(shipment.estimatedDelivery || shipment.actualDelivery) && (
            <div className="bg-background/50 rounded-lg p-4 border border-brand-red/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-brand-red" />
                <span className="font-medium">Delivery Information</span>
              </div>
              <div className="space-y-1 text-sm">
                {shipment.estimatedDelivery && (
                  <p>
                    <span className="text-muted-foreground">Estimated:</span>{' '}
                    {formatDate(shipment.estimatedDelivery)}
                  </p>
                )}
                {shipment.actualDelivery && (
                  <p>
                    <span className="text-muted-foreground">Delivered:</span>{' '}
                    <span className="text-success font-medium">
                      {formatDate(shipment.actualDelivery)}
                    </span>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* WhatsApp Subscription */}
          <div className="flex items-center space-x-2 p-3 bg-background/30 rounded-lg border border-brand-red/20">
            <Checkbox
              id={`whatsapp-${shipment.awb}`}
              checked={whatsappSubscribe}
              onCheckedChange={handleWhatsappSubscribe}
            />
            <label htmlFor={`whatsapp-${shipment.awb}`} className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <MessageCircle className="w-4 h-4 text-success" />
              Subscribe for WhatsApp updates
            </label>
          </div>

          {/* Timeline Toggle */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={() => setShowTimeline(!showTimeline)}
              className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white transition-colors duration-300"
            >
              {showTimeline ? 'Hide' : 'Show'} Tracking Timeline
            </Button>
          </motion.div>

          {/* Timeline */}
          {showTimeline && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Timeline timeline={shipment.timeline} />
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={showWhatsappModal}
        onClose={() => setShowWhatsappModal(false)}
        shipment={shipment}
      />
    </motion.div>
  );
};