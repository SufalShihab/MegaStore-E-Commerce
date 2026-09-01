import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose, cartItems = [], onIncrease, onDecrease, onRemove }) => {
  const navigate = useNavigate();

  // ১. isOpen যদি false হয়, তাহলে কিছুই রেন্ডার হবে না
  if (!isOpen) return null;

  // মোট মূল্য হিসাব
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // চেকআউটে যাওয়ার হ্যান্ডলার
  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('চেকআউট করতে হলে প্রথমে লগইন করুন!');
      localStorage.setItem('redirectPath', '/checkout');
      onClose(); // ড্রয়ার বন্ধ করা
      navigate('/login');
      return;
    }

    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* ব্যাকড্রপ (ধূসর আবরণ) - ব্যাকগ্রাউন্ডে ক্লিক করলে বন্ধ হবে */}
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col">
          
          {/* হেডার */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold">আপনার কার্ট ({cartItems.length})</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* আইটেম লিস্ট */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
                <ShoppingBag className="w-16 h-16 stroke-1 text-gray-300" />
                <p className="text-sm font-medium">আপনার কার্ট খালি!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item._id || item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                >
                  <img 
                    src={item.image || item.images?.[0] || 'https://via.placeholder.com/80'} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-lg border bg-white shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs text-amber-600 font-bold mt-1">৳{item.price}</p>
                    
                    {/* কোয়ান্টিটি বাটন */}
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => onDecrease(item._id)}
                        className="p-1 border rounded hover:bg-gray-200 text-gray-600 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onIncrease(item._id)}
                        className="p-1 border rounded hover:bg-gray-200 text-gray-600 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* মুছে ফেলার বাটন */}
                  <button 
                    onClick={() => onRemove(item._id)}
                    className="p-1 text-gray-400 hover:text-rose-500 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ফুটার (সাবটোটাল ও চেকআউট বাটন) */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t bg-gray-50 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                <span>মোট দাম:</span>
                <span className="text-amber-600 text-base">৳{totalPrice.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer text-sm shadow-md"
              >
                <span>অর্ডার কনফার্ম করুন</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;