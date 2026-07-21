"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MdDeleteOutline as Trash2, MdRemove as Minus, MdAdd as Plus, MdShoppingBag as ShoppingBag, MdArrowBack as ArrowLeft } from 'react-icons/md';
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const loadCart = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
      } catch (e) {
        setCart([]);
      }
    };
    loadCart();
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cart.map(item => 
      item._id === id ? { ...item, quantity: newQty } : item
    );
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id) => {
    const updated = cart.filter(item => item._id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (!isMounted) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-16 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center">
        <p className="text-muted-foreground text-sm">Loading your cart...</p>
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
          Explore our collection of fine jewelry and accessories to find something special.
        </p>
        <Link href="/store">
          <Button size="lg" className="rounded-full bg-primary hover:bg-primary/95 text-white shadow-none px-8">
            Continue Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 sm:py-12 bg-background">
      <Link href="/store" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
      </Link>

      <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-10">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div 
              key={item._id} 
              className="flex gap-4 p-4 bg-white border border-border rounded-xl items-center"
            >
              {/* Product Thumbnail */}
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted flex items-center justify-center">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag className="h-6 w-6 text-muted-foreground/30" />
                )}
              </div>

              {/* Title & Price */}
              <div className="flex-1 min-w-0">
                <Link href={`/products/${item.slug}`} className="font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                  {item.name}
                </Link>
                <p className="text-xs text-primary font-medium mt-1">{item.price?.toFixed(2)} MAD</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-border rounded-full bg-background px-1">
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="p-1.5 hover:text-primary text-muted-foreground transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-xs font-semibold text-foreground select-none">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="p-1.5 hover:text-primary text-muted-foreground transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Total price for item */}
              <div className="text-right font-semibold text-sm text-foreground whitespace-nowrap min-w-[70px]">
                {(item.price * item.quantity).toFixed(2)} MAD
              </div>

              {/* Remove Button */}
              <button 
                onClick={() => removeItem(item._id)}
                className="p-2 hover:text-destructive text-muted-foreground transition-colors"
                aria-label="Remove item"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1 p-6 bg-white border border-border rounded-xl space-y-6">
          <h2 className="text-lg font-bold text-foreground pb-3 border-b border-border">Order Summary</h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">{getSubtotal().toFixed(2)} MAD</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span className="text-emerald-600 font-semibold">Free (Cash on Delivery)</span>
            </div>
            <div className="border-t border-border pt-4 flex justify-between font-bold text-base text-foreground">
              <span>Total</span>
              <span>{getSubtotal().toFixed(2)} MAD</span>
            </div>
          </div>

          <Link href="/checkout" className="block w-full">
            <Button className="w-full rounded-full bg-primary hover:bg-primary/95 text-white h-12 shadow-none font-semibold text-sm">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
