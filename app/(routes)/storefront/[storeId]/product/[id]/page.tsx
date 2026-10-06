"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductVariant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface Product {
  id: string;
  store_id: string;
  product_name: string;
  product_sku: string;
  product_type: string;
  product_price: number;
  description?: string;
  product_images?: string[];
  variants?: string;
  created_at: string;
  updated_at: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params.storeId as string;
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const res = await fetch(`/api/stores/${storeId}/products/${productId}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setProduct(data.data ?? data);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Could not load product. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    if (storeId && productId) {
      fetchProduct();
    }
  }, [storeId, productId]);

  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));
  const handleIncrement = () => setQuantity((q) => q + 1);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(price);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{error ?? "Product not found."}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const images: string[] =
    product.product_images && product.product_images.length > 0
      ? product.product_images
      : ["/placeholder-product.png"];

  let variants: ProductVariant[] = [];
  try {
    if (product.variants) {
      variants = JSON.parse(product.variants);
    }
  } catch {
    variants = [];
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-[#1A1A1A] border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-[#F5F5F5] dark:bg-[#2A2A2A]">
              <Image
                src={images[selectedImage]}
                alt={product.product_name}
                fill
                className="object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImage === idx
                        ? "border-[#005B14]"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.product_name} ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {product.product_type}
              </p>
              <h1 className="text-2xl font-bold text-foreground">
                {product.product_name}
              </h1>
              <p className="text-xs text-muted-foreground mt-1">
                SKU: {product.product_sku}
              </p>
            </div>

            <p className="text-3xl font-bold text-[#005B14]">
              {formatPrice(product.product_price)}
            </p>

            {product.description && (
              <div>
                <h2 className="text-sm font-semibold mb-1">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {variants.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold mb-2">Variants</h2>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <span
                      key={v.id}
                      className="px-3 py-1 rounded-full border text-sm text-muted-foreground border-[#E0E0E0] dark:border-[#3A3A3A]"
                    >
                      {v.name} — {formatPrice(v.price)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div>
              <h2 className="text-sm font-semibold mb-2">Quantity</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecrement}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-base font-medium w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={handleIncrement}
                  className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                className="flex-1 bg-[#005B14] hover:bg-[#004A10] text-white"
                onClick={() =>
                  router.push(`/storefront/${storeId}/checkout`)
                }
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => router.back()}
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
