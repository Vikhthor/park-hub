'use client'

import { useEffect, useRef, useState } from 'react'
import { Trash2, Minus, Plus, ShoppingBag, Package, Shield, CreditCard, Store, MoveRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export interface CartItem {
  id: string
  name: string
  color: string
  size: string
  price: number
  originalPrice: number
  quantity: number
  image: string
  estimatedDelivery: string
}

export interface CartData {
  items: CartItem[]
  shipping: {
    freeThreshold: number
    message: string
    cost: number
  }
}

export const cartData: CartData = {
  items: [
    {
      id: '1',
      name: 'Premium Wool Cardigan',
      color: 'Sage Green',
      size: 'M',
      price: 129.99,
      originalPrice: 159.99,
      quantity: 1,
      image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/premium-wool-sweater.800w.b234d4.avif',
      estimatedDelivery: '2-4 business days',
    },
    {
      id: '2',
      name: 'Designer Leather Bag',
      color: 'Vintage Brown',
      size: 'One Size',
      price: 299.99,
      originalPrice: 349.99,
      quantity: 1,
      image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/designer-leather-bag.800w.b43230.avif',
      estimatedDelivery: '3-5 business days',
    },
    {
      id: '3',
      name: 'Smart Watch Pro',
      color: 'Space Grey',
      size: 'One Size',
      price: 199.99,
      originalPrice: 249.99,
      quantity: 1,
      image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/accessories.800w.900f12.avif',
      estimatedDelivery: '1-3 business days',
    },
  ],
  shipping: {
    freeThreshold: 500,
    message: 'Free shipping on orders over $500',
    cost: 15.99,
  },
}

export default function ShoppingCart1({ cartData }: { cartData: CartData }) {
  const [items, setItems] = useState<CartItem[]>(cartData.items)
  const [isRemoving, setIsRemoving] = useState<string | null>(null)

  const updateQuantity = (id: string, increment: boolean) => {
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setIsRemoving(id)
    setTimeout(() => {
      setItems(currentItems => currentItems.filter(item => item.id !== id))
      setIsRemoving(null)
    }, 300)
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const savings = items.reduce((sum, item) => sum + (item.originalPrice - item.price) * item.quantity, 0)
  const shipping = subtotal >= cartData.shipping.freeThreshold ? 0 : cartData.shipping.cost
  const total = subtotal + shipping

  return (
    <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
      <div className='flex flex-col gap-2 mb-8 text-center'>
        <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>Your Shopping Cart</h1>
        <p className='text-muted-foreground'>
          {items.length} {items.length === 1 ? 'item' : 'items'} in your cart •{' '}
          <span className='text-foreground font-semibold'>${subtotal.toFixed(2)}</span>
        </p>
      </div>

      <div className='flex flex-col gap-8 lg:flex-row'>
        <div className='flex-1 flex flex-col gap-6'>
          {/* Cart Items */}
          {items.length === 0 ? (
            <Card className='border-dashed'>
              <CardContent className='flex flex-col items-center justify-center py-12 text-center'>
                <ShoppingBag className='text-muted-foreground/50 mb-4 size-12' />
                <h3 className='text-lg font-medium'>Your cart is empty</h3>
                <p className='text-muted-foreground mt-1 text-sm'>Add some items to get started</p>
                <Button className="h-9 px-4 py-2 mt-4 cursor-pointer" variant='outline'>
                  Continue Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map(item => (
              <Card
                key={item.id}
                className={cn('gap-0 overflow-hidden py-0', {
                  'opacity-50': isRemoving === item.id,
                })}
              >
                <div className='flex flex-col sm:flex-row'>
                  <div className='relative h-auto w-full sm:w-40'>
                    <img src={item.image} alt={item.name} className='h-36 w-full object-cover object-center' />
                  </div>

                  <div className='flex-1 p-4'>
                    <div className='flex items-start justify-between'>
                      <div>
                        <h3 className='text-foreground text-lg font-medium'>{item.name}</h3>
                        <p className='text-muted-foreground mt-1 text-sm'>
                          {item.color} {item.size && `• ${item.size}`}
                        </p>
                      </div>
                      <Button
                        variant='ghost'
                        size='icon'
                        className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                      >
                        <Trash2 />
                      </Button>
                    </div>

                    <div className='mt-4 flex items-center justify-between'>
                      <div className='flex items-center gap-2'>
                        <Button
                          variant='outline'
                          size='icon'
                          className="size-8 cursor-pointer"
                          onClick={() => updateQuantity(item.id, false)}
                          disabled={item.quantity <= 1}
                          aria-label={`Decrease quantity of ${item.name}`}
                        >
                          <Minus />
                        </Button>
                        <span className='w-8 text-center text-sm font-medium'>{item.quantity}</span>
                        <Button
                          variant='outline'
                          size='icon'
                          className="size-8 cursor-pointer"
                          onClick={() => updateQuantity(item.id, true)}
                          aria-label={`Increase quantity of ${item.name}`}
                        >
                          <Plus />
                        </Button>
                      </div>

                      <div className='text-end'>
                        <p className='text-lg font-semibold'>${(item.price * item.quantity).toFixed(2)}</p>
                        {item.originalPrice > item.price && (
                          <p className='text-muted-foreground text-xs line-through'>${item.originalPrice.toFixed(2)}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <CardFooter className='bg-muted/20 border-t px-4 !py-2'>
                  <div className='text-muted-foreground flex items-center text-sm'>
                    <Package className='me-2 size-4' />
                    <span>Estimated delivery: {item.estimatedDelivery}</span>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>

        {/* Order Summary */}
        <div className='flex flex-col gap-4 w-full lg:w-96'>
          <Card className='sticky top-4 gap-0'>
            <CardHeader className='pb-4'>
              <CardTitle className='text-xl'>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-4'>
              <div className='flex flex-col gap-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-muted-foreground'>Shipping</span>
                  <span className={shipping === 0 ? 'text-success' : ''}>
                    {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {savings > 0 && (
                  <div className='flex justify-between text-sm font-medium'>
                    <span>You Save</span>
                    <span>-${savings.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <Separator className='my-2' />

              <div className='flex items-center justify-between text-base font-medium'>
                <span>Total</span>
                <div className='text-end'>
                  <p className='text-xl font-bold'>
                    <ShoppingCart1SpinningCounter value={total} decimals={2} prefix='$' />
                  </p>
                  <p className='text-muted-foreground text-xs'>including VAT, if applicable</p>
                </div>
              </div>

              <Button
                size='lg'
                className="h-10 px-8 mt-4 w-full cursor-pointer text-base font-medium"
                disabled={items.length === 0}
              >
                <ShoppingBag data-icon='inline-start' />
                Proceed to Checkout
              </Button>

              <div className='text-muted-foreground flex items-center justify-center gap-2 text-xs'>
                <CreditCard className='size-3.5' />
                <span>Secure payment with SSL encryption</span>
              </div>
            </CardContent>
          </Card>

          <Card className='border-dashed py-4'>
            <CardContent className='px-4'>
              <div className='flex items-start gap-3'>
                <div className='flex size-10 items-center justify-center rounded-full bg-amber-100 text-amber-600'>
                  <Shield className='size-5' />
                </div>
                <div>
                  <h4 className='font-medium'>Secure Checkout</h4>
                  <p className='text-muted-foreground mt-1 text-xs'>
                    Your payment information is encrypted and secure.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button variant='outline' className="h-9 px-4 py-2 w-full cursor-pointer">
            <Store data-icon='inline-start' />
            Continue Shopping
            <MoveRight data-icon='inline-end' />
          </Button>
        </div>
      </div>
    </div>
  )
}

///////////////


/**
 * Spinning counter: each digit is a clipped vertical reel of 0-9 cells that
 * spins forward and lands on the target digit. Adapted from Transitions.dev
 * "Spinning counter" (26-spinning-counter.md), re-tuned for cart totals:
 * one loop instead of several, and a snappier duration so rapid +/- clicks
 * don't queue up sluggish animations. The spec's directional SVG blur is
 * approximated here with a CSS `filter: blur()` transition for simplicity.
 *
 * Non-digit characters (currency symbol, decimal point, thousands separator)
 * render as static text so only the digits spin.
 */
const CELL_SIZE = 20 // px
const DURATION = 450 // ms
const STAGGER = 60 // ms per column
const SPINS = 1 // extra full loops before landing
const SPIN_BLUR = 2 // px

const REEL_DIGITS = Array.from({ length: (SPINS + 1) * 10 }, (_, i) => i % 10)

type ShoppingCart1SpinningCounterProps = {
  value: number
  /** Fixed decimal places to format the value with, e.g. 2 for currency. */
  decimals?: number
  /** Static text rendered before the formatted value, e.g. '$'. */
  prefix?: string
  className?: string
  digitClassName?: string
}

export function ShoppingCart1SpinningCounter({ value, decimals = 0, prefix, className, digitClassName }: ShoppingCart1SpinningCounterProps) {
  const safeValue = Math.max(0, value)
  const formatted = safeValue.toFixed(decimals)
  const chars = formatted.split('')
  const containerRef = useRef<HTMLSpanElement>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const strips = Array.from(container.querySelectorAll<HTMLElement>('[data-reel-strip]'))
    const timeouts: number[] = []

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    strips.forEach((strip, index) => {
      const digit = Number(strip.dataset.digit)
      const delay = (strips.length - 1 - index) * STAGGER

      if (isFirstRender.current || !strip.dataset.initialized || prefersReducedMotion) {
        strip.style.transition = 'none'
        strip.style.transform = `translateY(-${digit * CELL_SIZE}px)`
        strip.style.filter = 'blur(0px)'
        strip.dataset.initialized = 'true'
        void strip.offsetHeight
        return
      }

      const landingIndex = SPINS * 10 + digit
      strip.style.transition = `transform ${DURATION}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, filter ${DURATION}ms ease-out ${delay}ms`
      strip.style.transform = `translateY(-${landingIndex * CELL_SIZE}px)`
      strip.style.filter = `blur(${SPIN_BLUR}px)`

      const settleTimeout = window.setTimeout(() => {
        strip.style.filter = 'blur(0px)'
      }, delay + 30)

      const resetTimeout = window.setTimeout(() => {
        strip.style.transition = 'none'
        strip.style.transform = `translateY(-${digit * CELL_SIZE}px)`
        void strip.offsetHeight
      }, delay + DURATION + 30)

      timeouts.push(settleTimeout, resetTimeout)
    })

    isFirstRender.current = false

    return () => {
      timeouts.forEach(window.clearTimeout)
    }
  }, [formatted])

  return (
    <span className='relative inline-flex items-center'>
      <span className='sr-only'>{prefix}{formatted}</span>
      <span
        ref={containerRef}
        className={cn('inline-flex items-center font-[inherit] tabular-nums', className)}
        style={{ height: CELL_SIZE }}
        aria-hidden='true'
      >
        {prefix ? (
          <span className={digitClassName} style={{ display: 'inline-flex', alignItems: 'center', height: CELL_SIZE }}>
            {prefix}
          </span>
        ) : null}
        {chars.map((char, index) => {
          if (!/\d/.test(char)) {
            return (
              <span
                key={index}
                className={digitClassName}
                style={{ display: 'inline-flex', alignItems: 'center', height: CELL_SIZE }}
              >
                {char}
              </span>
            )
          }

          return (
            <span
              key={index}
              className='relative inline-block overflow-hidden'
              style={{
                height: CELL_SIZE,
                maskImage: 'linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, #000 22%, #000 78%, transparent 100%)',
              }}
            >
              <span data-reel-strip data-digit={char} className='flex flex-col will-change-[transform,filter]'>
                {REEL_DIGITS.map((cellDigit, cellIndex) => (
                  <span
                    key={cellIndex}
                    className={cn('flex items-center justify-center', digitClassName)}
                    style={{ height: CELL_SIZE }}
                  >
                    {cellDigit}
                  </span>
                ))}
              </span>
            </span>
          )
        })}
      </span>
    </span>
  )
}
