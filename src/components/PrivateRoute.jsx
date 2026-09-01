import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // আপনার login.jsx এ 'token' এবং 'user' নামে লোকাল স্টোরেজে সেভ করা হয়
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // যদি টোকেন বা ইউজার না থাকে, তবে সোজা লগইন পেজে পাঠিয়ে দেবে
  if (!token && !user) {
    return <Navigate to="/login" replace />;
  }

  // লগইন করা থাকলে চেকআউট বা পেমেন্ট পেজে যেতে দেবে
  return children;
};

export default PrivateRoute;