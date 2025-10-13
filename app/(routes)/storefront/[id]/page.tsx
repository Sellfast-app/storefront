"use client";

import React, { useState } from 'react'
import Banner from '@/public/Banner.png'
import Image from 'next/image'
import Logo from '@/components/svgIcons/Logo'
import { Input } from '@/components/ui/input'
import SearchIcon from '@/components/svgIcons/SearchIcon'
import FilterIcon from '@/components/svgIcons/FilterIcon'
import CartIcon from '@/components/svgIcons/CartIcon'
import { Button } from '@/components/ui/button'
import Rice from '@/public/Rice.png'
import { PlusIcon } from 'lucide-react';
import MinusIcon from '@/components/svgIcons/MinusIcon';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import GigIcon from '@/components/svgIcons/GigIcon';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';

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

// Rating breakdown data
const ratingBreakdown = [
  { stars: 5, count: 8, percentage: 33.8 },
  { stars: 4, count: 20, percentage: 84.4 },
  { stars: 3, count: 56, percentage: 236.3 },
  { stars: 2, count: 17, percentage: 71.7 },
  { stars: 1, count: 3, percentage: 12.7 }
]

// Customer reviews data
const customerReviews = [
  {
    id: 1,
    name: 'Anita Raine',
    rating: 4.5,
    timeAgo: '31 mins ago',
    comment: 'I had a wonderful session with Dr. Kim. He was really honest, gave me insightful ideas oon how to care of myself even in this delicate situation...'
  },
  {
    id: 2,
    name: 'Gracie James',
    rating: 4.5,
    timeAgo: 'Aug 15',
    comment: 'This was truly a great experience. He gave me time to find perspective in things that mattered, to be prepared to take charge of narratives and become better'
  },
  {
    id: 3,
    name: 'Stacie Flein Grace',
    rating: 3.5,
    timeAgo: 'Aug 18',
    comment: 'I had a wonderful session with Dr. Kim. He was really honest, gave me insightful ideas oon how to care of myself even in this delicate situation...'
  },
  {
    id: 4,
    name: 'Johanna Layina Ohioana',
    rating: 4.5,
    timeAgo: 'Aug 15',
    comment: 'This was truly a great experience. He gave me time to find perspective in things that mattered, to be prepared to take char...'
  }
]

// Star Rating Component for Overview (Green theme)
const StarRatingGreen = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= fullStars ? '#4FCA6A' : star === fullStars + 1 && hasHalfStar ? 'url(#half-green)' : '#D1FFDB'}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="half-green">
              <stop offset="50%" stopColor="#4FCA6A" />
              <stop offset="50%" stopColor="#D1FFDB" />
            </linearGradient>
          </defs>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  )
}

// Star Rating Component for Reviews (Orange theme)
const StarRatingOrange = ({ rating }: { rating: number }) => {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 !== 0

  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={star <= fullStars ? '#FEA436' : star === fullStars + 1 && hasHalfStar ? 'url(#half-orange)' : '#FFE0BA'}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="half-orange">
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

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Check if we're searching on mobile (only hide content on mobile, not desktop)
  const isSearchingOnMobile = searchQuery.trim() !== ''

  // Calculate totals
  const totalReviews = ratingBreakdown.reduce((sum, item) => sum + item.count, 0)
  const averageRating = 4.5

  return (
    <div className='flex flex-col'>
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
            <Button variant={"outline"}><CartIcon /></Button>
          </div>
        </div>
      </div>
      <div className='p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden'>
        <div className={`w-full md:w-[45%] md:overflow-y-auto md:h-full md:block ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
          <div className='flex gap-4'>
            <div className='flex flex-col gap-2'>
              <Image src={Banner} alt='' className='w-25 h-25 rounded-lg' />
              <Image src={Banner} alt='' className='w-25 h-25 rounded-lg' />
              <Image src={Banner} alt='' className='w-25 h-25 rounded-lg' />
            </div>
            <Image src={Banner} alt='' className='w-full md:h-90 object-fit rounded-lg ' />
          </div>
          <div className='mt-6'>
            <span>Nigerian Jollof, Salad & Fried Chicken</span>
            <div className='flex items-center justify-between '>
              <h3 className='font-semibold'>₦5,600</h3>
              <div className='flex items-center h-full jusify-between text-xs border rounded-xl p-1 bg-[#E0E0E0]'>
                <PlusIcon className='w-4 h-4 pr-1' />
                <span className='px-4 bg-card h-full'>1</span>
                <MinusIcon className='w-4 h-4 pl-1' />
              </div>
            </div>
            <div className='flex justify-between items-center mt-6'>
              <div className='text-xs text-[#4FCA6A]'>(6 verified ratings)</div>
              <div className='text-xs'>Est. Prod Days: 2 - 3 days</div>
            </div>
            <div className='mt-4'>
              <Label>Choose your location</Label>
              <div className='flex items-center flex flex-col md:flex-row mt-2 gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger className='w-full md:w-1/2 border rounded-lg p-2 text-xs text-left'>Select State</DropdownMenuTrigger>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger className='w-full md:w-1/2 border rounded-lg p-2 text-xs text-left'>Select LGA</DropdownMenuTrigger>
                </DropdownMenu>
              </div>
              <Card className='mt-4 border border-[#F5F5F5] dark:border-[#1F1F1F]'>
                <CardContent className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2'>
                    <GigIcon />
                    <div className='flex flex-col'>
                      <h4>GIG Logistics - Shipping Fee</h4>
                      <span>+₦1,600</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between '>
                    <div className='flex flex-col'>
                      <span className='text-xs'>Total Price:</span>
                      <h3>₦7,200</h3>
                    </div>
                    <Button> <CartIcon /> Add to Cart</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className='mt-4 border-[#F5F5F5] dark:border-[#1F1F1F]'>
                <CardHeader className='border-b border-[#F5F5F5] dark:border-[#1F1F1F] text-sm font-semibold'>
                  <h3> Product Details</h3>
                </CardHeader>
                <CardContent className='flex flex-col gap-2'>
                  <span className='text-sm'>
                    Delight in the vibrant flavors of authentic Nigerian Jollof Rice, perfectly paired with a fresh, crisp salad and golden, crispy fried chicken.
                    The accompanying fried chicken is meticulously seasoned and fried to a golden perfection, delivering juicy, tender meat with a flavorful, crispy coating. Complementing the main dishes is our hand-prepared salad a refreshing mix of fresh vegetables for a balanced, colorful, and satisfying meal .
                    Perfect for individual meals, family gatherings, or special events, this trio combines traditional taste with modern presentation. Treat yourself to an unforgettable taste of Nigeria with every serving.
                  </span>
                  <span className='text-sm'>Key Features:</span>
                  <ul className="list-disc list-inside text-sm">
                    <li>Authentic,rich,and smoky Nigerian Jollof rice</li>
                    <li>Authentic,rich,and smoky Nigerian Jollof rice</li>
                    <li>Authentic,rich,and smoky Nigerian Jollof rice</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className='mt-4 border-[#F5F5F5] dark:border-[#1F1F1F]'>
                <CardHeader className='border-b border-[#F5F5F5] dark:border-[#1F1F1F] flex flex-row items-center justify-between'>
                  <h3 className='font-semibold'>Customer Feedback</h3>
                  <Button className='text-[#4FCA6A] p-0 h-auto' variant={"link"}>See all</Button>
                </CardHeader>
                <CardContent className='pt-6 flex flex-col md:flex-row gap-3'>
                  <div className='flex flex-col gap-6 w-full md:w-[35%]'>
                    {/* Left Side - Rating Summary with GREEN stars */}
                    <div className='w-full bg-[#F5F5F5] dark:bg-[#1F1F1F] rounded-lg p-6 flex flex-col items-center justify-center'>
                      <h2 className='text-2xl font-bold text-[#4FCA6A]'>{averageRating}/5</h2>
                      <StarRatingGreen rating={averageRating} />
                      <span className='text-sm mt-2'>{totalReviews} reviews</span>
                    </div>

                    {/* Right Side - Rating Breakdown */}
                    <div className='w-full flex flex-col gap-2'>
                      {ratingBreakdown.map((item) => (
                        <div key={item.stars} className='flex items-center gap-3'>
                          <span className='text-sm w-2'>{item.stars}</span>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#FEA436">
                            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                          </svg>
                          <div className='flex-1'>
                            <Progress 
                              value={item.percentage} 
                              className='h-2 bg-[#E8F5E9]'
                            />
                          </div>
                          <span className='text-sm w-8 text-right'>({item.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer Reviews List with ORANGE stars */}
                  <div className='mt-8 space-y-6 w-full md:w-[65%]'>
                    {customerReviews.map((review) => (
                      <div key={review.id} className='flex gap-3'>
                        <Avatar className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400' />
                        <div className='flex-1'>
                          <div className='flex items-start justify-between'>
                            <div>
                              <h4 className='font-semibold text-sm'>{review.name}</h4>
                              <StarRatingOrange rating={review.rating} />
                            </div>
                            <span className='text-xs text-gray-500'>{review.timeAgo}</span>
                          </div>
                          <p className='text-sm mt-2 text-gray-700 dark:text-gray-300 line-clamp-3'>{review.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
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
              <Button variant={"outline"}><CartIcon /></Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className='flex flex-col rounded-2xl border border-[#F5F5F5] dark:border-[#1F1F1F] hover:border-[#4FCA6A] transition-colors'>
                  <Image src={product.image} alt={product.name} className='object-cover w-full h-45 rounded-t-2xl' />
                  <p className='text-xs mt-2 px-2'>{product.name}</p>
                  <div className='flex items-center justify-between mt-2 px-2 pb-3'>
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

    </div>
  )
}

export default Page