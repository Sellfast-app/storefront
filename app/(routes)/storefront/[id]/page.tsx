// storefront/[id]/page.tsx
"use client";

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Banner from '@/public/Banner.png'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/components/svgIcons/Logo'
import { Input } from '@/components/ui/input'
import SearchIcon from '@/components/svgIcons/SearchIcon'
import FilterIcon from '@/components/svgIcons/FilterIcon'
import CartIcon from '@/components/svgIcons/CartIcon'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react';
import MinusIcon from '@/components/svgIcons/MinusIcon';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import GigIcon from '@/components/svgIcons/GigIcon';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { getProductById, products, ratingBreakdown, customerReviews } from '@/lib/mockdata'
import { useCart } from '@/context/CartContext'
import CartButton from '@/components/CartButton'

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
  const params = useParams()
  const productId = Number(params.id)
  const product = getProductById(productId)
  const { addToCart } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [quantity, setQuantity] = useState(1)

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && p.id !== productId
  ).slice(0, 6)

  const isSearchingOnMobile = searchQuery.trim() !== ''

  const totalReviews = ratingBreakdown.reduce((sum, item) => sum + item.count, 0)
  const shippingFee = 1600
  const totalPrice = product ? (product.price * quantity) + shippingFee : 0

  const incrementQuantity = () => setQuantity(prev => prev + 1)
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  const handleAddToCart = (e?: React.MouseEvent, prod?: typeof products[0], qty: number = 1) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    const productToAdd = prod || product
    if (productToAdd) {
      addToCart(productToAdd, qty)
    }
  }

  if (!product) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Product Not Found</h2>
          <Link href="/storefront">
            <Button>Back to Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className={`md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10 ${isSearchingOnMobile ? 'block' : 'block'}`}>
        <div className='flex items-center justify-between'>
          <Link href="/storefront">
            <Logo />
          </Link>
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
            <CartButton />
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
            <span className='text-lg font-medium'>{product.name}</span>
            <div className='flex items-center justify-between mt-2'>
              <h3 className='font-semibold text-xl'>₦{product.price.toLocaleString()}</h3>
              <div className='flex items-center h-full justify-between text-xs border rounded-xl p-1 bg-[#E0E0E0]'>
                <button onClick={incrementQuantity} className='p-1 hover:bg-gray-200 rounded'>
                  <PlusIcon className='w-4 h-4' />
                </button>
                <span className='px-4 bg-card h-full flex items-center'>{quantity}</span>
                <button onClick={decrementQuantity} className='p-1 hover:bg-gray-200 rounded'>
                  <MinusIcon className='w-4 h-4' />
                </button>
              </div>
            </div>
            
            <div className='flex justify-between items-center mt-6'>
              <div className='text-xs text-[#4FCA6A]'>({product.verifiedRatings} verified ratings)</div>
              <div className='text-xs'>Est. Prod Days: {product.estimatedDays}</div>
            </div>
            
            <div className='mt-4'>
              <Label>Choose your location</Label>
              <div className='flex items-center flex-col md:flex-row mt-2 gap-2'>
                <DropdownMenu>
                  <DropdownMenuTrigger className='w-full md:w-1/2 border rounded-lg p-2 text-xs text-left'>Select State</DropdownMenuTrigger>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger className='w-full md:w-1/2 border rounded-lg p-2 text-xs text-left'>Select LGA</DropdownMenuTrigger>
                </DropdownMenu>
              </div>
              
              <Card className='mt-4 border border-[#F5F5F5] dark:border-[#1F1F1F]'>
                <CardContent className='flex flex-col gap-4 pt-6'>
                  <div className='flex items-center gap-2'>
                    <GigIcon />
                    <div className='flex flex-col'>
                      <h4 className='text-sm font-medium'>GIG Logistics - Shipping Fee</h4>
                      <span className='text-sm'>+₦{shippingFee.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between'>
                    <div className='flex flex-col'>
                      <span className='text-xs text-gray-500'>Total Price:</span>
                      <h3 className='text-xl font-bold'>₦{totalPrice.toLocaleString()}</h3>
                    </div>
                    <Button className='gap-2' onClick={() => handleAddToCart(undefined, product, quantity)}>
                      <CartIcon /> Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className='mt-4 border-[#F5F5F5] dark:border-[#1F1F1F]'>
                <CardHeader className='border-b border-[#F5F5F5] dark:border-[#1F1F1F] text-sm font-semibold'>
                  <h3>Product Details</h3>
                </CardHeader>
                <CardContent className='flex flex-col gap-2 pt-6'>
                  <span className='text-sm'>{product.description}</span>
                  <span className='text-sm font-semibold mt-2'>Key Features:</span>
                  <ul className="list-disc list-inside text-sm">
                    {product.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
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
                    <div className='w-full bg-[#F5F5F5] dark:bg-[#1F1F1F] rounded-lg p-6 flex flex-col items-center justify-center'>
                      <h2 className='text-2xl font-bold text-[#4FCA6A]'>{product.averageRating}/5</h2>
                      <StarRatingGreen rating={product.averageRating} />
                      <span className='text-sm mt-2'>{totalReviews} reviews</span>
                    </div>

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

                  <div className='mt-8 md:mt-0 space-y-6 w-full md:w-[65%]'>
                    {customerReviews.map((review) => (
                      <div key={review.id} className='flex gap-3'>
                        <Avatar className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400'>{review.initials}</Avatar>
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
          <div className='hidden md:flex items-center justify-between mb-6 sticky top-0 bg-white dark:bg-background z-10 pb-4'>
            <Link href="/storefront">
              <Logo />
            </Link>
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
              <CartButton />
            </div>
          </div>

          <h3 className='font-semibold mb-4'>Related Products</h3>
          <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod) => (
                <Link href={`/storefront/${prod.id}`} key={prod.id}>
                  <div className='flex flex-col rounded-2xl border border-[#F5F5F5] dark:border-[#1F1F1F] hover:border-[#4FCA6A] transition-colors cursor-pointer'>
                    <Image src={prod.image} alt={prod.name} width={300} height={200} className='object-cover w-full h-45 rounded-t-2xl' />
                    <p className='text-xs mt-2 px-2'>{prod.name}</p>
                    <div className='flex items-center justify-between mt-2 px-2 pb-3'>
                      <span>₦{prod.price.toLocaleString()}</span>
                      <Button 
                        className='text-xs' 
                        onClick={(e) => handleAddToCart(e, prod, 1)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className='col-span-2 lg:col-span-3 text-center py-8'>
                <p className='text-gray-500'>No related products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page