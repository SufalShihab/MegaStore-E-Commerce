import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../api/axios';

const HeroSlider = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await API.get('/hero');
        if (res.data && res.data.length > 0) {
          setBanners(res.data);
        }
      } catch (err) {
        console.error('Hero banners fetch error:', err);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? banners.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // লোডিং স্টেটে স্কেলিটন বা লোডার
  if (banners.length === 0) {
    return (
      <div className="w-full aspect-[16/7] sm:aspect-[16/6] md:aspect-[16/5] bg-slate-800 animate-pulse flex items-center justify-center text-slate-400 text-xs font-medium">
        হিরো ব্যানার লোড হচ্ছে...
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative w-full overflow-hidden bg-slate-900 group select-none">
      
      {/* ব্যানার ইমেজ কন্টেইনার (Aspect Ratio নিশ্চিত করা হয়েছে) */}
      <div className="w-full h-[160px] xs:h-[200px] sm:h-[280px] md:h-[350px] lg:h-[420px] relative overflow-hidden flex items-center justify-center">
        <img 
          src={currentBanner.image} 
          alt={`Hero Banner ${currentIndex + 1}`} 
          className="w-full h-full object-cover transition-all duration-700 ease-in-out"
        />
        {/* গাঢ় ওভারলে যা টেক্সট/বাটন স্পষ্টভাবে দেখাবে */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
      </div>

      {/* Shop Now বাটন */}
      <div className="absolute bottom-3 left-3 xs:bottom-4 xs:left-4 sm:bottom-6 sm:left-8 z-20">
        <Link 
          to={currentBanner?.link || '#'} 
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold px-3 py-1.5 xs:px-4 xs:py-2 sm:px-6 sm:py-2.5 rounded-lg shadow-lg text-[11px] xs:text-xs sm:text-sm transition-transform transform active:scale-95 hover:scale-105 inline-flex items-center gap-1"
        >
          Shop Now
        </Link>
      </div>

      {/* নেভিগেশন Arrows (মোবাইলে কিছুটা স্বচ্ছ দেখাবে, ডেসটপে হভার করলে স্পষ্ট হবে) */}
      <button 
        onClick={prevSlide}
        aria-label="Previous Slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-1.5 sm:p-2.5 rounded-full opacity-70 group-hover:opacity-100 transition-all cursor-pointer z-20 active:scale-90"
      >
        <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      <button 
        onClick={nextSlide}
        aria-label="Next Slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/75 text-white p-1.5 sm:p-2.5 rounded-full opacity-70 group-hover:opacity-100 transition-all cursor-pointer z-20 active:scale-90"
      >
        <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
      </button>

      {/* ডট ইনডিকেটর */}
      <div className="absolute bottom-3 right-3 xs:right-4 sm:right-8 flex items-center gap-1 sm:gap-1.5 z-20 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-full">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === index ? 'w-4 sm:w-6 bg-amber-400' : 'w-1.5 sm:w-2 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;