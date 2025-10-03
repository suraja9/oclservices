import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Phone, Mail, Clock, Navigation, Star } from "lucide-react";
import branchesData from "@/data/branches.json";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  coordinates: [number, number];
  services: string[];
  operatingHours: string;
  isMainHub: boolean;
}

const LocationFinder = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [filteredBranches, setFilteredBranches] = useState<Branch[]>(branchesData as Branch[]);

  useEffect(() => {
    const filtered = (branchesData as Branch[]).filter(branch =>
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBranches(filtered);
  }, [searchTerm]);

  const handleBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
  };

  const getDirections = (branch: Branch) => {
    const [lat, lng] = branch.coordinates;
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(googleMapsUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft pt-20 pb-16">
      <Navbar />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Location Finder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the nearest DaakBox branch or service center in your area.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Branch List */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-brand-red" />
                  Find Branches
                </CardTitle>
                <div>
                  <Input
                    type="text"
                    placeholder="Search by city or branch name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border-2 border-brand-red bg-background"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto">
                  {filteredBranches.map((branch, index) => (
                    <motion.div
                      key={branch.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleBranchClick(branch)}
                      className={`p-4 border-b border-brand-red/20 cursor-pointer transition-all hover:bg-background/50 ${
                        selectedBranch?.id === branch.id ? "bg-brand-red/10" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">{branch.name}</h3>
                            {branch.isMainHub && (
                              <Badge className="bg-success text-white text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Hub
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {branch.address}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {branch.services.slice(0, 2).map(service => (
                              <Badge key={service} variant="secondary" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                            {branch.services.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{branch.services.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <MapPin className="w-4 h-4 text-brand-red mt-1" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Map and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map Placeholder */}
            <Card className="border-2 border-brand-red bg-card-light">
              <CardContent className="p-0">
                <div className="h-80 bg-gradient-to-br from-background to-background-soft rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* Mock Map Interface */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                    <div className="absolute inset-0 opacity-20">
                      <svg viewBox="0 0 400 300" className="w-full h-full">
                        {/* Mock map paths */}
                        <path
                          d="M50,100 Q100,50 200,80 T350,120 L350,250 L50,250 Z"
                          fill="currentColor"
                          className="text-blue-200"
                        />
                        <path
                          d="M100,150 Q150,120 250,140 T380,160 L380,280 L100,280 Z"
                          fill="currentColor"
                          className="text-green-200"
                        />
                      </svg>
                    </div>
                    
                    {/* Mock Markers */}
                    {filteredBranches.map((branch, index) => (
                      <div
                        key={branch.id}
                        className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all cursor-pointer ${
                          selectedBranch?.id === branch.id ? "scale-125" : "hover:scale-110"
                        }`}
                        style={{
                          left: `${20 + (index * 15) % 60}%`,
                          top: `${30 + (index * 20) % 40}%`,
                        }}
                        onClick={() => handleBranchClick(branch)}
                      >
                        <div className={`w-6 h-6 rounded-full border-2 border-white shadow-lg flex items-center justify-center ${
                          branch.isMainHub ? "bg-brand-red" : "bg-success"
                        } ${selectedBranch?.id === branch.id ? "ring-2 ring-brand-red ring-offset-2" : ""}`}>
                          <MapPin className="w-3 h-3 text-white" />
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <MapPin className="w-16 h-16 text-brand-red mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Interactive Branch Map</h3>
                    <p className="text-muted-foreground">
                      Click on markers to view branch details
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Branch Details */}
            {selectedBranch && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedBranch.id}
              >
                <Card className="border-2 border-brand-red bg-card-light">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {selectedBranch.name}
                          {selectedBranch.isMainHub && (
                            <Badge className="bg-success text-white">
                              <Star className="w-3 h-3 mr-1" />
                              Main Hub
                            </Badge>
                          )}
                        </CardTitle>
                        <p className="text-muted-foreground">{selectedBranch.address}</p>
                      </div>
                      <Button
                        onClick={() => getDirections(selectedBranch)}
                        className="bg-brand-red hover:bg-brand-red/90 text-white"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-brand-red" />
                            Contact Information
                          </h4>
                          <div className="space-y-1 text-sm">
                            <p className="flex items-center gap-2">
                              <Phone className="w-3 h-3" />
                              <a href={`tel:${selectedBranch.phone}`} className="text-brand-red hover:underline">
                                {selectedBranch.phone}
                              </a>
                            </p>
                            <p className="flex items-center gap-2">
                              <Mail className="w-3 h-3" />
                              <a href={`mailto:${selectedBranch.email}`} className="text-brand-red hover:underline">
                                {selectedBranch.email}
                              </a>
                            </p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-brand-red" />
                            Operating Hours
                          </h4>
                          <p className="text-sm text-muted-foreground">{selectedBranch.operatingHours}</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Available Services</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedBranch.services.map(service => (
                            <Badge key={service} variant="secondary" className="bg-brand-red/10 text-brand-red">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!selectedBranch && (
              <Card className="border-2 border-brand-red bg-card-light">
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Select a Branch
                  </h3>
                  <p className="text-muted-foreground">
                    Click on a branch from the list or map marker to view details
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LocationFinder;