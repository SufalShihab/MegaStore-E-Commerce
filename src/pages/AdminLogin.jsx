import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Lock, Mail, Key } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin-login', {
        email,
        password,
        secretKey,
      });

      if (response.data.success) {
        // সফল হলে লোকাল স্টোরেজে সেভ করে এডমিন ড্যাশবোর্ডে পাঠিয়ে দিন
       sessionStorage.setItem('isAdmin', 'true');
       sessionStorage.setItem('adminToken', response.data.token); // যদি টোকেন থাকে
       navigate('/admin-dashboard');
      }
    } catch (err) {
      // তথ্য ভুল হলে এরর দেখাবে এবং হোম পেজে ফেরত পাঠাবে
      setError(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে!');
      setTimeout(() => {
        navigate('/'); // হোম পেজে ফেরত পাঠিয়ে দেওয়া
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center space-y-2 mb-8">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-500 rounded-2xl mx-auto flex items-center justify-center border border-amber-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-white">এডমিন পোর্টাল</h2>
          <p className="text-xs text-slate-400">শুধুমাত্র কতৃপক্ষের প্রবেশের জন্য সংরক্ষিত</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
            {error} <br /> <span className="text-slate-400">হোম পেজে রিডাইরেক্ট করা হচ্ছে...</span>
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">এডমিন ইমেইল</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="admin@megastore.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">সিক্রেট কি (Secret Key)</label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                placeholder="1234567"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-10 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-xl transition shadow-lg mt-2"
          >
            {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;