import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Warehouse, TruckIcon, BarChart, Globe, CheckCircle, Package, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import shippingNetwork from "@/assets/shipping-network.jpg";

const Logistics = () => {
  const titleAnimation = useScrollAnimation();
  const capabilityAnimations = useStaggeredAnimation(4, 150);
  const serviceAnimations = useStaggeredAnimation(3, 200);
  const industryAnimations = useStaggeredAnimation(4, 150);
  const processAnimations = useStaggeredAnimation(4, 150);
  const ctaAnimation = useScrollAnimation({ delay: 400 });
  const services = [
    {
      icon: <Warehouse className="w-8 h-8" />,
      title: "Warehousing & Storage",
      description: "Secure storage solutions with inventory management",
      features: ["Climate-controlled facilities", "Real-time inventory tracking", "Pick & pack services", "Multi-location storage"]
    },
    {
      icon: <TruckIcon className="w-8 h-8" />,
      title: "Transportation Management",
      description: "End-to-end transportation solutions for bulk shipments",
      features: ["Full truckload (FTL)", "Less than truckload (LTL)", "Multi-modal transport", "Route optimization"]
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: "Supply Chain Analytics",
      description: "Data-driven insights for supply chain optimization",
      features: ["Performance dashboards", "Cost analysis reports", "Demand forecasting", "KPI monitoring"]
    }
  ];

  const industries = [
    {
      name: "E-commerce",
      description: "Fulfillment solutions for online retailers",
      icon: <Globe className="w-6 h-6" />
    },
    {
      name: "Manufacturing",
      description: "Just-in-time delivery for production lines",
      icon: <Package className="w-6 h-6" />
    },
    {
      name: "Retail",
      description: "Store replenishment and distribution",
      icon: <Users className="w-6 h-6" />
    },
    {
      name: "Healthcare",
      description: "Temperature-controlled pharmaceutical logistics",
      icon: <Clock className="w-6 h-6" />
    }
  ];

  const capabilities = [
    {
      title: "Network Coverage",
      value: "500+",
      description: "Warehouses across India"
    },
    {
      title: "Fleet Size",
      value: "2000+",
      description: "Vehicles for transportation"
    },
    {
      title: "Storage Capacity",
      value: "10M",
      description: "Sq ft of warehouse space"
    },
    {
      title: "Daily Shipments",
      value: "50K+",
      description: "Packages processed daily"
    }
  ];

  const process = [
    {
      step: "1",
      title: "Consultation",
      description: "Analyze your logistics requirements and design custom solutions"
    },
    {
      step: "2",
      title: "Integration",
      description: "Seamlessly integrate with your existing systems and processes"
    },
    {
      step: "3",
      title: "Execution",
      description: "Implement logistics operations with real-time monitoring"
    },
    {
      step: "4",
      title: "Optimization",
      description: "Continuous improvement through data analysis and feedback"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url(${shippingNetwork})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <Navbar />
      
      <main className="flex-1 pt-16 relative z-10">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-r from-brand-red/10 to-brand-red/5">
          <div className="container mx-auto px-4">
            <div ref={titleAnimation.ref} className={`text-center transition-all duration-700 ${titleAnimation.className}`}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center">
                  <Warehouse className="w-8 h-8 text-brand-red" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
                Logistics Solutions
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-6">
                Comprehensive logistics and supply chain management solutions to streamline your operations. 
                From warehousing to last-mile delivery, we've got your business covered.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/enquiry">
                    <Button variant="learn-more" size="sm" className="px-6 py-2">
                      Get Custom Quote
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/support/contact">
                    <Button variant="outline" size="sm" className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-6 py-2">
                      Contact Expert
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Our Logistics Network
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Powered by cutting-edge technology and extensive infrastructure
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-12">
              {capabilities.map((capability, index) => (
                <div 
                  key={index}
                  ref={capabilityAnimations[index].ref} 
                  className={`transition-all duration-700 ${capabilityAnimations[index].className}`}
                >
                  <Card className="border-2 border-brand-red bg-card-light text-center hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardContent className="p-4">
                      <div className="text-2xl font-bold text-brand-red mb-1">{capability.value}</div>
                      <h3 className="font-semibold text-foreground mb-1">{capability.title}</h3>
                      <p className="text-sm text-muted-foreground">{capability.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-12 bg-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Logistics Services
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Comprehensive solutions tailored to your business needs
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <div 
                  key={index}
                  ref={serviceAnimations[index].ref} 
                  className={`transition-all duration-700 ${serviceAnimations[index].className}`}
                >
                  <Card className="border-2 border-brand-red bg-card-light h-full hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardHeader className="text-center">
                      <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <div className="text-brand-red">
                          {service.icon}
                        </div>
                      </div>
                      <CardTitle className="text-lg">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-muted-foreground text-center text-sm">{service.description}</p>
                      
                      <div className="space-y-1">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-success" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Industries We Serve
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Specialized logistics solutions for various industry verticals
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {industries.map((industry, index) => (
                <div 
                  key={index}
                  ref={industryAnimations[index].ref} 
                  className={`transition-all duration-700 ${industryAnimations[index].className}`}
                >
                  <Card className="border-2 border-brand-red bg-card-light h-full text-center hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <CardContent className="p-4">
                      <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <div className="text-brand-red">
                          {industry.icon}
                        </div>
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{industry.name}</h3>
                      <p className="text-sm text-muted-foreground">{industry.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-12 bg-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Our Process
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Streamlined approach to logistics implementation
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                {process.map((step, index) => (
                  <div 
                    key={index}
                    ref={processAnimations[index].ref} 
                    className={`text-center transition-all duration-700 ${processAnimations[index].className}`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-brand-red text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
                        {step.step}
                      </div>
                      {index < process.length - 1 && (
                        <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-brand-red/20 -translate-x-1/2" />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-r from-brand-red/10 to-brand-red/5">
          <div className="container mx-auto px-4 text-center">
            <div ref={ctaAnimation.ref} className={`transition-all duration-700 ${ctaAnimation.className}`}>
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Transform Your Supply Chain
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Partner with DaakBox for efficient, scalable, and cost-effective logistics solutions 
                that grow with your business.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/enquiry">
                    <Button variant="learn-more" size="sm" className="px-6 py-2">
                      Request Consultation
                    </Button>
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/clients">
                    <Button variant="outline" size="sm" className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-6 py-2">
                      View Case Studies
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Logistics;