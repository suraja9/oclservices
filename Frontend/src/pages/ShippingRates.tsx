import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, IndianRupee, Truck, Clock, Download, Upload } from "lucide-react";
import { calculateShippingRate } from "@/utils/calc";
import ratesData from "@/data/rates.json";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface RateCalculation {
  baseAmount: number;
  fuelSurcharge: number;
  subtotal: number;
  gst: number;
  total: number;
  zone: string;
  service: string;
  deliveryDays: string;
}

const ShippingRates = () => {
  const [formData, setFormData] = useState({
    fromPincode: "",
    toPincode: "",
    weight: "",
    serviceType: "",
    zone: ""
  });
  const [calculation, setCalculation] = useState<RateCalculation | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromPincode || !formData.toPincode || !formData.weight || !formData.serviceType || !formData.zone) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Replace with Supabase call to determine zone based on pincodes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const weight = parseFloat(formData.weight);
      const result = calculateShippingRate(weight, formData.zone, formData.serviceType, ratesData);
      
      setCalculation(result);
      
      toast({
        title: "Rate calculated successfully!",
        description: `Total amount: ₹${result.total}`,
      });
    } catch (error) {
      toast({
        title: "Calculation failed",
        description: "Please check your inputs and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const exportQuote = () => {
    if (!calculation) return;
    
    const quoteData = {
      quote: {
        fromPincode: formData.fromPincode,
        toPincode: formData.toPincode,
        weight: formData.weight,
        serviceType: formData.serviceType,
        zone: calculation.zone,
        deliveryDays: calculation.deliveryDays
      },
      breakdown: calculation,
      generatedAt: new Date().toISOString(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    const blob = new Blob([JSON.stringify(quoteData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shipping-quote-${formData.fromPincode}-${formData.toPincode}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Quote exported!",
      description: "Shipping quote saved to downloads",
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
            Shipping Rates Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get instant shipping quotes with detailed cost breakdown for your domestic shipments.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Rate Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-brand-red" />
                  Calculate Shipping Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCalculate} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fromPincode">From Pincode *</Label>
                      <Input
                        id="fromPincode"
                        type="text"
                        placeholder="110001"
                        value={formData.fromPincode}
                        onChange={(e) => handleInputChange("fromPincode")(e.target.value)}
                        className="border-2 border-brand-red bg-background"
                        maxLength={6}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="toPincode">To Pincode *</Label>
                      <Input
                        id="toPincode"
                        type="text"
                        placeholder="400001"
                        value={formData.toPincode}
                        onChange={(e) => handleInputChange("toPincode")(e.target.value)}
                        className="border-2 border-brand-red bg-background"
                        maxLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="weight">Weight (kg) *</Label>
                      <Input
                        id="weight"
                        type="number"
                        placeholder="1.5"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight")(e.target.value)}
                        className="border-2 border-brand-red bg-background"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <Label>Zone *</Label>
                      <Select value={formData.zone} onValueChange={handleInputChange("zone")}>
                        <SelectTrigger className="border-2 border-brand-red bg-background">
                          <SelectValue placeholder="Select zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="local">Local (Same City)</SelectItem>
                          <SelectItem value="regional">Regional (Same State)</SelectItem>
                          <SelectItem value="national">National</SelectItem>
                          <SelectItem value="remote">Remote Areas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Service Type *</Label>
                    <Select value={formData.serviceType} onValueChange={handleInputChange("serviceType")}>
                      <SelectTrigger className="border-2 border-brand-red bg-background">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">
                          <div className="flex items-center justify-between w-full">
                            <span>Standard (3-5 days)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="express">
                          <div className="flex items-center justify-between w-full">
                            <span>Express (1-2 days)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="priority">
                          <div className="flex items-center justify-between w-full">
                            <span>Priority (Same Day)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-red hover:bg-brand-red/90 text-white"
                  >
                    {loading ? "Calculating..." : "Calculate Rate"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Rate Slabs Table */}
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle>Weight Slabs & Multipliers</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-brand-red/20">
                        <th className="text-left p-3">Weight Range</th>
                        <th className="text-center p-3">Multiplier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ratesData.weightSlabs.map((slab, index) => (
                        <tr key={index} className="border-b border-brand-red/10">
                          <td className="p-3">
                            {slab.min} - {slab.max === 999 ? "∞" : slab.max} kg
                          </td>
                          <td className="text-center p-3">
                            <Badge variant="secondary">{slab.multiplier}x</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results and Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {calculation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={calculation.total}
              >
                <Card className="border-2 border-brand-red bg-card-light">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <IndianRupee className="w-5 h-5 text-brand-red" />
                      Rate Breakdown
                    </CardTitle>
                    <Button
                      onClick={exportQuote}
                      variant="outline"
                      size="sm"
                      className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Service Details */}
                      <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-lg border border-brand-red/30">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-brand-red" />
                          <div>
                            <div className="font-medium">{calculation.service}</div>
                            <div className="text-sm text-muted-foreground">{calculation.zone}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-brand-red" />
                          <div>
                            <div className="font-medium">Delivery</div>
                            <div className="text-sm text-muted-foreground">{calculation.deliveryDays}</div>
                          </div>
                        </div>
                      </div>

                      {/* Cost Breakdown */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Base Rate:</span>
                          <span className="font-medium">₹{calculation.baseAmount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Fuel Surcharge:</span>
                          <span className="font-medium">₹{calculation.fuelSurcharge}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t border-brand-red/20 pt-2">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium">₹{calculation.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">GST (18%):</span>
                          <span className="font-medium">₹{calculation.gst}</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t-2 border-brand-red pt-3">
                          <span className="text-brand-red">Total Amount:</span>
                          <span className="text-brand-red">₹{calculation.total}</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground text-center mt-4">
                        💡 Rates are indicative and may vary based on actual dimensions and route
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Zone Information */}
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle>Zone & Service Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Zones:</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(ratesData.zones).map(([key, zone]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-muted-foreground">{zone.name}:</span>
                          <Badge variant="secondary">₹{zone.baseRate} base</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Service Types:</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(ratesData.serviceTypes).map(([key, service]) => (
                        <div key={key} className="flex justify-between items-center">
                          <span className="text-muted-foreground">
                            {service.name} ({service.deliveryDays}):
                          </span>
                          <Badge variant="secondary">{service.multiplier}x rate</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bulk Options */}
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle>Bulk Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    variant="outline"
                    className="w-full border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Import CSV for Bulk Quotes
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    Upload CSV with columns: FromPin, ToPin, Weight, ServiceType
                  </p>
                </div>
              </CardContent>
            </Card>

            {!calculation && (
              <Card className="border-2 border-brand-red bg-card-light">
                <CardContent className="p-8 text-center">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Calculate Shipping Rate
                  </h3>
                  <p className="text-muted-foreground">
                    Fill in the shipping details to get an instant rate quote with detailed breakdown
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ShippingRates;