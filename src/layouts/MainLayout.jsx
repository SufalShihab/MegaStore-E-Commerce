import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';
import { useCartStore } from '../store/useCartStore';

const MainLayout = () => {
  // Zustand Store থেকে প্রয়োজনীয় ডাটা ও অ্যাকশনগুলো নিয়ে নেওয়া হলো
  const { 
    isOpen, 
    cart, 
    closeCart, 
    increaseQty, 
    decreaseQty, 
    removeFromCart 
  } = useCartStore();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50">
      <div>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-6">
          <Outlet />
        </main>
      </div>

      {/* 🛒 Cart Drawer-এ Zustand এর সব Properties পাস করা হলো */}
      <CartDrawer 
        isOpen={isOpen}
        onClose={closeCart}
        cartItems={cart}
        onIncrease={increaseQty}
        onDecrease={decreaseQty}
        onRemove={removeFromCart}
      />

      <Footer />

    </div>
  );
};

export default MainLayout;