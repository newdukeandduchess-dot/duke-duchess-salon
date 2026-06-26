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

import { InvoiceReceipt } from "@/components/InvoiceReceipt";

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
      <div className="w-full flex justify-center">
        <InvoiceReceipt invoice={invoice} invoiceRef={invoiceRef} />
      </div>
    </div>
  );
}
