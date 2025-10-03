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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  
  const { toast } = useToast();

  // Function to refresh user data from server
  const refreshUserData = async () => {
    try {
      const token = localStorage.getItem('officeToken');
      if (!token) return;

      const response = await fetch('/api/office/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        localStorage.setItem('officeUser', JSON.stringify(userData.user));
        setHasPermission(userData.user.permissions?.addressForms || false);
      } else if (response.status === 401) {
        // Token expired
        localStorage.removeItem('officeToken');
        localStorage.removeItem('officeUser');
        window.location.href = '/office';
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  // Check user permissions on component mount
  useEffect(() => {
    const checkPermissions = () => {
      const userData = localStorage.getItem('officeUser');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setHasPermission(user.permissions?.addressForms || false);
        } catch (error) {
          console.error('Error parsing user data:', error);
          setHasPermission(false);
        }
      } else {
        setHasPermission(false);
      }
    };
    
    checkPermissions();
  }, []);

  useEffect(() => {
    fetchForms();
  }, [searchTerm, completedFilter, stateFilter]);

  const fetchForms = async (page = 1) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('officeToken');
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(completedFilter !== 'all' && { completed: completedFilter }),
        ...(stateFilter && { state: stateFilter })
      });

      const response = await fetch(`/api/office/addressforms?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setForms(data.data);
        setPagination(data.pagination);
        setError('');
      } else if (response.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('officeToken');
        localStorage.removeItem('officeUser');
        window.location.href = '/office';
        return;
      } else if (response.status === 403) {
        setHasPermission(false);
        setError('You do not have permission to view address forms. Please contact your administrator.');
        // Refresh user data to get latest permissions
        await refreshUserData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load address forms');
      }
    } catch (error) {
      console.error('Error fetching forms:', error);
      setError('Network error while loading address forms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewForm = (form: AddressForm) => {
    setSelectedForm(form);
    setIsViewModalOpen(true);
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

  const getCompletionBadge = (form: AddressForm) => {
    if (form.formCompleted) {
      return <Badge variant="default" className="bg-green-100 text-green-800">Complete</Badge>;
    } else {
      return <Badge variant="secondary">Incomplete</Badge>;
    }
  };

  // If user doesn't have permission, don't render the component
  if (!hasPermission) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Address Forms</h2>
          <p className="text-gray-600">View and manage customer address forms</p>
        </div>
        <Button onClick={() => fetchForms()} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search forms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={completedFilter} onValueChange={setCompletedFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
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
              className="w-[180px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Forms Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading forms...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : forms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No forms found
                    </TableCell>
                  </TableRow>
                ) : (
                  forms.map((form) => (
                    <React.Fragment key={form._id}>
                      <TableRow>
                        <TableCell>
                          <div>
                            <div className="font-semibold">{form.senderName}</div>
                            <div className="text-sm text-gray-500">{form.senderEmail}</div>
                            <div className="text-xs text-gray-400">{form.senderPhone}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {form.receiverName ? (
                            <div>
                              <div className="font-semibold">{form.receiverName}</div>
                              <div className="text-sm text-gray-500">{form.receiverEmail}</div>
                              <div className="text-xs text-gray-400">{form.receiverPhone}</div>
                            </div>
                          ) : (
                            <span className="text-gray-400">Not provided</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {getCompletionBadge(form)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(form.createdAt).toLocaleDateString()}
                            <div className="text-xs text-gray-400">
                              {new Date(form.createdAt).toLocaleTimeString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewForm(form)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleRowExpansion(form._id)}
                            >
                              {expandedRows.has(form._id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      {expandedRows.has(form._id) && (
                        <TableRow>
                          <TableCell colSpan={5} className="bg-gray-50">
                            <div className="p-4 space-y-3">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Sender Details</h4>
                                  <div className="space-y-1 text-sm">
                                    <div><span className="font-medium">Pincode:</span> {form.senderPincode}</div>
                                    {form.senderState && <div><span className="font-medium">State:</span> {form.senderState}</div>}
                                    {form.senderCity && <div><span className="font-medium">City:</span> {form.senderCity}</div>}
                                  </div>
                                </div>
                                {form.receiverName && (
                                  <div>
                                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Receiver Details</h4>
                                    <div className="space-y-1 text-sm">
                                      <div><span className="font-medium">Pincode:</span> {form.receiverPincode}</div>
                                      {form.receiverState && <div><span className="font-medium">State:</span> {form.receiverState}</div>}
                                      {form.receiverCity && <div><span className="font-medium">City:</span> {form.receiverCity}</div>}
                                    </div>
                                  </div>
                                )}
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
        </CardContent>
      </Card>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => fetchForms(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => fetchForms(pagination.currentPage + 1)}
            disabled={!pagination.hasNext || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      {/* View Form Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Form Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedForm?.senderName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedForm && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-lg mb-3">Sender Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedForm.senderName}</div>
                    <div><span className="font-medium">Email:</span> {selectedForm.senderEmail}</div>
                    <div><span className="font-medium">Phone:</span> {selectedForm.senderPhone}</div>
                    <div><span className="font-medium">Pincode:</span> {selectedForm.senderPincode}</div>
                    {selectedForm.senderState && <div><span className="font-medium">State:</span> {selectedForm.senderState}</div>}
                    {selectedForm.senderCity && <div><span className="font-medium">City:</span> {selectedForm.senderCity}</div>}
                  </div>
                </div>
                
                {selectedForm.receiverName && (
                  <div>
                    <h4 className="font-semibold text-lg mb-3">Receiver Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {selectedForm.receiverName}</div>
                      <div><span className="font-medium">Email:</span> {selectedForm.receiverEmail}</div>
                      <div><span className="font-medium">Phone:</span> {selectedForm.receiverPhone}</div>
                      <div><span className="font-medium">Pincode:</span> {selectedForm.receiverPincode}</div>
                      {selectedForm.receiverState && <div><span className="font-medium">State:</span> {selectedForm.receiverState}</div>}
                      {selectedForm.receiverCity && <div><span className="font-medium">City:</span> {selectedForm.receiverCity}</div>}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Form Status:</span>
                    {getCompletionBadge(selectedForm)}
                  </div>
                  <div className="text-sm text-gray-500">
                    Created: {new Date(selectedForm.createdAt).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressFormsTable;
