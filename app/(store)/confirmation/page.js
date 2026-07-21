"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdCheckCircleOutline as CheckCircle2, MdShoppingBag as ShoppingBag, MdLocalShipping as Truck, MdCalendarToday as Calendar, MdLocationOn as MapPin, MdPersonOutline as User, MdPhone as Phone } from 'react-icons/md';
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  const [order, setOrder] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const lastOrder = JSON.parse(localStorage.getItem("lastOrder"));
      setOrder(lastOrder);
    } catch (e) {
      setOrder(null);
    }
  }, []);

  if (!isMounted) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center">
        <p className="text-muted-foreground text-sm">Loading order confirmation...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">No Order Details Found</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          We couldn't find any recent order details. You can view our shop catalog to place a new order.
        </p>
        <Link href="/store">
          <Button size="lg" className="rounded-full bg-primary hover:bg-primary/95 text-white shadow-none px-8">
            Go to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 bg-background flex flex-col items-center">
      {/* Success Badge */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground mb-2">
        Thank you for your order!
      </h1>
      <p className="text-sm text-muted-foreground text-center max-w-md mb-10">
        Your order has been received successfully. Our team will contact you soon to confirm shipment.
      </p>

      {/* Details Box */}
      <div className="w-full bg-white border border-border rounded-xl p-6 sm:p-8 space-y-8">
        {/* Header summary */}
        <div className="grid grid-cols-2 gap-4 border-b border-border pb-6 text-sm">
          <div>
            <span className="text-xs text-muted-foreground block uppercase font-medium">Order Reference</span>
            <strong className="text-base text-foreground font-mono">{order.reference}</strong>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block uppercase font-medium">Payment Method</span>
            <strong className="text-sm text-foreground">Cash on Delivery</strong>
          </div>
        </div>

        {/* Customer & Shipping info */}
        <div className="space-y-4">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Shipping Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary shrink-0" />
                <span className="text-foreground font-semibold">{order.customer.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>{order.customer.phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>
                  {order.customer.address}, {order.customer.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4 border-t border-border pt-6">
          <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Ordered Items</h3>
          <div className="divide-y divide-border/50">
            {order.items.map((item) => (
              <div key={item._id} className="py-3 flex justify-between gap-4 text-sm items-center">
                <span className="text-foreground line-clamp-1 font-medium flex-1">
                  {item.name} <strong className="text-muted-foreground font-normal">x{item.quantity}</strong>
                </span>
                <span className="font-semibold text-foreground">{(item.price * item.quantity).toFixed(2)} MAD</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total info */}
        <div className="border-t border-border pt-6 flex justify-between font-bold text-base text-foreground">
          <span>Total Amount</span>
          <span className="text-primary text-lg">{order.total?.toFixed(2)} MAD</span>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/store">
          <Button size="lg" className="rounded-full bg-primary hover:bg-primary/95 text-white shadow-none px-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
