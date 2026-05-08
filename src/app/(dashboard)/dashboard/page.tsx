"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Sparkles, 
  Scissors, 
  Package, 
  Loader2, 
  ListOrdered,
  Calendar,
  ShoppingBag
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.ok) {
          const stats = await res.json();
          setData(stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-10rem)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const metrics = data?.metrics || { revenue: 0, customers: 0, services: 0, products: 0, revenueGrowth: 0 };
  const chartData = (data?.chartData || []).map((item: any) => ({
    name: format(new Date(item._id), 'EEE'),
    revenue: item.revenue
  }));

  const statsCards = [
    {
      title: "Today's Revenue",
      value: `₹${metrics.revenue.toLocaleString()}`,
      description: `${metrics.revenueGrowth > 0 ? '+' : ''}${metrics.revenueGrowth}% vs yesterday`,
      icon: IndianRupee,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Today's Customers",
      value: metrics.customers,
      description: "Unique customers served today",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      title: "Services Active",
      value: metrics.services,
      description: "Available in catalog",
      icon: Scissors,
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    {
      title: "Products in Stock",
      value: metrics.products,
      description: "Retail inventory",
      icon: ShoppingBag,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-background border border-border px-3 py-1.5 rounded-lg shadow-sm">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{format(new Date(), 'MMMM dd, yyyy')}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, idx) => (
          <Card key={idx} className="border-primary/10 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`${card.bg} ${card.color} p-2 rounded-lg`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4 border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Daily revenue performance for the past week.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRev)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3 border-primary/10 shadow-sm">
          <CardHeader>
            <CardTitle>Top Services</CardTitle>
            <CardDescription>Highest performing services by revenue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-2">
              {data?.topServices?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground italic text-sm">
                  <Scissors className="h-8 w-8 mb-2 opacity-20" />
                  No service data yet
                </div>
              ) : data?.topServices?.map((service: any, idx: number) => (
                <div key={idx} className="flex items-center">
                  <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary font-bold text-xs mr-4">
                    {idx + 1}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{service._id}</p>
                    <p className="text-xs text-muted-foreground">{service.count} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₹{service.revenue.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 shadow-sm">
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest billing activity across the salon.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.recentInvoices?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground italic text-sm">No recent transactions found</div>
            ) : data?.recentInvoices?.map((invoice: any) => (
              <div key={invoice._id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                    <IndianRupee className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{invoice.customer?.name || 'Walk-in Customer'}</p>
                    <p className="text-xs text-muted-foreground">{invoice.invoiceNumber} • {format(new Date(invoice.createdAt), 'hh:mm a')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-primary">₹{invoice.total.toLocaleString()}</p>
                  <Badge variant="outline" className="text-[10px] uppercase font-bold py-0">{invoice.paymentMethod}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
