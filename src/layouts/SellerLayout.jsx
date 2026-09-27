import React, { useEffect, useState } from 'react';
import { Link, Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { 
  Package, 
  PlusCircle, 
  LayoutDashboard, 
  ShoppingBag, 
  UserCheck, 
  LogOut, 
  Store 
} from 'lucide-react';

const SellerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const navLinks = [
    { to: "/seller/dashboard", icon: LayoutDashboard, label: "ড্যাশবোর্ড" },
    { to: "/seller/add-product", icon: PlusCircle, label: "নতুন প্রোডাক্ট" },
    { to: "/seller/products", icon: Package, label: "প্রোডাক্ট লিস্ট" },
    { to: "/seller/orders", icon: ShoppingBag, label: "অর্ডারসমূহ" },
    { to: "/seller/account", icon: UserCheck, label: "মাই অ্যাকাউন্ট" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans">
      
      {/* ======================================================== */}
      {/* 1. Small & Medium Screen Header (Auto-Height Flow)       */}
      {/* ======================================================== */}
      <header className="lg:hidden w-full bg-slate-900 shadow-xl p-2.5">
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          
          {/* Logo & All Nav Links + Logout in Single Natural Flow */}
          <div className="flex flex-wrap items-center gap-1.5 w-full">
            
            {/* MegaStore Logo */}
            <Link to="/seller/dashboard" className="flex items-center gap-1 mr-1 shrink-0">
              <div className="w-6 h-6 rounded bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Store className="w-3 h-3" />
              </div>
              <span className="text-xs font-black text-white tracking-tight">
                MegaStore
              </span>
            </Link>

            {/* Nav Links */}
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition-all shrink-0 ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-sm' 
                      : 'text-slate-300 bg-slate-800/80 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-3 h-3 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} /> 
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-2 py-1 rounded border border-rose-500/20 transition shrink-0"
            >
              <LogOut className="w-3 h-3" />
              <span>লগআউট</span>
            </button>

          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. Large Screen Sidebar                                 */}
      {/* ======================================================== */}
      <aside className="hidden lg:flex w-64 bg-slate-900 text-slate-300 flex-col justify-between shrink-0 min-h-screen">
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/seller/dashboard" className="text-xl font-black text-white flex items-center gap-2">
              MegaStore <span className="text-xs bg-amber-500/20 text-amber-400 font-semibold px-2 py-0.5 rounded-full border border-amber-500/30">Seller</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="p-4 space-y-1.5 text-sm font-medium">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link 
                  key={item.to}
                  to={item.to} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive 
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} /> 
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 rounded-xl transition cursor-pointer"
          >
            <LogOut className="w-5 h-5" /> লগআউট করুন
          </button>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 3. Main Content Area                                     */}
      {/* ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default SellerLayout;