import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CreditCard, Building, User, Mail, Phone, MapPin, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CreditAccount = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    panNumber: "",
    gstNumber: "",
    businessType: "",
    monthlyVolume: "",
    creditLimit: "",
    acceptTerms: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Application Submitted Successfully!",
      description: "Your credit account application has been received. We'll contact you within 2-3 business days.",
    });

    setIsLoading(false);
  };

  const benefits = [
    {
      icon: <CreditCard className="h-6 w-6 text-primary" />,
      title: "Flexible Credit Terms",
      description: "Get credit limits up to ₹10 lakhs with flexible payment terms"
    },
    {
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      title: "Priority Processing",
      description: "Enjoy priority booking and faster processing of your shipments"
    },
    {
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      title: "Consolidated Billing",
      description: "Get monthly consolidated invoices for better financial management"
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
            Apply for Credit Account
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get flexible credit terms and priority service for your business shipping needs
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Benefits Section */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-primary">Credit Account Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="daakbox-card mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-primary">Required Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• PAN Card</li>
                  <li>• GST Registration Certificate</li>
                  <li>• Company Registration Certificate</li>
                  <li>• Bank Account Details</li>
                  <li>• Recent Financial Statements</li>
                  <li>• Address Proof</li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Application Form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="daakbox-card">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Building className="h-6 w-6" />
                  Credit Account Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Company Information</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="companyName" className="text-sm font-medium">
                          Company Name *
                        </Label>
                        <Input
                          id="companyName"
                          type="text"
                          placeholder="Enter company name"
                          value={formData.companyName}
                          onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                          className="border-2 border-brand-red/30 focus:border-brand-red"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="contactPerson" className="text-sm font-medium">
                          Contact Person *
                        </Label>
                        <Input
                          id="contactPerson"
                          type="text"
                          placeholder="Enter contact person name"
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                          className="border-2 border-brand-red/30 focus:border-brand-red"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-sm font-medium">
                          Email Address *
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter email address"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="pl-10 border-2 border-brand-red/30 focus:border-brand-red"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="phone" className="text-sm font-medium">
                          Phone Number *
                        </Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="pl-10 border-2 border-brand-red/30 focus:border-brand-red"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Address Information</h3>
                    
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium">
                        Complete Address *
                      </Label>
                      <Textarea
                        id="address"
                        placeholder="Enter complete business address"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="border-2 border-brand-red/30 focus:border-brand-red"
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium">
                          City *
                        </Label>
                        <Input
                          id="city"
                          type="text"
                          placeholder="Enter city"
                          value={formData.city}
                          onChange={(e) => setFormData({...formData, city: e.target.value})}
                          className="border-2 border-brand-red/30 focus:border-brand-red"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium">
                          State *
                        </Label>
                        <Input
                          id="state"
                          type="text"
                          placeholder="Enter state"
                          value={formData.state}
                          onChange={(e) => setFormData({...formData, state: e.target.value})}
                          className="border-2 border-brand-red/30 focus:border-brand-red"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="pincode" className="text-sm font-medium">
                          PIN Code *
                        </Label>
                        <Input
                          id="pincode"
                          type="text"
                          placeholder="Enter PIN code"
                          value={formData.pincode}
                          onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                          className="border-2 border-brand-red/30 focus:border-brand-red"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Business Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Business Details</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="panNumber" className="text-sm font-medium">
                          PAN Number *
                        </Label>
                        <Input
                          id="panNumber"
                          type="text"
                          placeholder="Enter PAN number"
                          value={formData.panNumber}
                          onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                          className="border-2 border-brand-red/30 focus:border-brand-red"
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="gstNumber" className="text-sm font-medium">
                          GST Number
                        </Label>
                        <Input
                          id="gstNumber"
                          type="text"
                          placeholder="Enter GST number"
                          value={formData.gstNumber}
                          onChange={(e) => setFormData({...formData, gstNumber: e.target.value})}
                          className="border-2 border-brand-red/30 focus:border-brand-red"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="businessType" className="text-sm font-medium">
                          Business Type *
                        </Label>
                        <Select onValueChange={(value) => setFormData({...formData, businessType: value})}>
                          <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red">
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="manufacturer">Manufacturer</SelectItem>
                            <SelectItem value="retailer">Retailer</SelectItem>
                            <SelectItem value="wholesaler">Wholesaler</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="service">Service Provider</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="monthlyVolume" className="text-sm font-medium">
                          Expected Monthly Volume *
                        </Label>
                        <Select onValueChange={(value) => setFormData({...formData, monthlyVolume: value})}>
                          <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red">
                            <SelectValue placeholder="Select monthly volume" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-100">0-100 shipments</SelectItem>
                            <SelectItem value="100-500">100-500 shipments</SelectItem>
                            <SelectItem value="500-1000">500-1000 shipments</SelectItem>
                            <SelectItem value="1000+">1000+ shipments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="creditLimit" className="text-sm font-medium">
                        Requested Credit Limit *
                      </Label>
                      <Select onValueChange={(value) => setFormData({...formData, creditLimit: value})}>
                        <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red">
                          <SelectValue placeholder="Select credit limit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="50000">₹50,000</SelectItem>
                          <SelectItem value="100000">₹1,00,000</SelectItem>
                          <SelectItem value="200000">₹2,00,000</SelectItem>
                          <SelectItem value="500000">₹5,00,000</SelectItem>
                          <SelectItem value="1000000">₹10,00,000</SelectItem>
                          <SelectItem value="custom">Custom Amount</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.acceptTerms}
                      onCheckedChange={(checked) => setFormData({...formData, acceptTerms: checked as boolean})}
                      className="border-2 border-brand-red"
                    />
                    <Label htmlFor="terms" className="text-sm leading-5">
                      I accept the{" "}
                      <a href="/terms" className="text-brand-red hover:underline">
                        Terms & Conditions
                      </a>{" "}
                      and{" "}
                      <a href="/credit-terms" className="text-brand-red hover:underline">
                        Credit Terms
                      </a>
                    </Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || !formData.acceptTerms}
                    className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-semibold py-3 
                             hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-brand-red/25"
                  >
                    {isLoading ? "Submitting Application..." : "Submit Application"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CreditAccount;
