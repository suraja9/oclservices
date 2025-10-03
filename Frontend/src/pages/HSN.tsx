import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import hsnData from "@/data/hsn.json";

const HSN = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCodes = hsnData.service_codes.filter(code =>
    code.sac_code.includes(searchTerm) ||
    code.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    code.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-brand-red bg-clip-text text-transparent">
            HSN/SAC Numbers
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Service Accounting Codes (SAC) for logistics and transportation services
          </p>
        </motion.div>

        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search SAC codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-brand-red/20 bg-success-light/10 focus:border-brand-red"
            />
          </div>
        </motion.div>

        <Card className="border-2 border-brand-red bg-success-light/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Service Codes</CardTitle>
            <div className="flex justify-center">
              <Button variant="outline" className="border-brand-red/20">
                <Download className="w-4 h-4 mr-2" />
                Export Table
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredCodes.map((code, index) => (
                <motion.div
                  key={code.sac_code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 * index }}
                  className="p-6 border-2 border-brand-red/20 rounded-lg bg-success-light/5"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold">{code.sac_code}</h3>
                        <Badge variant="outline" className="bg-primary/10">{code.gst_rate}</Badge>
                        <Badge variant="secondary">{code.category}</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{code.description}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Applicable Services:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {code.applicable_services.map((service, idx) => (
                        <div key={idx} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>{service}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default HSN;