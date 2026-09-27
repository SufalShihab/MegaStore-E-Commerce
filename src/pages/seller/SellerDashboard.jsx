import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, DollarSign, Store, Mail, Phone, MapPin, User, Trash2 } from 'lucide-react';
import API from '../../api/axios';

const SellerDashboard = () => {
  const [sellerInfo, setSellerInfo] = useState({
    ownerName: '',
    shopName: '',
    email: '',
    phone: '',
    address: ''
  });

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentSellerId = localStorage.getItem('currentSellerId');
      if (!currentSellerId) return;

      // ১. সেলার প্রোফাইল লোড
      try {
        const sellerRes = await API.get(`/sellers/${currentSellerId}`);
        setSellerInfo(sellerRes.data);
      } catch (err) {
        console.error('Error fetching seller info:', err);
      }

      // ২. এই সেলারের প্রোডাক্টস লোড
      try {
        const productsRes = await API.get(`/products?sellerId=${currentSellerId}`);
        setProducts(productsRes.data);
      } catch (err) {
        console.error('Error fetching products:', err);
      }

      try {
        const ordersRes = await API.get(`/orders/seller?sellerId=${currentSellerId}`); 
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error('Error fetching seller orders:', err);
        setOrders([]);
      }
    };

    fetchDashboardData();
  }, []);

  // মোট অর্ডার এবং মোট বিক্রি হিসাব করা
  const totalOrdersCount = orders.length;
  const totalSalesAmount = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const handleDelete = async (id) => {
    if (window.confirm('আপনি কি এই প্রোডাক্টটি মুছে ফেলতে চান?')) {
      try {
        await API.delete(`/products/${id}`);
        setProducts(prev => prev.filter(p => p._id !== id));
        alert('প্রোডাক্ট সফলভাবে মুছে ফেলা হয়েছে।');
      } catch (err) {
        console.error('Delete error:', err);
        alert('প্রোডাক্ট মুছতে সমস্যা হয়েছে।');
      }
    }
  };

  return (
    <div className="space-y-3 md:space-y-3 font-sans px-3 sm:px-3 lg:px-8  max-w-7xl mx-auto">
{/* প্রোফাইল ব্যানার */}
<div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3.5 sm:p-4 rounded-xl shadow-lg border border-slate-700/50">
  <div className="flex items-start gap-3">
    {/* শপ আইকন */}
    <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 shadow-md shrink-0">
      <Store className="w-5 h-5" />
    </div>

    {/* টেক্সট ও ইনফরমেশন সেকশন */}
    <div className="space-y-1.5 min-w-0 flex-1">
      {/* টাইটেল ও ভেরিফাইড ব্যাজ */}
      <div className="flex items-center gap-2 flex-wrap">
        <h1 className="text-base font-bold truncate leading-none">
          {sellerInfo.shopName || 'মাই শপ'}
        </h1>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
          Verified Seller
        </span>
      </div>

      {/* কন্টাক্ট ইনফো এবং অ্যাড্রেস - সবগুলো একসাথে ফ্লো হবে */}
      <div className="text-[11px] sm:text-xs text-slate-300 flex items-center gap-x-3 gap-y-1 flex-wrap">
        <span className="flex items-center gap-1 shrink-0">
          <User className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{sellerInfo.ownerName || 'N/A'}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <Mail className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{sellerInfo.email || 'N/A'}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <Phone className="w-3 h-3 text-amber-400 shrink-0" />
          <span>{sellerInfo.phone || 'N/A'}</span>
        </span>

        {/* ছোট সাইজের ইনলাইন অ্যাড্রেস ট্যাগ (যা নিচে না নেমে বাকি তথ্যের সাথে মানিয়ে যাবে) */}
        <span className="inline-flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60 text-slate-300 text-[10px] sm:text-[11px]">
          <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate max-w-[150px] sm:max-w-none">
            {sellerInfo.address || 'ঠিকানা দেওয়া নেই'}
          </span>
        </span>
      </div>
    </div>
  </div>
</div>
      {/* স্ট্যাটস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">মোট বিক্রি</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">৳ {totalSalesAmount.toLocaleString()}</h3>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">মোট অর্ডার</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{totalOrdersCount} টি</h3>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <p className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider">আপলোড করা প্রোডাক্ট</p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">{products.length} টি</h3>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* প্রোডাক্ট টেবিল */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">আপনার প্রোডাক্টসমূহ</h2>
          <span className="text-xs bg-slate-100 font-bold px-2.5 py-1 rounded-full text-slate-600">মোট: {products.length}</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            আপনি এখনো কোনো প্রোডাক্ট আপলোড করেননি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] sm:text-xs font-bold text-gray-400 uppercase">
                  <th className="py-3 px-3">প্রোডাক্ট</th>
                  <th className="py-3 px-3">ক্যাটাগরি</th>
                  <th className="py-3 px-3">মূল্য</th>
                  <th className="py-3 px-3">স্টক</th>
                  <th className="py-3 px-3 text-center">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-3 flex items-center gap-3 max-w-[220px]">
                      <img src={item.image} alt={item.title} className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover bg-gray-100 border border-gray-100 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{item.title}</p>
                        <p className="text-[10px] sm:text-[11px] text-gray-400 truncate">ID: #{item._id}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-[11px] sm:text-xs font-semibold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg inline-block whitespace-nowrap">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-xs sm:text-sm font-black text-slate-900 whitespace-nowrap">৳ {item.price}</td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="text-[11px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        {item.stock || 1} টি
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button 
                        onClick={() => handleDelete(item._id)} 
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition cursor-pointer"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;