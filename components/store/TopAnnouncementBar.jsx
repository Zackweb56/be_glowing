"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function TopAnnouncementBar({ announcements = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter active announcements
  const activeAnnouncements = announcements.filter(a => a.isActive);

  useEffect(() => {
    if (activeAnnouncements.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeAnnouncements.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [activeAnnouncements.length]);

  if (!activeAnnouncements || activeAnnouncements.length === 0) {
    return null;
  }

  const currentAnnouncement = activeAnnouncements[currentIndex];

  const content = (
    <span className="text-xs font-medium tracking-wide">
      {currentAnnouncement.text}
    </span>
  );

  return (
    <div className="w-full bg-primary text-primary-foreground overflow-hidden relative flex items-center justify-center h-10 px-4 text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute w-full"
        >
          {currentAnnouncement.url ? (
            <Link href={currentAnnouncement.url} className="hover:underline">
              {content}
            </Link>
          ) : (
            content
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
