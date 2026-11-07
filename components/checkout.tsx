'use client'

import { useState } from 'react'
import { Gift, Shield, Tag, Truck, CreditCard, Eye, EyeOff } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

import { ArrowLeft, Lock } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
    Field, 
    FieldGroup, 
    FieldLabel, 
    FieldLegend, 
    FieldSet 
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { CheckboxCheck } from '@/components/motion/checkbox-check'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { 
    Select, 
    SelectContent, 
    SelectGroup, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

/**
 * Each block ships its own copy: registry install targets are globally unique, so a data file
 * cannot be shared between two blocks even when the contents match.
 */
export const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
] as const

export const countryLabels: Record<string, string> = Object.fromEntries(
  countryOptions.map(country => [country.value, country.label]),
)

export interface CheckoutForm1Data {
  email: string
  firstName: string
  lastName: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
  saveInfo: boolean
  sameAsBilling: boolean
  newsletter: boolean
  promoCode: string
}

export const initialCheckoutForm1Data: CheckoutForm1Data = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zipCode: '',
  country: 'US',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardName: '',
  saveInfo: false,
  sameAsBilling: true,
  newsletter: false,
  promoCode: '',
}

export interface OrderSummaryItem {
  id: number
  name: string
  variant: string
  price: number
  quantity: number
  image: string
}

export interface OrderSummary {
  items: OrderSummaryItem[]
  shipping: number
  tax: number
  discount: number
  promoDiscount: number
}

export const orderSummary: OrderSummary = {
  items: [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      variant: 'Midnight Black',
      price: 299.99,
      quantity: 1,
      image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/premium-wireless-headphones.600w.7d1414.avif',
    },
    {
      id: 2,
      name: 'Leather Laptop Sleeve',
      variant: 'Brown, 13-inch',
      price: 89.99,
      quantity: 1,
      image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/leather-laptop-sleeve.800w.86ef12.avif',
    },
  ],
  shipping: 15.99,
  tax: 27.54,
  discount: 0,
  promoDiscount: 0,
}

/////////////

const STEP_COPY = [
  { title: 'Contact Information', description: "We'll use this to send you order updates" },
  { title: 'Shipping Address', description: 'Where should we deliver your order?' },
  { title: 'Payment Details', description: 'Your payment information is secure and encrypted' },
]

export default function CheckoutForm({ initialCheckoutForm1Data }: { initialCheckoutForm1Data: CheckoutForm1Data }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<CheckoutForm1Data>(initialCheckoutForm1Data)

  const handleInputChange = (field: keyof CheckoutForm1Data, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /** Card numbers read in four-digit groups, so the value is reformatted as it is typed. */
  const handleCardNumberChange = (value: string) => {
    const formatted = value
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '$1 ')
      .trim()
    handleInputChange('cardNumber', formatted)
  }

  const handleExpiryChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2')
    handleInputChange('expiryDate', formatted)
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, STEP_COPY.length))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  return (
    <div className='bg-muted/30'>
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-balance'>Secure Checkout</h1>
          <p className='text-muted-foreground'>Complete your purchase in just a few steps</p>
        </div>

        <CheckoutForm1Progress step={step} />

        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <Card>
              <CardHeader>
                <CardTitle className='text-balance'>{STEP_COPY[step - 1].title}</CardTitle>
                <CardDescription>{STEP_COPY[step - 1].description}</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-6'>
                {step === 1 ? <CheckoutForm1ContactStep formData={formData} onChange={handleInputChange} /> : null}

                {step === 2 ? <CheckoutForm1ShippingStep formData={formData} onChange={handleInputChange} /> : null}

                {step === 3 ? (
                  <CheckoutForm1PaymentStep
                    formData={formData}
                    onChange={handleInputChange}
                    onCardNumberChange={handleCardNumberChange}
                    onExpiryChange={handleExpiryChange}
                  />
                ) : null}

                <div className='flex justify-between pt-6'>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={prevStep}
                    disabled={step === 1}
                    className='h-9 px-4 py-2 cursor-pointer'
                  >
                    <ArrowLeft data-icon='inline-start' />
                    Back
                  </Button>

                  {step < STEP_COPY.length ? (
                    <Button onClick={nextStep} className='h-9 px-4 py-2 cursor-pointer'>
                      Continue
                    </Button>
                  ) : (
                    <Button className='h-9 px-4 py-2 cursor-pointer'>
                      <Lock data-icon='inline-start' />
                      Complete Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className='lg:col-span-1'>
            <CheckoutForm1OrderSummary
              promoCode={formData.promoCode}
              onPromoCodeChange={value => handleInputChange('promoCode', value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

//////////////

type CheckoutForm1ContactStepProps = {
  formData: CheckoutForm1Data
  onChange: (field: keyof CheckoutForm1Data, value: string) => void
}

export function CheckoutForm1ContactStep({ formData, onChange }: CheckoutForm1ContactStepProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor='email-kL9x23P'>Email address</FieldLabel>
        <Input
          id='email-kL9x23P'
          type='email'
          placeholder='john@example.com'
          value={formData.email}
          onChange={event => onChange('email', event.target.value)}
          className='h-9'
        />
      </Field>

      <div className='grid gap-4 md:grid-cols-2'>
        <Field>
          <FieldLabel htmlFor='firstName-mN7z84Q'>First name</FieldLabel>
          <Input
            id='firstName-mN7z84Q'
            placeholder='John'
            value={formData.firstName}
            onChange={event => onChange('firstName', event.target.value)}
            className='h-9'
          />
        </Field>
        <Field>
          <FieldLabel htmlFor='lastName-pL8w45T'>Last name</FieldLabel>
          <Input
            id='lastName-pL8w45T'
            placeholder='Doe'
            value={formData.lastName}
            onChange={event => onChange('lastName', event.target.value)}
            className='h-9'
          />
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor='phone-rM6n82S'>Phone number (optional)</FieldLabel>
        <Input
          id='phone-rM6n82S'
          type='tel'
          placeholder='+1 (555) 123-4567'
          value={formData.phone}
          onChange={event => onChange('phone', event.target.value)}
          className='h-9'
        />
      </Field>
    </FieldGroup>
  )
}

//////////////////




type CheckoutForm1OrderSummaryProps = {
  promoCode: string
  onPromoCodeChange: (value: string) => void
}

export function CheckoutForm1OrderSummary({ promoCode, onPromoCodeChange }: CheckoutForm1OrderSummaryProps) {
  const subtotal = orderSummary.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const total =
    subtotal + orderSummary.shipping + orderSummary.tax - orderSummary.discount - orderSummary.promoDiscount

  return (
    <Card className='sticky top-8'>
      <CardHeader>
        <CardTitle className='text-balance'>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
          {orderSummary.items.map(item => (
            <div key={item.id} className='flex gap-4'>
              <div className='relative'>
                <img src={item.image} alt={item.name} className='size-16 rounded-lg object-cover' />
                <Badge
                  variant='secondary'
                  className='px-2.5 py-0.5 font-semibold absolute -end-2 -top-2 size-6 rounded-full p-0 text-xs'
                >
                  {item.quantity}
                </Badge>
              </div>
              <div className='min-w-0 flex-1'>
                <h4 className='truncate text-sm font-medium'>{item.name}</h4>
                <p className='text-muted-foreground text-xs'>{item.variant}</p>
                <p className='mt-1 text-sm font-medium'>${item.price}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <Field>
          <FieldLabel htmlFor='promoCode-kL1m67Q' className='text-sm'>
            Promo code
          </FieldLabel>
          <div className='flex gap-2'>
            <Input
              id='promoCode-kL1m67Q'
              placeholder='Enter code'
              value={promoCode}
              className='h-9'
              onChange={event => onPromoCodeChange(event.target.value)}
            />
            <Button variant='outline' className='h-9 px-4 py-2 cursor-pointer'>
              Apply
            </Button>
          </div>
        </Field>

        <Separator />

        <div className='flex flex-col gap-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <Truck className='size-3' aria-hidden='true' />
              Shipping
            </span>
            <span>${orderSummary.shipping.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Tax</span>
            <span>${orderSummary.tax.toFixed(2)}</span>
          </div>
          {orderSummary.promoDiscount > 0 ? (
            <div className='flex justify-between text-sm text-green-600'>
              <span className='flex items-center gap-1'>
                <Tag className='size-3' aria-hidden='true' />
                Promo discount
              </span>
              <span>-${orderSummary.promoDiscount.toFixed(2)}</span>
            </div>
          ) : null}
        </div>

        <Separator />

        <div className='flex justify-between font-semibold'>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <div className='flex flex-col gap-3 pt-4'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Shield className='size-4 text-green-600' aria-hidden='true' />
            <span>SSL encrypted checkout</span>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Truck className='size-4 text-blue-600' aria-hidden='true' />
            <span>Free shipping on orders over $75</span>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Gift className='size-4 text-purple-600' aria-hidden='true' />
            <span>30-day return policy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

//////////////




type CheckoutForm1PaymentStepProps = {
  formData: CheckoutForm1Data
  onChange: (field: keyof CheckoutForm1Data, value: string | boolean) => void
  onCardNumberChange: (value: string) => void
  onExpiryChange: (value: string) => void
}

export function CheckoutForm1PaymentStep({
  formData,
  onChange,
  onCardNumberChange,
  onExpiryChange,
}: CheckoutForm1PaymentStepProps) {
  const [showCvv, setShowCvv] = useState(false)

  return (
    <div className='flex flex-col gap-6'>
      <FieldSet>
        <FieldLegend className='text-sm font-medium'>Payment method</FieldLegend>
        <RadioGroup defaultValue='card' className='flex flex-col gap-3'>
          <FieldLabel htmlFor='card-payment-cN9m74K'>
            <Field orientation='horizontal' className='rounded-lg border p-4'>
              <RadioGroupItem value='card' id='card-payment-cN9m74K' />
              <CreditCard className='text-muted-foreground size-5' aria-hidden='true' />
              <span className='flex-1'>Credit or debit card</span>
            </Field>
          </FieldLabel>
        </RadioGroup>
      </FieldSet>

      <FieldGroup>
        <Field>
          <FieldLabel htmlFor='cardNumber-dK5p83L'>Card number</FieldLabel>
          <Input
            id='cardNumber-dK5p83L'
            placeholder='1234 5678 9012 3456'
            value={formData.cardNumber}
            onChange={event => onCardNumberChange(event.target.value)}
            maxLength={19}
            className='h-9'
          />
        </Field>

        <div className='grid gap-4 md:grid-cols-3'>
          <Field>
            <FieldLabel htmlFor='expiryDate-fJ6r29M'>Expiry</FieldLabel>
            <Input
              id='expiryDate-fJ6r29M'
              placeholder='MM/YY'
              value={formData.expiryDate}
              onChange={event => onExpiryChange(event.target.value)}
              maxLength={5}
              className='h-9'
            />
          </Field>
          <Field>
            <FieldLabel htmlFor='cvv-gH8s34N'>CVV</FieldLabel>
            <InputGroup className='h-9'>
              <InputGroupInput
                id='cvv-gH8s34N'
                type={showCvv ? 'text' : 'password'}
                placeholder='123'
                value={formData.cvv}
                onChange={event => onChange('cvv', event.target.value)}
                maxLength={4}
              />
              <InputGroupAddon align='inline-end'>
                <InputGroupButton
                  type='button'
                  variant='ghost'
                  size='icon-xs'
                  aria-label={showCvv ? 'Hide CVV' : 'Show CVV'}
                  className='cursor-pointer hover:bg-transparent'
                  onClick={() => setShowCvv(current => !current)}
                >
                  {showCvv ? <EyeOff className='text-muted-foreground' /> : <Eye className='text-muted-foreground' />}
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </Field>
          <Field>
            <FieldLabel htmlFor='cardName-hI9t45O'>Name on card</FieldLabel>
            <Input
              id='cardName-hI9t45O'
              placeholder='John Doe'
              value={formData.cardName}
              onChange={event => onChange('cardName', event.target.value)}
              className='h-9'
            />
          </Field>
        </div>

        <Field orientation='horizontal'>
          <CheckboxCheck
            id='saveInfo-jK0u56P'
            checked={formData.saveInfo}
            onCheckedChange={checked => onChange('saveInfo', checked as boolean)}
          />
          <FieldLabel htmlFor='saveInfo-jK0u56P' className='text-sm font-normal'>
            Save payment information for future purchases
          </FieldLabel>
        </Field>
      </FieldGroup>
    </div>
  )
}

////////////////

const STEP_COUNT = 3

export function CheckoutForm1Progress({ step }: { step: number }) {
  return (
    <div className='mb-8 flex justify-center'>
      <div className='flex items-center gap-4'>
        {Array.from({ length: STEP_COUNT }, (_, index) => index + 1).map(stepNumber => (
          <div key={stepNumber} className='flex items-center'>
            <div
              aria-current={stepNumber === step ? 'step' : undefined}
              className={cn(
                'flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors',
                stepNumber <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
              )}
            >
              {stepNumber}
            </div>
            {stepNumber < STEP_COUNT ? (
              <div
                aria-hidden='true'
                className={cn(
                  'mx-4 h-1 w-16 rounded transition-colors',
                  stepNumber < step ? 'bg-primary' : 'bg-muted',
                )}
              />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

//////////////

type CheckoutForm1ShippingStepProps = {
  formData: CheckoutForm1Data
  onChange: (field: keyof CheckoutForm1Data, value: string) => void
}

export function CheckoutForm1ShippingStep({ formData, onChange }: CheckoutForm1ShippingStepProps) {
  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor='address-qP4z17X'>Street address</FieldLabel>
        <Input
          id='address-qP4z17X'
          placeholder='123 Main Street'
          value={formData.address}
          onChange={event => onChange('address', event.target.value)}
          className='h-9'
        />
      </Field>

      <div className='grid gap-4 md:grid-cols-2'>
        <Field>
          <FieldLabel htmlFor='city-sT5y91B'>City</FieldLabel>
          <Input
            id='city-sT5y91B'
            placeholder='New York'
            value={formData.city}
            onChange={event => onChange('city', event.target.value)}
            className='h-9'
          />
        </Field>
        <Field>
          <FieldLabel htmlFor='state-wX3k85M'>State</FieldLabel>
          <Input
            id='state-wX3k85M'
            placeholder='NY'
            value={formData.state}
            onChange={event => onChange('state', event.target.value)}
            className='h-9'
          />
        </Field>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Field>
          <FieldLabel htmlFor='zipCode-vZ9q46N'>ZIP code</FieldLabel>
          <Input
            id='zipCode-vZ9q46N'
            placeholder='10001'
            value={formData.zipCode}
            onChange={event => onChange('zipCode', event.target.value)}
            className='h-9'
          />
        </Field>
        <CheckoutForm1CountryField
          id='country-bH7l52P'
          value={formData.country}
          onValueChange={value => onChange('country', value)}
        />
      </div>
    </FieldGroup>
  )
}

//////////////////

type CheckoutForm1CountryFieldProps = {
  id: string
  value: string
  onValueChange: (value: string) => void
}

export function CheckoutForm1CountryField({ id, value, onValueChange }: CheckoutForm1CountryFieldProps) {
  return (
    <Field>
      <FieldLabel htmlFor={id}>Country</FieldLabel>
      <Select value={value} onValueChange={next => next && onValueChange(next)}>
        <SelectTrigger id={id} className='!h-9 w-full'>
          <SelectValue>{(selected: string) => countryLabels[selected] ?? selected}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {countryOptions.map(country => (
              <SelectItem key={country.value} value={country.value}>
                {country.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
  )
}
