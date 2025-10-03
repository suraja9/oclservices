import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PenTool, Send, MessageSquare, AlertCircle, ThumbsUp, Bug } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const WriteToUs = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    category: "",
    priority: "",
    message: "",
    trackingNumber: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Message Sent Successfully!",
      description: "Thank you for contacting us. We'll respond to your message within 24 hours.",
    });

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      category: "",
      priority: "",
      message: "",
      trackingNumber: ""
    });

    setIsLoading(false);
  };

  const categories = [
    {
      value: "general",
      label: "General Inquiry",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      value: "complaint",
      label: "Complaint",
      icon: <AlertCircle className="h-4 w-4" />
    },
    {
      value: "feedback",
      label: "Feedback",
      icon: <ThumbsUp className="h-4 w-4" />
    },
    {
      value: "technical",
      label: "Technical Issue",
      icon: <Bug className="h-4 w-4" />
    },
    {
      value: "billing",
      label: "Billing Query",
      icon: <MessageSquare className="h-4 w-4" />
    },
    {
      value: "partnership",
      label: "Partnership",
      icon: <MessageSquare className="h-4 w-4" />
    }
  ];

  const contactInfo = [
    {
      title: "Response Time",
      description: "We typically respond within 24 hours during business days"
    },
    {
      title: "Priority Support",
      description: "Mark urgent issues as 'High Priority' for faster response"
    },
    {
      title: "Tracking Issues",
      description: "Include your tracking number for shipment-related queries"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
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
            Write to Us
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have a question, suggestion, or need help? Send us a message and our team will get back to you promptly.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <PenTool className="h-6 w-6" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="border-2 border-brand-red/30 focus:border-brand-red"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="border-2 border-brand-red/30 focus:border-brand-red"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="border-2 border-brand-red/30 focus:border-brand-red"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="trackingNumber" className="text-sm font-medium">
                        Tracking Number (if applicable)
                      </Label>
                      <Input
                        id="trackingNumber"
                        type="text"
                        placeholder="Enter tracking number"
                        value={formData.trackingNumber}
                        onChange={(e) => setFormData({...formData, trackingNumber: e.target.value})}
                        className="border-2 border-brand-red/30 focus:border-brand-red"
                      />
                    </div>
                  </div>

                  {/* Message Details */}
                  <div>
                    <Label htmlFor="subject" className="text-sm font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      type="text"
                      placeholder="Enter the subject of your message"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="border-2 border-brand-red/30 focus:border-brand-red"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category" className="text-sm font-medium">
                        Category *
                      </Label>
                      <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              <div className="flex items-center gap-2">
                                {category.icon}
                                {category.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="priority" className="text-sm font-medium">
                        Priority *
                      </Label>
                      <Select onValueChange={(value) => setFormData({...formData, priority: value})}>
                        <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-sm font-medium">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide detailed information about your inquiry..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="border-2 border-brand-red/30 focus:border-brand-red min-h-32"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum 10 characters required
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !formData.name || !formData.email || !formData.subject || !formData.category || !formData.priority || !formData.message}
                    className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold py-3 
                             hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-red/25"
                  >
                    {isLoading ? (
                      "Sending Message..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Sidebar */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Contact Information */}
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">What to Expect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactInfo.map((info, index) => (
                  <div key={index} className="p-4 bg-secondary/30 rounded-lg">
                    <h3 className="font-semibold mb-1">{info.title}</h3>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-brand-red rounded-full mt-2 flex-shrink-0"></div>
                    Be specific about your issue or question
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-brand-red rounded-full mt-2 flex-shrink-0"></div>
                    Include relevant details like tracking numbers
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-brand-red rounded-full mt-2 flex-shrink-0"></div>
                    Choose the appropriate category for faster routing
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1 h-1 bg-brand-red rounded-full mt-2 flex-shrink-0"></div>
                    Check your email for our response
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Alternative Contact */}
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Need Immediate Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  For urgent matters, you can also contact us directly:
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                    onClick={() => window.location.href = '/support/contact'}
                  >
                    View Contact Details
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                    onClick={() => window.open('https://wa.me/919876543210', '_blank')}
                  >
                    WhatsApp Support
                  </Button>
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

export default WriteToUs;
