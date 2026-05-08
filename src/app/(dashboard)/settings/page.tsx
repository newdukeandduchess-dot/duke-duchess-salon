"use client";

import { Building, Users, Receipt, Bell, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2, Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<any>(null);

  // Fetch Staff
  const fetchStaff = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      toast.error("Failed to load staff");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleSaveStaff = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      role: formData.get("role"),
      code: formData.get("code"),
      specialization: formData.get("specialization"),
    };

    try {
      const url = editingStaff ? `/api/staff/${editingStaff._id}` : '/api/staff';
      const method = editingStaff ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        toast.success(editingStaff ? "Staff updated" : "Staff added");
        setIsDialogOpen(false);
        setEditingStaff(null);
        fetchStaff();
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to save staff");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteStaff = async (id: string) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    try {
      const res = await fetch(`/api/staff/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success("Staff member removed");
        fetchStaff();
      } else {
        toast.error("Failed to delete staff");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your salon configuration, staff, and preferences.</p>
      </div>

      <Tabs defaultValue="general" orientation="vertical" className="flex flex-col md:flex-row gap-8">
        <TabsList className="flex md:flex-col h-auto bg-muted/50 w-full md:w-[240px] gap-1 items-stretch justify-start p-1.5 rounded-xl border border-border/50">
          <TabsTrigger value="general" className="justify-start px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all rounded-lg">
            <Building className="mr-3 h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="staff" className="justify-start px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all rounded-lg">
            <Users className="mr-3 h-4 w-4" /> Staff
          </TabsTrigger>
          <TabsTrigger value="billing" className="justify-start px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all rounded-lg">
            <Receipt className="mr-3 h-4 w-4" /> Billing & Tax
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all rounded-lg">
            <Bell className="mr-3 h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="justify-start px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all rounded-lg">
            <Shield className="mr-3 h-4 w-4" /> Security
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 min-w-0">
          <TabsContent value="general" className="mt-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Salon Details</CardTitle>
                <CardDescription>Update your salon name, address, and contact info.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Salon Name</Label>
                    <Input id="name" defaultValue="New Duke & Duchess" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+91 98765 43210" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" defaultValue="123 Salon Street, Fashion District" />
                  </div>
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-0">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Staff Management</CardTitle>
                  <CardDescription>Add, edit, or remove staff members (stylists) and assign roles.</CardDescription>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                  setIsDialogOpen(open);
                  if (!open) setEditingStaff(null);
                }}>
                  <DialogTrigger render={<Button size="sm" className="gap-2" />}>
                      <Plus className="h-4 w-4" /> Add Staff
                  </DialogTrigger>
                  <DialogContent>
                    <form onSubmit={handleSaveStaff}>
                      <DialogHeader>
                        <DialogTitle>{editingStaff ? 'Edit Staff Member' : 'Add Staff Member'}</DialogTitle>
                        <DialogDescription>
                          Enter the details for the staff member. The code will be used in the billing section.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" name="name" defaultValue={editingStaff?.name} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="code">Staff Code (e.g. JD01)</Label>
                            <Input id="code" name="code" defaultValue={editingStaff?.code} required />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" name="phone" defaultValue={editingStaff?.phone} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" defaultValue={editingStaff?.role || "stylist"}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="stylist">Stylist</SelectItem>
                                <SelectItem value="receptionist">Receptionist</SelectItem>
                                <SelectItem value="manager">Manager</SelectItem>
                                <SelectItem value="ceo">CEO</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialization">Specialization (Optional)</Label>
                          <Input id="specialization" name="specialization" defaultValue={editingStaff?.specialization} placeholder="e.g. Haircut, Color, Spa" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingStaff ? 'Update Staff' : 'Add Staff'}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : staff.length === 0 ? (
                  <div className="rounded-md border border-dashed flex flex-col items-center justify-center p-12 text-center">
                    <Users className="h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                    <h3 className="font-bold text-lg">No Staff Members Yet</h3>
                    <p className="text-muted-foreground text-sm max-w-xs mb-4">
                      Add your stylists and team members to start assigning them to services in the POS.
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Your First Staff
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {staff.map((member) => (
                          <TableRow key={member._id}>
                            <TableCell className="font-mono font-bold text-primary">{member.code}</TableCell>
                            <TableCell className="font-medium">{member.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">{member.role}</Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{member.phone}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => {
                                setEditingStaff(member);
                                setIsDialogOpen(true);
                              }}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteStaff(member._id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

          <TabsContent value="billing" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Tax & Invoice Settings</CardTitle>
                <CardDescription>Configure your GST number and default tax rates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="gst">GST Number</Label>
                    <Input id="gst" defaultValue="29ABCDE1234F1Z5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate">Default Tax Rate (%)</Label>
                    <Input id="taxRate" type="number" defaultValue="18" />
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Print Receipt Automatically</Label>
                    <p className="text-sm text-muted-foreground">Print invoice immediately after successful checkout</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Low Stock Alerts</Label>
                    <p className="text-sm text-muted-foreground">Get notified when a product falls below minimum stock</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Appointment Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send SMS reminders to customers 2 hours before</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
