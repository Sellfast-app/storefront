'use client'

import Image from 'next/image'
import React, { useState } from 'react'
import Banner from '@/public/Banner.png'
import Profile from '@/public/profile.png'
import FacebookIcon from '@/components/svgIcons/FacebookIcon'
import WhatsappIcon from '@/components/svgIcons/WhatsappIcon'
import InstagramIcon from '@/components/svgIcons/InstagramIcon'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import Logo from '@/components/svgIcons/Logo'
import { Input } from '@/components/ui/input'
import SearchIcon from '@/components/svgIcons/SearchIcon'
import { Button } from '@/components/ui/button'
import CartIcon from '@/components/svgIcons/CartIcon'
import FilterIcon from '@/components/svgIcons/FilterIcon'
import Rice from '@/public/Rice.png'

// Product data array
const products = [
    {
        id: 1,
        image: Rice,
        name: 'Jollof Rice with Chicken',
        price: 4500
    },
    {
        id: 2,
        image: Rice,
        name: 'Fried Rice, Plantain & Chicken',
        price: 5600
    },
    {
        id: 3,
        image: Rice,
        name: 'Native Rice with Fish',
        price: 4200
    },
    {
        id: 4,
        image: Rice,
        name: 'Coconut Rice & Beef',
        price: 5000
    },
    {
        id: 5,
        image: Rice,
        name: 'White Rice & Stew with Turkey',
        price: 6000
    },
    {
        id: 6,
        image: Rice,
        name: 'Basmati Fried Rice Special',
        price: 6500
    },
    {
        id: 7,
        image: Rice,
        name: 'Ofada Rice & Ayamase Sauce',
        price: 5500
    },
    {
        id: 8,
        image: Rice,
        name: 'Chicken Fried Rice Combo',
        price: 5800
    },
    {
        id: 9,
        image: Rice,
        name: 'Jollof Rice Party Pack',
        price: 7000
    },
    {
        id: 10,
        image: Rice,
        name: 'Mixed Rice with Grilled Fish',
        price: 6200
    },
    {
        id: 11,
        image: Rice,
        name: 'Vegetable Fried Rice',
        price: 4800
    },
    {
        id: 12,
        image: Rice,
        name: 'Shrimp Fried Rice Deluxe',
        price: 7500
    }
]

function Page() {
    const [searchQuery, setSearchQuery] = useState('')

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className='p-6 flex flex-col md:flex-row justify-between gap-4'>
            <div className='w-full md:w-[45%]'>
                <div className='relative'>
                    <Image src={Banner} alt='' className='w-full object-cover rounded-xl h-50 md:h-90' />
                    <div className='absolute bottom-[-30px] md:bottom-[-60px] left-1/2 -translate-x-1/2'>
                        <Image src={Profile} alt='' className='rounded-full w-20 h-20 md:w-40 md:h-40 border-6 border-white' />
                    </div>
                </div>
                <div className='mt-16'>
                    <h3 className='text-center mt-6  text-lg font-semibold'>Cassie&apos;s Kitchen</h3>
                    <div className='flex items-center justify-center gap-4 mt-2'>
                        <div className='flex flex-col items-center'>
                            <h3 className='text-lg font-semibold'>24</h3>
                            <span className='text-xs text-[#A0A0A0]'>Listings</span>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h3 className='text-lg font-semibold'>4.5</h3>
                            <span className='text-xs text-[#A0A0A0]'>Ratings</span>
                        </div>
                        <div className='flex flex-col items-center'>
                            <h3 className='text-lg font-semibold'>87%</h3>
                            <span className='text-xs text-[#A0A0A0]'>Performance Score</span>
                        </div>
                    </div>
                </div>
                <div className='flex flex-row md:flex-col justify-center md:justify-normal mt-6 gap-4'>
                    <div className='flex items-center gap-3'><FacebookIcon /> <span className='rounded-full bg-[#F5F5F5] text-sm p-2 hidden md:block'>www.facebook.com/Cassies-Kitchen</span></div>
                    <div className='flex items-center gap-3'><WhatsappIcon /> <span className='rounded-full bg-[#F5F5F5] text-sm p-2 hidden md:block'>wa.me/chat.whatsapp.com/2348093450098</span></div>
                    <div className='flex items-center gap-3'><InstagramIcon /> <span className='rounded-full bg-[#F5F5F5] text-sm p-2 hidden md:block'>www.instagram.com/cassies-kitchen</span></div>
                </div>
                <div className='mt-6 flex justify-between items-center'>
                    <span>Reviews(420)</span>
                    <span className='text-[#4FCA6A]'>See All</span>
                </div>
                <div>
                    <Card className='shadow-none border-[#F5F5F5] dark:border-background mt-6'>
                        <CardContent>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-2'>
                                    <Avatar>RE</Avatar>
                                    <div className='flex flex-col'>
                                        Anita Raine
                                    </div>
                                </div>
                                <span className='text-xs text-[#A0A0A0]'>31 mins ago</span>
                            </div>
                            <p className='text-sm line-clamp-2 mt-3'>I had a wonderful session with Dr. Kim. He was really honest, gave me insightful ideas oon how to care of myself even in this delicate situation, and challenged me to find myself and take charge to becoming a better woman</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div className='w-full md:w-[55%]'>
                <div className='flex items-center justify-between'>
                    <Logo />
                    <div className='flex gap-2'>
                        <div className="relative flex items-center pb-2">
                            <Input
                                placeholder='Search...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full sm:w-64 md:w-84 pl-8 pr-8 py-2 text-xs sm:text-sm dark:bg-background rounded-lg border-[#F5F5F5] dark:border-[#1F1F1F]" />
                            <SearchIcon className="absolute left-3 top-5 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FilterIcon className="absolute right-3 top-5 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        </div>
                        <Button variant={"outline"}><CartIcon /></Button>
                    </div>
                </div>
                <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6'>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <div key={product.id} className='flex flex-col'>
                                <Image src={product.image} alt={product.name} className='object-cover w-full h-45 rounded-t-2xl'/>
                                <p className='text-xs mt-2'>{product.name}</p>
                                <div className='flex items-center justify-between mt-2'>
                                    <span>₦{product.price.toLocaleString()}</span>
                                    <Button className='text-xs'>
                                        Add to Cart
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='col-span-2 lg:col-span-3 text-center py-8'>
                            <p className='text-gray-500'>No products found matching &quot;{searchQuery}&quot;</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page