import React, { useEffect } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CartDrawer = ({ isOpen, onClose, cartItems = [], onIncrease, onDecrease, onRemove }) => {
  const navigate = useNavigate();

  // ড্রয়ার ওপেন থাকলে ব্যাকগ্রাউন্ড পেজের স্ক্রল বন্ধ রাখা
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // মোট মূল্য হিসাব
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );

  // চেকআউটে যাওয়ার হ্যান্ডলার
  const handleProceedToCheckout = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('চেকআউট করতে হলে প্রথমে লগইন করুন!');
      localStorage.setItem('redirectPath', '/checkout');
      onClose();
      navigate('/login');
      return;
    }

    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* ব্যাকড্রপ (ধূসর আবরণ) */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10 pointer-events-none">
        <div className="w-screen max-w-full sm:max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transition-transform duration-300">
          
          {/* হেডার */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="text-base sm:text-lg font-bold">আপনার কার্ট ({cartItems.length})</h2>
            </div>
            <button 
              onClick={onClose}
              aria-label="Close cart"
              className="p-1.5 rounded-lg hover:bg-slate-800 text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* আইটেম লিস্ট (স্ক্রলেবল) */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3 py-10">
                <ShoppingBag className="w-16 h-16 stroke-1 text-gray-300" />
                <p className="text-sm font-medium">আপনার কার্ট খালি!</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item._id || item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm"
                >
                  <img 
                    src={item.image || item.images?.[0] || 'https://via.placeholder.com/80'} 
                    alt={item.name} 
                    className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg border bg-white shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">{item.name}</h4>
                    <p className="text-xs sm:text-sm text-amber-600 font-bold mt-0.5">৳{item.price}</p>
                    
                    {/* কোয়ান্টিটি বাটন */}
                    <div className="flex items-center gap-2 mt-2">
                      <button 
                        onClick={() => onDecrease(item._id)}
                        className="p-1 border bg-white rounded hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-5 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onIncrease(item._id)}
                        className="p-1 border bg-white rounded hover:bg-gray-100 text-gray-600 cursor-pointer transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* মুছে ফেলার বাটন */}
                  <button 
                    onClick={() => onRemove(item._id)}
                    className="p-1.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* ফুটার (সাবটোটাল ও চেকআউট বাটন) */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t bg-gray-50 space-y-3 shrink-0">
              <div className="flex justify-between items-center text-sm font-bold text-gray-800">
                <span>মোট দাম:</span>
                <span className="text-amber-600 text-base sm:text-lg">৳{totalPrice.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handleProceedToCheckout}
                className="w-full bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer text-sm shadow-md"
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