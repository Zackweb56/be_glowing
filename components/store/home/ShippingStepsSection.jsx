"use client";

import { MdShoppingBag as ShoppingBag, MdLocalShipping as Truck, MdCreditCard as CreditCard } from 'react-icons/md';
import { motion } from "framer-motion";

const STEPS = [
  {
    icon: ShoppingBag,
    title: "Order Online",
    description: "Select your favorites, add to cart, and checkout in seconds.",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "We pack with care and deliver to your door within 24-48 hours.",
  },
  {
    icon: CreditCard,
    title: "Pay on Delivery",
    description: "Inspect your package first, then pay in cash—hassle-free.",
  },
];

export function ShippingStepsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            Three simple steps to get your order
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6"
        >
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
                <Icon className="h-6 w-6" />
              </div>

              {/* Step Number */}
              <div className="text-xs font-mono text-muted-foreground/40 mb-1.5">
                {String(index + 1).padStart(2, '0')}
              </div>

              {/* Content */}
              <h3 className="text-base font-medium text-foreground">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1.5 max-w-xs leading-relaxed">
                {description}
              </p>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <>
                  <div className="hidden md:block w-12 h-px bg-border mx-auto mt-6" />
                  <div className="block md:hidden w-px h-6 bg-border mx-auto mt-4" />
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}