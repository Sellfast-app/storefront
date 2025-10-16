// storefront/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
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
import FilterIcon from '@/components/svgIcons/FilterIcon'
import { products, customerReviews } from '@/lib/mockdata'
import { useCart } from '@/context/CartContext'
import CartButton from '@/components/CartButton'
import CartView from '@/components/CartView'

const StarRating = ({ rating }: { rating: number }) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    return (
        <div className='flex gap-1 mt-1'>
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill={star <= fullStars ? '#FEA436' : star === fullStars + 1 && hasHalfStar ? 'url(#half)' : '#FFE0BA'}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="half">
                            <stop offset="50%" stopColor="#FEA436" />
                            <stop offset="50%" stopColor="#FFE0BA" />
                        </linearGradient>
                    </defs>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
            ))}
        </div>
    )
}

function Page() {
    const [searchQuery, setSearchQuery] = useState('')
    const [showCart, setShowCart] = useState(false)
    const { addToCart } = useCart()

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Check if we're searching on mobile (only hide content on mobile, not desktop)
    const isSearchingOnMobile = searchQuery.trim() !== ''

    const handleAddToCart = (e: React.MouseEvent, product: typeof products[0]) => {
        e.preventDefault()
        e.stopPropagation()
        addToCart(product, 1)
    }

    const toggleCart = () => {
        setShowCart(!showCart)
    }

    return (
        <div className='flex flex-col bg-[#FCFCFC]'>
            {/* Mobile Search Header - Only visible on mobile */}
            <div className={`md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10 ${isSearchingOnMobile ? 'block' : 'block'}`}>
                <div className='flex items-center justify-between'>
                    <Logo />
                    <div className='flex gap-2'>
                        <div className="relative flex items-center">
                            <Input
                                placeholder='Search...'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-8 pr-8 py-2 text-xs dark:bg-background rounded-lg border-[#F5F5F5] dark:border-[#1F1F1F]" />
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        <CartButton onClick={toggleCart} />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className='p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden'>
                {/* Left Side - Profile Section OR Cart View */}
                <div className={`w-full md:w-[45%] md:overflow-y-auto md:h-full md:block ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
                    {showCart ? (
                        <CartView />
                    ) : (
                        <>
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

                            {/* Reviews Section - Visible on desktop */}
                            <div className='hidden md:block'>
                                <div className='mt-6 flex justify-between items-center'>
                                    <span>Reviews({customerReviews.length})</span>
                                    <span className='text-[#4FCA6A] cursor-pointer'>See All</span>
                                </div>
                                <div className='space-y-4'>
                                    {customerReviews.slice(0, 3).map((review) => (
                                        <Card key={review.id} className='shadow-none border-[#F5F5F5] dark:border-background mt-6'>
                                            <CardContent>
                                                <div className='flex items-center justify-between'>
                                                    <div className='flex items-center gap-2'>
                                                        <Avatar>{review.initials}</Avatar>
                                                        <div className='flex flex-col'>
                                                            <span>{review.name}</span>
                                                            <StarRating rating={review.rating} />
                                                        </div>
                                                    </div>
                                                    <span className='text-xs text-[#A0A0A0]'>{review.timeAgo}</span>
                                                </div>
                                                <p className='text-sm line-clamp-2 mt-3'>{review.comment}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Side - Products Section */}
                <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full'>
                    {/* Desktop Search Header - Only visible on desktop */}
                    <div className='hidden md:flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-background z-10 pb-4'>
                        <Logo />
                        <div className='flex gap-2'>
                            <div className="relative flex items-center">
                                <Input
                                    placeholder='Search...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-64 md:w-84 pl-8 pr-8 py-2 text-xs sm:text-sm dark:bg-background rounded-lg border-[#F5F5F5] dark:border-[#1F1F1F]" />
                                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                            <CartButton onClick={toggleCart} />
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <Link href={`/storefront/${product.id}`} key={product.id}>
                                    <div className='flex flex-col rounded-2xl border border-[#F5F5F5] dark:border-[#1F1F1F] hover:border-[#4FCA6A] transition-colors cursor-pointer'>
                                        <Image src={product.image} alt={product.name} width={300} height={200} className='object-cover w-full h-45 rounded-t-2xl' />
                                        <p className='text-xs mt-2 px-2'>{product.name}</p>
                                        <div className='flex items-center justify-between mt-2 px-2 pb-3'>
                                            <span>₦{product.price.toLocaleString()}</span>
                                            <Button 
                                                className='text-xs' 
                                                onClick={(e) => handleAddToCart(e, product)}
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className='col-span-2 lg:col-span-3 text-center py-8'>
                                <p className='text-gray-500'>No products found matching &quot;{searchQuery}&quot;</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reviews Section - Only visible on mobile, below products */}
            <div className={`md:hidden p-6 ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
                <div className='flex justify-between items-center'>
                    <span>Reviews({customerReviews.length})</span>
                    <span className='text-[#4FCA6A] cursor-pointer'>See All</span>
                </div>
                <div className='space-y-4'>
                    {customerReviews.map((review) => (
                        <Card key={review.id} className='shadow-none border-[#F5F5F5] dark:border-background mt-6'>
                            <CardContent>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <Avatar>{review.initials}</Avatar>
                                        <div className='flex flex-col'>
                                            <span>{review.name}</span>
                                            <StarRating rating={review.rating} />
                                        </div>
                                    </div>
                                    <span className='text-xs text-[#A0A0A0]'>{review.timeAgo}</span>
                                </div>
                                <p className='text-sm line-clamp-2 mt-3'>{review.comment}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Page