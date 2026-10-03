"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Dot } from "lucide-react";

interface BannerCarouselProps {
  images: string[];
  autoplayInterval?: number;
  className?: string;
}

function BannerCarousel({
  images,
  autoplayInterval = 5000,
  className = "",
}: BannerCarouselProps) {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent((i) => (images.length > 0 ? ((index % images.length) + images.length) % images.length : 0));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrent((c) => (images.length > 0 ? (c + 1) % images.length : 0));
  }, [images.length]);

  const goToPrev = useCallback(() => {
    setCurrent((c) => (images.length > 0 ? (c - 1 + images.length) % images.length : 0));
  }, [images.length]);

  useEffect(() => {
    if (images.length < 2) return;
    const id = window.setInterval(() => {
      goToNext();
    }, autoplayInterval);
    return () => window.clearInterval(id);
  }, [autoplayInterval, goToNext, images.length]);

  const animated = useMemo(() => {
    if (images.length < 2) return images;
    const result = [...images.slice(current), ...images.slice(0, current)];
    return result;
  }, [current, images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden bg-black/10 ${className}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Store banner"
    >
      {/* Slides */}
      <div className="flex transition-transform duration-700 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {animated.map((src, index) => (
          <div key={index} className="relative min-w-full">
            <Image
              src={src}
              alt={`Banner ${index + 1}`}
              fill
              priority={index === 0}
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-black/10 to-transparent" />
          </div>
        ))}
      </div>

      {/* Left / right chevron controls */}
      <button
        type="button"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white shadow-lg transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/60"
        onClick={goToPrev}
        aria-label="Previous banner"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white shadow-lg transition hover:bg-black/60 focus:outline-none focus:ring-2 focus:ring-white/60"
        onClick={goToNext}
        aria-label="Next banner"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`flex h-3 w-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white/60 ${i === current ? "bg-white w-6" : "bg-white/40"}`}
            onClick={() => goTo(i)}
            aria-label={`Go to banner ${i + 1}`}
          >
            <Dot className={`mx-auto h-3 w-3 transition-transform ${i === current ? "translate-y-0.5 scale-110" : "translate-y-0.5"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel;
