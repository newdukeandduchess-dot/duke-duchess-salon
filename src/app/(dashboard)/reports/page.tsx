"use client";

import { useEffect, useState } from "react";
import { 
  BarChart3, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  IndianRupee, 
  Users, 
  CreditCard, 
  UserRound,
  FileText,
  Loader2,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner";

export default function ReportsPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  
  // Filters
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    customerPhone: "",
    staffCode: "all",
    paymentMethod: "all"
  });

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.from) params.append("from", filters.from);
      if (filters.to) params.append("to", filters.to);
      if (filters.customerPhone) params.append("customerPhone", filters.customerPhone);
      if (filters.staffCode !== "all") params.append("staffCode", filters.staffCode);
      if (filters.paymentMethod !== "all") params.append("paymentMethod", filters.paymentMethod);

      const res = await fetch(`/api/reports?${params.toString()}`);
      const result = await res.json();
      setData(result);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await fetch("/api/staff");
      const data = await res.json();
      setStaff(data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchReports();
    fetchStaff();
  }, []);

  const resetFilters = () => {
    setFilters({
      from: "",
      to: "",
      customerPhone: "",
      staffCode: "all",
      paymentMethod: "all"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">REPORTS & ANALYTICS</h1>
          <p className="text-muted-foreground font-medium">Track your salon's performance and financial data.</p>
        </div>
        <Button onClick={fetchReports} className="gap-2 h-11 px-6 font-bold shadow-lg shadow-primary/20">
          <Search className="h-4 w-4" /> Generate Report
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Filter className="h-4 w-4" /> Report Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">From Date</label>
              <Input 
                type="date" 
                value={filters.from} 
                onChange={(e) => setFilters({...filters, from: e.target.value})}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">To Date</label>
              <Input 
                type="date" 
                value={filters.to} 
                onChange={(e) => setFilters({...filters, to: e.target.value})}
                className="bg-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Staff / Stylist</label>
              <Select value={filters.staffCode} onValueChange={(val) => setFilters({...filters, staffCode: val || "all"})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Staff" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Staff</SelectItem>
                  {staff.map(s => (
                    <SelectItem key={s._id} value={s.code}>{s.name} ({s.code})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Payment Method</label>
              <Select value={filters.paymentMethod} onValueChange={(val) => setFilters({...filters, paymentMethod: val || "all"})}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Customer Phone</label>
              <div className="relative">
                <Input 
                  placeholder="Filter by phone..." 
                  value={filters.customerPhone}
                  onChange={(e) => setFilters({...filters, customerPhone: e.target.value})}
                  className="bg-white pl-8"
                />
                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs font-bold text-slate-400 hover:text-slate-600">
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : data && (
        <div className="space-y-6 animate-in fade-in duration-500">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex h-24">
                  <div className="w-2 bg-emerald-500 h-full" />
                  <div className="flex-1 p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Revenue</p>
                      <p className="text-2xl font-black text-slate-800">₹{data.summary.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <IndianRupee className="h-6 w-6 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex h-24">
                  <div className="w-2 bg-blue-500 h-full" />
                  <div className="flex-1 p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Invoices</p>
                      <p className="text-2xl font-black text-slate-800">{data.summary.totalInvoices}</p>
                    </div>
                    <div className="h-12 w-12 bg-blue-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FileText className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex h-24">
                  <div className="w-2 bg-orange-500 h-full" />
                  <div className="flex-1 p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tax Collected</p>
                      <p className="text-2xl font-black text-slate-800">₹{data.summary.totalTax.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-orange-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <CreditCard className="h-6 w-6 text-orange-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden bg-white group hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex h-24">
                  <div className="w-2 bg-purple-500 h-full" />
                  <div className="flex-1 p-5 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Discounts Given</p>
                      <p className="text-2xl font-black text-slate-800">₹{data.summary.totalDiscount.toLocaleString()}</p>
                    </div>
                    <div className="h-12 w-12 bg-purple-50 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Payment Breakdown */}
             <Card className="border-none shadow-sm">
               <CardHeader className="border-b border-slate-50">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Revenue by Payment Method</CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                 <div className="space-y-4">
                    {Object.entries(data.summary.revenueByMethod).map(([method, amount]: any) => (
                      <div key={method} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-2 w-2 rounded-full ${method === 'cash' ? 'bg-emerald-500' : method === 'card' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                          <span className="text-sm font-bold capitalize text-slate-700">{method}</span>
                        </div>
                        <span className="font-bold text-slate-900">₹{amount.toLocaleString()}</span>
                      </div>
                    ))}
                    {Object.keys(data.summary.revenueByMethod).length === 0 && (
                      <p className="text-center text-muted-foreground py-4 italic text-sm">No payment data for this period.</p>
                    )}
                 </div>
               </CardContent>
             </Card>

             {/* Staff Breakdown */}
             <Card className="border-none shadow-sm">
               <CardHeader className="border-b border-slate-50">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Stylist Performance (Revenue)</CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                 <div className="space-y-4">
                    {Object.entries(data.summary.revenueByStaff).map(([code, amount]: any) => (
                      <div key={code} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserRound className="h-4 w-4 text-slate-400" />
                          <span className="text-sm font-bold text-slate-700">{code}</span>
                        </div>
                        <span className="font-bold text-slate-900">₹{amount.toLocaleString()}</span>
                      </div>
                    ))}
                    {Object.keys(data.summary.revenueByStaff).length === 0 && (
                      <p className="text-center text-muted-foreground py-4 italic text-sm">No staff performance data for this period.</p>
                    )}
                 </div>
               </CardContent>
             </Card>
          </div>

          {/* Detailed Invoice Table */}
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="border-b border-slate-50 bg-slate-50/50 flex flex-row items-center justify-between py-4">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-400">Detailed Transaction Log</CardTitle>
              <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-2">
                <Download className="h-3 w-3" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50/30">
                  <TableRow>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Invoice</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Date</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Customer</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest">Payment</TableHead>
                    <TableHead className="text-right font-black text-[10px] uppercase tracking-widest">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.invoices.map((inv: any) => (
                    <TableRow key={inv._id} className="hover:bg-slate-50 transition-colors">
                      <TableCell className="font-bold text-slate-900">{inv.invoiceNumber}</TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <p className="font-bold text-slate-800 text-sm">{inv.customer?.name || "Guest"}</p>
                        <p className="text-[10px] text-muted-foreground">{inv.customer?.phone}</p>
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                          inv.paymentMethod === 'cash' ? 'bg-emerald-100 text-emerald-700' :
                          inv.paymentMethod === 'card' ? 'bg-blue-100 text-blue-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {inv.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-black text-slate-900">
                        ₹{inv.total.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  {data.invoices.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center text-muted-foreground italic">
                        No transactions found for the selected filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
