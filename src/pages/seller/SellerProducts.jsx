import React, { useState, useEffect } from 'react';
import { Package, Search, Trash2, RefreshCw } from 'lucide-react';
import API from '../../api/axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // সেলার ভিত্তিক প্রোডাক্ট লোড
  const loadProducts = async () => {
    setLoading(true);
    const currentSellerId = localStorage.getItem('currentSellerId');

    try {
      // ব্যাকএন্ড API থেকে শুধুমাত্র সেলারের প্রোডাক্ট চাওয়া
      const url = currentSellerId ? `/products?sellerId=${currentSellerId}` : '/products';
      const { data } = await API.get(url);
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('প্রোডাক্ট লোড করতে ব্যর্থ:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // ডিলিট হ্যান্ডলার
  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি এই প্রোডাক্টটি তালিকা থেকে মুছে ফেলতে চান?')) return;

    try {
      await API.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => (p._id !== id && p.id !== id)));
      alert('প্রোডাক্ট মুছে ফেলা হয়েছে।');
    } catch (err) {
      console.error('ডিলিট করতে সমস্যা হয়েছে:', err);
      alert('প্রোডাক্ট ডিলিট করা যায়নি।');
    }
  };

  const filteredProducts = products.filter(p => 
    (p.title || p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans pb-12">
      
      {/* হেডার */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <Package className="w-7 h-7 text-amber-500" /> সকল প্রোডাক্ট ({products.length})
          </h1>
          <p className="text-xs text-gray-500 mt-1">আপনার সেলার অ্যাকাউন্টের সকল প্রোডাক্টের তালিকা ও ব্যবস্থাপনা</p>
        </div>

        <button 
          onClick={loadProducts}
          className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-white border border-gray-200 hover:bg-slate-50 px-4 py-2.5 rounded-xl shadow-sm transition cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> রিফ্রেশ করুন
        </button>
      </div>

      {/* সার্চ */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="প্রোডাক্টের নাম বা ক্যাটাগরি দিয়ে খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm outline-none bg-transparent text-slate-800 placeholder-gray-400"
        />
      </div>

      {/* টেবিল */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-500 text-sm">প্রোডাক্ট লোড হচ্ছে...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            কোনো প্রোডাক্ট পাওয়া যায়নি।
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="py-4 px-6">প্রোডাক্ট</th>
                  <th className="py-4 px-4">ক্যাটাগরি</th>
                  <th className="py-4 px-4">মূল্য</th>
                  <th className="py-4 px-4">স্টক</th>
                  <th className="py-4 px-6 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => {
                  const pId = product._id || product.id;
                  const pTitle = product.title || product.name || 'শিরোনামহীন প্রোডাক্ট';
                  const pImage = product.image || product.img || 'https://via.placeholder.com/100';

                  return (
                    <tr key={pId} className="hover:bg-slate-50/60 transition">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={pImage} 
                            alt={pTitle} 
                            className="w-12 h-12 rounded-2xl object-cover bg-gray-50 border border-gray-100 shrink-0 shadow-sm"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{pTitle}</h3>
                            <p className="text-[11px] text-gray-400 mt-0.5">ID: #{String(pId).slice(-6)}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-xl">
                          {product.category || 'General'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm font-black text-slate-900">৳ {product.price}</span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-gray-400 line-through">৳ {product.originalPrice}</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          (product.stock || 0) > 0 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-rose-50 text-rose-500'
                        }`}>
                          {(product.stock || 0) > 0 ? `${product.stock} টি এভেলেবল` : 'স্টক আউট'}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => handleDelete(pId)} 
                          className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;