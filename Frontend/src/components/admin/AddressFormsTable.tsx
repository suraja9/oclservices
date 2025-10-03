import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Search, 
  Edit, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  Filter,
  Download,
  Eye
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AddressFormEditModal from "./AddressFormEditModal";

interface AddressForm {
  _id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderPincode: string;
  receiverName?: string;
  receiverEmail?: string;
  receiverPhone?: string;
  receiverPincode?: string;
  formCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  senderState?: string;
  senderCity?: string;
  receiverState?: string;
  receiverCity?: string;
  // Add other fields as needed
  [key: string]: any;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

const AddressFormsTable = () => {
  const [forms, setForms] = useState<AddressForm[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [completedFilter, setCompletedFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedForm, setSelectedForm] = useState<AddressForm | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formToDelete, setFormToDelete] = useState<AddressForm | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchForms();
  }, [searchTerm, completedFilter, stateFilter]);

  const fetchForms = async (page = 1) => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (completedFilter !== 'all') params.append('completed', completedFilter);
      if (stateFilter) params.append('state', stateFilter);
      
      const response = await fetch(`/api/admin/addressforms?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data.data);
        setPagination(data.pagination);
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
        // Redirect to login
        window.location.href = '/admin';
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to load address forms');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError('Network error while loading forms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (form: AddressForm) => {
    setSelectedForm(form);
    setIsEditModalOpen(true);
  };

  const handleDelete = (form: AddressForm) => {
    setFormToDelete(form);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!formToDelete) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/addressforms/${formToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Form Deleted",
          description: "Address form has been successfully deleted.",
        });
        fetchForms(pagination?.currentPage || 1);
      } else {
        const data = await response.json();
        toast({
          title: "Delete Failed",
          description: data.error || "Failed to delete the form.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Network error while deleting the form.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setFormToDelete(null);
    }
  };

  const toggleRowExpansion = (formId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(formId)) {
      newExpandedRows.delete(formId);
    } else {
      newExpandedRows.add(formId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleFormUpdate = () => {
    setIsEditModalOpen(false);
    setSelectedForm(null);
    fetchForms(pagination?.currentPage || 1);
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (completedFilter !== 'all') params.append('completed', completedFilter);
      if (stateFilter) params.append('state', stateFilter);
      
      const response = await fetch(`/api/admin/addressforms?${params}&limit=1000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const csvContent = convertToCSV(data.data);
        downloadCSV(csvContent, 'address_forms_export.csv');
        
        toast({
          title: "Export Successful",
          description: `${data.data.length} forms exported to CSV.`,
        });
      }
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data.",
        variant: "destructive",
      });
    }
  };

  const convertToCSV = (data: AddressForm[]) => {
    if (data.length === 0) return '';
    
    const headers = [
      'ID', 'Sender Name', 'Sender Email', 'Sender Phone', 'Sender Pincode',
      'Receiver Name', 'Receiver Email', 'Receiver Phone', 'Receiver Pincode',
      'Form Completed', 'Created At', 'Updated At'
    ];
    
    const rows = data.map(form => [
      form._id,
      form.senderName || '',
      form.senderEmail || '',
      form.senderPhone || '',
      form.senderPincode || '',
      form.receiverName || '',
      form.receiverEmail || '',
      form.receiverPhone || '',
      form.receiverPincode || '',
      form.formCompleted ? 'Yes' : 'No',
      new Date(form.createdAt).toLocaleString(),
      new Date(form.updatedAt).toLocaleString()
    ]);
    
    return [headers, ...rows].map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');
  };

  const downloadCSV = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Address Forms Management</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {pagination && `${pagination.totalCount} total forms`}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchForms(1)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, phone, or pincode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={completedFilter} onValueChange={setCompletedFilter}>
              <SelectTrigger className="w-40">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Forms</SelectItem>
                <SelectItem value="true">Completed</SelectItem>
                <SelectItem value="false">Incomplete</SelectItem>
              </SelectContent>
            </Select>
            
            <Input
              placeholder="Filter by state..."
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-40"
            />
          </div>

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading forms...
                    </TableCell>
                  </TableRow>
                ) : forms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No address forms found
                    </TableCell>
                  </TableRow>
                ) : (
                  forms.map((form) => (
                    <React.Fragment key={form._id}>
                      <TableRow>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRowExpansion(form._id)}
                            className="h-6 w-6 p-0"
                          >
                            {expandedRows.has(form._id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{form.senderName}</p>
                            <p className="text-sm text-gray-500">{form.senderEmail}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{form.senderPhone}</p>
                            <p className="text-sm text-gray-500">{form.senderPincode}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{form.senderCity}</p>
                            <p className="text-sm text-gray-500">{form.senderState}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {form.receiverName ? (
                            <div>
                              <p className="text-sm">{form.receiverName}</p>
                              <p className="text-sm text-gray-500">{form.receiverPhone}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={form.formCompleted ? 'default' : 'secondary'}>
                            {form.formCompleted ? 'Complete' : 'Incomplete'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">
                            {new Date(form.createdAt).toLocaleDateString()}
                          </p>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(form)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(form)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      
                      {expandedRows.has(form._id) && (
                        <TableRow>
                          <TableCell colSpan={8} className="bg-gray-50">
                            <div className="p-4 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Sender Details */}
                                <div>
                                  <h4 className="font-semibold mb-2">Sender Details</h4>
                                  <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Name:</span> {form.senderName}</p>
                                    <p><span className="font-medium">Email:</span> {form.senderEmail}</p>
                                    <p><span className="font-medium">Phone:</span> {form.senderPhone}</p>
                                    <p><span className="font-medium">Address:</span> {form.senderAddressLine1}</p>
                                    {form.senderAddressLine2 && (
                                      <p className="ml-16">{form.senderAddressLine2}</p>
                                    )}
                                    <p><span className="font-medium">Area:</span> {form.senderArea}</p>
                                    <p><span className="font-medium">City:</span> {form.senderCity}</p>
                                    <p><span className="font-medium">District:</span> {form.senderDistrict}</p>
                                    <p><span className="font-medium">State:</span> {form.senderState}</p>
                                    <p><span className="font-medium">Pincode:</span> {form.senderPincode}</p>
                                    {form.senderLandmark && (
                                      <p><span className="font-medium">Landmark:</span> {form.senderLandmark}</p>
                                    )}
                                  </div>
                                </div>
                                
                                {/* Receiver Details */}
                                <div>
                                  <h4 className="font-semibold mb-2">Receiver Details</h4>
                                  {form.receiverName ? (
                                    <div className="space-y-1 text-sm">
                                      <p><span className="font-medium">Name:</span> {form.receiverName}</p>
                                      <p><span className="font-medium">Email:</span> {form.receiverEmail}</p>
                                      <p><span className="font-medium">Phone:</span> {form.receiverPhone}</p>
                                      <p><span className="font-medium">Address:</span> {form.receiverAddressLine1}</p>
                                      {form.receiverAddressLine2 && (
                                        <p className="ml-16">{form.receiverAddressLine2}</p>
                                      )}
                                      <p><span className="font-medium">Area:</span> {form.receiverArea}</p>
                                      <p><span className="font-medium">City:</span> {form.receiverCity}</p>
                                      <p><span className="font-medium">District:</span> {form.receiverDistrict}</p>
                                      <p><span className="font-medium">State:</span> {form.receiverState}</p>
                                      <p><span className="font-medium">Pincode:</span> {form.receiverPincode}</p>
                                      {form.receiverLandmark && (
                                        <p><span className="font-medium">Landmark:</span> {form.receiverLandmark}</p>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-gray-500 text-sm">Receiver details not provided</p>
                                  )}
                                </div>
                              </div>
                              
                              {/* Additional Data */}
                              {(form.originData || form.destinationData || form.shipmentData) && (
                                <div>
                                  <h4 className="font-semibold mb-2">Additional Information</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    {form.shipmentData && (
                                      <div>
                                        <p className="font-medium">Shipment:</p>
                                        <p>{form.shipmentData.natureOfConsignment}</p>
                                        <p>{form.shipmentData.services}</p>
                                      </div>
                                    )}
                                    {form.uploadData && (
                                      <div>
                                        <p className="font-medium">Packages:</p>
                                        <p>{form.uploadData.totalPackages} package(s)</p>
                                        {form.uploadData.invoiceValue && (
                                          <p>Value: ₹{form.uploadData.invoiceValue}</p>
                                        )}
                                      </div>
                                    )}
                                    {form.paymentData && (
                                      <div>
                                        <p className="font-medium">Payment:</p>
                                        <p>{form.paymentData.mode}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                              
                              <div className="text-xs text-gray-500 border-t pt-2">
                                <p>Created: {new Date(form.createdAt).toLocaleString()}</p>
                                <p>Updated: {new Date(form.updatedAt).toLocaleString()}</p>
                                <p>ID: {form._id}</p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.totalCount} total forms)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchForms(pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchForms(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {selectedForm && (
        <AddressFormEditModal
          form={selectedForm}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedForm(null);
          }}
          onUpdate={handleFormUpdate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the form for "{formToDelete?.senderName}"?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddressFormsTable;
