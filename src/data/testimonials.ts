export interface Testimonial {
  id: string;
  name: string;
  branch: string;
  rating: number;
  quote: string;
  avatar: string;
}

export const testimonials: Testimonial[] = [
  { id: "t1", name: "Ngozi Adeyemi", branch: "Abuja", rating: 5, quote: "The jollof rice tastes just like home. Delivery was fast and the packaging was neat and sealed properly.", avatar: "/images/testimonials/ngozi.jpg" },
  { id: "t2", name: "Tunde Bakare", branch: "Lagos", rating: 5, quote: "Booked the event hall for my daughter's wedding. The team handled catering, decoration and the cake — everything was seamless.", avatar: "/images/testimonials/tunde.jpg" },
  { id: "t3", name: "Chiamaka Obi", branch: "Lagos", rating: 5, quote: "My custom cake came out even better than the picture I uploaded. The bakery manager kept me updated throughout.", avatar: "/images/testimonials/chiamaka.jpg" },
  { id: "t4", name: "Ibrahim Musa", branch: "Abuja", rating: 4, quote: "I subscribed to the weekly meal plan and it has saved me so much time during the work week.", avatar: "/images/testimonials/ibrahim.jpg" },
  { id: "t5", name: "Blessing Etim", branch: "Badagry", rating: 5, quote: "Small chops for our office event arrived hot and fresh. Will definitely order again for our next event.", avatar: "/images/testimonials/blessing.jpg" },
  { id: "t6", name: "Femi Oladapo", branch: "Lagos", rating: 5, quote: "The cooking academy weekend class was worth every naira. I learned to make three new soups.", avatar: "/images/testimonials/femi.jpg" },
];
