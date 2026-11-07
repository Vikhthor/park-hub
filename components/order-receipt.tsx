"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FacebookIcon,
  LinkedinIcon,
  XIcon,
} from "./social-icons";
import { ArrowRight, Download, EllipsisVertical, Printer } from "lucide-react";

export type ReceiptItem = {
  id: string;
  image: string;
  title: string;
  description: string;
  price: number;
};

type OrderReceiptProps = {
  orderNumber?: string;
  orderDate?: string;
  shippingCost?: number;
  taxAmount?: number;
  customerName?: string;
  shippingAddress?: string;
  paymentMethod?: string;
  paymentDate?: string;
  trackingNumber?: string;
  deliveryDate?: string;
};

const formatCurrency = (value: number) =>
  Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;

const DashedDivider = () => (
  <Separator className="h-0 border-t border-dashed border-border bg-transparent" />
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full bg-muted px-4 py-1.5 sm:px-5">
    <p className="text-sm font-medium text-muted-foreground">{children}</p>
  </div>
);

const OrderReceipt = ({
  orderNumber = "RCT - 2026 - 98765",
  orderDate = "May 30, 2026",
  shippingCost = 20.25,
  taxAmount = 65,
  customerName = "Jainy Smith",
  shippingAddress = "192 Bedford Avenue,\nApt 4 block,\nBrooklyn, NY 112345,\nUnited States.",
  paymentMethod = "Visa . 3636",
  paymentDate = "Charged May 18, 2026 at 9:36 AM",
  trackingNumber = "1Z999AA10123456784",
  deliveryDate = "Delivered May 23, 2026",
}: OrderReceiptProps) => {
  const items: ReceiptItem[] = [
    {
        id: "apple-watch-s6-gps-60mm",
        image:
        "https://images.shadcnspace.com/assets/ecommerce/product-overview/product-overview-06-img-1.webp",
        title: "Apple watch S6 GPS 60MM",
        description: "Black Sport Band - M/L",
        price: 234.6,
    },
    {
        id: "beige-jacket-classic-fit",
        image:
        "https://images.shadcnspace.com/assets/ecommerce/product-overview/product-overview-01-img-1.webp",
        title: "Beige Jacket Classic Fit",
        description: "Soft Cotton Fabric",
        price: 114.2,
    },
    {
        id: "space-wireless-headphones",
        image:
        "https://images.shadcnspace.com/assets/ecommerce/product-comparison/product-comparison-1-1.webp",
        title: "Space Wireless Headphones",
        description: "Noise Canceling Feature",
        price: 306,
    },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal + shippingCost + taxAmount;

  return (
    <section className="w-full bg-background py-10 lg:py-16">
      <div className="mx-auto w-full max-w-116.5 px-4 sm:px-0">
        <div className="flex flex-col gap-3 rounded-3xl bg-muted pt-5">
          {/* header */}
          <div className="flex items-center justify-between px-5">
            <p className="text-base font-medium text-foreground">
              Order receipt
            </p>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Print receipt"
              >
                <Printer />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Download receipt"
              >
                <Download />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="More options"
              >
                <EllipsisVertical />
              </Button>
            </div>
          </div>

          {/* receipt card */}
          <div className="flex flex-col gap-6 rounded-3xl border border-border bg-background py-5 sm:py-6">
            <div className="flex items-center gap-4 px-4 sm:px-5">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="text-base font-medium text-foreground">
                  Receipt
                </p>
                <p className="text-sm text-muted-foreground">
                  {orderNumber}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-base font-medium text-foreground">Date</p>
                <p className="text-sm text-muted-foreground">{orderDate}</p>
              </div>
            </div>

            <SectionLabel>Order Summary</SectionLabel>

            <div className="flex flex-col gap-5 px-4 sm:px-5">
              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4">
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <div className="size-11 shrink-0 overflow-hidden rounded-sm bg-muted">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <p className="truncate text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm font-medium text-foreground">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                ))}
              </div>

              <DashedDivider />

              <div className="flex w-full flex-col gap-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(shippingCost)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(taxAmount)}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col gap-4">
                <DashedDivider />
                <div className="flex items-center justify-between text-base font-medium text-foreground">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SectionLabel>Ship To</SectionLabel>
              <div className="flex flex-col gap-1 px-4 sm:px-5">
                <p className="text-base font-medium text-foreground">
                  {customerName}
                </p>
                <p className="whitespace-pre-line text-sm text-muted-foreground">
                  {shippingAddress}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SectionLabel>Payment</SectionLabel>
              <div className="flex flex-col gap-1 px-4 sm:px-5">
                <p className="text-base font-medium text-foreground">
                  {paymentMethod}
                </p>
                <p className="text-sm text-muted-foreground">
                  {paymentDate}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <SectionLabel>Track Order</SectionLabel>
              <div className="flex flex-col gap-4 px-4 sm:px-5">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-base font-medium text-foreground">
                      {trackingNumber}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {deliveryDate}
                    </p>
                  </div>
                  <a
                    href="#"
                    className="inline-flex w-fit items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                  >
                    Track Shipment
                    <ArrowRight className="size-4" />
                  </a>
                </div>
                <DashedDivider />
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 px-4 sm:px-5">
              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-foreground">
                  Keep shopping with us
                </p>
                <p className="text-xs text-muted-foreground">
                  © 2026 Shadcn Space. All rights reserved
                </p>
              </div>
              <div className="flex items-center gap-3 text-foreground">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LinkedinIcon size={16} />
                </a>
                <a
                  href="#"
                  aria-label="X"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <XIcon size={16} />
                </a>
                <a
                  href="#"
                  aria-label="Facebook"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <FacebookIcon size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderReceipt;