"use client";

import CartButton from '@/components/CartButton';
import VendorBrand from '@/components/VendorBrand';
import ArrowIcon from '@/components/svgIcons/ArrowIcon';
import SaveIcon from '@/components/svgIcons/SaveIcon';
import PaystackLogo from '@/components/svgIcons/PaystackLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import Link from 'next/link';
import Script from 'next/script';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import StateRegionSelect from '@/components/stateRegionSelect';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Truck, X, Copy, Minus, Plus } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const countryToCode: Record<string, string> = {
  "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Andorra": "AD", "Angola": "AO",
  "Antigua and Barbuda": "AG", "Argentina": "AR", "Armenia": "AM", "Australia": "AU",
  "Austria": "AT", "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD",
  "Barbados": "BB", "Belarus": "BY", "Belgium": "BE", "Belize": "BZ", "Benin": "BJ",
  "Bhutan": "BT", "Bolivia": "BO", "Bosnia and Herzegovina": "BA", "Botswana": "BW",
  "Brazil": "BR", "Brunei": "BN", "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI",
  "Cabo Verde": "CV", "Cambodia": "KH", "Cameroon": "CM", "Canada": "CA",
  "Central African Republic": "CF", "Chad": "TD", "Chile": "CL", "China": "CN",
  "Colombia": "CO", "Comoros": "KM", "Congo (Congo-Brazzaville)": "CG", "Costa Rica": "CR",
  "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY", "Czechia": "CZ",
  "Democratic Republic of the Congo": "CD", "Denmark": "DK", "Djibouti": "DJ",
  "Dominica": "DM", "Dominican Republic": "DO", "Ecuador": "EC", "Egypt": "EG",
  "El Salvador": "SV", "Equatorial Guinea": "GQ", "Eritrea": "ER", "Estonia": "EE",
  "Eswatini": "SZ", "Ethiopia": "ET", "Fiji": "FJ", "Finland": "FI", "France": "FR",
  "Gabon": "GA", "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH",
  "Greece": "GR", "Grenada": "GD", "Guatemala": "GT", "Guinea": "GN", "Guinea-Bissau": "GW",
  "Guyana": "GY", "Haiti": "HT", "Honduras": "HN", "Hungary": "HU", "Iceland": "IS",
  "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE",
  "Israel": "IL", "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jordan": "JO",
  "Kazakhstan": "KZ", "Kenya": "KE", "Kiribati": "KI", "Kuwait": "KW", "Kyrgyzstan": "KG",
  "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR",
  "Libya": "LY", "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU",
  "Madagascar": "MG", "Malawi": "MW", "Malaysia": "MY", "Maldives": "MV", "Mali": "ML",
  "Malta": "MT", "Marshall Islands": "MH", "Mauritania": "MR", "Mauritius": "MU",
  "Mexico": "MX", "Micronesia": "FM", "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN",
  "Montenegro": "ME", "Morocco": "MA", "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA",
  "Nauru": "NR", "Nepal": "NP", "Netherlands": "NL", "New Zealand": "NZ", "Nicaragua": "NI",
  "Niger": "NE", "Nigeria": "NG", "North Korea": "KP", "North Macedonia": "MK",
  "Norway": "NO", "Oman": "OM", "Pakistan": "PK", "Palau": "PW", "Panama": "PA",
  "Papua New Guinea": "PG", "Paraguay": "PY", "Peru": "PE", "Philippines": "PH",
  "Poland": "PL", "Portugal": "PT", "Qatar": "QA", "Romania": "RO", "Russia": "RU",
  "Rwanda": "RW", "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC",
  "Saint Vincent and the Grenadines": "VC", "Samoa": "WS", "San Marino": "SM",
  "Sao Tome and Principe": "ST", "Saudi Arabia": "SA", "Senegal": "SN", "Serbia": "RS",
  "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG", "Slovakia": "SK",
  "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO", "South Africa": "ZA",
  "South Korea": "KR", "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK",
  "Sudan": "SD", "Suriname": "SR", "Sweden": "SE", "Switzerland": "CH", "Syria": "SY",
  "Taiwan": "TW", "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH",
  "Timor-Leste": "TL", "Togo": "TG", "Tonga": "TO", "Trinidad and Tobago": "TT",
  "Tunisia": "TN", "Turkey": "TR", "Turkmenistan": "TM", "Tuvalu": "TV", "Uganda": "UG",
  "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB",
  "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ", "Vanuatu": "VU",
  "Vatican City": "VA", "Venezuela": "VE", "Vietnam": "VN", "Yemen": "YE",
  "Zambia": "ZM", "Zimbabwe": "ZW"
};

const PHONE_CODES = [
  { code: 'NG', dial: '+234', flag: '🇳🇬', name: 'Nigeria' },
  { code: 'GH', dial: '+233', flag: '🇬🇭', name: 'Ghana' },
  { code: 'KE', dial: '+254', flag: '🇰🇪', name: 'Kenya' },
  { code: 'ZA', dial: '+27', flag: '🇿🇦', name: 'South Africa' },
  { code: 'ET', dial: '+251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: 'TZ', dial: '+255', flag: '🇹🇿', name: 'Tanzania' },
  { code: 'UG', dial: '+256', flag: '🇺🇬', name: 'Uganda' },
  { code: 'RW', dial: '+250', flag: '🇷🇼', name: 'Rwanda' },
  { code: 'SN', dial: '+221', flag: '🇸🇳', name: 'Senegal' },
  { code: 'CM', dial: '+237', flag: '🇨🇲', name: 'Cameroon' },
  { code: 'CI', dial: '+225', flag: '🇨🇮', name: "Côte d'Ivoire" },
  { code: 'ZM', dial: '+260', flag: '🇿🇲', name: 'Zambia' },
  { code: 'ZW', dial: '+263', flag: '🇿🇼', name: 'Zimbabwe' },
  { code: 'EG', dial: '+20', flag: '🇪🇬', name: 'Egypt' },
  { code: 'US', dial: '+1', flag: '🇺🇸', name: 'United States' },
  { code: 'CA', dial: '+1', flag: '🇨🇦', name: 'Canada' },
  { code: 'GB', dial: '+44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: 'AU', dial: '+61', flag: '🇦🇺', name: 'Australia' },
  { code: 'NZ', dial: '+64', flag: '🇳🇿', name: 'New Zealand' },
  { code: 'DE', dial: '+49', flag: '🇩🇪', name: 'Germany' },
  { code: 'FR', dial: '+33', flag: '🇫🇷', name: 'France' },
  { code: 'IT', dial: '+39', flag: '🇮🇹', name: 'Italy' },
  { code: 'ES', dial: '+34', flag: '🇪🇸', name: 'Spain' },
  { code: 'NL', dial: '+31', flag: '🇳🇱', name: 'Netherlands' },
  { code: 'SE', dial: '+46', flag: '🇸🇪', name: 'Sweden' },
  { code: 'NO', dial: '+47', flag: '🇳🇴', name: 'Norway' },
  { code: 'DK', dial: '+45', flag: '🇩🇰', name: 'Denmark' },
  { code: 'FI', dial: '+358', flag: '🇫🇮', name: 'Finland' },
  { code: 'CH', dial: '+41', flag: '🇨🇭', name: 'Switzerland' },
  { code: 'PL', dial: '+48', flag: '🇵🇱', name: 'Poland' },
  { code: 'RO', dial: '+40', flag: '🇷🇴', name: 'Romania' },
  { code: 'UA', dial: '+380', flag: '🇺🇦', name: 'Ukraine' },
  { code: 'TR', dial: '+90', flag: '🇹🇷', name: 'Turkey' },
  { code: 'IN', dial: '+91', flag: '🇮🇳', name: 'India' },
  { code: 'PK', dial: '+92', flag: '🇵🇰', name: 'Pakistan' },
  { code: 'BD', dial: '+880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: 'CN', dial: '+86', flag: '🇨🇳', name: 'China' },
  { code: 'JP', dial: '+81', flag: '🇯🇵', name: 'Japan' },
  { code: 'SG', dial: '+65', flag: '🇸🇬', name: 'Singapore' },
  { code: 'MY', dial: '+60', flag: '🇲🇾', name: 'Malaysia' },
  { code: 'ID', dial: '+62', flag: '🇮🇩', name: 'Indonesia' },
  { code: 'PH', dial: '+63', flag: '🇵🇭', name: 'Philippines' },
  { code: 'AE', dial: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: 'SA', dial: '+966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: 'QA', dial: '+974', flag: '🇶🇦', name: 'Qatar' },
  { code: 'BR', dial: '+55', flag: '🇧🇷', name: 'Brazil' },
  { code: 'MX', dial: '+52', flag: '🇲🇽', name: 'Mexico' },
  { code: 'AR', dial: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: 'CO', dial: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: 'IR', dial: '+98', flag: '🇮🇷', name: 'Iran' },
];

interface SendboxQuote {
  name: string;
  rate_card_id: string;
  fee: number;
  pickup_date: string;
}

interface GigQuote {
  name: string;
  rate_card_id: null;
  fee: number;
  pickup_date: null;
}

interface DeliveryQuote {
  sendboxQuotes?: SendboxQuote[];
  gigQuote?: GigQuote;
  deliveryMethod: string;
}

interface SelectedQuote {
  fee: number;
  rate_card_id?: string | number | null;
  name: string;
  orderKey?: string;
}

interface CheckoutOrderResult {
  data?: {
    order?: {
      id?: string;
      order_number?: string;
      order_total?: string | number;
    };
    id?: string;
    order_number?: string;
    order_total?: string | number;
    payment?: {
      reference?: string;
      total_paid?: string | number;
      authorization_url?: string;
    };
    transaction?: {
      reference?: string;
    };
  };
}

interface AppliedCoupon {
  code: string;
  amount: number;
  store_id?: string;
  store_name?: string;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
}

interface StorePaymentMethod {
  provider: string;
  subAccountIdentifier?: string | null;
}

interface VendorDeliveryRate {
  id: string;
  location: string;
  rate: number;
  description?: string;
  delivery_time?: string;
  estimated_delivery?: string;
}

interface CryptoPaymentInit {
  reference: string;
  depositAddress: string;
  fromCurrency: string;
  fromNetwork: string;
  fromAmount: number;
  toCurrency: string;
  toAmount: number;
  status: string;
}

// All possible delivery method values including relay for food stores
type DeliveryMethodType = 'sendbox' | 'pickup' | 'vendor' | 'gig' | 'relay';
type PaymentMethodType = 'paystack' | 'klump' | 'crypto';
type KlumpConstructor = typeof Klump;

interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  post_code: string;
  country: string;
}

interface CheckoutDraft {
  customerDetails: CustomerDetails;
  firstName?: string;
  lastName?: string;
  phoneDialCode: string;
  deliveryMethod: DeliveryMethodType | null;
  deliveryNotes: string;
  paymentMethod: PaymentMethodType;
}

const DEFAULT_CUSTOMER_DETAILS: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  post_code: '',
  country: 'NG',
};

const getCheckoutDraftKey = (storeId: string) => `checkout_draft_${storeId}`;

const getKlumpConstructor = (): KlumpConstructor | null => {
  if (typeof window === 'undefined') return null;

  try {
    return window.eval('typeof Klump !== "undefined" ? Klump : null') as KlumpConstructor | null;
  } catch {
    return null;
  }
};

// Label map — what each backend value shows as on the frontend
const DELIVERY_METHOD_LABELS: Record<DeliveryMethodType, string> = {
  sendbox: 'SendBox',
  pickup: 'Pick Up',
  vendor: 'Vendor Delivery',
  gig: 'GIG Logistics',
  relay: 'Relay by Chowdeck',
};

const DELIVERY_METHOD_DESCRIPTIONS: Record<DeliveryMethodType, string> = {
  sendbox: 'Delivered through our sendbox delivery service. Rates will be shown after saving.',
  pickup: "You'll pick up your order from the store location.",
  vendor: 'The vendor will handle delivery of your order.',
  gig: 'Delivered through GIG Logistics. Rate will be calculated after saving.',
  relay: 'Delivered through Relay by Chowdeck. Delivery fee will be calculated after saving.',
};

const normalizePaymentMethods = (methods: StorePaymentMethod[]) => {
  const providers = methods.map((method) => String(method.provider || '').toLowerCase());

  return {
    paystack: providers.length === 0 || providers.includes('paystack'),
    klump: providers.includes('klump'),
    crypto: providers.includes('crypto') || providers.includes('kuvarpay'),
  };
};

export default function CheckoutPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [storeBrand, setStoreBrand] = useState<{ name: string; logo: string | null }>({ name: '', logo: null });
  const [searchQuery] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethodType | null>(null);
  const [phoneDialCode, setPhoneDialCode] = useState('+234');
  const [enabledFulfillmentModes, setEnabledFulfillmentModes] = useState<string[]>([]);
  const [enabledPaymentMethods, setEnabledPaymentMethods] = useState({
    paystack: true,
    klump: false,
    crypto: false,
  });
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [isLoadingModes, setIsLoadingModes] = useState(true);
  const [isFoodStore, setIsFoodStore] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('paystack');
  const [isKlumpReady, setIsKlumpReady] = useState(() => !!getKlumpConstructor());
  const [loadedCheckoutDraftStoreId, setLoadedCheckoutDraftStoreId] = useState<string | null>(null);

  const [cryptoChains, setCryptoChains] = useState<string[]>([]);
  const [cryptoCurrencies, setCryptoCurrencies] = useState<{ ticker: string; name: string }[]>([]);
  const [selectedCryptoChain, setSelectedCryptoChain] = useState('');
  const [selectedCryptoCurrency, setSelectedCryptoCurrency] = useState('');
  const [isLoadingCryptoChains, setIsLoadingCryptoChains] = useState(false);
  const [isLoadingCryptoCurrencies, setIsLoadingCryptoCurrencies] = useState(false);
  const [cryptoConvertedPrice, setCryptoConvertedPrice] = useState<{ fromAmount: number; fromCurrency: string } | null>(null);
  const [isConvertingCryptoPrice, setIsConvertingCryptoPrice] = useState(false);
  const [cryptoPaymentInit, setCryptoPaymentInit] = useState<CryptoPaymentInit | null>(null);

  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<SelectedQuote | null>(null);
  const [showSendboxModal, setShowSendboxModal] = useState(false);
  const [vendorDeliveryRates, setVendorDeliveryRates] = useState<VendorDeliveryRate[]>([]);
  const [selectedVendorDeliveryRate, setSelectedVendorDeliveryRate] = useState<VendorDeliveryRate | null>(null);
  const [showVendorDeliveryModal, setShowVendorDeliveryModal] = useState(false);
  const [showShippingMethodModal, setShowShippingMethodModal] = useState(false);
  const [vendorDeliverySearch, setVendorDeliverySearch] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    ...DEFAULT_CUSTOMER_DETAILS,
  });
  const [customerFirstName, setCustomerFirstName] = useState('');
  const [customerLastName, setCustomerLastName] = useState('');

  const { cart, getCartTotal, clearCart, isFoodCart, updateQuantity } = useCart();
  const isSearchingOnMobile = searchQuery.trim() !== '';

  const isFood = isFoodCart();
  const canUseKlump = !isFoodStore && !isFood;

  const itemsTotal = getCartTotal();
  const couponDiscount = appliedCoupon ? Math.min(itemsTotal, appliedCoupon.amount) : 0;
  const remainingItemsTotal = Math.max(itemsTotal - couponDiscount, 0);
  const deliveryFee = appliedCoupon ? 0 : selectedQuote?.fee || 0;
  const total = remainingItemsTotal + deliveryFee;
  const isZeroBalanceOrder = appliedCoupon !== null && total === 0;
  const orderPayloadItemsTotal = isZeroBalanceOrder ? itemsTotal : remainingItemsTotal;
  const hasCouponVendorDelivery = appliedCoupon !== null && deliveryMethod === 'vendor';

  // Food orders must be quoted first because the backend returns the orderKey used to create the order.
  const needsQuote =
    deliveryMethod !== null &&
    (isFood ||
      deliveryMethod === 'sendbox' ||
      deliveryMethod === 'gig' ||
      deliveryMethod === 'relay');

  useEffect(() => {
    if (!storeId) return;

    try {
      const savedDraft = sessionStorage.getItem(getCheckoutDraftKey(storeId));
      if (savedDraft) {
        const draft = JSON.parse(savedDraft) as Partial<CheckoutDraft>;

        if (draft.customerDetails) {
          setCustomerDetails({
            ...DEFAULT_CUSTOMER_DETAILS,
            ...draft.customerDetails,
          });
          const savedName = draft.customerDetails.name.trim().split(/\s+/);
          setCustomerFirstName(draft.firstName || savedName[0] || '');
          setCustomerLastName(draft.lastName || savedName.slice(1).join(' '));
        }
        if (typeof draft.phoneDialCode === 'string') {
          setPhoneDialCode(draft.phoneDialCode);
        }
        if (typeof draft.deliveryNotes === 'string') {
          setDeliveryNotes(draft.deliveryNotes);
        }
        if (draft.deliveryMethod) {
          setDeliveryMethod(draft.deliveryMethod);
        }
        if (draft.paymentMethod === 'paystack' || draft.paymentMethod === 'klump' || draft.paymentMethod === 'crypto') {
          setPaymentMethod(draft.paymentMethod);
        }
      }
    } catch (error) {
      console.error('Failed to restore checkout draft:', error);
      sessionStorage.removeItem(getCheckoutDraftKey(storeId));
    } finally {
      setLoadedCheckoutDraftStoreId(storeId);
    }
  }, [storeId]);

  useEffect(() => {
    if (!storeId || loadedCheckoutDraftStoreId !== storeId) return;

    const draft: CheckoutDraft = {
      customerDetails,
      firstName: customerFirstName,
      lastName: customerLastName,
      phoneDialCode,
      deliveryMethod,
      deliveryNotes,
      paymentMethod,
    };

    sessionStorage.setItem(getCheckoutDraftKey(storeId), JSON.stringify(draft));
  }, [
    customerDetails,
    customerFirstName,
    customerLastName,
    deliveryMethod,
    deliveryNotes,
    loadedCheckoutDraftStoreId,
    paymentMethod,
    phoneDialCode,
    storeId,
  ]);

  useEffect(() => {
    const fetchStoreFulfillmentModes = async () => {
      setStoreBrand({ name: '', logo: null });
      try {
        setIsLoadingModes(true);
        const response = await fetch(`/api/stores/${storeId}`);
        if (!response.ok) throw new Error('Failed to fetch store details');
        const result = await response.json();

        if (result.status === 'success' && result.data?.storeDetails) {
          const storeDetails = result.data.storeDetails;
          const logo = typeof storeDetails.logo === 'string' ? storeDetails.logo : null;
          setStoreBrand({
            name: storeDetails.store_name || 'Store',
            logo: logo
              ? logo.startsWith('/') || logo.startsWith('http')
                ? logo
                : `${process.env.NEXT_PUBLIC_API_BASE_URL}${logo}`
              : null,
          });
          const businessType: string = storeDetails.business_type || '';
          const isRestaurant = businessType === 'Restaurant/Food Service';
          setIsFoodStore(isRestaurant);

          const modes: string[] = storeDetails.enabled_fulfillment_modes || [];
          setEnabledFulfillmentModes(modes);
          const configuredRates = storeDetails.metadata?.manual_shipping_rates;
          if (Array.isArray(configuredRates)) {
            setVendorDeliveryRates(
              configuredRates.filter(
                (rate: Partial<VendorDeliveryRate>): rate is VendorDeliveryRate =>
                  typeof rate.id === 'string' &&
                  typeof rate.location === 'string' &&
                  typeof rate.rate === 'number' &&
                  Number.isFinite(rate.rate) &&
                  rate.rate > 0
              )
            );
          }
          setDeliveryMethod(currentMethod =>
            currentMethod && modes.includes(currentMethod) ? currentMethod : null
          );
          setIsEditingDelivery(true);
        }
      } catch (error) {
        console.error('❌ Error fetching store fulfillment modes:', error);
        toast.error('Failed to load delivery options');
        setEnabledFulfillmentModes(['pickup']);
        setDeliveryMethod(currentMethod => currentMethod === 'pickup' ? currentMethod : null);
        setIsEditingDelivery(true);
      } finally {
        setIsLoadingModes(false);
      }
    };

    if (storeId) fetchStoreFulfillmentModes();
  }, [storeId]);

  useEffect(() => {
    const fetchStorePaymentMethods = async () => {
      try {
        setIsLoadingPaymentMethods(true);
        const response = await fetch(`/api/stores/${storeId}/payment-methods`);
        const result = await response.json();

        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Failed to fetch payment methods');
        }

        const methods: StorePaymentMethod[] = Array.isArray(result.data) ? result.data : [];
        setEnabledPaymentMethods(normalizePaymentMethods(methods));
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        setEnabledPaymentMethods({ paystack: true, klump: false, crypto: false });
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };

    if (storeId) fetchStorePaymentMethods();
  }, [storeId]);

  useEffect(() => {
    if (appliedCoupon && deliveryMethod === 'vendor') return;
    setSelectedQuote(null);
    setDeliveryQuote(null);
  }, [appliedCoupon, deliveryMethod]);

  useEffect(() => {
    if (!canUseKlump && paymentMethod === 'klump') {
      setPaymentMethod('paystack');
    }
    if (paymentMethod === 'klump' && !enabledPaymentMethods.klump) {
      setPaymentMethod('paystack');
    }
    if (paymentMethod === 'crypto' && !enabledPaymentMethods.crypto) {
      setPaymentMethod('paystack');
    }
  }, [canUseKlump, enabledPaymentMethods.crypto, enabledPaymentMethods.klump, paymentMethod]);

  useEffect(() => {
    if (paymentMethod !== 'crypto' || cryptoChains.length > 0) return;

    const fetchChains = async () => {
      setIsLoadingCryptoChains(true);
      try {
        const response = await fetch('/api/payments/crypto/chains');
        const result = await response.json();
        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Failed to load crypto networks');
        }
        setCryptoChains(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        console.error('Error loading crypto networks:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load crypto networks');
      } finally {
        setIsLoadingCryptoChains(false);
      }
    };

    fetchChains();
  }, [paymentMethod, cryptoChains.length]);

  useEffect(() => {
    if (!selectedCryptoChain) {
      setCryptoCurrencies([]);
      setSelectedCryptoCurrency('');
      return;
    }

    const fetchCurrencies = async () => {
      setIsLoadingCryptoCurrencies(true);
      try {
        const response = await fetch(`/api/payments/crypto/currencies?network=${encodeURIComponent(selectedCryptoChain)}`);
        const result = await response.json();
        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Failed to load crypto currencies');
        }
        const list: { ticker: string; name: string }[] = Array.isArray(result.data)
          ? result.data.map((c: { ticker: string; name: string }) => ({ ticker: c.ticker, name: c.name }))
          : [];
        setCryptoCurrencies(list);
        setSelectedCryptoCurrency((current) =>
          current && list.some((c) => c.ticker === current) ? current : ''
        );
      } catch (error) {
        console.error('Error loading crypto currencies:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load crypto currencies');
      } finally {
        setIsLoadingCryptoCurrencies(false);
      }
    };

    fetchCurrencies();
  }, [selectedCryptoChain]);

  useEffect(() => {
    if (!selectedCryptoChain || !selectedCryptoCurrency || total <= 0) {
      setCryptoConvertedPrice(null);
      return;
    }

    const fetchConvertedPrice = async () => {
      setIsConvertingCryptoPrice(true);
      try {
        const response = await fetch('/api/payments/crypto/converted-price', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ network: selectedCryptoChain, currency: selectedCryptoCurrency, amount: total }),
        });
        const result = await response.json();
        if (!response.ok || result.status === 'error') {
          throw new Error(result.message || 'Failed to convert price');
        }
        setCryptoConvertedPrice({ fromAmount: result.data.fromAmount, fromCurrency: selectedCryptoCurrency });
      } catch (error) {
        console.error('Error converting crypto price:', error);
        setCryptoConvertedPrice(null);
        toast.error(error instanceof Error ? error.message : 'Failed to convert price for selected crypto currency');
      } finally {
        setIsConvertingCryptoPrice(false);
      }
    };

    fetchConvertedPrice();
  }, [selectedCryptoChain, selectedCryptoCurrency, total]);

  useEffect(() => {
    if (!canUseKlump || isKlumpReady) return;

    const timer = window.setInterval(() => {
      if (getKlumpConstructor()) {
        setIsKlumpReady(true);
        window.clearInterval(timer);
      }
    }, 300);

    return () => window.clearInterval(timer);
  }, [canUseKlump, isKlumpReady]);

  const handleEditAddress = () => setIsEditingAddress(true);
  const getCustomerName = () => `${customerFirstName.trim()} ${customerLastName.trim()}`.trim();
  const hasCustomerDetails = Boolean(
    customerFirstName.trim() &&
    customerLastName.trim() &&
    customerDetails.email.trim() &&
    customerDetails.phone.trim() &&
    customerDetails.address.trim() &&
    customerDetails.city.trim() &&
    customerDetails.state.trim() &&
    customerDetails.post_code.trim() &&
    customerDetails.country.trim()
  );
  const handleSaveAddress = () => {
    if (!customerFirstName.trim() || !customerLastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }
    setCustomerDetails((current) => ({ ...current, name: getCustomerName() }));
    setIsEditingAddress(false);
  };

  const handleInputChange = (field: keyof typeof customerDetails, value: string) => {
    setCustomerDetails(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'country') updated.state = '';
      return updated;
    });
    setSelectedQuote(null);
    setDeliveryQuote(null);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) setDeliveryNotes(value);
  };

  const validateCouponCode = async (code: string): Promise<AppliedCoupon> => {
    const response = await fetch('/api/coupon/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storeId, code }),
    });

    const result = await response.json();

    if (!response.ok || result.status !== 'success' || !result.data) {
      throw new Error(result.message || 'Coupon not approved. Check the code and try again.');
    }

    const amount = Number(result.data.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Coupon response did not include a valid discount amount.');
    }

    return {
      code: String(result.data.code || code),
      amount,
      store_id: result.data.store_id,
      store_name: result.data.store_name,
      startDate: result.data.startDate,
      expiryDate: result.data.expiryDate,
      usageLimit: result.data.usageLimit,
    };
  };

  const handleApplyCoupon = async () => {
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      toast.error('Enter a coupon code');
      return;
    }

    if (!isFoodStore) {
      toast.error('Coupon not approved for this storefront.');
      return;
    }

    if (!enabledFulfillmentModes.includes('vendor')) {
      toast.error('Coupon requires Vendor Delivery, which is not available for this storefront.');
      return;
    }

    setIsApplyingCoupon(true);

    try {
      const coupon = await validateCouponCode(normalizedCode);

      setAppliedCoupon(coupon);
      setCouponCode(coupon.code);
      setDeliveryMethod('vendor');
      setSelectedQuote({ fee: 0, rate_card_id: null, name: 'Vendor Delivery' });
      setDeliveryQuote(null);
      setIsEditingDelivery(false);
      toast.success(`Coupon applied successfully. ₦${coupon.amount.toLocaleString()} has been applied to your order.`);
    } catch (error) {
      setAppliedCoupon(null);
      toast.error(error instanceof Error ? error.message : 'Coupon not approved. Check the code and try again.');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setSelectedQuote(null);
    setDeliveryQuote(null);
    setIsEditingDelivery(true);
  };

  const validateCheckout = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!deliveryMethod) { toast.error("Please select a delivery method"); return false; }
    if (deliveryMethod === 'vendor' && vendorDeliveryRates.length > 0 && !appliedCoupon && !selectedVendorDeliveryRate) {
      toast.error("Please select a vendor delivery location and price");
      setShowVendorDeliveryModal(true);
      return false;
    }
    if (!emailRegex.test(customerDetails.email)) { toast.error("Please enter a valid email address"); return false; }
    if (customerDetails.phone.length < 7) { toast.error("Please enter a valid phone number"); return false; }
    if (!customerFirstName.trim() || !customerLastName.trim()) { toast.error("First name and last name are required"); return false; }
    if (!customerDetails.address.trim()) { toast.error("Address is required"); return false; }
    if (!customerDetails.city.trim()) { toast.error("City is required"); return false; }
    if (!customerDetails.state.trim()) { toast.error("State / Region is required"); return false; }
    if (!customerDetails.post_code.trim()) { toast.error("Post Code is required"); return false; }
    if (cart.length === 0) { toast.error("Your cart is empty"); return false; }
    return true;
  };

  const getCustomerInfo = () => ({
    name: getCustomerName(),
    email: customerDetails.email,
    phone: `${phoneDialCode}${customerDetails.phone}`,
    address: customerDetails.address,
    city: customerDetails.city,
    state: customerDetails.state,
    post_code: customerDetails.post_code,
    country: customerDetails.country,
  });

  // Backend accepts payment_method 'kuvarpay' for crypto — 'crypto' is only our internal UI value.
  const resolvePaymentMethod = () => {
    if (isZeroBalanceOrder) return 'coupon';
    return paymentMethod === 'crypto' ? 'kuvarpay' : paymentMethod;
  };

  const cryptoOptionField = () =>
    !isZeroBalanceOrder && paymentMethod === 'crypto' && selectedCryptoChain && selectedCryptoCurrency
      ? { crypto_option: { network: selectedCryptoChain, currency: selectedCryptoCurrency } }
      : {};

  // ── Regular product payload ─────────────────────────────────────────────────
  const buildBasePayload = () => ({
    store_id: storeId,
    items: cart.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderItem: any = {
        product_id: item.product_id || item.originalProductId || item.id,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
        name: item.name,
      };
      if (item.variant && (item.variant.size || item.variant.color)) {
        orderItem.variant = { size: item.variant.size || "", color: item.variant.color || "" };
      }
      return orderItem;
    }),
    total_amount: orderPayloadItemsTotal,
    original_items_total: itemsTotal,
    total_items: cart.reduce((sum, item) => sum + item.quantity, 0),
    payment_method: resolvePaymentMethod(),
    ...cryptoOptionField(),
    delivery_method: deliveryMethod,
    delivery_fee: deliveryFee,
    ...(selectedVendorDeliveryRate && !appliedCoupon && {
      delivery_rate: {
        id: selectedVendorDeliveryRate.id,
        location: selectedVendorDeliveryRate.location,
        fee: selectedVendorDeliveryRate.rate,
      },
    }),
    coupon_applied: Boolean(appliedCoupon),
    ...(appliedCoupon && {
      coupon_code: appliedCoupon.code,
      coupon: {
        code: appliedCoupon.code,
        coupon_value: appliedCoupon.amount,
        applied_discount: couponDiscount,
        unused_value: Math.max(appliedCoupon.amount - couponDiscount, 0),
        remaining_item_balance: remainingItemsTotal,
        free_delivery: true,
        required_delivery_method: 'vendor',
      },
    }),
    customer_info: getCustomerInfo(),
    notes: deliveryNotes || "No delivery notes provided",
  });

  // ── Food order payload ──────────────────────────────────────────────────────
  const buildFoodPayload = () => ({
    store_id: storeId,
    total_amount: orderPayloadItemsTotal,
    original_items_total: itemsTotal,
    total_items: cart.reduce((sum, item) => sum + item.quantity, 0),
    payment_method: resolvePaymentMethod(),
    ...cryptoOptionField(),
    delivery_method: deliveryMethod, // sends 'relay' or 'pickup' as-is to backend
    delivery_fee: deliveryFee,
    ...(selectedVendorDeliveryRate && !appliedCoupon && {
      delivery_rate: {
        id: selectedVendorDeliveryRate.id,
        location: selectedVendorDeliveryRate.location,
        fee: selectedVendorDeliveryRate.rate,
      },
    }),
    coupon_applied: Boolean(appliedCoupon),
    ...(appliedCoupon && {
      coupon_code: appliedCoupon.code,
      coupon: {
        code: appliedCoupon.code,
        coupon_value: appliedCoupon.amount,
        applied_discount: couponDiscount,
        unused_value: Math.max(appliedCoupon.amount - couponDiscount, 0),
        remaining_item_balance: remainingItemsTotal,
        free_delivery: true,
        required_delivery_method: 'vendor',
      },
    }),
    customer_info: getCustomerInfo(),
    notes: deliveryNotes || "No delivery notes provided",
    items: cart.map(item => {
      const sel = item.foodSelection!;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderItem: any = {
        product_id: sel.productUid,
        name: item.name,
        weight: 0,
        image: typeof item.image === 'string' ? item.image : '',
      };
      if (sel.type === 'Simple' && sel.portion) {
        orderItem.portion = sel.portion.map(p => ({ uid: p.uid, quantity: item.quantity }));
      }
      if (sel.type === 'Customizable') {
        orderItem.servingType = sel.servingType;
        orderItem.quantity_customizable = item.quantity;
      }
      if (sel.addOnGroup) {
        orderItem.addOnGroup = sel.addOnGroup.map(g => ({
          uid: g.uid,
          addOnGroupOption: g.addOnGroupOption.map(o => ({
            uid: o.uid,
            quantity: sel.type === 'Customizable' ? o.quantity : o.quantity * item.quantity,
          })),
        }));
      }
      if (sel.type === 'Bundle' && sel.bundleConfig) {
        orderItem.bundleConfig = { uid: sel.bundleConfig.uid, quantity: item.quantity };
      }
      return orderItem;
    }),
  });

  // ── Quote — for sendbox, gig, and relay ───────────────────────────────────
  const handleSaveDelivery = async () => {
    if (!deliveryMethod) {
      toast.error('Please select a delivery method');
      return;
    }

    if (deliveryMethod === 'vendor' && vendorDeliveryRates.length > 0 && !appliedCoupon && !selectedVendorDeliveryRate) {
      toast.error('Please select a vendor delivery location and price');
      setShowVendorDeliveryModal(true);
      return;
    }

    if (!needsQuote) {
      // pickup goes straight through — no quote needed
      setIsEditingDelivery(false);
      return;
    }

    if (!validateCheckout()) return;

    setIsFetchingQuote(true);
    setIsEditingDelivery(false);

    try {
      const payload = isFood ? buildFoodPayload() : buildBasePayload();

      const quoteUrl = isFood ? '/api/orders/food/quote' : '/api/orders/quote';
      const response = await fetch(quoteUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (process.env.NODE_ENV !== 'production' && isFood) {
        console.log('Food quote parsed response:', result);
      }
      if (!response.ok) throw new Error(result.message || 'Failed to fetch delivery quote');

      const method = result.data?.delivery_method;
      const quoteData = result.data?.quote;

      if (isFood) {
        const orderKey = result.data?.orderKey;
        if (!orderKey) throw new Error('Food quote response did not include an order key');

        if (deliveryMethod === 'pickup' || method === 'pickup') {
          setSelectedQuote({ fee: 0, rate_card_id: null, name: 'Store Pickup', orderKey });
          toast.success('Pickup order details saved');
          return;
        }

        if (deliveryMethod === 'vendor' || method === 'vendor') {
          setSelectedQuote({
            fee: 0,
            rate_card_id: null,
            name: 'Vendor Delivery',
            orderKey,
          });
          toast.success('Vendor delivery details saved');
          return;
        }

        const relayQuote = Array.isArray(quoteData) ? quoteData[0] : quoteData;
        if (!relayQuote && typeof quoteData !== 'number') {
          throw new Error('No Relay delivery quote was returned');
        }
        const fee = typeof relayQuote?.fee === 'number'
          ? relayQuote.fee
          : typeof quoteData === 'number'
          ? quoteData
          : 0;
        const rateCardId =
          typeof relayQuote?.rate_card_id === 'string' || typeof relayQuote?.rate_card_id === 'number'
            ? relayQuote.rate_card_id
            : null;
        if (!rateCardId) {
          throw new Error('Relay quote response did not include a rate card id');
        }
        const quoteName = typeof relayQuote?.name === 'string' ? relayQuote.name : 'Relay by Chowdeck';

        setSelectedQuote({ fee, rate_card_id: rateCardId, name: quoteName, orderKey });
        toast.success(`Relay delivery fee: ₦${fee.toLocaleString()} added to total`);
        return;
      }

      if (method === 'sendbox') {
        const quotes: SendboxQuote[] = Array.isArray(quoteData) ? quoteData : [];
        if (quotes.length === 0) { toast.error('No delivery options available'); return; }
        setDeliveryQuote({ sendboxQuotes: quotes, deliveryMethod: 'sendbox' });
        setShowSendboxModal(true);
      } else if (method === 'gig') {
        const gigQuote: GigQuote = quoteData;
        if (!gigQuote || !gigQuote.fee) throw new Error('Invalid GIG quote response');
        setDeliveryQuote({ gigQuote, deliveryMethod: 'gig' });
        setSelectedQuote({ fee: gigQuote.fee, rate_card_id: null, name: 'GIG Logistics' });
        toast.success(`GIG delivery fee: ₦${gigQuote.fee.toLocaleString()} added to total`);
      } else if (method === 'relay') {
        // Relay quote — same shape as GIG (single fee, no rate_card_id)
        const relayFee = typeof quoteData?.fee === 'number' ? quoteData.fee : quoteData;
        const fee = typeof relayFee === 'number' ? relayFee : 0;
        setSelectedQuote({ fee, rate_card_id: null, name: 'Relay by Chowdeck' });
        toast.success(`Relay delivery fee: ₦${fee.toLocaleString()} added to total`);
      } else {
        toast.error('Unsupported delivery method returned');
      }
    } catch (error) {
      console.error('Quote error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to get delivery quote');
    } finally {
      setIsFetchingQuote(false);
    }
  };

  const handleSelectSendboxQuote = (quote: SendboxQuote) => {
    setSelectedQuote({ fee: quote.fee, rate_card_id: quote.rate_card_id, name: quote.name });
    setShowSendboxModal(false);
    toast.success(`${quote.name} selected — ₦${quote.fee.toLocaleString()} delivery fee added`);
  };

  // ── Order creation ──────────────────────────────────────────────────────────
  const createOrder = async () => {
    if (isFood) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { ...buildFoodPayload() };
      const hasSavedVendorDelivery = deliveryMethod === 'vendor' &&
        (vendorDeliveryRates.length === 0 || Boolean(selectedVendorDeliveryRate));
      if (!hasCouponVendorDelivery && !hasSavedVendorDelivery && !selectedQuote?.orderKey) {
        throw new Error('Please save delivery details to prepare this food order');
      }
      if (!appliedCoupon && selectedQuote?.orderKey) {
        payload.orderKey = selectedQuote.orderKey;
      }
      if (selectedQuote?.rate_card_id) {
        payload.rate_card_id = selectedQuote.rate_card_id;
      }
      const response = await fetch('/api/orders/food/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Failed to create food order: ${response.status}`);
      if (result.status !== 'success') throw new Error(result.message || 'Food order creation failed');
      return result;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { ...buildBasePayload() };
    if (deliveryMethod === 'sendbox' && selectedQuote?.rate_card_id) {
      payload.rate_card_id = selectedQuote.rate_card_id;
    }
    console.log('📦 Creating order:', JSON.stringify(payload, null, 2));
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || `Failed to create order: ${response.status}`);
    if (result.status !== 'success') throw new Error(result.message || 'Order creation failed');
    return result;
  };

  const getCustomerNameParts = () => {
    const [firstName, ...rest] = customerDetails.name.trim().split(/\s+/);
    return {
      firstName: firstName || '',
      lastName: rest.join(' '),
    };
  };

  const launchKlumpCheckout = (orderResult: CheckoutOrderResult) => {
    const publicKey = process.env.NEXT_PUBLIC_KLUMP_PUBLIC_KEY;

    if (!publicKey) {
      throw new Error('Klump public key is not configured');
    }

    const KlumpCheckout = getKlumpConstructor();

    if (!KlumpCheckout) {
      throw new Error('Klump checkout script is not available yet. Please refresh and try again.');
    }

    const orderDetails = orderResult.data?.order;
    const paymentDetails = orderResult.data?.payment;
    const transactionDetails = orderResult.data?.transaction;
    const paymentReference = transactionDetails?.reference || paymentDetails?.reference || orderDetails?.order_number;
    const { firstName, lastName } = getCustomerNameParts();
    const cleanPhone = customerDetails.phone.replace(/\D/g, '');
    const normalizedPhone = phoneDialCode === '+234' && cleanPhone && !cleanPhone.startsWith('0')
      ? `0${cleanPhone}`
      : cleanPhone;
    const customerPhone = normalizedPhone.length === 11 ? normalizedPhone : undefined;
    const customerFirstName = firstName.length >= 2 ? firstName : undefined;
    const customerLastName = lastName.length >= 2 ? lastName : undefined;
    const merchantReference = String(paymentReference || orderDetails?.order_number || Date.now());

    localStorage.setItem('pending_order', JSON.stringify({
      orderId: orderDetails?.order_number,
      customerDetails: { ...customerDetails, phone: `${phoneDialCode}${customerDetails.phone}` },
      cart,
      total,
      deliveryNotes,
      orderData: orderResult,
      paymentReference,
      paymentProvider: 'klump',
      verificationStatus: 'pending_backend_integration',
    }));

    localStorage.setItem('current_store_id', storeId);
    localStorage.setItem('payment_reference', merchantReference);

    new KlumpCheckout({
      publicKey,
      data: {
        amount: Math.round(total),
        shipping_fee: Math.round(deliveryFee),
        currency: 'NGN',
        ...(customerFirstName && { first_name: customerFirstName }),
        ...(customerLastName && { last_name: customerLastName }),
        email: customerDetails.email,
        ...(customerPhone && { phone: customerPhone }),
        merchant_reference: merchantReference,
        redirect_url: `${window.location.origin}/payment/callback?provider=klump&store_id=${storeId}`,
        meta_data: {
          store_id: storeId,
          order_id: orderDetails?.id,
          order_number: orderDetails?.order_number,
          payment_reference: merchantReference,
        },
        items: cart.map(item => ({
          name: item.name,
          unit_price: Math.round(item.price),
          quantity: item.quantity,
          image_url: typeof item.image === 'string' ? item.image : undefined,
          item_url: `${window.location.origin}/storefront/${storeId}`,
        })),
      },
      onLoad: () => {
        setIsKlumpReady(true);
      },
      onSuccess: (response) => {
        localStorage.setItem('klump_checkout_response', JSON.stringify(response));
        sessionStorage.removeItem(getCheckoutDraftKey(storeId));
        clearCart();
        window.location.href = `/payment/callback?provider=klump&store_id=${storeId}&reference=${encodeURIComponent(merchantReference)}`;
      },
      onError: (error) => {
        console.error('Klump checkout error:', error);
        toast.error('Klump checkout failed. Please try again or use Paystack.');
        setIsProcessingPayment(false);
      },
      onClose: () => {
        setIsProcessingPayment(false);
      },
    });
  };

  const handleProceedToPayment = async () => {
    if (!validateCheckout()) return;
    if (paymentMethod === 'crypto' && !isZeroBalanceOrder && (!selectedCryptoChain || !selectedCryptoCurrency)) {
      toast.error('Please select a crypto network and currency before continuing.');
      return;
    }
    if (needsQuote && !selectedQuote && !hasCouponVendorDelivery) {
      toast.error('Please save delivery details to get a delivery quote first');
      return;
    }

    setIsProcessingPayment(true);
    try {
      if (appliedCoupon) {
        const freshCoupon = await validateCouponCode(appliedCoupon.code);
        if (freshCoupon.amount !== appliedCoupon.amount) {
          throw new Error('Coupon value changed. Please apply the coupon again.');
        }
        setAppliedCoupon(freshCoupon);
      }

      const orderResult = await createOrder();

      if (isZeroBalanceOrder) {
        const orderDetails = orderResult.data?.order || orderResult.data;
        if (!orderDetails?.order_number) {
          throw new Error('Order details not found in response');
        }
        localStorage.setItem('pending_order', JSON.stringify({
          orderId: orderDetails.order_number,
          customerDetails: { ...customerDetails, phone: `${phoneDialCode}${customerDetails.phone}` },
          cart,
          total,
          deliveryNotes,
          orderData: orderResult,
          coupon: appliedCoupon,
          paymentStatus: 'fully_covered_by_coupon',
        }));
        localStorage.setItem('current_store_id', storeId);
        sessionStorage.removeItem(getCheckoutDraftKey(storeId));
        clearCart();
        toast.success('Your order has been placed successfully.');
        window.location.href = `/payment/success?store_id=${storeId}&reference=${encodeURIComponent(orderDetails.order_number)}&status=fully_covered_by_coupon`;
        return;
      }

      if (paymentMethod === 'klump') {
        launchKlumpCheckout(orderResult);
        return;
      }

      if (paymentMethod === 'crypto') {
        const orderDetails = orderResult.data?.order;
        const paymentInit = orderResult.data?.paymentInit as CryptoPaymentInit | undefined;

        if (!orderDetails || !paymentInit?.depositAddress) {
          throw new Error('Crypto payment details not found in response');
        }

        localStorage.setItem('pending_order', JSON.stringify({
          orderId: orderDetails.order_number,
          customerDetails: { ...customerDetails, phone: `${phoneDialCode}${customerDetails.phone}` },
          cart,
          total,
          deliveryNotes,
          orderData: orderResult,
          paymentReference: paymentInit.reference,
          coupon: appliedCoupon,
        }));
        localStorage.setItem('current_store_id', storeId);
        localStorage.setItem('payment_reference', paymentInit.reference);

        sessionStorage.removeItem(getCheckoutDraftKey(storeId));
        clearCart();
        setCryptoPaymentInit(paymentInit);
        return;
      }

      const orderDetails = orderResult.data?.order;
      const paymentDetails = orderResult.data?.payment;
      const transactionDetails = orderResult.data?.transaction;

      if (orderDetails && paymentDetails?.authorization_url) {
        const paymentReference = transactionDetails?.reference || paymentDetails.reference;

        localStorage.setItem('pending_order', JSON.stringify({
          orderId: orderDetails.order_number,
          customerDetails: { ...customerDetails, phone: `${phoneDialCode}${customerDetails.phone}` },
          cart,
          total: Number(paymentDetails.total_paid) || Number(orderDetails.order_total),
          deliveryNotes,
          orderData: orderResult,
          paymentReference,
          coupon: appliedCoupon,
        }));

        localStorage.setItem('current_store_id', storeId);
        if (paymentReference) localStorage.setItem('payment_reference', paymentReference);

        sessionStorage.removeItem(getCheckoutDraftKey(storeId));
        clearCart();
        toast.success("Redirecting to payment...");
        window.location.href = paymentDetails.authorization_url;
      } else {
        throw new Error('Order details not found in response');
      }
    } catch (error) {
      toast.error(`Order Failed — ${error instanceof Error ? error.message : "Please try again."}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // ── Delivery method section ─────────────────────────────────────────────────
  // Food stores can use Relay, Pickup, or Vendor Delivery.
  const visibleModes = isFoodStore
    ? enabledFulfillmentModes.filter(
        m => (appliedCoupon ? m === 'vendor' : m === 'relay' || m === 'pickup' || m === 'vendor')
      )
    : enabledFulfillmentModes.filter(m => m !== 'relay');

  const DeliveryMethodSection = () => {
    if (isLoadingModes) {
      return (
        <div className='mb-6'>
          <Label className='text-xs mb-3 block'>Delivery Method *</Label>
          <div className='flex items-center justify-center py-8'>
            <Loader2 className='w-6 h-6 animate-spin text-primary' />
          </div>
        </div>
      );
    }

    if (visibleModes.length === 0) {
      return (
        <div className='mb-6'>
          <Label className='text-xs mb-3 block'>Delivery Method *</Label>
          <div className='p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
            <p className='text-sm text-red-600 dark:text-red-400'>No delivery methods are currently available for this store.</p>
          </div>
        </div>
      );
    }

    return (
      <div className='mb-6'>
        <Label className='text-xs mb-3 block'>Delivery Method *</Label>
          <RadioGroup
          value={deliveryMethod ?? undefined}
          onValueChange={(value) => {
            if (appliedCoupon && value !== 'vendor') {
              toast.error('This coupon requires Vendor Delivery.');
              return;
            }
            setDeliveryMethod(value as DeliveryMethodType);
            setSelectedQuote(null);
            setDeliveryQuote(null);
            setSelectedVendorDeliveryRate(null);
            if (value === 'vendor' && !appliedCoupon && vendorDeliveryRates.length > 0) {
              setVendorDeliverySearch('');
              setShowShippingMethodModal(false);
              setShowVendorDeliveryModal(true);
            }
          }}
          className="space-y-3"
          disabled={!isEditingDelivery}
        >
          {visibleModes.map(mode => (
            <div key={mode} className="flex items-center space-x-2">
              <RadioGroupItem value={mode} id={mode} />
              <Label htmlFor={mode} className="text-sm font-normal cursor-pointer">
                {DELIVERY_METHOD_LABELS[mode as DeliveryMethodType] ?? mode}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {deliveryMethod && DELIVERY_METHOD_DESCRIPTIONS[deliveryMethod] && (
          <p className="text-xs text-[#A0A0A0] mt-2">
            {DELIVERY_METHOD_DESCRIPTIONS[deliveryMethod]}
          </p>
        )}
        {appliedCoupon && (
          <p className="text-xs text-[#4FCA6A] mt-2">
            Coupon applied: Vendor Delivery is free and Relay is unavailable for this order.
          </p>
        )}

        {selectedQuote && (
          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-700 dark:text-green-400">✓ {selectedQuote.name}</p>
              <p className="text-xs text-green-600 dark:text-green-500">Delivery fee: ₦{selectedQuote.fee.toLocaleString()}</p>
            </div>
            {needsQuote && !isEditingDelivery && (
              <button
                onClick={() => { setIsEditingDelivery(true); setSelectedQuote(null); setDeliveryQuote(null); }}
                className="text-xs text-primary underline"
              >
                Change
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    if (!isEditingDelivery && !isFetchingQuote && (selectedQuote || !needsQuote)) {
      setShowShippingMethodModal(false);
    }
  }, [isEditingDelivery, isFetchingQuote, selectedQuote, needsQuote]);

  const vendorBrand = <VendorBrand storeId={storeId} brand={storeBrand} />;
  const updateCheckoutQuantity = (id: string | number, quantity: number) => {
    updateQuantity(id, quantity);
    if (needsQuote && !hasCouponVendorDelivery) {
      setSelectedQuote(null);
      setDeliveryQuote(null);
      setIsEditingDelivery(true);
    }
  };

  return (
    <div className='min-h-screen bg-white'>
      {/* Mobile Header */}
      <div className='sticky top-0 z-10 border-b bg-white p-4 md:px-8'>
        <div className='flex items-center justify-between'>
          {vendorBrand}
          <div className='flex gap-2'><CartButton /></div>
        </div>
      </div>

      <div className='mx-auto flex max-w-[1440px] flex-col gap-8 px-4 py-8 md:flex-row md:px-8 md:py-12'>
        {/* Left: Order Summary */}
        <div className={`order-2 w-full min-w-0 md:w-1/2 ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
          
          <Card className='gap-0 rounded-none border-0 bg-[#F7F7F7] py-6 shadow-none'>
            <CardContent className='space-y-4 px-5 pb-2 sm:px-7'>
              <h3 className='pb-5 text-center text-2xl font-semibold uppercase'>Your order</h3>
              <div className='bg-white px-4'>
                <div className='flex justify-between border-b border-dashed py-4 text-xs font-semibold uppercase'><span>Product</span><span>Subtotal</span></div>
                {cart.map((item) => (
                  <div key={item.id} className='flex items-start gap-3 border-b border-dashed py-4'>
                    <Image src={item.image} alt={item.name} width={72} height={84} className='h-20 w-16 shrink-0 object-cover' />
                    <div className='min-w-0 flex-1'>
                      <p className='break-words text-sm font-medium leading-5'>{item.name}</p>
                      <div className='mt-2 inline-flex items-center border'>
                        <button type='button' aria-label={`Decrease ${item.name} quantity`} className='flex h-8 w-8 items-center justify-center' disabled={item.quantity <= 1 || isProcessingPayment} onClick={() => updateCheckoutQuantity(item.id, item.quantity - 1)}><Minus className='h-3.5 w-3.5' /></button>
                        <span className='flex h-8 min-w-8 items-center justify-center border-x text-sm'>{item.quantity}</span>
                        <button type='button' aria-label={`Increase ${item.name} quantity`} className='flex h-8 w-8 items-center justify-center' disabled={isProcessingPayment} onClick={() => updateCheckoutQuantity(item.id, item.quantity + 1)}><Plus className='h-3.5 w-3.5' /></button>
                      </div>
                    </div>
                    <span className='shrink-0 text-xs sm:text-sm'>₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Subtotal</span>
                <span className='text-sm'>₦{itemsTotal.toLocaleString()}</span>
              </div>
              {selectedQuote && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Delivery Fee ({selectedQuote.name})</span>
                  <span className='text-sm'>{appliedCoupon ? 'Free' : `₦${selectedQuote.fee.toLocaleString()}`}</span>
                </div>
              )}
              {appliedCoupon && !selectedQuote && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Delivery Fee (Vendor Delivery)</span>
                  <span className='text-sm'>Free</span>
                </div>
              )}
              {appliedCoupon && (
                <>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Coupon ({appliedCoupon.code})</span>
                    <span className='text-sm text-[#4FCA6A]'>-₦{couponDiscount.toLocaleString()}</span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm'>Remaining item balance</span>
                    <span className='text-sm'>₦{remainingItemsTotal.toLocaleString()}</span>
                  </div>
                </>
              )}
              {needsQuote && !selectedQuote && !appliedCoupon && (
                <div className='flex items-center justify-between text-xs text-[#A0A0A0]'>
                  <span>Delivery fee</span>
                  <span>Calculated after saving delivery</span>
                </div>
              )}
            </CardContent>
            <CardContent className='pb-2 border-b border-[#F5F5F5] dark:border-[#1F1F1F] space-y-3 pt-4'>
              <div className="space-y-3 rounded-lg border border-[#F5F5F5] p-3 dark:border-[#1F1F1F]">
                <Label className='text-xs mb-1'>Have a coupon code?</Label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input
                    value={couponCode}
                    onChange={(e) => {
                      setCouponCode(e.target.value.toUpperCase());
                      if (appliedCoupon) {
                        setAppliedCoupon(null);
                        setSelectedQuote(null);
                        setDeliveryQuote(null);
                        setIsEditingDelivery(true);
                      }
                    }}
                    placeholder="Enter coupon code"
                    disabled={isApplyingCoupon}
                    className="flex-1"
                  />
                  {appliedCoupon ? (
                    <Button type="button" variant="outline" onClick={handleRemoveCoupon}>
                      Remove
                    </Button>
                  ) : (
                    <Button type="button" onClick={handleApplyCoupon} disabled={isApplyingCoupon || isLoadingModes}>
                      {isApplyingCoupon ? <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Applying...</> : 'Apply coupon'}
                    </Button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="rounded-lg border border-[#4FCA6A]/30 bg-[#4FCA6A]/10 p-3 text-sm text-[#2E7D42]">
                    Coupon applied successfully. ₦{couponDiscount.toLocaleString()} has been applied to your order.
                  </div>
                )}
              </div>
              <div className='flex items-center justify-between border-y border-dashed py-4 text-xl font-semibold'>
                <span>Total to pay</span><span>₦{total.toLocaleString()}</span>
              </div>
              {!isZeroBalanceOrder && <h3 className='pt-4 text-2xl font-semibold'>Choose Payment Method</h3>}
              {isZeroBalanceOrder ? (
                <div className="rounded-lg border border-[#4FCA6A]/30 bg-[#4FCA6A]/10 p-3 text-sm text-[#2E7D42]">
                  Fully covered by coupon. No payment gateway is required.
                </div>
              ) : (
                <>
                  <div role="group" aria-label="Payment method" className="grid grid-cols-2 gap-3">
                    {enabledPaymentMethods.paystack && (
                      <button type="button" aria-label="Paystack" aria-pressed={paymentMethod === 'paystack'}
                        onClick={() => setPaymentMethod('paystack')}
                        className={`flex min-h-16 min-w-0 items-center justify-center rounded-lg border-2 px-3 py-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B14] focus-visible:ring-offset-2 ${paymentMethod === 'paystack' ? 'border-[#005B14] bg-[#F0FAF2]' : 'border-[#E5E7EB] bg-white hover:border-[#005B14]/50'}`}>
                        <span aria-hidden="true" className="[&>svg]:max-w-full"><PaystackLogo /></span>
                      </button>
                    )}
                    {canUseKlump && enabledPaymentMethods.klump && (
                      <button type="button" aria-pressed={paymentMethod === 'klump'}
                        onClick={() => setPaymentMethod('klump')}
                        className={`flex min-h-16 min-w-0 items-center justify-center rounded-lg border-2 px-3 py-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B14] focus-visible:ring-offset-2 ${paymentMethod === 'klump' ? 'border-[#005B14] bg-[#F0FAF2]' : 'border-[#E5E7EB] bg-white hover:border-[#005B14]/50'}`}>
                        Klump
                      </button>
                    )}
                    {enabledPaymentMethods.crypto && (
                      <button type="button" aria-pressed={paymentMethod === 'crypto'}
                        onClick={() => setPaymentMethod('crypto')}
                        className={`flex min-h-16 min-w-0 items-center justify-center rounded-lg border-2 px-3 py-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#005B14] focus-visible:ring-offset-2 ${paymentMethod === 'crypto' ? 'border-[#005B14] bg-[#F0FAF2]' : 'border-[#E5E7EB] bg-white hover:border-[#005B14]/50'}`}>
                        Crypto
                      </button>
                    )}
                  </div>
                        {enabledPaymentMethods.crypto && paymentMethod === 'crypto' && (
                          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <Label className="text-xs">Network</Label>
                              <Select value={selectedCryptoChain} onValueChange={setSelectedCryptoChain}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={isLoadingCryptoChains ? 'Loading...' : 'Select network'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {cryptoChains.map((chain) => (
                                    <SelectItem key={chain} value={chain}>{chain.toUpperCase()}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1.5">
                              <Label className="text-xs">Currency</Label>
                              <Select value={selectedCryptoCurrency} onValueChange={setSelectedCryptoCurrency} disabled={!selectedCryptoChain}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder={isLoadingCryptoCurrencies ? 'Loading...' : 'Select currency'} />
                                </SelectTrigger>
                                <SelectContent>
                                  {cryptoCurrencies.map((currency) => (
                                    <SelectItem key={currency.ticker} value={currency.ticker}>
                                      {currency.ticker} — {currency.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {isConvertingCryptoPrice && (
                              <p className="col-span-full text-xs text-[#A0A0A0]">Converting price...</p>
                            )}
                            {cryptoConvertedPrice && !isConvertingCryptoPrice && (
                              <p className="col-span-full text-xs font-medium text-foreground">
                                You will pay ≈ {cryptoConvertedPrice.fromAmount} {cryptoConvertedPrice.fromCurrency}
                              </p>
                            )}
                          </div>
                        )}
                  {isLoadingPaymentMethods && (
                    <p className="text-xs text-[#A0A0A0]">Loading store payment methods...</p>
                  )}
                  {canUseKlump && enabledPaymentMethods.klump && <div id="klump__checkout" className="hidden" />}
                  {canUseKlump && enabledPaymentMethods.klump && (
                    <Script
                      id="klump-checkout-sdk"
                      src="https://js.useklump.com/klump.js"
                      strategy="afterInteractive"
                      onLoad={() => setIsKlumpReady(!!getKlumpConstructor())}
                    />
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className='pt-4'>
              <Button
                className='h-14 w-full rounded-none bg-[#4FCA6A] text-base hover:bg-[#45b85e]'
                onClick={handleProceedToPayment}
                disabled={
                  isProcessingPayment ||
                  cart.length === 0 ||
                  isLoadingModes ||
                  isFetchingQuote ||
                  !deliveryMethod ||
                  (needsQuote && !selectedQuote && !hasCouponVendorDelivery)
                }
              >
                {isProcessingPayment ? (
                  <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Processing...</>
                ) : !deliveryMethod ? (
                  'Select a delivery method'
                ) : needsQuote && !selectedQuote && !hasCouponVendorDelivery ? (
                  'Save delivery to continue'
                ) : isZeroBalanceOrder ? (
                  'Place order'
                ) : (
                  paymentMethod === 'klump' ? 'Pay with Klump' : 'Proceed to Payment'
                )}
              </Button>
            </CardFooter>
          </Card>

          <p className='text-center text-sm mt-4'>
            By proceeding, you are automatically accepting the{' '}
            <Link
              href={`/storefront/${storeId}/terms`}
              className='font-medium text-[#4FCA6A] hover:underline'
            >
              Terms & Conditions
            </Link>
          </p>
        </div>

        {/* Right: Forms */}
        <div className='order-1 w-full min-w-0 md:w-1/2'>

          {/* 1. Delivery details */}
          <Card className='gap-0 border-0 p-0 shadow-none'>
            <CardHeader className='px-0 pb-4'>
              <h3 className='text-2xl font-semibold'>Delivery Details</h3>
            </CardHeader>

            <CardContent className='rounded-lg border border-[#D9DDE1] bg-[#F8F9FA] p-6'>
              <div className='flex justify-center'>
                <Button variant='outline' className='h-12 rounded-none border-[#005B14] bg-white px-6 text-[#005B14]' onClick={handleEditAddress}>
                  {hasCustomerDetails ? 'Change delivery details' : 'Add delivery details'}
                </Button>
              </div>
              {hasCustomerDetails ? (
                <div className='mt-5 grid gap-3 text-sm text-[#4B5563] sm:grid-cols-2'>
                  <div><p className='text-xs text-[#A0A0A0]'>Customer</p><p className='font-medium text-foreground'>{getCustomerName()}</p></div>
                  <div><p className='text-xs text-[#A0A0A0]'>Phone</p><p className='font-medium text-foreground'>{phoneDialCode} {customerDetails.phone}</p></div>
                  <div><p className='text-xs text-[#A0A0A0]'>Email</p><p className='break-all font-medium text-foreground'>{customerDetails.email}</p></div>
                  <div><p className='text-xs text-[#A0A0A0]'>Delivery address</p><p className='font-medium text-foreground'>{customerDetails.address}, {customerDetails.city}, {customerDetails.state}</p></div>
                </div>
              ) : (
                null
              )}
            </CardContent>
          </Card>

          {/* 2. Delivery Details */}
          <Card className='mt-7 gap-0 border-0 p-0 shadow-none'>
            <CardContent className='p-0'>

              <div className='mb-4'>
                <Label className='mb-3 block text-sm'>Note for merchant</Label>
                <div className='relative'>
                  <textarea
                    className='w-full min-h-[100px] px-3 py-2 text-sm border border-[#E0E0E0] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#4FCA6A] disabled:bg-gray-50'
                    value={deliveryNotes}
                    onChange={handleNotesChange}
                    placeholder="Add any extra information for the merchant"
                    maxLength={200}
                  />
                  <span className='absolute bottom-2 right-3 text-xs text-[#A0A0A0]'>{deliveryNotes.length}/200</span>
                </div>
              </div>

              <div className='mt-7'>
                  <h3 className='mb-5 text-lg font-semibold uppercase'>Click here to select shipping rate</h3>
                  <div className='rounded-lg border border-[#D9DDE1] bg-[#F8F9FA] px-5 py-7 text-center'>
                  <p className='mb-3 text-sm text-[#818896]'>Click the button below to choose a shipping method</p>
                  <button
                    type='button'
                    onClick={() => {
                      setIsEditingDelivery(true);
                      setShowShippingMethodModal(true);
                    }}
                    className='border border-[#005B14] bg-white px-6 py-3 text-sm font-medium uppercase text-[#005B14] hover:bg-primary/5'
                  >
                    <span className='block text-sm font-medium text-primary'>
                      Select a shipping price
                    </span>
                  </button>
                  {selectedQuote && <p className='mt-4 text-sm text-[#71717A]'>{selectedQuote.name} · {appliedCoupon ? 'Free' : `₦${selectedQuote.fee.toLocaleString()}`}</p>}
                  </div>
                </div>
            </CardContent>
          </Card>

          <Link href={`/storefront/${storeId}`} className='flex text-sm items-center text-[#4FCA6A] mt-6 hover:underline'>
            <ArrowIcon /> Go back & continue shopping
          </Link>
        </div>
      </div>

      {/* Customer details modal */}
      <Dialog open={showShippingMethodModal} onOpenChange={setShowShippingMethodModal}>
        <DialogContent className='max-h-[85vh] overflow-y-auto rounded-none p-7 sm:max-w-lg'>
          <DialogHeader className='border-b pb-5'><DialogTitle className='text-2xl'>Select shipping</DialogTitle></DialogHeader>
          <DeliveryMethodSection />
          {deliveryMethod === 'vendor' && vendorDeliveryRates.length > 0 && !appliedCoupon && (
            <Button variant='outline' onClick={() => { setVendorDeliverySearch(''); setShowShippingMethodModal(false); setShowVendorDeliveryModal(true); }}>Select delivery location and price</Button>
          )}
          <Button className='h-12 rounded-none' disabled={isFetchingQuote || !deliveryMethod} onClick={async () => { await handleSaveDelivery(); }}>
            {isFetchingQuote ? 'Getting shipping price...' : 'Save shipping'}
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={isEditingAddress} onOpenChange={setIsEditingAddress}>
        <DialogOverlay className="backdrop-blur-xs" />
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-none border-0 p-6 sm:max-w-xl sm:rounded-none sm:p-8 [&_input]:h-12 [&_input]:rounded-none [&_input]:text-base [&_[data-slot=select-trigger]]:h-12 [&_[data-slot=select-trigger]]:rounded-none">
          <DialogHeader className="border-b border-[#ECECEC] pb-4">
            <DialogTitle className="text-2xl font-semibold">Change details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label className='mb-1 block text-xs'>First name *</Label>
                <Input value={customerFirstName} onChange={(event) => setCustomerFirstName(event.target.value)} placeholder="First name" />
              </div>
              <div>
                <Label className='mb-1 block text-xs'>Last name *</Label>
                <Input value={customerLastName} onChange={(event) => setCustomerLastName(event.target.value)} placeholder="Last name" />
              </div>
            </div>

            <div>
              <Label className='mb-1 block text-xs'>Phone number *</Label>
              <div className="flex">
                <Select value={phoneDialCode} onValueChange={setPhoneDialCode}>
                  <SelectTrigger className="w-[120px] rounded-r-none border-r-0 focus:ring-0 flex-shrink-0">
                    <SelectValue>
                      <span className="flex items-center gap-1.5">
                        <span>{PHONE_CODES.find(c => c.dial === phoneDialCode)?.flag ?? '🏳'}</span>
                        <span className="text-xs font-mono">{phoneDialCode}</span>
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[260px]">
                    {PHONE_CODES.map((country, index) => (
                      <SelectItem key={`${country.code}-${index}`} value={country.dial}>
                        <span className="flex items-center gap-2">
                          <span>{country.flag}</span>
                          <span className="w-10 flex-shrink-0 font-mono text-xs text-muted-foreground">{country.dial}</span>
                          <span className="text-sm">{country.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input type="tel" value={customerDetails.phone} onChange={event => handleInputChange('phone', event.target.value)} placeholder="8012345678" className="flex-1 rounded-l-none" />
              </div>
            </div>

            <div>
              <Label className='mb-1 block text-xs'>Email *</Label>
              <Input type='email' value={customerDetails.email} onChange={event => handleInputChange('email', event.target.value)} placeholder="your@email.com" />
            </div>

            <div>
              <Label className='mb-1 block text-xs'>Address *</Label>
              <Input value={customerDetails.address} onChange={event => handleInputChange('address', event.target.value)} placeholder="Shipping address" />
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <Label className='mb-1 block text-xs'>Country *</Label>
                <Select value={customerDetails.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger className='w-full'><SelectValue placeholder="Select country" /></SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {Object.entries(countryToCode).map(([name, code]) => (
                      <SelectItem key={code} value={code}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <StateRegionSelect countryCode={customerDetails.country} value={customerDetails.state} onChange={(value) => handleInputChange('state', value)} disabled={false} />
              </div>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div>
                <Label className='mb-1 block text-xs'>City *</Label>
                <Input value={customerDetails.city} onChange={event => handleInputChange('city', event.target.value)} placeholder="City" />
              </div>
              <div>
                <Label className='mb-1 block text-xs'>Post code *</Label>
                <Input value={customerDetails.post_code} onChange={event => handleInputChange('post_code', event.target.value)} placeholder="Post code" />
              </div>
            </div>

            <Button type="button" className="h-12 w-full rounded-none bg-black text-white hover:bg-[#222]" onClick={handleSaveAddress}>
              <SaveIcon className="mr-2" />
              Save address
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sendbox Courier Selection Modal */}
      <Dialog open={showSendboxModal} onOpenChange={() => { }}>
        <DialogOverlay className="backdrop-blur-xs" />
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Choose Delivery Option</DialogTitle>
            <p className="text-xs text-muted-foreground">Select a courier for your order</p>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {Array.isArray(deliveryQuote?.sendboxQuotes) &&
              deliveryQuote.sendboxQuotes.map((quote) => (
                <button
                  key={quote.rate_card_id}
                  onClick={() => handleSelectSendboxQuote(quote)}
                  className="w-full flex items-center justify-between p-4 border rounded-lg hover:border-[#4FCA6A] hover:bg-[#4FCA6A]/5 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Truck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{quote.name}</p>
                      {quote.pickup_date && (
                        <p className="text-xs text-muted-foreground">
                          Pickup: {new Date(quote.pickup_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-primary">₦{quote.fee.toLocaleString()}</p>
                  </div>
                </button>
              ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button variant="outline" onClick={() => { setShowSendboxModal(false); setIsEditingDelivery(true); }}>
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVendorDeliveryModal} onOpenChange={setShowVendorDeliveryModal}>
        <DialogOverlay className="backdrop-blur-xs" />
        <DialogContent className="max-h-[80vh] overflow-hidden rounded-none border-0 p-6 sm:max-w-xl sm:rounded-none sm:p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">Select shipping</DialogTitle>
          </DialogHeader>

          <Input
            value={vendorDeliverySearch}
            onChange={(event) => setVendorDeliverySearch(event.target.value)}
            placeholder="Search delivery locations..."
            className="mt-3 h-12 rounded-lg bg-white px-5"
          />

          <div className="max-h-[48vh] divide-y overflow-y-auto">
            {vendorDeliveryRates
              .filter((rate) => rate.location.toLowerCase().includes(vendorDeliverySearch.trim().toLowerCase()))
              .map((rate) => (
                <button
                  key={rate.id}
                  type="button"
                  onClick={() => {
                    setSelectedVendorDeliveryRate(rate);
                    setSelectedQuote({
                      fee: rate.rate,
                      rate_card_id: null,
                      name: `Vendor Delivery - ${rate.location}`,
                    });
                    setShowVendorDeliveryModal(false);
                    setIsEditingDelivery(false);
                  }}
                  className="flex w-full items-start justify-between gap-4 px-2 py-5 text-left transition-colors hover:bg-primary/5"
                >
                  <span className="flex min-w-0 items-start gap-3">
                    <span className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${selectedVendorDeliveryRate?.id === rate.id ? 'border-primary' : 'border-muted-foreground/40'}`}>
                      {selectedVendorDeliveryRate?.id === rate.id && <span className="h-2 w-2 rounded-full bg-primary" />}
                    </span>
                    <span>
                      <span className="block text-sm font-medium">{rate.location}</span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {rate.description || 'Vendor delivery'}
                      </span>
                      {(rate.delivery_time || rate.estimated_delivery) && (
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {rate.delivery_time || rate.estimated_delivery}
                        </span>
                      )}
                    </span>
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-primary">
                    ₦{rate.rate.toLocaleString()}
                  </span>
                </button>
              ))}
            {vendorDeliveryRates.filter((rate) => rate.location.toLowerCase().includes(vendorDeliverySearch.trim().toLowerCase())).length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                No delivery locations match your search.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!cryptoPaymentInit} onOpenChange={() => { }}>
        <DialogOverlay className="backdrop-blur-xs" />
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold">Complete Your Crypto Payment</DialogTitle>
            <p className="text-xs text-muted-foreground">
              Send exactly the amount below to the deposit address to complete your order.
            </p>
          </DialogHeader>

          {cryptoPaymentInit && (
            <div className="space-y-4 mt-2">
              <div className="flex justify-center rounded-lg border p-4 bg-white">
                <QRCodeSVG value={cryptoPaymentInit.depositAddress} size={176} />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Amount to send</Label>
                <p className="text-lg font-bold">
                  {cryptoPaymentInit.fromAmount} {cryptoPaymentInit.fromCurrency}
                </p>
                <p className="text-xs text-muted-foreground">
                  Network: {cryptoPaymentInit.fromNetwork.toUpperCase()}
                </p>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Deposit address</Label>
                <div className="flex items-center gap-2 rounded-lg border p-2">
                  <p className="flex-1 text-xs font-mono break-all">{cryptoPaymentInit.depositAddress}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(cryptoPaymentInit.depositAddress);
                      toast.success('Address copied');
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800">
                Send only {cryptoPaymentInit.fromCurrency} on the {cryptoPaymentInit.fromNetwork.toUpperCase()} network to this address. Sending any other asset or using a different network may result in permanent loss of funds.
                We&apos;ll confirm your payment and update your order once it&apos;s received — you can check your order status by email.
              </div>

              <Button
                className="w-full"
                onClick={() => {
                  const storedOrderId = JSON.parse(localStorage.getItem('pending_order') || '{}').orderId;
                  window.location.href = `/payment/success?store_id=${storeId}&reference=${encodeURIComponent(cryptoPaymentInit.reference)}&status=pending_crypto${storedOrderId ? `&order=${encodeURIComponent(storedOrderId)}` : ''}`;
                }}
              >
                I&apos;ve sent the payment
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
