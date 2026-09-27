import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { Plus, Package, Trash2, Store, User, Mail, Phone, MapPin, DollarSign, ShoppingBag } from 'lucide-react';

const SellerSideDashboard = () => {
  const [sellerInfo, setSellerInfo] = useState({
    ownerName: '',
    shopName: '',
    email: '',
    phone: '',
    address: ''
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: 1,
  });

  // ডাটা ফেচ করা
  useEffect(() => {
    const fetchDashboardData = async () => {
      const currentSellerId = localStorage.getItem('currentSellerId');
      
      try {
        if (currentSellerId) {
          const sellerRes = await API.get(`/sellers/${currentSellerId}`);
          setSellerInfo(sellerRes.data);
        }
      } catch (err) {
        console.error('Error fetching seller info:', err);
      }

      try {
        const { data } = await API.get('/products/seller');
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }

      try {
        if (currentSellerId) {
          const ordersRes = await API.get(`/orders/seller?sellerId=${currentSellerId}`);
          setOrders(ordersRes.data || []);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchDashboardData();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const { data } = await API.get('/products/seller');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // মোট হিসাব
  const totalSalesAmount = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
  const totalOrdersCount = orders.length;

  // নতুন প্রোডাক্ট আপলোড করা
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', formData);
      alert('প্রোডাক্ট সফলভাবে আপলোড হয়েছে!');
      setShowAddModal(false);
      setFormData({ title: '', description: '', price: '', category: '', image: '', stock: 1 });
      fetchSellerProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'প্রোডাক্ট আপলোড করতে সমস্যা হয়েছে');
    }
  };

  // প্রোডাক্ট ডিলিট করা
  const handleDelete = async (id) => {
    if (window.confirm('আপনি কি এই প্রোডাক্টটি মুছে ফেলতে চান?')) {
      try {
        await API.delete(`/products/${id}`);
        fetchSellerProducts();
      } catch (err) {
        alert('ডিলিট করতে সমস্যা হয়েছে');
      }
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 font-sans w-full">
      {/* প্রোফাইল ব্যানার */}
<div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-3 sm:p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-xl border border-slate-700/50 w-full overflow-hidden">
  <div className="flex items-center justify-between gap-3 w-full">
    
    {/* বাম পাশের অংশ: আইকন + সেলার ইনফো */}
    <div className="flex items-center gap-2.5 sm:gap-4 min-w-0 flex-1">
      {/* শপ আইকন */}
      <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shrink-0">
        <Store className="w-5 h-5 sm:w-7 sm:h-7" />
      </div>

      {/* সেলার ডিটেইলস (একদম ১-২ লাইনে রাখার জন্য) */}
      <div className="min-w-0 flex-1">
        {/* শপ নেম ও ভেরিফাইড ব্যাজ */}
        <div className="flex items-center gap-2">
          <h1 className="text-sm sm:text-xl font-black truncate max-w-[120px] sm:max-w-none">
            {sellerInfo.shopName || sellerInfo.ownerName || 'Shihab Hosen'}
          </h1>
          <span className="text-[9px] sm:text-xs bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded-full border border-emerald-500/30 whitespace-nowrap shrink-0">
            Verified
          </span>
        </div>

        {/* নাম, ইমেইল, ফোন - মোবাইলেও ইনলাইন থাকবে */}
        <div className="text-[10px] sm:text-xs text-slate-300 mt-0.5 flex items-center gap-x-2 sm:gap-x-4 whitespace-nowrap overflow-hidden text-ellipsis">
          <span className="flex items-center gap-1 shrink-0">
            <User className="w-3 h-3 text-amber-400" />
            <span className="truncate max-w-[70px] sm:max-w-none">{sellerInfo.ownerName || 'Shihab Hosen'}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Mail className="w-3 h-3 text-amber-400" />
            <span className="truncate max-w-[110px] sm:max-w-none">{sellerInfo.email || 'sufalshihab@gmail.com'}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Phone className="w-3 h-3 text-amber-400" />
            <span>{sellerInfo.phone || '01535072144'}</span>
          </span>
        </div>
      </div>
    </div>

    {/* ডান পাশের ঠিকানা ব্যাজ */}
    <div className="bg-slate-800/80 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-slate-700/60 flex items-center gap-1 text-[10px] sm:text-xs text-slate-300 shrink-0 whitespace-nowrap">
      <MapPin className="w-3 h-3 text-amber-400" />
      <span className="truncate max-w-[80px] sm:max-w-none">{sellerInfo.address || 'Chapai Nawabgonj'}</span>
    </div>

  </div>
</div>

      {/* স্ট্যাটস কার্ডস */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট বিক্রি</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">৳ {totalSalesAmount}</h3>
          </div>
          <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">মোট অর্ডার</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{totalOrdersCount} টি</h3>
          </div>
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
            <ShoppingBag className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between sm:col-span-2 md:col-span-1">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">আপলোড করা প্রোডাক্ট</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{products.length} টি</h3>
          </div>
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* হেডার এবং প্রোডাক্ট টেবিল */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-500" />
            আপনার প্রোডাক্টসমূহ ({products.length})
          </h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            নতুন প্রোডাক্ট যোগ করুন
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">লোডিং হচ্ছে...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">এখনো কোনো প্রোডাক্ট যোগ করেননি।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase">
                  <th className="py-3 px-4">ছবি</th>
                  <th className="py-3 px-4">টাইটেল</th>
                  <th className="py-3 px-4">ক্যাটাগরি</th>
                  <th className="py-3 px-4">মূল্য</th>
                  <th className="py-3 px-4">স্টক</th>
                  <th className="py-3 px-4 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm text-gray-700">
                {products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50/50 transition">
                    <td className="py-3 px-4">
                      <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg bg-gray-100 border border-gray-100" />
                    </td>
                    <td className="py-3 px-4 font-semibold truncate max-w-xs">{item.title}</td>
                    <td className="py-3 px-4">
                      <span className="text-xs bg-gray-100 px-2.5 py-1 rounded-full font-medium text-gray-600">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">৳{item.price}</td>
                    <td className="py-3 px-4">{item.stock || 1} টি</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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

      {/* প্রোডাক্ট যোগ করার মোডাল */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">নতুন প্রোডাক্ট যুক্ত করুন</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-600">টাইটেল</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border p-2 rounded-lg text-sm outline-none focus:border-slate-800" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">বিবরণ</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2 rounded-lg text-sm outline-none focus:border-slate-800 h-20" 
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-semibold text-gray-600">মূল্য (৳)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full border p-2 rounded-lg text-sm outline-none focus:border-slate-800" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">ক্যাটাগরি</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border p-2 rounded-lg text-sm outline-none focus:border-slate-800" 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">ইমেজ URL</label>
                <input 
                  type="text" 
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full border p-2 rounded-lg text-sm outline-none focus:border-slate-800" 
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 border rounded-xl font-semibold text-sm hover:bg-gray-50 cursor-pointer"
                >
                  বাতিল
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 cursor-pointer"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerSideDashboard;