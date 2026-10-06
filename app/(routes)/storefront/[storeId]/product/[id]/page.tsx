"use client";

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Banner from '@/public/Banner.png'
import Image from 'next/image'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CreditCard, MessageCircle, PlusIcon, ShoppingBag, Store, Truck } from 'lucide-react';
import MinusIcon from '@/components/svgIcons/MinusIcon';
import { useCart } from '@/context/CartContext'
import CartButton from '@/components/CartButton'
import CartView from '@/components/CartView'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, X } from 'lucide-react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

interface ProductVariant {
  size: string;
  quantity: number;
  color: string;
  price?: string;
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

function Page() {
  const params = useParams()
  const storeId = params.storeId as string
  const productId = params.id as string

  const { addToCart, cart } = useCart()

  const [searchQuery, setSearchQuery] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
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

  // Variant state
  const [parsedVariants, setParsedVariants] = useState<ProductVariant[]>([]);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);

  // Store logo (fetched from store details)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [storeName, setStoreName] = useState<string>('')

  // Fetch store details for header
  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const res = await fetch(`/api/stores/${storeId}`)
        if (!res.ok) return
        const result = await res.json()
        if (result.status === 'success' && result.data?.storeDetails) {
          const details = result.data.storeDetails
          setStoreName(details.store_name || '')
          if (details.logo) {
            const logo = details.logo.startsWith('http')
              ? details.logo
              : `${process.env.NEXT_PUBLIC_API_BASE_URL}${details.logo}`
            setLogoUrl(logo)
          }
        }
      } catch {
        // silent
      }
    }
    fetchStoreDetails()
  }, [storeId])

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!storeId || !productId) return
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/stores/${storeId}/products/${productId}`)
        if (!response.ok) throw new Error('Failed to fetch product')
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
        const queryParams = new URLSearchParams({ page: '1', pageSize: '6', status: 'ready' })
        const response = await fetch(`/api/stores/${storeId}/products?${queryParams.toString()}`)
        if (!response.ok) throw new Error('Failed to fetch related products')
        const result = await response.json()
        if (result.status === 'success' && result.data) {
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

  // Parse variants
  useEffect(() => {
    if (product && product.variants) {
      try {
        const variants = typeof product.variants === 'string'
          ? JSON.parse(product.variants)
          : product.variants;
        if (Array.isArray(variants) && variants.length > 0) {
          setParsedVariants(variants);
          const firstSize = variants[0].size;
          setSelectedSize(firstSize);
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
  const uniqueSizes = Array.from(new Map(parsedVariants.map(v => [v.size, v])).keys());
  const colorsForSelectedSize: ProductVariant[] = selectedSize
    ? parsedVariants.filter(v => v.size === selectedSize)
    : [];

  const isSizeAvailable = (size: string) =>
    parsedVariants.filter(v => v.size === size).some(v => v.quantity > 0);

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    const firstAvailable = parsedVariants.find(v => v.size === size && v.quantity > 0)
      || parsedVariants.find(v => v.size === size);
    setSelectedVariant(firstAvailable || null);
  };

  const handleColorSelect = (variant: ProductVariant) => {
    if (variant.quantity === 0) return;
    setSelectedVariant(variant);
  };

  // ─── Cart Logic ──────────────────────────────────────────────────────────────

  const getVariantCartId = (productId: string, variant: ProductVariant | null) => {
    if (!variant) return productId;
    return `${productId}-${variant.size}-${variant.color}`;
  };

  const getCurrentQuantity = () => {
    if (!product) return 0;
    const cartId = getVariantCartId(product.id, hasVariants ? selectedVariant : null);
    const cartItem = cart.find(item => item.id === cartId);
    return cartItem ? cartItem.quantity : 0;
  };

  const currentQuantity = getCurrentQuantity()
  const activePrice = product
    ? (hasVariants && selectedVariant?.price
      ? parseInt(selectedVariant.price)
      : product.product_price)
    : 0;
  const totalPrice = activePrice * currentQuantity;

  const incrementQuantity = () => {
    if (product) {
      const priceToUse = hasVariants && selectedVariant?.price
        ? parseInt(selectedVariant.price)
        : product.product_price;
      const cartId = getVariantCartId(product.id, hasVariants ? selectedVariant : null);
      addToCart({
        id: cartId,
        originalProductId: product.id,
        product_id: product.id,
        name: product.product_name,
        price: priceToUse,
        image: product.product_images[0] || Banner,
        description: product.product_description,
        ...(hasVariants && selectedVariant && {
          variant: { size: selectedVariant.size, color: selectedVariant.color, price: parseInt(selectedVariant.price || '0') }
        })
      }, 1);
    }
  };

  const decrementQuantity = () => {
    if (product && currentQuantity > 0) {
      const priceToUse = hasVariants && selectedVariant?.price
        ? parseInt(selectedVariant.price)
        : product.product_price;
      const cartId = getVariantCartId(product.id, hasVariants ? selectedVariant : null);
      addToCart({
        id: cartId,
        originalProductId: product.id,
        product_id: product.id,
        name: product.product_name,
        price: priceToUse,
        image: product.product_images[0] || Banner,
        description: product.product_description,
        ...(hasVariants && selectedVariant && {
          variant: { size: selectedVariant.size, color: selectedVariant.color, price: parseInt(selectedVariant.price || '0') }
        })
      }, -1);
    }
  };

  const isAddToCartDisabled = hasVariants
    ? (!selectedVariant || selectedVariant.quantity === 0)
    : currentQuantity > 0;

  const handleAddToCart = (e?: React.MouseEvent) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!product) return;
    if (hasVariants && !selectedVariant) return;
    if (hasVariants && selectedVariant && selectedVariant.quantity === 0) return;
    const priceToUse = hasVariants && selectedVariant?.price
      ? parseInt(selectedVariant.price)
      : product.product_price;
    const cartId = getVariantCartId(product.id, hasVariants ? selectedVariant : null);
    addToCart({
      id: cartId,
      originalProductId: product.id,
      product_id: product.id,
      name: product.product_name,
      price: priceToUse,
      image: product.product_images[0] || Banner,
      description: product.product_description,
      ...(hasVariants && selectedVariant && {
        variant: { size: selectedVariant.size, color: selectedVariant.color, price: parseInt(selectedVariant.price || '0') }
      })
    }, 1);
  };

  const handleRelatedProductAddToCart = (e: React.MouseEvent, prod: Product) => {
    e.preventDefault();
    e.stopPropagation();
    let prodHasVariants = false;
    try {
      const variants = typeof prod.variants === 'string' ? JSON.parse(prod.variants) : prod.variants;
      prodHasVariants = Array.isArray(variants) && variants.length > 0;
    } catch {
      prodHasVariants = false;
    }
    if (prodHasVariants) {
      window.location.href = `/storefront/${storeId}/product/${prod.id}`;
      return;
    }
    addToCart({
      id: prod.id,
      name: prod.product_name,
      price: prod.product_price,
      image: prod.product_images[0] || Banner,
      description: prod.product_description,
    }, 1);
  };

  const toggleCart = () => {
    setShowCart(!showCart);
    if (!showCart && window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredRelated = relatedProducts.filter(p =>
    p.product_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // ─── Loading / Error ─────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        {/* Skeleton Header */}
        <div className="sticky top-0 z-20 border-b border-[#F1F1F1] bg-white px-4 py-3">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <Skeleton className="h-10 w-32 rounded-full" />
            <Skeleton className="h-10 w-64 rounded-full hidden md:block" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))}
              </div>
            </div>
            <div className="space-y-5">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-10 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <ShoppingBag className="h-8 w-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold mb-2">Product Not Found</h2>
          <p className="text-[#6B7280] mb-6 text-sm">{error || 'The product you are looking for does not exist.'}</p>
          <Link href={`/storefront/${storeId}`}>
            <Button className="rounded-full bg-[#005B14] hover:bg-[#004610]">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Store
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-[#111827]">
      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-[#F1F1F1] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 lg:px-8">
          <Link href={`/storefront/${storeId}`} className="flex items-center gap-3">
            {logoUrl ? (
              <Image src={logoUrl} alt={storeName} width={36} height={36} className="h-9 w-9 rounded-full object-cover ring-2 ring-[#E8F5E9]" />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#005B14] text-white">
                <Store className="h-4 w-4" />
              </div>
            )}
            {storeName && <span className="hidden text-sm font-semibold sm:block">{storeName}</span>}
          </Link>

          {/* Desktop search */}
          <div className="hidden flex-1 justify-center px-6 md:flex">
            <div className="relative w-full max-w-lg">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-10 pr-4 text-sm"
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white md:hidden"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
            >
              {showMobileSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
            </button>
            <CartButton onClick={toggleCart} />
          </div>
        </div>

        {/* Mobile search */}
        {showMobileSearch && (
          <div className="border-t border-[#F1F1F1] px-4 py-3 md:hidden">
            <div className="relative">
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="h-10 rounded-full border-[#E5E7EB] bg-[#F6F7F6] pl-10 pr-4 text-sm"
              />
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
            </div>
          </div>
        )}
      </header>

      {showCart ? (
        <div className="mx-auto max-w-2xl px-4 py-8">
          <CartView />
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs text-[#9CA3AF]">
            <Link href={`/storefront/${storeId}`} className="hover:text-[#005B14] transition-colors">
              Store
            </Link>
            <span>/</span>
            <span className="text-[#374151] font-medium line-clamp-1">{product.product_name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* ── Left: Images ── */}
            <div>
              {isMounted && (
                <div>
                  <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    spaceBetween={10}
                    navigation={true}
                    pagination={{ clickable: true }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                    className="w-full rounded-2xl overflow-hidden mb-3"
                  >
                    {product.product_images.map((image, index) => (
                      <SwiperSlide key={index}>
                        <div className="relative w-full aspect-square bg-[#F9FAFB]">
                          <Image
                            src={image || Banner}
                            alt={`${product.product_name} - ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  {product.product_images.length > 1 && (
                    <Swiper
                      modules={[Thumbs]}
                      watchSlidesProgress
                      onSwiper={setThumbsSwiper}
                      spaceBetween={8}
                      slidesPerView={4}
                      className="w-full"
                    >
                      {product.product_images.map((image, index) => (
                        <SwiperSlide key={index}>
                          <div className={`relative aspect-square cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                            activeImageIndex === index ? 'border-[#005B14]' : 'border-transparent'
                          }`}>
                            <Image
                              src={image || Banner}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { icon: Truck, label: 'Localized delivery', text: 'Pickup or automated logistics.' },
                  { icon: CreditCard, label: 'Secure payment', text: 'Paystack & crypto checkout.' },
                  { icon: MessageCircle, label: 'Chat ordering', text: 'Continue via WhatsApp.' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-[#F1F1F1] bg-[#FAFAFA] p-3 text-center">
                    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#005B14]/10">
                      <item.icon className="h-4 w-4 text-[#005B14]" />
                    </div>
                    <p className="text-xs font-semibold text-[#111827]">{item.label}</p>
                    <p className="mt-0.5 text-[10px] leading-4 text-[#9CA3AF]">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Product Info ── */}
            <div className="flex flex-col">
              {/* Category / SKU */}
              <div className="flex items-center gap-2 mb-3">
                {product.product_type && (
                  <span className="rounded-full bg-[#005B14]/10 px-3 py-1 text-xs font-medium text-[#005B14]">
                    {product.product_type}
                  </span>
                )}
                <span className="text-xs text-[#9CA3AF]">SKU: {product.product_sku}</span>
              </div>

              <h1 className="text-2xl font-bold leading-snug md:text-3xl">{product.product_name}</h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#111827]">
                  ₦{(
                    hasVariants && selectedVariant?.price
                      ? parseInt(selectedVariant.price)
                      : product.product_price
                  ).toLocaleString()}
                </span>
                {hasVariants && selectedVariant?.price &&
                  parseInt(selectedVariant.price) !== product.product_price && (
                    <span className="text-sm text-[#9CA3AF] line-through">
                      ₦{product.product_price.toLocaleString()}
                    </span>
                  )}
              </div>

              {/* Est. delivery */}
              <p className="mt-2 text-xs text-[#9CA3AF]">
                Est. {product.est_prod_days_from}–{product.est_prod_days_to} days delivery
              </p>

              {/* Description */}
              <p className="mt-4 text-sm leading-relaxed text-[#6B7280]">
                {product.product_description}
              </p>

              {/* ── Variant Selector ── */}
              {hasVariants && (
                <div className="mt-6 space-y-5">
                  {/* Size */}
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#374151]">
                      Size
                      {selectedSize && <span className="ml-2 font-bold text-[#005B14]">{selectedSize}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {uniqueSizes.map((size) => {
                        const available = isSizeAvailable(size);
                        const isSelected = selectedSize === size;
                        return (
                          <button
                            key={size}
                            onClick={() => available && handleSizeSelect(size)}
                            disabled={!available}
                            className={`
                              px-4 py-2 rounded-full border text-sm font-medium transition-all
                              ${isSelected
                                ? 'border-[#005B14] bg-[#005B14] text-white'
                                : available
                                  ? 'border-[#E5E7EB] text-[#374151] hover:border-[#005B14]/50'
                                  : 'border-[#F3F4F6] text-[#D1D5DB] cursor-not-allowed line-through'
                              }
                            `}
                          >
                            {size}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color */}
                  {selectedSize && colorsForSelectedSize.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#374151]">
                        Color
                        {selectedVariant && (
                          <span className="ml-2 font-bold capitalize text-[#005B14]">
                            {selectedVariant.color}
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {colorsForSelectedSize.map((variant, index) => {
                          const isSelected = selectedVariant === variant;
                          const outOfStock = variant.quantity === 0;
                          return (
                            <button
                              key={index}
                              onClick={() => handleColorSelect(variant)}
                              disabled={outOfStock}
                              title={outOfStock ? `${variant.color} (Out of stock)` : variant.color}
                              className={`
                                relative w-9 h-9 rounded-full transition-all
                                ${isSelected ? 'ring-2 ring-[#005B14] ring-offset-2' : 'ring-1 ring-[#E5E7EB] hover:ring-[#005B14]/50'}
                                ${outOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                              `}
                              style={{ backgroundColor: variant.color }}
                            >
                              {outOfStock && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <span className="w-full h-px bg-gray-400 rotate-45 block" />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {selectedVariant && selectedVariant.quantity === 0 && (
                        <p className="mt-2 text-xs text-red-500">⚠️ This color is out of stock. Please choose another.</p>
                      )}
                      {selectedVariant && selectedVariant.quantity > 0 && (
                        <p className="mt-2 text-xs text-[#9CA3AF]">{selectedVariant.quantity} in stock</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── Quantity + Add to Cart ── */}
              <div className="mt-8 space-y-3">
                {/* Quantity stepper */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center rounded-full border border-[#E5E7EB] bg-[#F9FAFB]">
                    <button
                      onClick={decrementQuantity}
                      disabled={currentQuantity === 0}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#374151] hover:bg-[#F3F4F6] disabled:opacity-40"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-semibold">{currentQuantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="flex h-10 w-10 items-center justify-center rounded-full text-[#374151] hover:bg-[#F3F4F6]"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>
                  {currentQuantity > 0 && (
                    <span className="text-sm text-[#6B7280]">
                      Total: <span className="font-bold text-[#111827]">₦{totalPrice.toLocaleString()}</span>
                    </span>
                  )}
                </div>

                {/* Add to Cart button */}
                <Button
                  onClick={() => handleAddToCart()}
                  disabled={isAddToCartDisabled}
                  className="h-12 w-full rounded-full bg-[#005B14] text-sm font-semibold hover:bg-[#004610] disabled:opacity-50"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {hasVariants
                    ? (currentQuantity > 0 ? 'Add Another' : 'Add Selection to Cart')
                    : currentQuantity > 0
                      ? 'Already in Cart'
                      : 'Add to Cart'
                  }
                </Button>

                {currentQuantity > 0 && (
                  <p className="text-center text-xs text-[#005B14]">
                    ✓ {currentQuantity} item{currentQuantity > 1 ? 's' : ''} in cart
                    {hasVariants && selectedVariant && (
                      <span className="capitalize"> · {selectedVariant.size} · {selectedVariant.color}</span>
                    )}
                  </p>
                )}
              </div>

              {/* Product meta */}
              <div className="mt-6 rounded-2xl border border-[#F1F1F1] bg-[#FAFAFA] p-4 text-xs text-[#6B7280] space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-[#374151]">Type</span>
                  <span>{product.product_type || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#374151]">Status</span>
                  <span className="capitalize">{product.product_status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#374151]">Stock</span>
                  <span>{product.product_quantity} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-[#374151]">SKU</span>
                  <span>{product.product_sku}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Related Products ── */}
          <section className="mt-16">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#005B14]">More from this store</p>
                <h2 className="mt-1 text-xl font-bold">Related Products</h2>
              </div>
              <Link href={`/storefront/${storeId}`}>
                <Button variant="outline" size="sm" className="rounded-full border-[#005B14] text-[#005B14] hover:bg-[#005B14] hover:text-white">
                  View All
                </Button>
              </Link>
            </div>

            {isLoadingRelated ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-[#F3F4F6]">
                    <div className="aspect-[3/4] rounded-t-2xl bg-[#E5E7EB]" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 w-3/4 rounded bg-[#E5E7EB]" />
                      <div className="h-3 w-1/2 rounded bg-[#E5E7EB]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {(searchQuery ? filteredRelated : relatedProducts).map((prod) => (
                  <Link href={`/storefront/${storeId}/product/${prod.id}`} key={prod.id} className="group block">
                    <div className="overflow-hidden rounded-2xl border border-[#F1F1F1] bg-white transition-shadow hover:shadow-md">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#F9FAFB]">
                        <Image
                          src={prod.product_images[0] || Banner}
                          alt={prod.product_name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-2 text-sm font-medium leading-snug">{prod.product_name}</p>
                        <p className="mt-1.5 text-base font-bold">₦{prod.product_price.toLocaleString()}</p>
                        <Button
                          size="sm"
                          className="mt-3 h-8 w-full rounded-full bg-[#005B14] text-xs hover:bg-[#004610]"
                          onClick={(e) => handleRelatedProductAddToCart(e, prod)}
                        >
                          {(() => {
                            try {
                              const v = typeof prod.variants === 'string' ? JSON.parse(prod.variants) : prod.variants;
                              return Array.isArray(v) && v.length > 0 ? 'Select Options' : 'Add to Cart';
                            } catch { return 'Add to Cart'; }
                          })()}
                        </Button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer className="mt-16 border-t border-[#F1F1F1] pt-8 pb-4 text-center">
            <p className="text-xs text-[#9CA3AF]">
              Powered by{" "}
              <a href="https://swiftree.app" className="font-medium text-[#005B14] hover:underline">
                Swiftree
              </a>
            </p>
          </footer>
        </div>
      )}
    </div>
  )
}

export default Page
