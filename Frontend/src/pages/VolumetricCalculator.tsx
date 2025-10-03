import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calculator, Package, Scale, Info, Download, RotateCcw } from "lucide-react";
import { calculateVolumetricWeight, type VolumetricCalcResult } from "@/utils/calc";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VolumetricCalculator = () => {
  const [dimensions, setDimensions] = useState({
    length: "",
    width: "", 
    height: "",
    actualWeight: ""
  });
  const [result, setResult] = useState<VolumetricCalcResult | null>(null);
  const [animationKey, setAnimationKey] = useState(0);
  const { toast } = useToast();

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    
    const { length, width, height, actualWeight } = dimensions;
    
    if (!length || !width || !height || !actualWeight) {
      toast({
        title: "Please fill all fields",
        description: "All dimensions and actual weight are required",
        variant: "destructive",
      });
      return;
    }

    const lengthNum = parseFloat(length);
    const widthNum = parseFloat(width);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(actualWeight);

    if (lengthNum <= 0 || widthNum <= 0 || heightNum <= 0 || weightNum <= 0) {
      toast({
        title: "Invalid values",
        description: "All values must be greater than zero",
        variant: "destructive",
      });
      return;
    }

    const calcResult = calculateVolumetricWeight(lengthNum, widthNum, heightNum, weightNum);
    setResult(calcResult);
    setAnimationKey(prev => prev + 1);
    
    toast({
      title: "Calculation completed!",
      description: `Chargeable weight: ${calcResult.chargeableWeight} kg`,
    });
  };

  const handleReset = () => {
    setDimensions({
      length: "",
      width: "",
      height: "",
      actualWeight: ""
    });
    setResult(null);
    setAnimationKey(prev => prev + 1);
  };

  const handleInputChange = (field: keyof typeof dimensions) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setDimensions(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const exportCalculation = () => {
    if (!result) return;
    
    const data = {
      dimensions: result.dimensions,
      actualWeight: result.actualWeight,
      volumetricWeight: result.volumetricWeight,
      chargeableWeight: result.chargeableWeight,
      calculatedAt: new Date().toISOString(),
      formula: "(Length × Width × Height) ÷ 5000"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `volumetric-calculation-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Calculation exported!",
      description: "Calculation data saved to downloads",
    });
  };

  // Visual box scale based on dimensions
  const getBoxScale = () => {
    if (!result) return { scaleX: 1, scaleY: 1, scaleZ: 1 };
    
    const { length, width, height } = result.dimensions;
    const maxDim = Math.max(length, width, height);
    const baseScale = 100; // Base scale for visualization
    
    return {
      scaleX: (length / maxDim) * baseScale,
      scaleY: (height / maxDim) * baseScale,
      scaleZ: (width / maxDim) * baseScale
    };
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
            Volumetric Weight Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate the volumetric weight of your shipment to determine accurate shipping charges.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-brand-red" />
                  Package Dimensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCalculate} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="length">Length (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        placeholder="0"
                        value={dimensions.length}
                        onChange={handleInputChange("length")}
                        className="border-2 border-brand-red bg-background"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Width (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="0"
                        value={dimensions.width}
                        onChange={handleInputChange("width")}
                        className="border-2 border-brand-red bg-background"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="0"
                        value={dimensions.height}
                        onChange={handleInputChange("height")}
                        className="border-2 border-brand-red bg-background"
                        min="0"
                        step="0.1"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="actualWeight">Actual Weight (kg)</Label>
                    <Input
                      id="actualWeight"
                      type="number"
                      placeholder="0"
                      value={dimensions.actualWeight}
                      onChange={handleInputChange("actualWeight")}
                      className="border-2 border-brand-red bg-background"
                      min="0"
                      step="0.1"
                      required
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white"
                    >
                      Calculate
                    </Button>
                    <Button
                      type="button"
                      onClick={handleReset}
                      variant="outline"
                      className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Formula Info */}
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-brand-red" />
                  How It Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Volumetric Weight Formula:</h4>
                    <div className="bg-background/80 p-3 rounded-lg border border-brand-red/30">
                      <code className="text-sm text-brand-red">
                        Volumetric Weight = (Length × Width × Height) ÷ 5000
                      </code>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Chargeable Weight:</h4>
                    <p className="text-sm text-muted-foreground">
                      The higher value between actual weight and volumetric weight.
                      This is used to calculate shipping charges.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                    <div>
                      <strong>Light & Bulky:</strong> Volumetric weight is higher
                    </div>
                    <div>
                      <strong>Heavy & Compact:</strong> Actual weight is higher
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results and Visualization */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* Visual Box */}
            <Card className="border-2 border-brand-red bg-card-light">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-brand-red" />
                  Package Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center perspective-1000">
                  <motion.div
                    key={animationKey}
                    initial={{ scale: 0, rotateX: 0, rotateY: 0 }}
                    animate={{ 
                      scale: 1,
                      rotateX: 15,
                      rotateY: 25,
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "easeOut"
                    }}
                    className="relative"
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                  >
                    {result ? (
                      <div
                        className="border-4 border-brand-red bg-gradient-to-br from-brand-red/20 to-brand-red/40 rounded-lg shadow-2xl relative"
                        style={{
                          width: `${Math.max(getBoxScale().scaleX, 40)}px`,
                          height: `${Math.max(getBoxScale().scaleY, 40)}px`,
                          transform: `rotateX(-15deg) rotateY(-25deg)`
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-red/30 to-transparent rounded-lg" />
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-brand-red">
                          {result.dimensions.length} × {result.dimensions.width} × {result.dimensions.height} cm
                        </div>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border-4 border-dashed border-muted-foreground/50 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </motion.div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={result.chargeableWeight}
              >
                <Card className="border-2 border-brand-red bg-card-light">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-brand-red" />
                      Calculation Results
                    </CardTitle>
                    <Button
                      onClick={exportCalculation}
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
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-background/50 rounded-lg border border-brand-red/30">
                          <div className="text-2xl font-bold text-foreground">{result.actualWeight}</div>
                          <div className="text-sm text-muted-foreground">Actual Weight (kg)</div>
                        </div>
                        <div className="text-center p-4 bg-background/50 rounded-lg border border-brand-red/30">
                          <div className="text-2xl font-bold text-foreground">{result.volumetricWeight}</div>
                          <div className="text-sm text-muted-foreground">Volumetric Weight (kg)</div>
                        </div>
                      </div>
                      
                      <div className="text-center p-6 bg-brand-red/10 rounded-lg border-2 border-brand-red">
                        <div className="text-3xl font-bold text-brand-red mb-1">
                          {result.chargeableWeight} kg
                        </div>
                        <div className="text-sm font-medium text-brand-red">
                          Chargeable Weight
                        </div>
                        <Badge 
                          className={`mt-2 ${
                            result.chargeableWeight === result.volumetricWeight 
                              ? "bg-warning text-warning-foreground" 
                              : "bg-success text-success-foreground"
                          }`}
                        >
                          {result.chargeableWeight === result.volumetricWeight 
                            ? "Based on Volume" 
                            : "Based on Actual Weight"}
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-muted-foreground text-center">
                        💡 Shipping charges will be calculated based on the chargeable weight
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {!result && (
              <Card className="border-2 border-brand-red bg-card-light">
                <CardContent className="p-8 text-center">
                  <Calculator className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    Enter Dimensions
                  </h3>
                  <p className="text-muted-foreground">
                    Fill in the package dimensions and weight to see the calculation results
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

export default VolumetricCalculator;