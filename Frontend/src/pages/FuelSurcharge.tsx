import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useScrollAnimation, useStaggeredAnimation } from "@/hooks/useScrollAnimation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import businessBg from "@/assets/business-bg.jpg";

const FuelSurcharge = () => {
  const [baseRate, setBaseRate] = useState<number>(0);
  const [calculatedRate, setCalculatedRate] = useState<number>(0);
  
  const titleAnimation = useScrollAnimation();
  const cardAnimations = useStaggeredAnimation(2, 200);
  const historyAnimation = useScrollAnimation({ delay: 600 });
  
  // Demo fuel surcharge percentage
  const currentSurcharge = 12.5;
  
  const calculateRate = () => {
    const surchargeAmount = (baseRate * currentSurcharge) / 100;
    setCalculatedRate(baseRate + surchargeAmount);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5 relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 opacity-5"
        style={{
          backgroundImage: `url(${businessBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      />
      
      <Navbar />
      
      <div className="container mx-auto px-4 pt-20 pb-12 relative z-10">
        {/* Hero Section */}
        <div ref={titleAnimation.ref} className={`text-center mb-8 transition-all duration-700 ${titleAnimation.className}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-brand-red bg-clip-text text-transparent">
            Fuel Surcharge Calculator
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Calculate shipping rates with current fuel surcharge applied
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Current Surcharge Card */}
          <div ref={cardAnimations[0].ref} className={`transition-all duration-700 ${cardAnimations[0].className}`}>
            <Card className="border-2 border-brand-red bg-success-light/10 hover:shadow-elegant transition-all duration-300 h-full">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-brand-red" />
                </div>
                <CardTitle className="text-xl">Current Fuel Surcharge</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-brand-red mb-2">
                    {currentSurcharge}%
                  </div>
                  <p className="text-muted-foreground text-sm">Effective from March 2024</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Surcharge Level</span>
                    <span className="font-medium">Moderate</span>
                  </div>
                  <Progress value={currentSurcharge * 2} className="h-2" />
                </div>

                <div className="bg-warning-light/20 border border-warning rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Info className="w-4 h-4 text-warning mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Surcharge Information</p>
                      <p className="text-muted-foreground">
                        Fuel surcharge is adjusted monthly based on current fuel prices and market conditions.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calculator Card */}
          <div ref={cardAnimations[1].ref} className={`transition-all duration-700 ${cardAnimations[1].className}`}>
            <Card className="border-2 border-brand-red bg-success-light/10 h-full">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                  <Calculator className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl text-center">Rate Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="baseRate" className="text-base font-medium">
                      Base Shipping Rate (₹)
                    </Label>
                    <Input
                      id="baseRate"
                      type="number"
                      value={baseRate || ""}
                      onChange={(e) => setBaseRate(Number(e.target.value))}
                      placeholder="Enter base rate"
                      className="mt-2 border-2 border-brand-red/20 bg-success-light/10 focus:border-brand-red"
                    />
                  </div>

                  <Button 
                    onClick={calculateRate}
                    variant="learn-more"
                    size="sm"
                    className="w-full"
                  >
                    Calculate Final Rate
                  </Button>
                </div>

                {calculatedRate > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-primary/5 border-2 border-primary rounded-lg p-4 space-y-3"
                  >
                    <h3 className="text-lg font-semibold text-center">Rate Breakdown</h3>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Base Rate:</span>
                        <span className="font-medium">₹{baseRate.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Fuel Surcharge ({currentSurcharge}%):</span>
                        <span className="font-medium">₹{((baseRate * currentSurcharge) / 100).toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Final Rate:</span>
                        <span className="text-primary">₹{calculatedRate.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="text-xs text-muted-foreground text-center">
                  * Rates are subject to additional taxes and charges
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Historical Data Section */}
        <div ref={historyAnimation.ref} className={`mt-12 transition-all duration-700 ${historyAnimation.className}`}>
          <Card className="border-2 border-brand-red bg-success-light/10">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Historical Fuel Surcharge</CardTitle>
              <p className="text-center text-muted-foreground">
                Last 6 months surcharge rates
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { month: "Oct 2023", rate: 10.2 },
                  { month: "Nov 2023", rate: 11.1 },
                  { month: "Dec 2023", rate: 11.8 },
                  { month: "Jan 2024", rate: 12.0 },
                  { month: "Feb 2024", rate: 12.3 },
                  { month: "Mar 2024", rate: 12.5 }
                ].map((item, index) => (
                  <motion.div
                    key={item.month}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="text-center p-3 border-2 border-brand-red/20 rounded-lg bg-success-light/5 hover:shadow-sm transition-all duration-300"
                  >
                    <div className="text-sm text-muted-foreground mb-1">{item.month}</div>
                    <div className="text-xl font-bold text-primary">{item.rate}%</div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FuelSurcharge;