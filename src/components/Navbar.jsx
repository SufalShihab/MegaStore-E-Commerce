import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingCart, User, Store, LogOut, Menu, MapPin, ChevronDown, UserPlus, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { toggleCart, cart = [] } = useCartStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('বাংলাদেশ');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuRef = useRef(null);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const categories = [
    { name: 'Electronics', label: 'Electronics' },
    { name: 'Fashion', label: 'Fashion' },
    { name: 'Home Appliances', label: 'Home Appliances' },
    { name: 'Groceries', label: 'Groceries' },
    { name: 'Beauty & Health', label: 'Beauty & Health' },
    { name: 'Gadgets', label: 'Gadgets' },
    { name: 'Sports & Fitness', label: 'Sports & Fitness' },
    { name: 'Baby & Toys', label: 'Baby & Toys' },
    { name: 'Books & Stationery', label: 'Books & Stationery' },
    { name: 'Furniture', label: 'Furniture' },
    { name: 'Automotive & Motorbike', label: 'Automotive & Motorbike' },
    { name: 'Jewellery & Watches', label: 'Jewellery & Watches' },
    { name: 'Pet Supplies', label: 'Pet Supplies' },
    { name: 'Tools & Hardware', label: 'Tools & Hardware' },
    { name: 'Office Supplies', label: 'Office Supplies' },
  ];

  const countries = ['বাংলাদেশ', 'India', 'USA', 'UK', 'UAE', 'Saudi Arabia'];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsMobileMenuOpen(false);
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim() && selectedCategory === 'all') return;
    navigate(`/?keyword=${encodeURIComponent(searchTerm.trim())}&category=${selectedCategory}`);
  };

  const handleCategoryClick = (categoryName) => {
    setSelectedCategory(categoryName);
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigate(`/?category=${categoryName}`);
  };

  return (
    <header className="sticky top-0 z-50 font-sans shadow-md">
      {/* 1. Main Navigation Bar */}
      <div className="bg-slate-900 text-white px-3 sm:px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Mobile Menu Toggle & Logo & Country Selector */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1 text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link to="/" className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-0.5">
              MegaStore<span className="text-amber-500">.</span>
            </Link>

            {/* Delivery Location Dropdown (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-gray-300">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400 leading-none mb-0.5">ডেলিভারি লোকেশন</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-transparent font-bold text-white outline-none cursor-pointer border-none p-0 text-xs focus:ring-0"
                >
                  {countries.map((country) => (
                    <option key={country} value={country} className="bg-slate-800 text-white">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="flex-1 max-w-2xl relative hidden md:block">
            <form onSubmit={handleSearch} className="flex items-center rounded-lg overflow-hidden bg-white">
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-100 text-xs text-gray-700 px-3 py-2.5 outline-none border-r border-gray-300 cursor-pointer font-medium hover:bg-gray-200 transition-colors"
              >
                <option value="all">সব ক্যাটাগরি</option>
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.label}</option>
                ))}
              </select>

              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="মেগা স্টোরে যেকোনো পণ্য খুঁজুন..." 
                className="w-full px-4 py-2 text-sm text-gray-800 outline-none"
              />

              <button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-600 text-slate-900 px-5 py-2.5 transition-colors cursor-pointer font-bold"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>
          </div>

          {/* Right User Actions */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">

            {/* Cart Button */}
            <button 
              onClick={toggleCart} 
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 sm:w-7 sm:h-7 text-amber-500" />
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              </div>
              <div className="hidden lg:block text-left">
                <span className="block text-[10px] text-gray-400">মাই কার্ট</span>
              </div>
            </button>

            {/* User Profile OR Login/Signup Buttons */}
            {token ? (
              <div className="flex items-center gap-2 sm:gap-3 border-l border-slate-700 pl-2 sm:pl-3">
                <Link to="/profile" className="flex items-center gap-1.5 hover:text-amber-400 transition-colors">
                  <User className="w-5 h-5 text-amber-500" />
                  <div className="text-left hidden sm:block">
                    <span className="block text-[10px] text-gray-400 max-w-[100px] truncate">
                      হ্যালো, {user.name || user.username || 'ইউজার'}
                    </span>
                    <span className="font-bold">মাই অ্যাকাউন্ট</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="লগআউট"
                  className="p-1.5 text-gray-400 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link 
                  to="/login"
                  className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors text-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>লগইন</span>
                </Link>
                <Link 
                  to="/register"
                  className="hidden sm:flex items-center gap-1 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold px-3 py-1.5 rounded-lg transition-colors text-xs"
                >
                  <UserPlus className="w-3.5 h-3.5 text-amber-500" />
                  <span>সাইনআপ</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar (Visible on Mobile/Tablet) */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearch} className="flex items-center rounded-lg overflow-hidden bg-white">
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="পণ্য খুঁজুন..." 
              className="w-full px-3 py-1.5 text-xs text-gray-800 outline-none"
            />
            <button 
              type="submit" 
              className="bg-amber-500 text-slate-900 px-3 py-1.5 font-bold"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 2. Sub Navigation Bar (Desktop & Horizontal Scroll for Mobile) */}
      <div className="bg-slate-800 text-gray-200 text-xs px-4 py-2 border-t border-slate-700 hidden lg:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6 font-medium overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            
            {/* Dropdown Menu */}
            <div className="relative shrink-0" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300 cursor-pointer"
              >
                <Menu className="w-4 h-4" /> 
                <span>সব ক্যাটাগরি</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 max-h-80 overflow-y-auto">
                  <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ক্যাটাগরি সমূহ</div>
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-amber-600 font-semibold transition-colors"
                  >
                    সব প্রোডাক্ট
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.name}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="w-full text-left px-4 py-2 text-xs hover:bg-amber-50 hover:text-amber-600 transition-colors"
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Direct Category Links */}
            {categories.slice(0, 8).map((cat) => (
              <button key={cat.name} onClick={() => handleCategoryClick(cat.name)} className="hover:text-amber-400 transition-colors cursor-pointer shrink-0">
                {cat.label}
              </button>
            ))}
          </div>

          {/* Seller & Admin Panel Links */}
          <div className="flex items-center gap-4 text-xs font-semibold shrink-0">
            <Link to="/seller/login" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <Store className="w-3.5 h-3.5" /> সেলার প্যানেল
            </Link>
            <span className="text-slate-600">|</span>
            <Link to="/admin-login" className="text-gray-300 hover:text-white">অ্যাডমিন প্যানেল</Link>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer / Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-slate-900 text-white h-full shadow-2xl flex flex-col z-10 p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-black text-white">
                MegaStore<span className="text-amber-500">.</span>
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Delivery Location Mobile */}
            <div className="py-3 border-b border-slate-800 flex items-center gap-2 text-xs text-gray-300">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <span className="block text-[10px] text-gray-400 leading-none">ডেলিভারি লোকেশন:</span>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="bg-transparent font-bold text-white outline-none cursor-pointer text-xs mt-0.5"
                >
                  {countries.map((country) => (
                    <option key={country} value={country} className="bg-slate-800 text-white">
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Navigation Links */}
            <div className="py-3 border-b border-slate-800 space-y-2 text-xs">
              <Link 
                to="/seller/login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-emerald-400 font-semibold py-1.5"
              >
                <Store className="w-4 h-4" /> সেলার প্যানেল
              </Link>
              <Link 
                to="/admin-login" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-gray-300 font-semibold py-1.5"
              >
                <User className="w-4 h-4" /> অ্যাডমিন প্যানেল
              </Link>
            </div>

            {/* Mobile Categories List */}
            <div className="py-3 flex-1">
              <h3 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">ক্যাটাগরি সমূহ</h3>
              <div className="space-y-1">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className="w-full text-left py-2 px-2 text-xs rounded hover:bg-slate-800 text-gray-200 font-semibold"
                >
                  সব প্রোডাক্ট
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="w-full text-left py-2 px-2 text-xs rounded hover:bg-slate-800 text-gray-300"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile User Logout/Login */}
            {token && (
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-rose-600/20 text-rose-400 py-2 rounded-lg text-xs font-bold"
                >
                  <LogOut className="w-4 h-4" /> লগআউট করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;