import React, { useEffect, useState } from 'react';
import API from '../../api/axios';
import { ShoppingBag, CheckCircle, Clock, Truck } from 'lucide-react';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      // ১. লোকাল স্টোরেজ থেকে সেলার আইডি নিয়ে আসুন
      const sellerId = localStorage.getItem('currentSellerId');
      
      if (!sellerId) {
        console.error("Seller ID পাওয়া যায়নি!");
        setLoading(false);
        return;
      }

      // ২. LocalStorage থেকে সেলারের নির্দিষ্ট টোকেন নেওয়া
      const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // ৩. সঠিক sellerId সহ API কল করা
      const { data } = await API.get(`/orders/seller?sellerId=${sellerId}`, config);
      setOrders(data);
    } catch (err) {
      console.error('অর্ডার ফেচ করতে সমস্যা হয়েছে:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // অর্ডার স্ট্যাটাস আপডেট হ্যান্ডলার
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('sellerToken') || localStorage.getItem('token');
      await API.put(`/orders/${orderId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('স্ট্যাটাস আপডেট ব্যর্থ হয়েছে:', err);
      alert('স্ট্যাটাস পরিবর্তন করা যায়নি।');
    }
  };

  if (loading) return <div className="text-center py-10 font-semibold text-gray-500">অর্ডার লোড হচ্ছে...</div>;

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-4 font-sans">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b pb-3 text-gray-800">
        <ShoppingBag className="text-amber-500" /> প্রাপ্ত অর্ডারসমূহ ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500 py-6">এখনো কোনো অর্ডার আসেনি।</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const orderId = order._id || order.id;
            return (
              <div key={orderId} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50 space-y-3">
                <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 border-b pb-2 gap-2">
                  <span>অর্ডার আইডি: #{orderId}</span>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3" /> {order.status || 'Pending'}
                    </span>
                    
                    {/* স্ট্যাটাস চেঞ্জ ড্রপডাউন */}
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => handleStatusChange(orderId, e.target.value)}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 outline-none font-medium text-gray-700"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* গ্রাহকের তথ্য */}
                <div className="text-xs text-gray-700 space-y-0.5">
                  <p><strong className="font-semibold text-gray-900">গ্রাহক:</strong> {order.customer?.name || order.shippingAddress?.fullName || "অজানা"}</p>
                  <p><strong className="font-semibold text-gray-900">মোবাইল:</strong> {order.shippingAddress?.phone || "N/A"}</p>
                  <p><strong className="font-semibold text-gray-900">ঠিকানা:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.district}</p>
                </div>

                {/* অর্ডারকৃত আইটেম তালিকা */}
                <div className="bg-white rounded-lg p-3 border border-gray-100 text-xs divide-y">
                  {(order.orderItems || []).map((item, idx) => (
                    <div key={idx} className="py-1.5 flex justify-between items-center">
                      <span className="font-medium text-gray-800">{item.title || item.name} (x{item.quantity})</span>
                      <span className="font-bold text-gray-700">৳{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-sm font-bold text-gray-800 pt-1">
                  <span>মোট বিল:</span>
                  <span className="text-amber-600">৳{order.totalPrice}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;