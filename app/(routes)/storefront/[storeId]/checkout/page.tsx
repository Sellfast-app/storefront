// app/storefront/[storeId]/checkout/page.tsx
"use client";

import CartButton from '@/components/CartButton'
import ArrowIcon from '@/components/svgIcons/ArrowIcon';
import EditIcon from '@/components/svgIcons/EditIcon';
import Logo from '@/components/svgIcons/Logo'
import PaystackLogo from '@/components/svgIcons/PaystackLogo';
import SaveIcon from '@/components/svgIcons/SaveIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import { useCart } from '@/context/CartContext';
import PickupStationModal, { PickupStation } from '@/components/PickupStationModal';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const params = useParams()
    const storeId = params.storeId as string

    const [searchQuery,] = useState('')
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const [isEditingDelivery, setIsEditingDelivery] = useState(false)
    const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'door'>('pickup')
    const [selectedStation, setSelectedStation] = useState<PickupStation | null>(null)
    const [isPickupModalOpen, setIsPickupModalOpen] = useState(false)
    const [isProcessingPayment, setIsProcessingPayment] = useState(false)
    
    // Customer details state
    const [customerDetails, setCustomerDetails] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '8012345678',
        phoneCode: '+234',
        address: '123 Main Street, Lekki',
        country: 'nigeria',
        state: 'lagos',
        city: 'lekki',
        lga: 'etiosa'
    })
    
    const { cart, getCartTotal, clearCart } = useCart()

    const isSearchingOnMobile = searchQuery.trim() !== ''
    
    // Calculate totals
    const itemsTotal = getCartTotal()
    const deliveryFee = 1700
    const platformFeePercent = 3
    const total = itemsTotal + deliveryFee

    const handleEditAddress = () => setIsEditingAddress(true)
    const handleSaveAddress = () => setIsEditingAddress(false)
    const handleCancelEdit = () => setIsEditingAddress(false)

    const handleEditDelivery = () => setIsEditingDelivery(true)
    const handleSaveDelivery = () => setIsEditingDelivery(false)
    const handleCancelDeliveryEdit = () => setIsEditingDelivery(false)

    const handleOpenPickupModal = () => setIsPickupModalOpen(true)
    
    const handleSelectStation = (station: PickupStation) => {
        setSelectedStation(station)
    }

    const handleInputChange = (field: string, value: string) => {
        setCustomerDetails(prev => ({ ...prev, [field]: value }))
    }

    const validateCheckout = () => {
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(customerDetails.email)) {
            toast.error("Invalid Email - Please enter a valid email address")
            return false
        }

        // Validate phone
        if (customerDetails.phone.length < 10) {
            toast.error("Invalid Phone - Please enter a valid phone number")
            return false
        }

        // Validate cart
        if (cart.length === 0) {
            toast.error("Empty Cart - Your cart is empty. Please add items before checkout")
            return false
        }

        // Validate pickup station if pickup method selected
        if (deliveryMethod === 'pickup' && !selectedStation) {
            toast.error("Pickup Station Required - Please select a pickup station")
            return false
        }

        return true
    }

  // In your handleConfirmOrder function, update the API call part:
const handleConfirmOrder = async () => {
    if (!validateCheckout()) return

    setIsProcessingPayment(true)

    try {
        // Generate a unique order ID
        const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

        console.log('Initializing payment with:', {
            store_id: storeId,
            email: customerDetails.email,
            amount: total,
            order_id: orderId,
            items_total: itemsTotal,
            delivery_fee: deliveryFee
        })

        // Initialize payment
        const paymentResponse = await fetch('/api/payments/initialize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add auth token here if user is logged in
                // 'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                store_id: storeId,
                email: customerDetails.email,
                amount: total,
                currency: 'NGN',
                order_id: orderId,
                items_total: itemsTotal,
                delivery_fee: deliveryFee,
                platform_fee_percent: platformFeePercent
            })
        })

        const paymentData = await paymentResponse.json()

        console.log('Payment API response:', paymentData)

        if (!paymentResponse.ok) {
            throw new Error(paymentData.message || `HTTP error! status: ${paymentResponse.status}`)
        }

        if (paymentData.status === 'success') {
            // Redirect to payment gateway
            if (paymentData.data && paymentData.data.authorization_url) {
                // Save order details to localStorage before redirect
                localStorage.setItem('pending_order', JSON.stringify({
                    orderId,
                    customerDetails,
                    cart,
                    total,
                    deliveryMethod,
                    selectedStation
                }))

                // Show success toast
                toast.success("Payment initialized successfully! Redirecting...")
                
                // Redirect to Paystack payment page
                window.location.href = paymentData.data.authorization_url
            } else {
                throw new Error('Payment authorization URL not found in response')
            }
        } else {
            throw new Error(paymentData.message || 'Payment initialization failed')
        }
    } catch (error) {
        console.error('Payment error:', error)
        toast.error(`Payment Failed - ${error instanceof Error ? error.message : "Failed to initialize payment. Please try again."}`)
    } finally {
        setIsProcessingPayment(false)
    }
}

    return (
        <div className='flex flex-col bg-[#FCFCFC]'>
            <div className={`md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10 ${isSearchingOnMobile ? 'block' : 'block'}`}>
                <div className='flex items-center justify-between'>
                    <Link href={`/storefront/${storeId}`}>
                        <Logo />
                    </Link>
                    <div className='flex gap-2'>
                        <CartButton />
                    </div>
                </div>
            </div>
            <div className='p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden'>
                <div className={`w-full md:w-[45%] md:overflow-y-auto md:h-full md:block ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
                    <Card className='shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
                        <CardContent className='pb-2 border-b border-[#F5F5F5] dark:border-[#1F1F1F] space-y-4 pt-6'>
                            <h3 className='font-semibold'>Order Summary</h3>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm'>Item&apos;s total({cart.length})</span>
                                <span className='text-sm'>₦{itemsTotal.toLocaleString()}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm'>Delivery fee</span>
                                <span className='text-sm'>₦{deliveryFee.toLocaleString()}</span>
                            </div>
                            <div className='flex items-center justify-between'>
                                <span className='text-sm font-semibold'>Total</span>
                                <h4 className='font-bold'>₦{total.toLocaleString()}</h4>
                            </div>
                        </CardContent>
                        <CardFooter className='pt-4'>
                            <Button 
                                className='w-full bg-[#4FCA6A] hover:bg-[#45b85e]'
                                onClick={handleConfirmOrder}
                                disabled={isProcessingPayment || cart.length === 0}
                            >
                                {isProcessingPayment ? 'Processing...' : 'Confirm Order'}
                            </Button>
                        </CardFooter>
                    </Card>
                    <p className='text-center text-sm mt-4'>By proceeding, you are automatically accepting the <a href="" className='text-[#4FCA6A]'>Terms & Conditions</a> </p>
                </div>
                <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full'>
                    <div className='hidden md:flex items-center justify-between mb-6 sticky top-0 bg-[#FCFCFC] z-10 pb-4'>
                        <Link href={`/storefront/${storeId}`}>
                            <Logo />
                        </Link>
                        <div className='flex gap-2'>
                            <CartButton />
                        </div>
                    </div>
                    
                    {/* Customer Address Card */}
                    <Card className='shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
                        <CardHeader className='flex flex-row items-center justify-between border-b border-[#F5F5F5] dark:border-[#1F1F1F]'>
                            <h3 className='font-semibold'>1. CUSTOMER ADDRESS</h3>
                            {!isEditingAddress ? (
                                <Button variant={"outline"} className='text-[#4FCA6A]' onClick={handleEditAddress}>
                                    Change <EditIcon />
                                </Button>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Button variant={"outline"} onClick={handleCancelEdit}>Cancel</Button>
                                    <Button onClick={handleSaveAddress}><SaveIcon /> <span className="hidden sm:inline ml-2">Save Changes</span> </Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <div className='flex flex-col md:flex-row gap-4 justify-between items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>First Name </Label>
                                    <Input 
                                        className='w-full' 
                                        disabled={!isEditingAddress} 
                                        value={customerDetails.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                    />
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Last Name </Label>
                                    <Input 
                                        className='w-full' 
                                        disabled={!isEditingAddress} 
                                        value={customerDetails.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 md:flex-row gap-4 justify-between items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Email </Label>
                                    <Input 
                                        type='email' 
                                        disabled={!isEditingAddress} 
                                        value={customerDetails.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                    />
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Whatsapp Phone Number </Label>
                                    <div className='flex gap-1'>
                                        <Select 
                                            disabled={!isEditingAddress}
                                            value={customerDetails.phoneCode}
                                            onValueChange={(value) => handleInputChange('phoneCode', value)}
                                        >
                                            <SelectTrigger className='w-20'>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="+234">+234</SelectItem>
                                                <SelectItem value="+233">+233</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input 
                                            type='tel' 
                                            className='w-full' 
                                            disabled={!isEditingAddress} 
                                            value={customerDetails.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 md:flex-row gap-4 justify-between items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Delivery Address</Label>
                                    <Input 
                                        type='text' 
                                        className='w-full' 
                                        disabled={!isEditingAddress} 
                                        value={customerDetails.address}
                                        onChange={(e) => handleInputChange('address', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 md:flex-row gap-4 justify-center items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Country</Label>
                                    <Select 
                                        disabled={!isEditingAddress}
                                        value={customerDetails.country}
                                        onValueChange={(value) => handleInputChange('country', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nigeria">Nigeria</SelectItem>
                                            <SelectItem value="ghana">Ghana</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>State</Label>
                                    <Select 
                                        disabled={!isEditingAddress}
                                        value={customerDetails.state}
                                        onValueChange={(value) => handleInputChange('state', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lagos">Lagos</SelectItem>
                                            <SelectItem value="rivers">Rivers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 md:flex-row gap-4 justify-center items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>City</Label>
                                    <Select 
                                        disabled={!isEditingAddress}
                                        value={customerDetails.city}
                                        onValueChange={(value) => handleInputChange('city', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lekki">Lekki</SelectItem>
                                            <SelectItem value="lagos">Lagos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>LGA</Label>
                                    <Select 
                                        disabled={!isEditingAddress}
                                        value={customerDetails.lga}
                                        onValueChange={(value) => handleInputChange('lga', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="etiosa">Eti-osa</SelectItem>
                                            <SelectItem value="ibejulekki">Ibeju-Lekki</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Delivery Details Card */}
                    <Card className='shadow-none mt-6 border-[#F5F5F5] dark:border-[#1F1F1F]'>
                        <CardHeader className='flex flex-row items-center justify-between border-b border-[#F5F5F5] dark:border-[#1F1F1F]'>
                            <h3 className='font-semibold'>2. DELIVERY DETAILS</h3>
                            {!isEditingDelivery ? (
                                <Button variant={"outline"} className='text-[#4FCA6A]' onClick={handleEditDelivery}>
                                    Change <EditIcon />
                                </Button>
                            ) : (
                                <div className='flex items-center gap-2'>
                                    <Button variant={"outline"} onClick={handleCancelDeliveryEdit}>Cancel</Button>
                                    <Button onClick={handleSaveDelivery}><SaveIcon /> <span className="hidden sm:inline ml-2">Save</span></Button>
                                </div>
                            )}
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <RadioGroup value={deliveryMethod} onValueChange={(value: 'pickup' | 'door') => setDeliveryMethod(value)} disabled={!isEditingDelivery}>
                                {/* Pickup Station Option */}
                                <div className='flex items-start gap-3 mb-4'>
                                    <RadioGroupItem value="pickup" id="pickup" className='mt-1' />
                                    <div className='flex-1'>
                                        <Label htmlFor="pickup" className='text-sm font-medium cursor-pointer'>Pick-up Station</Label>
                                        <p className='text-xs text-[#A0A0A0] mt-1'>Delivery between <span className='text-primary font-medium'>13 October</span> and <span className='text-primary font-medium'>16 October</span></p>
                                    </div>
                                </div>

                                {/* Pickup Station Details */}
                                {deliveryMethod === 'pickup' && (
                                    <>
                                        <div className='mt-4 border border-[#E0E0E0] rounded-lg p-4 ml-7'>
                                            <div className='flex items-center justify-between'>
                                                <span className='text-xs font-medium'>Pick-up Station</span>
                                                <Button 
                                                    variant={"ghost"} 
                                                    className='text-[#4FCA6A] text-xs h-auto p-1'
                                                    onClick={handleOpenPickupModal}
                                                >
                                                    {selectedStation ? 'Change' : 'Select Pickup Station'} <EditIcon />
                                                </Button>
                                            </div>
                                            <div className='mt-2'>
                                                {selectedStation ? (
                                                    <>
                                                        <p className='text-sm font-medium'>{selectedStation.name}</p>
                                                        <span className='text-xs text-[#A0A0A0]'>{selectedStation.address}</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className='text-sm font-medium'>No Pickup Station Selected</p>
                                                        <span className='text-xs text-[#A0A0A0]'>To use this option, you will need to add a pickup station near your location.</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex gap-4 overflow-x-auto mt-4 pb-2 scrollbar-hide ml-7'>
                                            {cart.map((item, index) => (
                                                <div key={item.id} className='flex-shrink-0 w-[280px]'>
                                                    <div className='flex justify-between items-center'>
                                                        <p className='text-sm font-medium'>Shipment {index + 1}/{cart.length}</p>
                                                        <span className='text-xs text-[#A0A0A0]'>Fulfilled By Vendor</span>
                                                    </div>
                                                    <div className='border border-[#E0E0E0] rounded-lg p-4 mt-2'>
                                                        <p className='text-sm font-medium'>Pickup Station</p>
                                                        <span className='text-xs text-[#A0A0A0]'>Delivery between 13 October and 16 October</span>
                                                        <div className='flex gap-3 mt-3'>
                                                            <Image src={item.image} alt={item.name} width={50} height={50} className='object-cover w-12 h-12 rounded-lg'/>
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
                                    </>
                                )}

                                {/* Door Delivery Option */}
                                <div className='flex items-start gap-3 mt-6'>
                                    <RadioGroupItem value="door" id="door" className='mt-1' />
                                    <div className='flex-1'>
                                        <Label htmlFor="door" className='text-sm font-medium cursor-pointer'>Door Delivery</Label>
                                        <p className='text-xs text-[#A0A0A0] mt-1'>Delivery between <span className='text-primary font-medium'>13 October</span> and <span className='text-primary font-medium'>16 October</span></p>
                                    </div>
                                </div>

                                {deliveryMethod === 'door' && (
                                    <div className='flex gap-4 overflow-x-auto mt-4 pb-2 scrollbar-hide ml-7'>
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
                                                        <Image src={item.image} alt={item.name} width={50} height={50} className='object-cover w-12 h-12 rounded-lg'/>
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
                                )}
                            </RadioGroup>
                        </CardContent>
                    </Card>

                    {/* Payment Method Card */}
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

            <PickupStationModal
                open={isPickupModalOpen}
                onOpenChange={setIsPickupModalOpen}
                onSelectStation={handleSelectStation}
                selectedStation={selectedStation}
            />
        </div>
    )
}