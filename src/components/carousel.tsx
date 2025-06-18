"use client";

import type React from "react";
import { useCallback, useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: React.ReactNode[];
  autoSlide?: boolean;
  autoSlideInterval?: number;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  autoSlide = true,
  autoSlideInterval = 5000,
}) => {
  const [curr, setCurr] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [visibleSlides, setVisibleSlides] = useState(1);
  const [hasMounted, setHasMounted] = useState(false);

  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const getVisibleSlides = () => {
    const width = window.innerWidth;
    if (width >= 1024) return 3;
    if (width >= 768) return 2;
    return 1;
  };

  useEffect(() => {
    setHasMounted(true);
    const handleResize = () => setVisibleSlides(getVisibleSlides());
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const next = useCallback(() => {
    setCurr((curr) =>
      curr >= Math.ceil(children.length / visibleSlides) - 1 ? 0 : curr + 1
    );
  }, [children.length, visibleSlides]);
  
  useEffect(() => {
    if (!autoSlide || isHovering) return;
    slideInterval.current = setInterval(() => {
      next();
    }, autoSlideInterval);
    return () => {
      if (slideInterval.current) clearInterval(slideInterval.current);
    };
  }, [autoSlide, autoSlideInterval, isHovering, visibleSlides, next]);

  const totalSlides =
    Math.ceil(children.length / visibleSlides) * visibleSlides;

  const prev = () => {
    setCurr((curr) =>
      curr <= 0 ? Math.ceil(children.length / visibleSlides) - 1 : curr - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurr(index);
  };

  // ❗ Prevent SSR mismatch and layout flash
  if (!hasMounted) return null;

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Arrows */}
      <div className="flex items-center justify-between absolute top-1/2 transform -translate-y-1/2 left-2 right-2 z-20">
        <button
          onClick={prev}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={next}
          className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${
            (100 * curr * visibleSlides) / totalSlides
          }%)`,
          width: `${(totalSlides / visibleSlides) * 100}%`,
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="w-full flex-shrink-0 px-2"
            style={{ width: `${100 / totalSlides}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {Array.from({
            length: Math.ceil(children.length / visibleSlides),
          }).map((_, i) => (
            <div
              key={i}
              className={`transition-all w-2 h-2 bg-white rounded-full cursor-pointer ${
                curr === i ? "p-1.5" : "bg-opacity-50"
              }`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
