'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { 
    Gift, 
    Shield, 
    Tag, 
    Truck, 
    CreditCard, 
    Wallet,
    Eye, 
    EyeOff, 
    Trash2, 
    Minus, 
    Plus, 
    ShoppingBag, 
    Package,
    Store, 
    MoveRight,
    ArrowLeft, 
    Lock,
    TicketX,
    Gavel
} from 'lucide-react'
import {
  addDays,
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  startOfDay,
} from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
  Combobox,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@/components/ui/combobox"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
import { ParkingLayout } from "@/components/parking-layout";
import type { ParkingLevel, ParkingSpot, SpotKind, SpotStatus } from "@/components/parking-layout";
import { ScheduleDatePicker } from '@/components/schedule-calendar'

export interface CheckoutFormData {
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

const STEPS = [
  { title: 'Schedule Details', description: "We'll use this to send you order updates" },
  { title: 'Parking Slot', description: 'Where do you prefer to park?' },
  { title: 'Payment Details', description: 'Your payment information is secure and encrypted' },
]

const STEP_COUNT = 3

const initialCheckoutForm1Data: CheckoutFormData = {
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

export default function CheckoutForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<CheckoutFormData>(initialCheckoutForm1Data)
  const [totalQuantity, setTotalQuantity] = useState(1)

  const handleInputChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  /** Card numbers read in four-digit groups, so the value is reformatted as it is typed. */
  const handleCardNumberChange = (value: string) => {
    const formatted = value
      .replace(/\s/g, '')
      .replace(/(.{4})/g, '₦1 ')
      .trim()
    handleInputChange('cardNumber', formatted)
  }

  const handleExpiryChange = (value: string) => {
    const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '₦1/₦2')
    handleInputChange('expiryDate', formatted)
  }

  const nextStep = () => setStep(prev => Math.min(prev + 1, STEPS.length))
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

  return (
    <div className='bg-muted/30'>
      <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8'>
        {/* <div className='mb-8 text-center'>
          <h1 className='mb-2 text-3xl font-bold text-balance'>Secure Checkout</h1>
          <p className='text-muted-foreground'>Complete your purchase in just a few steps</p>
        </div> */}

        <CheckoutFormProgress step={step} />

        <div className='grid gap-8 lg:grid-cols-2'>
          <div className='lg:col-span-1'>
            <Card>
              <CardHeader>
                <CardTitle className='text-balance'>{STEPS[step - 1].title}</CardTitle>
                <CardDescription>{STEPS[step - 1].description}</CardDescription>
              </CardHeader>
              <CardContent className='flex flex-col gap-6'>
                {step === 1 ? <CheckoutFormScheduleStep 
                  formData={formData} 
                  onChange={handleInputChange} 
                  quantity={totalQuantity}
                  setQuantity={setTotalQuantity}
                /> : null}

                {/* {step === 2 ? <CheckoutFormShippingStep formData={formData} onChange={handleInputChange} /> : null} */}

                {step === 2 ? <CheckoutFormParkingSlotStep/>: null}

                {step === 3 ? (
                  <CheckoutFormPaymentStep
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

                  {step < STEPS.length ? (
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
            <CheckoutFormOrderSummary
              promoCode={formData.promoCode}
              onPromoCodeChange={value => handleInputChange('promoCode', value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

//////////// Schedule Form /////////////

type CheckoutFormScheduleStepProps = {
  formData: CheckoutFormData
  onChange: (field: keyof CheckoutFormData, value: string) => void
  quantity: number
  setQuantity: (units: number) => void
}

type VehicleSelectionValue =
  | {
      type: "preset"
      id: string
      label: string
      licence: string
    }
  | {
      type: "custom"
      label: string
      licence: string
    }
  | null

export function CheckoutFormScheduleStep({ formData, onChange, quantity, setQuantity }: CheckoutFormScheduleStepProps) {
  const [vehicle, setVehicle] = useState<VehicleSelectionValue>(null)

  const updateQuantity = (increment: boolean) => {
    // setItems(currentItems =>
    //   currentItems.map(item =>
    //     item.id === id ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) } : item,
    //   ),
    // )
    if(quantity){
      setQuantity(quantity+(increment ? 1 : -1))
    }
  }

  return (
    <FieldGroup>
      {/* <Field>
        <FieldLabel htmlFor='email-kL9x23P'>Email address</FieldLabel>
        <Input
          id='email-kL9x23P'
          type='email'
          placeholder='john@example.com'
          value={formData.email}
          onChange={event => onChange('email', event.target.value)}
          className='h-9'
        />
      </Field> */}

      <div className='grid gap-4 md:grid-cols-2'>
        <Field>
          <FieldLabel htmlFor='schedule-time'>Schedule Time</FieldLabel>
          {/* <Input
            id='schedule-time'
            placeholder='John'
            value={formData.firstName}
            onChange={event => onChange('firstName', event.target.value)}
            className='h-9'
          /> */}
          <ScheduleDatePicker/>
        </Field>
        <Field>
          <FieldLabel htmlFor='lastName-pL8w45T'>Duration (Hours)</FieldLabel>
          {/* <Input
            id='lastName-pL8w45T'
            placeholder='Doe'
            value={formData.lastName}
            onChange={event => onChange('lastName', event.target.value)}
            className='h-9'
          /> */}
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
            <Button
                variant='outline'
                size='icon'
                className="size-8 cursor-pointer"
                onClick={() => updateQuantity(false)}
                disabled={quantity <= 1}
                aria-label={`Decrease booking time`}
            >
                <Minus />
            </Button>
            <span className='w-8 text-center text-sm font-medium'>{quantity}</span>
            <Button
                variant='outline'
                size='icon'
                className="size-8 cursor-pointer"
                onClick={() => updateQuantity(true)}
                aria-label={`Increase booking time`}
            >
                <Plus />
            </Button>
            </div>

            {/* <div className='text-end'>
            <p className='text-lg font-semibold'>${(item.price * item.quantity).toFixed(2)}</p>
            {item.original_price > item.price && (
                <p className='text-muted-foreground text-xs line-through'>${item.original_price.toFixed(2)}</p>
            )}
            </div> */}
          </div>
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor='phone-rM6n82S'>Vehicle</FieldLabel>
        {/* <Input
          id='phone-rM6n82S'
          type='tel'
          placeholder='+1 (555) 123-4567'
          value={formData.phone}
          onChange={event => onChange('phone', event.target.value)}
          className='h-9'
        /> */}
        <VehicleSelectionCombobox value={vehicle} onValueChange={setVehicle} />
      </Field>
    </FieldGroup>
  )
}



type PresetVehicleOption = {
  type: "preset"
  id: string
  label: string
  licence: string
  searchText: string
}

type CustomVehicleAction = {
  type: "custom"
  id: "custom-vehicle"
  label: string
  searchText: string
}

type EmptyVehicleOption = {
  type: "none"
  id: "no-vehicle"
  label: string
  searchText: string
}

type VehicleOption = EmptyVehicleOption | PresetVehicleOption | CustomVehicleAction

const noVehicleOption: EmptyVehicleOption = {
  type: "none",
  id: "no-vehicle",
  label: "No Vehicle",
  searchText: "No vehicle clear vehicle remove vehicle empty",
}

const customVehicleOption: CustomVehicleAction = {
  type: "custom",
  id: "custom-vehicle",
  label: "Create new vehicle...",
  searchText:
    "Create vehicle custom vehicle new vehicle choose a vehicle manual vehicle",
}

function VehicleTriggerLabel({
  value,
  placeholder,
}: {
  value: VehicleSelectionValue
  placeholder: string
}) {
  if (!value) {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <span className="text-muted-foreground truncate">{placeholder}</span>
      </span>
    )
  }

  const displayLabel =
    value.type === "custom" ? value.licence : value.label

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="truncate">{displayLabel}</span>
    </span>
  )
}

function VehicleOptionRow({ option }: { option: VehicleOption }) {
  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  if (option.type === "custom") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  return (
    <span className="flex w-full min-w-0 items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{option.label}</span>
      </span>
      <span className="text-muted-foreground shrink-0 text-[13px] tabular-nums">
        {/* {format(option.date, "dd/MM/yyyy")} */}
        {option.licence}
      </span>
    </span>
  )
}

function getUpcomingWeekEnd(today: Date) {
  const weekEnd = endOfWeek(today, { weekStartsOn: 1 })
  return isSameDay(today, weekEnd) ? addWeeks(weekEnd, 1) : weekEnd
}

function getUpcomingMonthEnd(today: Date) {
  const monthEnd = endOfMonth(today)
  return isSameDay(today, monthEnd) ? endOfMonth(addMonths(today, 1)) : monthEnd
}

function VehicleSelectionCombobox({
  value,
  onValueChange,
}: {
  value: VehicleSelectionValue
  onValueChange: (value: VehicleSelectionValue) => void
}) {
  const today = useMemo(() => startOfDay(new Date()), [])
  const [pickerOpen, setPickerOpen] = useState(false)
  const [draftVehicle, setDraftVehicle] = useState<string | undefined>(
    value?.licence
  )

  const presetOptions = useMemo<PresetVehicleOption[]>(
    () => [
      {
        type: "preset",
        id: "tomorrow",
        label: "Honda Accord",
        licence: "ABCD123",
        searchText: "Tomorrow next day due date",
      },
      {
        type: "preset",
        id: "end-of-week",
        label: "Hyundai Accent",
        licence: "ABCD123",
        searchText: "End of week Sunday week close target",
      },
      {
        type: "preset",
        id: "in-one-week",
        label: "Toyota Corolla",
        licence: "ABCD123",
        searchText: "In one week next week seven days target",
      },
      {
        type: "preset",
        id: "end-of-month",
        label: "Toyota Camry",
        licence: "ABCD123",
        searchText: "End of month month close month end target",
      },
      {
        type: "preset",
        id: "in-one-month",
        label: "Lexus 350",
        licence: "ABCD123",
        searchText: "In one month next month thirty days target",
      },
    ],
    [today]
  )

  const vehicleOptions: VehicleOption[] = [
    noVehicleOption,
    ...presetOptions,
    customVehicleOption,
  ]

  const activePreset =
    value?.type === "preset"
      ? (presetOptions.find((option) => option.id === value.id) ?? null)
      : !value
        ? noVehicleOption
        : null

  useEffect(() => {
    if (!pickerOpen) {
      return
    }

    setDraftVehicle(value?.licence)
  }, [pickerOpen, today, value])

  function handleOptionChange(nextValue: VehicleOption | null) {
    if (!nextValue) {
      return
    }

    if (nextValue.type === "none") {
      onValueChange(null)
      return
    }

    if (nextValue.type === "custom") {
      requestAnimationFrame(() => setPickerOpen(true))
      return
    }

    onValueChange({
      type: "preset",
      id: nextValue.id,
      label: nextValue.label,
      licence: nextValue.licence,
    })
  }

  function handleConfirmCustomVehicle() {
    if (!draftVehicle) {
      return
    }

    onValueChange({
      type: "custom",
      label: draftVehicle,
      licence: draftVehicle,
    })
    setPickerOpen(false)
  }

  return (
    <>
      <Combobox
        items={vehicleOptions}
        value={activePreset}
        onValueChange={handleOptionChange}
        itemToStringValue={(item: VehicleOption) => item.searchText}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            />
          }
        >
          <VehicleTriggerLabel value={value} placeholder="Select Vehicle" />
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxList>
            <ComboboxItem value={noVehicleOption}>
              <VehicleOptionRow option={noVehicleOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            {presetOptions.map((option) => (
              <ComboboxItem key={option.id} value={option}>
                <VehicleOptionRow option={option} />
              </ComboboxItem>
            ))}

            <ComboboxSeparator />
            <ComboboxItem value={customVehicleOption}>
              <VehicleOptionRow option={customVehicleOption} />
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
        <DialogContent className="flex w-auto max-w-[calc(100vw-2rem)] flex-col gap-0 overflow-hidden sm:max-w-none">
          <DialogHeader>
            <DialogTitle>Pick a vehicle</DialogTitle>
          </DialogHeader>

          {/* <div className="py-3">
            <Calendar
              mode="single"
              selected={draftDate}
              onSelect={setDraftDate}
              defaultMonth={draftDate ?? today}
              numberOfMonths={2}
              pagedNavigation
              showOutsideDays={false}
            />
          </div> */}

          <DialogFooter>
            <DialogClose render={<Button variant="outline" size="sm" />}>
              Dismiss
            </DialogClose>
            <Button
              size="sm"
              onClick={handleConfirmCustomVehicle}
              disabled={!draftVehicle}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


/////// Order Summary //////////

type CheckoutFormOrderSummaryProps = {
  promoCode: string
  onPromoCodeChange: (value: string) => void
}

export interface OrderSummaryItem {
  id: string
  name: string
  address: string
  price: number
  original_price: number
  quantity: number
  image: string
}

export interface OrderSummary {
  park: OrderSummaryItem
  shipping: number
  tax: number
  discount: number
  promoDiscount: number
}

export const orderSummary: OrderSummary = {
  park: {
    id: "1",
    name: 'Lagos City Park 1',
    address: "404 Not found",
    price: 299.99,
    original_price: 299.99,
    quantity: 1,
    image: 'https://assets.shadcnstore.com/shadcnstore.com/stock/e-commerce/premium-wireless-headphones.600w.7d1414.avif',
  },
  shipping: 15.99,
  tax: 27.54,
  discount: 0,
  promoDiscount: 0,
}

export function CheckoutFormOrderSummary({ promoCode, onPromoCodeChange }: CheckoutFormOrderSummaryProps) {
  const subtotal = orderSummary.park.price * orderSummary.park.quantity
  const total =
    subtotal + orderSummary.shipping + orderSummary.tax - orderSummary.discount - orderSummary.promoDiscount

  const updateQuantity = (id: string, increment: boolean) => {
    // setItems(currentItems =>
    //   currentItems.map(item =>
    //     item.id === id ? { ...item, quantity: Math.max(1, item.quantity + (increment ? 1 : -1)) } : item,
    //   ),
    // )
  }

  return (
    <Card className='sticky top-8'>
      <CardHeader>
        <CardTitle className='text-balance'>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-4'>
        <div className='flex flex-col gap-4'>
            <div key={orderSummary.park.id} className='flex gap-4'>
              {/* <div className='relative'>
                <img src={item.image} alt={item.name} className='size-16 rounded-lg object-cover' />
                <Badge
                  variant='secondary'
                  className='px-2.5 py-0.5 font-semibold absolute -end-2 -top-2 size-6 rounded-full p-0 text-xs'
                >
                  {orderSummary.park.quantity}
                </Badge>
              </div> */}
              <div className='min-w-0 flex-1'>
                <h4 className='truncate text-sm font-medium'>{orderSummary.park.name}</h4>
                <p className='text-muted-foreground text-xs'>{orderSummary.park.address}</p>
                <p className='mt-1 text-sm font-medium'>${orderSummary.park.price}</p>
              </div>

              {/* <div className='mt-4 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                    <Button
                        variant='outline'
                        size='icon'
                        className="size-8 cursor-pointer"
                        onClick={() => updateQuantity(orderSummary.park.id, false)}
                        disabled={orderSummary.park.quantity <= 1}
                        aria-label={`Decrease quantity of ${orderSummary.park.name}`}
                    >
                        <Minus />
                    </Button>
                    <span className='w-8 text-center text-sm font-medium'>{orderSummary.park.quantity}</span>
                    <Button
                        variant='outline'
                        size='icon'
                        className="size-8 cursor-pointer"
                        onClick={() => updateQuantity(orderSummary.park.id, true)}
                        aria-label={`Increase quantity of ${orderSummary.park.name}`}
                    >
                        <Plus />
                    </Button>
                    </div>

                    <div className='text-end'>
                    <p className='text-lg font-semibold'>${(orderSummary.park.price * orderSummary.park.quantity).toFixed(2)}</p>
                    {orderSummary.park.original_price > orderSummary.park.price && (
                        <p className='text-muted-foreground text-xs line-through'>${orderSummary.park.original_price.toFixed(2)}</p>
                    )}
                    </div>
              </div> */}

            </div>
        </div>

        {/* <Separator />

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
        </Field> */}

        <Separator />

        <div className='flex flex-col gap-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground'>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {/* <div className='flex justify-between text-sm'>
            <span className='text-muted-foreground flex items-center gap-1'>
              <Truck className='size-3' aria-hidden='true' />
              Shipping
            </span>
            <span>${orderSummary.shipping.toFixed(2)}</span>
          </div> */}
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

        <Separator />

        <div className='flex flex-col gap-3'>
            <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
            </div>
            {/* <div className='flex justify-between text-sm'>
                <span className='text-muted-foreground'>Shipping</span>
                <span className={shipping === 0 ? 'text-success' : ''}>
                {shipping === 0 ? 'Free' : `₦${shipping.toFixed(2)}`}
                </span>
            </div>
            {savings > 0 && (
                <div className='flex justify-between text-sm font-medium'>
                <span>You Save</span>
                <span>-${savings.toFixed(2)}</span>
                </div>
            )} */}
        </div>

        <Separator className='my-2' />

        <div className='flex items-center justify-between text-base font-medium'>
            <span>Total</span>
            <div className='text-end'>
                <p className='text-xl font-bold'>
                <SpinningCounter value={total} decimals={2} prefix='₦' />
                </p>
                <p className='text-muted-foreground text-xs'>including VAT, if applicable</p>
            </div>
        </div>

        <div className='flex flex-col gap-3 pt-4'>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Shield className='size-4 text-green-600' aria-hidden='true' />
            <span>SSL encrypted checkout</span>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <Gavel className='size-4 text-blue-600' aria-hidden='true' />
            <span>Overstay penalty fee of ₦75 per minute</span>
          </div>
          <div className='text-muted-foreground flex items-center gap-2 text-xs'>
            <TicketX className='size-4 text-rose-600' aria-hidden='true' />
            <span>No ticket fee refund policy</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

type SpinningCounterProps = {
  value: number
  /** Fixed decimal places to format the value with, e.g. 2 for currency. */
  decimals?: number
  /** Static text rendered before the formatted value, e.g. '₦'. */
  prefix?: string
  className?: string
  digitClassName?: string
}

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

export function SpinningCounter({ value, decimals = 0, prefix, className, digitClassName }: SpinningCounterProps) {
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

/////////// Payment Form //////////

type CheckoutFormPaymentStepProps = {
  formData: CheckoutFormData
  onChange: (field: keyof CheckoutFormData, value: string | boolean) => void
  onCardNumberChange: (value: string) => void
  onExpiryChange: (value: string) => void
}

export function CheckoutFormPaymentStep({
  formData,
  onChange,
  onCardNumberChange,
  onExpiryChange,
}: CheckoutFormPaymentStepProps) {
  const [showCvv, setShowCvv] = useState(false)

  return (
    <div className='flex flex-col gap-6'>
      <FieldSet>
        <FieldLegend className='text-sm font-medium'>Payment method</FieldLegend>
        <RadioGroup defaultValue='online' className='flex flex-col gap-3'>

          <FieldLabel htmlFor='online-payment'>
            <Field orientation='horizontal' className='rounded-lg border p-4'>
              <RadioGroupItem value='online' id='online-payment' />
              <CreditCard className='text-muted-foreground size-5' aria-hidden='true' />
              <span className='flex-1'>Pay Online</span>
            </Field>
          </FieldLabel>

          <FieldLabel htmlFor='wallet-payment'>
            <Field orientation='horizontal' className='rounded-lg border p-4'>
              <RadioGroupItem value='wallet' id='wallet-payment' />
              <Wallet className='text-muted-foreground size-5' aria-hidden='true' />
              <span className='flex-1'>Pay with Wallet</span>
            </Field>
          </FieldLabel>

        </RadioGroup>
      </FieldSet>

      {/* <FieldGroup>
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
      </FieldGroup> */}
    </div>
  )
}

export function CheckoutFormProgress({ step }: { step: number }) {
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

///////////// Parking Slot Form ////////

/** Builds a 5-row level: two bay rows, a drive lane, then two more bay rows. */
function buildLevel(id: string, name: string, seed: number): ParkingLevel {
  const cols = 8;
  const bayRows = [0, 1, 3, 4];
  const letters = ["A", "B", "C", "D"];
  const spots: ParkingSpot[] = [];

  bayRows.forEach((row, i) => {
    for (let col = 0; col < cols; col++) {
      const hash = (row * 7 + col * 13 + seed * 5) % 11;
      const status: SpotStatus = hash % 3 === 0 ? "taken" : hash === 4 ? "held" : "free";
      const kind: SpotKind =
        row === 0 && col < 2 ? "ev" : col === 0 && (row === 1 || row === 3) ? "accessible" : "standard";
      spots.push({ id: `$${id}-${letters[i]}${col + 1}`, label: `${letters[i]}${col + 1}`, row, col, kind, status });
    }
  });

  return { id, name, rows: 5, cols, laneRows: [2], entrance: { row: 2, col: 0 }, entranceLabel: "Entry", spots };
}

const levels: ParkingLevel[] = [buildLevel("l1", "Level 1", 1), buildLevel("l2", "Level 2", 2), buildLevel("l3", "Level 3", 3)];

export function CheckoutFormParkingSlotStep() {
  return (
    <div>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
        <h1>Choose your spot</h1>
        <ParkingLayout
            levels={levels}
            onSelectSpot={(spot, level) => console.log("selected", spot?.label, level?.name)}
            onConfirm={(spot, level) => alert(`Reserved ${spot.label} on ${level.name}`)}
        />
        </main>
    </div>
  );
}

///////////// Shipping Form ////////////

type CheckoutFormShippingStepProps = {
  formData: CheckoutFormData
  onChange: (field: keyof CheckoutFormData, value: string) => void
}

export function CheckoutFormShippingStep({ formData, onChange }: CheckoutFormShippingStepProps) {
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
        <CheckoutFormCountryField
          id='country-bH7l52P'
          value={formData.country}
          onValueChange={value => onChange('country', value)}
        />
      </div>
    </FieldGroup>
  )
}

type CheckoutFormCountryFieldProps = {
  id: string
  value: string
  onValueChange: (value: string) => void
}

export const countryOptions = [
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
] as const

export const countryLabels: Record<string, string> = Object.fromEntries(
  countryOptions.map(country => [country.value, country.label]),
)

export function CheckoutFormCountryField({ id, value, onValueChange }: CheckoutFormCountryFieldProps) {
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