"use client";

import CartButton from '@/components/CartButton';
import ArrowIcon from '@/components/svgIcons/ArrowIcon';
import EditIcon from '@/components/svgIcons/EditIcon';
import Logo from '@/components/svgIcons/Logo';
import PaystackLogo from '@/components/svgIcons/PaystackLogo';
import SaveIcon from '@/components/svgIcons/SaveIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import StateRegionSelect from '@/components/stateRegionSelect';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Truck, X } from 'lucide-react';

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
  rate_card_id?: string | null;
  name: string;
}

export default function CheckoutPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [searchQuery] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'sendbox' | 'pickup' | 'vendor' | 'gig'>('sendbox');
  const [phoneDialCode, setPhoneDialCode] = useState('+234');
  const [enabledFulfillmentModes, setEnabledFulfillmentModes] = useState<string[]>([]);
  const [isLoadingModes, setIsLoadingModes] = useState(true);

  // Quote-related state
  const [isFetchingQuote, setIsFetchingQuote] = useState(false);
  const [deliveryQuote, setDeliveryQuote] = useState<DeliveryQuote | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<SelectedQuote | null>(null);
  const [showSendboxModal, setShowSendboxModal] = useState(false);
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [quotePayload, setQuotePayload] = useState<any>(null); // store payload for reuse in order creation

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    post_code: '',
    country: 'NG'
  });

  const { cart, getCartTotal, clearCart  } = useCart();
  const isSearchingOnMobile = searchQuery.trim() !== '';

  const itemsTotal = getCartTotal();
  const deliveryFee = selectedQuote?.fee || 0;
  const total = itemsTotal + deliveryFee;

  // Determines if this delivery method needs a quote
  const needsQuote = deliveryMethod === 'sendbox' || deliveryMethod === 'gig';

  // Whether the customer has completed the quote step
  const quoteReady = !needsQuote || selectedQuote !== null;

  useEffect(() => {
    const fetchStoreFulfillmentModes = async () => {
      try {
        setIsLoadingModes(true);
        const response = await fetch(`/api/stores/${storeId}`);
        if (!response.ok) throw new Error('Failed to fetch store details');
        const result = await response.json();

        if (result.status === 'success' && result.data?.storeDetails) {
          const modes = result.data.storeDetails.enabled_fulfillment_modes || [];
          setEnabledFulfillmentModes(modes);

          if (modes.includes('sendbox')) setDeliveryMethod('sendbox');
          else if (modes.includes('pickup')) setDeliveryMethod('pickup');
          else if (modes.includes('vendor')) setDeliveryMethod('vendor');
          else if (modes.includes('gig')) setDeliveryMethod('gig');
        }
      } catch (error) {
        console.error('❌ Error fetching store fulfillment modes:', error);
        toast.error('Failed to load delivery options');
        setEnabledFulfillmentModes(['pickup', 'sendbox']);
        setDeliveryMethod('sendbox');
      } finally {
        setIsLoadingModes(false);
      }
    };

    if (storeId) fetchStoreFulfillmentModes();
  }, [storeId]);

  // Reset quote when delivery method or address changes
  useEffect(() => {
    setSelectedQuote(null);
    setDeliveryQuote(null);
  }, [deliveryMethod]);

  const handleEditAddress = () => setIsEditingAddress(true);
  const handleSaveAddress = () => setIsEditingAddress(false);
  const handleCancelEdit = () => setIsEditingAddress(false);
  const handleEditDelivery = () => setIsEditingDelivery(true);
  const handleCancelDeliveryEdit = () => setIsEditingDelivery(false);

  const handleInputChange = (field: keyof typeof customerDetails, value: string) => {
    setCustomerDetails(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'country') updated.state = '';
      return updated;
    });
    // Reset quote if address changes
    setSelectedQuote(null);
    setDeliveryQuote(null);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) setDeliveryNotes(value);
  };

  const validateCheckout = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) { toast.error("Please enter a valid email address"); return false; }
    if (customerDetails.phone.length < 7) { toast.error("Please enter a valid phone number"); return false; }
    if (!customerDetails.name.trim()) { toast.error("Name is required"); return false; }
    if (!customerDetails.address.trim()) { toast.error("Address is required"); return false; }
    if (!customerDetails.city.trim()) { toast.error("City is required"); return false; }
    if (!customerDetails.state.trim()) { toast.error("State / Region is required"); return false; }
    if (!customerDetails.post_code.trim()) { toast.error("Post Code is required"); return false; }
    if (cart.length === 0) { toast.error("Your cart is empty"); return false; }
    return true;
  };

  const buildBasePayload = () => ({
    store_id: storeId,
    items: cart.map(item => {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orderItem: any = {
        product_id: item.product_id || item.originalProductId || item.id,
        quantity: item.quantity,
        price: item.price,
        discount: 0,
        name: item.name
      };
      if (item.variant && (item.variant.size || item.variant.color)) {
        orderItem.variant = { size: item.variant.size || "", color: item.variant.color || "" };
      }
      return orderItem;
    }),
    total_amount: itemsTotal,
    total_items: cart.reduce((sum, item) => sum + item.quantity, 0),
    payment_method: "paystack",
    delivery_method: deliveryMethod,
    customer_info: {
      name: customerDetails.name,
      email: customerDetails.email,
      phone: `${phoneDialCode}${customerDetails.phone}`,
      address: customerDetails.address,
      city: customerDetails.city,
      state: customerDetails.state,
      post_code: customerDetails.post_code,
      country: customerDetails.country
    },
    notes: deliveryNotes || "No delivery notes provided"
  });

  // Called when user clicks "Save" in the delivery section
  const handleSaveDelivery = async () => {
    if (!needsQuote) {
      setIsEditingDelivery(false);
      return;
    }

    if (!validateCheckout()) return;

    setIsFetchingQuote(true);
    setIsEditingDelivery(false);

    try {
      const payload = buildBasePayload();
      setQuotePayload(payload);

      console.log('📦 Fetching delivery quote:', JSON.stringify(payload, null, 2));

      const response = await fetch('/api/orders/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('📥 FULL Quote response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch delivery quote');
      }

      const methodRaw = result.data?.delivery_method;

      const method = methodRaw;
      const quoteData = result.data?.quote;

      console.log('🧪 delivery_method:', method);
      console.log('🧪 quoteData:', quoteData);

      // ✅ HANDLE SENDBOX (sendbox)
      if (method === 'sendbox') {
        const quotes: SendboxQuote[] = Array.isArray(quoteData) ? quoteData : [];

        if (quotes.length === 0) {
          toast.error('No delivery options available');
          return;
        }

        setDeliveryQuote({
          sendboxQuotes: quotes,
          deliveryMethod: 'sendbox'
        });

        setShowSendboxModal(true);
      }

      // ✅ HANDLE GIG
      else if (method === 'gig') {
        const gigQuote: GigQuote = quoteData;

        if (!gigQuote || !gigQuote.fee) {
          throw new Error('Invalid GIG quote response');
        }

        setDeliveryQuote({
          gigQuote,
          deliveryMethod: 'gig'
        });

        setSelectedQuote({
          fee: gigQuote.fee,
          rate_card_id: null,
          name: 'GIG Logistics'
        });

        toast.success(`GIG delivery fee: ₦${gigQuote.fee.toLocaleString()} added to total`);
      }

      // ❌ UNKNOWN RESPONSE
      else {
        console.error('❌ Unknown delivery method:', method);
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

  const createOrder = async () => {
       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = { ...buildBasePayload() };

    // Add rate_card_id for sendbox
    if (deliveryMethod === 'sendbox' && selectedQuote?.rate_card_id) {
      payload.rate_card_id = selectedQuote.rate_card_id;
    }

    console.log('📦 Creating order:', JSON.stringify(payload, null, 2));

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message || `Failed to create order: ${response.status}`);
    if (result.status !== 'success') throw new Error(result.message || 'Order creation failed');
    return result;
  };

  const handleProceedToPayment = async () => {
    if (!validateCheckout()) return;
    if (needsQuote && !selectedQuote) {
      toast.error('Please save delivery details to get a delivery quote first');
      return;
    }
  
    setIsProcessingPayment(true);
    try {
      const orderResult = await createOrder();
      const orderDetails = orderResult.data?.order;
      const paymentDetails = orderResult.data?.payment;
      const transactionDetails = orderResult.data?.transaction;
  
      if (orderDetails && paymentDetails) {
        const paymentReference = transactionDetails?.reference || paymentDetails.reference;
  
        localStorage.setItem('pending_order', JSON.stringify({
          orderId: orderDetails.order_number,
          customerDetails: { ...customerDetails, phone: `${phoneDialCode}${customerDetails.phone}` },
          cart,
          total: Number(paymentDetails.total_paid) || Number(orderDetails.order_total),
          deliveryNotes,
          orderData: orderResult,
          paymentReference
        }));
  
        localStorage.setItem('current_store_id', storeId);
        if (paymentReference) localStorage.setItem('payment_reference', paymentReference);
  
        // ✅ Clear the cart after successful order creation
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

    if (enabledFulfillmentModes.length === 0) {
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
          value={deliveryMethod}
          onValueChange={(value: 'sendbox' | 'pickup' | 'vendor' | 'gig') => {
            setDeliveryMethod(value);
            setSelectedQuote(null);
            setDeliveryQuote(null);
          }}
          className="space-y-3"
          disabled={!isEditingDelivery}
        >
          {enabledFulfillmentModes.includes('sendbox') && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="sendbox" id="sendbox" />
              <Label htmlFor="sendbox" className="text-sm font-normal cursor-pointer">
                SendBox
              </Label>
            </div>
          )}
          {enabledFulfillmentModes.includes('pickup') && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="pickup" id="pickup" />
              <Label htmlFor="pickup" className="text-sm font-normal cursor-pointer">Pick Up</Label>
            </div>
          )}
          {enabledFulfillmentModes.includes('vendor') && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="vendor" id="vendor" />
              <Label htmlFor="vendor" className="text-sm font-normal cursor-pointer">Vendor Delivery</Label>
            </div>
          )}
          {enabledFulfillmentModes.includes('gig') && (
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="gig" id="gig" />
              <Label htmlFor="gig" className="text-sm font-normal cursor-pointer">GIG Logistics</Label>
            </div>
          )}
        </RadioGroup>

        {deliveryMethod === 'sendbox' && <p className="text-xs text-[#A0A0A0] mt-2">Delivered through our sendbox delivery service. Rates will be shown after saving.</p>}
        {deliveryMethod === 'pickup' && <p className="text-xs text-[#A0A0A0] mt-2">You&apos;ll pick up your order from the store location.</p>}
        {deliveryMethod === 'vendor' && <p className="text-xs text-[#A0A0A0] mt-2">The vendor will handle delivery of your order.</p>}
        {deliveryMethod === 'gig' && <p className="text-xs text-[#A0A0A0] mt-2">Delivered through GIG Logistics. Rate will be calculated after saving.</p>}

        {/* Show selected quote info */}
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

  return (
    <div className='flex flex-col bg-[#FCFCFC]'>
      {/* Mobile Header */}
      <div className='md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10'>
        <div className='flex items-center justify-between'>
          <Link href={`/storefront/${storeId}`}><Logo /></Link>
          <div className='flex gap-2'><CartButton /></div>
        </div>
      </div>

      <div className='p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden'>
        {/* Left: Order Summary */}
        <div className={`w-full md:w-[45%] md:overflow-y-auto md:h-full order-2 md:order-1 ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
          <Card className='shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
            <CardContent className='pb-2 border-b border-[#F5F5F5] dark:border-[#1F1F1F] space-y-4 pt-6'>
              <h3 className='font-semibold'>Order Summary</h3>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Item&apos;s total ({cart.length})</span>
                <span className='text-sm'>₦{itemsTotal.toLocaleString()}</span>
              </div>
              {selectedQuote && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Delivery Fee ({selectedQuote.name})</span>
                  <span className='text-sm'>₦{selectedQuote.fee.toLocaleString()}</span>
                </div>
              )}
              {(deliveryMethod === 'sendbox' || deliveryMethod === 'gig') && !selectedQuote && (
                <div className='flex items-center justify-between text-xs text-[#A0A0A0]'>
                  <span>Delivery fee</span>
                  <span>Calculated after saving delivery</span>
                </div>
              )}
              <div className='flex items-center justify-between border-t pt-2'>
                <span className='text-sm font-semibold'>Total Amount</span>
                <h4 className='font-bold'>₦{total.toLocaleString()}</h4>
              </div>
            </CardContent>
            <CardFooter className='pt-4'>
              <Button
                className='w-full bg-[#4FCA6A] hover:bg-[#45b85e]'
                onClick={handleProceedToPayment}
                disabled={isProcessingPayment || cart.length === 0 || isLoadingModes || isFetchingQuote || (needsQuote && !selectedQuote)}
              >
                {isProcessingPayment ? (
                  <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Processing...</>
                ) : needsQuote && !selectedQuote ? (
                  'Save delivery to continue'
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </CardFooter>
          </Card>

          <p className='text-center text-sm mt-4'>
            By proceeding, you are automatically accepting the{' '}
            <a href="#" className='text-[#4FCA6A]'>Terms & Conditions</a>
          </p>
        </div>

        {/* Right: Forms */}
        <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full order-1 md:order-2'>
          <div className='hidden md:flex items-center justify-between mb-6 sticky top-0 bg-[#FCFCFC] z-10 pb-4'>
            <Link href={`/storefront/${storeId}`}><Logo /></Link>
            <div className='flex gap-2'><CartButton /></div>
          </div>

          {/* 1. Customer Address */}
          <Card className='shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
            <CardHeader className='flex flex-row items-center justify-between border-b border-[#F5F5F5] dark:border-[#1F1F1F]'>
              <h3 className='font-semibold'>1. CUSTOMER ADDRESS</h3>
              {!isEditingAddress ? (
                <Button variant="outline" className='text-[#4FCA6A]' onClick={handleEditAddress}>
                  Change <EditIcon />
                </Button>
              ) : (
                <div className='flex items-center gap-2'>
                  <Button variant="outline" onClick={handleCancelEdit}> <X/> <span className="hidden sm:inline ml-2">Cancel</span></Button>
                  <Button onClick={handleSaveAddress}><SaveIcon className="hidden sm:inline ml-2"/> <span >Save Changes</span></Button>
                </div>
              )}
            </CardHeader>

            <CardContent className='pt-6 space-y-4'>
              <div>
                <Label className='text-xs mb-1'>Full Name *</Label>
                <Input disabled={!isEditingAddress} value={customerDetails.name} onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter your full name" />
              </div>
              <div>
                <Label className='text-xs mb-1'>Email *</Label>
                <Input type='email' disabled={!isEditingAddress} value={customerDetails.email} onChange={e => handleInputChange('email', e.target.value)} placeholder="your@email.com" />
              </div>
              <div>
                <Label className='text-xs mb-1'>Phone Number *</Label>
                <div className="flex">
                  <Select value={phoneDialCode} onValueChange={setPhoneDialCode} disabled={!isEditingAddress}>
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
                            <span className="text-xs text-muted-foreground font-mono w-10 flex-shrink-0">{country.dial}</span>
                            <span className="text-sm">{country.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input type="tel" disabled={!isEditingAddress} value={customerDetails.phone} onChange={e => handleInputChange('phone', e.target.value)} placeholder="8012345678" className="rounded-l-none flex-1" />
                </div>
              </div>
              <div>
                <Label className='text-xs mb-1'>Delivery Address *</Label>
                <Input disabled={!isEditingAddress} value={customerDetails.address} onChange={e => handleInputChange('address', e.target.value)} placeholder="Enter your complete address" />
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='text-xs mb-1'>City *</Label>
                  <Input disabled={!isEditingAddress} value={customerDetails.city} onChange={e => handleInputChange('city', e.target.value)} placeholder="e.g., Lagos" />
                </div>
                <div>
                  <StateRegionSelect countryCode={customerDetails.country} value={customerDetails.state} onChange={(value) => handleInputChange('state', value)} disabled={!isEditingAddress} />
                </div>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='text-xs mb-1'>Post Code *</Label>
                  <Input disabled={!isEditingAddress} value={customerDetails.post_code} onChange={e => handleInputChange('post_code', e.target.value)} placeholder="e.g., 100001" />
                </div>
                <div>
                  <Label className='text-xs mb-1'>Country *</Label>
                  <Select disabled={!isEditingAddress} value={customerDetails.country} onValueChange={(value) => handleInputChange('country', value)}>
                    <SelectTrigger className='w-full'><SelectValue placeholder="Select country" /></SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      {Object.entries(countryToCode).map(([name, code]) => (
                        <SelectItem key={code} value={code}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2. Delivery Details */}
          <Card className='shadow-none mt-6 border-[#F5F5F5] dark:border-[#1F1F1F]'>
            <CardHeader className='flex flex-row items-center justify-between border-b border-[#F5F5F5] dark:border-[#1F1F1F]'>
              <h3 className='font-semibold'>2. DELIVERY DETAILS</h3>
              {!isEditingDelivery ? (
                <Button variant="outline" className='text-[#4FCA6A]' onClick={() => setIsEditingDelivery(true)}>
                  Change <EditIcon />
                </Button>
              ) : (
                <div className='flex items-center gap-2'>
                  <Button variant="outline" onClick={handleCancelDeliveryEdit}><X/> <span className="hidden sm:inline ml-2">Cancel</span></Button>
                  <Button onClick={handleSaveDelivery} disabled={isFetchingQuote}>
                    {isFetchingQuote ? (
                      <><Loader2 className='w-4 h-4 mr-2 animate-spin' /> Getting quote...</>
                    ) : (
                      <><SaveIcon className="hidden sm:inline ml-2"/> <span >Save Changes</span></>
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>

            <CardContent className='pt-6'>
              <DeliveryMethodSection />

              <div className='mb-4'>
                <Label className='text-xs mb-1'>Delivery Notes (Optional)</Label>
                <div className='relative'>
                  <textarea
                    className='w-full min-h-[100px] px-3 py-2 text-sm border border-[#E0E0E0] rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-[#4FCA6A] disabled:bg-gray-50'
                    disabled={!isEditingDelivery}
                    value={deliveryNotes}
                    onChange={handleNotesChange}
                    placeholder="Add any special instructions..."
                    maxLength={200}
                  />
                  <span className='absolute bottom-2 right-3 text-xs text-[#A0A0A0]'>{deliveryNotes.length}/200</span>
                </div>
              </div>

              <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
                {cart.map((item, index) => (
                  <div key={item.id} className='flex-shrink-0 w-[280px]'>
                    <div className='flex justify-between items-center'>
                      <p className='text-sm font-medium'>Shipment {index + 1}/{cart.length}</p>
                      <span className='text-xs text-[#A0A0A0]'>
                        {deliveryMethod === 'vendor' ? 'Fulfilled By Vendor' :
                          deliveryMethod === 'pickup' ? 'Store Pickup' :
                            deliveryMethod === 'gig' ? 'GIG Logistics' : 'Door Delivery'}
                      </span>
                    </div>
                    <div className='border border-[#E0E0E0] rounded-lg p-4 mt-2'>
                      <p className='text-sm font-medium'>
                        {deliveryMethod === 'vendor' ? 'Vendor Delivery' :
                          deliveryMethod === 'pickup' ? 'Store Pickup' :
                            deliveryMethod === 'gig' ? 'GIG Delivery' : 'Door Delivery'}
                      </p>
                      <div className='flex gap-3 mt-3'>
                        <Image src={item.image} alt={item.name} width={50} height={50} className='object-cover w-12 h-12 rounded-lg' />
                        <div className='flex flex-col justify-between'>
                          <p className='text-sm line-clamp-2'>{item.name}</p>
                          <div className='flex items-center gap-2'>
                            <span className='text-sm font-semibold'>₦{item.price.toLocaleString()}</span>
                            <span className='text-xs text-[#A0A0A0]'>x{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 3. Payment Method */}
        

          <Link href={`/storefront/${storeId}`} className='flex text-sm items-center text-[#4FCA6A] mt-6 hover:underline'>
            <ArrowIcon /> Go back & continue shopping
          </Link>
        </div>
      </div>

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
    </div>
  );
}