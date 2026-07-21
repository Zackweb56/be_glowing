"use client";

import { Button } from "@/components/ui/button";
import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppOrderButton({ product, whatsappNumber, className = "", size = "lg" }) {
  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const waNumber = whatsappNumber ? whatsappNumber.replace(/[^0-9]/g, "") : "212600000000";
    const productUrl = typeof window !== 'undefined' ? `${window.location.origin}/products/${product.slug}` : '';
    
    const message = `Hello Be Glowing! I would like to order this product:
*Name*: ${product.name}
*Price*: ${product.price?.toFixed(2)} MAD
*Link*: ${productUrl}`;

    const url = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Button
      size={size}
      onClick={handleWhatsAppOrder}
      className={`rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 cursor-pointer ${className}`}
    >
      <FaWhatsapp className="h-5 w-5" />
      Order via WhatsApp
    </Button>
  );
}
