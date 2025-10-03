import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus, 
  RefreshCw,
  Filter,
  Download,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Pincode {
  _id: string;
  pincode: number;
  areaname: string;
  cityname: string;
  distrcitname: string; // Note: using the typo that exists in the model
  statename: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrev: boolean;
  limit: number;
}

const PincodeManagement = () => {
  const [pincodes, setPincodes] = useState<Pincode[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPincode, setSelectedPincode] = useState<Pincode | null>(null);
  const [pincodeToDelete, setPincodeToDelete] = useState<Pincode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasPermission, setHasPermission] = useState(true);
  const [formData, setFormData] = useState({
    pincode: '',
    areaname: '',
    cityname: '',
    distrcitname: '', // Note: using the typo that exists in the model
    statename: ''
  });
  
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
        setHasPermission(userData.user.permissions?.pincodeManagement || false);
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
          setHasPermission(user.permissions?.pincodeManagement || false);
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
    const timeoutId = setTimeout(() => {
      fetchPincodes();
    }, 300); // Debounce search by 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, stateFilter, cityFilter]);

  const fetchPincodes = async (page = 1) => {
    try {
      setIsLoading(true);
      setError('');
      const token = localStorage.getItem('officeToken');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        window.location.href = '/office';
        return;
      }
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(stateFilter && { state: stateFilter }),
        ...(cityFilter && { city: cityFilter })
      });

      const response = await fetch(`/api/office/pincodes?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPincodes(data.data || []);
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
        setError('You do not have permission to view pincode management. Please contact your administrator.');
        // Refresh user data to get latest permissions
        await refreshUserData();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to load pincodes');
      }
    } catch (error) {
      console.error('Error fetching pincodes:', error);
      setError('Network error while loading pincodes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddPincode = () => {
    setFormData({
      pincode: '',
      areaname: '',
      cityname: '',
      distrcitname: '',
      statename: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEditPincode = (pincode: Pincode) => {
    setSelectedPincode(pincode);
    setFormData({
      pincode: pincode.pincode.toString(),
      areaname: pincode.areaname,
      cityname: pincode.cityname,
      distrcitname: pincode.distrcitname,
      statename: pincode.statename
    });
    setIsEditModalOpen(true);
  };

  const handleSavePincode = async () => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('officeToken');
      
      if (!token) {
        toast({
          title: "Error",
          description: 'No authentication token found. Please login again.',
          variant: "destructive",
        });
        window.location.href = '/office';
        return;
      }
      
      const endpoint = isEditModalOpen 
        ? `/api/office/pincodes/${selectedPincode?._id}`
        : '/api/office/pincodes';
      
      const method = isEditModalOpen ? 'PUT' : 'POST';
      
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `Pincode ${isEditModalOpen ? 'updated' : 'added'} successfully.`,
        });
        
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedPincode(null);
        fetchPincodes();
      } else if (response.status === 401) {
        localStorage.removeItem('officeToken');
        localStorage.removeItem('officeUser');
        window.location.href = '/office';
        return;
      } else if (response.status === 403) {
        toast({
          title: "Error",
          description: 'You do not have permission to manage pincodes. Please contact your administrator.',
          variant: "destructive",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || `Failed to ${isEditModalOpen ? 'update' : 'add'} pincode`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error saving pincode:', error);
      toast({
        title: "Error",
        description: 'Network error while saving pincode',
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePincode = (pincode: Pincode) => {
    setPincodeToDelete(pincode);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pincodeToDelete) return;

    try {
      setIsDeleting(true);
      const token = localStorage.getItem('officeToken');
      
      if (!token) {
        toast({
          title: "Error",
          description: 'No authentication token found. Please login again.',
          variant: "destructive",
        });
        window.location.href = '/office';
        return;
      }
      
      const response = await fetch(`/api/office/pincodes/${pincodeToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Pincode deleted successfully.",
        });
        
        setIsDeleteDialogOpen(false);
        setPincodeToDelete(null);
        fetchPincodes();
      } else if (response.status === 401) {
        localStorage.removeItem('officeToken');
        localStorage.removeItem('officeUser');
        window.location.href = '/office';
        return;
      } else if (response.status === 403) {
        toast({
          title: "Error",
          description: 'You do not have permission to manage pincodes. Please contact your administrator.',
          variant: "destructive",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || 'Failed to delete pincode',
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error deleting pincode:', error);
      toast({
        title: "Error",
        description: 'Network error while deleting pincode',
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
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
          <h2 className="text-2xl font-bold text-gray-800">Pincode Management</h2>
          <p className="text-gray-600">Manage postal codes and delivery areas</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAddPincode}>
            <Plus className="h-4 w-4 mr-2" />
            Add Pincode
          </Button>
          <Button onClick={() => fetchPincodes()} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
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
                  placeholder="Search pincodes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Input
              placeholder="Filter by state..."
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-[180px]"
            />
            <Input
              placeholder="Filter by city..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-[180px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Pincodes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pincode</TableHead>
                  <TableHead>Area Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Loading pincodes...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : pincodes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No pincodes found
                    </TableCell>
                  </TableRow>
                ) : (
                  pincodes.map((pincode) => (
                    <TableRow key={pincode._id}>
                      <TableCell className="font-mono font-semibold">
                        {pincode.pincode}
                      </TableCell>
                      <TableCell>{pincode.areaname}</TableCell>
                      <TableCell>{pincode.cityname}</TableCell>
                      <TableCell>{pincode.distrcitname}</TableCell>
                      <TableCell>{pincode.statename}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditPincode(pincode)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeletePincode(pincode)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
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
            onClick={() => fetchPincodes(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev || isLoading}
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => fetchPincodes(pagination.currentPage + 1)}
            disabled={!pagination.hasNext || isLoading}
          >
            Next
          </Button>
        </div>
      )}

      {/* Add/Edit Pincode Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setSelectedPincode(null);
        }
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditModalOpen ? 'Edit Pincode' : 'Add New Pincode'}
            </DialogTitle>
            <DialogDescription>
              {isEditModalOpen ? 'Update pincode information' : 'Enter new pincode details'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                type="number"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                placeholder="Enter pincode"
              />
            </div>
            <div>
              <Label htmlFor="areaname">Area Name</Label>
              <Input
                id="areaname"
                value={formData.areaname}
                onChange={(e) => setFormData(prev => ({ ...prev, areaname: e.target.value }))}
                placeholder="Enter area name"
              />
            </div>
            <div>
              <Label htmlFor="cityname">City</Label>
              <Input
                id="cityname"
                value={formData.cityname}
                onChange={(e) => setFormData(prev => ({ ...prev, cityname: e.target.value }))}
                placeholder="Enter city name"
              />
            </div>
            <div>
              <Label htmlFor="distrcitname">District</Label>
              <Input
                id="distrcitname"
                value={formData.distrcitname}
                onChange={(e) => setFormData(prev => ({ ...prev, distrcitname: e.target.value }))}
                placeholder="Enter district name"
              />
            </div>
            <div>
              <Label htmlFor="statename">State</Label>
              <Input
                id="statename"
                value={formData.statename}
                onChange={(e) => setFormData(prev => ({ ...prev, statename: e.target.value }))}
                placeholder="Enter state name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
                setSelectedPincode(null);
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePincode}
              disabled={isSaving || !formData.pincode || !formData.areaname || !formData.cityname || !formData.statename}
            >
              {isSaving ? 'Saving...' : (isEditModalOpen ? 'Update' : 'Add')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the pincode "{pincodeToDelete?.pincode}" for {pincodeToDelete?.areaname}?
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

export default PincodeManagement;
