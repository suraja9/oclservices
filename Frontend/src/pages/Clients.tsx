import { useState } from "react";
import { motion } from "framer-motion";
import { Building, Filter, Quote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import clientsData from "@/data/clients.json";

const Clients = () => {
  const [selectedIndustry, setSelectedIndustry] = useState("All");
  
  const filteredClients = selectedIndustry === "All" 
    ? clientsData.clients 
    : clientsData.clients.filter(client => client.industry === selectedIndustry);

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
            Our Valued Clients
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trusted by industry leaders across various sectors
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-64 border-2 border-brand-red/20 bg-success-light/10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Industries</SelectItem>
              {clientsData.industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredClients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Card className="border-2 border-brand-red/20 bg-success-light/10 hover:shadow-elegant transition-all duration-300 hover:scale-105 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{client.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{client.industry}</p>
                      <p className="text-xs text-primary">Partner since {client.partnership_since}</p>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="border-2 border-brand-red bg-success-light/10 max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="text-2xl">{client.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="p-4 border-2 border-brand-red/20 rounded-lg bg-success-light/5">
                      <Quote className="w-6 h-6 text-primary mb-2" />
                      <p className="text-sm italic leading-relaxed">{client.testimonial}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 border border-brand-red/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Industry</p>
                        <p className="font-medium">{client.industry}</p>
                      </div>
                      <div className="text-center p-3 border border-brand-red/20 rounded-lg">
                        <p className="text-sm text-muted-foreground">Partnership</p>
                        <p className="font-medium">Since {client.partnership_since}</p>
                      </div>
                    </div>
                    <div className="text-center p-3 border border-brand-red/20 rounded-lg">
                      <p className="text-sm text-muted-foreground">Monthly Volume</p>
                      <p className="font-medium">{client.volume}</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Clients;