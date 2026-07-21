"use client";

import Link from "next/link";
import { MdArrowForward, MdCategory } from "react-icons/md";
import { motion } from "framer-motion";

export function CategoriesSection({ categories }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="categories" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto max-w-6xl px-6 sm:px-8 lg:px-10">
        {/* Section Header - Minimalist Luxury */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/50 font-medium">
            Collections
          </span>
          <h2 className="text-xl md:text-2xl font-light tracking-tight text-foreground mt-1.5">
            Shop by Category
          </h2>
          <div className="w-6 h-px bg-foreground/15 mx-auto mt-2.5" />
        </div>

        {/* Categories Grid - 4x4 Rectangle Cards */}
        {categories.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
          >
            {categories.map((cat, index) => {
              const imageUrl = cat.image || cat.imageUrl || cat.thumbnail;
              
              return (
                <motion.div key={cat._id || index} variants={itemVariants}>
                  <Link href={`/store?category=${cat._id}`} className="group block">
                    <div className="flex flex-col">
                      {/* Rectangle Card */}
                      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden transition-all duration-500 group-hover:shadow-lg group-hover:shadow-black/10 bg-primary/5">
                        
                        {/* Background Layer */}
                        {imageUrl ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-primary/20">
                            <MdCategory className="w-16 h-16" />
                          </div>
                        )}
                        
                        {/* Dark Overlay - Always visible if image, lighter if no image */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${imageUrl ? 'from-black/60 via-black/20 to-black/10' : 'from-black/40 via-transparent to-transparent'}`} />
                        
                        {/* Content Container with Slide Up Effect */}
                        <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-end overflow-hidden">
                          {/* Content Wrapper - Slides up on hover */}
                          <div className="transform translate-y-0 transition-transform duration-500 ease-out group-hover:-translate-y-2">
                            
                            {/* Category Name - White Text */}
                            <h3 className="text-sm md:text-base font-medium tracking-wide text-white">
                              {cat.name}
                            </h3>
                            
                            {/* Description - White Text */}
                            {cat.description && (
                              <p className="text-[10px] uppercase tracking-[0.1em] text-white/70 mt-0.5 line-clamp-1">
                                {cat.description.replace(/^Explore our\s*/, '').replace(/\s+collection$/, '') || 'Collection'}
                              </p>
                            )}
                            
                            {/* Shop Now Link - White Text */}
                            <div className="flex items-center gap-1.5 mt-2.5 text-xs font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                              <span>Shop</span>
                              <MdArrowForward className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Collections are being updated.</p>
          </div>
        )}
      </div>
    </section>
  );
}