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
    <div className="space-y-8 font-sans">
      {/* প্রোফাইল ব্যানার */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center text-slate-900 text-2xl font-black shadow-lg shrink-0">
            <Store className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{sellerInfo.shopName || 'মাই শপ'}</h1>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/30">Verified Seller</span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-amber-400" /> {sellerInfo.ownerName || 'N/A'}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-amber-400" /> {sellerInfo.email || 'N/A'}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-amber-400" /> {sellerInfo.phone || 'N/A'}</span>
            </p>
          </div>
        </div>

        <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/60 flex items-center gap-2 text-xs text-slate-300 shrink-0">
          <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{sellerInfo.address || 'ঠিকানা দেওয়া নেই'}</span>
        </div>
      </div>

      {/* স্ট্যাটস */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট বিক্রি</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">৳ {totalSalesAmount}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট অর্ডার</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{totalOrdersCount} টি</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">আপনার আপলোড করা প্রোডাক্ট</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{products.length} টি</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* প্রোডাক্ট টেবিল */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b pb-4">
          <h2 className="text-lg font-bold text-slate-900">আপনার প্রোডাক্টসমূহ</h2>
          <span className="text-xs bg-slate-100 font-bold px-3 py-1 rounded-full text-slate-600">মোট: {products.length}</span>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">
            আপনি এখনো কোনো প্রোডাক্ট আপলোড করেননি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
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
                    <td className="py-3.5 px-3 flex items-center gap-3">
                      <img src={item.image} alt={item.title} className="w-11 h-11 rounded-xl object-cover bg-gray-100 border border-gray-100" />
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.title}</p>
                        <p className="text-[11px] text-gray-400">ID: #{item._id}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-lg">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-sm font-black text-slate-900">৳ {item.price}</td>
                    <td className="py-3.5 px-3">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                        {item.stock || 1} টি
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <button onClick={() => handleDelete(item._id)} className="p-2 text-slate-400 hover:text-red-500 transition cursor-pointer">
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