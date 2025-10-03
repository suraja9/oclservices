import { useState } from "react";
import { motion } from "framer-motion";
import { Search, AlertTriangle, Droplets, Smartphone, Apple, Gem, Ban } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import restrictedData from "@/data/restricted.json";

const iconMap = {
  AlertTriangle,
  Droplets,
  Smartphone,
  Apple,
  Gem,
  Ban
};

const RestrictedItems = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = restrictedData.categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.items.some(item => item.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
            Restricted & Banned Items
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Items that cannot be shipped through our courier services for safety and regulatory compliance
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="max-w-md mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search items or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-brand-red/20 bg-success-light/10 focus:border-brand-red"
            />
          </div>
        </motion.div>

        {/* Warning Card */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="border-2 border-brand-red bg-warning-light/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Important Notice</h3>
                  <p className="text-muted-foreground">
                    Attempting to ship restricted items may result in shipment rejection, delays, or legal consequences. 
                    Please review this list carefully before booking your shipment.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Categories Accordion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Restricted Categories</CardTitle>
              <p className="text-center text-muted-foreground">
                Click on each category to view specific items
              </p>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="space-y-4">
                {filteredCategories.map((category, index) => {
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap];
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 * index }}
                    >
                      <AccordionItem 
                        value={category.id} 
                        className="border-2 border-brand-red/20 rounded-lg bg-success-light/5 px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-6">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-brand-red" />
                            </div>
                            <div className="text-left">
                              <h3 className="text-lg font-semibold">{category.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {category.items.length} restricted items
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                            {category.items.map((item, itemIndex) => (
                              <motion.div
                                key={itemIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.05 * itemIndex }}
                                className="flex items-center space-x-3 p-3 border border-brand-red/20 rounded-md bg-success-light/5 hover:shadow-sm transition-all duration-300"
                              >
                                <div className="w-2 h-2 bg-brand-red rounded-full"></div>
                                <span className="text-sm">{item}</span>
                              </motion.div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  );
                })}
              </Accordion>
            </CardContent>
          </Card>
        </motion.div>

        {/* Help Section */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                  <h4 className="font-semibold mb-2">Not Sure About an Item?</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Contact our team for clarification before shipping
                  </p>
                  <p className="text-sm font-medium text-primary">Call: 1800-123-DAAK</p>
                </div>
                
                <div className="text-center p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                  <h4 className="font-semibold mb-2">Special Permissions</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Some items may be shipped with proper documentation
                  </p>
                  <p className="text-sm font-medium text-primary">Email: compliance@daakbox.com</p>
                </div>
                
                <div className="text-center p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                  <h4 className="font-semibold mb-2">Report Violations</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Report any attempts to ship restricted items
                  </p>
                  <p className="text-sm font-medium text-primary">safety@daakbox.com</p>
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

export default RestrictedItems;