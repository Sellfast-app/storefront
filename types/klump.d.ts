export {};

declare global {
  interface Window {
    eval(script: string): unknown;
  }

  const Klump: new (config: {
      publicKey: string;
      data: {
        amount: number;
        shipping_fee?: number;
        currency: "NGN";
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
        redirect_url?: string;
        merchant_reference?: string;
        meta_data?: Record<string, unknown>;
        items: Array<{
          name: string;
          unit_price: number;
          quantity: number;
          image_url?: string;
          item_url?: string;
        }>;
      };
      onSuccess?: (response: unknown) => void;
      onError?: (error: unknown) => void;
      onLoad?: (response: unknown) => void;
      onOpen?: (response: unknown) => void;
      onClose?: () => void;
    }) => void;
}
