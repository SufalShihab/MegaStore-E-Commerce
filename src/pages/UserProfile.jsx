import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Mail, Edit3, Package, Check, X } from 'lucide-react';
import API from '../api/axios';

const UserProfile = () => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

useEffect(() => {
    // লোকালস্টোরেজ থেকে ইনিশিয়াল ডাটা নেওয়া
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(savedUser);
    setFormData({
      name: savedUser.name || savedUser.username || '',
      phone: savedUser.phone || '',
      address: savedUser.address || ''
    });

    // সার্ভার থেকে লেটেস্ট ইউজার ডাটা এবং অর্ডার ফেচ করা
    const fetchUserDataAndOrders = async () => {
      try {
        // ইউজারের প্রোফাইল ডাটা আনার জন্য API কল (যদি আপনার প্রোফাইল গেট রুট থাকে)
        const profileRes = await API.get('/users/profile');
        if (profileRes.data) {
          const freshUser = profileRes.data.user || profileRes.data;
          setUser(freshUser);
          localStorage.setItem('user', JSON.stringify(freshUser));
          setFormData({
            name: freshUser.name || freshUser.username || '',
            phone: freshUser.phone || '',
            address: freshUser.address || ''
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }

      try {
        const orderRes = await API.get('/orders/my-orders');
        setOrders(orderRes.data || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchUserDataAndOrders();
  }, []);


  // ইউজারের অর্ডার হিস্ট্রি ফেচ করা
  const fetchUserOrders = async () => {
    try {
      const res = await API.get('/orders/my-orders');
      setOrders(res.data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  // MongoDB তে প্রোফাইল আপডেট করা
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.put('/users/profile', formData);
      const updatedUserData = res.data.user;

      // React state এবং LocalStorage আপডেট
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));

      alert('প্রোফাইল ও ঠিকানা সফলভাবে আপডেট হয়েছে!');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert('আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8 font-sans">
      <div className="max-w-6xl mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <User className="text-amber-500" /> Manage My Account
          </h1>
          <button 
            onClick={() => setIsEditing(!isEditing)} 
            className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg hover:bg-amber-100 transition"
          >
            {isEditing ? <><X className="w-4 h-4"/> Cancel</> : <><Edit3 className="w-4 h-4"/> Edit Profile</>}
          </button>
        </div>

        {/* Profile Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Personal Profile */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-gray-700 border-b pb-2 uppercase tracking-wide">Personal Profile</h2>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-4 h-4 text-gray-400" />
                <span className="font-semibold">{user.name || user.username || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{user.email || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{user.phone || 'ফোন নম্বর দেওয়া হয়নি'}</span>
              </div>
            </div>
          </div>

          {/* Address Book */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-sm font-bold text-gray-700 border-b pb-2 uppercase tracking-wide">Address Book</h2>
            
            <div className="space-y-2 text-sm">
              <span className="inline-block text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold uppercase">
                Default Shipping Address
              </span>
              <div className="flex items-start gap-3 text-gray-700 pt-1">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-gray-800">{user.name || user.username}</p>
                  <p className="text-gray-600 text-xs mt-1 leading-relaxed">
                    {user.address || 'কোনো ঠিকানা সেভ করা নেই। Edit Profile এ ক্লিক করে ঠিকানা যোগ করুন।'}
                  </p>
                  {user.phone && <p className="text-gray-500 text-xs mt-1">(+880) {user.phone}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Profile Form Modal/Section */}
        {isEditing && (
          <form onSubmit={handleUpdateProfile} className="bg-white p-6 rounded-xl shadow-md border border-amber-200 space-y-4">
            <h3 className="text-md font-bold text-gray-800 border-b pb-2">তথ্য আপডেট করুন</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">নাম</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg text-xs outline-none focus:border-amber-500" 
                  required 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">ফোন নম্বর</label>
                <input 
                  type="text" 
                  value={formData.phone} 
                  placeholder="017XXXXXXXX"
                  onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                  className="w-full p-2.5 border rounded-lg text-xs outline-none focus:border-amber-500" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">সম্পূর্ণ ঠিকানা (জেলা, থানা, বাসা/রোড নম্বর)</label>
              <textarea 
                rows="2" 
                value={formData.address} 
                placeholder="সম্পূর্ণ ঠিকানা (জেলা, থানা, বাসা/রোড নম্বর)"
                onChange={(e) => setFormData({...formData, address: e.target.value})} 
                className="w-full p-2.5 border rounded-lg text-xs outline-none focus:border-amber-500" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-6 py-2.5 rounded-lg text-xs transition flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> {loading ? 'সেভ হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
            </button>
          </form>
        )}

        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-sm font-bold text-gray-700 border-b pb-2 uppercase tracking-wide flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-500" /> Recent Orders ({orders.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b">
                  <th className="p-3">Order #</th>
                  <th className="p-3">Placed On</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y text-gray-700">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-semibold text-sky-600">#{order._id.slice(-8)}</td>
                      <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {order.orderItems?.map((item, index) => (
                            <img key={index} src={item.image} alt="item" className="w-8 h-8 object-cover rounded border" />
                          ))}
                        </div>
                      </td>
                      <td className="p-3 font-bold">৳ {order.totalPrice}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${order.isDelivered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {order.isDelivered ? 'Delivered' : 'Processing'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-400">কোনো অর্ডারের তথ্য পাওয়া যায়নি।</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};




export default UserProfile;