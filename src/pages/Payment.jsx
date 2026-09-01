import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { CheckCircle2, XCircle, ShieldCheck, CreditCard } from 'lucide-react';
import axios from 'axios';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCartStore();

  const { orderData, totalAmount } = location.state || { totalAmount: 0, orderData: null };
  const [processing, setProcessing] = useState(false);

  // যদি সরাসরি কেউ ইউআরএল দিয়ে এখানে চলে আসে
  if (!orderData) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-lg font-bold text-rose-500">কোনো পেমেন্ট তথ্য পাওয়া যায়নি!</h2>
        <button onClick={() => navigate('/checkout')} className="bg-amber-500 text-slate-950 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer">
          চেকআউটে ফিরে যান
        </button>
      </div>
    );
  }

  // পেমেন্ট সফল হলে ব্যাকএন্ড ডাটাবেজে অর্ডার সেভ করা
  const handlePaymentSuccess = async () => {
    setProcessing(true);
    try {
      // অর্ডার পে লোডের সাথে পেমেন্ট স্ট্যাটাস 'Paid' যুক্ত করা হলো
      const finalOrderPayload = {
        ...orderData,
        paymentStatus: 'Paid',
        paymentMethod: 'ONLINE',
        status: 'Confirmed'
      };

      // 🔥 ব্যাকএন্ডের MongoDB তে অর্ডার সেভ করার জন্য API কল
      const response = await axios.post('http://localhost:5000/api/orders', finalOrderPayload);

      if (response.status === 201 || response.status === 200) {
        clearCart();
        // সফলভাবে সেভ হওয়ার পর অর্ডার সাকসেস পেজে রিডাইরেক্ট
        navigate('/order-success', { state: { orderId: response.data._id } });
      }
    } catch (error) {
      console.error('Online Order Saving Failed:', error.response?.data || error.message);
      alert('পেমেন্ট সফল হলেও অর্ডার ডাটাবেজে সেভ করতে সমস্যা হয়েছে: ' + (error.response?.data?.message || error.message));
    } finally {
      setProcessing(false);
    }
  };

  // পেমেন্ট না (বাতিল) হলে
  const handlePaymentCancel = () => {
    alert('পেমেন্ট বাতিল করা হয়েছে। অর্ডারটি সম্পন্ন হয়নি।');
    navigate('/checkout');
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12 font-sans flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full space-y-6 text-center border-t-4 border-amber-500">
        
        <div className="flex justify-center">
          <div className="bg-amber-100 p-4 rounded-full">
            <CreditCard className="w-10 h-10 text-amber-600" />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800">অনলাইন পেমেন্ট সিমুলেটর</h2>
          <p className="text-xs text-gray-500 mt-1">বিকাশ / নগদ / কার্ড গেটওয়ে</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border space-y-2 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>গ্রাহকের নাম:</span>
            <span className="font-semibold text-gray-800">
              {orderData.customerInfo?.fullName || 'অজানা গ্রাহক'}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>মোট পরিমাণ:</span>
            <span className="font-bold text-amber-600 text-sm">৳ {totalAmount}</span>
          </div>
        </div>

        <div className="text-xs text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200">
          আপনি কি পেমেন্ট সম্পন্ন করতে চান? নিচের যেকোনো একটি বাটনে ক্লিক করুন:
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <button 
            type="button"
            onClick={handlePaymentCancel}
            disabled={processing}
            className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" /> না (বাতিল)
          </button>

          <button 
            type="button"
            onClick={handlePaymentSuccess}
            disabled={processing}
            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" /> {processing ? 'প্রসেসিং...' : 'হ্যাঁ (পেমেন্ট করুন)'}
          </button>
        </div>

        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-400 pt-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> সিকিউরড ডামি পেমেন্ট সিস্টেম
        </div>

      </div>
    </div>
  );
};

export default Payment;