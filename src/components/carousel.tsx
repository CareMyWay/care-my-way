"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const prev = () => {
    setCurr((curr) =>
      curr <= 0 ? Math.ceil(children.length / visibleSlides) - 1 : curr - 1
    );
    console.log(
      "---> -setCurr:",
      curr,
      Math.ceil(children.length / visibleSlides) - 1
    );
  };

  const next = () => {
    setCurr((curr) =>
      curr >= Math.ceil(children.length / visibleSlides) - 1 ? 0 : curr + 1
    );
    console.log(
      "---> +setCurr:",
      curr,
      Math.ceil(children.length / visibleSlides) - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurr(index);
    console.log(
      "---> go setCurr:",
      index,
      Math.ceil(children.length / visibleSlides) - 1
    );
  };

  useEffect(() => {
    if (!autoSlide || isHovering) return;

    const startInterval = () => {
      slideInterval.current = setInterval(() => {
        next();
      }, autoSlideInterval);
    };

    startInterval();

    return () => {
      if (slideInterval.current) {
        clearInterval(slideInterval.current);
      }
    };
  }, [autoSlide, autoSlideInterval, isHovering]);

  const visibleSlides = 3;
  const totalSlides =
    Math.ceil(children.length / visibleSlides) * visibleSlides;
  const slidesToShow = Math.min(visibleSlides, totalSlides);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
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

      <div
        className="flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${(100 * curr * slidesToShow) / totalSlides}%)`,
          width: `${(totalSlides / slidesToShow) * 100}%`,
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className="w-full md:w-1/3 flex-shrink-0 px-2"
            style={{ width: `${100 / totalSlides}%` }}
          >
            {child}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 right-0 left-0">
        <div className="flex items-center justify-center gap-2">
          {children.map((_, i) =>
            i > Math.trunc(children.length / visibleSlides) ? (
              ""
            ) : (
              <div
                key={i}
                className={`transition-all w-2 h-2 bg-white rounded-full ${curr === i ? "p-1.5" : "bg-opacity-50"}`}
                onClick={() => goToSlide(i)}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
};
