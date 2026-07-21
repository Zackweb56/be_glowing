"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MdBolt as Zap, MdLocalShipping as Truck, MdSecurity as Shield, MdCreditCard as CreditCard, MdHeadset as Headphones, MdAutorenew as RefreshCw } from 'react-icons/md';

// Import Swiper and its modules
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Sample portrait data (replace with your own images)
const portraits = [
  {
    id: 1,
    name: "Aurora",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face&auto=format",
    quote: "Timeless elegance meets modern edge.",
  },
  {
    id: 2,
    name: "Julian",
    role: "Brand Strategist",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format",
    quote: "Every piece tells a story of craftsmanship.",
  },
  {
    id: 3,
    name: "Maya",
    role: "Jewelry Designer",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face&auto=format",
    quote: "Inspired by nature, perfected by hand.",
  },
  {
    id: 4,
    name: "Ethan",
    role: "Art Curator",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face&auto=format",
    quote: "Luxury is in the details, and we never miss one.",
  },
  {
    id: 5,
    name: "Lila",
    role: "Fashion Stylist",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face&auto=format",
    quote: "Wearable art for the confident soul.",
  },
  {
    id: 6,
    name: "Marcus",
    role: "Product Lead",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format",
    quote: "Design that resonates with authenticity.",
  },
];

// Logo strip data
const logoStrip = [
  { name: "Vogue", icon: "✦" },
  { name: "Elle", icon: "✧" },
  { name: "Harper's", icon: "◈" },
  { name: "GQ", icon: "◇" },
  { name: "WWD", icon: "❖" },
  { name: "Cosmo", icon: "✦" },
  { name: "Vanity Fair", icon: "✧" },
  { name: "Marie Claire", icon: "◈" },
];

// Trust indicators data
const trustIndicators = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% protected checkout",
  },
  {
    icon: CreditCard,
    title: "Easy Returns",
    description: "30-day guarantee",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated customer care",
  },
  {
    icon: RefreshCw,
    title: "Ethical Sourcing",
    description: "Sustainable materials",
  },
];

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FAF8F5] border-b border-border">
      {/* Split layout: left copy + right carousel */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-12 lg:py-20">
          {/* LEFT COLUMN: Copy, CTAs, and logo strip */}
          <div className="flex flex-col space-y-6 lg:space-y-8">
            {/* Badge */}
            <Badge variant="secondary" className="w-fit gap-1.5 px-3 py-1.5 text-sm font-semibold bg-primary/10 text-primary border-none">
              <Zap className="h-3.5 w-3.5" /> New Collection 2026
            </Badge>

            {/* Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight text-foreground">
              Reveal Your <br />
              Natural <span className="text-primary italic">Glow</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-muted-foreground max-w-md">
              Premium jewelry &amp; accessories crafted to elevate your style. Discover timeless elegance designed for every occasion.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/store">
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/95 text-white shadow-none">
                  Shop Now
                </Button>
              </Link>
              <a href="#categories">
                <Button size="lg" variant="outline" className="rounded-full px-8 border-border hover:bg-muted/50 text-foreground">
                  Explore Collections
                </Button>
              </a>
            </div>

            {/* Logo strip / marquee */}
            <div className="relative w-full overflow-hidden mt-4 lg:mt-6">
              <div className="flex marquee whitespace-nowrap gap-8 py-2">
                {logoStrip.concat(logoStrip).map((brand, i) => (
                  <span key={i} className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground/80 tracking-wider uppercase">
                    <span className="text-primary/70">{brand.icon}</span>
                    {brand.name}
                  </span>
                ))}
              </div>
              {/* Gradient fades for smooth edges */}
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#FAF8F5] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#FAF8F5] to-transparent pointer-events-none" />
            </div>
          </div>

          {/* RIGHT COLUMN: Coverflow carousel with portrait cards */}
          <div className="relative flex justify-center items-center w-full aspect-[4/3] lg:aspect-auto lg:min-h-[500px] pb-12">
            <Swiper
              effect="coverflow"
              grabCursor
              centeredSlides
              slidesPerView="auto"
              coverflowEffect={{
                rotate: 0,
                stretch: 60,
                depth: 120,
                modifier: 1.2,
                slideShadows: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={{
                delay: 4000,
                disableOnInteraction: true,
              }}
              modules={[EffectCoverflow, Pagination, Autoplay]}
              className="w-full h-full [&_.swiper-pagination]:!bottom-[-30px] [&_.swiper-pagination]:!right-0 [&_.swiper-pagination]:!left-auto [&_.swiper-pagination]:!w-auto [&_.swiper-pagination-bullet]:!bg-primary/60 [&_.swiper-pagination-bullet-active]:!bg-primary [&_.swiper-pagination-bullet]:!w-2.5 [&_.swiper-pagination-bullet]:!h-2.5"
            >
              {portraits.map((person) => (
                <SwiperSlide key={person.id} className="!w-[220px] md:!w-[260px] lg:!w-[280px] !rounded-2xl">
                  <div className="group relative flex flex-col rounded-2xl bg-white shadow-lg border border-border/40 overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
                    {/* Image */}
                    <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl bg-muted">
                      <img
                        src={person.image}
                        alt={person.name}
                        className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    {/* Overlay content */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 rounded-2xl">
                      <p className="text-white/90 text-sm italic">"{person.quote}"</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-white font-semibold">{person.name}</span>
                        <span className="text-white/60 text-xs">•</span>
                        <span className="text-white/70 text-xs">{person.role}</span>
                      </div>
                    </div>
                    {/* Static badge on image */}
                    <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-0.5 text-[10px] font-medium text-primary shadow-sm">
                      ✦ Featured
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* TRUST STRIP - Bottom of hero section */}
        <div className="border-t border-border/60 py-8 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {trustIndicators.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex flex-col items-center text-center space-y-2">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CSS animation using style tag (this is safe in Client Component) */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee {
          animation: marquee 20s linear infinite;
        }
        /* Ensure all slides have rounded corners */
        .swiper-slide {
          border-radius: 1rem !important;
          overflow: hidden !important;
        }
      `}</style>
    </section>
  );
}