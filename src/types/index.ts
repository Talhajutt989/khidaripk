// ─────────────────────────────────────────────
// Kharidari.pk — Type Definitions
// Pakistan Multi-Vendor E-Commerce Platform
// ─────────────────────────────────────────────

export type Role = 'ADMIN' | 'VENDOR' | 'CUSTOMER';

export type PaymentMethod = 'COD' | 'JAZZCASH' | 'EASYPAISA' | 'SADAPAY' | 'BANK_CARD';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'COD_PENDING';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type SubOrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PACKED'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export type KycStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type DeliveryType = 'STANDARD' | 'HYPER_LOCAL';

export type CourierPartner = 'TCS' | 'LEOPARD' | 'TRAX' | 'RIDER' | 'SELF';

// ─── User ───────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  image?: string;
  phone?: string;
  whatsappNumber?: string;
  city?: string;
  deliveryAddress?: string;
  vendorProfileId?: string;
  createdAt: string;
}

// ─── Vendor / Seller ────────────────────────
export interface VendorProfile {
  id: string;
  userId: string;
  storeName: string;
  slug: string;
  logo?: string;
  banner?: string;
  bio?: string;
  isApproved: boolean;
  kycStatus: KycStatus;
  commissionRate: number;
  rating: number;
  totalSales: number;
  joinedDate: string;
  city: string;
  province: string;
  businessWhatsApp?: string;
  businessEmail?: string;
  // KYC Fields
  cnicFront?: string;
  cnicBack?: string;
  cnicNumber?: string;
  bankIban?: string;
  bankName?: string;
  accountTitle?: string;
  // Escrow
  escrowBalance: number;
  eligibleBalance: number;
  totalWithdrawn: number;
}

// ─── Category ───────────────────────────────
export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  deliveryType: DeliveryType;
}

// ─── Product ────────────────────────────────
export interface Product {
  id: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorLogo?: string;
  vendorCity: string;
  categoryId: string;
  categoryName: string;
  title: string;
  slug: string;
  description: string;
  price: number;          // In PKR
  originalPrice?: number; // In PKR
  stock: number;
  images: string[];
  isActive: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  deliveryType: DeliveryType;
  courierPartner?: CourierPartner;
  sameDay: boolean;       // Hyper-local same-day delivery
  createdAt: string;
}

// ─── Cart ───────────────────────────────────
export interface CartItem {
  product: Product;
  quantity: number;
}

// ─── Shipping Address ───────────────────────
export interface ShippingAddress {
  fullName: string;
  phone: string;
  whatsapp?: string;
  houseNo: string;
  street: string;
  area: string;
  city: string;
  province: string;
  postalCode?: string;
}

// ─── Order Item ──────────────────────────────
export interface OrderItem {
  id: string;
  subOrderId: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number; // PKR
}

// ─── Sub-Order (per vendor) ──────────────────
export interface SubOrder {
  id: string;
  orderId: string;
  vendorId: string;
  vendorName: string;
  vendorSlug: string;
  vendorCity: string;
  subtotal: number;        // PKR
  commissionAmount: number; // PKR
  payoutAmount: number;    // PKR
  status: SubOrderStatus;
  trackingNumber?: string;
  courierPartner?: CourierPartner;
  escrowHeldUntil?: string; // ISO date — 7 days after delivery
  payoutEligible: boolean;
  riderName?: string;
  riderPhone?: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

// ─── Parent Order ────────────────────────────
export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: ShippingAddress;
  totalAmount: number;     // PKR
  deliveryFee: number;     // PKR
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  whatsappNotifiedAt?: string;
  createdAt: string;
  updatedAt?: string;
  subOrders: SubOrder[];
}

// ─── Escrow Transaction ───────────────────────
export interface EscrowTransaction {
  id: string;
  vendorId: string;
  vendorName: string;
  orderId: string;
  amount: number;          // PKR
  heldSince: string;       // ISO date
  eligibleAfter: string;   // ISO date (heldSince + 7 days)
  status: 'HELD' | 'ELIGIBLE' | 'RELEASED';
}

// ─── Review ───────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  customerId: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── KYC Application ──────────────────────────
export interface KycApplication {
  id: string;
  vendorId: string;
  storeName: string;
  ownerName: string;
  cnicNumber: string;
  cnicFrontUrl: string;
  cnicBackUrl: string;
  bankIban: string;
  bankName: string;
  accountTitle: string;
  businessWhatsApp: string;
  businessEmail: string;
  city: string;
  province: string;
  status: KycStatus;
  submittedAt: string;
  reviewedAt?: string;
  reviewNote?: string;
}

// ─── Toast Notification ───────────────────────
export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'whatsapp';
  title: string;
  message: string;
}
