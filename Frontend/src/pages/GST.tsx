import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Download, FileText, CheckCircle, Building, CreditCard, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gstData from "@/data/gst.json";

const GST = () => {
  const { toast } = useToast();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-brand-red bg-clip-text text-transparent">
            GST Information
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete GST details, compliance information, and tax structure for DaakBox Logistics
          </p>
        </motion.div>

        {/* Company GST Details */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building className="w-8 h-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Company GST Details</CardTitle>
              <div className="flex justify-center">
                <Badge variant="secondary" className="bg-success/20 text-success-foreground">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {gstData.company_details.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold mb-1">GSTIN</h4>
                        <p className="text-lg font-mono">{gstData.company_details.gstin}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(gstData.company_details.gstin, "GSTIN")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold mb-1">PAN Number</h4>
                        <p className="text-lg font-mono">{gstData.company_details.pan}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(gstData.company_details.pan, "PAN")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                    <h4 className="font-semibold mb-1">Legal Name</h4>
                    <p className="text-sm">{gstData.company_details.legal_name}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold mb-1">CIN</h4>
                        <p className="text-lg font-mono">{gstData.company_details.cin}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(gstData.company_details.cin, "CIN")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                    <h4 className="font-semibold mb-1">Registration Date</h4>
                    <p className="text-sm">{new Date(gstData.company_details.registration_date).toLocaleDateString()}</p>
                  </div>

                  <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                    <h4 className="font-semibold mb-1">Constitution</h4>
                    <p className="text-sm">{gstData.company_details.constitution}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Registered Addresses */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Registered Addresses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-6 border-2 border-primary/20 rounded-lg bg-primary/5">
                  <div className="flex items-center mb-3">
                    <Badge variant="default" className="mr-3">Principal</Badge>
                    <span className="text-sm text-muted-foreground">State Code: {gstData.addresses.principal.state_code}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{gstData.addresses.principal.address}</p>
                </div>

                {gstData.addresses.additional.map((address, index) => (
                  <div key={index} className="p-6 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                    <div className="flex items-center mb-3">
                      <Badge variant="secondary" className="mr-3">{address.type}</Badge>
                      <span className="text-sm text-muted-foreground">State Code: {address.state_code}</span>
                    </div>
                    <p className="text-sm leading-relaxed">{address.address}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tax Structure */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-brand-red/10 rounded-full flex items-center justify-center">
                  <CreditCard className="w-8 h-8 text-brand-red" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Service Tax Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {gstData.tax_structure.service_categories.map((service, index) => (
                  <motion.div
                    key={service.hsn_sac}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="p-6 border-2 border-brand-red/20 rounded-lg bg-success-light/5 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h4 className="font-semibold text-lg mr-3">{service.service}</h4>
                          <Badge variant="outline" className="bg-primary/10">
                            {service.gst_rate}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          HSN/SAC: {service.hsn_sac}
                        </p>
                        <p className="text-sm leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Compliance Information */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Compliance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border-2 border-success/20 rounded-lg bg-success/5">
                    <h4 className="font-semibold mb-1">Filing Frequency</h4>
                    <p className="text-sm">{gstData.compliance.filing_frequency}</p>
                  </div>
                  
                  <div className="p-4 border-2 border-success/20 rounded-lg bg-success/5">
                    <h4 className="font-semibold mb-1">Last Return Filed</h4>
                    <p className="text-sm">{gstData.compliance.last_return_filed}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border-2 border-success/20 rounded-lg bg-success/5">
                    <h4 className="font-semibold mb-1">Compliance Rating</h4>
                    <div className="flex items-center">
                      <Badge variant="secondary" className="bg-success/20 text-success-foreground">
                        {gstData.compliance.compliance_rating}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4 border-2 border-success/20 rounded-lg bg-success/5">
                    <h4 className="font-semibold mb-1">Penalties</h4>
                    <p className="text-sm text-success">{gstData.compliance.penalties}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Certificates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-warning" />
                </div>
              </div>
              <CardTitle className="text-2xl text-center">Certificates & Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gstData.certificates.map((cert, index) => (
                  <motion.div
                    key={cert.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="p-6 border-2 border-brand-red/20 rounded-lg bg-success-light/5 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{cert.name}</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>Issue Date: {new Date(cert.issue_date).toLocaleDateString()}</p>
                          <p>Validity: {cert.validity}</p>
                          {cert.number && <p>Number: {cert.number}</p>}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="ml-4">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
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

export default GST;