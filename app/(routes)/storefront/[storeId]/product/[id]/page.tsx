"use client";
import { retailBranchProducts, selectedBranch } from '@/lib/branch-preview';
import { isMockRetailStorefront } from '@/lib/storefront-mock';
import { formatStoreCurrency } from '@/lib/currency';
import { getContrastingTextColor } from '@/lib/storefront-theme';

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Banner from '@/public/Banner.png'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import SearchIcon from '@/components/svgIcons/SearchIcon'
import FilterIcon from '@/components/svgIcons/FilterIcon'
import CartIcon from '@/components/svgIcons/CartIcon'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react';
import MinusIcon from '@/components/svgIcons/MinusIcon';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ratingBreakdown, customerReviews } from '@/lib/mockdata'
import { useCart } from '@/context/CartContext'
import CartButton from '@/components/CartButton'
import VendorBrand from '@/components/VendorBrand'
import CartView from '@/components/CartView'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface ProductVariant {
  name?: string;
  sku?: string;
  size: string;
  quantity: number;
  color: string;
  price?: number;
  original_price?: number;
  discount_amount?: number;
  branch_available?: boolean;
  branch_stock?: number | null;
}

interface Product {
  id: string;
  store_id: string;
  variants: string | ProductVariant[];
  created_at: string;
  updated_at: string;
  product_sku: string;
  product_name: string;
  product_type: string;
  product_price: number;
  original_product_price?: number;
  discount_amount?: number;
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
        <svg key={star} width="16" height="16" viewBox="0 0 24 24"
          fill={star <= fullStars ? 'var(--store-secondary)' : star === fullStars + 1 && hasHalfStar ? 'url(#half-green)' : 'var(--store-accent)'}
          xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="half-green">
              <stop offset="50%" stopColor="var(--store-secondary)" />
              <stop offset="50%" stopColor="var(--store-accent)" />
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
        <svg key={star} width="16" height="16" viewBox="0 0 24 24"
          fill={star <= fullStars ? '#FEA436' : star === fullStars + 1 && hasHalfStar ? 'url(#half-orange)' : '#FFE0BA'}
          xmlns="http://www.w3.org/2000/svg">
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
  const vendorBrand = <VendorBrand storeId={storeId} />

  const { addToCart, cart, updateQuantity } = useCart()

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!storeId) return;
    try {
      const rawColors = sessionStorage.getItem(`storefront_theme_${storeId}`);
      if (!rawColors) return;
      const colors = JSON.parse(rawColors) as { primary?: string; secondary?: string; accent?: string; text?: string };
      document.documentElement.style.setProperty('--store-primary', colors.primary || '#005B14');
      document.documentElement.style.setProperty('--store-secondary', colors.secondary || '#4FCA6A');
      document.documentElement.style.setProperty('--store-accent', colors.accent || '#E8F5E9');
      document.documentElement.style.setProperty('--store-text', colors.text || '#111827');
      document.documentElement.style.setProperty('--store-button-text', getContrastingTextColor(colors.primary || '#005B14'));
    } catch {
      // Keep the storefront default palette if the cached appearance is invalid.
    }
  }, [storeId]);

  // Variant state
  const [parsedVariants, setParsedVariants] = useState<ProductVariant[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // v2 product details are passed from the retail listing. The detail route stays
  // frontend-only and does not request a second product record from the API.
  useEffect(() => {
    if (!storeId || !productId) return
    setIsLoading(true)
    setError(null)
    try {
      if (isMockRetailStorefront(storeId)) {
        const branchProduct = retailBranchProducts(selectedBranch(storeId)).find(item => item.id === productId);
        if (!branchProduct) throw new Error('This product is unavailable at the selected branch.');
        setProduct({ ...branchProduct, store_id: storeId } as Product);
        return;
      }
      const storedProduct = sessionStorage.getItem(`storefront_product_${storeId}_${productId}`)
      if (!storedProduct) throw new Error('Open this product from the storefront to view its details.')
      const parsedProduct = JSON.parse(storedProduct) as Product
      if (parsedProduct.id !== productId) throw new Error('Product not found')
      setProduct(parsedProduct)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Product not found')
    } finally {
      setIsLoading(false)
    }
  }, [storeId, productId])

  // Related products are supplied by the v2 storefront listing session.
  useEffect(() => {
    if (!storeId) return
    try {
      const storedProducts = sessionStorage.getItem(`storefront_products_${storeId}`)
      const products = isMockRetailStorefront(storeId) ? retailBranchProducts(selectedBranch(storeId)) as Product[] : storedProducts ? JSON.parse(storedProducts) as Product[] : []
      setRelatedProducts(products.filter((item) => item.id !== productId).slice(0, 6))
    } catch {
      setRelatedProducts([])
    } finally {
      setIsLoadingRelated(false)
    }
  }, [storeId, productId])

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    return () => {
      if (thumbsSwiper && thumbsSwiper.destroy) {
        thumbsSwiper.destroy(true, true);
      }
    };
  }, [showCart, thumbsSwiper]);

  // Parse variants and auto-select first size
  useEffect(() => {
    if (product && product.variants) {
      try {
        const variants = typeof product.variants === 'string'
          ? JSON.parse(product.variants)
          : product.variants;

        if (Array.isArray(variants) && variants.length > 0) {
          setParsedVariants(variants);
          // Auto-select first unique size
          const firstSize = variants[0].size;
          setSelectedSize(firstSize);
          // Auto-select first color for that size
          const firstVariant = variants.find((v: ProductVariant) => v.size === firstSize);
          setSelectedVariant(firstVariant || null);
        } else {
          setParsedVariants([]);
          setSelectedSize(null);
          setSelectedVariant(null);
        }
      } catch (error) {
        console.error('Error parsing variants:', error);
        setParsedVariants([]);
        setSelectedSize(null);
        setSelectedVariant(null);
      }
    }
  }, [product]);

  // ─── Variant Derived State ───────────────────────────────────────────────────

  const hasVariants = parsedVariants.length > 0;
  const variantStock = (variant: ProductVariant) => Number(variant.branch_stock ?? variant.quantity ?? 0);
  const variantAvailable = (variant: ProductVariant) => variant.branch_available !== false && variantStock(variant) > 0;

  // Get unique sizes (preserving order)
  const getVariantOptionLabel = (variant: ProductVariant) => variant.size || variant.name || "Option";
  const uniqueSizes = Array.from(
    new Set(parsedVariants.map(getVariantOptionLabel))
  );

  // Get all color variants for the selected size
  const colorsForSelectedSize: ProductVariant[] = selectedSize
    ? parsedVariants.filter(v => getVariantOptionLabel(v) === selectedSize)
    : [];

  // Check if a size has any available stock
  const isSizeAvailable = (size: string) =>
    parsedVariants.filter(v => getVariantOptionLabel(v) === size).some(variantAvailable);

  // Handle size selection — resets color to first available for that size
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const firstAvailable = parsedVariants.find(v => getVariantOptionLabel(v) === size && variantAvailable(v))
      || parsedVariants.find(v => getVariantOptionLabel(v) === size);
    setSelectedVariant(firstAvailable || null);
  };

  // Handle color selection
  const handleColorSelect = (variant: ProductVariant) => {
    if (!variantAvailable(variant)) return;
    setSelectedVariant(variant);
  };

  // ─── Cart Logic ──────────────────────────────────────────────────────────────

  const filteredProducts = relatedProducts.filter(p =>
    p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const isSearchingOnMobile = searchQuery.trim() !== ''
  const totalReviews = ratingBreakdown.reduce((sum, item) => sum + item.count, 0)

  const getVariantUnitPrice = (variant: ProductVariant) => {
    const variantPrice = variant.price;
    return variantPrice !== undefined && variantPrice !== null && Number.isFinite(Number(variantPrice))
      ? Number(variantPrice)
      : Number(product?.product_price || 0);
  };

  const getVariantCartId = (productId: string, variant: ProductVariant) =>
    `${productId}::variant::${encodeURIComponent([variant.size || variant.name || "", variant.color || ""].join("|").trim().toLowerCase())}`;

  const selectedCartId = product && selectedVariant
    ? getVariantCartId(product.id, selectedVariant)
    : product?.id;

  const getCurrentQuantity = () => {
    if (!selectedCartId) return 0
    const cartItem = cart.find(item => item.id === selectedCartId)
    return cartItem ? cartItem.quantity : 0
  }

  const currentQuantity = getCurrentQuantity()
  const selectedUnitPrice = selectedVariant ? getVariantUnitPrice(selectedVariant) : Number(product?.product_price || 0);
  const selectedOriginalPrice = selectedVariant?.original_price ?? product?.original_product_price ?? selectedUnitPrice;
  const selectedDiscount = selectedVariant?.discount_amount ?? product?.discount_amount ?? 0;
  const totalPrice = selectedUnitPrice * currentQuantity;

  const incrementQuantity = () => {
    if (product) {
      if (currentQuantity > 0 && selectedCartId) {
        updateQuantity(selectedCartId, currentQuantity + 1)
      } else {
        handleAddToCart()
      }
    }
  }

  const decrementQuantity = () => {
    if (product && selectedCartId && currentQuantity > 0) {
      updateQuantity(selectedCartId, currentQuantity - 1)
    }
  }

  const isAddToCartDisabled =
    currentQuantity > 0 ||
    (hasVariants && (!selectedVariant || !variantAvailable(selectedVariant)));

  const handleAddToCart = (e?: React.MouseEvent, prod?: Product) => {
    if (e) { e.preventDefault(); e.stopPropagation() }
    const productToAdd = prod || product
    if (!productToAdd) return;
    if (hasVariants && !selectedVariant) return;
    if (hasVariants && selectedVariant && !variantAvailable(selectedVariant)) return;
    const cartId = hasVariants && selectedVariant
      ? getVariantCartId(productToAdd.id, selectedVariant)
      : productToAdd.id;

    addToCart({
      id: cartId,
      originalProductId: productToAdd.id,
      product_id: productToAdd.id,
      name: productToAdd.product_name,
      price: hasVariants && selectedVariant ? getVariantUnitPrice(selectedVariant) : Number(productToAdd.product_price || 0),
      image: productToAdd.product_images[0] || Banner,
      description: productToAdd.product_description,
      ...(hasVariants && selectedVariant && {
        variant: { name: selectedVariant.name, size: selectedVariant.size || selectedVariant.name || "", color: selectedVariant.color || "", price: getVariantUnitPrice(selectedVariant) }
      })
    }, 1)
  }

  const handleRelatedProductAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart({
      id: prod.id,
      name: prod.product_name,
      price: prod.product_price,
      image: prod.product_images[0] || Banner,
      description: prod.product_description,
    }, 1)
  }

  const toggleCart = () => {
    setShowCart(!showCart);
    if (!showCart && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ─── Loading / Error ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen bg-[#FCFCFC]'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--store-secondary)] mx-auto mb-4'></div>
          <p className='text-gray-600'>Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-4'>Product Not Found</h2>
          <p className='text-gray-600 mb-6'>{error || 'The product you are looking for does not exist.'}</p>
          <Link href={`/storefront/${storeId}`}><Button>Back to Store</Button></Link>
        </div>
      </div>
    )
  }

  return (
    <div data-storefront-theme className='flex flex-col bg-[#FCFCFC] text-[var(--store-text)]'>
      {/* Mobile Header */}
      <div className={`md:hidden p-4 sticky top-0 bg-white dark:bg-background z-10`}>
        <div className='flex items-center justify-between'>
          {vendorBrand}
          <div className='flex gap-2'>
            <div className="relative flex items-center">
              <Input
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-2 text-xs dark:bg-background rounded-lg border-[#F5F5F5] dark:border-[#1F1F1F]"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <FilterIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <CartButton onClick={toggleCart} />
          </div>
        </div>
      </div>

      <div className='p-6 flex flex-col md:flex-row justify-between gap-4 md:h-screen md:overflow-hidden'>
        {/* Left Column */}
        <div className={`w-full md:w-[45%] md:overflow-y-auto md:h-full md:block ${isSearchingOnMobile ? 'hidden' : 'block'}`}>
          {showCart ? (
            <CartView />
          ) : (
            <>
              {/* Product Images Swiper */}
              {isMounted && (
                <div className='mb-6'>
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    spaceBetween={10}
                    navigation={true}
                    pagination={{ clickable: true, type: product.product_images.length > 1 ? 'bullets' : 'fraction' }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                    className="w-full h-auto mb-4 rounded-lg"
                  >
                    {product.product_images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="relative w-full h-80 md:h-96">
                          <Image src={image || Banner} alt={`${product.product_name} - Image ${index + 1}`}
                            fill className="object-cover rounded-lg" priority={index === 0} />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {product.product_images.length > 1 && (
                    <Swiper modules={[Thumbs]} watchSlidesProgress onSwiper={setThumbsSwiper}
                      spaceBetween={8} slidesPerView={4} freeMode={true} className="w-full thumbs-swiper">
                      {product.product_images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className={`relative w-full h-20 cursor-pointer border-2 rounded-lg transition-all ${activeImageIndex === index ? 'border-[var(--store-secondary)]' : 'border-transparent'}`}>
                            <Image src={image || Banner} alt={`${product.product_name} - Thumbnail ${index + 1}`}
                              fill className="object-cover rounded-lg" />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              )}

              {/* Product Info */}
              <div className='mt-6'>
                <span className='text-lg font-medium'>{product.product_name}</span>

                <div className='flex items-center justify-between mt-2'>
                  <div>
                    <h3 className='font-semibold text-xl'>{formatStoreCurrency(selectedUnitPrice)}</h3>
                    {selectedDiscount > 0 && <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><span className="line-through">{formatStoreCurrency(selectedOriginalPrice)}</span><span>-{formatStoreCurrency(selectedDiscount)}</span></p>}
                  </div>
                  <div className='flex items-center h-full justify-between text-xs border rounded-xl p-1 bg-[#E0E0E0]'>
                    <button type='button' aria-label='Increase quantity' onClick={incrementQuantity} className='p-1 hover:bg-gray-200 rounded'>
                      <PlusIcon className='w-4 h-4' />
                    </button>
                    <span className='px-4 bg-card h-full flex items-center'>{currentQuantity}</span>
                    <button type='button' aria-label='Decrease quantity' onClick={decrementQuantity} className='p-1 hover:bg-gray-200 rounded' disabled={currentQuantity === 0}>
                      <MinusIcon className='w-4 h-4' />
                    </button>
                  </div>
                </div>

                {/* ── VARIANT SELECTOR ─────────────────────────────────── */}
                {hasVariants && (
                  <div className='mt-6 space-y-5'>

                    {/* Step 1 — Size */}
                    <div>
                      <p className='text-xs text-gray-500 mb-2'>
                        Option
                        {selectedSize && <span className='ml-2 font-semibold text-foreground'>{selectedSize}</span>}
                      </p>
                      <div className='flex flex-wrap gap-2'>
                        {uniqueSizes.map((size) => {
                          const available = isSizeAvailable(size);
                          const isSelected = selectedSize === size;
                          const sizePrices = [...new Set(parsedVariants.filter(variant => getVariantOptionLabel(variant) === size).map(getVariantUnitPrice))].sort((a, b) => a - b);
                          return (
                            <button
                              key={size}
                              type="button"
                              onClick={() => available && handleSizeSelect(size)}
                              disabled={!available}
                              className={`
                                px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all
                                ${isSelected
                                  ? 'border-[var(--store-secondary)] bg-[var(--store-secondary)]/10 text-[var(--store-secondary)]'
                                  : available
                                    ? 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                    : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through'
                                }
                              `}
                            >
                              <span className="block">{size}</span>
                              <span className="mt-1 block text-[11px] font-normal normal-case">
                                {sizePrices.length > 1
                                  ? `${formatStoreCurrency(sizePrices[0])} - ${formatStoreCurrency(sizePrices[sizePrices.length - 1])}`
                                  : formatStoreCurrency(sizePrices[0] ?? Number(product.product_price || 0))}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2 — Color (only shows when a size is selected) */}
                    {selectedSize && colorsForSelectedSize.length > 0 && (
                      <div>
                        <p className='text-xs text-gray-500 mb-2'>
                          Color
                          {selectedVariant && (
                            <span className='ml-2 font-semibold text-foreground capitalize'>
                              {selectedVariant.color}
                            </span>
                          )}
                        </p>
                        <div className='flex flex-wrap gap-3'>
                          {colorsForSelectedSize.map((variant, index) => {
                            const isSelected = selectedVariant === variant;
                            const outOfStock = !variantAvailable(variant);
                            return (
                              <div key={`${variant.sku || variant.name || variant.size}-${index}`} className="flex min-w-12 flex-col items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleColorSelect(variant)}
                                disabled={outOfStock}
                                title={`${variant.color || variant.name || "Option"} · ${formatStoreCurrency(getVariantUnitPrice(variant))}${outOfStock ? " · Out of stock" : ""}`}
                                className={`
                                  relative min-h-9 min-w-9 rounded-md transition-all
                                  ${isSelected
                                    ? 'border-2 border-[var(--store-secondary)] bg-[var(--store-secondary)]/10'
                                    : 'border border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                  }
                                  ${outOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                                  ${variant.color ? 'h-9 w-9 rounded-full' : 'px-3 py-2 text-xs'}
                                `}
                                style={variant.color ? { backgroundColor: variant.color } : undefined}
                              >
                                {!variant.color && (variant.name || variant.sku || variant.size || "Option")}
                                {/* Out of stock slash */}
                                {outOfStock && (
                                  <span className='absolute inset-0 flex items-center justify-center'>
                                    <span className='w-full h-px bg-gray-400 rotate-45 block' />
                                  </span>
                                )}
                              </button>
                              <span className="text-[11px] text-muted-foreground">{formatStoreCurrency(getVariantUnitPrice(variant))}</span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Out of stock warning for selected variant */}
                        {selectedVariant && !variantAvailable(selectedVariant) && (
                          <div className='mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
                            <p className='text-xs text-red-600 dark:text-red-400'>
                              ⚠️ This color is out of stock. Please choose another.
                            </p>
                          </div>
                        )}

                        {/* Stock count */}
                        {selectedVariant && variantAvailable(selectedVariant) && (
                          <p className='text-xs text-gray-500 mt-2'>
                            {variantStock(selectedVariant)} in stock
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {/* ── END VARIANT SELECTOR ─────────────────────────────── */}

                <div className='flex justify-between items-center mt-6'>
                  <div className='text-xs text-[var(--store-secondary)]'>SKU: {product.product_sku}</div>
                  <div className='text-xs'>Est. {product.est_prod_days_from}-{product.est_prod_days_to} days</div>
                </div>

                <div className='mt-4'>
                  <Card className='mt-4 shadow-none border border-[#F5F5F5] dark:border-[#1F1F1F]'>
                    <CardContent className='flex flex-col gap-4 pt-6'>
                      <div className='flex justify-between'>
                        <div>
                          <span className='text-xs text-gray-500'>Total Price:</span>
                          <h3 className='text-xl font-bold'>{formatStoreCurrency(totalPrice)}</h3>
                        </div>
                        <Button onClick={() => handleAddToCart()} disabled={isAddToCartDisabled}>
                          <CartIcon />
                          {currentQuantity > 0
                            ? 'In Cart'
                            : hasVariants && (!selectedVariant || selectedVariant.quantity === 0)
                              ? 'Unavailable'
                              : 'Add to Cart'
                          }
                        </Button>
                      </div>
                      {currentQuantity > 0 && (
                        <div className='text-xs text-green-600 text-center'>
                          ✓ {currentQuantity} item{currentQuantity > 1 ? 's' : ''} in cart
                          {hasVariants && selectedVariant && (
                            <span className='capitalize'> • {selectedVariant.size} • {selectedVariant.color}</span>
                          )}
                          {' '}• Use +/- to adjust quantity
                        </div>
                      )}
                    </CardContent>
                  </Card>

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
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right Column — Related Products */}
        <div className='w-full md:w-[55%] md:overflow-y-auto md:h-full'>
          <div className='hidden md:flex items-center justify-between mb-6 sticky top-0 bg-[#FCFCFC] z-10 pb-4'>
            {vendorBrand}
            <div className='flex gap-2'>
              <div className="relative flex items-center">
                <Input
                  placeholder='Search...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 md:w-84 pl-8 pr-8 py-2 text-xs sm:text-sm dark:bg-background rounded-lg border-[#F5F5F5] dark:border-[#1F1F1F]"
                />
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
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--store-secondary)] mx-auto mb-2'></div>
                <p className='text-sm text-gray-600'>Loading related products...</p>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <Link
                    href={`/storefront/${storeId}/product/${prod.id}`}
                    key={prod.id}
                    onClick={() => sessionStorage.setItem(`storefront_product_${storeId}_${prod.id}`, JSON.stringify(prod))}
                  >
                    <div className='flex flex-col rounded-2xl border border-[#F5F5F5] dark:border-[#1F1F1F] hover:border-[var(--store-secondary)] transition-colors cursor-pointer'>
                      <Image src={prod.product_images[0] || Banner} alt={prod.product_name}
                        width={300} height={200} className='object-cover w-full h-45 rounded-t-2xl' />
                      <p className='text-xs mt-2 px-2 line-clamp-2'>{prod.product_name}</p>
                      <div className='flex items-center justify-between mt-2 px-2 pb-3'>
                        <span className='text-sm font-semibold'>{formatStoreCurrency(prod.product_price)}</span>
                        <Button className='text-xs' onClick={(e) => handleRelatedProductAddToCart(e, prod)}>
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
