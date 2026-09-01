import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  // sessionStorage থেকে চেক করা হচ্ছে (ট্যাব বন্ধ করলেই এটি মুছে যাবে)
  const isAdmin = sessionStorage.getItem('isAdmin');

  if (isAdmin !== 'true') {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;