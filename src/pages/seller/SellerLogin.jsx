import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock } from 'lucide-react';
import API from '../../api/axios';

const SellerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/sellers/login', { email, password });
      console.log("Login Response:", res.data); // কনসোলে রেসপন্স চেক করার জন্য

      // ব্যাকএন্ড থেকে ডেটা সরাসরি বা nested যেভাবেই আসুক না কেন তা ধরার ব্যবস্থা
      const sellerData = res.data.seller || res.data;
      const sellerId = sellerData?._id || sellerData?.id;

      if (sellerId) {
        localStorage.setItem('currentSellerId', sellerId);
        localStorage.setItem('sellerLoggedIn', 'true');
        localStorage.setItem('sellerEmail', sellerData.email || '');
        localStorage.setItem('sellerInfo', JSON.stringify(sellerData));
        
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }

        alert('সফলভাবে লগইন হয়েছে!');
        navigate('/seller/dashboard');
      } else {
        alert('লগইন সফল হয়েছে কিন্তু সেলার আইডি পাওয়া যায়নি।');
      }
    } catch (err) {
      console.error('Login Error:', err);
      alert(err.response?.data?.message || 'ভুল ইমেইল অথবা পাসওয়ার্ড!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-sm w-full p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500 text-slate-900 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">সেলার লগইন</h2>
          <p className="text-xs text-gray-500">আপনার ড্যাশবোর্ডে প্রবেশ করতে লগইন করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ইমেইল ঠিকানা</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seller@mail.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="******" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 rounded-xl transition shadow-lg cursor-pointer">
            লগইন করুন
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          নতুন সেলার? <Link to="/seller/signup" className="font-bold text-amber-600 hover:underline">নতুন অ্যাকাউন্ট খুলুন</Link>
        </p>
      </div>
    </div>
  );
};

export default SellerLogin;