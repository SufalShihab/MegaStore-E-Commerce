import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, DollarSign, Package, Users, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import API from '../api/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    totalSales: 0, 
    totalOrders: 0, 
    totalProducts: 0, 
    totalSellers: 0 
  });
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);

  // ফর্ম ডাটা স্টেট
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image: '',
    link: '',
    bgColor: 'bg-purple-600'
  });

  useEffect(() => {
    fetchAdminStats();
    fetchBanners();
  }, []);

  // ডাটাবেজ থেকে স্ট্যাটস ফেচ করা
  const fetchAdminStats = async () => {
    try {
      const res = await API.get('/auth/admin/stats'); // আপনার রাউটের পাথ অনুযায়ী ঠিক করে নেবেন
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const fetchBanners = async () => {
    try {
      const res = await API.get('/hero');
      setBanners(res.data || []);
    } catch (err) {
      console.error('Banners fetch error:', err);
    }
  };

  // নতুন হিরো ব্যানার যোগ করা
  const handleAddBanner = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/hero', formData);
      alert('সফলভাবে হিরো ব্যানার যোগ করা হয়েছে!');
      setFormData({ title: '', subtitle: '', image: '', link: '', bgColor: 'bg-purple-600' });
      fetchBanners();
    } catch (err) {
      console.error(err);
      alert('ব্যানার যোগ করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  // ব্যানার ডিলিট করা
  const handleDeleteBanner = async (id) => {
    if (window.confirm('আপনি কি নিশ্চিত এই ব্যানারটি ডিলিট করতে চান?')) {
      try {
        await API.delete(`/hero/${id}`);
        alert('ব্যানার সফলভাবে মুছে ফেলা হয়েছে!');
        fetchBanners();
      } catch (err) {
        console.error(err);
        alert('ডিলিট করতে সমস্যা হয়েছে।');
      }
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen p-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* ড্যাশবোর্ড হেডার */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2">
              <LayoutDashboard className="text-amber-500 w-7 h-7" /> অ্যাডমিন কন্ট্রোল প্যানেল
            </h1>
            <p className="text-xs text-slate-500 mt-1">আপনার ই-কমার্স স্টোরের সামগ্রিক কার্যক্রম ও হিরো সেকশন এখান থেকে নিয়ন্ত্রণ করুন।</p>
          </div>
        </div>

        {/* স্ট্যাটিস্টিকস কার্ডস (মোট সেল, অর্ডার, প্রোডাক্ট ও সেলার) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* মোট সেলস */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট সেলস</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">৳ {stats.totalSales || 0}</h3>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* মোট অর্ডার */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট অর্ডার</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.totalOrders || 0}</h3>
            </div>
            <div className="p-4 bg-sky-50 text-sky-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* মোট প্রোডাক্ট */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট প্রোডাক্ট</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.totalProducts || 0}</h3>
            </div>
            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
          </div>

          {/* 🔥 মোট সেলার অ্যাকাউন্ট */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">মোট সেলার</p>
              <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.totalSellers || 0}</h3>
            </div>
            <div className="p-4 bg-purple-50 text-purple-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* হিরো সেকশন ও ব্যানার ম্যানেজমেন্ট */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ImageIcon className="text-amber-500 w-5 h-5" /> হিরো সেকশন ও ব্যানার ম্যানেজমেন্ট
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">হোমপেজের স্লাইডারের জন্য নতুন ব্যানার যুক্ত করুন বা অপ্রয়োজনীয় ব্যানার ডিলিট করুন।</p>
          </div>

          {/* হিরো ব্যানার আপলোড ফর্ম */}
          <form onSubmit={handleAddBanner} className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">নতুন হিরো ব্যানার আপলোড করুন</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ব্যানার ছবির লিংক (Image URL)</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/banner.jpg"
                  value={formData.image} 
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500"
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Shop Now বাটনের লিঙ্ক (Redirect Link)</label>
                <input 
                  type="text" 
                  placeholder="/products বা ক্যাটাগরি লিংক"
                  value={formData.link} 
                  onChange={(e) => setFormData({...formData, link: e.target.value})}
                  className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" /> {loading ? 'আপলোড হচ্ছে...' : 'ব্যানার পাবলিশ করুন'}
            </button>
          </form>

          {/* বিদ্যমান ব্যানারগুলোর তালিকা */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide">বর্তমান হিরো ব্যানারসমূহ ({banners.length})</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.length > 0 ? (
                banners.map((banner) => (
                  <div key={banner._id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl shadow-xs gap-4">
                    <img src={banner.image} alt="Banner" className="w-16 h-16 object-cover rounded-lg border shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{banner.title || 'ব্যানার শিরোনাম'}</h4>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{banner.subtitle || banner.link}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteBanner(banner._id)}
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer shrink-0"
                      title="ডিলিট করুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <p className="col-span-2 text-center text-xs text-slate-400 py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">কোনো হিরো ব্যানার পাওয়া যায়নি। ওপরে ফর্ম থেকে ব্যানার যোগ করুন।</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;