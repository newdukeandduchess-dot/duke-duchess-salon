"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash, 
  Loader2, 
  Phone, 
  CreditCard, 
  Calendar, 
  History, 
  FileText,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { format } from "date-fns";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerHistory, setCustomerHistory] = useState<any>({ appointments: [], invoices: [] });
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // Fetch Data
  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/customers');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch customers");
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("Failed to fetch customers");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerDetails = async (id: string) => {
    setIsHistoryLoading(true);
    try {
      const res = await fetch(`/api/customers/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch details");
      setSelectedCustomer(data.customer);
      setCustomerHistory(data.history);
      setIsDetailsOpen(true);
    } catch (error) {
      toast.error("Failed to fetch customer details");
    } finally {
      setIsHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handlers
  const handleSaveCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      membershipNumber: formData.get("membershipNumber"),
      notes: formData.get("notes"),
      loyaltyPoints: Number(formData.get("loyaltyPoints")) || 0,
      totalSpent: Number(formData.get("totalSpent")) || 0,
    };

    try {
      const url = editingCustomer ? `/api/customers/${editingCustomer._id}` : '/api/customers';
      const method = editingCustomer ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to save customer");
      
      toast.success(editingCustomer ? "Customer updated" : "Customer created");
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error: any) {
      toast.error(error.message || "Error saving customer");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer? All history will be disconnected.")) return;
    try {
      const res = await fetch(`/api/customers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Customer deleted");
      fetchCustomers();
    } catch (error) {
      toast.error("Error deleting customer");
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) ||
    c.membershipNumber?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database and loyalty programs.</p>
        </div>
        <Button className="shrink-0 gap-2" onClick={() => { setEditingCustomer(null); setIsModalOpen(true); }}>
          <Plus className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b bg-muted/20">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search name, phone, or membership..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-6">Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Membership #</TableHead>
                  <TableHead className="text-right">Loyalty Pts</TableHead>
                  <TableHead className="text-right">Total Spent</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead className="text-right pr-6 w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                      No customers found.
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.map((customer) => (
                  <TableRow key={customer._id} className="group hover:bg-muted/50 cursor-pointer" onClick={() => fetchCustomerDetails(customer._id)}>
                    <TableCell className="pl-6">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {customer.name.charAt(0)}
                        </div>
                        <span className="font-semibold">{customer.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs gap-1">
                        <span className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {customer.phone}</span>
                        {customer.email && <span className="text-muted-foreground">{customer.email}</span>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {customer.membershipNumber ? (
                        <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-wider bg-primary/5">
                          {customer.membershipNumber}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">{customer.loyaltyPoints}</TableCell>
                    <TableCell className="text-right font-bold text-primary">₹{customer.totalSpent}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.lastVisit ? format(new Date(customer.lastVisit), "MMM dd, yyyy") : "Never"}
                    </TableCell>
                    <TableCell className="text-right pr-6" onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted text-muted-foreground outline-none transition-colors">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => { setEditingCustomer(customer); setIsModalOpen(true); }}>
                            <Edit className="mr-2 h-4 w-4" /> Edit Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => fetchCustomerDetails(customer._id)}>
                            <History className="mr-2 h-4 w-4" /> View History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteCustomer(customer._id)}>
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSaveCustomer}>
            <DialogHeader>
              <DialogTitle>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
              <DialogDescription>Enter the customer's contact and membership information.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" defaultValue={editingCustomer?.name} placeholder="John Doe" required />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" defaultValue={editingCustomer?.phone} placeholder="+91 XXXXX XXXXX" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" defaultValue={editingCustomer?.email} placeholder="john@example.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="membershipNumber">Membership ID</Label>
                  <Input id="membershipNumber" name="membershipNumber" defaultValue={editingCustomer?.membershipNumber} placeholder="MEMBER-001" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="loyaltyPoints">Loyalty Points</Label>
                  <Input id="loyaltyPoints" name="loyaltyPoints" type="number" defaultValue={editingCustomer?.loyaltyPoints || 0} placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="totalSpent">Total Spent (₹)</Label>
                  <Input id="totalSpent" name="totalSpent" type="number" defaultValue={editingCustomer?.totalSpent || 0} placeholder="0" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea 
                  id="notes" 
                  name="notes" 
                  defaultValue={editingCustomer?.notes}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Preferences, allergies, or special requirements..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">Save Customer</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Details/History Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-black">
                  {selectedCustomer?.name?.charAt(0)}
                </div>
                <div>
                  <DialogTitle className="text-2xl">{selectedCustomer?.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 mt-1">
                    <Phone className="h-3 w-3" /> {selectedCustomer?.phone}
                    {selectedCustomer?.membershipNumber && (
                      <span className="flex items-center gap-1 ml-2">
                        <CreditCard className="h-3 w-3" /> {selectedCustomer?.membershipNumber}
                      </span>
                    )}
                  </DialogDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Spent</div>
                <div className="text-2xl font-black text-primary">₹{selectedCustomer?.totalSpent}</div>
              </div>
            </div>
          </DialogHeader>

          <div className="px-6 py-4 flex gap-4">
            <Badge variant="secondary" className="gap-1.5 px-3 py-1">
              <User className="h-3.5 w-3.5" /> Loyalty: {selectedCustomer?.loyaltyPoints} pts
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-3 py-1">
              <Calendar className="h-3.5 w-3.5" /> Last Visit: {selectedCustomer?.lastVisit ? format(new Date(selectedCustomer?.lastVisit), "MMM dd, yyyy") : "None"}
            </Badge>
          </div>

          <Tabs defaultValue="visits" className="flex-1 overflow-hidden flex flex-col px-6 pb-6">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="visits" className="gap-2"><History className="h-4 w-4" /> Visit History</TabsTrigger>
              <TabsTrigger value="billing" className="gap-2"><CreditCard className="h-4 w-4" /> Billing</TabsTrigger>
              <TabsTrigger value="notes" className="gap-2"><FileText className="h-4 w-4" /> Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="visits" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[300px] pr-4">
                {customerHistory.appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No visits recorded yet.</div>
                ) : (
                  <div className="space-y-4">
                    {customerHistory.appointments.map((app: any) => (
                      <div key={app._id} className="border rounded-lg p-3 flex justify-between items-center bg-muted/10">
                        <div className="space-y-1">
                          <div className="font-semibold">{format(new Date(app.startTime), "EEEE, MMM dd, yyyy")}</div>
                          <div className="text-xs text-muted-foreground">{format(new Date(app.startTime), "hh:mm a")} • {app.status}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">₹{app.totalAmount}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="billing" className="flex-1 overflow-hidden">
              <ScrollArea className="h-[300px] pr-4">
                {customerHistory.invoices.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No invoices found.</div>
                ) : (
                  <div className="space-y-3">
                    {customerHistory.invoices.map((inv: any) => (
                      <div key={inv._id} className="border rounded-lg p-3 flex justify-between items-center bg-muted/10">
                        <div className="space-y-1">
                          <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{inv.invoiceNumber}</div>
                          <div className="text-sm font-semibold">{format(new Date(inv.createdAt), "MMM dd, yyyy")}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-primary">₹{inv.total}</div>
                          <div className="text-[10px] uppercase text-muted-foreground">{inv.paymentMethod} • {inv.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="notes" className="flex-1">
              <div className="border rounded-lg p-4 bg-muted/10 h-[300px] overflow-auto whitespace-pre-wrap text-sm italic text-muted-foreground">
                {selectedCustomer?.notes || "No special notes for this customer."}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
