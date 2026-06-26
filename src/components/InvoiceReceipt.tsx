import React from "react";
import { Playfair_Display, Inter, Great_Vibes } from "next/font/google";
import { MapPin, Phone, User, Scissors, Star, Check } from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });
const greatVibes = Great_Vibes({ weight: "400", subsets: ["latin"] });

const formatCurrency = (amount: number) => {
  return Number(amount || 0).toFixed(2);
};

interface InvoiceReceiptProps {
  invoice: any;
  invoiceRef?: React.RefObject<HTMLDivElement | null>;
}

export function InvoiceReceipt({ invoice, invoiceRef }: InvoiceReceiptProps) {
  const services = invoice.items?.filter((item: any) => item.itemType === 'service' || !item.itemType) || [];
  const products = invoice.items?.filter((item: any) => item.itemType === 'product') || [];

  const servicesTotal = services.reduce((sum: number, item: any) => sum + Number(item.total || 0), 0);
  const productsTotal = products.reduce((sum: number, item: any) => sum + Number(item.total || 0), 0);

  // Extract staff name from invoice staff object, or first item's staff name
  const staffName = invoice.staff?.name || invoice.items?.[0]?.staffName;

  return (
    <div 
      ref={invoiceRef}
      className={`w-full max-w-[800px] mx-auto bg-[#ffffff] p-6 sm:p-10 shadow-2xl relative overflow-hidden ${inter.className} print:p-0 print:shadow-none print:w-full print:max-w-none`}
      style={{ color: '#000000' }}
    >
      {/* Top gold border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#cca354]" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-center sm:items-start mt-4">
        {/* Logo Box */}
        <div className="bg-[#000000] rounded-lg p-4 sm:p-6 border border-[#cca354] shadow-sm flex flex-col items-center justify-center w-full max-w-[220px] sm:w-[220px] h-[220px] shrink-0">
          <img src="/salon-logo.png" alt="Logo" width={120} height={100} className="object-contain" />
          <div className={`text-center mt-4 text-[#cca354] uppercase leading-tight ${playfair.className}`}>
            <div className="text-lg">NEW DUKE & DUCHESS</div>
            <div className="text-xs sm:text-sm tracking-widest mt-1">UNISEX SALON</div>
            <div className="text-xl mt-1">≽ܫ≼</div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex-1 pt-2 sm:pt-6 text-center sm:text-left">
          <h1 className={`text-3xl sm:text-5xl font-bold tracking-wide text-[#000000] uppercase ${playfair.className}`}>
            NEW DUKE & DUCHESS
          </h1>
          <div className="flex items-center gap-4 my-4 opacity-80 sm:opacity-100 justify-center sm:justify-start">
            <div className="h-[1px] w-12 sm:flex-1 bg-[#cca354]"></div>
            <span className="text-[#cca354] tracking-[0.2em] sm:tracking-[0.3em] font-medium uppercase text-sm sm:text-lg whitespace-nowrap">UNISEX SALON</span>
            <div className="h-[1px] w-12 sm:flex-1 bg-[#cca354]"></div>
          </div>
          
          <div className="space-y-3 sm:space-y-4 mt-6 text-xs sm:text-sm text-[#404040] inline-block text-left">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#000000] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                07, Krishna Garden Main Rd,<br/>
                Near New Happy Home, Balarama Layout,<br/>
                Rajarajeshwari Nagar,<br/>
                Bengaluru, Karnataka 560098
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#000000] shrink-0" />
              <p>+91 89047 10353</p>
            </div>
            {/* Optional details could go here */}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#cca354] my-6 sm:my-8" />

      {/* DETAILS SECTION */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-0">
        {/* Invoice Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#cca354] mb-3 sm:mb-4 font-bold tracking-wide">
            <span className="border border-[#cca354] p-0.5 sm:p-1 text-[10px] sm:text-xs">≡</span>
            <span className="text-sm sm:text-base">INVOICE DETAILS</span>
          </div>
          <div className="grid grid-cols-[110px_1fr] sm:grid-cols-[130px_1fr] gap-y-2 text-xs sm:text-sm">
            <div className="text-[#737373]">Invoice No.</div>
            <div className="font-medium truncate">: {invoice.invoiceNumber || 'INV-TEMP'}</div>
            <div className="text-[#737373]">Date & Time</div>
            <div className="font-medium">: {new Date(invoice.createdAt || Date.now()).toLocaleString('en-IN', {day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit'})}</div>
            <div className="text-[#737373]">Payment Mode</div>
            <div className="font-medium">: {invoice.paymentMethod?.toUpperCase() || 'CASH'}</div>
            {staffName && (
              <>
                <div className="text-[#737373]">Staff Name</div>
                <div className="font-medium">: {staffName}</div>
              </>
            )}
            <div className="text-[#737373]">Membership</div>
            <div className="font-medium">: {invoice.customer?.membershipStatus || invoice.customer?.isMember ? 'Member' : 'Non-Member'}</div>
          </div>
        </div>

        <div className="hidden sm:block w-[1px] bg-[#cca354] mx-8 min-h-[120px]" />
        <div className="block sm:hidden w-full h-[1px] bg-[#f5f5f5]" />

        {/* Bill To */}
        <div className="flex-1">
          <div className="flex items-center gap-2 text-[#cca354] mb-3 sm:mb-4 font-bold tracking-wide">
            <User className="h-4 w-4" />
            <span className="text-sm sm:text-base">BILL TO</span>
          </div>
          <div className="text-base sm:text-lg font-bold mb-2">
            {invoice.customer?.name || "Customer"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#cca354]" />
              <span>{invoice.customer?.phone || "-"}</span>
            </div>
            {invoice.customer?.membershipId && (
              <div className="flex items-center gap-2 text-xs sm:text-sm mt-1 text-[#525252]">
                <span className="font-medium text-[#cca354]">ID:</span>
                <span>{invoice.customer.membershipId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#e5e5e5] my-6 sm:my-8" />

      {/* SERVICES TABLE */}
      {services.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-[#cca354] mb-3 sm:mb-4 font-bold tracking-wide">
            <Scissors className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="text-sm sm:text-base">SERVICES</span>
          </div>
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-[#000000] text-[#cca354]">
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-left font-semibold w-[45%]">DESCRIPTION</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-semibold w-[15%]">STYLIST</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-semibold w-[10%]">QTY</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-right font-semibold w-[15%]">RATE (₹)</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-semibold w-[15%]">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item: any, idx: number) => {
                  const displayName = item.notes ? `${item.name} (${item.notes})` : item.name;
                  return (
                    <tr key={idx} className="border-b border-[#cca3544d] hover:bg-[#fafafa80]">
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-[#262626] break-words">{displayName}</td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-[#262626]">{item.quantity}</td>
                      <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-[#262626]">{formatCurrency(item.price)}</td>
                      <td className="py-3 sm:py-4 px-3 sm:px-4 text-right font-medium text-[#000000]">{formatCurrency(item.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRODUCTS TABLE */}
      {products.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 text-[#cca354] mb-3 sm:mb-4 font-bold tracking-wide">
            <div className="flex gap-0.5 mt-0.5">
              <div className="w-1.5 sm:w-2 h-3 sm:h-4 bg-[#cca354] rounded-t-sm" />
              <div className="w-1.5 sm:w-2 h-3 sm:h-4 bg-[#cca354] rounded-t-sm" />
            </div>
            <span className="text-sm sm:text-base">PRODUCTS</span>
          </div>
          <div className="overflow-x-auto pb-2">
            <table className="w-full text-xs sm:text-sm min-w-[500px]">
              <thead>
                <tr className="bg-[#000000] text-[#cca354]">
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-left font-semibold w-[45%]">DESCRIPTION</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-semibold w-[15%]">STYLIST</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-center font-semibold w-[10%]">QTY</th>
                  <th className="py-2.5 sm:py-3 px-2 sm:px-4 text-right font-semibold w-[15%]">RATE (₹)</th>
                  <th className="py-2.5 sm:py-3 px-3 sm:px-4 text-right font-semibold w-[15%]">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#cca3544d] hover:bg-[#fafafa80]">
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-[#262626] break-words">{item.name}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-center text-[#262626]">{item.quantity}</td>
                    <td className="py-3 sm:py-4 px-2 sm:px-4 text-right text-[#262626]">{formatCurrency(item.price)}</td>
                    <td className="py-3 sm:py-4 px-3 sm:px-4 text-right font-medium text-[#000000]">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUMMARY SECTION */}
      <div className="flex flex-col sm:flex-row gap-6 mt-8 sm:mt-12">
        {/* You Saved Box */}
        {Number(invoice.discount) > 0 || Number(invoice.membershipDiscount) > 0 || Number(invoice.couponDiscount) > 0 ? (
          <div className="flex-1 border border-[#cca354] rounded-lg p-5 sm:p-6 flex flex-col justify-center bg-[#cca3540d] text-center sm:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="bg-[#000000] text-[#cca354] p-2.5 sm:p-3 rounded-full shrink-0">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
              </div>
              <div>
                <div className="text-[#cca354] font-bold tracking-widest text-xs sm:text-sm uppercase">YOU SAVED</div>
                <div className="text-2xl sm:text-3xl font-black mt-1 text-[#000000]">
                  ₹{formatCurrency((Number(invoice.discount) || 0) + (Number(invoice.membershipDiscount) || 0) + (Number(invoice.couponDiscount) || 0))}
                </div>
              </div>
            </div>
            <div className={`mt-3 sm:mt-4 text-base sm:text-lg text-[#525252] ${greatVibes.className}`}>
              Thank you for saving with us!
            </div>
          </div>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}

        {/* Totals */}
        <div className="flex-1 w-full sm:w-auto border border-[#e5e5e5] rounded-lg overflow-hidden flex flex-col justify-between self-end sm:self-auto min-w-[280px]">
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 text-xs sm:text-sm">
            {services.length > 0 && products.length > 0 && (
              <>
                <div className="flex justify-between items-center text-[#737373]">
                  <span>Services Total</span>
                  <span>₹{formatCurrency(servicesTotal)}</span>
                </div>
                <div className="flex justify-between items-center text-[#737373]">
                  <span>Products Total</span>
                  <span>₹{formatCurrency(productsTotal)}</span>
                </div>
                <div className="w-full h-[1px] bg-[#f5f5f5] my-1"></div>
              </>
            )}
            
            <div className="flex justify-between items-center">
              <span className="text-[#525252]">Subtotal</span>
              <span className="font-medium">₹{formatCurrency(invoice.subtotal)}</span>
            </div>
            
            {Number(invoice.additionalCharges) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[#525252]">Additional Charges</span>
                <span className="font-medium">+ ₹{formatCurrency(invoice.additionalCharges)}</span>
              </div>
            )}
            
            {Number(invoice.tax) > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-[#525252]">Tax (GST)</span>
                <span className="font-medium">₹{formatCurrency(invoice.tax)}</span>
              </div>
            )}
            
            {Number(invoice.discount) > 0 && (
              <div className="flex justify-between items-center text-[#15803d]">
                <span>Discount</span>
                <span className="font-medium">- ₹{formatCurrency(invoice.discount)}</span>
              </div>
            )}
            
            {Number(invoice.membershipDiscount) > 0 && (
              <div className="flex justify-between items-center text-[#15803d]">
                <span>Membership Discount</span>
                <span className="font-medium">- ₹{formatCurrency(invoice.membershipDiscount)}</span>
              </div>
            )}
            
            {Number(invoice.couponDiscount) > 0 && (
              <div className="flex justify-between items-center text-[#15803d]">
                <span>Coupon Discount</span>
                <span className="font-medium">- ₹{formatCurrency(invoice.couponDiscount)}</span>
              </div>
            )}
          </div>
          <div className="bg-[#000000] text-[#cca354] p-3 sm:p-4 flex justify-between items-center font-bold">
            <span className="tracking-widest text-xs sm:text-sm">TOTAL PAYABLE</span>
            <span className="text-lg sm:text-2xl">₹ {formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT SUCCESSFUL BANNER */}
      <div className="mt-6 border border-[#cca3544d] bg-[#cca3540d] rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center text-center sm:text-left">
        <div className="bg-[#cca354] text-[#ffffff] rounded-full p-1 sm:p-1.5 shrink-0">
          <Check className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div>
          <div className="font-bold text-[#262626] tracking-wide text-sm sm:text-base">PAYMENT SUCCESSFUL</div>
          <div className="text-xs sm:text-sm text-[#737373] mt-0.5">Paid via {invoice.paymentMethod?.toUpperCase() || 'CASH'} | Thank you for your payment.</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#e5e5e5] mt-8 sm:mt-10 mb-6" />

      {/* FOOTER */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4 px-2 sm:px-4 pb-14 sm:pb-12">
        {/* QR Code Section */}
        <div className="flex items-center gap-4 text-left sm:text-center sm:flex-col sm:gap-2">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#f5f5f5] rounded-sm flex flex-col items-center justify-center p-1 border border-[#d4d4d4] shrink-0">
             <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-full h-full opacity-60">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`bg-[#000000] ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                ))}
             </div>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <div className="text-[#cca354] font-bold text-[10px] sm:text-xs uppercase tracking-widest">LOVE OUR SERVICE?</div>
            <div className="text-[10px] sm:text-xs text-[#525252]">Scan to leave us a<br className="hidden sm:block"/> Google Review</div>
            <div className="flex justify-start sm:justify-center gap-1 text-[#cca354]">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 sm:h-4 sm:w-4 fill-current" />)}
            </div>
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-16 bg-[#e5e5e5]" />
        <div className="block sm:hidden w-32 h-[1px] bg-[#e5e5e5]" />

        <div className="text-center space-y-3 sm:space-y-4">
          <div className="text-[#cca354] font-bold text-[10px] sm:text-xs uppercase tracking-widest">FOLLOW US</div>
          <div className="flex justify-center gap-3">
            <div className="bg-[#000000] text-[#cca354] h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold">IG</div>
            <div className="bg-[#000000] text-[#cca354] h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold">FB</div>
            <div className="bg-[#000000] text-[#cca354] h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center rounded-full text-[9px] sm:text-[10px] font-bold">WA</div>
          </div>
        </div>

        <div className="hidden sm:block w-[1px] h-16 bg-[#e5e5e5]" />
        <div className="block sm:hidden w-32 h-[1px] bg-[#e5e5e5]" />

        <div className="text-center sm:text-right">
          <div className={`text-3xl sm:text-4xl text-[#cca354] mb-1 sm:mb-2 ${greatVibes.className}`}>
            Thank You! ♡
          </div>
          <div className="text-[10px] sm:text-xs text-[#525252] leading-relaxed">
            We truly appreciate your support.<br/>We look forward to seeing you again!
          </div>
        </div>
      </div>

      {/* Bottom Black Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#000000] py-2 sm:py-2.5 text-center text-[#cca354] text-[8px] sm:text-[10px] tracking-[0.1em] sm:tracking-[0.2em] uppercase flex items-center justify-center gap-2 sm:gap-4">
        <span>♥</span>
        <span>STYLE IS A REFLECTION OF YOUR ATTITUDE</span>
        <span>♥</span>
      </div>
    </div>
  );
}

