"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  IndianRupee, 
  QrCode, 
  UserPlus, 
  UserCheck, 
  Loader2, 
  ShoppingCart,
  X,
  PlusCircle,
  CheckCircle2,
  Share2,
  Download,
  Printer
} from "lucide-react";
import jsPDF from 'jspdf';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import html2canvas from "html2canvas";
import { InvoiceReceipt } from "@/components/InvoiceReceipt";
import { useRef } from "react";

type CartItem = {
  id?: string;
  name: string;
  price: number;
  qty: number;
  type: 'service' | 'product' | 'extra';
  notes?: string;
  staffId?: string;
  staffName?: string;
  staffCode?: string;
};

export default function POSPage() {
  // Data State
  const [services, setServices] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Customer State
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [taxPercent, setTaxPercent] = useState(18); // Default 18% GST
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extra Charge State
  const [addOnServices, setAddOnServices] = useState(0);
  const [addOnNotes, setAddOnNotes] = useState("");

  // Success Dialog State
  const [lastInvoice, setLastInvoice] = useState<any>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  // Fetch Catalog
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const [servicesRes, productsRes, staffRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/products'),
          fetch('/api/staff')
        ]);
        const servicesData = await servicesRes.json();
        const productsData = await productsRes.json();
        const staffData = await staffRes.json();
        setServices(servicesData);
        setProducts(productsData);
        setStaff(staffData);
      } catch (error) {
        toast.error("Failed to load catalog");
      } finally {
        setIsLoadingCatalog(false);
      }
    };
    fetchCatalog();

  }, []);

  // Customer Search Logic
  const handleCustomerSearch = async () => {
    if (customerPhone.length < 10) return;
    setIsSearchingCustomer(true);
    try {
      const res = await fetch(`/api/customers/search?phone=${customerPhone}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedCustomer(data);
        toast.success(`Customer found: ${data.name}`);
      } else {
        setSelectedCustomer(null);
        toast.info("Customer not found. You can add them as a new customer.");
        setIsAddCustomerOpen(true);
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setIsSearchingCustomer(false);
    }
  };

  const handleQuickAddCustomer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      phone: customerPhone,
    };

    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setSelectedCustomer(result);
      setIsAddCustomerOpen(false);
      toast.success("Customer added successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Cart Logic
  const addToCart = (item: any, type: 'service' | 'product') => {
    const cartItemId = `${item._id || item.id}-${Date.now()}`;
    setCart((prev) => [
      ...prev, 
      { 
        cartItemId, // Unique ID for this specific row
        id: item._id || item.id, 
        name: item.name, 
        price: item.price, 
        qty: 1, 
        type,
        staffId: "",
        staffName: "",
        staffCode: ""
      }
    ]);
    toast.success(`Added ${item.name}`);
  };

  const updateQty = (cartItemId: string, delta: number) => {
    setCart((prev) => prev.map((item: any) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, qty: Math.max(1, item.qty + delta) };
      }
      return item;
    }));
  };

  const removeItem = (cartItemId: string) => {
    setCart((prev) => prev.filter((i: any) => i.cartItemId !== cartItemId));
  };

  const updateItemStaff = (cartItemId: string, staffCode: string) => {
    const member = staff.find(s => s.code === staffCode);
    setCart((prev) => prev.map((item: any) => {
      if (item.cartItemId === cartItemId) {
        return { ...item, staffId: member?._id || "", staffName: member?.name || "", staffCode };
      }
      return item;
    }));
  };

  // Calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const subtotal = cartSubtotal + addOnServices;
  const discountAmount = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = (taxableAmount * taxPercent) / 100;
  const total = taxableAmount + taxAmount;

  // PDF Generation Function
  const generatePDF = async () => {
    if (!invoiceRef.current || !lastInvoice || !selectedCustomer) return;
    setIsGeneratingPDF(true);
    
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff"
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${lastInvoice.invoiceNumber || 'INV'}.pdf`);
    } catch (err: any) {
      console.error("Failed to generate PDF", err);
      toast.error(`Failed to generate PDF: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = () => {
    generatePDF();
  };

  const handleWhatsAppShare = async () => {
    if (!lastInvoice || !selectedCustomer) return;
    
    // Create text-based invoice message
    const itemsList = lastInvoice.items
      .map((item: any) => `- ${item.name} (x${item.quantity}): ₹${item.total}`)
      .join('%0A');

    const dateTime = new Date().toLocaleString('en-IN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    const message = `*NEW DUKE %26 DUCHESS INVOICE*%0A%0AHello ${selectedCustomer.name},%0A%0AThank you for visiting us. Your invoice details are below:%0A%0A*Invoice:* ${lastInvoice.invoiceNumber}%0A*Date %26 Time:* ${dateTime}%0A%0A*Items:*%0A${itemsList}%0A%0A*Total Amount:* ₹${lastInvoice.total.toFixed(2)}%0A%0A_Thank you, Visit Again!_`;
    
    const whatsappUrl = `https://wa.me/91${selectedCustomer.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCheckout = async (method: string) => {
    if (!selectedCustomer) {
      toast.error("Please select or add a customer first");
      return;
    }
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    setIsProcessing(true);
    try {
      const items = cart.map(item => ({
        itemType: item.type,
        itemId: item.id,
        name: item.name,
        quantity: item.qty,
        price: item.price,
        total: item.price * item.qty,
        staffId: item.staffId,
        staffName: item.staffName,
        staffCode: item.staffCode,
        notes: item.notes
      }));

      if (addOnServices > 0) {
        items.push({
          itemType: 'service' as any, 
          itemId: "000000000000000000000000",
          name: "Add-On Services",
          quantity: 1,
          price: addOnServices,
          total: addOnServices,
          notes: addOnNotes,
          staffId: "",
          staffName: "",
          staffCode: ""
        });
      }

      const invoiceData = {
        customerId: selectedCustomer._id,
        items,
        subtotal,
        tax: taxAmount,
        discount: discountAmount,
        total,
        paymentMethod: method.toLowerCase()
      };

      const res = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoiceData)
      });

      if (!res.ok) {
        let errMsg = "Checkout failed";
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch (e) {}
        throw new Error(errMsg);
      }
      
      const savedInvoice = await res.json();

      setLastInvoice(savedInvoice);
      setIsSuccessOpen(true);
      
      // Clear State
      setCart([]);
      setDiscountPercent(0);
      setAddOnServices(0);
      setAddOnNotes("");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group services by main category for the sidebar
  const serviceCategories = ["All", ...Array.from(new Set(services.map(s => s.category)))];
  
  const mainCategories = {
    "MEN": serviceCategories.filter(c => c.startsWith("MEN")),
    "WOMEN": serviceCategories.filter(c => c.startsWith("WOMEN")),
    "OTHERS": serviceCategories.filter(c => !c.startsWith("MEN") && !c.startsWith("WOMEN") && c !== "All")
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-10rem)] lg:overflow-hidden overflow-y-auto pb-20 lg:pb-0">
      {/* Left Area: Catalog & Customer */}
      <div className="flex-1 flex flex-col gap-4 lg:overflow-hidden min-h-[500px] lg:min-h-0">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Billing Center</h1>
            <p className="text-muted-foreground">Create invoices and manage customer checkout.</p>
          </div>
          {selectedCustomer ? (
            <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-lg flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                {selectedCustomer.name.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-bold leading-none">{selectedCustomer.name}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{selectedCustomer.phone} • {selectedCustomer.loyaltyPoints} pts</div>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 ml-2" onClick={() => setSelectedCustomer(null)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  className="pl-8 w-[200px]" 
                  placeholder="Customer Phone..." 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomerSearch()}
                />
              </div>
              <Button size="icon" onClick={handleCustomerSearch} disabled={isSearchingCustomer}>
                {isSearchingCustomer ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input 
            className="pl-10 h-12 text-lg shadow-sm" 
            placeholder="Search items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs defaultValue="services" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="services" className="flex-1 mt-4 overflow-hidden">
            <div className="flex h-full gap-4">
              {/* Category Sidebar */}
              <div className="w-48 flex flex-col gap-2 border-r pr-4">
                <ScrollArea className="h-full">
                  <div className="space-y-6">
                    <div>
                      <Button 
                        variant={selectedCategory === "All" ? "default" : "ghost"} 
                        className="w-full justify-start font-bold"
                        onClick={() => setSelectedCategory("All")}
                      >
                        All Services
                      </Button>
                    </div>

                    {Object.entries(mainCategories).map(([main, subs]) => (
                      subs.length > 0 && (
                        <div key={main} className="space-y-1">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-foreground border-l-2 border-primary pl-2 mb-3 mt-2">{main}</h4>
                          {subs.map(sub => (
                            <Button 
                              key={sub}
                              variant={selectedCategory === sub ? "secondary" : "ghost"} 
                              className="w-full justify-start text-[11px] h-8 px-2 text-left leading-tight"
                              onClick={() => setSelectedCategory(sub)}
                            >
                              {sub.replace(`${main} `, "")}
                            </Button>
                          ))}
                        </div>
                      )
                    ))}
                  </div>
                </ScrollArea>
              </div>

              {/* Services Grid */}
              <ScrollArea className="flex-1 pr-4">
                {isLoadingCatalog ? (
                  <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                ) : (
                  <div className="space-y-8 pb-4">
                    {/* If a specific category is selected, just show its items. If 'All', group them by header. */}
                    {selectedCategory !== "All" ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredServices.map((service) => (
                          <ServiceCard key={service._id} service={service} onAdd={() => addToCart(service, 'service')} />
                        ))}
                      </div>
                    ) : (
                      Object.entries(
                        filteredServices.reduce((acc: any, s) => {
                          (acc[s.category] = acc[s.category] || []).push(s);
                          return acc;
                        }, {})
                      ).map(([cat, items]: any) => (
                        <div key={cat} className="space-y-4">
                          <h3 className="text-sm font-black border-b pb-1 text-primary">{cat}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {items.map((service: any) => (
                              <ServiceCard key={service._id} service={service} onAdd={() => addToCart(service, 'service')} />
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="products" className="flex-1 mt-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              {isLoadingCatalog ? (
                <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                  {filteredProducts.map((product) => (
                    <Card 
                      key={product._id} 
                      className="cursor-pointer hover:border-primary transition-all active:scale-95 shadow-sm overflow-hidden"
                      onClick={() => addToCart(product, 'product')}
                    >
                      <div className="bg-muted/30 p-3 h-full flex flex-col justify-between">
                        <div>
                          <div className="font-bold text-sm leading-tight">{product.name}</div>
                          <div className="text-[10px] text-muted-foreground mt-1">{product.stock} in stock</div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-black text-primary">₹{product.price}</span>
                          <PlusCircle className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Area: Cart */}
      <Card className="w-full lg:w-[500px] flex flex-col shadow-xl border-primary/10 lg:h-full overflow-hidden min-h-[400px] lg:min-h-0">
        <CardHeader className="py-2 px-4 border-b bg-muted/20 shrink-0">
          <CardTitle className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-primary" />
              <span>Order</span>
            </div>
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-mono">{cart.length} items</Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4 text-center h-full">
              <ShoppingCart className="h-8 w-8 opacity-20 mb-2" />
              <p className="text-[10px] font-bold uppercase tracking-widest">Cart Empty</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-4">
                {cart.map((item: any) => (
                  <div key={item.cartItemId} className="flex flex-col gap-1.5 group">
                    <div className="flex justify-between items-start gap-2">
                      <div className="text-[13px] font-bold leading-tight text-slate-800 line-clamp-2">{item.name}</div>
                      <div className="font-black text-[13px] text-slate-900 shrink-0">₹{item.price * item.qty}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-6 w-6 rounded-md shadow-none border-slate-200" onClick={() => updateQty(item.cartItemId, -1)}>
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-5 text-center font-bold text-xs">{item.qty}</span>
                        <Button variant="outline" size="icon" className="h-6 w-6 rounded-md shadow-none border-slate-200" onClick={() => updateQty(item.cartItemId, 1)}>
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => removeItem(item.cartItemId)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.type === 'service' && (
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground font-medium">Stylist:</span>
                        <Select 
                          value={item.staffCode} 
                          onValueChange={(val) => updateItemStaff(item.cartItemId, val || "")}
                        >
                          <SelectTrigger className="h-6 text-[10px] py-0 px-2 w-[100px] bg-white">
                            <SelectValue placeholder="Code" />
                          </SelectTrigger>
                          <SelectContent>
                            {staff.filter(s => s.role === 'stylist' || s.role === 'ceo').map(s => (
                              <SelectItem key={s._id} value={s.code} className="text-[10px]">
                                {s.code}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Separator className="mt-1 opacity-10" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>

        <div className="bg-primary/5 p-2 border-t shrink-0">
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-1">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Sub:</span>
              <span className="font-bold">₹{cartSubtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground italic">Add-On:</span>
              <Input 
                type="number" 
                className="w-14 h-7 text-right font-bold text-orange-600 text-sm px-1 bg-white border border-slate-200" 
                value={addOnServices || ""} 
                onChange={(e) => setAddOnServices(Number(e.target.value))}
                placeholder="0"
              />
            </div>
            <div className="col-span-2 flex justify-between items-center text-[10px] text-muted-foreground gap-2">
              <span className="italic shrink-0">Notes:</span>
              <Input 
                className="flex-1 h-6 text-[10px] px-2 bg-white/50 border-none italic" 
                placeholder="Details for add-on..." 
                value={addOnNotes}
                onChange={(e) => setAddOnNotes(e.target.value)}
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Disc%:</span>
              <Input 
                type="number" 
                className="w-14 h-7 text-right font-bold text-sm px-1 bg-white border border-slate-200" 
                value={discountPercent} 
                onChange={(e) => setDiscountPercent(Math.min(100, Math.max(0, Number(e.target.value))))}
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-blue-600 font-bold">GST%:</span>
              <Input 
                type="number" 
                className="w-14 h-7 text-right font-bold text-blue-600 text-sm px-1 bg-white border border-slate-200" 
                value={taxPercent} 
                onChange={(e) => setTaxPercent(Math.max(0, Number(e.target.value)))}
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-primary/20 pt-2">
            <span className="font-black text-xs text-foreground uppercase tracking-widest leading-none">Total</span>
            <span className="font-black text-3xl text-primary tracking-tighter leading-none">₹{total.toFixed(0)}</span>
          </div>
        </div>

        <CardFooter className="p-2 bg-muted/40 rounded-b-xl border-t shrink-0">
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button 
              variant="outline"
              className="h-12 text-sm font-bold bg-white" 
              onClick={() => handleCheckout("Card")}
              disabled={isProcessing}
            >
              Card
            </Button>
            <Button 
              variant="outline"
              className="h-12 text-sm font-bold bg-white" 
              onClick={() => handleCheckout("Cash")}
              disabled={isProcessing}
            >
              Cash
            </Button>
            <Button 
              className="h-12 text-sm font-black bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" 
              onClick={() => handleCheckout("UPI")}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "PAY UPI"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Quick Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <form onSubmit={handleQuickAddCustomer}>
            <DialogHeader>
              <DialogTitle>Quick Add Customer</DialogTitle>
              <DialogDescription>
                Mobile: {customerPhone}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="Enter customer name..." required autoFocus />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddCustomerOpen(false)}>Cancel</Button>
              <Button type="submit">Create & Select</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Success Dialog */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-emerald-600 p-8 flex flex-col items-center text-white">
            <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 animate-bounce">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-black mb-1 tracking-tight">PAYMENT SUCCESSFUL</h2>
            <p className="text-emerald-100 text-sm font-medium">Invoice #{lastInvoice?.invoiceNumber} generated</p>
          </div>
          
          <div className="p-6 space-y-6 bg-white">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-dashed border-emerald-200">
              <div>
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Amount Paid</p>
                <p className="text-3xl font-black text-slate-800">₹{lastInvoice?.total?.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Customer</p>
                <p className="text-sm font-bold text-slate-800">{selectedCustomer?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-12 border-2 gap-2 hover:bg-slate-50 font-bold"
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
              >
                {isGeneratingPDF ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                {isGeneratingPDF ? "Generating..." : "Download PDF"}
              </Button>
              <Button 
                variant="outline" 
                className="h-12 border-2 gap-2 hover:bg-slate-50 font-bold"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" /> Print Receipt
              </Button>
              <Button 
                className="col-span-2 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-lg gap-3 shadow-lg shadow-emerald-100"
                onClick={handleWhatsAppShare}
              >
                <Share2 className="h-5 w-5" /> SEND VIA WHATSAPP
              </Button>
            </div>
            
            <Button 
              variant="ghost" 
              className="w-full h-10 text-muted-foreground font-medium"
              onClick={() => {
                setIsSuccessOpen(false);
                setSelectedCustomer(null);
                setCustomerPhone("");
              }}
            >
              Close & New Sale
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden Invoice Container for PDF generation */}
      {lastInvoice && selectedCustomer && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', width: '800px' }}>
          <InvoiceReceipt 
            invoice={{ ...lastInvoice, customer: selectedCustomer }} 
            invoiceRef={invoiceRef} 
          />
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service, onAdd }: { service: any, onAdd: () => void }) {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-all active:scale-95 shadow-sm overflow-hidden"
      onClick={onAdd}
    >
      <div className="bg-muted/30 p-3 h-full flex flex-col justify-between">
        <div className="font-bold text-sm leading-tight mb-2">{service.name}</div>
        <div className="flex justify-between items-center">
          <span className="font-black text-primary">₹{service.price}</span>
          <PlusCircle className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </Card>
  );
}

function ShoppingCartIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}
