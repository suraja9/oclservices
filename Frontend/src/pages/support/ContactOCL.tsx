import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, MessageCircle, Headphones } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import companyData from "@/data/company.json";
import supportCenterImg from "@/assets/support-center.jpg";

const ContactOCL = () => {
  const contactMethods = [
    {
      icon: <Phone className="h-6 w-6 text-primary" />,
      title: "Call Us",
      description: "Speak directly with our customer service team",
      contact: companyData.contact.phone,
      action: `tel:${companyData.contact.phone}`,
      actionText: "Call Now"
    },
    {
      icon: <MessageCircle className="h-6 w-6 text-green-500" />,
      title: "WhatsApp Support",
      description: "Get instant help via WhatsApp",
      contact: "+91-98765-43210",
      action: "https://wa.me/919876543210",
      actionText: "Chat on WhatsApp"
    },
    {
      icon: <Mail className="h-6 w-6 text-blue-500" />,
      title: "Email Support",
      description: "Send us your queries and we'll respond within 24 hours",
      contact: companyData.contact.email,
      action: `mailto:${companyData.contact.email}`,
      actionText: "Send Email"
    },
    {
      icon: <Headphones className="h-6 w-6 text-purple-500" />,
      title: "Customer Care",
      description: "Toll-free customer care line",
      contact: companyData.contact.customer_care,
      action: `tel:${companyData.contact.customer_care}`,
      actionText: "Call Customer Care"
    }
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 8:00 PM" },
    { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
    { day: "Sunday", hours: "10:00 AM - 4:00 PM" }
  ];

  const departments = [
    {
      name: "Customer Service",
      email: "support@oclservices.com",
      phone: "+91-22-4567-8901"
    },
    {
      name: "Sales & Business",
      email: "sales@oclservices.com", 
      phone: "+91-22-4567-8902"
    },
    {
      name: "Technical Support",
      email: "tech@oclservices.com",
      phone: "+91-22-4567-8903"
    },
    {
      name: "Billing & Accounts",
      email: "billing@oclservices.com",
      phone: "+91-22-4567-8904"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center opacity-10 z-0"
        style={{
          backgroundImage: `url(${supportCenterImg})`,
        }}
      />
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-brand-red bg-clip-text text-transparent">
            Contact OCL SERVICES
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Reach out to us through any of the channels below and our team will assist you promptly.
          </p>
        </motion.div>

        {/* Contact Methods */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {contactMethods.map((method, index) => (
            <Card key={index} className="daakbox-card text-center hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  {method.icon}
                </div>
                <CardTitle className="text-xl font-bold">{method.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{method.description}</p>
                <p className="font-semibold mb-4">{method.contact}</p>
                <Button 
                  className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
                  onClick={() => window.open(method.action, '_blank')}
                >
                  {method.actionText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Office Hours */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Office Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {officeHours.map((schedule, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <span className="font-medium">{schedule.day}</span>
                    <span className="text-muted-foreground">{schedule.hours}</span>
                  </div>
                ))}
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>24/7 Emergency Support:</strong> For urgent shipment issues, call our emergency line at +91-98765-43211
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Department Contacts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Department Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-semibold mb-2">{dept.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${dept.email}`} className="hover:text-brand-red">
                          {dept.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${dept.phone}`} className="hover:text-brand-red">
                          {dept.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Head Office */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Head Office
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Address</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {companyData.contact.address}
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Get Directions</h3>
                  <Button 
                    variant="outline" 
                    className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                    onClick={() => window.open('https://maps.google.com/?q=OCL+SERVICES+House+Mumbai', '_blank')}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Open in Google Maps
                  </Button>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Visiting Hours:</strong> Monday to Friday, 10:00 AM - 6:00 PM. 
                    Please call ahead to schedule an appointment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="daakbox-card">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Need Immediate Assistance?</h3>
              <p className="text-muted-foreground mb-6">
                For immediate support, you can also track your shipments, schedule pickups, or access our help center
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  className="bg-brand-red hover:bg-brand-red/90 text-white px-8"
                  onClick={() => window.location.href = '/track'}
                >
                  Track Shipment
                </Button>
                <Button 
                  variant="outline" 
                  className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8"
                  onClick={() => window.location.href = '/schedule-pickup'}
                >
                  Schedule Pickup
                </Button>
                <Button 
                  variant="outline" 
                  className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white px-8"
                  onClick={() => window.location.href = '/support/write'}
                >
                  Write to Us
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactOCL;
