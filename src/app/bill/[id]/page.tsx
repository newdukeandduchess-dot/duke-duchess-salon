"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Download, CheckCircle2, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import NextImage from "next/image";
import jsPDF from "jspdf";

export default function PublicBillPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logoBase64, setLogoBase64] = useState<string>("");

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

    // Pre-load logo for PDF
    const img = new Image();
    img.src = "/salon-logo.png";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0);
      setLogoBase64(canvas.toDataURL("image/png"));
    };
  }, [id]);

  const generatePDF = () => {
    if (!invoice) return;
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 15;
    const rowH = 8;
    let y = 0;

    // Header
    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", (pageW - 40) / 2, 10, 40, 40);
      y = 55;
    } else {
      doc.setFontSize(20);
      doc.setTextColor(180, 140, 40);
      doc.text("NEW DUKE & DUCHESS", pageW / 2, 20, { align: 'center' });
      y = 32;
    }

    doc.setDrawColor(180, 140, 40);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageW - margin, y);

    // Meta
    y += 8;
    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.text(`Invoice No: ${invoice.invoiceNumber}`, margin, y);
    doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, pageW - margin, y, { align: 'right' });

    // Table
    y += 20;
    const tableStartY = y;
    const colW = [70, 30, 20, 30, 30];
    const cols = [margin, margin + colW[0], margin + colW[0] + colW[1], margin + colW[0] + colW[1] + colW[2], margin + colW[0] + colW[1] + colW[2] + colW[3]];

    doc.setFillColor(180, 140, 40);
    doc.rect(margin, y, pageW - margin * 2, rowH, 'F');
    doc.setTextColor(255);
    doc.text("ITEM / SERVICE", margin + 3, y + 5);
    doc.text("STYLIST", cols[1] + 3, y + 5);
    doc.text("QTY", cols[2] + 3, y + 5);
    doc.text("PRICE", cols[3] + 3, y + 5);
    doc.text("TOTAL", cols[4] + 3, y + 5);
    y += rowH;

    doc.setTextColor(0);
    invoice.items.forEach((item: any, idx: number) => {
      const fillColor = idx % 2 === 0 ? [248, 245, 235] : [255, 255, 255];
      doc.setFillColor(fillColor[0], fillColor[1], fillColor[2]);
      doc.rect(margin, y, pageW - margin * 2, rowH, 'F');
      doc.text(item.name.substring(0, 35), margin + 3, y + 5);
      doc.text(item.staffCode || "-", cols[1] + 3, y + 5);
      doc.text(item.quantity.toString(), cols[2] + 3, y + 5);
      doc.text(item.price.toFixed(2), cols[3] + 3, y + 5);
      doc.text(item.total.toFixed(2), cols[4] + 3, y + 5);
      y += rowH;
    });

    doc.rect(margin, tableStartY, pageW - margin * 2, y - tableStartY);

    // Summary
    y += 8;
    const sumLabelX = 125;
    const sumValX = pageW - margin;

    doc.setFontSize(9);
    doc.setTextColor(80);
    doc.text("Subtotal:", sumLabelX, y);
    doc.text(`Rs. ${invoice.subtotal.toFixed(2)}`, sumValX, y, { align: 'right' });
    y += 7;

    if (invoice.discount > 0) {
      doc.text("Discount:", sumLabelX, y);
      doc.text(`- Rs. ${invoice.discount.toFixed(2)}`, sumValX, y, { align: 'right' });
      y += 7;
    }

    doc.text("GST:", sumLabelX, y);
    doc.text(`Rs. ${invoice.tax.toFixed(2)}`, sumValX, y, { align: 'right' });
    y += 3;

    doc.setDrawColor(180, 140, 40);
    doc.line(sumLabelX, y, sumValX, y);
    y += 6;

    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Grand Total:", sumLabelX, y);
    doc.setTextColor(180, 140, 40);
    doc.text(`Rs. ${invoice.total.toFixed(2)}`, sumValX, y, { align: 'right' });

    y += 12;
    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Payment Method: ${invoice.paymentMethod?.toUpperCase() || 'CASH'}`, margin, y);

    // Footer
    y += 20;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("Thank you for choosing New Duke & Duchess!", pageW / 2, y, { align: 'center' });
    doc.text("We look forward to seeing you again!", pageW / 2, y + 6, { align: 'center' });

    doc.save(`${invoice.invoiceNumber}.pdf`);
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

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <NextImage src="/salon-logo.png" alt="Logo" width={150} height={80} className="object-contain" />
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <CheckCircle2 className="h-5 w-5" />
            <span>Payment Received Successfully</span>
          </div>
        </div>

        <Card className="shadow-xl border-none overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground text-center py-8">
            <CardTitle className="text-3xl font-black">₹{invoice.total.toFixed(2)}</CardTitle>
            <p className="opacity-80">Paid via {invoice.paymentMethod?.toUpperCase()}</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="p-6 space-y-6">
              <div className="flex justify-between text-sm">
                <div>
                  <p className="text-muted-foreground">Invoice Number</p>
                  <p className="font-bold">{invoice.invoiceNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-bold">{new Date(invoice.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Order Summary</p>
                {invoice.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start py-1">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity} {item.staffCode && ` • Stylist: ${item.staffCode}`}
                        {item.notes && <span className="block mt-0.5 text-orange-600 italic">Note: {item.notes}</span>}
                      </p>
                    </div>
                    <p className="font-bold text-slate-900">₹{item.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p>₹{invoice.subtotal.toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-muted-foreground">Tax (GST)</p>
                  <p>₹{invoice.tax.toFixed(2)}</p>
                </div>
                {invoice.discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <p>Discount</p>
                    <p>-₹{invoice.discount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between text-lg font-black pt-2 text-primary">
                  <p>Grand Total</p>
                  <p>₹{invoice.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 flex flex-col gap-3">
              <Button onClick={generatePDF} className="w-full gap-2 h-12 text-lg">
                <Download className="h-5 w-5" /> Download PDF Receipt
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-6 pt-8">
          <div className="flex flex-col items-center gap-2 text-slate-500 text-sm">
            <p className="flex items-center gap-1"><MapPin className="h-4 w-4" /> Bangalore, India</p>
            <p className="flex items-center gap-1"><Phone className="h-4 w-4" /> +91 6363691884</p>
          </div>
          <p className="text-xs text-muted-foreground">Thank you for visiting New Duke & Duchess Salon!</p>
        </div>
      </div>
    </div>
  );
}
