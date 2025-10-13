// components/CartButton.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import CartIcon from '@/components/svgIcons/CartIcon'
import { useCart } from '@/context/CartContext'

interface CartButtonProps {
  onClick?: () => void
}

export default function CartButton({ onClick }: CartButtonProps) {
  const { getCartItemCount } = useCart()
  const itemCount = getCartItemCount()

  return (
    <Button variant="outline" className="relative" onClick={onClick}>
      <CartIcon />
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#4FCA6A] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  )
}