'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  Heart, 
  Star,
  CarFrontIcon,
  BusFrontIcon,
  TicketIcon,
  ThumbsUp, 
  MessageCircle, 
  Calendar,
  ArrowRight,
  Accessibility,
  Wifi,
  ShieldCheck,
  Lightbulb,
  Cctv,
  EvCharger,
  Pencil,
  ShoppingCart,
  X,
} from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { Badge } from "@/components/reui/badge"
import { Rating } from "@/components/reui/rating"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export interface Park {
  id: string
  name: string
  address: string
  description: string
  status: string
  price: number
  price_unit: string
  currency: string
  rating: number
  available_slots: number
  total_slots: number
  images: {
    id: number
    src: string
    alt: string
  }[]
  vehicle_types: string[]
  sizes: number[]
  colors: {
    name: string
    value: string
  }[]
}

export const parkDetails: Park = {
  id: 'high-tops-black',
  name: 'Lagos City Park 1',
  address: "404 Not found",
  description: 'Running sneakers with thin elastic laces.',
  status: "Open",
  price: 450,
  price_unit: "hour",
  currency: '₦',
  rating: 4,
  available_slots: 10,
  total_slots: 15,
  images: [
    {
      id: 1,
      src: 'https://african.land/oc-content/plugins/blog/img/blog/1096.jpg',
      alt: 'Black technical knit fabric high-tops - View 1',
    },
    {
      id: 2,
      src: 'https://businesspost.ng/wp-content/uploads/2021/12/Car-Park-Facility.jpg',
      alt: 'Black technical knit fabric high-tops - View 2',
    },
    {
      id: 3,
      src: 'https://services.travo.ng/wp-content/uploads/2026/07/iStock-1406358305.jpg',
      alt: 'Black technical knit fabric high-tops - View 3',
    },
    {
      id: 4,
      src: 'https://global.ariseplay.com/amg/www.arise.tv/uploads/2021/11/MMA2-Parking.jpg',
      alt: 'Black technical knit fabric high-tops - View 4',
    },
  ],
  vehicle_types: ["car", "bus"],
  sizes: [37, 38, 39, 40, 41],
  colors: [
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#6B7280' },
  ],
}

export function ParkOverview() {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedType, setSelectedType] = useState<string>(parkDetails.vehicle_types[0])
  const [selectedColor, setSelectedColor] = useState(parkDetails.colors[0])
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!carouselApi) return

    // Set carousel to the selected image
    carouselApi.scrollTo(selectedImage)

    // Update selected image when carousel changes
    const handleSelect = () => {
      const currentIndex = carouselApi.selectedScrollSnap()
      setSelectedImage(currentIndex)
    }

    carouselApi.on('select', handleSelect)
    return () => {
      carouselApi.off('select', handleSelect)
    }
  }, [carouselApi, selectedImage])

  return (
    <div>
      {/* Product Details */}
      <section className='@container mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 gap-6 py-4 lg:grid-cols-2 lg:gap-8 lg:py-6 xl:grid-cols-3 xl:gap-12 xl:py-12'>
          {/* Product Info */}
          <div className='flex flex-col justify-between gap-6 lg:gap-8'>
            <div className='flex flex-col gap-2 lg:gap-4'>
              {/* <span className='text-sm font-semibold tracking-wide uppercase'>{parkDetails.brand} —</span> */}
              <h2 className='text-xl font-bold tracking-tight text-balance lg:text-3xl'>{parkDetails.name}</h2>
              <Badge variant={parkDetails.status === "Open"? "success-light": "secondary"} size="lg">
                {parkDetails.status}
              </Badge>
              <p className='text-muted-foreground text-balance'>{parkDetails.address}</p>
              <p className='text-2xl font-bold tracking-tight'>
                {parkDetails.currency}{parkDetails.price} <span className="text-muted-foreground">/ {parkDetails.price_unit}</span>
              </p>
            </div>

            {/* Thumbnails */}
            <div className='flex flex-wrap gap-4'>
              {parkDetails.images.map((image, index) => (
                <div
                  key={image.id}
                  onMouseEnter={() => setSelectedImage(index)}
                  className={cn(
                    'ring-offset-background size-16 cursor-pointer overflow-hidden rounded-sm ring-offset-2 transition-all lg:size-18',
                    selectedImage === index && 'ring-foreground ring-2',
                  )}
                >
                  <img src={image.src} alt={image.alt} className='size-full object-cover' />
                </div>
              ))}
            </div>
          </div>

          {/* Main Image */}
          <div className='row-span-2 row-start-1 '>
            <Carousel setApi={setCarouselApi} className='w-full'>
              <CarouselContent>
                {parkDetails.images.map(image => (
                  <CarouselItem key={image.id}>
                    <img src={image.src} alt={image.alt} className='w-full h-90 rounded-lg object-cover' />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          {/* Product Attributes */}
          <div className='flex flex-col gap-6 lg:gap-10'>
            {/* Size Selection */}
            <div className='flex flex-col gap-2'>
              {/* <h3 className='font-bold'>Sizes</h3> */}
              <h3 className='font-bold'>Vehicle Type</h3>
              <div className='flex flex-wrap gap-3'>
                {/* {parkDetails.sizes.map(size => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    className="h-9 px-4 py-2 size-12 cursor-pointer rounded-full p-0"
                  >
                    {size}
                  </Button>
                ))} */}
                <ToggleGroup defaultValue={[selectedType]} variant="outline">
                  {parkDetails.vehicle_types.map(vehicleType => {
                    return (
                      <ToggleGroupItem 
                        value={vehicleType}
                        aria-label={vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}
                        onClick={() => setSelectedType(vehicleType)}
                        disabled={selectedType === vehicleType}
                      >
                        {vehicleType === "car"? (
                          <>
                            <CarFrontIcon />
                            Car
                          </>
                        ): (
                          <>
                            <BusFrontIcon />
                            Bus
                          </>
                        )}
                        
                      </ToggleGroupItem>
                    )
                  })}
                </ToggleGroup>
              </div>
            </div>

            {/* Color Selection */}
            <div className='flex flex-col gap-2'>
              <h3 className='font-bold'>Capacity</h3>
              <div className='flex gap-3'>
                {parkDetails.total_slots} slots ({parkDetails.available_slots} left)
                {/* {parkDetails.colors.map(color => (
                  <Button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={cn('h-9 px-4 py-2',
                      'ring-offset-background size-8 cursor-pointer rounded-full ring-offset-2 transition-all',
                      selectedColor.name === color.name && 'ring-foreground ring-2',
                      selectedColor.name !== color.name &&
                        ['Black', 'White'].includes(color.name) &&
                        'outline-muted outline-solid',
                    )}
                    style={{ backgroundColor: color.value }}
                    aria-label={`Select ${color.name} color`}
                  />
                ))} */}
              </div>
            </div>

            {/* Rating */}
            <div className='flex flex-col gap-2'>
              <h3 className='font-bold'>Rating</h3>
              <div className='flex gap-1'>
                {/* {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className='text-foreground size-5'
                    fill={i < parkDetails.rating ? 'currentColor' : 'none'}
                  />
                ))} */}
                <Rating rating={parkDetails.rating} showValue={true} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex gap-4'>
              <Button 
                className="h-10 px-8 flex-1 cursor-pointer rounded-sm bg-[#fcad03] hover:bg-[#a88420]" 
                size='lg'
                render={(<a href="/checkout"/>)}
              >
                <TicketIcon aria-hidden="true" />
                Make Reservation
              </Button>
              {/* <Button
                variant='outline'
                size='icon'
                className="size-9 rounded-full cursor-pointer"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <ProductOverview1ReactionToggle active={isWishlisted} icon={Heart} iconClassName='size-5' activeColorClassName='text-primary' />
              </Button> */}
            </div>
          </div>
        </div>

        <div className='justify-center'>
          <OverviewTabs/>
        </div>
      </section>
    </div>
  )
}

export default ParkOverview

interface Review {
  id: number
  userName: string
  userAvatar: string
  date: string
  rating: number
  content: string
  likes?: number
  comments?: number
}

interface Amenity {
  id: string
  name: string
  courses: string
  icon: 'Cctv' | 'ShieldCheck' | 'Accessibility' | 'EvCharger' | 'Wifi' | 'ShoppingCart'
}

export function OverviewTabs() {
  const reviews: Review[] = [
    {
      id: 1,
      userName: 'Emma Davis',
      userAvatar: 'https://notion-avatars.netlify.app/api/avatar?preset=female-1',
      date: '20 Mar, 2024',
      rating: 5,
      content:
        "I was blown away by the quality of this product. It's clear that a lot of thought and care went into its design. The attention to detail is remarkable, and it's been an absolute pleasure to use. I've already recommended it to several friends who are equally impressed with their purchases.",
      likes: 8,
      comments: 2,
    },
    {
      id: 2,
      userName: 'Anuj Mishra',
      userAvatar: 'https://notion-avatars.netlify.app/api/avatar?preset=male-1',
      date: '16 Dec, 2023',
      rating: 5,
      content:
        "The customer service experience was exceptional from start to finish. When I had questions about my order, the team responded promptly and went above and beyond to ensure I was completely satisfied. It's rare to find such dedication to customer happiness these days.",
      likes: 10,
      comments: 5,
    },
    {
      id: 3,
      userName: 'Robert Karmazov',
      userAvatar: 'https://notion-avatars.netlify.app/api/avatar?preset=male-2',
      date: '24 Oct, 2023',
      rating: 5,
      content:
        "I was hesitant about the price at first, but after using this product for several weeks, I can confidently say it's worth every penny. The quality and durability are outstanding, and it's made a noticeable difference in my daily routine. I'm already planning to purchase more items from this store.",
      likes: 4,
      comments: 0,
    },
    {
      id: 4,
      userName: 'Sophia Chen',
      userAvatar: 'https://notion-avatars.netlify.app/api/avatar?preset=female-2',
      date: '15 May, 2024',
      rating: 4,
      content:
        "This is a fantastic product that has really improved my daily routine. The quality is excellent and it's very user-friendly. The only reason I'm not giving it 5 stars is that I wish it came in more color options. Other than that, it's been a great purchase and I would definitely recommend it to others.",
      likes: 6,
      comments: 1,
    },
  ]

  const amenities: Amenity[] = [
    { id: '1', name: 'CCTV surveillance', courses: '', icon: 'Cctv' },
    { id: '2', name: '24/7 Security', courses: '', icon: 'ShieldCheck' },
    { id: '3', name: 'Accessibility Parking', courses: '', icon: 'Accessibility' },
    { id: '4', name: 'EV Charging', courses: '', icon: 'EvCharger' },
    { id: '5', name: 'Wifi', courses: '', icon: 'Wifi' },
    { id: '6', name: 'Marketplace', courses: '', icon: 'ShoppingCart' }
  ]

  const parkDetails = [
    {
      type: "description",
      value: ""
    },
    {
      type: "opening_time",
      value: ""
    },
    {
      type: "closing_time",
      value: ""
    },
    {
      type: "minimum_reservation_duration",
      value: ""
    },
    {
      type: "maximum_reservation_duration",
      value: ""
    },
    {
      type: "notes",
      value: ""
    }
  ]

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="overview">
        <TabsList variant="line" className="mb-3.5 w-full">
          <TabsTrigger value="overview" className="gap-2">
            Overview
            {/* <Badge variant="primary-light" size="sm">
              12
            </Badge> */}
          </TabsTrigger>
          <TabsTrigger value="amenities" className="gap-2">
            Amenities
            {/* <Badge variant="info-light" size="sm">
              3
            </Badge> */}
          </TabsTrigger>
          <TabsTrigger value="reviews" className="gap-2">
            Reviews
          </TabsTrigger>
          {/* <TabsTrigger value="spam" className="gap-2">
            Spam
            <Badge variant="destructive-light" size="sm">
              24
            </Badge>
          </TabsTrigger> */}
        </TabsList>
        <TabsContent value="overview">
          <Card>
            <CardContent>
              {parkDetails.length? (
                <Overview/>
              ):(<span>No park description.</span>)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="amenities">
          <Card>
            <CardContent>
              {/* <div className='grid grid-cols-1 gap-6 py-4 lg:grid-cols-2 lg:gap-8 lg:py-6 xl:grid-cols-3 xl:gap-12 xl:py-12'>
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
              </div> */}
              {amenities.length? (
                <Amenities amenities={amenities}/>
              ):(<span>No amenities specified.</span>)}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reviews">
          <Card>
            <CardContent>
              {reviews.length? (
                <Reviews reviews={reviews}/>
              ):(<span>No reviews yet.</span>)}
            </CardContent>
          </Card>
        </TabsContent>
        {/* <TabsContent value="spam">
          <Card>
            <CardContent>24 spam messages detected.</CardContent>
          </Card>
        </TabsContent> */}
      </Tabs>
    </div>
  )
}

/////////// Reviews Tab ////////////

interface ParkData {
  pageTitle: string
  pageDescription: string
  formTitle: string
  formDescription: string
  nameLabel: string
  emailLabel: string
  reviewLabel: string
  namePlaceholder: string
  emailPlaceholder: string
  reviewPlaceholder: string
  submitButtonText: string
  submittingButtonText: string
}

export function Reviews({ reviews }: {reviews: Review[]}) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({})
  const reviewsPerPage = 2 // Show only 2 reviews per page

  const storeData: ParkData = {
    pageTitle: 'Customer Reviews',
    pageDescription: 'Read what our customers have to say about their experience with our products and services.',
    formTitle: 'Submit Your Review',
    formDescription: 'Share your experience with our community',
    nameLabel: 'Name',
    emailLabel: 'Email',
    reviewLabel: 'Write Your Review',
    namePlaceholder: 'John Doe',
    emailPlaceholder: 'mail@example.com',
    reviewPlaceholder: 'Write here...',
    submitButtonText: 'Submit Review',
    submittingButtonText: 'Submitting...',
  }

  // Calculate pagination
  const totalPages = Math.ceil(reviews.length / reviewsPerPage)
  const currentReviews = useMemo<Review[]>(() => {
    const startIndex = (currentPage - 1) * reviewsPerPage
    const endIndex = startIndex + reviewsPerPage
    return reviews.slice(startIndex, endIndex)
  }, [currentPage, reviewsPerPage])

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold">{storeData.pageTitle}</h1>
        <p className="text-muted-foreground mx-auto mt-2 max-w-2xl">{storeData.pageDescription}</p>
      </div> */}

      <div className="gap-8">
        <div className="flex flex-col gap-6">
          <ScrollArea>
            {currentReviews.map(review => (
              <Card key={review.id} className="transition-all hover:shadow-md m-2">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="bg-muted size-12">
                        <AvatarImage src={review.userAvatar} alt={`${review.userName}'s avatar`} />
                        <AvatarFallback>{review.userName.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{review.userName}</h3>
                        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-sm">
                          <div className="flex" aria-label={`Rated ${review.rating} out of 5`}>
                            {Array(5)
                              .fill(0)
                              .map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    'size-4',
                                    i < review.rating
                                      ? 'fill-foreground text-foreground'
                                      : 'text-foreground fill-transparent'
                                  )}
                                />
                              ))}
                          </div>
                          <span>•</span>
                          <time
                            dateTime={new Date(review.date).toISOString().split('T')[0]}
                            className="flex items-center"
                          >
                            <Calendar className="me-1 size-3" />
                            {review.date}
                          </time>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">{review.content}</p>
                  <div className="mt-4 flex gap-4">
                    {/* <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsLiked(prev => ({ ...prev, [review.id]: !prev[review.id] }))}
                      className="h-8 px-3 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                      aria-label={`${isLiked[review.id] ? 'Unlike' : 'Like'} this review`}
                    >
                      <ReviewRating1ReactionToggle active={!!isLiked[review.id]} icon={ThumbsUp} iconClassName='size-4' activeColorClassName='text-primary' />
                      <span>{(review.likes ?? 0) + (isLiked[review.id] ? 1 : 0)}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary cursor-pointer"
                      aria-label="View comments"
                    >
                      <MessageCircle className="size-4" />
                      <span>{review.comments}</span>
                    </Button> */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </ScrollArea>
          {totalPages > 1 ? (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      onClick={() => setCurrentPage(i + 1)}
                      isActive={currentPage === i + 1}
                      className="cursor-pointer"
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          ) : null}
        </div>

        {/* <ReviewRating1ReviewForm storeData={storeData} /> */}
      </div>
    </div>
  )
}

////////// Amenity Tab ////////////

const amenityIcons = {
  Cctv,
  ShieldCheck,
  Accessibility,
  EvCharger,
  Wifi,
  ShoppingCart
} as const

export function Amenities({ className, amenities }: { className?: string; amenities: Amenity[] }) {
  return (
    <section className={cn('relative w-full py-12 md:py-16 lg:py-20', className)}>
      <div className='relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* <header className='mx-auto mb-12 max-w-5xl'>
          <div className='flex flex-col items-center justify-between gap-6 md:flex-row md:items-start md:text-start'>
            <div className='flex flex-col gap-4 items-center md:items-start text-center md:text-start'>
              <div className='inline-flex'>
                <span className='bg-secondary/80 text-secondary-foreground rounded-full px-4 py-1.5 text-sm font-medium'>
                  Course List
                </span>
              </div>
              <div className='flex flex-col gap-2'>
                <h2 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>Popular Courses</h2>
                <p className='text-muted-foreground max-w-2xl'>
                  Explore our wide range of courses designed to help you achieve your learning goals.
                </p>
              </div>
            </div>
            <Button className="h-10 px-4 cursor-pointer whitespace-nowrap" size='lg'>
              View All Courses
              <ArrowRight />
            </Button>
          </div>
        </header> */}

        <div className='mx-auto grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {amenities.map(amenity => {
            const Icon = amenityIcons[amenity.icon] ?? X
            return (
              <Card
                key={amenity.id}
                className='group relative overflow-hidden shadow-xs transition-all hover:shadow-md py-6 px-2'
              >
                <CardContent>
                  <div className='flex flex-col gap-4'>
                    <div className='bg-secondary/80 text-secondary-foreground flex size-12 items-center justify-center rounded-lg'>
                      <Icon className='size-5' strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className='text-foreground text-lg font-semibold'>{amenity.name}</h3>
                      <p className='text-muted-foreground text-sm'>{amenity.courses}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

///////// Overview Tab ///////////

const nestedItems = [
  {
    value: "sub-item-1",
    trigger: "Parking Hours",
    content:
      "Opening Time: 8:00AM. Closing Time 11:00PM",
  },
  {
    value: "sub-item-2",
    trigger: "Reservation Period",
    content:
      "Minimum reservation period: 1 hour. Maximum reservation period: 5 hours",
  },
]

const mainItems = [
  {
    value: "park-info",
    trigger: "Park Overview",
    content:
      "This product is designed for high-performance enterprise environments requiring maximum reliability.",
  },
  {
    value: "details",
    trigger: "Additional Details",
    isNested: true,
  },
  {
    value: "policy",
    trigger: "Parking Policy",
    content:
      "Vehicles parked at owners risk. No parking fee refund. Overstay penalty is NGN 50 per minute",
  },
]

export function Overview() {
  return (
    <div className="mx-auto mb-auto w-full">
      <Accordion
        multiple={false}
        defaultValue={["details"]}
        className="space-y-2 border-none"
      >
        {mainItems.map((item) => (
          <AccordionItem
            key={item.value}
            value={item.value}
            className="border-border rounded-lg border bg-transparent px-4"
          >
            <AccordionTrigger className="items-center py-3 font-medium hover:no-underline">
              {item.trigger}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground h-auto">
              {item.isNested ? (
                <Accordion
                  multiple={false}
                  defaultValue={["sub-item-1"]}
                  className="space-y-2 border-none"
                >
                  {nestedItems.map((subItem) => (
                    <AccordionItem
                      key={subItem.value}
                      value={subItem.value}
                      className="border-border rounded-lg border bg-transparent px-3"
                    >
                      <AccordionTrigger className="text-foreground items-center py-3 font-medium hover:no-underline">
                        {subItem.trigger}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm">
                        {subItem.content}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              ) : (
                item.content
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
