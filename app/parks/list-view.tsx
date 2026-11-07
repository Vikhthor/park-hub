"use client"

import { Badge } from "@/components/reui/badge"
import { useState } from 'react'
import { 
    ChevronDown, 
    Search, 
    SlidersHorizontal, 
    X,
    CarFrontIcon,
    BusFrontIcon
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item"
import { IconTile } from "@/components/reui/icon-tile"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { RouteIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'

export function ParkList() {
    const router = useRouter();
    const openPark = ()=>{
        router.push('/park')
    }

    const parks = [
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Closed",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        },
        {
            "name": "Lagos City Park 1",
            "description": "",
            "images": [],
            "rating": 4,
            "address": "404 Not found",
            "geolocation": {
                longitude: 0,
                lattitude: 0
            },
            "price": 300,
            "price_unit": "hour",
            "currency": "NGN",
            "status": "Open",
            "reviews": [
                {
                    "rating": 4,
                    "comment": ""
                }
            ],
            available_slots: 10,
            total_slots: 15,
            supported_vehicles: ["car","bus","truck","trailer"]
        }
    ]

    return (
        <div className="flex flex-col gap-3 m-6">
            <ParkFilter/>
            <ScrollArea 
                className="h-dvh"
            >
                {parks.map((park)=>{
                    const occupancyRate = (park.available_slots/park.total_slots)*100
                    return (
                        <Item 
                            variant="outline" 
                            // onClick={()=>{openPark()}} 
                            render={<a href="/park" />}
                            className="my-2"
                        >
                            <ItemHeader>
                            <div className="flex items-center gap-2">
                                <RouteIcon  className="text-muted-foreground size-3.5" aria-hidden="true" />
                                <span className="text-muted-foreground text-xs">68km</span>|
                                <span className="text-muted-foreground text-xs">{`₦${park.price} per ${park.price_unit}`}</span>
                            </div>
                            <Badge variant={park.status === "Open"? "success-light": "secondary"} size="xs">
                                {park.status}
                            </Badge>
                            </ItemHeader>
                            <ItemContent>
                            <ItemTitle>{park.name}</ItemTitle>
                            <ItemDescription>
                                {park.address}
                            </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                            <Button variant="outline" size="sm">
                                View
                            </Button>
                            </ItemActions>
                            <ItemFooter>
                            {/* <AvatarGroup>
                                <Avatar size="sm">
                                <AvatarImage
                                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80"
                                    alt="SC"
                                />
                                <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                                <Avatar size="sm">
                                <AvatarImage
                                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=96&h=96&dpr=2&q=80"
                                    alt="AJ"
                                />
                                <AvatarFallback>AJ</AvatarFallback>
                                </Avatar>
                                <Avatar size="sm">
                                <AvatarImage
                                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&dpr=2&q=80"
                                    alt="EP"
                                />
                                <AvatarFallback>EP</AvatarFallback>
                                </Avatar>
                            </AvatarGroup> */}
                            <div className="flex items-center justify-center gap-3">
                                <IconTile
                                    aria-hidden="true"
                                    className="border-primary/10 bg-primary/10 text-primary dark:border-primary/25 dark:bg-primary/15"
                                >
                                    <CarFrontIcon />
                                </IconTile>
                                <IconTile
                                    aria-hidden="true"
                                    className="border-primary/10 bg-primary/10 text-primary dark:border-primary/25 dark:bg-primary/15"
                                >
                                    <BusFrontIcon />
                                </IconTile>
                            </div>
                            <div className="flex items-center gap-2">
                                <Progress value={occupancyRate} className="w-20" />
                                <span className="text-muted-foreground text-xs">{park.total_slots-park.available_slots} of {park.total_slots} slots available</span>
                            </div>
                            </ItemFooter>
                        </Item>
                    )
                })}
            </ScrollArea>
        </div>
    )
}

///////// Park Filters ////////

export interface Category {
  id: string
  name: string
  count: number
}

export interface PriceRange {
  id: string
  label: string
  min: number
  max: number | null
}

export interface SortOption {
  id: string
  label: string
}

export const categories: Category[] = [
  { id: 'all', name: 'All Parks', count: 1247 },
  { id: 'car', name: 'Car', count: 97 },
  { id: 'ev', name: 'Electric Vehicle', count: 324 },
  { id: 'accessible', name: 'Accessible', count: 189 },
  { id: 'truck', name: 'Truck', count: 156 },
  { id: 'bus', name: 'Bus', count: 134 },
  { id: 'trailer', name: 'Trailer', count: 78 },
]

export const priceRanges: PriceRange[] = [
  { id: 'all', label: 'All Prices', min: 0, max: null },
  { id: 'under-500', label: 'Under ₦500', min: 0, max: 500 },
  { id: '500-1000', label: '₦500 - ₦1000', min: 500, max: 1000 },
  { id: '1000-3000', label: '₦1000 - ₦3000', min: 1000, max: 3000 },
  { id: 'over-3000', label: 'Over ₦3000', min: 3000, max: null },
]

export const sortOptions: SortOption[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'rating', label: 'Customer Rating' },
]

export function ParkFilter() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [selectedSort, setSelectedSort] = useState('featured')
  const [searchQuery, setSearchQuery] = useState('')

  const activeFilters = []
  if (selectedCategory !== 'all') {
    const category = categories.find(c => c.id === selectedCategory)
    if (category) activeFilters.push({ type: 'category', label: category.name, value: selectedCategory })
  }
  if (selectedPriceRange !== 'all') {
    const priceRange = priceRanges.find(p => p.id === selectedPriceRange)
    if (priceRange) activeFilters.push({ type: 'price', label: priceRange.label, value: selectedPriceRange })
  }
  if (searchQuery) {
    activeFilters.push({ type: 'search', label: `"${searchQuery}"`, value: searchQuery })
  }

  const clearFilter = (type: string) => {
    if (type === 'category') setSelectedCategory('all')
    if (type === 'price') setSelectedPriceRange('all')
    if (type === 'search') setSearchQuery('')
  }

  const clearAllFilters = () => {
    setSelectedCategory('all')
    setSelectedPriceRange('all')
    setSearchQuery('')
  }

  return (
    <section className="py-2">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* <div className="mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-balance">Product Catalog</h2>
          <p className="text-muted-foreground mt-2">
            Browse our collection of {categories.find(c => c.id === selectedCategory)?.count || 1247} products
          </p>
        </div> */}

        <div className="mb-6 flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative max-w-md flex-1">
              <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                placeholder="Search location..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" className="h-9 px-4 py-2 w-full cursor-pointer sm:w-auto" />}>
                <SlidersHorizontal data-icon="inline-start" />
                  Sort: {sortOptions.find(s => s.id === selectedSort)?.label}
                  <ChevronDown data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {sortOptions.map(option => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => setSelectedSort(option.id)}
                    className={selectedSort === option.id ? 'bg-accent' : ''}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex flex-wrap gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 px-3 text-xs cursor-pointer" />}>
                Category: {categories.find(c => c.id === selectedCategory)?.name}
                <ChevronDown data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {categories.map(category => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? 'bg-accent' : ''}
                  >
                    <div className="flex w-full items-center justify-between">
                      <span>{category.name}</span>
                      <Badge variant="secondary" className="px-2.5 py-0.5 font-semibold text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" size="sm" className="h-8 px-3 text-xs cursor-pointer" />}>
                Price: {priceRanges.find(p => p.id === selectedPriceRange)?.label}
                <ChevronDown data-icon="inline-end" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {priceRanges.map(range => (
                  <DropdownMenuItem
                    key={range.id}
                    onClick={() => setSelectedPriceRange(range.id)}
                    className={selectedPriceRange === range.id ? 'bg-accent' : ''}
                  >
                    {range.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {activeFilters.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground text-sm font-medium">Active filters:</span>
              {activeFilters.map(filter => (
                <Badge key={filter.type} variant="secondary" className="px-2.5 py-0.5 font-semibold">
                  {filter.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs h-auto cursor-pointer !p-1 text-inherit"
                    onClick={() => clearFilter(filter.type)}
                  >
                    <X className="size-3" />
                  </Button>
                </Badge>
              ))}
              <DropdownMenuSeparator className="mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-3 text-xs text-muted-foreground h-auto cursor-pointer p-1.5 text-xs"
              >
                Clear all
              </Button>
            </div>
          ) : null}
        </div>

        {/* <div className="bg-muted/50 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Showing {categories.find(c => c.id === selectedCategory)?.count || 1247} results</span>
              {searchQuery && <span className="text-muted-foreground text-sm">for "{searchQuery}"</span>}
            </div>
            <div className="text-muted-foreground text-xs">Sorted by {sortOptions.find(s => s.id === selectedSort)?.label}</div>
          </div>
        </div> */}
      </div>
    </section>
  )
}
