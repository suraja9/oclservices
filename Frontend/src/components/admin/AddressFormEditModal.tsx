import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AddressForm {
  _id: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderPincode: string;
  senderState?: string;
  senderCity?: string;
  senderDistrict?: string;
  senderArea?: string;
  senderAddressLine1?: string;
  senderAddressLine2?: string;
  senderLandmark?: string;
  receiverName?: string;
  receiverEmail?: string;
  receiverPhone?: string;
  receiverPincode?: string;
  receiverState?: string;
  receiverCity?: string;
  receiverDistrict?: string;
  receiverArea?: string;
  receiverAddressLine1?: string;
  receiverAddressLine2?: string;
  receiverLandmark?: string;
  formCompleted: boolean;
  [key: string]: any;
}

interface AddressFormEditModalProps {
  form: AddressForm;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const AddressFormEditModal: React.FC<AddressFormEditModalProps> = ({
  form,
  isOpen,
  onClose,
  onUpdate
}) => {
  const [formData, setFormData] = useState<Partial<AddressForm>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    if (form) {
      setFormData({ ...form });
    }
  }, [form]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/addressforms/${form._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Form Updated",
          description: "Address form has been successfully updated.",
        });
        onUpdate();
        onClose();
      } else {
        setError(data.error || 'Failed to update form');
      }
    } catch (error) {
      console.error('Update error:', error);
      setError('Network error while updating form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Address Form</DialogTitle>
          <DialogDescription>
            Update the address form information. All changes will be saved to the database.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="sender" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="sender">Sender Details</TabsTrigger>
              <TabsTrigger value="receiver">Receiver Details</TabsTrigger>
            </TabsList>

            <TabsContent value="sender" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderName">Name *</Label>
                  <Input
                    id="senderName"
                    value={formData.senderName || ''}
                    onChange={(e) => handleInputChange('senderName', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Email *</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    value={formData.senderEmail || ''}
                    onChange={(e) => handleInputChange('senderEmail', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderPhone">Phone *</Label>
                  <Input
                    id="senderPhone"
                    value={formData.senderPhone || ''}
                    onChange={(e) => handleInputChange('senderPhone', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderPincode">Pincode *</Label>
                  <Input
                    id="senderPincode"
                    value={formData.senderPincode || ''}
                    onChange={(e) => handleInputChange('senderPincode', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderState">State *</Label>
                  <Input
                    id="senderState"
                    value={formData.senderState || ''}
                    onChange={(e) => handleInputChange('senderState', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderCity">City *</Label>
                  <Input
                    id="senderCity"
                    value={formData.senderCity || ''}
                    onChange={(e) => handleInputChange('senderCity', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderDistrict">District</Label>
                  <Input
                    id="senderDistrict"
                    value={formData.senderDistrict || ''}
                    onChange={(e) => handleInputChange('senderDistrict', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senderArea">Area *</Label>
                  <Input
                    id="senderArea"
                    value={formData.senderArea || ''}
                    onChange={(e) => handleInputChange('senderArea', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderAddressLine1">Address Line 1 *</Label>
                <Textarea
                  id="senderAddressLine1"
                  value={formData.senderAddressLine1 || ''}
                  onChange={(e) => handleInputChange('senderAddressLine1', e.target.value)}
                  rows={2}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderAddressLine2">Address Line 2</Label>
                <Textarea
                  id="senderAddressLine2"
                  value={formData.senderAddressLine2 || ''}
                  onChange={(e) => handleInputChange('senderAddressLine2', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="senderLandmark">Landmark</Label>
                <Input
                  id="senderLandmark"
                  value={formData.senderLandmark || ''}
                  onChange={(e) => handleInputChange('senderLandmark', e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="receiver" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="receiverName">Name</Label>
                  <Input
                    id="receiverName"
                    value={formData.receiverName || ''}
                    onChange={(e) => handleInputChange('receiverName', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverEmail">Email</Label>
                  <Input
                    id="receiverEmail"
                    type="email"
                    value={formData.receiverEmail || ''}
                    onChange={(e) => handleInputChange('receiverEmail', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverPhone">Phone</Label>
                  <Input
                    id="receiverPhone"
                    value={formData.receiverPhone || ''}
                    onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverPincode">Pincode</Label>
                  <Input
                    id="receiverPincode"
                    value={formData.receiverPincode || ''}
                    onChange={(e) => handleInputChange('receiverPincode', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverState">State</Label>
                  <Input
                    id="receiverState"
                    value={formData.receiverState || ''}
                    onChange={(e) => handleInputChange('receiverState', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverCity">City</Label>
                  <Input
                    id="receiverCity"
                    value={formData.receiverCity || ''}
                    onChange={(e) => handleInputChange('receiverCity', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverDistrict">District</Label>
                  <Input
                    id="receiverDistrict"
                    value={formData.receiverDistrict || ''}
                    onChange={(e) => handleInputChange('receiverDistrict', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="receiverArea">Area</Label>
                  <Input
                    id="receiverArea"
                    value={formData.receiverArea || ''}
                    onChange={(e) => handleInputChange('receiverArea', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiverAddressLine1">Address Line 1</Label>
                <Textarea
                  id="receiverAddressLine1"
                  value={formData.receiverAddressLine1 || ''}
                  onChange={(e) => handleInputChange('receiverAddressLine1', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiverAddressLine2">Address Line 2</Label>
                <Textarea
                  id="receiverAddressLine2"
                  value={formData.receiverAddressLine2 || ''}
                  onChange={(e) => handleInputChange('receiverAddressLine2', e.target.value)}
                  rows={2}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="receiverLandmark">Landmark</Label>
                <Input
                  id="receiverLandmark"
                  value={formData.receiverLandmark || ''}
                  onChange={(e) => handleInputChange('receiverLandmark', e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Update Form
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddressFormEditModal;
