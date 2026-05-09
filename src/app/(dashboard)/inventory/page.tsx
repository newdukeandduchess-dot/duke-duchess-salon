"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("services");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data State
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any>(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [resServices, resProducts] = await Promise.all([
        fetch('/api/services'),
        fetch('/api/products')
      ]);
      
      const dataServices = await resServices.json();
      const dataProducts = await resProducts.json();
      
      if (!resServices.ok) throw new Error(dataServices.error || "Failed to fetch services");
      if (!resProducts.ok) throw new Error(dataProducts.error || "Failed to fetch products");

      setServices(Array.isArray(dataServices) ? dataServices : []);
      setProducts(Array.isArray(dataProducts) ? dataProducts : []);
    } catch (error) {
      toast.error("Failed to fetch inventory data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleSaveService = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      serviceId: formData.get("serviceId"),
      name: formData.get("name"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      duration: Number(formData.get("duration")),
      isActive: formData.get("status") === "Active"
    };

    try {
      const url = editingService ? `/api/services/${editingService._id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Failed to save service");
      toast.success(editingService ? "Service updated" : "Service created");
      setIsServiceModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Error saving service");
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Service deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting service");
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      sku: formData.get("sku"),
      category: formData.get("category"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      isActive: formData.get("status") === "In Stock"
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Failed to save product");
      toast.success(editingProduct ? "Product updated" : "Product created");
      setIsProductModalOpen(false);
      fetchData();
    } catch (error) {
      toast.error("Error saving product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Product deleted");
      fetchData();
    } catch (error) {
      toast.error("Error deleting product");
    }
  };

  const openAddModal = () => {
    if (activeTab === "services") {
      setEditingService(null);
      setIsServiceModalOpen(true);
    } else {
      setEditingProduct(null);
      setIsProductModalOpen(true);
    }
  };

  const filteredServices = (Array.isArray(services) ? services : []).filter(s => s.name?.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => p.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services & Inventory</h1>
          <p className="text-muted-foreground">Manage your salon's services, pricing, and retail products.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={openAddModal}>
          <Plus className="h-4 w-4" /> Add Item
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val || "services")} className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="products">Retail Products</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="services" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Salon Services</CardTitle>
              <CardDescription>A list of all services offered by your salon.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="text-right w-[70px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredServices.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8">No services found.</TableCell></TableRow>
                      ) : filteredServices.map((service) => (
                        <TableRow key={service._id}>
                          <TableCell className="font-medium text-muted-foreground">{service.serviceId || 'N/A'}</TableCell>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell>{service.category}</TableCell>
                          <TableCell>{service.duration} mins</TableCell>
                          <TableCell className="text-right font-medium">₹{service.price}</TableCell>
                          <TableCell>
                            <Badge variant={service.isActive ? "default" : "secondary"}>
                              {service.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteService(service._id)}>
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="m-0">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Retail Inventory</CardTitle>
              <CardDescription>Manage stock levels for your retail products.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="w-[100px]">Status</TableHead>
                        <TableHead className="text-right w-[70px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8">No products found.</TableCell></TableRow>
                      ) : filteredProducts.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">{product.stock}</TableCell>
                          <TableCell className="text-right font-medium">₹{product.price}</TableCell>
                          <TableCell>
                            <Badge variant={product.stock > 5 ? "default" : product.stock > 0 ? "secondary" : "destructive"}>
                              {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteProduct(product._id)}>
                                  <Trash className="mr-2 h-4 w-4" /> Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Service Modal */}
      <Dialog open={isServiceModalOpen} onOpenChange={setIsServiceModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveService}>
            <DialogHeader>
              <DialogTitle>{editingService ? 'Edit Service' : 'Add Service'}</DialogTitle>
              <DialogDescription>Fill in the details for the salon service.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="serviceId">Service ID</Label>
                  <Input id="serviceId" name="serviceId" defaultValue={editingService?.serviceId} placeholder="e.g. SER-001" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input id="name" name="name" defaultValue={editingService?.name} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" defaultValue={editingService?.category} placeholder="e.g. Hair, Makeup" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input id="price" name="price" type="number" min="0" defaultValue={editingService?.price} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (mins)</Label>
                  <Input id="duration" name="duration" type="number" min="1" defaultValue={editingService?.duration} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" name="status" className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50" defaultValue={editingService ? (editingService.isActive ? 'Active' : 'Inactive') : 'Active'}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsServiceModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Service</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Product Modal */}
      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSaveProduct}>
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
              <DialogDescription>Fill in the details for the retail product.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="p-name">Product Name</Label>
                <Input id="p-name" name="name" defaultValue={editingProduct?.name} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" defaultValue={editingProduct?.sku} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="p-category">Category</Label>
                  <Input id="p-category" name="category" defaultValue={editingProduct?.category} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="p-price">Price (₹)</Label>
                  <Input id="p-price" name="price" type="number" min="0" defaultValue={editingProduct?.price} required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input id="stock" name="stock" type="number" min="0" defaultValue={editingProduct?.stock} required />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="p-status">Status</Label>
                <select id="p-status" name="status" className="flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50" defaultValue={editingProduct ? (editingProduct.isActive ? 'In Stock' : 'Out of Stock') : 'In Stock'}>
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
