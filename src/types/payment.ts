export type PaymentMethod = "bank-transfer" | "pay-on-delivery" | "pay-at-pickup";

export type PaymentStatus =
  | "awaiting-payment"
  | "payment-submitted"
  | "payment-under-review"
  | "payment-verified"
  | "payment-rejected"
  | "partial-payment"
  | "refunded";

export interface PaymentReceipt {
  fileName: string;
  fileType: string;
  fileSizeBytes: number;
  dataUrl?: string;
  url?: string;
  storagePath?: string;
  uploadedAt: string;
}

export interface PaymentVerification {
  verifiedBy?: string;
  verifiedAt?: string;
  amountReceived?: number;
  paymentReference?: string;
  paymentDate?: string;
  note?: string;
  rejectionReason?: string;
}

export interface Payment {
  method: PaymentMethod;
  status: PaymentStatus;
  amountExpected: number;
  receipt?: PaymentReceipt;
  verification?: PaymentVerification;
}
