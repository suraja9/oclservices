import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, CheckCircle, XCircle, Upload, Download, Building2, Clock, Truck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ServiceabilityResult {
  pincode: string;
  serviceable: boolean;
  services: string[];
  nearestBranch?: {
    name: string;
    distance: string;
    address: string;
  };
  deliveryDays?: string;
}

const Serviceability = () => {
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [bulkPincodes, setBulkPincodes] = useState("");
  const [results, setResults] = useState<ServiceabilityResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const { toast } = useToast();

  // Mock serviceability data
  const mockServiceabilityData: Record<string, ServiceabilityResult> = {
    "110001": {
      pincode: "110001",
      serviceable: true,
      services: ["Standard", "Express", "Priority"],
      nearestBranch: {
        name: "New Delhi Hub",
        distance: "2.5 km",
        address: "Plot No. 45, Sector 18, Gurgaon"
      },
      deliveryDays: "1-2 days"
    },
    "400001": {
      pincode: "400001",
      serviceable: true,
      services: ["Standard", "Express"],
      nearestBranch: {
        name: "Mumbai Central",
        distance: "5.2 km",
        address: "Andheri Industrial Estate, Mumbai"
      },
      deliveryDays: "2-3 days"
    },
    "560001": {
      pincode: "560001",
      serviceable: true,
      services: ["Standard", "ODA"],
      nearestBranch: {
        name: "Bangalore Tech Park",
        distance: "8.1 km",
        address: "Electronic City Phase 1, Bangalore"
      },
      deliveryDays: "3-4 days"
    },
    "999999": {
      pincode: "999999",
      serviceable: false,
      services: [],
      deliveryDays: "Not Available"
    }
  };

  const handleSingleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) {
      toast({
        title: "Please enter a pincode",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // TODO: Replace with Supabase call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = mockServiceabilityData[pincode] || {
      pincode,
      serviceable: false,
      services: [],
      deliveryDays: "Not Available"
    };

    setResults([result]);
    setLoading(false);
    
    toast({
      title: result.serviceable ? "Area is serviceable!" : "Area not serviceable",
      description: result.serviceable 
        ? `Available services: ${result.services.join(", ")}`
        : "This area is currently not covered",
    });
  };

  const handleBulkCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkPincodes.trim()) {
      toast({
        title: "Please enter pincodes",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    const pincodeList = bulkPincodes
      .split(/[,\n]/)
      .map(p => p.trim())
      .filter(p => p);

    // TODO: Replace with Supabase call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bulkResults = pincodeList.map(pincode => 
      mockServiceabilityData[pincode] || {
        pincode,
        serviceable: false,
        services: [],
        deliveryDays: "Not Available"
      }
    );

    setResults(bulkResults);
    setLoading(false);
    
    const serviceableCount = bulkResults.filter(r => r.serviceable).length;
    toast({
      title: "Bulk check completed!",
      description: `${serviceableCount} out of ${bulkResults.length} areas are serviceable`,
    });
  };

  const downloadResults = () => {
    if (results.length === 0) return;
    
    const csv = [
      "Pincode,Serviceable,Services,Nearest Branch,Distance,Delivery Days",
      ...results.map(r => 
        `${r.pincode},${r.serviceable ? "Yes" : "No"},"${r.services.join("; ")}","${r.nearestBranch?.name || "N/A"}","${r.nearestBranch?.distance || "N/A"}","${r.deliveryDays || "N/A"}"`
      )
    ].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `serviceability-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Results downloaded!",
      description: "CSV file has been saved to your downloads",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft pt-20 pb-16">
      <Navbar />
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Pin Code Serviceability
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Check if we deliver to your location and discover available services in your area.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Tab Selection */}
          <div className="flex justify-center mb-8">
            <div className="bg-card-light border-2 border-brand-red rounded-lg p-1">
              <button
                onClick={() => setActiveTab("single")}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === "single"
                    ? "bg-brand-red text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Single Check
              </button>
              <button
                onClick={() => setActiveTab("bulk")}
                className={`px-6 py-2 rounded-md transition-all ${
                  activeTab === "bulk"
                    ? "bg-brand-red text-white shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Bulk Upload
              </button>
            </div>
          </div>

          {/* Single Check Form */}
          {activeTab === "single" && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Card className="border-2 border-brand-red bg-card-light">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-brand-red" />
                    Check Serviceability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSingleCheck} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pincode">Pin Code *</Label>
                        <Input
                          id="pincode"
                          type="text"
                          placeholder="Enter 6-digit pincode"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="border-2 border-brand-red bg-background"
                          maxLength={6}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address (Optional)</Label>
                        <Input
                          id="address"
                          type="text"
                          placeholder="Enter full address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="border-2 border-brand-red bg-background"
                        />
                      </div>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
                    >
                      {loading ? "Checking..." : "Check Serviceability"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Bulk Upload Form */}
          {activeTab === "bulk" && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-8"
            >
              <Card className="border-2 border-brand-red bg-card-light">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-brand-red" />
                    Bulk Serviceability Check
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleBulkCheck} className="space-y-6">
                    <div>
                      <Label htmlFor="bulkPincodes">
                        Pin Codes (comma separated or one per line)
                      </Label>
                      <Textarea
                        id="bulkPincodes"
                        placeholder="110001, 400001, 560001&#10;Or one per line:&#10;110001&#10;400001&#10;560001"
                        value={bulkPincodes}
                        onChange={(e) => setBulkPincodes(e.target.value)}
                        className="border-2 border-brand-red bg-background min-h-32"
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Maximum 100 pincodes per batch
                      </p>
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
                    >
                      {loading ? "Processing..." : "Check All Pincodes"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results Section */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-foreground">
                  Serviceability Results ({results.length})
                </h3>
                <Button
                  onClick={downloadResults}
                  variant="outline"
                  className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {results.map((result, index) => (
                  <motion.div
                    key={result.pincode}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="border-2 border-brand-red bg-card-light">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex items-center gap-2">
                                {result.serviceable ? (
                                  <CheckCircle className="w-5 h-5 text-success" />
                                ) : (
                                  <XCircle className="w-5 h-5 text-destructive" />
                                )}
                                <span className="font-semibold text-lg">
                                  {result.pincode}
                                </span>
                              </div>
                              <Badge
                                variant={result.serviceable ? "default" : "destructive"}
                                className={result.serviceable ? "bg-success" : ""}
                              >
                                {result.serviceable ? "Serviceable" : "Not Serviceable"}
                              </Badge>
                            </div>

                            {result.serviceable && (
                              <div className="grid md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                    <Truck className="w-4 h-4" />
                                    Services
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {result.services.map(service => (
                                      <Badge key={service} variant="secondary" className="text-xs">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {result.nearestBranch && (
                                  <div>
                                    <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                      <Building2 className="w-4 h-4" />
                                      Nearest Branch
                                    </div>
                                    <div>
                                      <div className="font-medium">{result.nearestBranch.name}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {result.nearestBranch.distance}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div>
                                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                                    <Clock className="w-4 h-4" />
                                    Delivery Time
                                  </div>
                                  <div className="font-medium">{result.deliveryDays}</div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Serviceability;