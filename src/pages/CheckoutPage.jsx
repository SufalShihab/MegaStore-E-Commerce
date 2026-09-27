import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { ShoppingBag, Truck, CreditCard, ShieldCheck, ArrowRight, Trash2 } from 'lucide-react';
import API from '../api/axios';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart } = useCartStore();

  useEffect(() => {
    const directItem = localStorage.getItem('direct_checkout');
    if (directItem && cart.length === 0) {
      const parsedItem = JSON.parse(directItem);
      parsedItem.forEach(item => useCartStore.getState().addToCart(item));
      localStorage.removeItem('direct_checkout');
    }
  }, [cart]);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    note: '',
    paymentMethod: 'cod',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 1), 0);
  const shippingFee = subtotal > 0 ? 60 : 0;
  const grandTotal = subtotal + shippingFee;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('আপনার কার্ট খালি! অনুগ্রহ করে কিছু পণ্য যোগ করুন।');
      return;
    }

    // লোকালস্টোরেজ বা টোকেন থেকে ইউজারের আইডি নেওয়া (যদি থাকে)
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

    const orderPayload = {
      customer: userInfo._id || "64a5f2c8e4b0123456789abc",
      customerInfo: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        district: formData.district,
        note: formData.note,
      },
      orderItems: cart.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.images?.[0] || "",
      })),
      shippingFee,
      totalAmount: grandTotal,
      totalPrice: grandTotal,
      paymentMethod: formData.paymentMethod,
    };

    // যদি অনলাইন পেমেন্ট সিলেক্ট করা হয়
    if (formData.paymentMethod === 'online') {
      navigate('/payment', { state: { orderData: orderPayload, totalAmount: grandTotal } });
      return;
    }

    // ক্যাশ অন ডেলিভারির জন্য সরাসরি ব্যাকএন্ডে API কল
    setIsSubmitting(true);
    try {
      const response = await API.post('/orders', orderPayload);
      
      if (response.status === 201 || response.status === 200) {
        clearCart();
        alert('আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!');
        navigate('/order-success'); 
      }
    } catch (error) {
      console.error('Order Submission Failed:', error.response?.data || error.message);
      alert('অর্ডার সম্পন্ন করতে সমস্যা হয়েছে: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-4 sm:p-6 space-y-4">
        <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
        <h2 className="text-lg sm:text-xl font-bold text-gray-700">আপনার কার্টে কোনো পণ্য নেই!</h2>
        <p className="text-gray-500 text-xs sm:text-sm">অর্ডার করতে প্রথমে পণ্য কার্টে যুক্ত করুন।</p>
        <button
          onClick={() => navigate('/')}
          className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-5 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm transition cursor-pointer"
        >
          শপিং চালিয়ে যান
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-8 font-sans">
      <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
        <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 shrink-0" /> চেকআউট ও শিপিং তথ্য
      </h1>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8">
        
        {/* বাম পাশ: শিপিং তথ্য ও ফর্ম */}
        <div className="lg:col-span-7 space-y-4 sm:space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 border-b pb-3">
              ডেলিভারি ঠিকানা ও গ্রাহকের তথ্য
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  আপনার পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="যেমন: মোঃ রহিম উদ্দিন"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="যেমন: 01700000000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-gray-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  ইমেইল ঠিকানা (ঐচ্ছিক)
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@mail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  জেলা <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="district"
                  required
                  placeholder="যেমন: ঢাকা / রাজশাহী"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-gray-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  থানা / উপজেলা <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  placeholder="যেমন: ধানমন্ডি / সদর"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-gray-300"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  সম্পূর্ণ ঠিকানা <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="address"
                  required
                  rows="2"
                  placeholder="বাড়ি নং, রোড নং, এলাকার নাম..."
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-gray-300 resize-none"
                ></textarea>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  অর্ডার নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  name="note"
                  placeholder="ডেলিভারি সংক্রান্ত বিশেষ কোনো নির্দেশনা থাকলে লিখুন"
                  value={formData.note}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-3.5 py-2 sm:py-2.5 border rounded-lg sm:rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* পেমেন্ট পদ্ধতি সিলেকশন */}
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 border-b pb-3 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-500 shrink-0" /> পেমেন্ট পদ্ধতি নির্বাচন করুন
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <label className={`flex items-start sm:items-center gap-3 p-3.5 sm:p-4 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-amber-500 bg-amber-50/40' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="accent-amber-500 mt-0.5 sm:mt-0"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">ক্যাশ অন ডেলিভারি (COD)</span>
                  <span className="text-[11px] sm:text-xs text-gray-500">পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন</span>
                </div>
              </label>

              <label className={`flex items-start sm:items-center gap-3 p-3.5 sm:p-4 border rounded-xl cursor-pointer transition ${formData.paymentMethod === 'online' ? 'border-amber-500 bg-amber-50/40' : 'border-gray-200'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={formData.paymentMethod === 'online'}
                  onChange={handleChange}
                  className="accent-amber-500 mt-0.5 sm:mt-0"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-slate-800 block">অনলাইন পেমেন্ট</span>
                  <span className="text-[11px] sm:text-xs text-gray-500">বিকাশ / নগদ / কার্ড পেমেন্ট</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* ডান পাশ: অর্ডারের সারসংক্ষেপ */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 space-y-4 lg:sticky lg:top-6">
            <h2 className="text-sm sm:text-base font-bold text-slate-800 border-b pb-3">অর্ডার সামারি</h2>

            <div className="space-y-3 max-h-56 sm:max-h-64 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center gap-2.5 sm:gap-3 py-2 border-b border-gray-50 last:border-0">
                  <img
                    src={item.image || item.images?.[0]}
                    alt={item.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                    <p className="text-[11px] sm:text-xs text-gray-500">৳ {item.price} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      ৳ {(item.price * item.quantity).toLocaleString()}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-400 hover:text-red-600 p-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 pt-3 border-t text-xs sm:text-sm">
              <div className="flex justify-between text-gray-600">
                <span>পণ্যসমূহের দাম:</span>
                <span className="font-semibold text-slate-800">৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-semibold text-slate-800">৳ {shippingFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-slate-900 border-t pt-2">
                <span>সর্বমোট:</span>
                <span className="text-amber-600">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 sm:py-3.5 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'প্রসেস করা হচ্ছে...' : formData.paymentMethod === 'online' ? 'পেমেন্ট পেজে যান' : 'অর্ডার নিশ্চিত করুন'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] sm:text-[11px] text-center text-gray-400 flex items-center justify-center gap-1 pt-1 sm:pt-2">
              <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" /> ১০০% নিরাপদ অর্ডার সার্ভিস
            </p>
          </div>
        </div>

      </form>
    </div>
  );
};

export default CheckoutPage;