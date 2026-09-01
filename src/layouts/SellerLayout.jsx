import React, { useEffect, useState } from 'react';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { Package, PlusCircle, LayoutDashboard, ShoppingBag, UserCheck, LogOut } from 'lucide-react';

const SellerLayout = () => {
  const navigate = useNavigate();
  const [sellerInfo, setSellerInfo] = useState({ shopName: 'মাই শপ' });
  const isSellerLoggedIn = localStorage.getItem('sellerLoggedIn');

useEffect(() => {
  const currentSellerId = localStorage.getItem('currentSellerId');
  const sellers = JSON.parse(localStorage.getItem('sellers')) || [];
  
  if (currentSellerId && sellers.length > 0) {
    const activeSeller = sellers.find(s => s.id === currentSellerId);
    if (activeSeller) {
      setSellerInfo(activeSeller);
    }
  }
}, []);

  if (!isSellerLoggedIn) {
    return <Navigate to="/seller/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('sellerLoggedIn');
    navigate('/seller/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col justify-between shadow-xl">
        <div>
          <div className="p-6 border-b border-slate-800">
            <Link to="/seller/dashboard" className="text-xl font-black text-white flex items-center gap-2">
              MegaStore <span className="text-xs bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">Seller</span>
            </Link>
          </div>
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            <Link to="/seller/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              <LayoutDashboard className="w-5 h-5 text-amber-400" /> ড্যাশবোর্ড
            </Link>
            <Link to="/seller/add-product" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              <PlusCircle className="w-5 h-5 text-amber-400" /> নতুন প্রোডাক্ট যোগ করুন
            </Link>
            <Link to="/seller/products" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              <Package className="w-5 h-5 text-amber-400" /> প্রোডাক্ট লিস্ট
            </Link>
            <Link to="/seller/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              <ShoppingBag className="w-5 h-5 text-amber-400" /> অর্ডারের তালিকা
            </Link>
            <Link to="/seller/account" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 text-slate-300 hover:text-white transition">
              <UserCheck className="w-5 h-5 text-amber-400" /> মাই অ্যাকাউন্ট
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer">
            <LogOut className="w-4 h-4" /> লগআউট করুন
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h1 className="text-lg font-bold text-slate-800">সেলার প্যানেল</h1>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-900 font-black flex items-center justify-center text-sm shadow-md shadow-amber-500/20">
              {sellerInfo.shopName ? sellerInfo.shopName.charAt(0).toUpperCase() : 'S'}
            </div>
            <span className="text-sm font-bold text-slate-800">{sellerInfo.shopName || 'রহিম স্টোর'}</span>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;