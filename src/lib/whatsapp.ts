// ─────────────────────────────────────────────
// Kharidari.pk — WhatsApp Meta Cloud API Service
// ─────────────────────────────────────────────

export interface WhatsAppMessage {
  to: string;        // Phone number with country code e.g. 92301XXXXXXX
  type: 'template' | 'text';
  templateName?: string;
  parameters?: Record<string, string>;
}

interface MetaCloudConfig {
  accessToken: string;
  phoneNumberId: string;
  apiVersion: string;
}

const CONFIG: MetaCloudConfig = {
  accessToken: process.env.WHATSAPP_TOKEN || '',
  phoneNumberId: process.env.WHATSAPP_PHONE_ID || '',
  apiVersion: 'v19.0',
};

const WHATSAPP_API_URL = `https://graph.facebook.com/${CONFIG.apiVersion}/${CONFIG.phoneNumberId}/messages`;

async function sendWhatsAppRequest(payload: object): Promise<boolean> {
  if (!CONFIG.accessToken || !CONFIG.phoneNumberId) {
    // Mock mode — log notification
    console.log('[WhatsApp Mock]', JSON.stringify(payload, null, 2));
    return true;
  }

  try {
    const res = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CONFIG.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('[WhatsApp Error]', err);
    return false;
  }
}

// ─── Template: Order Placed ──────────────────
export async function notifyOrderPlaced(params: {
  phone: string;
  customerName: string;
  orderId: string;
  totalAmount: string;
  paymentMethod: string;
}): Promise<boolean> {
  const payload = {
    messaging_product: 'whatsapp',
    to: `92${params.phone.replace(/^0/, '')}`,
    type: 'template',
    template: {
      name: 'kharidari_order_placed',
      language: { code: 'ur' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: params.customerName },
            { type: 'text', text: params.orderId },
            { type: 'text', text: `Rs. ${params.totalAmount}` },
            { type: 'text', text: params.paymentMethod },
          ],
        },
      ],
    },
  };
  return sendWhatsAppRequest(payload);
}

// ─── Template: Order Dispatched ──────────────
export async function notifyDispatched(params: {
  phone: string;
  customerName: string;
  orderId: string;
  courierName: string;
  trackingNumber: string;
}): Promise<boolean> {
  const payload = {
    messaging_product: 'whatsapp',
    to: `92${params.phone.replace(/^0/, '')}`,
    type: 'template',
    template: {
      name: 'kharidari_dispatched',
      language: { code: 'ur' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: params.customerName },
            { type: 'text', text: params.orderId },
            { type: 'text', text: params.courierName },
            { type: 'text', text: params.trackingNumber },
          ],
        },
      ],
    },
  };
  return sendWhatsAppRequest(payload);
}

// ─── Template: Out for Delivery ──────────────
export async function notifyOutForDelivery(params: {
  phone: string;
  customerName: string;
  orderId: string;
  riderName: string;
  riderPhone: string;
}): Promise<boolean> {
  const payload = {
    messaging_product: 'whatsapp',
    to: `92${params.phone.replace(/^0/, '')}`,
    type: 'template',
    template: {
      name: 'kharidari_out_for_delivery',
      language: { code: 'ur' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: params.customerName },
            { type: 'text', text: params.orderId },
            { type: 'text', text: params.riderName },
            { type: 'text', text: params.riderPhone },
          ],
        },
      ],
    },
  };
  return sendWhatsAppRequest(payload);
}

// ─── Template: Delivered ─────────────────────
export async function notifyDelivered(params: {
  phone: string;
  customerName: string;
  orderId: string;
}): Promise<boolean> {
  const payload = {
    messaging_product: 'whatsapp',
    to: `92${params.phone.replace(/^0/, '')}`,
    type: 'template',
    template: {
      name: 'kharidari_delivered',
      language: { code: 'ur' },
      components: [
        {
          type: 'body',
          parameters: [
            { type: 'text', text: params.customerName },
            { type: 'text', text: params.orderId },
          ],
        },
      ],
    },
  };
  return sendWhatsAppRequest(payload);
}

// ─── Vendor: Payout Ready ────────────────────
export async function notifyVendorPayoutReady(params: {
  phone: string;
  vendorName: string;
  amount: string;
}): Promise<boolean> {
  const payload = {
    messaging_product: 'whatsapp',
    to: `92${params.phone.replace(/^0/, '')}`,
    type: 'text',
    text: {
      body: `🎉 Kharidari.pk — ${params.vendorName}, آپ کی رقم Rs. ${params.amount} ادائیگی کے لیے تیار ہے! Bank transfer ابھی request کریں۔`,
    },
  };
  return sendWhatsAppRequest(payload);
}

// ─── PKR Formatter ───────────────────────────
export function formatPKR(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-PK')}`;
}
