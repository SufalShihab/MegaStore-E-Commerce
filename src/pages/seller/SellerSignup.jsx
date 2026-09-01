import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Mail, Phone, Lock, MapPin } from 'lucide-react';
import API from '../../api/axios'; // axios instance

const SellerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/sellers/signup', formData);
      console.log("Signup Response:", res.data); // কনসোলে রেসপন্স চেক করার জন্য

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

        alert('সেলার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!');
        navigate('/seller/dashboard');
      } else {
        alert('সাইনআপ সফল হয়েছে কিন্তু সেলার আইডি পাওয়া যায়নি।');
      }
    } catch (err) {
      console.error('Signup Error:', err);
      alert(err.response?.data?.message || 'সাইনআপ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white max-w-md w-full p-8 rounded-3xl shadow-lg border border-gray-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500 text-slate-900 rounded-2xl mx-auto flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/30">
            <Store className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">সেলার সাইনআপ</h2>
          <p className="text-xs text-gray-500">নতুন শপ দিয়ে আপনার বিজনেস শুরু করুন</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">দোকানের নাম *</label>
            <div className="relative">
              <Store className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input type="text" name="shopName" required value={formData.shopName} onChange={handleChange} placeholder="রহিম স্টোর" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">মালিকের নাম *</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input type="text" name="ownerName" required value={formData.ownerName} onChange={handleChange} placeholder="রহিম চৌধুরী" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ইমেইল *</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="seller@mail.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">ফোন নম্বর *</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="01700000000" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">ঠিকানা</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="ঢাকা, বাংলাদেশ" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">পাসওয়ার্ড *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="******" className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3 rounded-xl transition shadow-lg cursor-pointer">
            সাইনআপ করুন
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          আগে থেকেই অ্যাকাউন্ট আছে? <Link to="/seller/login" className="font-bold text-amber-600 hover:underline">লগইন করুন</Link>
        </p>
      </div>
    </div>
  );
};

export default SellerSignup;