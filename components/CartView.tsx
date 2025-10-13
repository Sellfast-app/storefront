// components/CartView.tsx
'use client'

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'
import MinusIcon from '@/components/svgIcons/MinusIcon'
import { useCart } from '@/context/CartContext'
import TrashIcon from './svgIcons/TrashIcon'
import SpeedafIcon from './svgIcons/SpeedafIcon'

export default function CartView() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart()

  const subtotal = getCartTotal()

  return (
    <div className="w-full h-full flex flex-col">
      {/* Cart Header */}
      <div className="pb-4">
        <h2 className="text-xl font-semibold">Cart ({cart.length})</h2>
      </div>

      {/* Cart Items - Scrollable */}
      <div className="flex-1 overflow-y-auto space-y-6">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500 text-center">Your cart is empty</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="space-y-3">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="object-cover rounded-lg"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Few units left</p>
                      <div className="flex items-center gap-1 mt-1">
                      <SpeedafIcon/> 
                        <span className="text-xs text-gray-600">SpeedAf</span>
                      </div>
                    </div>
                    <p className="font-semibold">₦{item.price.toLocaleString()}</p>
                  </div>
                </div>

                {/* Quantity Controls and Remove Button */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove <TrashIcon/>
                  </Button>

                  <div className="flex items-center gap-2 text-xs border rounded-xl p-1 bg-[#E0E0E0]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <span className="px-3 bg-white h-full flex items-center rounded">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Cart Summary - Fixed at bottom */}
      {cart.length > 0 && (
        <div className="mt-6 pt-6 border-t space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Subtotal</span>
            <span className="font-bold text-lg">₦{subtotal.toLocaleString()}</span>
          </div>

          <Button className="w-full bg-[#4FCA6A] hover:bg-[#45b85e] text-white py-6">
            Checkout (₦{subtotal.toLocaleString()})
          </Button>
        </div>
      )}
    </div>
  )
}