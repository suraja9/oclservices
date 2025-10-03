import React, { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { TrackingForm } from "@/components/TrackingForm";
import { TrackingResultCard } from "@/components/TrackingResultCard";
import { Card, CardContent } from "@/components/ui/card";
import { Package, AlertCircle, Loader2 } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import shipmentsData from "@/data/shipments.json";
import supportCenter from "@/assets/support-center.jpg";

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

const Track = () => {
  const [results, setResults] = useState<Shipment[]>([]);
  const [notFound, setNotFound] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const titleAnimation = useScrollAnimation();
  const formAnimation = useScrollAnimation({ delay: 200 });
  const resultsAnimation = useScrollAnimation({ delay: 300 });

  const handleTrack = async (awbs: string[]) => {
    setIsLoading(true);
    setHasSearched(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // TODO: Replace with Supabase call
      // const response = await fetch(`/api/track?awb=${awbs.join(',')}`);
      
      const foundShipments: Shipment[] = [];
      const notFoundAwbs: string[] = [];
      
      awbs.forEach(awb => {
        const shipment = (shipmentsData.shipments as any)[awb];
        if (shipment) {
          foundShipments.push(shipment);
        } else {
          notFoundAwbs.push(awb);
        }
      });
      
      setResults(foundShipments);
      setNotFound(notFoundAwbs);
    } catch (error) {
      console.error('Error tracking shipments:', error);
      setResults([]);
      setNotFound(awbs);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url(${supportCenter})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <Navbar />
      
      <main className="flex-1 pt-16 relative z-10">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-background to-background-soft">
          <div className="container mx-auto px-4 text-center">
            <div ref={titleAnimation.ref} className={`transition-all duration-700 ${titleAnimation.className}`}>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                Track & Trace
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
                Enter your AWB number below to track your package in real-time. 
                Get detailed updates on your shipment's journey from pickup to delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Tracking Form Section */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div ref={formAnimation.ref} className={`transition-all duration-700 ${formAnimation.className}`}>
              <TrackingForm onTrack={handleTrack} isLoading={isLoading} />
            </div>
          </div>
        </section>

        {/* Loading Section */}
        {isLoading && (
          <section className="py-8">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center space-y-4"
              >
                <Loader2 className="w-12 h-12 animate-spin text-brand-red" />
                <p className="text-lg text-muted-foreground">
                  Tracking your packages...
                </p>
              </motion.div>
            </div>
          </section>
        )}

        {/* Results Section */}
        {!isLoading && hasSearched && (
          <section className="py-8">
            <div className="container mx-auto px-4">
              <div ref={resultsAnimation.ref} className={`space-y-6 transition-all duration-700 ${resultsAnimation.className}`}>
                {/* Found Results */}
                {results.length > 0 && (
                  <div className="space-y-6">
                    <motion.h2
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="text-2xl font-bold text-foreground mb-6"
                    >
                      Tracking Results ({results.length} found)
                    </motion.h2>
                    
                    <div className="grid gap-6">
                      {results.map((shipment, index) => (
                        <TrackingResultCard
                          key={shipment.awb}
                          shipment={shipment}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Not Found Results */}
                {notFound.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="border-2 border-brand-red bg-card-light">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <AlertCircle className="w-6 h-6 text-warning" />
                          <h3 className="text-lg font-semibold">
                            AWB Numbers Not Found
                          </h3>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          {notFound.map((awb, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2 text-sm text-muted-foreground"
                            >
                              <Package className="w-4 h-4" />
                              <span className="font-mono">{awb}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-background/50 rounded-lg p-4 text-sm text-muted-foreground">
                          <p className="mb-2">
                            <strong>Possible reasons:</strong>
                          </p>
                          <ul className="list-disc list-inside space-y-1">
                            <li>AWB number might be incorrect or incomplete</li>
                            <li>Package might not be in our system yet</li>
                            <li>There might be a delay in data synchronization</li>
                          </ul>
                          <p className="mt-3">
                            <strong>Try:</strong> Double-check the AWB number or contact our support team.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* No Results */}
                {results.length === 0 && notFound.length === 0 && hasSearched && !isLoading && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Card className="border-2 border-brand-red bg-card-light max-w-md mx-auto">
                      <CardContent className="p-8">
                        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
                        <p className="text-muted-foreground">
                          Please check your AWB number and try again.
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Track;