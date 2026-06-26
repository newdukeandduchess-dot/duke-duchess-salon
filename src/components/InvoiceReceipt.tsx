import React from "react";
import { Playfair_Display, Montserrat, Poppins, Great_Vibes } from "next/font/google";
import { MapPin, Phone, User, Scissors, Star, Check, FileText } from "lucide-react";

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
      className={`w-full max-w-[800px] mx-auto bg-[#ffffff] p-4 sm:p-5 shadow-2xl relative overflow-hidden print:p-0 print:shadow-none print:w-full print:max-w-none ${poppins.className}`}
      style={{ color: '#000000' }}
    >
      {/* Top gold border */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#C9A24A]" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-5 items-center justify-between mt-1">
        {/* Logo Box */}
        <div className="bg-[#000000] rounded-lg p-2 border border-[#C9A24A] flex flex-col items-center justify-center w-[130px] h-[130px] shrink-0">
          <img src="/salon-logo.png" alt="Logo" width={65} height={50} className="object-contain" />
          <div className={`text-center mt-1.5 text-[#C9A24A] uppercase leading-tight ${playfair.className}`}>
            <div className="text-xs font-bold">NEW DUKE & DUCHESS</div>
            <div className="text-[9px] tracking-widest mt-0.5">UNISEX SALON</div>
            <div className="text-xs mt-0.5">≽ܫ≼</div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex-1 text-center sm:text-left flex flex-col justify-center">
          <h1 className={`text-2xl sm:text-[34px] leading-tight font-black tracking-wider text-[#000000] uppercase whitespace-nowrap ${playfair.className}`}>
            NEW DUKE & DUCHESS
          </h1>
          <div className={`flex items-center gap-2 my-1 opacity-100 justify-center sm:justify-start ${montserrat.className}`}>
            <div className="h-[1px] w-8 sm:flex-1 bg-[#C9A24A]"></div>
            <span className="text-[#C9A24A] tracking-[0.3em] font-medium uppercase text-xs sm:text-sm whitespace-nowrap">UNISEX SALON</span>
            <div className="h-[1px] w-8 sm:flex-1 bg-[#C9A24A]"></div>
          </div>
          
          <div className={`space-y-1.5 mt-2.5 text-[11px] sm:text-xs text-[#404040] inline-block text-left ${poppins.className}`}>
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#000000] shrink-0 mt-0.5" />
              <p className="leading-snug">
                07, Krishna Garden Main Rd,<br/>
                Near New Happy Home, Balarama Layout,<br/>
                Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#000000] shrink-0" />
              <p>+91 89047 10353</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#C9A24A] my-3 sm:my-4" />

      {/* DETAILS SECTION */}
      <div className={`flex flex-col sm:flex-row gap-4 sm:gap-8 ${poppins.className}`}>
        {/* Invoice Details */}
        <div className="flex-1">
          <div className={`flex items-center gap-2 text-[#C9A24A] mb-2 font-bold tracking-wide ${montserrat.className}`}>
            <FileText className="h-4 w-4" />
            <span className="text-[11px] sm:text-xs uppercase">INVOICE DETAILS</span>
          </div>
          <div className="grid grid-cols-[90px_1fr] sm:grid-cols-[100px_1fr] gap-y-1 text-[11px] sm:text-xs">
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

        <div className="hidden sm:block w-[1px] bg-[#C9A24A] min-h-[70px]" />
        <div className="block sm:hidden w-full h-[1px] bg-[#f5f5f5]" />

        {/* Bill To */}
        <div className="flex-1">
          <div className={`flex items-center gap-2 text-[#C9A24A] mb-2 font-bold tracking-wide ${montserrat.className}`}>
            <User className="h-4 w-4" />
            <span className="text-[11px] sm:text-xs uppercase">BILL TO</span>
          </div>
          <div className="text-sm sm:text-[15px] font-semibold mb-1">
            {invoice.customer?.name || "Customer"}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs">
              <Phone className="h-3 w-3 text-[#C9A24A]" />
              <span>{invoice.customer?.phone || "-"}</span>
            </div>
            {invoice.customer?.membershipId && (
              <div className="flex items-center gap-2 text-[11px] sm:text-xs mt-1 text-[#525252]">
                <span className="font-medium text-[#C9A24A]">ID:</span>
                <span>{invoice.customer.membershipId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#C9A24A] my-3 sm:my-4" />

      {/* SERVICES TABLE */}
      {services.length > 0 && (
        <div className="mb-3 sm:mb-4">
          <div className={`flex items-center gap-1.5 text-[#C9A24A] mb-1.5 font-bold tracking-wide ${montserrat.className}`}>
            <Scissors className="h-3.5 w-3.5" />
            <span className="text-[11px] sm:text-xs uppercase">SERVICES</span>
          </div>
          <div className={`w-full border border-[#C9A24A] rounded-lg overflow-hidden ${poppins.className}`}>
            <table className="w-full text-[10px] sm:text-[11px] table-auto border-collapse">
              <thead>
                <tr className={`bg-[#000000] text-[#C9A24A] ${montserrat.className}`}>
                  <th className="py-1.5 px-2 sm:px-3 text-left font-semibold">DESCRIPTION</th>
                  <th className="py-1.5 px-1 sm:px-2 text-center font-semibold">STYLIST</th>
                  <th className="py-1.5 px-1 sm:px-2 text-center font-semibold">QTY</th>
                  <th className="py-1.5 px-1 sm:px-2 text-right font-semibold">RATE (₹)</th>
                  <th className="py-1.5 px-2 sm:px-3 text-right font-semibold">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item: any, idx: number) => {
                  const displayName = item.notes ? `${item.name} (${item.notes})` : item.name;
                  const isLast = idx === services.length - 1;
                  return (
                    <tr key={idx} className={`${!isLast ? 'border-b border-[#e5e5e5]' : ''}`}>
                      <td className="py-1.5 px-2 sm:px-3 text-[#262626] break-words">{displayName}</td>
                      <td className="py-1.5 px-1 sm:px-2 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                      <td className="py-1.5 px-1 sm:px-2 text-center text-[#262626]">{item.quantity}</td>
                      <td className="py-1.5 px-1 sm:px-2 text-right text-[#262626]">{formatCurrency(item.price)}</td>
                      <td className="py-1.5 px-2 sm:px-3 text-right font-semibold text-[#000000]">{formatCurrency(item.total)}</td>
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
        <div className="mb-3 sm:mb-4">
          <div className={`flex items-center gap-1.5 text-[#C9A24A] mb-1.5 font-bold tracking-wide ${montserrat.className}`}>
            <div className="flex gap-[1px] mt-0.5">
              <div className="w-1 h-2.5 bg-[#C9A24A] rounded-t-sm" />
              <div className="w-1 h-2.5 bg-[#C9A24A] rounded-t-sm" />
            </div>
            <span className="text-[11px] sm:text-xs uppercase">PRODUCTS</span>
          </div>
          <div className={`w-full border border-[#C9A24A] rounded-lg overflow-hidden ${poppins.className}`}>
            <table className="w-full text-[10px] sm:text-[11px] table-auto border-collapse">
              <thead>
                <tr className={`bg-[#000000] text-[#C9A24A] ${montserrat.className}`}>
                  <th className="py-1.5 px-2 sm:px-3 text-left font-semibold">DESCRIPTION</th>
                  <th className="py-1.5 px-1 sm:px-2 text-center font-semibold">STYLIST</th>
                  <th className="py-1.5 px-1 sm:px-2 text-center font-semibold">QTY</th>
                  <th className="py-1.5 px-1 sm:px-2 text-right font-semibold">RATE (₹)</th>
                  <th className="py-1.5 px-2 sm:px-3 text-right font-semibold">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any, idx: number) => {
                  const isLast = idx === products.length - 1;
                  return (
                    <tr key={idx} className={`${!isLast ? 'border-b border-[#e5e5e5]' : ''}`}>
                      <td className="py-1.5 px-2 sm:px-3 text-[#262626] break-words">{item.name}</td>
                      <td className="py-1.5 px-1 sm:px-2 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                      <td className="py-1.5 px-1 sm:px-2 text-center text-[#262626]">{item.quantity}</td>
                      <td className="py-1.5 px-1 sm:px-2 text-right text-[#262626]">{formatCurrency(item.price)}</td>
                      <td className="py-1.5 px-2 sm:px-3 text-right font-semibold text-[#000000]">{formatCurrency(item.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUMMARY SECTION */}
      <div className={`flex flex-col sm:flex-row gap-4 mt-4 sm:mt-5 items-start ${poppins.className}`}>
        {/* You Saved Box */}
        {Number(invoice.discount) > 0 || Number(invoice.membershipDiscount) > 0 || Number(invoice.couponDiscount) > 0 ? (
          <div className="flex-1 border border-[#C9A24A] rounded-lg p-3 sm:p-4 flex flex-col justify-between bg-[#ffffff] h-full shadow-sm">
            <div className="flex flex-row items-center gap-4 sm:gap-6 w-full justify-center">
              <div className="bg-[#000000] text-[#C9A24A] p-2.5 sm:p-3 rounded-full shrink-0 flex items-center justify-center">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 fill-current" />
              </div>
              <div className="flex flex-col text-center sm:text-left">
                <div className={`text-[#C9A24A] font-bold tracking-widest text-[10px] sm:text-xs uppercase ${montserrat.className}`}>YOU SAVED</div>
                <div className="text-xl sm:text-3xl font-black mt-0.5 text-[#000000] leading-none">
                  ₹{formatCurrency((Number(invoice.discount) || 0) + (Number(invoice.membershipDiscount) || 0) + (Number(invoice.couponDiscount) || 0))}
                </div>
              </div>
            </div>
            <div className={`mt-2 sm:mt-3 text-sm sm:text-lg text-[#525252] text-center sm:text-right w-full border-t border-[#e5e5e5] pt-2 ${greatVibes.className}`}>
              Thank you for saving with us!
            </div>
          </div>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}

        {/* Totals */}
        <div className="flex-1 w-full sm:w-auto border border-[#C9A24A] rounded-lg overflow-hidden flex flex-col justify-between self-end sm:self-auto min-w-[280px]">
          <div className="p-2 sm:p-3 space-y-1 sm:space-y-1.5 text-[11px] sm:text-xs bg-[#ffffff]">
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
                <div className="w-full h-[1px] bg-[#e5e5e5] my-0.5"></div>
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
          <div className={`bg-[#000000] text-[#C9A24A] py-1.5 px-3 sm:px-4 flex justify-between items-center ${montserrat.className}`}>
            <span className="tracking-widest text-[10px] sm:text-[11px] font-bold uppercase">TOTAL PAYABLE</span>
            <span className="text-lg sm:text-[22px] font-black tracking-wide">₹ {formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT SUCCESSFUL BANNER */}
      <div className={`mt-4 border border-[#C9A24A] bg-[#ffffff] rounded p-2.5 flex flex-row items-center justify-center gap-3 text-center shadow-sm ${poppins.className}`}>
        <div className="bg-[#C9A24A] text-[#ffffff] rounded-full p-1 shrink-0 flex items-center justify-center">
          <Check className="h-4 w-4" strokeWidth={3} />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
          <div className={`font-bold text-[#000000] tracking-wider text-xs sm:text-sm ${montserrat.className}`}>PAYMENT SUCCESSFUL</div>
          <div className="hidden sm:block text-[#C9A24A] font-bold">|</div>
          <div className="text-[11px] sm:text-xs text-[#525252]">Paid via {invoice.paymentMethod?.toUpperCase() || 'CASH'} &nbsp; Thank you for your payment.</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#C9A24A] mt-5 sm:mt-6 mb-4" />

      {/* FOOTER */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-4 px-2 sm:px-4 pb-4 sm:pb-6 items-center ${poppins.className}`}>
        {/* QR Code Section */}
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <div className="w-[70px] h-[70px] bg-[#f5f5f5] rounded-sm flex flex-col items-center justify-center p-1 border border-[#C9A24A] shrink-0">
             <div className="grid grid-cols-4 grid-rows-4 gap-[2px] w-full h-full opacity-70">
                {[...Array(16)].map((_, i) => (
                  <div key={i} className={`bg-[#000000] ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                ))}
             </div>
          </div>
          <div className="space-y-0.5">
            <div className={`text-[#C9A24A] font-bold text-[9px] uppercase tracking-widest ${montserrat.className}`}>LOVE OUR SERVICE?</div>
            <div className="text-[10px] text-[#525252] leading-tight mb-1">Scan to leave us a<br/> Google Review</div>
            <div className="flex gap-1 text-[#C9A24A]">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
            </div>
          </div>
        </div>

        {/* Social Follow */}
        <div className="flex flex-col items-center justify-center space-y-1.5 sm:border-l sm:border-r border-[#e5e5e5] py-2">
          <div className={`text-[#C9A24A] font-bold text-[9px] uppercase tracking-widest ${montserrat.className}`}>FOLLOW US</div>
          <div className="flex justify-center gap-3">
            <div className="bg-[#000000] text-[#C9A24A] h-7 w-7 flex items-center justify-center rounded-full text-[9px] font-bold">IG</div>
            <div className="bg-[#000000] text-[#C9A24A] h-7 w-7 flex items-center justify-center rounded-full text-[9px] font-bold">FB</div>
            <div className="bg-[#000000] text-[#C9A24A] h-7 w-7 flex items-center justify-center rounded-full text-[9px] font-bold">WA</div>
          </div>
        </div>

        {/* Thank You */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
          <div className={`text-[32px] sm:text-[38px] text-[#C9A24A] mb-0 ${greatVibes.className}`}>
            Thank You! ♡
          </div>
          <div className="text-[9px] sm:text-[10px] text-[#525252] leading-tight">
            We truly appreciate your support.<br/>We look forward to seeing you again!
          </div>
        </div>
      </div>

      {/* Bottom Black Bar */}
      <div className={`absolute bottom-0 left-0 right-0 bg-[#000000] py-1 text-center text-[#C9A24A] text-[7px] sm:text-[8px] tracking-[0.25em] uppercase flex items-center justify-center gap-3 ${montserrat.className}`}>
        <span className="text-[10px]">♥</span>
        <span className="border-t border-[#C9A24A] w-6 hidden sm:block"></span>
        <span>STYLE IS A REFLECTION OF YOUR ATTITUDE</span>
        <span className="border-t border-[#C9A24A] w-6 hidden sm:block"></span>
        <span className="text-[10px]">♥</span>
      </div>
    </div>
  );
}

