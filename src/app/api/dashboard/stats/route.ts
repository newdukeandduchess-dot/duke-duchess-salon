import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongoose';
import Invoice from '@/models/Invoice';
import Customer from '@/models/Customer';
import Service from '@/models/Service';
import Product from '@/models/Product';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    // 1. Core Metrics (Today)
    const [
      todayRevenueData,
      todayCustomerData,
      serviceCount,
      productCount,
      yesterdayRevenueData
    ] = await Promise.all([
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ]),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfToday } } },
        { $group: { _id: "$customer", count: { $sum: 1 } } }
      ]),
      Service.countDocuments(),
      Product.countDocuments(),
      Invoice.aggregate([
        { $match: { createdAt: { $gte: startOfYesterday, $lt: startOfToday } } },
        { $group: { _id: null, total: { $sum: "$total" } } }
      ])
    ]);

    const todayRevenue = todayRevenueData[0]?.total || 0;
    const todayCustomers = todayCustomerData.length;
    const yesterdayRevenue = yesterdayRevenueData[0]?.total || 0;
    const revenueGrowth = yesterdayRevenue === 0 ? (todayRevenue > 0 ? 100 : 0) : ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100;

    // 2. Revenue Chart Data (Last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const chartData = await Invoice.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 3. Top Services
    const topServices = await Invoice.aggregate([
      { $unwind: "$items" },
      { $match: { "items.itemType": "service" } },
      {
        $group: {
          _id: "$items.name",
          count: { $sum: 1 },
          revenue: { $sum: "$items.total" }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);

    // 4. Recent Invoices
    const recentInvoices = await Invoice.find({})
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      metrics: {
        revenue: todayRevenue,
        revenueGrowth: revenueGrowth.toFixed(1),
        customers: todayCustomers,
        services: serviceCount,
        products: productCount
      },
      chartData,
      topServices,
      recentInvoices
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
