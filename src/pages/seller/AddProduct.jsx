import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PackagePlus, Upload, Image as ImageIcon, Link as LinkIcon, Truck, Tag, CheckCircle2, X } from 'lucide-react';
import API from '../../api/axios';

const AddProduct = () => {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState('file');
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    originalPrice: '',
    brand: '',
    category: '',
    image: '', 
    stock: 10,
    deliveryTime: '2-4 days',
    returnPolicy: '14 days easy return',
    warranty: 'Warranty not available',
    cashOnDelivery: true,
    tags: '', // এখানে ব্যবহারকারী কী-ওয়ার্ড বা একাধিক নাম কমা দিয়ে লিখবে
    description: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('ফাইলের সাইজ ৫ MB এর নিচে হতে হবে!');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      alert('অনুগ্রহ করে প্রোডাক্টের ছবি আপলোড করুন অথবা লিংক দিন!');
      return;
    }

    const sellerId = localStorage.getItem('currentSellerId') || 'SELLER_DEFAULT';

    // ট্যাগগুলোকে কমা দিয়ে ভেঙে অ্যারে বা ক্লিন স্ট্রিং হিসেবে পাঠানো হচ্ছে
    const formattedTags = typeof formData.tags === 'string' 
      ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      : formData.tags;

    const newProduct = {
      sellerId: sellerId,
      title: formData.title,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
      brand: formData.brand,
      category: formData.category,
      image: formData.image,
      stock: Number(formData.stock) || 1,
      deliveryTime: formData.deliveryTime,
      returnPolicy: formData.returnPolicy,
      warranty: formData.warranty,
      cashOnDelivery: formData.cashOnDelivery,
      tags: formattedTags,
      description: formData.description,
      rating: 4.5
    };

    try {
      await API.post('/products', newProduct);
      alert('প্রোডাক্ট সফলভাবে MongoDB ডাটাবেজে আপলোড হয়েছে!');

      setFormData({
        title: '',
        price: '',
        originalPrice: '',
        brand: '',
        category: '',
        image: '',
        stock: 10,
        deliveryTime: '2-4 days',
        returnPolicy: '14 days easy return',
        warranty: 'Warranty not available',
        cashOnDelivery: true,
        tags: '',
        description: ''
      });

      const fileInput = document.getElementById('fileInput');
      if (fileInput) fileInput.value = '';

    } catch (err) {
      console.error('MongoDB-তে সেভ করতে সমস্যা হয়েছে:', err);
      alert(err.response?.data?.message || 'প্রোডাক্ট সেভ করা সম্ভব হয়নি।');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-sans pb-12">
      <div className="flex items-center justify-between border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <PackagePlus className="w-7 h-7 text-amber-500" /> নতুন প্রোডাক্ট যোগ করুন
          </h1>
          <p className="text-xs text-gray-500 mt-1">আপনার শপে নতুন প্রোডাক্ট যুক্ত করতে তথ্যগুলো সঠিকভাবে পূরণ করুন</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-600 border-b pb-3">মৌলিক তথ্য</h2>
            
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">প্রোডাক্টের নাম *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="যেমন: Wireless Bluetooth Speaker"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">মূল্য (৳) *</label>
                <input
                  type="number"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1200"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">পূর্বের মূল্য (৳) <span className="text-gray-400 font-normal">(ঐচ্ছিক)</span></label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  placeholder="1500"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">ব্র্যান্ড</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="যেমন: Samsung, Sony"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">স্টক পরিমাণ *</label>
                <input
                  type="number"
                  name="stock"
                  required
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="10"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">ক্যাটাগরি *</label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition bg-white"
                >
                  <option value="">ক্যাটাগরি বেছে নিন</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home Appliance">Home Appliances</option>
                  <option value="Groceries">Groceries</option>
                  <option value="Beauty & Health">Beauty & Health</option>
                  <option value="Gadgets">Gadgets</option>
                  <option value="Sports & Fitness">Sports & Fitness</option>
                  <option value="Baby & Toys">Baby & Toys</option>
                  <option value="Books & Stationery">Books & Stationery</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Automotive & Motorbike">Automotive & Motorbike</option>
                  <option value="Jewellery & Watches">Jewellery & Watches</option>
                  <option value="Pet Supplies">Pet Supplies</option>
                  <option value="Tools & Hardware">Tools & Hardware</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">বিবরণ (Description)</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="প্রোডাক্টের বিস্তারিত তথ্য ও বৈশিষ্ট্য লিখুন..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition resize-none"
              ></textarea>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-600 border-b pb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> ছবি ও মিডিয়া
            </h2>

            <div className="flex items-center gap-6 text-xs font-bold text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="uploadType"
                  checked={uploadType === 'file'}
                  onChange={() => setUploadType('file')}
                  className="accent-amber-500 w-4 h-4"
                />
                সরাসরি ফাইল আপলোড
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="uploadType"
                  checked={uploadType === 'url'}
                  onChange={() => setUploadType('url')}
                  className="accent-amber-500 w-4 h-4"
                />
                মিডিয়া URL
              </label>
            </div>

            {uploadType === 'file' ? (
              formData.image && formData.image.startsWith('data:image') ? (
                <div className="relative w-full h-48 rounded-2xl border border-gray-200 overflow-hidden group">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                    className="absolute top-3 right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-md hover:bg-rose-600 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label 
                  htmlFor="fileInput" 
                  className="border-2 border-dashed border-gray-200 hover:border-amber-400 transition rounded-2xl p-8 text-center bg-slate-50/50 cursor-pointer flex flex-col items-center justify-center block"
                >
                  <Upload className="w-8 h-8 text-amber-500 mb-2" />
                  <p className="text-xs font-bold text-slate-700">ফাইল নির্বাচন করতে ক্লিক করুন</p>
                  <p className="text-[11px] text-gray-400 mt-1">PNG, JPG, WEBP (সর্বোচ্চ 5MB)</p>
                  <input 
                    type="file" 
                    id="fileInput" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                  />
                </label>
              )
            ) : (
              <div className="relative">
                <LinkIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-600 border-b pb-3 flex items-center gap-2">
              <Truck className="w-4 h-4" /> ডেলিভারি ও সার্ভিস সেটিংস
            </h2>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">ডেলিভারি সময়</label>
              <input
                type="text"
                name="deliveryTime"
                value={formData.deliveryTime}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">রিটার্ন পলিসি</label>
              <input
                type="text"
                name="returnPolicy"
                value={formData.returnPolicy}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">ওয়ারেন্টি</label>
              <input
                type="text"
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
              />
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  name="cashOnDelivery"
                  checked={formData.cashOnDelivery}
                  onChange={handleChange}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                Cash on Delivery প্রযোজ্য
              </label>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-600 border-b pb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" /> এসইও ট্যাগ/অন্যান্য নাম (কী-ওয়ার্ড)
            </h2>

            <div>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="যেমন: speaker, sound box, wireless audio"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition"
              />
              <p className="text-[11px] text-gray-400 mt-1">কমা (,) দিয়ে প্রোডাক্টের বিভিন্ন বিকল্প নাম বা ট্যাগ দিন, যাতে ন্যাভ সার্চবারে সহজেই খুঁজে পাওয়া যায়।</p>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold py-3.5 rounded-2xl transition shadow-lg flex items-center justify-center gap-2 text-sm cursor-pointer"
          >
            <CheckCircle2 className="w-5 h-5 text-amber-400" /> প্রোডাক্ট সেভ করুন
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;