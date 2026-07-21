"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaWhatsapp } from 'react-icons/fa';

export function WhatsAppFloat({ whatsappNumber = "+212" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Clean the number (remove spaces, etc.) but keep the +
  const cleanNumber = whatsappNumber.replace(/[^\d+]/g, '');

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative group">
        {/* Pulse effect rings */}
        <div className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        <div className="absolute -inset-2 rounded-full bg-[#25D366] opacity-20 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
        
        {/* Main button */}
        <Link 
          href={`https://wa.me/${cleanNumber}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative flex items-center justify-center h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 hover:scale-110 transition-transform duration-300 z-10"
        >
          <FaWhatsapp className="h-7 w-7" />
        </Link>

        {/* Tooltip on hover */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-4 px-3 py-1.5 bg-background text-foreground text-xs font-semibold rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap border border-border/50">
          Chat with us!
        </div>
      </div>
    </div>
  );
}
