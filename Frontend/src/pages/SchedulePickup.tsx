import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Truck, Smartphone, Download, Clock, MapPin, Calendar, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SchedulePickup = () => {
  const [showAppModal, setShowAppModal] = useState(false);

  const features = [
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Flexible Scheduling",
      description: "Schedule pickups at your convenience - same day or advance booking"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Real-time Tracking",
      description: "Track your pickup agent in real-time with live GPS updates"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Doorstep Pickup",
      description: "Our agents will collect packages directly from your location"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Instant Confirmation",
      description: "Get instant booking confirmation with pickup details"
    }
  ];

  const steps = [
    {
      step: "1",
      title: "Download DaakBox App",
      description: "Get our mobile app from Play Store or App Store"
    },
    {
      step: "2",
      title: "Create Account & Login",
      description: "Sign up with your mobile number and verify OTP"
    },
    {
      step: "3",
      title: "Schedule Pickup",
      description: "Select pickup location, time slot, and package details"
    },
    {
      step: "4",
      title: "Track & Confirm",
      description: "Track your pickup agent and get instant confirmation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        {/* Hero Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Schedule Your Pickup
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Book doorstep pickup with our mobile app. Fast, convenient, and reliable 
                package collection right from your location.
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowAppModal(true)}
                  className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-8 py-4 text-lg
                           hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-red/25"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Download DaakBox App
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-background/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Why Choose DaakBox Pickup?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience hassle-free package pickup with our advanced mobile app
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="border-2 border-brand-red bg-card-light h-full hover:shadow-lg 
                                 transition-all duration-200 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="text-brand-red">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                How to Schedule Pickup
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to book your pickup
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <Card className="border-2 border-brand-red bg-card-light h-full text-center">
                      <CardContent className="p-6">
                        <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center 
                                      justify-center mx-auto mb-4 font-bold text-lg">
                          {step.step}
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-brand-red/10 to-brand-red/5">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Schedule Your Pickup?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Download our app now and experience the convenience of doorstep pickup
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => setShowAppModal(true)}
                  className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-8 py-4 text-lg
                           hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-red/25"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Get DaakBox App
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* App Download Modal */}
      <Dialog open={showAppModal} onOpenChange={setShowAppModal}>
        <DialogContent className="border-2 border-brand-red bg-card-light">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-brand-red" />
              Download DaakBox App
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="text-center">
              <Truck className="w-16 h-16 text-brand-red mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Get the DaakBox Mobile App</h3>
              <p className="text-muted-foreground">
                Download our app to schedule pickups, track packages, and manage your shipments on the go.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="w-full bg-success hover:bg-success/90 text-white font-semibold py-3"
                  onClick={() => {
                    // TODO: Replace with actual Play Store link
                    window.open("https://play.google.com/store", "_blank");
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Play Store
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  className="w-full bg-foreground hover:bg-foreground/90 text-background font-semibold py-3"
                  onClick={() => {
                    // TODO: Replace with actual App Store link
                    window.open("https://apps.apple.com", "_blank");
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  App Store
                </Button>
              </motion.div>
            </div>

            <div className="bg-background/50 rounded-lg p-4 text-sm text-muted-foreground">
              <p className="font-medium mb-2">App Features:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Schedule pickup with date & time selection</li>
                <li>Real-time agent tracking</li>
                <li>Package details and documentation</li>
                <li>Instant booking confirmation</li>
                <li>Payment integration</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default SchedulePickup;