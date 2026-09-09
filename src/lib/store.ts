import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Product, CartItem, Order, User, SubOrderStatus,
  VendorProfile, PaymentMethod, ShippingAddress, EscrowTransaction, KycApplication
} from '@/types';
import {
  INITIAL_USERS, INITIAL_PRODUCTS, INITIAL_ORDERS,
  INITIAL_VENDORS, INITIAL_ESCROW, INITIAL_KYC, formatPKR
} from './data';

// ─────────────────────────────────────────────
// Kharidari.pk — Zustand Global Store
// ─────────────────────────────────────────────

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error' | 'whatsapp';
  title: string;
  message: string;
}

interface AuthModalState {
  isOpen: boolean;
  mode: 'login' | 'signup';
  redirectAfter?: string;
}

interface MarketplaceState {
  // ── Auth ──────────────────────────────────
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  authModal: AuthModalState;
  setCurrentUser: (user: User) => void;
  logout: () => void;
  openAuthModal: (mode?: 'login' | 'signup', redirect?: string) => void;
  closeAuthModal: () => void;
  loginUser: (email: string, password: string) => boolean;
  registerUser: (data: Partial<User> & { password: string }) => boolean;
  deleteUser: (userId: string) => void;
  banUser: (userId: string) => void;

  // ── Location ──────────────────────────────
  currentCity: string;
  setCurrentCity: (city: string) => void;

  // ── Products ──────────────────────────────
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'rating' | 'reviewCount'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getLocalProducts: () => Product[];

  // ── Vendors ───────────────────────────────
  vendors: VendorProfile[];
  approveVendor: (vendorId: string) => void;
  rejectVendor: (vendorId: string, reason?: string) => void;
  updateCommissionRate: (vendorId: string, rate: number) => void;

  // ── Cart ──────────────────────────────────
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;
  getDeliveryFee: () => number;

  // ── Orders ────────────────────────────────
  orders: Order[];
  createOrder: (shippingAddress: ShippingAddress, paymentMethod: PaymentMethod) => Order | null;
  updateSubOrderStatus: (
    orderId: string,
    subOrderId: string,
    status: SubOrderStatus,
    trackingNumber?: string,
    riderName?: string,
    riderPhone?: string,
  ) => void;

  // ── Escrow ────────────────────────────────
  escrowTransactions: EscrowTransaction[];
  releaseEscrow: (escrowId: string) => void;

  // ── KYC ───────────────────────────────────
  kycApplications: KycApplication[];
  submitKyc: (data: Omit<KycApplication, 'id' | 'status' | 'submittedAt'>) => void;
  approveKyc: (kycId: string) => void;
  rejectKyc: (kycId: string, note?: string) => void;

  // ── Notifications ────────────────────────
  notifications: ToastNotification[];
  addToast: (notification: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      // ── Auth ──────────────────────────────────
      currentUser: null,
      isAuthenticated: false,
      users: INITIAL_USERS,
      authModal: { isOpen: false, mode: 'login' },

      setCurrentUser: (user) => {
        set({ currentUser: user, isAuthenticated: true });
        get().closeAuthModal();
        get().addToast({
          type: 'success',
          title: 'خوش آمدید! 🎉',
          message: `${user.name} آپ کا Kharidari.pk میں خیرمقدم ہے۔`,
        });
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, cart: [] });
        get().addToast({
          type: 'info',
          title: 'Logged Out',
          message: 'آپ کامیابی سے لاگ آؤٹ ہو گئے۔',
        });
      },

      openAuthModal: (mode = 'login', redirect) => {
        set({ authModal: { isOpen: true, mode, redirectAfter: redirect } });
      },
      closeAuthModal: () => {
        set({ authModal: { isOpen: false, mode: 'login' } });
      },

      loginUser: (email, password) => {
        const { users } = get();
        const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        if (!found) {
          get().addToast({
            type: 'error',
            title: 'Login Failed',
            message: 'Email یا password غلط ہے۔ دوبارہ کوشش کریں۔',
          });
          return false;
        }
        // Admin requires EXACT password match
        if (found.role === 'ADMIN') {
          const ADMIN_PASSWORD = 'Kharidari@2024';
          if (password !== ADMIN_PASSWORD) {
            get().addToast({
              type: 'error',
              title: 'Admin Login Failed',
              message: 'Admin password غلط ہے۔',
            });
            return false;
          }
        }
        // Dynamically set name based on logged-in email prefix if it's admin or default
        const emailPrefix = email.split('@')[0];
        const formattedName = emailPrefix.charAt(0).toUpperCase() + emailPrefix.slice(1);
        const userToLogin = {
          ...found,
          image: found.role === 'ADMIN' ? '' : found.image,
          name: found.role === 'ADMIN' ? (formattedName === 'Admin' ? 'Admin' : formattedName) : found.name
        };

        get().setCurrentUser(userToLogin);
        return true;
      },

      registerUser: (data) => {
        const { users } = get();
        const exists = users.some((u) => u.email.toLowerCase() === data.email?.toLowerCase());
        if (exists) {
          get().addToast({
            type: 'error',
            title: 'Already Registered',
            message: 'یہ email پہلے سے موجود ہے۔ Login کریں۔',
          });
          return false;
        }
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: data.name || 'New User',
          email: data.email || '',
          role: 'CUSTOMER',
          phone: data.phone,
          whatsappNumber: data.whatsappNumber || data.phone,
          city: data.city || 'Karachi',
          deliveryAddress: data.deliveryAddress,
          image: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'User')}&background=f97316&color=fff`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, newUser] }));
        get().setCurrentUser(newUser);
        return true;
      },

      deleteUser: (userId) => {
        const { users, currentUser } = get();
        const target = users.find(u => u.id === userId);
        if (!target) return;
        // Cannot delete admin or yourself
        if (target.role === 'ADMIN') {
          get().addToast({ type: 'error', title: 'ممنوع', message: 'Admin account delete نہیں کیا جا سکتا۔' });
          return;
        }
        set((state) => ({ users: state.users.filter(u => u.id !== userId) }));
        // If this user is currently logged in, log them out
        if (currentUser?.id === userId) {
          set({ currentUser: null, isAuthenticated: false, cart: [] });
        }
        get().addToast({
          type: 'success',
          title: 'Account Delete ✓',
          message: `${target.name} کا account platform سے ہٹا دیا گیا۔`,
        });
      },

      banUser: (userId) => {
        const { users } = get();
        const target = users.find(u => u.id === userId);
        if (!target || target.role === 'ADMIN') return;
        set((state) => ({
          users: state.users.map(u => u.id === userId ? { ...u, isBanned: true } : u),
        }));
        get().addToast({
          type: 'warning',
          title: 'User Banned',
          message: `${target.name} کو platform سے ban کر دیا گیا۔`,
        });
      },

      // ── Location ──────────────────────────────
      currentCity: 'Lahore',
      setCurrentCity: (city) => {
        set({ currentCity: city });
        get().addToast({
          type: 'info',
          title: `City Changed: ${city}`,
          message: `آپ کے قریب کی مصنوعات دکھائی جا رہی ہیں۔`,
        });
      },

      // ── Products ──────────────────────────────
      products: INITIAL_PRODUCTS,

      getLocalProducts: () => {
        const { products, currentCity } = get();
        return products.filter(
          (p) => p.vendorCity.toLowerCase() === currentCity.toLowerCase()
        );
      },

      addProduct: (productData) => {
        const { currentUser } = get();
        const newProduct: Product = {
          ...productData,
          id: `prod_${Date.now()}`,
          rating: 5.0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [newProduct, ...state.products] }));
        get().addToast({
          type: 'success',
          title: 'Product Published ✓',
          message: `"${newProduct.title}" مارکیٹ پلیس میں شامل ہو گئی!`,
        });
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
        get().addToast({ type: 'info', title: 'Updated', message: 'Product تبدیلیاں محفوظ ہو گئیں۔' });
      },

      deleteProduct: (id) => {
        set((state) => ({ products: state.products.filter((p) => p.id !== id) }));
        get().addToast({ type: 'info', title: 'Removed', message: 'Product listing ہٹا دی گئی۔' });
      },

      // ── Vendors ───────────────────────────────
      vendors: INITIAL_VENDORS,

      approveVendor: (vendorId) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId ? { ...v, isApproved: true, kycStatus: 'APPROVED' } : v
          ),
          kycApplications: state.kycApplications.map((k) =>
            k.vendorId === vendorId ? { ...k, status: 'APPROVED', reviewedAt: new Date().toISOString() } : k
          ),
        }));
        get().addToast({
          type: 'success',
          title: 'Vendor Approved ✓',
          message: 'Vendor KYC منظور ہو گئی۔ ان کی دکان اب عوام کے لیے نظر آئے گی۔',
        });
      },

      rejectVendor: (vendorId, reason) => {
        set((state) => ({
          vendors: state.vendors.map((v) =>
            v.id === vendorId ? { ...v, kycStatus: 'REJECTED' } : v
          ),
          kycApplications: state.kycApplications.map((k) =>
            k.vendorId === vendorId
              ? { ...k, status: 'REJECTED', reviewedAt: new Date().toISOString(), reviewNote: reason }
              : k
          ),
        }));
        get().addToast({
          type: 'warning',
          title: 'Vendor Rejected',
          message: `KYC مسترد کر دی گئی${reason ? `: ${reason}` : ''}`,
        });
      },

      updateCommissionRate: (vendorId, rate) => {
        set((state) => ({
          vendors: state.vendors.map((v) => (v.id === vendorId ? { ...v, commissionRate: rate } : v)),
        }));
        get().addToast({ type: 'info', title: 'Commission Updated', message: `Commission rate ${rate}% ہو گئی۔` });
      },

      // ── Cart ──────────────────────────────────
      cart: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      addToCart: (product, quantity = 1) => {
        set((state) => {
          const existing = state.cart.find((item) => item.product.id === product.id);
          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isCartOpen: true,
            };
          }
          return { cart: [...state.cart, { product, quantity }], isCartOpen: true };
        });
        get().addToast({
          type: 'success',
          title: 'Cart میں شامل ✓',
          message: `${product.title.substring(0, 40)}... cart میں آ گئی۔`,
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({ cart: state.cart.filter((item) => item.product.id !== productId) }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) { get().removeFromCart(productId); return; }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },

      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },

      getDeliveryFee: () => {
        const total = get().getCartTotal();
        return total >= 2000 ? 0 : 150;
      },

      // ── Orders ────────────────────────────────
      orders: INITIAL_ORDERS,

      createOrder: (shippingAddress, paymentMethod) => {
        const { cart, currentUser, vendors } = get();
        if (cart.length === 0 || !currentUser) return null;

        const orderId = `KPK-${Math.floor(10000 + Math.random() * 90000)}`;
        const totalAmount = get().getCartTotal();
        const deliveryFee = get().getDeliveryFee();

        // Group cart items by vendor
        const vendorGroups = new Map<string, CartItem[]>();
        cart.forEach((item) => {
          const vId = item.product.vendorId;
          const group = vendorGroups.get(vId) || [];
          group.push(item);
          vendorGroups.set(vId, group);
        });

        // Create sub-orders with escrow
        const escrowItems: EscrowTransaction[] = [];
        const now = new Date().toISOString();
        const eligibleAfter = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        const subOrders = Array.from(vendorGroups.entries()).map(([vendorId, items], idx) => {
          const vendor = vendors.find((v) => v.id === vendorId);
          const commissionRate = vendor?.commissionRate || 10;
          const subtotal = items.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
          const commissionAmount = (subtotal * commissionRate) / 100;
          const payoutAmount = subtotal - commissionAmount;

          const subId = `SUB-${orderId}-${idx + 1}`;

          escrowItems.push({
            id: `ESC-${Date.now()}-${idx}`,
            vendorId,
            vendorName: vendor?.storeName || 'Seller',
            orderId,
            amount: payoutAmount,
            heldSince: now,
            eligibleAfter,
            status: 'HELD',
          });

          return {
            id: subId,
            orderId,
            vendorId,
            vendorName: vendor?.storeName || items[0].product.vendorName,
            vendorSlug: vendor?.slug || items[0].product.vendorSlug,
            vendorCity: vendor?.city || items[0].product.vendorCity,
            subtotal,
            commissionAmount,
            payoutAmount,
            status: 'PENDING' as SubOrderStatus,
            payoutEligible: false,
            createdAt: now,
            updatedAt: now,
            items: items.map((it, itemIdx) => ({
              id: `item_${orderId}_${idx}_${itemIdx}`,
              subOrderId: subId,
              productId: it.product.id,
              product: it.product,
              quantity: it.quantity,
              unitPrice: it.product.price,
            })),
          };
        });

        const newOrder: Order = {
          id: orderId,
          customerId: currentUser.id,
          customerName: currentUser.name,
          customerEmail: currentUser.email,
          customerPhone: currentUser.phone,
          shippingAddress,
          totalAmount,
          deliveryFee,
          paymentMethod,
          paymentStatus: paymentMethod === 'COD' ? 'COD_PENDING' : 'PAID',
          orderStatus: 'PENDING',
          whatsappNotifiedAt: new Date().toISOString(),
          createdAt: now,
          subOrders,
        };

        set((state) => ({
          orders: [newOrder, ...state.orders],
          cart: [],
          isCartOpen: false,
          escrowTransactions: [...escrowItems, ...state.escrowTransactions],
        }));

        get().addToast({
          type: 'whatsapp',
          title: `آرڈر مکمل! #${orderId} 🎉`,
          message: `WhatsApp پر تصدیق بھیجی جا رہی ہے۔ ${subOrders.length} vendor(s) کو notify کیا گیا۔`,
        });

        return newOrder;
      },

      updateSubOrderStatus: (orderId, subOrderId, status, trackingNumber, riderName, riderPhone) => {
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            return {
              ...order,
              subOrders: order.subOrders.map((sub) => {
                if (sub.id !== subOrderId) return sub;
                return {
                  ...sub,
                  status,
                  trackingNumber: trackingNumber ?? sub.trackingNumber,
                  riderName: riderName ?? sub.riderName,
                  riderPhone: riderPhone ?? sub.riderPhone,
                  payoutEligible: status === 'DELIVERED',
                  updatedAt: new Date().toISOString(),
                };
              }),
            };
          }),
        }));
        get().addToast({
          type: status === 'OUT_FOR_DELIVERY' ? 'whatsapp' : 'info',
          title: 'Order Status Updated',
          message: `Shipment ${subOrderId} → ${status}${riderName ? ` | Rider: ${riderName}` : ''}`,
        });
      },

      // ── Escrow ────────────────────────────────
      escrowTransactions: INITIAL_ESCROW,

      releaseEscrow: (escrowId) => {
        set((state) => ({
          escrowTransactions: state.escrowTransactions.map((e) =>
            e.id === escrowId ? { ...e, status: 'RELEASED' } : e
          ),
        }));
        get().addToast({
          type: 'success',
          title: 'Escrow Released ✓',
          message: `رقم vendor کے payout balance میں منتقل ہو گئی۔`,
        });
      },

      // ── KYC ───────────────────────────────────
      kycApplications: INITIAL_KYC,

      submitKyc: (data) => {
        const newApp: KycApplication = {
          ...data,
          id: `kyc_${Date.now()}`,
          status: 'PENDING',
          submittedAt: new Date().toISOString(),
        };
        set((state) => ({ kycApplications: [newApp, ...state.kycApplications] }));
        get().addToast({
          type: 'success',
          title: 'KYC جمع ہو گئی ✓',
          message: 'آپ کی درخواست admin کے پاس review کے لیے بھیج دی گئی ہے۔ 24-48 گھنٹے میں جواب ملے گا۔',
        });
      },

      approveKyc: (kycId) => {
        const { kycApplications } = get();
        const app = kycApplications.find((k) => k.id === kycId);
        if (app) get().approveVendor(app.vendorId);
      },

      rejectKyc: (kycId, note) => {
        const { kycApplications } = get();
        const app = kycApplications.find((k) => k.id === kycId);
        if (app) get().rejectVendor(app.vendorId, note);
      },

      // ── Notifications ─────────────────────────
      notifications: [],
      addToast: (notif) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          notifications: [...state.notifications, { ...notif, id }],
        }));
        const duration = notif.type === 'whatsapp' ? 5000 : 4000;
        setTimeout(() => { get().removeToast(id); }, duration);
      },
      removeToast: (id) => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      },
    }),
    {
      name: 'kharidari-pk-storage',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        cart: state.cart,
        orders: state.orders,
        products: state.products,
        vendors: state.vendors,
        currentCity: state.currentCity,
        escrowTransactions: state.escrowTransactions,
        kycApplications: state.kycApplications,
      }),
    }
  )
);
