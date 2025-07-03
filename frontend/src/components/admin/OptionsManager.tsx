'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger,
  DialogClose,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  Option, 
  OptionCategory, 
  getAllOptions, 
  createOption, 
  updateOption, 
  deleteOption,
  createOptionNoAuth,
  getOptionsByCategory,
  uploadBrandImage
} from '@/services/optionsAPI';
import { 
  Plus, 
  Edit, 
  Trash, 
  Check, 
  X, 
  Image, 
  Upload
} from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useConfirmation } from '@/hooks/useConfirmation';

interface OptionsManagerProps {
  category: OptionCategory;
  title: string;
  description?: string;
}

export default function OptionsManager({ category, title, description }: OptionsManagerProps) {
  const router = useRouter();
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentOption, setCurrentOption] = useState<Option | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    order: 0
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Confirmation dialog hook
  const confirmation = useConfirmation();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('adminAuth');
    if (!token) {
      router.push('/admin/login');
    }
  }, [router]);

  // Load options
  useEffect(() => {
    fetchOptions();
  }, [category]);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the admin endpoint to get all options
      const result = await getAllOptions(category);
      setOptions(result.data);
    } catch (err: any) {
      setError('Failed to load options');
      console.error('Error loading options:', err);
      
      // If authentication error, redirect to login
      if (err.message === 'No authentication token') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOption = async () => {
    try {
      setLoading(true);
      const newOption = await createOption({
        name: formData.name,
        category,
        isActive: formData.isActive,
        order: formData.order
      });
      
      if (newOption) {
        setOptions([...options, newOption]);
        resetForm();
        setIsDialogOpen(false);
      }
    } catch (err: any) {
      setError('Failed to create option');
      console.error('Error creating option:', err);
      
      // If authentication error, redirect to login
      if (err.message === 'No authentication token') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOption = async () => {
    if (!currentOption?._id) return;
    
    try {
      setLoading(true);
      const updatedOption = await updateOption(currentOption._id, {
        name: formData.name,
        isActive: formData.isActive,
        order: formData.order
      });
      
      if (updatedOption) {
        setOptions(options.map(opt => 
          opt._id === updatedOption._id ? updatedOption : opt
        ));
        resetForm();
        setIsDialogOpen(false);
      }
    } catch (err: any) {
      setError('Failed to update option');
      console.error('Error updating option:', err);
      
      // If authentication error, redirect to login
      if (err.message === 'No authentication token') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOption = async (option: Option) => {
    confirmation.showConfirmation(
      {
        title: "Delete Option",
        message: `Are you sure you want to delete "${option.name}"? This action cannot be undone.`,
        confirmText: "Delete Option",
        cancelText: "Cancel",
        type: "danger"
      },
      async () => {
        try {
          const success = await deleteOption(option._id);
          
          if (success) {
            setOptions(options.filter(opt => opt._id !== option._id));
            setError(null);
          }
        } catch (err: any) {
          setError('Failed to delete option');
          console.error('Error deleting option:', err);
          
          // If authentication error, redirect to login
          if (err.message === 'No authentication token') {
            router.push('/admin/login');
          }
          
          throw err; // Re-throw to prevent dialog from closing
        }
      }
    );
  };

  const openEditDialog = (option: Option) => {
    setCurrentOption(option);
    setFormData({
      name: option.name,
      isActive: option.isActive,
      order: option.order
    });
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      isActive: true,
      order: 0
    });
    setCurrentOption(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value) : value
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked
    });
  };

  const handleImageUpload = async (optionId: string, file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('image', file);
      
      const result = await uploadBrandImage(optionId, formData);
      
      if (result.success) {
        // Update the option in the local state
        setOptions(options.map(opt => 
          opt._id === optionId ? result.data : opt
        ));
        
        alert('Image uploaded successfully');
      }
    } catch (err: any) {
      setError('Failed to upload image');
      console.error('Error uploading image:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredOptions = options.filter(option => 
    option.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              {description && <p className="text-gray-500">{description}</p>}
            </div>
            <Button onClick={openCreateDialog}>Add New</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search options..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          {error && (
            <div className="bg-red-50 p-4 rounded-md mb-4">
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {loading && !options.length ? (
            <div className="text-center p-4">
              <p>Loading options...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    {category === 'makes' && (
                      <TableHead>Images</TableHead>
                    )}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOptions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={category === 'makes' ? 5 : 4} className="text-center">
                        No options found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOptions.map((option) => (
                      <TableRow key={option._id}>
                        <TableCell>{option.name}</TableCell>
                        <TableCell>{option.order}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            option.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {option.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        {category === 'makes' && (
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {option.imageUrl && (
                                <a 
                                  href={option.imageUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:underline"
                                >
                                  <Image className="h-4 w-4 mr-1" /> PNG/JPG
                                </a>
                              )}
                              {option.svgUrl && (
                                <a 
                                  href={option.svgUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center text-blue-600 hover:underline"
                                >
                                  <Image className="h-4 w-4 mr-1" /> SVG
                                </a>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Upload className="h-4 w-4 mr-1" /> Upload
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Upload Brand Image</DialogTitle>
                                    <DialogDescription>
                                      Upload PNG/JPG or SVG image for {option.name}
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="image">Select Image</Label>
                                      <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                          if (e.target.files && e.target.files[0]) {
                                            handleImageUpload(option._id, e.target.files[0]);
                                          }
                                        }}
                                      />
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <DialogClose asChild>
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openEditDialog(option)}
                            >
                              <Edit className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteOption(option)}
                            >
                              <Trash className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditMode ? 'Edit Option' : 'Add New Option'}</DialogTitle>
              <DialogDescription>
                {isEditMode 
                  ? `Update the details for this ${category} option.` 
                  : `Create a new option in the ${category} category.`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  Order
                </Label>
                <Input
                  id="order"
                  name="order"
                  type="number"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isActive" className="text-right">
                  Active
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={handleSwitchChange}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={isEditMode ? handleUpdateOption : handleCreateOption}
                disabled={!formData.name}
              >
                {isEditMode ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={confirmation.hideConfirmation}
        onConfirm={confirmation.handleConfirm}
        title={confirmation.options.title}
        message={confirmation.options.message}
        confirmText={confirmation.options.confirmText}
        cancelText={confirmation.options.cancelText}
        type={confirmation.options.type}
        isLoading={confirmation.isLoading}
      />
    </>
  );
} 