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
  const [formData, setFormData] = useState({
    pincode: '',
    areaname: '',
    cityname: '',
    distrcitname: '', // Note: using the typo that exists in the model
    statename: ''
  });
  
  const { toast } = useToast();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchPincodes();
    }, 300); // Debounce search by 300ms
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm, stateFilter, cityFilter]);

  const fetchPincodes = async (page = 1) => {
    setIsLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (stateFilter) params.append('state', stateFilter);
      if (cityFilter) params.append('city', cityFilter);
      
      const response = await fetch(`/api/admin/pincodes?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setPincodes(data.data);
        setPagination(data.pagination);
      } else if (response.status === 401) {
        setError('Session expired. Please login again.');
        window.location.href = '/admin';
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to load pincodes');
      }
    } catch (error) {
      console.error('Error fetching pincodes:', error);
      setError('Network error while loading pincodes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      pincode: '',
      areaname: '',
      cityname: '',
      distrcitname: '',
      statename: ''
    });
    setIsAddModalOpen(true);
  };

  const handleEdit = (pincode: Pincode) => {
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

  const handleDelete = (pincode: Pincode) => {
    setPincodeToDelete(pincode);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (isEdit: boolean) => {
    setIsSaving(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const url = isEdit 
        ? `/api/admin/pincodes/${selectedPincode?._id}`
        : '/api/admin/pincodes';
      
      const response = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: isEdit ? "Pincode Updated" : "Pincode Added",
          description: `Pincode ${formData.pincode} has been successfully ${isEdit ? 'updated' : 'added'}.`,
        });
        fetchPincodes(pagination?.currentPage || 1);
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
        setSelectedPincode(null);
      } else {
        setError(data.error || `Failed to ${isEdit ? 'update' : 'add'} pincode`);
      }
    } catch (error) {
      console.error('Save error:', error);
      setError(`Network error while ${isEdit ? 'updating' : 'adding'} pincode`);
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!pincodeToDelete) return;
    
    setIsDeleting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/pincodes/${pincodeToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Pincode Deleted",
          description: "Pincode has been successfully deleted.",
        });
        fetchPincodes(pagination?.currentPage || 1);
      } else {
        const data = await response.json();
        toast({
          title: "Delete Failed",
          description: data.error || "Failed to delete the pincode.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete Failed",
        description: "Network error while deleting the pincode.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setPincodeToDelete(null);
    }
  };

  const exportData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (stateFilter) params.append('state', stateFilter);
      if (cityFilter) params.append('city', cityFilter);
      
      const response = await fetch(`/api/admin/pincodes?${params}&limit=10000`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const csvContent = convertToCSV(data.data);
        downloadCSV(csvContent, 'pincodes_export.csv');
        
        toast({
          title: "Export Successful",
          description: `${data.data.length} pincodes exported to CSV.`,
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

  const convertToCSV = (data: Pincode[]) => {
    if (data.length === 0) return '';
    
    const headers = ['Pincode', 'Area', 'City', 'District', 'State'];
    const rows = data.map(item => [
      item.pincode,
      item.areaname,
      item.cityname,
      item.distrcitname,
      item.statename
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

  const PincodeModal = ({ isOpen, onClose, isEdit }: { isOpen: boolean; onClose: () => void; isEdit: boolean }) => (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Pincode' : 'Add New Pincode'}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the pincode information.' : 'Add a new pincode area to the database.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode *</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                placeholder="123456"
                maxLength={6}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="areaname">Area Name *</Label>
              <Input
                id="areaname"
                value={formData.areaname}
                onChange={(e) => setFormData(prev => ({ ...prev, areaname: e.target.value }))}
                placeholder="Area name"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cityname">City *</Label>
              <Input
                id="cityname"
                value={formData.cityname}
                onChange={(e) => setFormData(prev => ({ ...prev, cityname: e.target.value }))}
                placeholder="City name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distrcitname">District</Label>
              <Input
                id="distrcitname"
                value={formData.distrcitname}
                onChange={(e) => setFormData(prev => ({ ...prev, distrcitname: e.target.value }))}
                placeholder="District name"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="statename">State *</Label>
            <Input
              id="statename"
              value={formData.statename}
              onChange={(e) => setFormData(prev => ({ ...prev, statename: e.target.value }))}
              placeholder="State name"
              required
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={() => handleSubmit(isEdit)} disabled={isSaving}>
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? 'Update' : 'Add'} Pincode
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Pincode Management</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                {pagination && `${pagination.totalCount} total pincodes`}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => fetchPincodes(1)}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Pincode
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
                  placeholder="Search by pincode, area, city, or state..."
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
              className="w-40"
            />
            
            <Input
              placeholder="Filter by city..."
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
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
                  <TableHead>Pincode</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading pincodes...
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
                      <TableCell className="font-mono">{pincode.pincode}</TableCell>
                      <TableCell>{pincode.areaname}</TableCell>
                      <TableCell>{pincode.cityname}</TableCell>
                      <TableCell>{pincode.distrcitname}</TableCell>
                      <TableCell>{pincode.statename}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(pincode)}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(pincode)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
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

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages} 
                ({pagination.totalCount} total pincodes)
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrev}
                  onClick={() => fetchPincodes(pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNext}
                  onClick={() => fetchPincodes(pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      <PincodeModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        isEdit={false} 
      />

      {/* Edit Modal */}
      <PincodeModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPincode(null);
        }} 
        isEdit={true} 
      />

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
