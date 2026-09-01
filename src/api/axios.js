import axios from 'axios';

const API = axios.create({
  baseURL:import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api', // আপনার ব্যাকএন্ডের বেস ইউআরএল
});

// 🛠️ Request Interceptor: প্রতিটি রিকোয়েস্টে টোকেন অটোমেটিক যুক্ত করার জন্য
API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo') || localStorage.getItem('user');
  
  if (userInfo) {
    const parsedUser = JSON.parse(userInfo);
    const token = parsedUser.token || localStorage.getItem('token');
    
    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }
  }
  return req;
});

export default API;