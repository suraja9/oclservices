import { motion } from "framer-motion";
import { Eye, Target, Heart, Shield, Zap, Globe, Leaf, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Vision = () => {
  const values = [
    {
      icon: Shield,
      title: "Trust & Reliability",
      description: "Building lasting relationships through consistent, dependable service that our customers can count on.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Innovation & Excellence",
      description: "Continuously evolving our technology and processes to deliver exceptional logistics solutions.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Putting our customers at the center of everything we do, ensuring their success is our success.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Connecting businesses and people across borders with seamless international logistics.",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to environmental responsibility through eco-friendly practices and green technology.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Users,
      title: "Team Excellence",
      description: "Empowering our people to grow, innovate, and deliver their best in everything they do.",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-brand-red bg-clip-text text-transparent">
            Vision & Mission
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Shaping the future of logistics with purpose, innovation, and unwavering commitment to excellence
          </p>
        </motion.div>

        {/* Vision & Mission Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-2 border-brand-red bg-success-light/10 h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-3xl text-center">Our Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  To be the world's most trusted and innovative logistics partner, connecting businesses and 
                  communities through seamless, sustainable, and intelligent delivery solutions.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Global Leadership</h4>
                    <p className="text-sm text-muted-foreground">
                      Becoming the preferred logistics partner across continents
                    </p>
                  </div>
                  
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Technology Pioneer</h4>
                    <p className="text-sm text-muted-foreground">
                      Leading innovation in smart logistics and automation
                    </p>
                  </div>
                  
                  <div className="p-4 border-2 border-primary/20 rounded-lg bg-primary/5">
                    <h4 className="font-semibold mb-2">Sustainable Future</h4>
                    <p className="text-sm text-muted-foreground">
                      Building an environmentally responsible logistics ecosystem
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="border-2 border-brand-red bg-success-light/10 h-full">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-brand-red/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-brand-red" />
                </div>
                <CardTitle className="text-3xl text-center">Our Mission</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  To deliver excellence in every shipment by providing reliable, efficient, and innovative 
                  logistics solutions that empower businesses to grow and communities to thrive.
                </p>
                
                <div className="space-y-4">
                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-brand-red/5">
                    <h4 className="font-semibold mb-2">Customer Success</h4>
                    <p className="text-sm text-muted-foreground">
                      Ensuring every delivery exceeds customer expectations
                    </p>
                  </div>
                  
                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-brand-red/5">
                    <h4 className="font-semibold mb-2">Operational Excellence</h4>
                    <p className="text-sm text-muted-foreground">
                      Maintaining the highest standards in safety and reliability
                    </p>
                  </div>
                  
                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-brand-red/5">
                    <h4 className="font-semibold mb-2">Community Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Creating positive change in the communities we serve
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10 mb-16">
            <CardHeader>
              <CardTitle className="text-3xl text-center">Our Core Values</CardTitle>
              <p className="text-center text-muted-foreground">
                The principles that guide our actions and decisions every day
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="group relative"
                  >
                    <div className="border-2 border-brand-red/20 rounded-lg p-6 bg-success-light/5 hover:shadow-elegant transition-all duration-500 hover:scale-105 overflow-hidden">
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-brand-red/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      <div className="relative z-10">
                        <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <value.icon className="w-7 h-7 text-white" />
                        </div>
                        
                        <h3 className="text-lg font-semibold text-center mb-3 group-hover:text-primary transition-colors duration-300">
                          {value.title}
                        </h3>
                        
                        <p className="text-sm text-muted-foreground text-center leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Commitment Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-2 border-brand-red bg-gradient-to-br from-primary/10 to-brand-red/10">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Our Commitment to You</h2>
              <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed mb-8">
                Every package we handle carries more than just goods - it carries trust, dreams, and connections 
                between people. We understand the responsibility that comes with this trust and pledge to honor 
                it with every delivery, every interaction, and every innovation we bring to the world of logistics.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">99.8%</div>
                  <div className="text-sm text-muted-foreground">On-time Delivery</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Customer Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Shipment Tracking</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Vision;