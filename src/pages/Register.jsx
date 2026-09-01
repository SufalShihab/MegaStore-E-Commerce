import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/register', formData);
      
      // 🔥 সব ধরনের কি (Key) একসাথে সেভ করা হলো যাতে কোনো কম্পোনেন্টে মিসিং না হয়
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data));
      localStorage.setItem('userInfo', JSON.stringify(data));

      navigate('/');
      // নেভবার ও স্টেট আপডেট করার জন্য পেজ রিলোড
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border-2 border-amber-500 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">নতুন অ্যাকাউন্ট তৈরি করুন</h2>
      
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">পূর্ণ নাম</label>
          <input 
            type="text" 
            required 
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-white"
            placeholder="আপনার নাম লিখুন"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">ইমেইল</label>
          <input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-white"
            placeholder="example@mail.com"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">পাসওয়ার্ড</label>
          <input 
            type="password" 
            required 
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-white"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">ফোন নম্বর</label>
          <input 
            type="text" 
            required 
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-amber-500 bg-white"
            placeholder="01XXXXXXXXX"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-md mt-2"
        >
          {loading ? 'প্রসেসিং...' : 'রেজিস্ট্রেশন করুন'}
        </button>
      </form>

      <p className="text-xs text-center text-gray-600 mt-6">
        ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login" className="text-amber-600 font-bold hover:underline">লগইন করুন</Link>
      </p>
    </div>
  );
};

export default Register;