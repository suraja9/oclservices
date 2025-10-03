import { motion } from "framer-motion";
import { Building, Users, MapPin, Phone, Mail, Globe, Award, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import companyData from "@/data/company.json";
import businessBgImg from "@/assets/business-bg.jpg";
import supportCenterImg from "@/assets/support-center.jpg";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-5 z-0"
        style={{
          backgroundImage: `url(${businessBgImg})`,
        }}
      />
      
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
            {companyData.overview.name}
          </h1>
          <p className="text-2xl text-muted-foreground mb-8">
            {companyData.overview.tagline}
          </p>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
            {companyData.overview.description}
          </p>
        </motion.div>

        {/* Company Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { label: "Established", value: companyData.overview.established, icon: Building },
            { label: "Employees", value: companyData.overview.employees, icon: Users },
            { label: "Cities", value: companyData.overview.cities, icon: MapPin },
            { label: "Branches", value: companyData.overview.branches, icon: Building }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Card className="border-2 border-brand-red bg-success-light/10 text-center hover:shadow-elegant transition-all duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact Information */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mt-1">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Corporate Address</h4>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {companyData.contact.address}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Phone</h4>
                      <p className="text-muted-foreground">{companyData.contact.phone}</p>
                      <p className="text-sm text-muted-foreground">Customer Care: {companyData.contact.customer_care}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Email</h4>
                      <p className="text-muted-foreground">{companyData.contact.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Website</h4>
                      <p className="text-muted-foreground">{companyData.contact.website}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leadership Team */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Leadership Team</CardTitle>
              <p className="text-center text-muted-foreground">
                Meet the visionaries driving our success
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {companyData.executives.map((executive, index) => (
                  <motion.div
                    key={executive.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="text-center group"
                  >
                    <div className="border-2 border-brand-red/20 rounded-lg p-6 bg-success-light/5 hover:shadow-elegant transition-all duration-300 hover:scale-105">
                      <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-brand-red/20 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        <Users className="w-12 h-12 text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg mb-1">{executive.name}</h4>
                      <p className="text-primary text-sm mb-2">{executive.position}</p>
                      <p className="text-xs text-muted-foreground mb-3">{executive.experience}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{executive.bio}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Certifications & Compliance</CardTitle>
              <p className="text-center text-muted-foreground">
                Our commitment to quality and safety standards
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyData.certifications.map((cert, index) => (
                  <motion.div
                    key={cert}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center space-x-3 p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Award className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium">{cert}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Learn More</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Our Journey", href: "/journey", icon: MapPin },
                  { label: "Vision & Mission", href: "/vision", icon: Shield },
                  { label: "GST Information", href: "/gst", icon: Award },
                  { label: "Our Clients", href: "/clients", icon: Users }
                ].map((link, index) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                  >
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-auto p-4 border-2 border-brand-red/20 bg-success-light/5 hover:bg-primary/5 hover:scale-105 transition-all duration-300"
                    >
                      <a href={link.href} className="flex items-center space-x-3">
                        <link.icon className="w-5 h-5" />
                        <span>{link.label}</span>
                      </a>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default About;