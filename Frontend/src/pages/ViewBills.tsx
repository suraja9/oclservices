import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Download, Search, FileText, Filter, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import invoicesData from "@/data/invoices.json";

interface Invoice {
  id: string;
  awb: string;
  date: string;
  amount: number;
  status: string;
  recipient: string;
  destination: string;
  dueDate: string;
}

const ViewBills = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    // TODO: Replace with Supabase call
    setInvoices(invoicesData.invoices);
    setFilteredInvoices(invoicesData.invoices);
  }, []);

  useEffect(() => {
    let filtered = invoices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.awb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.recipient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(invoice => 
        invoice.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    // Date filter (simplified for demo)
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case "7days":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "30days":
          filterDate.setDate(now.getDate() - 30);
          break;
        case "90days":
          filterDate.setDate(now.getDate() - 90);
          break;
        default:
          filterDate.setFullYear(now.getFullYear() - 1);
      }
      
      filtered = filtered.filter(invoice => 
        new Date(invoice.date) >= filterDate
      );
    }

    setFilteredInvoices(filtered);
  }, [invoices, searchTerm, statusFilter, dateFilter]);

  const handleDownload = (invoiceId: string) => {
    // TODO: Replace with actual PDF download
    toast({
      title: "Download Started",
      description: `Downloading invoice ${invoiceId}...`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "overdue":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background-soft flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20 pb-16">
        {/* Header */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                View Bills Online
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Access and download your invoices, track payments, and manage your billing history
              </p>
            </motion.div>

            {/* Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-2 border-brand-red bg-card-light mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-brand-red" />
                    Filter & Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search invoices..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-2 border-brand-red/30 focus:border-brand-red bg-background pl-10"
                      />
                    </div>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red bg-background">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={dateFilter} onValueChange={setDateFilter}>
                      <SelectTrigger className="border-2 border-brand-red/30 focus:border-brand-red bg-background">
                        <SelectValue placeholder="Filter by date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="year">Last year</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setDateFilter("all");
                      }}
                      variant="outline"
                      className="border-2 border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Invoices List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((invoice, index) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Card className="border-2 border-brand-red bg-card-light hover:shadow-lg transition-all duration-200">
                      <CardContent className="p-6">
                        <div className="grid md:grid-cols-6 gap-4 items-center">
                          <div>
                            <p className="text-sm text-muted-foreground">Invoice ID</p>
                            <p className="font-semibold font-mono">{invoice.id}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">AWB Number</p>
                            <p className="font-semibold font-mono">{invoice.awb}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Date</p>
                            <p className="font-semibold">{new Date(invoice.date).toLocaleDateString()}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Amount</p>
                            <p className="font-semibold text-lg">₹{invoice.amount.toFixed(2)}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge className={`${getStatusColor(invoice.status)} border`}>
                              {invoice.status}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownload(invoice.id)}
                                className="border-brand-red text-brand-red hover:bg-brand-red hover:text-white"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </Button>
                            </motion.div>
                            
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                size="sm"
                                className="bg-brand-red hover:bg-brand-red/90 text-white"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t border-brand-red/20">
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Recipient: </span>
                              <span className="font-medium">{invoice.recipient}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Destination: </span>
                              <span className="font-medium">{invoice.destination}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <Card className="border-2 border-brand-red bg-card-light">
                  <CardContent className="p-12 text-center">
                    <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Invoices Found</h3>
                    <p className="text-muted-foreground">
                      {searchTerm || statusFilter !== "all" || dateFilter !== "all"
                        ? "Try adjusting your filters to see more results."
                        : "You don't have any invoices yet. Start shipping to see your bills here."}
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Summary Stats */}
            {filteredInvoices.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-8"
              >
                <Card className="border-2 border-brand-red bg-card-light">
                  <CardHeader>
                    <CardTitle>Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-6 text-center">
                      <div>
                        <p className="text-2xl font-bold text-foreground">
                          {filteredInvoices.length}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Invoices</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-success">
                          ₹{filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Amount</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-success">
                          {filteredInvoices.filter(inv => inv.status === "Paid").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Paid Invoices</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-warning">
                          {filteredInvoices.filter(inv => inv.status === "Pending").length}
                        </p>
                        <p className="text-sm text-muted-foreground">Pending Invoices</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ViewBills;