import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Package, Clock, CheckCircle, XCircle, Truck, Calendar, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Shipment {
  id: string;
  trackingNumber: string;
  recipientName: string;
  destination: string;
  status: "in-transit" | "delivered" | "pending" | "cancelled";
  shipmentDate: string;
  estimatedDelivery: string;
  service: string;
  weight: string;
  amount: number;
}

const MyShipments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - In real app, this would come from API
  const shipments: Shipment[] = [
    {
      id: "1",
      trackingNumber: "OCL240001234",
      recipientName: "John Doe",
      destination: "Mumbai, MH",
      status: "delivered",
      shipmentDate: "2024-01-15",
      estimatedDelivery: "2024-01-17",
      service: "Express",
      weight: "2.5 kg",
      amount: 450
    },
    {
      id: "2", 
      trackingNumber: "OCL240001235",
      recipientName: "Jane Smith",
      destination: "Delhi, DL",
      status: "in-transit",
      shipmentDate: "2024-01-18",
      estimatedDelivery: "2024-01-20",
      service: "Standard",
      weight: "1.2 kg",
      amount: 280
    },
    {
      id: "3",
      trackingNumber: "OCL240001236", 
      recipientName: "Mike Johnson",
      destination: "Bangalore, KA",
      status: "pending",
      shipmentDate: "2024-01-20",
      estimatedDelivery: "2024-01-22",
      service: "Express",
      weight: "3.0 kg",
      amount: 520
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-transit":
        return <Truck className="h-4 w-4 text-blue-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Package className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-transit":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && shipment.status === activeTab;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-brand-red bg-clip-text text-transparent">
            My Shipments
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track and manage all your shipments in one place. View delivery status, estimated dates, and shipment details.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by tracking number, recipient, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 border-brand-red/30 focus:border-brand-red"
              />
            </div>
            <Button className="bg-brand-red hover:bg-brand-red/90 text-white px-8">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All ({shipments.length})</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
              <TabsTrigger value="in-transit">In Transit</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredShipments.length === 0 ? (
                <Card className="daakbox-card text-center py-12">
                  <CardContent>
                    <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No shipments found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? "Try adjusting your search criteria" : "You don't have any shipments yet"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {filteredShipments.map((shipment) => (
                    <motion.div
                      key={shipment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card className="daakbox-card hover:shadow-lg transition-all duration-300">
                        <CardHeader className="pb-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                                {getStatusIcon(shipment.status)}
                                {shipment.trackingNumber}
                              </CardTitle>
                              <p className="text-muted-foreground">
                                To: {shipment.recipientName}
                              </p>
                            </div>
                            <Badge className={`${getStatusColor(shipment.status)} capitalize`}>
                              {shipment.status.replace('-', ' ')}
                            </Badge>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="flex items-center gap-3">
                              <MapPin className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Destination</p>
                                <p className="font-medium">{shipment.destination}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Calendar className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Shipped Date</p>
                                <p className="font-medium">{new Date(shipment.shipmentDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Clock className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Est. Delivery</p>
                                <p className="font-medium">{new Date(shipment.estimatedDelivery).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <Package className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="text-sm text-muted-foreground">Service</p>
                                <p className="font-medium">{shipment.service}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:flex-row md:items-center justify-between mt-6 pt-4 border-t">
                            <div className="flex items-center gap-6 mb-4 md:mb-0">
                              <span className="text-sm text-muted-foreground">
                                Weight: <span className="font-medium">{shipment.weight}</span>
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Amount: <span className="font-medium">₹{shipment.amount}</span>
                              </span>
                            </div>
                            
                            <div className="flex gap-3">
                              <Button variant="outline" size="sm" className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white">
                                Track Details
                              </Button>
                              <Button size="sm" className="bg-brand-red hover:bg-brand-red/90 text-white">
                                Download Receipt
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default MyShipments;
