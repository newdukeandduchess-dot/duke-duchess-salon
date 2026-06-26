"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Loader2, MapPin, Phone, User, Scissors, Star, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

// Helper to format currency
const formatCurrency = (amount: number) => {
  return amount.toFixed(2);
};

export default function PublicBillPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await fetch(`/api/invoices/public/${id}`);
        if (res.ok) {
          const data = await res.json();
          setInvoice(data);
        }
      } catch (error) {
        console.error("Failed to fetch invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  const generatePDF = async () => {
    if (!invoiceRef.current || !invoice) return;
    setIsGenerating(true);
    
    try {
      const element = invoiceRef.current;
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
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
      pdf.save(`Invoice_${invoice.invoiceNumber}.pdf`);
    } catch (err) {
      console.error("Failed to generate PDF", err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Bill Not Found</h1>
          <p className="text-muted-foreground">The link might be expired or incorrect.</p>
        </div>
      </div>
    );
  }

  const services = invoice.items.filter((item: any) => item.itemType === 'service' || !item.itemType);
  const products = invoice.items.filter((item: any) => item.itemType === 'product');

  return (
    <div className={`min-h-screen bg-neutral-100 py-10 px-4 flex flex-col items-center ${inter.className}`}>
      
      {/* Controls */}
      <div className="max-w-[800px] w-full flex justify-end mb-4">
        <Button 
          onClick={generatePDF} 
          disabled={isGenerating}
          className="bg-black text-[#cca354] hover:bg-neutral-800"
        >
          {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          {isGenerating ? "Generating PDF..." : "Download PDF"}
        </Button>
      </div>

      {/* Invoice Container - This is what gets captured */}
      <div 
        ref={invoiceRef}
        className="w-full max-w-[800px] bg-white p-10 shadow-2xl relative overflow-hidden"
        style={{ color: '#000' }}
      >
        {/* Top gold border */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-[#cca354]" />

        {/* HEADER */}
        <div className="flex gap-8 items-start mt-4">
          {/* Logo Box */}
          <div className="bg-black rounded-lg p-6 border border-[#cca354] shadow-sm flex flex-col items-center justify-center w-[220px] h-[220px]">
            {/* Crown Icon Placeholder or Logo */}
            <NextImage src="/salon-logo.png" alt="Logo" width={120} height={100} className="object-contain" />
            <div className={`text-center mt-4 text-[#cca354] uppercase leading-tight ${playfair.className}`}>
              <div className="text-lg">NEW DUKE & DUCHESS</div>
              <div className="text-sm tracking-widest mt-1">UNISEX SALON</div>
              <div className="text-xl mt-1">≽ܫ≼</div>
            </div>
          </div>

          {/* Address Section */}
          <div className="flex-1 pt-6">
            <h1 className={`text-5xl font-bold tracking-wide text-black uppercase ${playfair.className}`}>
              NEW DUKE & DUCHESS
            </h1>
            <div className="flex items-center gap-4 my-4">
              <div className="h-[1px] flex-1 bg-[#cca354]"></div>
              <span className="text-[#cca354] tracking-[0.3em] font-medium uppercase text-lg">UNISEX SALON</span>
              <div className="h-[1px] flex-1 bg-[#cca354]"></div>
            </div>
            
            <div className="space-y-4 mt-6 text-sm text-neutral-700">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-black shrink-0" />
                <p className="leading-relaxed">
                  07, Krishna Garden Main Rd,<br/>
                  Near New Happy Home, Balarama Layout,<br/>
                  Rajarajeshwari Nagar,<br/>
                  Bengaluru, Karnataka 560098
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-black shrink-0" />
                <p>+91 89047 10353</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#cca354] my-8" />

        {/* DETAILS SECTION */}
        <div className="flex">
          {/* Invoice Details */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#cca354] mb-4 font-bold tracking-wide">
              <span className="border border-[#cca354] p-1 text-xs">≡</span>
              <span>INVOICE DETAILS</span>
            </div>
            <div className="grid grid-cols-[100px_1fr] gap-y-2 text-sm">
              <div className="text-neutral-500">Invoice No.</div>
              <div className="font-medium">: {invoice.invoiceNumber}</div>
              <div className="text-neutral-500">Date & Time</div>
              <div className="font-medium">: {new Date(invoice.createdAt).toLocaleString('en-IN', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'})}</div>
              <div className="text-neutral-500">Payment Mode</div>
              <div className="font-medium">: {invoice.paymentMethod?.toUpperCase()}</div>
            </div>
          </div>

          <div className="w-[1px] bg-[#cca354] mx-8 h-24" />

          {/* Bill To */}
          <div className="flex-1">
            <div className="flex items-center gap-2 text-[#cca354] mb-4 font-bold tracking-wide">
              <User className="h-4 w-4" />
              <span>BILL TO</span>
            </div>
            <div className="text-lg font-bold mb-2">
              {invoice.customer?.name || "Customer"}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-[#cca354]" />
              <span>{invoice.customer?.phone || "-"}</span>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-neutral-200 my-8" />

        {/* SERVICES TABLE */}
        {services.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[#cca354] mb-4 font-bold tracking-wide">
              <Scissors className="h-5 w-5" />
              <span>SERVICES</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-[#cca354]">
                  <th className="py-3 px-4 text-left font-semibold w-1/2">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center font-semibold">STYLIST</th>
                  <th className="py-3 px-4 text-center font-semibold">QTY</th>
                  <th className="py-3 px-4 text-right font-semibold">RATE (₹)</th>
                  <th className="py-3 px-4 text-right font-semibold">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#cca354]/30">
                    <td className="py-4 px-4 text-neutral-800">{item.name}</td>
                    <td className="py-4 px-4 text-center text-neutral-600">{item.staffCode || "-"}</td>
                    <td className="py-4 px-4 text-center text-neutral-800">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-neutral-800">{formatCurrency(item.price)}</td>
                    <td className="py-4 px-4 text-right font-medium text-black">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* PRODUCTS TABLE */}
        {products.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 text-[#cca354] mb-4 font-bold tracking-wide">
              {/* Bottle Icon Placeholder */}
              <div className="flex gap-0.5">
                <div className="w-2 h-4 bg-[#cca354] rounded-t-sm" />
                <div className="w-2 h-4 bg-[#cca354] rounded-t-sm" />
              </div>
              <span>PRODUCTS</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-black text-[#cca354]">
                  <th className="py-3 px-4 text-left font-semibold w-1/2">DESCRIPTION</th>
                  <th className="py-3 px-4 text-center font-semibold">STYLIST</th>
                  <th className="py-3 px-4 text-center font-semibold">QTY</th>
                  <th className="py-3 px-4 text-right font-semibold">RATE (₹)</th>
                  <th className="py-3 px-4 text-right font-semibold">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#cca354]/30">
                    <td className="py-4 px-4 text-neutral-800">{item.name}</td>
                    <td className="py-4 px-4 text-center text-neutral-600">{item.staffCode || "-"}</td>
                    <td className="py-4 px-4 text-center text-neutral-800">{item.quantity}</td>
                    <td className="py-4 px-4 text-right text-neutral-800">{formatCurrency(item.price)}</td>
                    <td className="py-4 px-4 text-right font-medium text-black">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUMMARY SECTION */}
        <div className="flex gap-6 mt-12">
          {/* You Saved Box */}
          {invoice.discount > 0 && (
            <div className="flex-1 border border-[#cca354] rounded-lg p-6 flex flex-col justify-center bg-[#cca354]/5">
              <div className="flex items-center gap-4">
                <div className="bg-black text-[#cca354] p-3 rounded-full">
                  <Star className="h-8 w-8 fill-current" />
                </div>
                <div>
                  <div className="text-[#cca354] font-bold tracking-widest text-sm uppercase">YOU SAVED</div>
                  <div className="text-3xl font-black mt-1">₹{formatCurrency(invoice.discount)}</div>
                </div>
              </div>
              <div className={`mt-4 text-lg text-neutral-600 ${greatVibes.className}`}>
                Thank you for saving with us!
              </div>
            </div>
          )}
          {!(invoice.discount > 0) && <div className="flex-1" />}

          {/* Totals */}
          <div className="flex-1 border border-neutral-200 rounded-lg overflow-hidden flex flex-col justify-between">
            <div className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">₹{formatCurrency(invoice.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Tax (GST)</span>
                <span className="font-medium">₹{formatCurrency(invoice.tax)}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Discount</span>
                  <span className="font-medium">- ₹{formatCurrency(invoice.discount)}</span>
                </div>
              )}
            </div>
            <div className="bg-black text-[#cca354] p-4 flex justify-between items-center font-bold">
              <span className="tracking-widest">TOTAL PAYABLE</span>
              <span className="text-2xl">₹ {formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {/* PAYMENT SUCCESSFUL BANNER */}
        <div className="mt-6 border border-[#cca354]/30 bg-[#cca354]/5 rounded-lg p-4 flex items-center gap-4 justify-center">
          <div className="bg-[#cca354] text-white rounded-full p-1.5">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <div className="font-bold text-neutral-800 tracking-wide">PAYMENT SUCCESSFUL</div>
            <div className="text-sm text-neutral-500">Paid via {invoice.paymentMethod?.toUpperCase()} | Thank you for your payment.</div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-neutral-200 mt-10 mb-6" />

        {/* FOOTER */}
        <div className="flex items-center justify-between px-4 pb-12">
          {/* QR Code Placeholder */}
          <div className="w-24 h-24 bg-neutral-200 rounded-sm flex flex-col items-center justify-center p-2 border border-neutral-300">
             <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-full h-full opacity-60">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                ))}
             </div>
          </div>

          <div className="text-center space-y-2">
            <div className="text-[#cca354] font-bold text-xs uppercase tracking-widest">LOVE OUR SERVICE?</div>
            <div className="text-xs text-neutral-600">Scan to leave us a<br/>Google Review</div>
            <div className="flex justify-center gap-1 text-[#cca354]">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
          </div>

          <div className="w-[1px] h-16 bg-neutral-200" />

          <div className="text-center space-y-4">
            <div className="text-[#cca354] font-bold text-xs uppercase tracking-widest">FOLLOW US</div>
            <div className="flex justify-center gap-3">
              <div className="bg-black text-[#cca354] h-7 w-7 flex items-center justify-center rounded-full text-[10px] font-bold">IG</div>
              <div className="bg-black text-[#cca354] h-7 w-7 flex items-center justify-center rounded-full text-[10px] font-bold">FB</div>
              <div className="bg-black text-[#cca354] h-7 w-7 flex items-center justify-center rounded-full text-[10px] font-bold">WA</div>
            </div>
          </div>

          <div className="w-[1px] h-16 bg-neutral-200" />

          <div className="text-right">
            <div className={`text-4xl text-[#cca354] mb-2 ${greatVibes.className}`}>
              Thank You! ♡
            </div>
            <div className="text-xs text-neutral-600">
              We truly appreciate your support.<br/>We look forward to seeing you again!
            </div>
          </div>
        </div>

        {/* Bottom Black Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black py-2 text-center text-[#cca354] text-[10px] tracking-[0.2em] uppercase flex items-center justify-center gap-4">
          <span>♥</span>
          <span>STYLE IS A REFLECTION OF YOUR ATTITUDE</span>
          <span>♥</span>
        </div>
      </div>
    </div>
  );
}
