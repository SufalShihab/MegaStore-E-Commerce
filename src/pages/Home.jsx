import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import ProductCard from '../components/ProductCard';
import HeroSlider from '../components/HeroSlider';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        // সরাসরি MongoDB (Backend API) থেকে ডাটা কল করা হচ্ছে
        const { data } = await API.get(`/products${location.search}`);
        
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
          // যদি রেসপন্সে { products: [...] } আকারে আসে
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error('প্রোডাক্ট লোড করতে এরর:', err);
        setError('প্রোডাক্ট লোড করতে সমস্যা হয়েছে। ডাটাবেজ কানেকশন চেক করুন।');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [location.search]);

  if (loading) {
    return <div className="text-center py-20 font-semibold text-gray-600">প্রোডাক্ট লোড হচ্ছে...</div>;
  }

  if (error && products.length === 0) {
    return <div className="text-center py-20 text-rose-500 font-semibold">{error}</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* Hero Banner */}
      <div className="w-full">
        <HeroSlider />
      </div>

      {/* Product Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">সাম্প্রতিক প্রোডাক্ট সমূহ</h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;