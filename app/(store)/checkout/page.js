"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdArrowBack as ArrowLeft, MdShoppingBag as ShoppingBag, MdLoop as Loader2 } from 'react-icons/md';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCart(storedCart);
    } catch (e) {
      setCart([]);
    }
  }, []);

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const validateForm = () => {
    const errs = {};
    if (!name.trim() || name.trim().length < 3) {
      errs.name = "Full name must be at least 3 characters.";
    }
    // Morocco phone validation: +212 or 0 followed by 5, 6, 7 and then 8 digits
    const moroccoPhoneRegex = /^(?:\+212|0)[5-7]\d{8}$/;
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!phone.trim() || !moroccoPhoneRegex.test(cleanPhone)) {
      errs.phone = "Please enter a valid Moroccan phone number (e.g. 0612345678 or +212612345678).";
    }
    if (!city.trim()) {
      errs.city = "City is required.";
    }
    if (!address.trim() || address.trim().length < 8) {
      errs.address = "Please enter a more detailed address (at least 8 characters).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    // TODO(security): Implement CSRF protection for checkout form submission when backend order API is added.
    // TODO(security): Implement rate limiting for checkout endpoint.

    try {
      // Mock order creation delay
      await new Promise(resolve => setTimeout(resolve, 1200));

      const orderRef = "BG-" + Math.floor(10000 + Math.random() * 90000);
      const orderData = {
        reference: orderRef,
        items: cart,
        total: getSubtotal(),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          city: city.trim(),
          address: address.trim()
        },
        timestamp: new Date().toISOString()
      };

      // Store in lastOrder for the confirmation page
      localStorage.setItem("lastOrder", JSON.stringify(orderData));
      
      // Clear cart
      localStorage.removeItem("cart");
      window.dispatchEvent(new Event("cartUpdated"));

      router.push("/confirmation");
    } catch (e) {
      // Log generic message to console, no private variables
      console.error("Order submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center">
        <p className="text-muted-foreground text-sm">Loading checkout...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center space-y-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-foreground">Your Cart is Empty</h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Please add items to your cart before proceeding to checkout.
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
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12 bg-background">
      <Link href="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
      </Link>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-10">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6 bg-white border border-border p-6 sm:p-8 rounded-xl">
          <h2 className="text-lg font-bold text-foreground pb-2 border-b border-border">Shipping Details</h2>

          <div className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="checkoutName">Full Name</Label>
              <Input
                id="checkoutName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Bennani"
                className={errors.name ? "border-destructive focus-visible:ring-destructive/30" : ""}
                required
              />
              {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="checkoutPhone">Phone Number (For delivery updates)</Label>
              <Input
                id="checkoutPhone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0612345678"
                className={errors.phone ? "border-destructive focus-visible:ring-destructive/30" : ""}
                required
              />
              {errors.phone && <p className="text-xs text-destructive font-medium">{errors.phone}</p>}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="checkoutCity">City</Label>
              <Input
                id="checkoutCity"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Casablanca"
                className={errors.city ? "border-destructive focus-visible:ring-destructive/30" : ""}
                required
              />
              {errors.city && <p className="text-xs text-destructive font-medium">{errors.city}</p>}
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="checkoutAddress">Delivery Address</Label>
              <textarea
                id="checkoutAddress"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address, building, apartment number..."
                rows={3}
                className={`w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 text-foreground ${
                  errors.address ? "border-destructive focus:ring-destructive/20" : "border-input"
                }`}
                required
              />
              {errors.address && <p className="text-xs text-destructive font-medium">{errors.address}</p>}
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={submitting} 
            className="w-full rounded-full bg-primary hover:bg-primary/95 text-white h-12 shadow-none font-semibold text-sm"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Order...
              </>
            ) : (
              "Place Order (Cash on Delivery)"
            )}
          </Button>
        </form>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1 p-6 bg-white border border-border rounded-xl space-y-6">
          <h2 className="text-lg font-bold text-foreground pb-3 border-b border-border">Order Summary</h2>

          {/* Items Preview */}
          <div className="divide-y divide-border/50 max-h-60 overflow-y-auto">
            {cart.map((item) => (
              <div key={item._id} className="py-3 flex justify-between gap-4 text-xs">
                <span className="text-muted-foreground line-clamp-1 flex-1">
                  {item.name} <strong className="text-foreground">x{item.quantity}</strong>
                </span>
                <span className="font-semibold text-foreground">{(item.price * item.quantity).toFixed(2)} MAD</span>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-3 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">{getSubtotal().toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">Free</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between font-bold text-base text-foreground">
              <span>Total</span>
              <span>{getSubtotal().toFixed(2)} MAD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
