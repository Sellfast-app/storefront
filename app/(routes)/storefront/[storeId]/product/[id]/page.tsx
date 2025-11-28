// app/storefront/[storeId]/product/[id]/page.tsx
"use client";

import React, { useState, useEffect } from 'react'
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { ratingBreakdown, customerReviews } from '@/lib/mockdata'
import { useCart } from '@/context/CartContext'
import CartButton from '@/components/CartButton'
import CartView from '@/components/CartView'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface Product {
  id: string;
  store_id: string;
  variants: string;
  created_at: string;
  updated_at: string;
  product_sku: string;
  product_name: string;
  product_type: string;
  product_price: number;
  product_images: string[];
  product_status: string;
  est_prod_days_to: number;
  product_quantity: number;
  est_prod_days_from: number;
  product_description: string;
}

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
  const storeId = params.storeId as string
  const productId = params.id as string
  
  const { addToCart, cart } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [showCart, setShowCart] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingRelated, setIsLoadingRelated] = useState(true)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!storeId || !productId) return

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/stores/${storeId}/products/${productId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch product')
        }

        const result = await response.json()
        
        if (result.status === 'success' && result.data) {
          setProduct(result.data)
        } else {
          throw new Error('Product not found')
        }
        
      } catch (err) {
        console.error('Error fetching product:', err)
        setError(err instanceof Error ? err.message : 'Product not found')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [storeId, productId])

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!storeId) return

      setIsLoadingRelated(true)

      try {
        const queryParams = new URLSearchParams({
          page: '1',
          pageSize: '6',
          status: 'ready',
        })

        const response = await fetch(`/api/stores/${storeId}/products?${queryParams.toString()}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch related products')
        }

        const result = await response.json()
        
        if (result.status === 'success' && result.data) {
          // Filter out the current product
          const filtered = result.data.items.filter((p: Product) => p.id !== productId)
          setRelatedProducts(filtered.slice(0, 6))
        }
        
      } catch (err) {
        console.error('Error fetching related products:', err)
      } finally {
        setIsLoadingRelated(false)
      }
    }

    fetchRelatedProducts()
  }, [storeId, productId])

  const filteredProducts = relatedProducts.filter(p =>
    p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isSearchingOnMobile = searchQuery.trim() !== ''

  const totalReviews = ratingBreakdown.reduce((sum, item) => sum + item.count, 0)

  // Get current product quantity from cart
  const getCurrentQuantity = () => {
    if (!product) return 0
    const cartItem = cart.find(item => item.id === product.id)
    return cartItem ? cartItem.quantity : 0
  }

  const currentQuantity = getCurrentQuantity()
  const totalPrice = product ? (product.product_price * currentQuantity) : 0

  // Add one to cart
  const incrementQuantity = () => {
    if (product) {
      const cartProduct = {
        id: product.id,
        name: product.product_name,
        price: product.product_price,
        image: product.product_images[0] || Banner,
        description: product.product_description,
      }
      addToCart(cartProduct, 1)
      console.log('➕ Added 1 to cart:', cartProduct)
    }
  }

  // Remove one from cart (but keep minimum of 0)
  const decrementQuantity = () => {
    if (product && currentQuantity > 0) {
      const cartProduct = {
        id: product.id,
        name: product.product_name,
        price: product.product_price,
        image: product.product_images[0] || Banner,
        description: product.product_description,
      }
      // Add -1 quantity (your cart context handles this by adding negative quantity)
      addToCart(cartProduct, -1)
      console.log('➖ Removed 1 from cart:', cartProduct)
    }
  }

  // Simple handleAddToCart function that matches the storefront page
  const handleAddToCart = (e?: React.MouseEvent, prod?: Product) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    const productToAdd = prod || product
    if (productToAdd) {
      const cartProduct = {
        id: productToAdd.id,
        name: productToAdd.product_name,
        price: productToAdd.product_price,
        image: productToAdd.product_images[0] || Banner,
        description: productToAdd.product_description,
      }
      
      // Add to cart with quantity 1 (if not already in cart)
      addToCart(cartProduct, 1)
      
      console.log('🛒 Added to cart:', cartProduct)
    }
  }

  // Handle related product add to cart (always quantity 1 like in storefront)
  const handleRelatedProductAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault()
    e.stopPropagation()
    
    const cartProduct = {
      id: prod.id,
      name: prod.product_name,
      price: prod.product_price,
      image: prod.product_images[0] || Banner,
      description: prod.product_description,
    }
    
    addToCart(cartProduct, 1)
    
    console.log('🛒 Added related product to cart:', cartProduct)
  }

  const toggleCart = () => {
    setShowCart(!showCart)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-[#FCFCFC]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FCA6A] mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading product...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !product) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Product Not Found</h2>
          <p className='text-gray-600 mb-6'>{error || 'The product you are looking for does not exist.'}</p>
          <Link href={`/storefront/${storeId}`}>
            <Button>Back to Store</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col bg-[#FCFCFC]'>
      <div className={`md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10 ${isSearchingOnMobile ? 'block' : 'block'}`}>
        <div className='flex items-center justify-between'>
          <Link href={`/storefront/${storeId}`}>
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
            <CartButton onClick={toggleCart} />
          </div>
        </div>
      </div>
      
      <div className='p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden'>
        <div className={`w-full md:w-[45%] md:overflow-y-auto md:h-full md:block ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
          {showCart ? (
            <CartView />
          ) : (
            <>
              {/* Product Images Swiper */}
              <div className='mb-6'>
                {/* Main Image Swiper */}
                <Swiper
                  modules={[Navigation, Pagination, Thumbs]}
                  spaceBetween={10}
                  navigation={true}
                  pagination={{ 
                    clickable: true,
                    type: product.product_images.length > 1 ? 'bullets' : 'fraction'
                  }}
                  thumbs={{ swiper: thumbsSwiper }}
                  onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                  className="w-full h-auto mb-4 rounded-lg"
                >
                  {product.product_images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="relative w-full h-80 md:h-96">
                        <Image
                          src={image || Banner}
                          alt={`${product.product_name} - Image ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                          priority={index === 0}
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Thumbnail Swiper */}
                {product.product_images.length > 1 && (
                  <Swiper
                    modules={[Thumbs]}
                    watchSlidesProgress
                    onSwiper={setThumbsSwiper}
                    spaceBetween={8}
                    slidesPerView={4}
                    freeMode={true}
                    className="w-full thumbs-swiper"
                  >
                    {product.product_images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div 
                          className={`relative w-full h-20 cursor-pointer border-2 rounded-lg transition-all ${
                            activeImageIndex === index 
                              ? 'border-[#4FCA6A]' 
                              : 'border-transparent'
                          }`}
                        >
                          <Image
                            src={image || Banner}
                            alt={`${product.product_name} - Thumbnail ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                )}
              </div>
              
              <div className='mt-6'>
                <span className='text-lg font-medium'>{product.product_name}</span>
                <div className='flex items-center justify-between mt-2'>
                  <h3 className='font-semibold text-xl'>₦{product.product_price.toLocaleString()}</h3>
                  <div className='flex items-center h-full justify-between text-xs border rounded-xl p-1 bg-[#E0E0E0]'>
                    <button 
                      onClick={incrementQuantity} 
                      className='p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      <PlusIcon className='w-4 h-4' />
                    </button>
                    <span className='px-4 bg-card h-full flex items-center'>
                      {currentQuantity}
                    </span>
                    <button 
                      onClick={decrementQuantity} 
                      className='p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed'
                      disabled={currentQuantity === 0}
                    >
                      <MinusIcon className='w-4 h-4' />
                    </button>
                  </div>
                </div>
                
                <div className='flex justify-between items-center mt-6'>
                  <div className='text-xs text-[#4FCA6A]'>SKU: {product.product_sku}</div>
                  <div className='text-xs'>Est. {product.est_prod_days_from}-{product.est_prod_days_to} days</div>
                </div>
                
                <div className='mt-4'>
                  <Card className='mt-4 shadow-none border border-[#F5F5F5] dark:border-[#1F1F1F]'>
                    <CardContent className='flex flex-col gap-4 pt-6'>
                    
                      <div className='flex justify-between'>
                        <div className=''>
                          <span className='text-xs text-gray-500'>Total Price:</span>
                          <h3 className='text-xl font-bold'>₦{totalPrice.toLocaleString()}</h3>
                        </div>
                        <Button 
                          className='' 
                          onClick={() => handleAddToCart()}
                          disabled={currentQuantity > 0}
                        >
                          <CartIcon /> 
                          {currentQuantity > 0 ? 'In Cart' : 'Add to Cart'}
                        </Button>
                      </div>
                      {currentQuantity > 0 && (
                        <div className='text-xs text-green-600 text-center'>
                          ✓ {currentQuantity} item{currentQuantity > 1 ? 's' : ''} in cart • Use +/- to adjust quantity
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Rest of the product details and reviews sections remain the same */}
                  <Card className='mt-4 shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
                    <CardHeader className='border-b border-[#F5F5F5] dark:border-[#1F1F1F] text-sm font-semibold'>
                      <h3>Product Details</h3>
                    </CardHeader>
                    <CardContent className='flex flex-col gap-2 pt-6'>
                      <span className='text-sm'>{product.product_description}</span>
                      <div className='mt-2 grid grid-cols-2 gap-2 text-xs'>
                        <div><span className='font-semibold'>Type:</span> {product.product_type}</div>
                        <div><span className='font-semibold'>Status:</span> {product.product_status}</div>
                        <div><span className='font-semibold'>Quantity:</span> {product.product_quantity}</div>
                        <div><span className='font-semibold'>SKU:</span> {product.product_sku}</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* <Card className='mt-4 shadow-none border-[#F5F5F5] dark:border-[#1F1F1F]'>
                    <CardHeader className='border-b border-[#F5F5F5] dark:border-[#1F1F1F] flex flex-row items-center justify-between'>
                      <h3 className='font-semibold'>Customer Feedback</h3>
                      <Button className='text-[#4FCA6A] p-0 h-auto' variant={"link"}>See all</Button>
                    </CardHeader>
                    <CardContent className='pt-6 flex flex-col md:flex-row gap-3'>
                      <div className='flex flex-col gap-6 w-full md:w-[35%]'>
                        <div className='w-full bg-[#F5F5F5] dark:bg-[#1F1F1F] rounded-lg p-6 flex flex-col items-center justify-center'>
                          <h2 className='text-2xl font-bold text-[#4FCA6A]'>4.5/5</h2>
                          <StarRatingGreen rating={4.5} />
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
                  </Card> */}
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Right side with related products remains the same */}
        <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full'>
          <div className='hidden md:flex items-center justify-between mb-6 sticky top-0 bg-[#FCFCFC] z-10 pb-4'>
            <Link href={`/storefront/${storeId}`}>
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
              <CartButton onClick={toggleCart} />
            </div>
          </div>

          <h3 className='font-semibold mb-4'>Related Products</h3>
          {isLoadingRelated ? (
            <div className='flex items-center justify-center py-20'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#4FCA6A] mx-auto mb-2'></div>
                <p className='text-sm text-gray-600'>Loading related products...</p>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <Link href={`/storefront/${storeId}/product/${prod.id}`} key={prod.id}>
                    <div className='flex flex-col rounded-2xl border border-[#F5F5F5] dark:border-[#1F1F1F] hover:border-[#4FCA6A] transition-colors cursor-pointer'>
                      <Image src={prod.product_images[0] || Banner} alt={prod.product_name} width={300} height={200} className='object-cover w-full h-45 rounded-t-2xl' />
                      <p className='text-xs mt-2 px-2 line-clamp-2'>{prod.product_name}</p>
                      <div className='flex items-center justify-between mt-2 px-2 pb-3'>
                        <span className='text-sm font-semibold'>₦{prod.product_price.toLocaleString()}</span>
                        <Button 
                          className='text-xs' 
                          onClick={(e) => handleRelatedProductAddToCart(e, prod)}
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
          )}
        </div>
      </div>
    </div>
  )
}

export default Page