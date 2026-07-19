import type {
  AcademyApplication,
  AcademyCourse,
  Branch,
  Cake,
  CateringPackage,
  CateringRequest,
  CustomCakeRequest,
  Hall,
  HallEnquiry,
  MenuCategory,
  MenuItem,
  Order,
  Reservation,
} from "@/types";
import type { MealPlanSubscription } from "@/stores/meal-plans-store";
import type { ContactMessage } from "@/stores/contact-store";

// Supabase row payloads contain JSON columns with table-specific shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

export function branchFromRow(row: Row): Branch {
  return {
    slug: row.slug,
    name: row.name,
    city: row.city,
    state: row.state,
    address: row.address,
    phone: row.phone,
    whatsapp: row.whatsapp,
    email: row.email,
    image: row.image,
    gallery: row.gallery ?? [],
    openingHours: row.opening_hours ?? [],
    deliveryFee: Number(row.delivery_fee ?? 0),
    freeDeliveryThreshold: Number(row.free_delivery_threshold ?? 0),
    hasEventHall: Boolean(row.has_event_hall),
    hasCatering: Boolean(row.has_catering),
    hasBakery: Boolean(row.has_bakery),
    hasAcademy: Boolean(row.has_academy),
    bankAccount: row.bank_account,
    mapEmbedUrl: row.map_embed_url ?? undefined,
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
  };
}

export function menuCategoryFromRow(row: Row): MenuCategory {
  return { slug: row.slug, name: row.name, description: row.description, image: row.image, group: row.group };
}

export function menuItemFromRow(row: Row): MenuItem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    categorySlug: row.category_slug,
    image: row.image,
    gallery: row.gallery ?? [],
    price: Number(row.price ?? 0),
    branchPrices: row.branch_prices ?? {},
    branchAvailability: row.branch_availability ?? [],
    rating: Number(row.rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
    prepTimeMinutes: Number(row.prep_time_minutes ?? 0),
    dietaryLabels: row.dietary_labels ?? [],
    ingredients: row.ingredients ?? [],
    allergens: row.allergens ?? [],
    optionGroups: row.option_groups ?? [],
    stockStatus: row.stock_status,
    isPopular: Boolean(row.is_popular),
    isNew: Boolean(row.is_new),
    requiresAgeConfirmation: Boolean(row.requires_age_confirmation),
  };
}

export function cakeFromRow(row: Row): Cake {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    gallery: row.gallery ?? [],
    price: Number(row.price ?? 0),
    sizeLabel: row.size_label,
    flavour: row.flavour,
    occasion: row.occasion,
    branchAvailability: row.branch_availability ?? [],
    quantityAvailable: Number(row.quantity_available ?? 0),
    sameDayPickup: Boolean(row.same_day_pickup),
    rating: Number(row.rating ?? 0),
  };
}

export function cateringPackageFromRow(row: Row): CateringPackage {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    image: row.image,
    startingPricePerHead: Number(row.starting_price_per_head ?? 0),
    minGuests: Number(row.min_guests ?? 0),
    cateringTypes: row.catering_types ?? [],
    includes: row.includes ?? [],
  };
}

export function academyCourseFromRow(row: Row): AcademyCourse {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    track: row.track,
    description: row.description,
    image: row.image,
    instructor: row.instructor,
    durationWeeks: Number(row.duration_weeks ?? 0),
    schedule: row.schedule,
    branchSlug: row.branch_slug,
    deliveryFormat: row.delivery_format,
    fee: Number(row.fee ?? 0),
    depositRequired: Number(row.deposit_required ?? 0),
    availableSeats: Number(row.available_seats ?? 0),
    modules: row.modules ?? [],
    certificateAwarded: Boolean(row.certificate_awarded),
  };
}

export function hallFromRow(row: Row): Hall {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    branchSlug: row.branch_slug,
    image: row.image,
    gallery: row.gallery ?? [],
    capacity: row.capacity,
    facilities: row.facilities ?? [],
    startingPrice: Number(row.starting_price ?? 0),
    description: row.description,
  };
}

export function orderFromRow(row: Row): Order {
  return {
    reference: row.reference,
    branchSlug: row.branch_slug,
    items: row.items ?? [],
    customer: row.customer,
    fulfilmentMethod: row.fulfilment_method,
    delivery: row.delivery ?? undefined,
    requestedTime: row.requested_time ?? undefined,
    subtotal: Number(row.subtotal ?? 0),
    deliveryFee: Number(row.delivery_fee ?? 0),
    serviceCharge: Number(row.service_charge ?? 0),
    discount: Number(row.discount ?? 0),
    total: Number(row.total ?? 0),
    payment: row.payment,
    status: row.status,
    statusHistory: row.status_history ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    internalNotes: row.internal_notes ?? undefined,
  };
}

export function orderToRow(order: Order) {
  return {
    reference: order.reference,
    branch_slug: order.branchSlug,
    items: order.items,
    customer: order.customer,
    fulfilment_method: order.fulfilmentMethod,
    delivery: order.delivery,
    requested_time: order.requestedTime === "As soon as possible" ? null : order.requestedTime || null,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    service_charge: order.serviceCharge,
    discount: order.discount,
    total: order.total,
    payment: order.payment,
    status: order.status,
    status_history: order.statusHistory,
    internal_notes: order.internalNotes,
    created_at: order.createdAt,
    updated_at: order.updatedAt,
  };
}

export function cateringRequestFromRow(row: Row): CateringRequest {
  return {
    id: row.id,
    reference: row.reference,
    branchSlug: row.branch_slug,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    cateringType: row.catering_type,
    eventDate: row.event_date,
    startTime: row.start_time,
    endTime: row.end_time,
    eventLocation: row.event_location,
    guestCount: Number(row.guest_count ?? 0),
    preferredDishes: row.preferred_dishes ?? undefined,
    serviceStyle: row.service_style,
    drinksRequired: Boolean(row.drinks_required),
    serversRequired: Boolean(row.servers_required),
    equipmentRequired: Boolean(row.equipment_required),
    decorationRequired: Boolean(row.decoration_required),
    budgetRange: row.budget_range,
    additionalInfo: row.additional_info ?? undefined,
    status: row.status,
    quotedAmount: row.quoted_amount == null ? undefined : Number(row.quoted_amount),
    createdAt: row.created_at,
  };
}

export function cateringRequestToRow(request: CateringRequest) {
  return {
    id: request.id,
    reference: request.reference,
    branch_slug: request.branchSlug,
    customer_name: request.customerName,
    phone: request.phone,
    email: request.email,
    catering_type: request.cateringType,
    event_date: request.eventDate,
    start_time: request.startTime,
    end_time: request.endTime,
    event_location: request.eventLocation,
    guest_count: request.guestCount,
    preferred_dishes: request.preferredDishes,
    service_style: request.serviceStyle,
    drinks_required: request.drinksRequired,
    servers_required: request.serversRequired,
    equipment_required: request.equipmentRequired,
    decoration_required: request.decorationRequired,
    budget_range: request.budgetRange,
    additional_info: request.additionalInfo,
    status: request.status,
    quoted_amount: request.quotedAmount,
    created_at: request.createdAt,
  };
}

export function cakeRequestFromRow(row: Row): CustomCakeRequest {
  return {
    id: row.id,
    reference: row.reference,
    branchSlug: row.branch_slug,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    eventType: row.event_type,
    eventDate: row.event_date,
    requiredDate: row.required_date,
    sizeLabel: row.size_label,
    layers: Number(row.layers ?? 0),
    flavour: row.flavour,
    colour: row.colour,
    shape: row.shape,
    theme: row.theme ?? undefined,
    inscription: row.inscription ?? undefined,
    dietaryRequirements: row.dietary_requirements ?? undefined,
    budgetRange: row.budget_range,
    fulfilmentMethod: row.fulfilment_method,
    deliveryAddress: row.delivery_address ?? undefined,
    additionalNotes: row.additional_notes ?? undefined,
    referenceImages: row.reference_images ?? [],
    status: row.status,
    quotedAmount: row.quoted_amount == null ? undefined : Number(row.quoted_amount),
    createdAt: row.created_at,
  };
}

export function cakeRequestToRow(request: CustomCakeRequest) {
  return {
    id: request.id,
    reference: request.reference,
    branch_slug: request.branchSlug,
    customer_name: request.customerName,
    phone: request.phone,
    email: request.email,
    event_type: request.eventType,
    event_date: request.eventDate,
    required_date: request.requiredDate,
    size_label: request.sizeLabel,
    layers: request.layers,
    flavour: request.flavour,
    colour: request.colour,
    shape: request.shape,
    theme: request.theme,
    inscription: request.inscription,
    dietary_requirements: request.dietaryRequirements,
    budget_range: request.budgetRange,
    fulfilment_method: request.fulfilmentMethod,
    delivery_address: request.deliveryAddress,
    additional_notes: request.additionalNotes,
    reference_images: request.referenceImages,
    status: request.status,
    quoted_amount: request.quotedAmount,
    created_at: request.createdAt,
  };
}

export function academyApplicationFromRow(row: Row): AcademyApplication {
  return {
    id: row.id,
    reference: row.reference,
    courseId: row.course_id,
    applicantName: row.applicant_name,
    phone: row.phone,
    email: row.email,
    preferredSchedule: row.preferred_schedule,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function academyApplicationToRow(application: AcademyApplication) {
  return {
    id: application.id,
    reference: application.reference,
    course_id: application.courseId,
    applicant_name: application.applicantName,
    phone: application.phone,
    email: application.email,
    preferred_schedule: application.preferredSchedule,
    status: application.status,
    created_at: application.createdAt,
  };
}

export function hallEnquiryFromRow(row: Row): HallEnquiry {
  return {
    id: row.id,
    reference: row.reference,
    hallId: row.hall_id,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    eventType: row.event_type,
    eventDate: row.event_date,
    alternativeDate: row.alternative_date ?? undefined,
    guestCount: Number(row.guest_count ?? 0),
    status: row.status,
    createdAt: row.created_at,
  };
}

export function hallEnquiryToRow(enquiry: HallEnquiry) {
  return {
    id: enquiry.id,
    reference: enquiry.reference,
    hall_id: enquiry.hallId,
    customer_name: enquiry.customerName,
    phone: enquiry.phone,
    email: enquiry.email,
    event_type: enquiry.eventType,
    event_date: enquiry.eventDate,
    alternative_date: enquiry.alternativeDate,
    guest_count: enquiry.guestCount,
    status: enquiry.status,
    created_at: enquiry.createdAt,
  };
}

export function reservationFromRow(row: Row): Reservation {
  return {
    id: row.id,
    reference: row.reference,
    branchSlug: row.branch_slug,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    date: row.date,
    time: row.time,
    guestCount: Number(row.guest_count ?? 0),
    seating: row.seating,
    occasion: row.occasion ?? undefined,
    specialRequests: row.special_requests ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function reservationToRow(reservation: Reservation) {
  return {
    id: reservation.id,
    reference: reservation.reference,
    branch_slug: reservation.branchSlug,
    customer_name: reservation.customerName,
    phone: reservation.phone,
    email: reservation.email,
    date: reservation.date,
    time: reservation.time,
    guest_count: reservation.guestCount,
    seating: reservation.seating,
    occasion: reservation.occasion,
    special_requests: reservation.specialRequests,
    status: reservation.status,
    created_at: reservation.createdAt,
  };
}

export function mealPlanToRow(subscription: MealPlanSubscription) {
  return {
    id: subscription.id,
    reference: subscription.reference,
    branch_slug: subscription.branchSlug,
    customer_name: subscription.customerName,
    phone: subscription.phone,
    email: subscription.email,
    meals_per_week: subscription.mealsPerWeek,
    preferred_days: subscription.preferredDays,
    budget_range: subscription.budgetRange,
    allergies: subscription.allergies,
    status: subscription.status,
    created_at: subscription.createdAt,
  };
}

export function mealPlanFromRow(row: Row): MealPlanSubscription {
  return {
    id: row.id,
    reference: row.reference,
    branchSlug: row.branch_slug,
    customerName: row.customer_name,
    phone: row.phone,
    email: row.email,
    mealsPerWeek: Number(row.meals_per_week ?? 0),
    preferredDays: row.preferred_days,
    budgetRange: row.budget_range,
    allergies: row.allergies ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function contactToRow(message: ContactMessage) {
  return {
    id: message.id,
    name: message.name,
    email: message.email,
    subject: message.subject,
    message: message.message,
    created_at: message.createdAt,
  };
}

export function contactFromRow(row: Row): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    subject: row.subject,
    message: row.message,
    createdAt: row.created_at,
  };
}
