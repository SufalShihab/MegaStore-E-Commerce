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
        const { data } = await API.get(`/products${location.search}`);
        
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data.products && Array.isArray(data.products)) {
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
    <div className="space-y-6 sm:space-y-8">
      
      {/* Hero Banner */}
      <div className="w-full">
        <HeroSlider />
      </div>

      {/* Product Section */}
      <div className="px-2 sm:px-4">
        <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          সাম্প্রতিক প্রোডাক্ট সমূহ
        </h2>
        
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-10">কোনো প্রোডাক্ট পাওয়া যায়নি।</p>
        ) : (
          /* 
             এখানে items-start যোগ করা হয়েছে যেন কার্ডগুলো লম্বায় স্ট্রেচ না হয়ে 
             নিজের আঁকারেই থাকে।
          */
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 lg:gap-5 items-stretch">
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