import React, { useState, useEffect } from 'react';
import { Store, User, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
import API from '../../api/axios';

const SellerAccount = () => {
  const [sellerInfo, setSellerInfo] = useState({
    ownerName: '',
    shopName: '',
    email: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const fetchSellerData = async () => {
      const currentSellerId = localStorage.getItem('currentSellerId');
      if (!currentSellerId) return;

      try {
        const res = await API.get(`/sellers/${currentSellerId}`);
        setSellerInfo(res.data);
      } catch (err) {
        console.error('Failed to load seller profile:', err);
      }
    };

    fetchSellerData();
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-sans">
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b pb-6">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center font-black text-2xl">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{sellerInfo.shopName || 'দোকানের নাম'}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> সেলার অ্যাকাউন্ট প্রোফাইল
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-1">
              <User className="w-3.5 h-3.5 text-amber-500" /> মালিকের নাম
            </span>
            <p className="text-sm font-bold text-slate-800">{sellerInfo.ownerName || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-1">
              <Store className="w-3.5 h-3.5 text-amber-500" /> শপ বা দোকানের নাম
            </span>
            <p className="text-sm font-bold text-slate-800">{sellerInfo.shopName || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-1">
              <Mail className="w-3.5 h-3.5 text-amber-500" /> ইমেইল ঠিকানা
            </span>
            <p className="text-sm font-bold text-slate-800">{sellerInfo.email || 'N/A'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-1">
              <Phone className="w-3.5 h-3.5 text-amber-500" /> মোবাইল নম্বর
            </span>
            <p className="text-sm font-bold text-slate-800">{sellerInfo.phone || 'N/A'}</p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500" /> দোকানের ঠিকানা
          </span>
          <p className="text-sm font-bold text-slate-800">{sellerInfo.address || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default SellerAccount;