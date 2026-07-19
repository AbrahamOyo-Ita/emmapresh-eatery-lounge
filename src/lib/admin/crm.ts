import type { AcademyApplication, CateringRequest, CustomCakeRequest, HallEnquiry, Order, Reservation } from "@/types";
import type { CrmDeal, CrmNote, CrmProfileOverride, CrmStage, CrmTask } from "@/stores/crm-store";

export interface CrmCustomer {
  name: string;
  email: string;
  phone: string;
  stage: CrmStage;
  tags: string[];
  owner: string;
  orderCount: number;
  totalSpend: number;
  lastActivityAt?: string;
  openTasks: number;
  dealValue: number;
  interactions: Array<{ id: string; type: string; title: string; meta: string; createdAt: string; status?: string }>;
}

interface BuildCrmInput {
  orders: Order[];
  catering: CateringRequest[];
  cakes: CustomCakeRequest[];
  academy: AcademyApplication[];
  halls: HallEnquiry[];
  reservations: Reservation[];
  overrides: CrmProfileOverride[];
  notes: CrmNote[];
  tasks: CrmTask[];
  deals: CrmDeal[];
}

function baseStage(orderCount: number, totalSpend: number): CrmStage {
  if (totalSpend >= 500000) return "vip";
  if (orderCount >= 3) return "active";
  return "new";
}

function ensureCustomer(map: Map<string, CrmCustomer>, email: string, name: string, phone: string) {
  const existing = map.get(email);
  if (existing) return existing;
  const customer: CrmCustomer = {
    name,
    email,
    phone,
    stage: "new",
    tags: [],
    owner: "Unassigned",
    orderCount: 0,
    totalSpend: 0,
    openTasks: 0,
    dealValue: 0,
    interactions: [],
  };
  map.set(email, customer);
  return customer;
}

export function buildCrmCustomers(input: BuildCrmInput) {
  const map = new Map<string, CrmCustomer>();

  input.orders.forEach((order) => {
    const customer = ensureCustomer(map, order.customer.email, order.customer.name, order.customer.phone);
    customer.orderCount += 1;
    customer.totalSpend += order.total;
    customer.interactions.push({
      id: order.reference,
      type: "Food order",
      title: order.reference,
      meta: `${order.items.length} items`,
      createdAt: order.createdAt,
      status: order.status,
    });
  });

  input.catering.forEach((request) => {
    const customer = ensureCustomer(map, request.email, request.customerName, request.phone);
    customer.tags = Array.from(new Set([...customer.tags, "catering"]));
    customer.interactions.push({ id: request.id, type: "Catering", title: request.reference, meta: `${request.guestCount} guests`, createdAt: request.createdAt, status: request.status });
  });

  input.cakes.forEach((request) => {
    const customer = ensureCustomer(map, request.email, request.customerName, request.phone);
    customer.tags = Array.from(new Set([...customer.tags, "cakes"]));
    customer.interactions.push({ id: request.id, type: "Cake", title: request.reference, meta: request.eventType, createdAt: request.createdAt, status: request.status });
  });

  input.academy.forEach((application) => {
    const customer = ensureCustomer(map, application.email, application.applicantName, application.phone);
    customer.tags = Array.from(new Set([...customer.tags, "academy"]));
    customer.interactions.push({ id: application.id, type: "Academy", title: application.reference, meta: application.preferredSchedule, createdAt: application.createdAt, status: application.status });
  });

  input.halls.forEach((enquiry) => {
    const customer = ensureCustomer(map, enquiry.email, enquiry.customerName, enquiry.phone);
    customer.tags = Array.from(new Set([...customer.tags, "events"]));
    customer.interactions.push({ id: enquiry.id, type: "Hall", title: enquiry.reference, meta: `${enquiry.guestCount} guests`, createdAt: enquiry.createdAt, status: enquiry.status });
  });

  input.reservations.forEach((reservation) => {
    const customer = ensureCustomer(map, reservation.email, reservation.customerName, reservation.phone);
    customer.interactions.push({ id: reservation.id, type: "Reservation", title: reservation.reference, meta: `${reservation.guestCount} guests`, createdAt: reservation.createdAt, status: reservation.status });
  });

  input.notes.forEach((note) => {
    const customer = map.get(note.customerEmail);
    customer?.interactions.push({ id: note.id, type: "Note", title: note.body, meta: note.author, createdAt: note.createdAt });
  });

  input.tasks.forEach((task) => {
    const customer = map.get(task.customerEmail);
    if (!customer) return;
    if (task.status === "open") customer.openTasks += 1;
    customer.interactions.push({ id: task.id, type: "Task", title: task.title, meta: `Due ${task.dueDate}`, createdAt: task.createdAt, status: task.status });
  });

  input.deals.forEach((deal) => {
    const customer = map.get(deal.customerEmail);
    if (!customer) return;
    customer.dealValue += deal.value;
    customer.interactions.push({ id: deal.id, type: "Deal", title: deal.title, meta: String(deal.value), createdAt: deal.createdAt, status: deal.stage });
  });

  const overrides = new Map(input.overrides.map((override) => [override.email, override]));
  return [...map.values()]
    .map((customer) => {
      const lastActivity = customer.interactions.sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
      const override = overrides.get(customer.email);
      return {
        ...customer,
        stage: override?.stage ?? baseStage(customer.orderCount, customer.totalSpend),
        tags: Array.from(new Set([...(customer.tags ?? []), ...(override?.tags ?? [])])),
        owner: override?.owner ?? customer.owner,
        lastActivityAt: lastActivity?.createdAt,
      };
    })
    .sort((a, b) => b.totalSpend + b.dealValue - (a.totalSpend + a.dealValue));
}
