import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { Plus, Package, Trash2 } from 'lucide-react';

const SellerDashboard = () => {
  const [products, setProducts] = useState([]);
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

  // সেলারের নিজস্ব প্রোডাক্ট ফেচ করা
  const fetchSellerProducts = async () => {
    try {
      const { data } = await API.get('/products/seller');
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  // নতুন প্রোডাক্ট আপলোড করা
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await API.post('/products', formData);
      alert('প্রোডাক্ট সফলভাবে আপলোড হয়েছে!');
      setShowAddModal(false);
      setFormData({ title: '', description: '', price: '', category: '', image: '', stock: 1 });
      fetchSellerProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'প্রোডাক্ট আপলোড করতে সমস্যা হয়েছে');
    }
  };

  // প্রোডাক্ট ডিলিট করা
  const handleDelete = async (id) => {

      try {
        await API.delete(`/products/${id}`);
        fetchSellerProducts();
      } catch (err) {
        alert('ডিলিট করতে সমস্যা হয়েছে');
      }
    
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">সেলার ড্যাশবোর্ড</h1>
          <p className="text-xs text-gray-500 mt-1">আপনার দোকানের প্রোডাক্ট এবং ক্যাটালগ ম্যানেজ করুন</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          নতুন প্রোডাক্ট যোগ করুন
        </button>
      </div>

      {/* প্রোডাক্ট টেবিল/লিস্ট */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          আপনার প্রোডাক্টসমূহ ({products.length})
        </h2>

        {loading ? (
          <p className="text-gray-500 text-sm">লোডিং হচ্ছে...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm">এখনো কোনো প্রোডাক্ট যোগ করেননি।</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
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
                  <tr key={item._id} className="hover:bg-gray-50/50">
                    <td className="py-3 px-4">
                      <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded-lg" />
                    </td>
                    <td className="py-3 px-4 font-semibold truncate max-w-xs">{item.title}</td>
                    <td className="py-2 px-3 text-xs bg-gray-100 rounded-full w-max">{item.category}</td>
                    <td className="py-3 px-4 font-bold text-primary">৳{item.price}</td>
                    <td className="py-3 px-4">{item.stock} টি</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => handleDelete(item._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
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

      {/* Product Add Modal */}
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
                  className="w-full border p-2 rounded-lg text-sm outline-none focus:border-primary" 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600">বিবরণ</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border p-2 rounded-lg text-sm outline-none focus:border-primary h-20" 
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
                    className="w-full border p-2 rounded-lg text-sm outline-none focus:border-primary" 
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">ক্যাটাগরি</label>
                  <input 
                    type="text" 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border p-2 rounded-lg text-sm outline-none focus:border-primary" 
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
                  className="w-full border p-2 rounded-lg text-sm outline-none focus:border-primary" 
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2 border rounded-xl font-semibold text-sm hover:bg-gray-50"
                >
                  বাতিল
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-hover"
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

export default SellerDashboard;