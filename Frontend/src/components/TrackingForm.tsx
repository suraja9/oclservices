import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Upload, Loader2 } from "lucide-react";

interface TrackingFormProps {
  onTrack: (awbs: string[]) => void;
  isLoading: boolean;
}

export const TrackingForm: React.FC<TrackingFormProps> = ({ onTrack, isLoading }) => {
  const [singleAwb, setSingleAwb] = useState("");
  const [batchAwbs, setBatchAwbs] = useState("");

  const handleSingleTrack = () => {
    if (singleAwb.trim()) {
      onTrack([singleAwb.trim()]);
    }
  };

  const handleBatchTrack = () => {
    const awbs = batchAwbs
      .split(/[\n,]/)
      .map(awb => awb.trim())
      .filter(awb => awb.length > 0);
    
    if (awbs.length > 0) {
      onTrack(awbs);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setBatchAwbs(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card className="border-2 border-brand-red bg-card-light shadow-lg">
        <CardContent className="p-6">
          <Tabs defaultValue="single" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="single" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Single AWB
              </TabsTrigger>
              <TabsTrigger value="batch" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Batch Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Enter AWB Number (e.g., DXB001234)"
                    value={singleAwb}
                    onChange={(e) => setSingleAwb(e.target.value)}
                    className="border-2 border-brand-red bg-background text-lg p-6 focus:ring-2 focus:ring-brand-red/50"
                    onKeyPress={(e) => e.key === 'Enter' && handleSingleTrack()}
                  />
                </div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSingleTrack}
                    disabled={!singleAwb.trim() || isLoading}
                    variant="learn-more"
                    className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Tracking...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Track Package
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>

            <TabsContent value="batch" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Enter multiple AWB numbers (one per line or comma-separated):
                  </label>
                  <Textarea
                    placeholder="DXB001234&#10;DXB001235&#10;DXB001236"
                    value={batchAwbs}
                    onChange={(e) => setBatchAwbs(e.target.value)}
                    className="border-2 border-brand-red bg-background min-h-32 focus:ring-2 focus:ring-brand-red/50"
                  />
                </div>
                
                <div className="border-2 border-dashed border-brand-red rounded-lg p-4 text-center bg-background">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-brand-red" />
                    <p className="text-sm text-muted-foreground">
                      Or upload a CSV file with AWB numbers
                    </p>
                  </label>
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleBatchTrack}
                    disabled={!batchAwbs.trim() || isLoading}
                    variant="learn-more"
                    className="w-full h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5 mr-2" />
                        Track All Packages
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};