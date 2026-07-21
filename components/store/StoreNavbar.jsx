"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MdShoppingBag as ShoppingBag, MdSearch as Search, MdMenu as Menu, MdClose as X, MdHome as Home, MdStore as Store, MdMailOutline as Mail } from 'react-icons/md';
import { FaInstagram, FaFacebook, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export function StoreNavbar({ logoUrl = "", storeName = "BE GLOWING", socialLinks = {} }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const count = storedCart.reduce((total, item) => total + (item.quantity || 0), 0);
        setCartCount(count);
      } catch (e) {
        setCartCount(0);
      }
    };
    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  // Fetch suggestions with debounce
  const fetchSuggestions = useCallback((query) => {
    clearTimeout(debounceRef.current);
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const res = await fetch(`/api/store/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setSuggestions(data.results);
          setShowSuggestions(data.results.length > 0);
        }
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);
  }, []);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchSuggestions(val);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/store?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSuggestions([]);
      setShowSuggestions(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSuggestionClick = (slug) => {
    router.push(`/products/${slug}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    setMobileMenuOpen(false);
  };

  const SearchInput = ({ className = "", inputClassName = "", mobile = false }) => (
    <div ref={!mobile ? searchContainerRef : undefined} className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="flex items-center animate-in slide-in-from-right-4 fade-in duration-200">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={handleSearchChange}
          onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
          autoFocus
          className={`h-9 rounded-l-full border border-r-0 border-input bg-background px-3 text-sm outline-none focus:ring-1 focus:ring-primary ${inputClassName}`}
        />
        <button
          type="submit"
          className="h-9 px-3 rounded-r-full border border-l-0 border-input bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
        >
          {loadingSuggestions
            ? <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin block" />
            : <Search className="h-4 w-4" />
          }
        </button>
        <button
          type="button"
          onClick={() => { setIsSearchOpen(false); setSuggestions([]); setShowSuggestions(false); setSearchQuery(''); }}
          className="ml-2 p-1 text-muted-foreground hover:text-foreground cursor-pointer hover:scale-110 transition-transform"
        >
          <X className="h-4 w-4" />
        </button>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 left-0 w-full min-w-[280px] bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {suggestions.map((item) => (
            <button
              key={item._id}
              onClick={() => handleSuggestionClick(item.slug)}
              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-muted/60 text-left transition-colors group"
            >
              {item.image ? (
                <div className="h-9 w-9 rounded-md overflow-hidden bg-muted shrink-0">
                  <Image src={item.image} alt={item.name} width={36} height={36} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="h-9 w-9 rounded-md bg-muted shrink-0 flex items-center justify-center">
                  <Search className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{item.name}</p>
                {item.price && (
                  <p className="text-xs text-muted-foreground">{item.price} MAD</p>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const LogoContent = () => logoUrl ? (
    <Image src={logoUrl} alt={storeName} width={180} height={100} className="h-12 w-auto object-contain" priority />
  ) : (
    <span className="font-bold text-xl tracking-tighter uppercase text-primary">{storeName}</span>
  );

  return (
    <>
      <header className={`sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'}`}>
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 relative">
          {/* Logo - Left */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center">
              <LogoContent />
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-semibold absolute left-1/2 transform -translate-x-1/2">
            <Link href="/" className="transition-colors hover:text-primary text-foreground/70">Home</Link>
            <Link href="/store" className="transition-colors hover:text-primary text-foreground/70">Shop</Link>
            <Link href="/contact" className="transition-colors hover:text-primary text-foreground/70">Contact</Link>
          </nav>

          {/* Icons - Right */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Desktop Search */}
            <div className="hidden md:block">
              {isSearchOpen ? (
                <SearchInput inputClassName="w-48" />
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-muted-foreground hover:text-primary cursor-pointer hover:scale-110 transition-transform"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart">
              <button className="relative p-2 text-muted-foreground hover:text-primary cursor-pointer hover:scale-110 transition-transform">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground transform translate-x-1/4 -translate-y-1/4">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground hover:text-foreground relative z-50 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search - Below Navbar */}
        {isSearchOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur border-b border-border/40 animate-in slide-in-from-top duration-200">
            <div className="container mx-auto px-4 py-3">
              <div ref={searchContainerRef} className="relative">
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                  <div className="relative flex-1 flex items-center rounded-full border border-input bg-muted/50 focus-within:ring-1 focus-within:ring-primary transition-all">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                      autoFocus
                      className="w-full h-11 bg-transparent px-4 text-base outline-none rounded-l-full"
                    />
                    <button type="submit" className="h-11 px-4 flex items-center justify-center text-muted-foreground hover:text-primary shrink-0">
                      {loadingSuggestions
                        ? <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin block" />
                        : <Search className="h-5 w-5" />
                      }
                    </button>
                  </div>
                  <button type="button" onClick={() => { setIsSearchOpen(false); setSuggestions([]); setShowSuggestions(false); setSearchQuery(''); }} className="p-2 text-muted-foreground cursor-pointer shrink-0">
                    <X className="h-5 w-5" />
                  </button>
                </form>
                {/* Mobile Suggestions */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 right-0 bg-background border border-border rounded-xl shadow-xl z-50 overflow-hidden">
                    {suggestions.map((item) => (
                      <button key={item._id} onClick={() => handleSuggestionClick(item.slug)} className="w-full flex items-center gap-3 px-3 py-3 hover:bg-muted/60 text-left transition-colors">
                        {item.image ? (
                          <div className="h-10 w-10 rounded-md overflow-hidden bg-muted shrink-0">
                            <Image src={item.image} alt={item.name} width={40} height={40} className="object-cover w-full h-full" />
                          </div>
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-muted shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          {item.price && <p className="text-xs text-muted-foreground">{item.price} MAD</p>}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Full Screen Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative z-40 h-full w-full bg-background/95 backdrop-blur animate-in slide-in-from-right duration-300">
            <div className="flex flex-col h-full">
              {/* Menu Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-border/40">
                <form onSubmit={handleSearch} className="flex-1 flex items-center">
                  <div className="relative flex-1 flex items-center rounded-full border border-input bg-muted/50 focus-within:ring-1 focus-within:ring-primary transition-all">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="w-full h-10 bg-transparent px-4 text-sm outline-none rounded-l-full"
                    />
                    <button type="submit" onClick={() => setMobileMenuOpen(false)} className="h-10 px-3 flex items-center justify-center text-muted-foreground hover:text-primary shrink-0">
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="relative p-2 text-muted-foreground hover:text-primary transition-colors shrink-0">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground transform translate-x-1/4 -translate-y-1/4">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="text-muted-foreground hover:text-foreground shrink-0">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Menu Links */}
              <div className="flex-1 overflow-y-auto px-6 py-8">
                <nav className="flex flex-col gap-2">
                  <Link href="/" className="flex items-center gap-4 px-4 py-4 text-lg font-medium rounded-xl transition-all hover:bg-accent hover:text-primary text-foreground/80" onClick={() => setMobileMenuOpen(false)}>
                    <Home className="h-5 w-5" /> Home
                  </Link>
                  <Link href="/store" className="flex items-center gap-4 px-4 py-4 text-lg font-medium rounded-xl transition-all hover:bg-accent hover:text-primary text-foreground/80" onClick={() => setMobileMenuOpen(false)}>
                    <Store className="h-5 w-5" /> Shop
                  </Link>
                  <Link href="/contact" className="flex items-center gap-4 px-4 py-4 text-lg font-medium rounded-xl transition-all hover:bg-accent hover:text-primary text-foreground/80" onClick={() => setMobileMenuOpen(false)}>
                    <Mail className="h-5 w-5" /> Contact
                  </Link>
                </nav>
              </div>

              {/* Footer */}
              <div className="px-6 py-6 border-t border-border/40 space-y-4">
                <div className="flex items-center justify-center gap-4">
                  {socialLinks.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
                      <FaInstagram className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.facebook && (
                    <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 transition-colors">
                      <FaFacebook className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.tiktok && (
                    <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-black dark:hover:text-white hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
                      <FaTiktok className="h-5 w-5" />
                    </a>
                  )}
                  {socialLinks.whatsapp && (
                    <a href={`https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors">
                      <FaWhatsapp className="h-5 w-5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground text-center">&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}