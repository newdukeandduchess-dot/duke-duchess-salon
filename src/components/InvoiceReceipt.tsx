import React from "react";
import { Playfair_Display, Montserrat, Poppins, Great_Vibes } from "next/font/google";
import { MapPin, Phone, User, Scissors, Star, Check } from "lucide-react";

const playfair = Playfair_Display({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"] });
const poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"] });
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
      className={`w-full max-w-[800px] mx-auto bg-[#ffffff] p-4 sm:p-6 shadow-2xl relative overflow-hidden print:p-0 print:shadow-none print:w-full print:max-w-none ${poppins.className}`}
      style={{ color: '#000000' }}
    >
      {/* Top gold border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-[#C9A24A]" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-6 items-center justify-between mt-2">
        {/* Logo Box */}
        <div className="bg-[#000000] rounded-lg p-3 border border-[#C9A24A] flex flex-col items-center justify-center w-[160px] h-[160px] shrink-0">
          <img src="/salon-logo.png" alt="Logo" width={80} height={65} className="object-contain" />
          <div className={`text-center mt-2 text-[#C9A24A] uppercase leading-tight ${playfair.className}`}>
            <div className="text-sm font-bold">NEW DUKE & DUCHESS</div>
            <div className="text-[10px] tracking-widest mt-0.5">UNISEX SALON</div>
            <div className="text-sm mt-0.5">≽ܫ≼</div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
          <h1 className={`text-2xl sm:text-4xl font-bold tracking-wide text-[#000000] uppercase whitespace-nowrap ${playfair.className}`}>
            NEW DUKE & DUCHESS
          </h1>
          <div className={`flex items-center gap-3 my-2 opacity-100 justify-center sm:justify-start ${montserrat.className}`}>
            <div className="h-[1px] w-12 sm:flex-1 bg-[#C9A24A]"></div>
            <span className="text-[#C9A24A] tracking-[0.3em] font-medium uppercase text-sm sm:text-base whitespace-nowrap">UNISEX SALON</span>
            <div className="h-[1px] w-12 sm:flex-1 bg-[#C9A24A]"></div>
          </div>
          
          <div className={`space-y-2 mt-4 text-xs sm:text-sm text-[#404040] inline-block text-left ${poppins.className}`}>
            <div className="flex items-start gap-2.5">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-[#000000] shrink-0 mt-0.5" />
              <p className="leading-snug">
                07, Krishna Garden Main Rd,<br/>
                Near New Happy Home, Balarama Layout,<br/>
                Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-[#000000] shrink-0" />
              <p>+91 89047 10353</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#C9A24A] my-4 sm:my-5" />

      {/* DETAILS SECTION */}
      <div className={`flex flex-col sm:flex-row gap-6 sm:gap-12 ${poppins.className}`}>
        {/* Invoice Details */}
        <div className="flex-1">
          <div className={`flex items-center gap-2 text-[#C9A24A] mb-2 font-bold tracking-wide ${montserrat.className}`}>
            <span className="border border-[#C9A24A] p-0.5 text-[10px]">≡</span>
            <span className="text-xs sm:text-sm uppercase">INVOICE DETAILS</span>
          </div>
          <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-y-1.5 text-xs sm:text-sm">
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

        <div className="hidden sm:block w-[1px] bg-[#C9A24A] min-h-[80px]" />
        <div className="block sm:hidden w-full h-[1px] bg-[#f5f5f5]" />

        {/* Bill To */}
        <div className="flex-1">
          <div className={`flex items-center gap-2 text-[#C9A24A] mb-2 font-bold tracking-wide ${montserrat.className}`}>
            <User className="h-4 w-4" />
            <span className="text-xs sm:text-sm uppercase">BILL TO</span>
          </div>
          <div className="text-sm sm:text-base font-semibold mb-1.5">
            {invoice.customer?.name || "Customer"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Phone className="h-3.5 w-3.5 text-[#C9A24A]" />
              <span>{invoice.customer?.phone || "-"}</span>
            </div>
            {invoice.customer?.membershipId && (
              <div className="flex items-center gap-2 text-xs sm:text-sm mt-1 text-[#525252]">
                <span className="font-medium text-[#C9A24A]">ID:</span>
                <span>{invoice.customer.membershipId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#e5e5e5] my-4 sm:my-5" />

      {/* SERVICES TABLE */}
      {services.length > 0 && (
        <div className="mb-4 sm:mb-5">
          <div className={`flex items-center gap-2 text-[#C9A24A] mb-2 font-bold tracking-wide ${montserrat.className}`}>
            <Scissors className="h-4 w-4" />
            <span className="text-xs sm:text-sm uppercase">SERVICES</span>
          </div>
          <div className={`w-full ${poppins.className}`}>
            <table className="w-full text-xs sm:text-sm table-auto border-collapse">
              <thead>
                <tr className={`bg-[#000000] text-[#C9A24A] ${montserrat.className}`}>
                  <th className="py-2 px-3 text-left font-semibold">DESCRIPTION</th>
                  <th className="py-2 px-2 text-center font-semibold">STYLIST</th>
                  <th className="py-2 px-2 text-center font-semibold">QTY</th>
                  <th className="py-2 px-2 text-right font-semibold">RATE (₹)</th>
                  <th className="py-2 px-3 text-right font-semibold">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item: any, idx: number) => {
                  const displayName = item.notes ? `${item.name} (${item.notes})` : item.name;
                  return (
                    <tr key={idx} className="border-b border-[#C9A24A4D] hover:bg-[#fafafa80]">
                      <td className="py-2 px-3 text-[#262626] break-words">{displayName}</td>
                      <td className="py-2 px-2 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                      <td className="py-2 px-2 text-center text-[#262626]">{item.quantity}</td>
                      <td className="py-2 px-2 text-right text-[#262626]">{formatCurrency(item.price)}</td>
                      <td className="py-2 px-3 text-right font-semibold text-[#000000]">{formatCurrency(item.total)}</td>
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
        <div className="mb-4 sm:mb-5">
          <div className={`flex items-center gap-2 text-[#C9A24A] mb-2 font-bold tracking-wide ${montserrat.className}`}>
            <div className="flex gap-0.5 mt-0.5">
              <div className="w-1.5 h-3 bg-[#C9A24A] rounded-t-sm" />
              <div className="w-1.5 h-3 bg-[#C9A24A] rounded-t-sm" />
            </div>
            <span className="text-xs sm:text-sm uppercase">PRODUCTS</span>
          </div>
          <div className={`w-full ${poppins.className}`}>
            <table className="w-full text-xs sm:text-sm table-auto border-collapse">
              <thead>
                <tr className={`bg-[#000000] text-[#C9A24A] ${montserrat.className}`}>
                  <th className="py-2 px-3 text-left font-semibold">DESCRIPTION</th>
                  <th className="py-2 px-2 text-center font-semibold">STYLIST</th>
                  <th className="py-2 px-2 text-center font-semibold">QTY</th>
                  <th className="py-2 px-2 text-right font-semibold">RATE (₹)</th>
                  <th className="py-2 px-3 text-right font-semibold">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any, idx: number) => (
                  <tr key={idx} className="border-b border-[#C9A24A4D] hover:bg-[#fafafa80]">
                    <td className="py-2 px-3 text-[#262626] break-words">{item.name}</td>
                    <td className="py-2 px-2 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                    <td className="py-2 px-2 text-center text-[#262626]">{item.quantity}</td>
                    <td className="py-2 px-2 text-right text-[#262626]">{formatCurrency(item.price)}</td>
                    <td className="py-2 px-3 text-right font-semibold text-[#000000]">{formatCurrency(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUMMARY SECTION */}
      <div className={`flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8 items-start ${poppins.className}`}>
        {/* You Saved Box */}
        {Number(invoice.discount) > 0 || Number(invoice.membershipDiscount) > 0 || Number(invoice.couponDiscount) > 0 ? (
          <div className="flex-1 border border-[#C9A24A] rounded p-3 sm:p-4 flex flex-col justify-center bg-[#C9A24A0D] text-center sm:text-left h-full">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="bg-[#000000] text-[#C9A24A] p-2 rounded-full shrink-0 flex items-center justify-center">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div>
                <div className={`text-[#C9A24A] font-bold tracking-widest text-[10px] uppercase ${montserrat.className}`}>YOU SAVED</div>
                <div className="text-xl sm:text-2xl font-black mt-0.5 text-[#000000]">
                  ₹{formatCurrency((Number(invoice.discount) || 0) + (Number(invoice.membershipDiscount) || 0) + (Number(invoice.couponDiscount) || 0))}
                </div>
              </div>
            </div>
            <div className={`mt-2 text-sm sm:text-base text-[#525252] ${greatVibes.className}`}>
              Thank you for saving with us!
            </div>
          </div>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}

        {/* Totals */}
        <div className="flex-1 w-full sm:w-auto border border-[#e5e5e5] rounded overflow-hidden flex flex-col justify-between self-end sm:self-auto min-w-[280px]">
          <div className="p-3 sm:p-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
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
          <div className={`bg-[#000000] text-[#C9A24A] py-2 px-3 sm:px-4 flex justify-between items-center ${montserrat.className}`}>
            <span className="tracking-widest text-[10px] sm:text-xs font-bold uppercase">TOTAL PAYABLE</span>
            <span className="text-lg sm:text-xl font-black">₹ {formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT SUCCESSFUL BANNER */}
      <div className={`mt-4 border border-[#C9A24A4D] bg-[#ffffff] rounded p-3 flex flex-row items-center justify-center gap-3 text-center shadow-sm ${poppins.className}`}>
        <div className="bg-[#C9A24A] text-[#ffffff] rounded-full p-1.5 shrink-0">
          <Check className="h-4 w-4" />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <div className={`font-bold text-[#262626] tracking-wide text-sm sm:text-base ${montserrat.className}`}>PAYMENT SUCCESSFUL</div>
          <div className="hidden sm:block text-[#C9A24A]">•</div>
          <div className="text-xs text-[#737373]">Paid via {invoice.paymentMethod?.toUpperCase() || 'CASH'} | Thank you for your payment.</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#e5e5e5] mt-6 sm:mt-8 mb-5" />

      {/* FOOTER */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 px-2 sm:px-4 pb-6 sm:pb-8 items-center ${poppins.className}`}>
        {/* QR Code Section */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="w-14 h-14 bg-[#f5f5f5] rounded-sm flex flex-col items-center justify-center p-1 border border-[#d4d4d4] shrink-0">
             <div className="grid grid-cols-4 grid-rows-4 gap-0.5 w-full h-full opacity-60">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`bg-[#000000] ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                ))}
             </div>
          </div>
          <div className="space-y-1">
            <div className={`text-[#C9A24A] font-bold text-[9px] uppercase tracking-widest ${montserrat.className}`}>LOVE OUR SERVICE?</div>
            <div className="text-[10px] text-[#525252] leading-tight">Scan to leave us a<br/> Google Review</div>
            <div className="flex gap-1 text-[#C9A24A]">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-current" />)}
            </div>
          </div>
        </div>

        {/* Social Follow */}
        <div className="flex flex-col items-center justify-center space-y-2 sm:border-l sm:border-r border-[#e5e5e5]">
          <div className={`text-[#C9A24A] font-bold text-[9px] uppercase tracking-widest ${montserrat.className}`}>FOLLOW US</div>
          <div className="flex justify-center gap-3">
            <div className="bg-[#000000] text-[#C9A24A] h-6 w-6 flex items-center justify-center rounded-full text-[9px] font-bold">IG</div>
            <div className="bg-[#000000] text-[#C9A24A] h-6 w-6 flex items-center justify-center rounded-full text-[9px] font-bold">FB</div>
            <div className="bg-[#000000] text-[#C9A24A] h-6 w-6 flex items-center justify-center rounded-full text-[9px] font-bold">WA</div>
          </div>
        </div>

        {/* Thank You */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
          <div className={`text-3xl text-[#C9A24A] mb-1 ${greatVibes.className}`}>
            Thank You! ♡
          </div>
          <div className="text-[9px] sm:text-[10px] text-[#525252] leading-tight">
            We truly appreciate your support.<br/>We look forward to seeing you again!
          </div>
        </div>
      </div>

      {/* Bottom Black Bar */}
      <div className={`absolute bottom-0 left-0 right-0 bg-[#000000] py-1 sm:py-1.5 text-center text-[#C9A24A] text-[7px] sm:text-[8px] tracking-[0.2em] uppercase flex items-center justify-center gap-2 sm:gap-4 ${montserrat.className}`}>
        <span>♥</span>
        <span>STYLE IS A REFLECTION OF YOUR ATTITUDE</span>
        <span>♥</span>
      </div>
    </div>
  );
}

