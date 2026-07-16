export interface Promotion {
  id: string;
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
}

export const promotions: Promotion[] = [
  { id: "promo-1", title: "Free Delivery Weekend", description: "Free delivery on all orders above ₦25,000, Friday to Sunday.", code: "FREEWEEKEND", discount: "Free delivery", validUntil: "2026-08-31" },
  { id: "promo-2", title: "New Customer Discount", description: "15% off your first order when you sign up.", code: "WELCOME15", discount: "15% off", validUntil: "2026-12-31" },
  { id: "promo-3", title: "Family Combo Deal", description: "Order any family meal combo and get a free 2-litre drink.", code: "FAMILYDEAL", discount: "Free drink", validUntil: "2026-09-15" },
  { id: "promo-4", title: "Academy Early Bird", description: "10% off academy course fees when you apply 2 weeks before the start date.", code: "EARLYBIRD10", discount: "10% off", validUntil: "2026-10-01" },
  { id: "promo-5", title: "Cake Pre-Order Special", description: "5% off custom cake orders placed at least 7 days in advance.", code: "CAKEPLAN5", discount: "5% off", validUntil: "2026-12-31" },
  { id: "promo-6", title: "Corporate Catering Discount", description: "8% off catering bookings for corporate events above 100 guests.", code: "CORP100", discount: "8% off", validUntil: "2026-11-30" },
  { id: "promo-7", title: "Weekday Lunch Offer", description: "12% off all rice dishes ordered between 12pm–3pm on weekdays.", code: "LUNCH12", discount: "12% off", validUntil: "2026-09-30" },
  { id: "promo-8", title: "Refer a Friend", description: "Get ₦2,000 off your next order when a friend you refer places their first order.", code: "REFER2000", discount: "₦2,000 off", validUntil: "2026-12-31" },
];
