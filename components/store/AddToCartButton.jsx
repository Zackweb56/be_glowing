"use client";

import { useState } from "react";
import { MdShoppingCart as ShoppingCart } from 'react-icons/md';
import { Button } from "@/components/ui/button";

export function AddToCartButton({ product, isOutOfStock }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingItemIndex = storedCart.findIndex(item => item._id === product._id);

      if (existingItemIndex > -1) {
        storedCart[existingItemIndex].quantity += 1;
      } else {
        storedCart.push({
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0] || "",
          slug: product.slug,
          quantity: 1,
        });
      }

      localStorage.setItem("cart", JSON.stringify(storedCart));
      
      // Dispatch events to notify other components (like Navbar)
      window.dispatchEvent(new Event("cartUpdated"));
      window.dispatchEvent(new Event("storage"));

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (e) {
      console.error("Failed to add item to cart", e);
    }
  };

  return (
    <Button 
      size="lg" 
      onClick={handleAddToCart}
      className={`flex-1 rounded-full text-base h-14 transition-all duration-300 ${
        added ? "bg-emerald-600 hover:bg-emerald-600 text-white" : "bg-primary hover:bg-primary/95 text-white"
      }`} 
      disabled={isOutOfStock}
    >
      {isOutOfStock ? (
        "OutOfStock"
      ) : added ? (
        "Added to Cart!"
      ) : (
        <>
          <ShoppingCart className="mr-2 h-5 w-5" />
          Add to Cart
        </>
      )}
    </Button>
  );
}
