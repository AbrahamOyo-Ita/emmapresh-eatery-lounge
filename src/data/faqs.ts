export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: "ordering" | "payment" | "delivery" | "cakes" | "catering" | "academy" | "halls";
}

export const faqs: Faq[] = [
  { id: "f1", category: "payment", question: "How do I pay for my order?", answer: "We currently accept bank transfer. After checkout, you'll receive your branch's account details and a unique order reference to include in your transfer narration. Once you upload your receipt, our finance team verifies the payment against the account before your order is confirmed." },
  { id: "f2", category: "payment", question: "Is my order confirmed as soon as I upload a receipt?", answer: "No. Uploading a receipt marks your order as \"payment submitted.\" A finance officer verifies the transfer against the business account before your order moves to \"payment verified\" and enters preparation." },
  { id: "f3", category: "ordering", question: "Can I order without creating an account?", answer: "Yes. Guest checkout is fully supported. You can optionally create an account after checkout to track orders and save your details for next time." },
  { id: "f4", category: "delivery", question: "How long does delivery take?", answer: "Delivery times vary by branch and order type, typically between 35–70 minutes for food orders. Your estimated time is shown before you confirm your order." },
  { id: "f5", category: "delivery", question: "Do you deliver to every part of the city?", answer: "Delivery zones and fees vary by branch. Select your branch and delivery address at checkout to see if you're within our delivery area." },
  { id: "f6", category: "cakes", question: "How far in advance should I order a custom cake?", answer: "We recommend at least 5 days' notice for custom cakes and 14 days for wedding or multi-tier cakes. Same-day pickup is available on select ready-made cakes only." },
  { id: "f7", category: "cakes", question: "Can I upload a picture of the cake design I want?", answer: "Yes. Our custom cake request form allows you to upload reference images so our bakery team can quote and design accordingly." },
  { id: "f8", category: "catering", question: "What is the minimum guest count for catering?", answer: "Our catering packages typically start from 20 guests, though we can accommodate smaller private events on request — just include your guest count in the enquiry form." },
  { id: "f9", category: "catering", question: "Do you provide catering equipment and staff?", answer: "Yes, servers, buffet equipment, tables and chairs can all be requested in your catering enquiry. These are quoted separately based on your event size." },
  { id: "f10", category: "academy", question: "Do I get a certificate after completing an academy course?", answer: "Most cooking and baking academy courses award a certificate of completion. This is shown on each course's detail page." },
  { id: "f11", category: "academy", question: "Are academy classes available online?", answer: "Select courses offer a hybrid or fully online format. Check the delivery format on each course page before applying." },
  { id: "f12", category: "halls", question: "How do I check if an event hall is available on my date?", answer: "Submit a hall availability request with your preferred and alternative dates. Our hall manager will confirm availability and send a quotation." },
  { id: "f13", category: "ordering", question: "Can I order meals by litre for the whole week?", answer: "Yes — our Meals by Litre and Meal Plans pages let you choose quantities, delivery days, and recurring schedules suited to busy professionals and families." },
  { id: "f14", category: "delivery", question: "What happens if an item in my cart is unavailable at my new branch?", answer: "If you switch branches, we check your cart automatically. Unavailable items are clearly flagged so you can remove them or pick a suggested alternative — nothing is deleted silently." },
  { id: "f15", category: "payment", question: "What if I made a mistake in my transfer amount?", answer: "Our finance team reviews the exact amount received during verification. If there's a shortfall or overpayment, it will be marked accordingly and our support team will reach out to resolve it." },
];
