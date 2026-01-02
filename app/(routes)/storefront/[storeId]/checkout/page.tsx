// app/storefront/[storeId]/checkout/page.tsx
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
import Link from 'next/link';
import React, { useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';
import StateRegionSelect from '@/components/stateRegionSelect'; // ← Your reusable component
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Country to code mapping (ISO 3166-1 alpha-2)
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

interface OrderData {
  orderId: string;
  orderNumber: string;
  itemsTotal: number;
  deliveryFee: number;
  platformFee: number;
  totalAmount: number;
  paymentUrl: string;
  paymentReference?: string; 
}

export default function CheckoutPage() {
  const params = useParams();
  const storeId = params.storeId as string;
  const [searchQuery] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingDelivery, setIsEditingDelivery] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<'sendbox' | 'pickup'>('sendbox');

  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    post_code: '',
    country: 'NG' // Default to Nigeria
  });

  const { cart, getCartTotal } = useCart();
  const isSearchingOnMobile = searchQuery.trim() !== '';

  const itemsTotal = getCartTotal();
  const deliveryFee = orderData?.deliveryFee || 0;
  const total = orderData ? orderData.totalAmount : itemsTotal;

  const handleEditAddress = () => setIsEditingAddress(true);
  const handleSaveAddress = () => setIsEditingAddress(false);
  const handleCancelEdit = () => {
    setIsEditingAddress(false);
  };

  const handleEditDelivery = () => setIsEditingDelivery(true);
  const handleSaveDelivery = () => setIsEditingDelivery(false);
  const handleCancelDeliveryEdit = () => setIsEditingDelivery(false);

  // Updated handler: clears state when country changes
  const handleInputChange = (field: keyof typeof customerDetails, value: string) => {
    setCustomerDetails(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'country') {
        updated.state = ''; // Reset state when country changes
      }
      return updated;
    });
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 200) setDeliveryNotes(value);
  };

  const validateCheckout = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerDetails.email)) {
      toast.error("Invalid Email - Please enter a valid email address");
      return false;
    }
    if (customerDetails.phone.length < 10) {
      toast.error("Invalid Phone - Please enter a valid phone number");
      return false;
    }
    if (!customerDetails.name.trim()) { toast.error("Name is required"); return false; }
    if (!customerDetails.address.trim()) { toast.error("Address is required"); return false; }
    if (!customerDetails.city.trim()) { toast.error("City is required"); return false; }
    if (!customerDetails.state.trim()) { toast.error("State / Region is required"); return false; }
    if (!customerDetails.post_code.trim()) { toast.error("Post Code is required"); return false; }
    if (cart.length === 0) {
      toast.error("Empty Cart - Your cart is empty. Please add items before checkout");
      return false;
    }
    return true;
  };

  const createOrder = async () => {
    try {
      const orderPayload = {
        store_id: storeId,
        items: cart.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          discount: 0,
          name: item.name
        })),
        total_amount: itemsTotal,
        total_items: cart.reduce((sum, item) => sum + item.quantity, 0),
        payment_method: "paystack",
        delivery_method: deliveryMethod, // Add this line
        customer_info: {
          name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          address: customerDetails.address,
          city: customerDetails.city,
          state: customerDetails.state,
          post_code: customerDetails.post_code,
          country: customerDetails.country
        },
        notes: deliveryNotes || "No delivery notes provided"
      };
  
      console.log('📦 Order payload with delivery method:', orderPayload); // For debugging
  
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || `Failed to create order: ${response.status}`);
      if (result.status !== 'success') throw new Error(result.message || 'Order creation failed');
  
      return result;
    } catch (error) {
      console.error('Order creation error:', error);
      throw error;
    }
  };

 // In your handleConfirmOrder function, update this section:
const handleConfirmOrder = async () => {
  if (!validateCheckout()) return;
  setIsProcessingOrder(true);
  try {
    const orderResult = await createOrder();
    const orderDetails = orderResult.data?.order;
    const paymentDetails = orderResult.data?.payment;
    const transactionDetails = orderResult.data?.transaction; // Get transaction details

    if (orderDetails && paymentDetails) {
      const deliveryFee = Number(orderDetails.delivery_fee) || 0;
      const paystackAmount = Number(paymentDetails.total_paid) || Number(orderDetails.order_total);

      const newOrderData: OrderData = {
        orderId: orderDetails.id,
        orderNumber: orderDetails.order_number,
        itemsTotal,
        deliveryFee,
        totalAmount: paystackAmount,
        paymentUrl: paymentDetails.authorization_url,
        platformFee: Number(orderDetails.platform_fee)
      };

      setOrderData(newOrderData);
      
      // Store order data with payment reference
      const paymentReference = transactionDetails?.reference || paymentDetails.reference;
      
      localStorage.setItem('pending_order', JSON.stringify({
        orderId: orderDetails.order_number,
        customerDetails,
        cart,
        total: paystackAmount,
        deliveryNotes,
        orderData: orderResult,
        paymentReference: paymentReference // Store payment reference
      }));
      
      // ⭐⭐⭐ CRITICAL: Store store ID for use after payment ⭐⭐⭐
      localStorage.setItem('current_store_id', storeId);
      
      // Also store payment reference separately for easy access
      if (paymentReference) {
        localStorage.setItem('payment_reference', paymentReference);
      }

      toast.success("Order created! Review the total including delivery and fees.");
    } else {
      throw new Error('Order details not found in response');
    }
  } catch (error) {
    toast.error(`Order Creation Failed - ${error instanceof Error ? error.message : "Please try again."}`);
  } finally {
    setIsProcessingOrder(false);
  }
};

const handleProceedToPayment = async () => {
  if (!orderData?.paymentUrl) return;
  setIsProcessingPayment(true);
  try {
    localStorage.setItem('current_store_id', storeId);
    
    toast.success("Redirecting to payment...");
    window.location.href = orderData.paymentUrl;
  } catch (error) {
    toast.error("Failed to redirect to payment.");
  } finally {
    setIsProcessingPayment(false);
  }
};

  const DeliveryMethodSection = () => (
    <div className='mb-6'>
      <Label className='text-xs mb-3 block'>Delivery Method *</Label>
      <RadioGroup 
        value={deliveryMethod} 
        onValueChange={(value: 'sendbox' | 'pickup') => setDeliveryMethod(value)}
        className="space-y-3"
        disabled={!!orderData}
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="sendbox" id="sendbox" />
          <Label htmlFor="sendbox" className="text-sm font-normal cursor-pointer">
            Door Delivery
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="pickup" id="pickup" />
          <Label htmlFor="pickup" className="text-sm font-normal cursor-pointer">
            Pick Up
          </Label>
        </div>
      </RadioGroup>
      
      {/* Delivery method descriptions */}
      {deliveryMethod === 'sendbox' && (
        <p className="text-xs text-[#A0A0A0] mt-2">
          Your order will be delivered to your specified address
        </p>
      )}
      {deliveryMethod === 'pickup' && (
        <p className="text-xs text-[#A0A0A0] mt-2">
          You&apos;ll pick up your order from the store location
        </p>
      )}
    </div>
  );
  return (
    <div className='flex flex-col bg-[#FCFCFC]'>
      {/* Header */}
      <div className={`md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10`}>
        <div className='flex items-center justify-between'>
          <Link href={`/storefront/${storeId}`}><Logo /></Link>
          <div className='flex gap-2'><CartButton /></div>
        </div>
      </div>

      <div className='p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden'>
        {/* Left: Order Summary */}
        <div className={`w-full md:w-[45%] md:overflow-y-auto md:h-full ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
          <Card className='shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
            <CardContent className='pb-2 border-b border-[#F5F5F5] dark:border-[#1F1F1F] space-y-4 pt-6'>
              <h3 className='font-semibold'>Order Summary</h3>
              <div className='flex items-center justify-between'>
                <span className='text-sm'>Item&apos;s total ({cart.length})</span>
                <span className='text-sm'>₦{itemsTotal.toLocaleString()}</span>
              </div>

              {orderData && (
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>Delivery Fee</span>
                  <span className='text-sm'>₦{deliveryFee.toLocaleString()}</span>
                </div>
              )}

              {orderData && (
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <span>Platform fee & processing fees</span>
                  <span>Included</span>
                </div>
              )}

              <div className='flex items-center justify-between border-t pt-2'>
                <span className='text-sm font-semibold'>Total Amount</span>
                <h4 className='font-bold'>₦{total.toLocaleString()}</h4>
              </div>
            </CardContent>

            <CardFooter className='pt-4'>
              {!orderData ? (
                <Button
                  className='w-full bg-[#4FCA6A] hover:bg-[#45b85e]'
                  onClick={handleConfirmOrder}
                  disabled={isProcessingOrder || cart.length === 0}
                >
                  {isProcessingOrder ? 'Creating Order...' : 'Confirm Order'}
                </Button>
              ) : (
                <Button
                  className='w-full bg-[#4FCA6A] hover:bg-[#45b85e]'
                  onClick={handleProceedToPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? 'Redirecting...' : 'Proceed to Payment'}
                </Button>
              )}
            </CardFooter>
          </Card>

          <p className='text-center text-sm mt-4'>
            By proceeding, you are automatically accepting the{' '}
            <a href="#" className='text-[#4FCA6A]'>Terms & Conditions</a>
          </p>
        </div>

        {/* Right: Forms */}
        <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full'>
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
                  <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                  <Button onClick={handleSaveAddress}><SaveIcon /> <span className="hidden sm:inline ml-2">Save Changes</span></Button>
                </div>
              )}
            </CardHeader>

            <CardContent className='pt-6 space-y-4'>
              <div>
                <Label className='text-xs mb-1'>Full Name *</Label>
                <Input disabled={!isEditingAddress || !!orderData} value={customerDetails.name}
                  onChange={e => handleInputChange('name', e.target.value)} placeholder="Enter your full name" />
              </div>

              <div>
                <Label className='text-xs mb-1'>Email *</Label>
                <Input type='email' disabled={!isEditingAddress || !!orderData} value={customerDetails.email}
                  onChange={e => handleInputChange('email', e.target.value)} placeholder="your@email.com" />
              </div>

              <div>
                <Label className='text-xs mb-1'>Phone Number *</Label>
                <Input type='tel' disabled={!isEditingAddress || !!orderData} value={customerDetails.phone}
                  onChange={e => handleInputChange('phone', e.target.value)} placeholder="+2348012345678" />
              </div>

              <div>
                <Label className='text-xs mb-1'>Delivery Address *</Label>
                <Input disabled={!isEditingAddress || !!orderData} value={customerDetails.address}
                  onChange={e => handleInputChange('address', e.target.value)} placeholder="Enter your complete address" />
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='text-xs mb-1'>City *</Label>
                  <Input disabled={!isEditingAddress || !!orderData} value={customerDetails.city}
                    onChange={e => handleInputChange('city', e.target.value)} placeholder="e.g., Lagos" />
                </div>

                {/* Dynamic State / Region Field */}
                <div>
                  <StateRegionSelect
                    countryCode={customerDetails.country}
                    value={customerDetails.state}
                    onChange={(value) => handleInputChange('state', value)}
                    disabled={!isEditingAddress || !!orderData}
                  />
                </div>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <Label className='text-xs mb-1'>Post Code *</Label>
                  <Input disabled={!isEditingAddress || !!orderData} value={customerDetails.post_code}
                    onChange={e => handleInputChange('post_code', e.target.value)} placeholder="e.g., 100001" />
                </div>

                <div>
                  <Label className='text-xs mb-1'>Country *</Label>
                  <Select
                    disabled={!isEditingAddress || !!orderData}
                    value={customerDetails.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
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
                <Button variant="outline" className='text-[#4FCA6A]' onClick={handleEditDelivery}>
                  Change <EditIcon />
                </Button>
              ) : (
                <div className='flex items-center gap-2'>
                  <Button variant="outline" onClick={handleCancelDeliveryEdit}>Cancel</Button>
                  <Button onClick={handleSaveDelivery}><SaveIcon /> <span className="hidden sm:inline ml-2">Save</span></Button>
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
                    disabled={!isEditingDelivery || !!orderData}
                    value={deliveryNotes}
                    onChange={handleNotesChange}
                    placeholder="Add any special instructions..."
                    maxLength={200}
                  />
                  <span className='absolute bottom-2 right-3 text-xs text-[#A0A0A0]'>
                    {deliveryNotes.length}/200
                  </span>
                </div>
              </div>

              <div className='flex gap-4 overflow-x-auto pb-2 scrollbar-hide'>
                {cart.map((item, index) => (
                  <div key={item.id} className='flex-shrink-0 w-[280px]'>
                    <div className='flex justify-between items-center'>
                      <p className='text-sm font-medium'>Shipment {index + 1}/{cart.length}</p>
                      <span className='text-xs text-[#A0A0A0]'>Fulfilled By Vendor</span>
                    </div>
                    <div className='border border-[#E0E0E0] rounded-lg p-4 mt-2'>
                      <p className='text-sm font-medium'>Door Delivery</p>
                      <span className='text-xs text-[#A0A0A0]'>Delivery between 13 October and 16 October</span>
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
          <Card className='mt-6 shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
            <CardHeader className='flex flex-row items-center justify-between border-b border-[#F5F5F5] dark:border-[#1F1F1F]'>
              <h3 className='font-semibold'>3. PAYMENT METHOD</h3>
            </CardHeader>
            <CardContent className='pt-6'>
              <PaystackLogo />
              <p className='text-xs text-[#A0A0A0] mt-2'>This is the default payment for Swiftree</p>
            </CardContent>
          </Card>

          <Link href={`/storefront/${storeId}`} className='flex text-sm items-center text-[#4FCA6A] mt-6 hover:underline'>
            <ArrowIcon /> Go back & continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}