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
      className={`w-full max-w-[800px] mx-auto bg-white p-3 sm:p-4 shadow-2xl relative print:p-0 print:shadow-none print:w-full print:max-w-none ${poppins.className} text-black`}
    >
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#C9A24A]" />

      {/* HEADER */}
      <div className="flex flex-col items-center justify-center gap-2 mt-2 text-center w-full">
        {/* Logo Box */}
        <div className="bg-black rounded-lg p-2 border-[1px] border-[#C9A24A] flex flex-col items-center justify-center w-[120px] h-[120px] shrink-0">
          <img src="/salon-logo.png" alt="Logo" width={60} height={45} className="object-contain" />
          <div className={`text-center mt-1 text-[#C9A24A] uppercase leading-tight ${playfair.className}`}>
            <div className="text-[11px] font-bold">NEW DUKE & DUCHESS</div>
            <div className="text-[8px] tracking-widest mt-0.5">UNISEX SALON</div>
            <div className="text-[10px] mt-0.5">≽ܫ≼</div>
          </div>
        </div>

        {/* Address Section */}
        <div className="flex flex-col items-center justify-center w-full mt-1">
          <h1 className={`text-2xl sm:text-[32px] leading-none font-semibold tracking-[0.02em] text-black uppercase ${playfair.className}`}>
            NEW DUKE & DUCHESS
          </h1>
          <div className={`flex items-center gap-2 my-1.5 justify-center ${montserrat.className}`}>
            <div className="h-[1px] w-12 bg-[#C9A24A]"></div>
            <span className="text-[#C9A24A] tracking-[0.25em] font-medium uppercase text-[10px] sm:text-xs whitespace-nowrap">UNISEX SALON</span>
            <div className="h-[1px] w-12 bg-[#C9A24A]"></div>
          </div>
          
          <div className={`space-y-1 mt-1 text-[11px] sm:text-[11px] text-[#404040] flex flex-col items-center ${poppins.className}`}>
            <div className="flex items-start gap-1.5 justify-center">
              <MapPin className="h-3.5 w-3.5 text-black shrink-0 mt-0.5" />
              <p className="leading-snug">
                07, Krishna Garden Main Rd, Near New Happy Home,<br/>
                Balarama Layout, Rajarajeshwari Nagar, Bengaluru, Karnataka 560098
              </p>
            </div>
            <div className="flex items-center gap-1.5 justify-center">
              <Phone className="h-3.5 w-3.5 text-black shrink-0" />
              <p>+91 89047 10353</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#C9A24A] my-2.5 sm:my-3" />

      {/* DETAILS SECTION */}
      <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 ${poppins.className}`}>
        {/* Invoice Details */}
        <div className="flex-1">
          <div className={`flex items-center gap-1.5 text-[#C9A24A] mb-1.5 font-bold tracking-wide ${montserrat.className}`}>
            <FileText className="h-3.5 w-3.5" />
            <span className="text-[10px] sm:text-[11px] uppercase">INVOICE DETAILS</span>
          </div>
          <div className="grid grid-cols-[80px_1fr] sm:grid-cols-[90px_1fr] gap-y-0.5 text-[10px] sm:text-[11px]">
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
          </div>
        </div>

        <div className="hidden sm:block w-[1px] bg-[#C9A24A] min-h-[60px]" />
        <div className="block sm:hidden w-full h-[1px] bg-[#e5e5e5]" />

        {/* Bill To */}
        <div className="flex-1">
          <div className={`flex items-center gap-1.5 text-[#C9A24A] mb-1.5 font-bold tracking-wide ${montserrat.className}`}>
            <User className="h-3.5 w-3.5" />
            <span className="text-[10px] sm:text-[11px] uppercase">BILL TO</span>
          </div>
          <div className="text-xs sm:text-[13px] font-semibold mb-0.5">
            {invoice.customer?.name || "Customer"}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
              <Phone className="h-3 w-3 text-[#C9A24A]" />
              <span>{invoice.customer?.phone || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#C9A24A] my-2.5 sm:my-3" />

      {/* SERVICES TABLE */}
      {services.length > 0 && (
        <div className="mb-2 sm:mb-3">
          <div className={`flex items-center gap-1 text-[#C9A24A] mb-1 font-bold tracking-wide ${montserrat.className}`}>
            <Scissors className="h-3 w-3" />
            <span className="text-[10px] sm:text-[11px] uppercase">SERVICES</span>
          </div>
          <div className={`w-full border-[1px] border-[#C9A24A] rounded-md overflow-hidden ${poppins.className}`}>
            <table className="w-full text-[9px] sm:text-[10px] table-auto border-collapse">
              <thead>
                <tr className={`bg-black text-[#C9A24A] ${montserrat.className}`}>
                  <th className="py-1 px-1.5 sm:px-2 text-left font-semibold w-[45%]">DESCRIPTION</th>
                  <th className="py-1 px-1 text-center font-semibold">STYLIST</th>
                  <th className="py-1 px-1 text-center font-semibold">QTY</th>
                  <th className="py-1 px-1 text-right font-semibold whitespace-nowrap">RATE (₹)</th>
                  <th className="py-1 px-1.5 sm:px-2 text-right font-semibold whitespace-nowrap">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {services.map((item: any, idx: number) => {
                  const displayName = item.notes ? `${item.name} (${item.notes})` : item.name;
                  const isLast = idx === services.length - 1;
                  return (
                    <tr key={idx} className={`${!isLast ? 'border-b-[1px] border-[#e5e5e5]' : ''}`}>
                      <td className="py-1 px-1.5 sm:px-2 text-[#262626] break-words">{displayName}</td>
                      <td className="py-1 px-1 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                      <td className="py-1 px-1 text-center text-[#262626]">{item.quantity}</td>
                      <td className="py-1 px-1 text-right text-[#262626] whitespace-nowrap">{formatCurrency(item.price)}</td>
                      <td className="py-1 px-1.5 sm:px-2 text-right font-semibold text-black whitespace-nowrap">{formatCurrency(item.total)}</td>
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
        <div className="mb-2 sm:mb-3">
          <div className={`flex items-center gap-1 text-[#C9A24A] mb-1 font-bold tracking-wide ${montserrat.className}`}>
            <div className="flex gap-[1px] mt-[1px]">
              <div className="w-[3px] h-2 bg-[#C9A24A] rounded-t-[1px]" />
              <div className="w-[3px] h-2 bg-[#C9A24A] rounded-t-[1px]" />
            </div>
            <span className="text-[10px] sm:text-[11px] uppercase">PRODUCTS</span>
          </div>
          <div className={`w-full border-[1px] border-[#C9A24A] rounded-md overflow-hidden ${poppins.className}`}>
            <table className="w-full text-[9px] sm:text-[10px] table-auto border-collapse">
              <thead>
                <tr className={`bg-black text-[#C9A24A] ${montserrat.className}`}>
                  <th className="py-1 px-1.5 sm:px-2 text-left font-semibold w-[45%]">DESCRIPTION</th>
                  <th className="py-1 px-1 text-center font-semibold">STYLIST</th>
                  <th className="py-1 px-1 text-center font-semibold">QTY</th>
                  <th className="py-1 px-1 text-right font-semibold whitespace-nowrap">RATE (₹)</th>
                  <th className="py-1 px-1.5 sm:px-2 text-right font-semibold whitespace-nowrap">AMOUNT (₹)</th>
                </tr>
              </thead>
              <tbody>
                {products.map((item: any, idx: number) => {
                  const isLast = idx === products.length - 1;
                  return (
                    <tr key={idx} className={`${!isLast ? 'border-b-[1px] border-[#e5e5e5]' : ''}`}>
                      <td className="py-1 px-1.5 sm:px-2 text-[#262626] break-words">{item.name}</td>
                      <td className="py-1 px-1 text-center text-[#525252]">{item.staffCode || item.staffName || "-"}</td>
                      <td className="py-1 px-1 text-center text-[#262626]">{item.quantity}</td>
                      <td className="py-1 px-1 text-right text-[#262626] whitespace-nowrap">{formatCurrency(item.price)}</td>
                      <td className="py-1 px-1.5 sm:px-2 text-right font-semibold text-black whitespace-nowrap">{formatCurrency(item.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUMMARY SECTION */}
      <div className={`flex flex-col sm:flex-row gap-3 mt-3 sm:mt-4 items-stretch ${poppins.className}`}>
        {/* You Saved Box */}
        {Number(invoice.discount) > 0 || Number(invoice.membershipDiscount) > 0 || Number(invoice.couponDiscount) > 0 ? (
          <div className="flex-1 border-[1px] border-[#C9A24A] rounded-md p-2.5 sm:p-3 flex flex-col justify-center bg-white shadow-sm">
            <div className="flex flex-row items-center gap-3 w-full justify-center">
              <div className="bg-black text-[#C9A24A] p-2.5 rounded-full shrink-0 flex items-center justify-center">
                <Star className="h-6 w-6 fill-current" />
              </div>
              <div className="flex flex-col text-left">
                <div className={`text-[#C9A24A] font-bold tracking-widest text-[9px] uppercase ${montserrat.className}`}>YOU SAVED</div>
                <div className="text-xl sm:text-2xl font-black mt-0 text-black leading-tight">
                  ₹{formatCurrency((Number(invoice.discount) || 0) + (Number(invoice.membershipDiscount) || 0) + (Number(invoice.couponDiscount) || 0))}
                </div>
              </div>
            </div>
            <div className={`mt-2 text-sm text-[#525252] text-center w-full pt-1 border-t-[1px] border-[#e5e5e5] ${greatVibes.className}`}>
              Thank you for saving with us!
            </div>
          </div>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}

        {/* Totals */}
        <div className="flex-1 w-full sm:w-auto border-[1px] border-[#C9A24A] rounded-md overflow-hidden flex flex-col justify-between min-w-[260px]">
          <div className="p-2 space-y-0.5 text-[10px] sm:text-[11px] bg-white flex-1 flex flex-col justify-center">
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
                <div className="w-full h-[1px] bg-[#e5e5e5] my-1"></div>
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
          <div className={`bg-black text-[#C9A24A] py-1.5 px-2.5 sm:px-3 flex justify-between items-center shrink-0 ${montserrat.className}`}>
            <span className="tracking-widest text-[9px] sm:text-[10px] font-bold uppercase">TOTAL PAYABLE</span>
            <span className="text-lg sm:text-xl font-black tracking-wide">₹ {formatCurrency(invoice.total)}</span>
          </div>
        </div>
      </div>

      {/* PAYMENT SUCCESSFUL BANNER */}
      <div className={`mt-3 border-[1px] border-[#C9A24A] bg-white rounded p-1.5 flex flex-row items-center justify-center gap-2 text-center shadow-sm ${poppins.className}`}>
        <div className="bg-[#C9A24A] text-white rounded-full p-0.5 shrink-0 flex items-center justify-center">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </div>
        <div className="flex flex-row items-center gap-1.5 flex-wrap justify-center">
          <div className={`font-bold text-black tracking-wider text-[10px] sm:text-xs ${montserrat.className}`}>PAYMENT SUCCESSFUL</div>
          <div className="text-[#C9A24A] font-bold text-xs hidden sm:block">|</div>
          <div className="text-[10px] sm:text-[11px] text-[#525252]">Paid via {invoice.paymentMethod?.toUpperCase() || 'CASH'} &nbsp; Thank you for your payment.</div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#C9A24A] mt-4 sm:mt-5 mb-3" />

      {/* FOOTER */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 px-1 pb-8 items-center ${poppins.className}`}>
        {/* QR Code Section */}
        <div className="flex flex-row items-center justify-center sm:justify-start gap-3 text-left w-full">
          <div className="w-[75px] h-[75px] bg-white rounded-sm flex flex-col items-center justify-center p-0.5 border-[1px] border-[#C9A24A] shrink-0 overflow-hidden">
             <img src="/qr-code.png" alt="Google Review QR Code" className="w-full h-full object-contain" />
          </div>
          <div className="space-y-0.5">
            <div className={`text-[#C9A24A] font-bold text-[9px] uppercase tracking-widest ${montserrat.className}`}>LOVE OUR SERVICE?</div>
            <div className="text-[10px] text-[#525252] leading-tight mb-1">Scan to leave us a<br/>Google Review</div>
            <div className="flex gap-1 text-[#C9A24A]">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
          </div>
        </div>

        {/* Social Follow */}
        <div className="flex flex-col items-center justify-center space-y-1.5 sm:border-l-[1px] sm:border-r-[1px] border-[#e5e5e5] h-full py-1 w-full">
          <div className={`text-[#C9A24A] font-bold text-[9px] uppercase tracking-widest ${montserrat.className}`}>FOLLOW US</div>
          <div className="flex justify-center gap-3">
            {/* Instagram */}
            <div className="bg-black text-[#ffffff] h-8 w-8 flex items-center justify-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
            {/* Facebook */}
            <div className="bg-black text-[#ffffff] h-8 w-8 flex items-center justify-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </div>
            {/* WhatsApp */}
            <div className="bg-black text-[#ffffff] h-8 w-8 flex items-center justify-center rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Thank You */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right h-full justify-center w-full">
          <div className={`text-[34px] sm:text-[38px] text-[#C9A24A] mb-0 leading-none ${greatVibes.className}`}>
            Thank You! ♡
          </div>
          <div className="text-[9px] sm:text-[10px] text-[#525252] leading-tight mt-1.5">
            Thank you for joining the New Duke & Duchess family ❤️ We truly appreciate your support and look forward to seeing you again! ⭐
          </div>
        </div>
      </div>

      {/* Bottom Black Bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-6 sm:h-7 bg-black text-[#C9A24A] text-[7px] sm:text-[8px] tracking-[0.25em] uppercase flex items-center justify-center gap-3 ${montserrat.className}`}>
        <span className="text-[8px] sm:text-[10px]">♥</span>
        <span className="border-t-[1px] border-[#C9A24A] w-6 sm:w-8"></span>
        <span>STYLE IS A REFLECTION OF YOUR ATTITUDE</span>
        <span className="border-t-[1px] border-[#C9A24A] w-6 sm:w-8"></span>
        <span className="text-[8px] sm:text-[10px]">♥</span>
      </div>
    </div>
  );
}

