import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/auth/login', formData);
      
      // টোকেন এবং ইউজার অবজেক্ট LocalStorage-এ সেভ
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user || data));

      // পেন্ডিং রিডাইরেক্ট পাথ চেক করা (যেমন: /checkout)
      const redirectPath = localStorage.getItem('redirectPath');

      if (data.role === 'seller' || data.user?.role === 'seller') {
        navigate('/seller');
      } else if (redirectPath) {
        localStorage.removeItem('redirectPath'); // ব্যবহার শেষে মুছে ফেলা
        navigate(redirectPath);
      } else {
        navigate('/');
      }
      
      // নেভবারে তাৎক্ষণিক নাম আপডেট করার জন্য পেজ রিফ্রেশ
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'লগইন করতে ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 bg-white p-8 rounded-2xl border-2 border-amber-500 shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">লগইন করুন</h2>
      
      {error && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-xs font-semibold rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">ইমেইল</label>
          <input 
            type="email" 
            required 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:border-amber-500"
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
            className="w-full px-4 py-2 border rounded-lg text-sm outline-none focus:border-amber-500"
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
        >
          {loading ? 'প্রসেসিং...' : 'লগইন'}
        </button>
      </form>

      <p className="text-xs text-center text-gray-500 mt-6">
        অ্যাকাউন্ট নেই? <Link to="/register" className="text-amber-600 font-bold">রেজিস্ট্রেশন করুন</Link>
      </p>
    </div>
  );
};

export default Login;