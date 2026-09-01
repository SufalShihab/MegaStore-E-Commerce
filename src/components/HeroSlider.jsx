import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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

  if (banners.length === 0) {
    return (
      <div className="w-full h-[200px] sm:h-[300px] bg-slate-100 flex items-center justify-center text-slate-400 text-xs font-medium">
        হিরো ব্যানার লোড হচ্ছে...
      </div>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    // w-full এবং m-0 p-0 নিশ্চিত করা হয়েছে যাতে কোনো ফাঁকা না থাকে
    <div className="relative w-full overflow-hidden bg-slate-900 group">
      
      {/* ব্যানার ইমেজ: object-contain দিলে ছবি কাটবে না, পুরোটা দেখা যাবে */}
      <div className="w-full h-[140px] sm:h-[200px] md:h-[260px] lg:h-[340px] flex items-center justify-center">
        <img 
          src={currentBanner.image} 
          alt="Hero Banner" 
          className="w-full h-full object-fill md:object-cover transition-all duration-500"
        />
      </div>

      {/* Shop Now ওভারল্যাপ বাটন (বাম পাশে নিচে ছবির ওপর) */}
      <div className="absolute bottom-4 left-4 sm:left-8 z-20">
        <a 
          href={currentBanner.link || '#'} 
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-1.5 sm:px-6 sm:py-2.5 rounded-lg shadow-md text-xs sm:text-sm transition-transform transform hover:scale-105 inline-block"
        >
          Shop Now
        </a>
      </div>

      {/* নেভিগেশনArrows */}
      <button 
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      <button 
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-1.5 sm:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-20"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* ডট ইনডিকেটর */}
      <div className="absolute bottom-3 right-6 flex gap-1.5 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'w-5 sm:w-6 bg-amber-400' : 'w-1.5 sm:w-2 bg-white/60'}`}
          />
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;