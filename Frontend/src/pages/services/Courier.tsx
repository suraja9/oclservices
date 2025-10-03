import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, Clock, Shield, MapPin, CheckCircle, Package, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import courierTeamImg from "@/assets/courier-team.jpg";
import shippingNetworkImg from "@/assets/shipping-network.jpg";

const Courier = () => {
  const services = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Express Delivery",
      description: "Same-day and next-day delivery for urgent shipments",
      features: ["Same-day pickup", "Priority handling", "Real-time tracking", "Dedicated support"]
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Standard Delivery",
      description: "Reliable delivery within 2-5 business days",
      features: ["Cost-effective", "Nationwide coverage", "Insurance included", "Proof of delivery"]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Courier",
      description: "Enhanced security for valuable and sensitive items",
      features: ["Tamper-proof packaging", "Chain of custody", "Background-verified agents", "Insurance up to ₹1 Lakh"]
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Fast & Reliable",
      description: "On-time delivery with 99% success rate"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Wide Coverage",
      description: "Delivering to 25,000+ pin codes across India"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "24/7 customer support for all your queries"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "100% Transparency",
      description: "Real-time tracking and instant notifications"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Book Online",
      description: "Schedule pickup through our website or mobile app"
    },
    {
      step: "2",
      title: "Package Pickup",
      description: "Our agent collects the package from your location"
    },
    {
      step: "3",
      title: "In Transit",
      description: "Package moves through our secure network"
    },
    {
      step: "4",
      title: "Delivered",
      description: "Safe delivery with proof of delivery confirmation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-brand-red/10 to-brand-red/5">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-brand-red/10 rounded-full flex items-center justify-center">
                  <Truck className="w-10 h-10 text-brand-red" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                Courier Services
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Fast, reliable, and secure courier services for all your delivery needs. 
                From documents to packages, we ensure your items reach their destination safely and on time.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/schedule-pickup">
                    <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-8 py-3 text-lg
                                   hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-red/25">
                      Book Pickup Now
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/rates">
                    <Button variant="outline" className="border-2 border-brand-red text-brand-red hover:bg-brand-red 
                                                      hover:text-white font-semibold px-8 py-3 text-lg">
                      View Rates
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Courier Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from our range of courier services designed to meet your specific delivery requirements
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Card className="border-2 border-brand-red bg-card-light h-full hover:shadow-lg 
                                 transition-all duration-200 hover:scale-105">
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="text-brand-red">
                          {service.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground text-center">{service.description}</p>
                      
                      <div className="space-y-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-success" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-background/50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why Choose DaakBox Courier?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Experience the difference with our professional courier services
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                >
                  <Card className="border-2 border-brand-red bg-card-light h-full text-center
                                 hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="text-brand-red">
                          {benefit.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Simple and straightforward process to get your packages delivered
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-6">
                {process.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="relative">
                      <div className="w-16 h-16 bg-brand-red text-white rounded-full flex items-center 
                                    justify-center mx-auto mb-4 font-bold text-xl">
                        {step.step}
                      </div>
                      {index < process.length - 1 && (
                        <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-brand-red/20 -translate-x-1/2" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
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
              transition={{ delay: 1.6 }}
            >
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to Ship?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Get started with DaakBox courier services today. Fast, reliable, and affordable delivery solutions.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/schedule-pickup">
                    <Button className="bg-brand-red hover:bg-brand-red/90 text-white font-semibold px-8 py-3 text-lg
                                     hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-red/25">
                      Schedule Pickup
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/track">
                    <Button variant="outline" className="border-2 border-brand-red text-brand-red hover:bg-brand-red 
                                                        hover:text-white font-semibold px-8 py-3 text-lg">
                      Track Package
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courier;