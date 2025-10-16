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
import Link from 'next/link'
import React, { useState } from 'react'
import Image from 'next/image'
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
    const [searchQuery,] = useState('')
    const [isEditingAddress, setIsEditingAddress] = useState(false)
    const { cart, getCartTotal } = useCart()

    const isSearchingOnMobile = searchQuery.trim() !== ''
    
    // Calculate totals
    const itemsTotal = getCartTotal()
    const deliveryFee = 1700
    const total = itemsTotal + deliveryFee

    const handleEditAddress = () => {
        setIsEditingAddress(true)
    }

    const handleSaveAddress = () => {
        setIsEditingAddress(false)
        // Add logic to save address
    }

    const handleCancelEdit = () => {
        setIsEditingAddress(false)
        // Reset form values if needed
    }

    return (
        <div className='flex flex-col bg-[#FCFCFC]'>
            <div className={`md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10 ${isSearchingOnMobile ? 'block' : 'block'}`}>
                <div className='flex items-center justify-between'>
                    <Link href="/storefront">
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
                            <Button className='w-full bg-[#4FCA6A] hover:bg-[#45b85e]'>Confirm Order</Button>
                        </CardFooter>
                    </Card>
                    <p className='text-center text-sm mt-4'>By proceeding, you are automatically accepting the <a href="" className='text-[#4FCA6A]'>Terms & Conditions</a> </p>
                </div>
                <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full'>
                    <div className='hidden md:flex items-center justify-between mb-6 sticky top-0 bg-[#FCFCFC] z-10 pb-4'>
                        <Link href="/storefront">
                            <Logo />
                        </Link>
                        <div className='flex gap-2'>
                            <CartButton />
                        </div>
                    </div>
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
                                    <Button onClick={handleSaveAddress}><SaveIcon /> Save Changes</Button>
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
                                        defaultValue="John"
                                    />
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Last Name </Label>
                                    <Input
                                        className='w-full'
                                        disabled={!isEditingAddress}
                                        defaultValue="Doe"
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 md:flex-row gap-4 justify-between items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Email </Label>
                                    <Input
                                        type='text'
                                        disabled={!isEditingAddress}
                                        defaultValue="john@example.com"
                                    />
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Whatsapp Phone Number </Label>
                                    <div className='flex gap-1'>
                                        <Select disabled={!isEditingAddress}>
                                            <SelectTrigger className='w-20'>
                                                <SelectValue placeholder="+234" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="+234">+234</SelectItem>
                                                <SelectItem value="+233">+233</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Input
                                            type='number'
                                            className='w-full'
                                            disabled={!isEditingAddress}
                                            defaultValue="8012345678"
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
                                        defaultValue="123 Main Street, Lekki"
                                    />
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 md:flex-row gap-4 justify-center items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>Country</Label>
                                    <Select disabled={!isEditingAddress}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="nigeria">Nigeria</SelectItem>
                                            <SelectItem value="ghana">Ghana</SelectItem>
                                            <SelectItem value="kenya">Kenya</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>State</Label>
                                    <Select disabled={!isEditingAddress}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="lagos">Lagos</SelectItem>
                                            <SelectItem value="abuja">Abuja</SelectItem>
                                            <SelectItem value="rivers">Rivers</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className='flex flex-col mt-4 md:flex-row gap-4 justify-center items-center'>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>City</Label>
                                    <Select disabled={!isEditingAddress}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select City" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="portharcourt">Port Harcourt</SelectItem>
                                            <SelectItem value="lagos">Lagos</SelectItem>
                                            <SelectItem value="lekki">Lekki</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='w-full'>
                                    <Label className='text-xs mb-1'>LGA</Label>
                                    <Select disabled={!isEditingAddress}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select LGA" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="etiosa">Eti-osa</SelectItem>
                                            <SelectItem value="oriade">Oriade</SelectItem>
                                            <SelectItem value="ibejulekki">Ibeju-Lekki</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='shadow-none mt-6 border-[#F5F5F5] dark:border-[#1F1F1F]'>
                        <CardHeader className='flex flex-row items-center justify-between border-b border-[#F5F5F5] dark:border-[#1F1F1F]'>
                            <h3 className='font-semibold'>2. DELIVERY DETAILS</h3>
                            <Button variant={"outline"} className='text-[#4FCA6A]'>Change <EditIcon /></Button>
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <div>
                                <p className='text-sm font-medium'>Pick-up Station</p>
                                <p className='text-xs text-[#A0A0A0]'>Delivery between <span className='text-primary font-medium'>13 October</span> and <span className='text-primary font-medium'>16 October</span> </p>
                            </div>

                            <div className='mt-4 border border-[#E0E0E0] rounded-lg p-4'>
                                <div className='flex items-center justify-between'>
                                    <span className='text-xs'>Pick-up Station</span>
                                    <Button variant={"ghost"} className='text-[#4FCA6A] text-xs h-auto p-1'>Change <EditIcon /></Button>
                                </div>
                                <div className='mt-2'>
                                    <p className='text-sm font-medium'>SpeedAF Pickup Station</p>
                                    <span className='text-xs text-[#A0A0A0]'>LEGAL HOUSE PLAZA, K/M 3 Owerri-Onitsha Road, Irete, Imo State, Beside Save More Supermarket | Imo - Owerri</span>
                                </div>
                            </div>

                            {/* Horizontal Scrollable Shipments */}
                            <div className='flex gap-4 overflow-x-auto mt-4 pb-2 scrollbar-hide'>
                                {cart.map((item, index) => (
                                    <div key={item.id} className='flex-shrink-0 w-[280px]'>
                                        <div className='flex justify-between items-center'>
                                            <p className='text-sm font-medium'>Shipment {index + 1}/{cart.length}</p>
                                            <span className='text-xs text-[#A0A0A0]'>Fulfilled By Cassie&apos;s Kitchen</span>
                                        </div>
                                        <div className='border border-[#E0E0E0] rounded-lg p-4 mt-2'>
                                            <p className='text-sm font-medium'>Pickup Station</p>
                                            <span className='text-xs text-[#A0A0A0]'>Delivery between 13 October and 16 October</span>
                                            <div className='flex gap-3 mt-3'>
                                                <Image src={item.image} alt={item.name} width={50} height={50} className='object-cover w-12 h-12 rounded-lg'/>
                                                <div className='flex flex-col justify-between'>
                                                    <p className='text-sm'>{item.name}</p>
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

                            <div className='mt-6'>
                                <p className='text-sm font-medium'>Door Delivery</p>
                                <p className='text-xs text-[#A0A0A0]'>Delivery between <span className='text-primary font-medium'>13 October</span> and <span className='text-primary font-medium'>16 October</span> </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className='mt-6 shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
                        <CardHeader className='flex flex-row items-center justify-between border-b border-[#F5F5F5] dark:border-[#1F1F1F]'>
                            <h3 className='font-semibold'>3. PAYMENT METHOD</h3>
                            <Button variant={"outline"} className='text-[#4FCA6A]'>Change <EditIcon /></Button>
                        </CardHeader>
                        <CardContent className='pt-6'>
                            <PaystackLogo />
                            <p className='text-xs text-[#A0A0A0] mt-2'>This is the default payment for Swiftree</p>
                        </CardContent>
                    </Card>

                    <Link href={'/storefront'} className='flex text-sm items-center text-[#4FCA6A] mt-6 hover:underline'>
                        <ArrowIcon /> Go back & continue shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}