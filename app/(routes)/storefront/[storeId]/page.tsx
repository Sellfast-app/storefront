// app/storefront/[storeId]/page.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
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
import { useCart } from '@/context/CartContext'
import CartButton from '@/components/CartButton'
import CartView from '@/components/CartView'

interface StoreDetails {
    id: string;
    vendor_id: string;
    store_name: string;
    business_type: string;
    store_description: string;
    store_url: string;
    qr_url: string | null;
    bot_url: string | null;
    logo: string | null;
    banner: string | null;
    cac: string | null;
    tin: string | null;
    doctype: string | null;
    cert_media: string | null;
    metadata: {
      brand_color: {
        accent: string;
        primary: string;
        secondary: string;
      };
    };
    updated_at: string;
    subaccount_code: string | null;
}

interface StoreReview {
    id: string;
    user_name: string;
    rating: number;
    comment: string;
    created_at: string;
}

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

// Helper functions
const getUserInitials = (userName: string): string => {
    return userName.split(' ').map(n => n[0]).join('').toUpperCase();
}

const getRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function Page() {
    const params = useParams()
    const storeId = params.storeId as string

    const [searchQuery, setSearchQuery] = useState('')
    const [showCart, setShowCart] = useState(false)
    const [storeDetails, setStoreDetails] = useState<StoreDetails | null>(null)
    const [storeReviews, setStoreReviews] = useState<StoreReview[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isLoadingProducts, setIsLoadingProducts] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const { addToCart } = useCart()

    // Fetch store details
    useEffect(() => {
        const fetchStoreData = async () => {
            if (!storeId) return

            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/stores/${storeId}`)
                
                if (!response.ok) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || 'Failed to fetch store details')
                }

                const result = await response.json()
                
                if (result.status === 'success' && result.data) {
                    setStoreDetails(result.data.storeDetails)
                    setStoreReviews(result.data.reviews.reviews || [])
                } else {
                    throw new Error(result.message || 'Failed to load store details')
                }
                
            } catch (err) {
                console.error('Error fetching store:', err)
                setError(err instanceof Error ? err.message : 'Store not found or unavailable')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStoreData()
    }, [storeId])

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!storeId) return

            setIsLoadingProducts(true)

            try {
                const queryParams = new URLSearchParams({
                    page: '1',
                    pageSize: '50',
                    status: 'ready',
                    sort: 'created_at',
                    dir: 'desc',
                })

                const response = await fetch(`/api/stores/${storeId}/products?${queryParams.toString()}`)
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }

                const result = await response.json()
                
                if (result.status === 'success' && result.data) {
                    setProducts(result.data.items || [])
                }
                
            } catch (err) {
                console.error('Error fetching products:', err)
            } finally {
                setIsLoadingProducts(false)
            }
        }

        fetchProducts()
    }, [storeId])

    // Filter products based on search query
    const filteredProducts = products.filter(product =>
        product.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const isSearchingOnMobile = searchQuery.trim() !== ''

    const handleAddToCart = (e: React.MouseEvent, product: Product) => {
        e.preventDefault()
        e.stopPropagation()
        // Convert API product to cart format
        const cartProduct = {
            id: product.id,
            name: product.product_name,
            price: product.product_price,
            image: product.product_images[0] || Banner,
            description: product.product_description,
        }
        addToCart(cartProduct, 1)
    }

    const toggleCart = () => {
        setShowCart(!showCart)
    }

    // Calculate average rating from reviews
    const averageRating = storeReviews.length > 0
        ? storeReviews.reduce((sum, review) => sum + review.rating, 0) / storeReviews.length
        : 0

    // Loading state
    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-screen bg-[#FCFCFC]'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#4FCA6A] mx-auto mb-4'></div>
                    <p className='text-gray-600'>Loading store...</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error || !storeDetails) {
        return (
            <div className='flex items-center justify-center h-screen bg-[#FCFCFC]'>
                <div className='text-center'>
                    <h2 className='text-2xl font-bold mb-4 text-red-600'>Store Not Found</h2>
                    <p className='text-gray-600 mb-6'>{error || 'The store you are looking for does not exist.'}</p>
                    <Link href="/">
                        <Button>Go Home</Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className='flex flex-col bg-[#FCFCFC]'>
            {/* Mobile Search Header */}
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
                                {storeDetails.banner ? (
                                    <Image src={storeDetails.banner} alt='' width={800} height={400} className='w-full object-cover rounded-xl h-50 md:h-90' />
                                ) : (
                                    <Image src={Banner} alt='' className='w-full object-cover rounded-xl h-50 md:h-90' />
                                )}
                                <div className='absolute bottom-[-30px] md:bottom-[-60px] left-1/2 -translate-x-1/2'>
                                    {storeDetails.logo ? (
                                        <Image src={storeDetails.logo} alt='' width={160} height={160} className='rounded-full w-20 h-20 md:w-40 md:h-40 border-6 border-white object-cover' />
                                    ) : (
                                        <Image src={Profile} alt='' className='rounded-full w-20 h-20 md:w-40 md:h-40 border-6 border-white' />
                                    )}
                                </div>
                            </div>
                            <div className='mt-16'>
                                <h3 className='text-center mt-6 text-lg font-semibold'>{storeDetails.store_name}</h3>
                                <h3 className='text-center mt-2 text-[#A0A0A0] text-sm'>{storeDetails.store_description}</h3>
                                <div className='flex items-center justify-center gap-4 mt-4'>
                                    <div className='flex flex-col items-center'>
                                        <h3 className='text-sm font-semibold'>{products.length}</h3>
                                        <span className='text-xs text-[#A0A0A0]'>Listings</span>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <h3 className='text-sm font-semibold'>{averageRating.toFixed(1)}</h3>
                                        <span className='text-xs text-[#A0A0A0]'>Ratings</span>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <h3 className='text-sm font-semibold'>{storeDetails.business_type}</h3>
                                        <span className='text-xs text-[#A0A0A0]'>Category</span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-row md:flex-col justify-center md:justify-normal mt-6 gap-4'>
                                <div className='flex items-center gap-3'><FacebookIcon /> <span className='rounded-full bg-[#F5F5F5] text-sm p-2 hidden md:block'>www.facebook.com</span></div>
                                <div className='flex items-center gap-3'><WhatsappIcon /> <span className='rounded-full bg-[#F5F5F5] text-sm p-2 hidden md:block'>wa.me/chat.whatsapp.com</span></div>
                                <div className='flex items-center gap-3'><InstagramIcon /> <span className='rounded-full bg-[#F5F5F5] text-sm p-2 hidden md:block'>www.instagram.com</span></div>
                            </div>

                            {/* Reviews Section - Visible on desktop */}
                            <div className='hidden md:block'>
                                <div className='mt-6 flex justify-between items-center'>
                                    <span>Reviews({storeReviews.length})</span>
                                    <span className='text-[#4FCA6A] cursor-pointer'>See All</span>
                                </div>
                                <div className='space-y-4'>
                                    {storeReviews.length > 0 ? (
                                        storeReviews.slice(0, 3).map((review) => (
                                            <Card key={review.id} className='shadow-none border-[#F5F5F5] dark:border-background mt-6'>
                                                <CardContent>
                                                    <div className='flex items-center justify-between'>
                                                        <div className='flex items-center gap-2'>
                                                            <Avatar>{getUserInitials(review.user_name)}</Avatar>
                                                            <div className='flex flex-col'>
                                                                <span>{review.user_name}</span>
                                                                <StarRating rating={review.rating} />
                                                            </div>
                                                        </div>
                                                        <span className='text-xs text-[#A0A0A0]'>{getRelativeTime(review.created_at)}</span>
                                                    </div>
                                                    <p className='text-sm line-clamp-2 mt-3'>{review.comment}</p>
                                                </CardContent>
                                            </Card>
                                        ))
                                    ) : (
                                        <p className='text-center text-sm text-[#A0A0A0] mt-6'>No reviews yet</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Side - Products Section */}
                <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full'>
                    {/* Desktop Search Header */}
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
                    {isLoadingProducts ? (
                        <div className='flex items-center justify-center py-20'>
                            <div className='text-center'>
                                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#4FCA6A] mx-auto mb-2'></div>
                                <p className='text-sm text-gray-600'>Loading products...</p>
                            </div>
                        </div>
                    ) : (
                        <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <Link href={`/storefront/${storeId}/product/${product.id}`} key={product.id}>
                                        <div className='flex flex-col rounded-2xl border border-[#F5F5F5] dark:border-[#1F1F1F] hover:border-[#4FCA6A] transition-colors cursor-pointer'>
                                            <Image 
                                                src={product.product_images[0] || Banner} 
                                                alt={product.product_name} 
                                                width={300} 
                                                height={200} 
                                                className='object-cover w-full h-45 rounded-t-2xl' 
                                            />
                                            <p className='text-xs mt-2 px-2 line-clamp-2'>{product.product_name}</p>
                                            <div className='flex items-center justify-between mt-2 px-2 pb-3'>
                                                <span className='text-sm font-semibold'>₦{product.product_price.toLocaleString()}</span>
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
                                    <p className='text-gray-500'>
                                        {searchQuery 
                                            ? `No products found matching "${searchQuery}"` 
                                            : 'No products available'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Reviews Section - Only visible on mobile */}
            <div className={`md:hidden p-6 ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
                <div className='flex justify-between items-center'>
                    <span>Reviews({storeReviews.length})</span>
                    <span className='text-[#4FCA6A] cursor-pointer'>See All</span>
                </div>
                <div className='space-y-4'>
                    {storeReviews.length > 0 ? (
                        storeReviews.map((review) => (
                            <Card key={review.id} className='shadow-none border-[#F5F5F5] dark:border-background mt-6'>
                                <CardContent>
                                    <div className='flex items-center justify-between'>
                                        <div className='flex items-center gap-2'>
                                            <Avatar>{getUserInitials(review.user_name)}</Avatar>
                                            <div className='flex flex-col'>
                                                <span>{review.user_name}</span>
                                                <StarRating rating={review.rating} />
                                            </div>
                                        </div>
                                        <span className='text-xs text-[#A0A0A0]'>{getRelativeTime(review.created_at)}</span>
                                    </div>
                                    <p className='text-sm line-clamp-2 mt-3'>{review.comment}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className='text-center text-sm text-[#A0A0A0] mt-6'>No reviews yet</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Page