"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MdSearch as Search, MdTune as SlidersHorizontal, MdGridView as Grid3X3, MdSwapVert as ArrowUpDown, MdInfoOutline as Info } from 'react-icons/md';
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button";

export function ProductBrowser({ categories = [], initialProducts = [], whatsappNumber }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("q") || "";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      setSelectedCategory(catParam);
    }
    
    const searchParam = searchParams.get("q");
    if (searchParam !== null) {
      setSearchTerm(searchParam);
    }
  }, [searchParams]);

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search term filter
    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter(
        p => 
          p.name.toLowerCase().includes(query) || 
          (p.description && p.description.toLowerCase().includes(query))
      );
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      // Default / Featured: place featured items first
      result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [initialProducts, selectedCategory, searchTerm, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search & Sort Panel */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card border border-border/40 p-4 rounded-2xl shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search jewelry..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 w-full min-w-0 rounded-lg border border-input bg-background/50 pl-9 pr-4 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>

        {/* Sort Controls */}
        <div className="flex w-full md:w-auto items-center gap-3 justify-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground whitespace-nowrap">
            <ArrowUpDown className="h-3.5 w-3.5" />
            Sort by:
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background/50 px-2.5 py-1 text-sm text-foreground transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="featured">Featured / Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">New Arrivals</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center gap-2 font-bold text-sm tracking-wide uppercase text-muted-foreground pb-2 border-b border-border/20">
            <SlidersHorizontal className="h-4 w-4" /> Collections
          </div>
          <div className="flex flex-wrap lg:flex-col gap-1.5">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === "all"
                  ? "bg-primary text-white shadow-sm"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              All products
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat._id)}
                className={`text-left px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedCategory === cat._id
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{filteredProducts.length} products found</span>
            <span className="flex items-center gap-1">
              <Grid3X3 className="h-3.5 w-3.5" /> Grid
            </span>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} whatsappNumber={whatsappNumber} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-muted/10 border border-border/30 rounded-2xl text-center p-6 space-y-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/40 text-muted-foreground/80">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-base">No products found</h3>
              <p className="text-xs text-muted-foreground max-w-xs">
                We couldn't find any products matching your search. Try resetting filters or select another collection.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
