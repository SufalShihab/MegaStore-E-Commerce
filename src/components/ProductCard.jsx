import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();

  // MongoDB ObjectId (_id) বা সাধারণ id যেকোনো একটি ব্যাকএন্ড থেকে আসতে পারে
  const productId = product._id || product.id;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
      <div>
        {/* ছবি ও শিরোনামে লিঙ্ক যুক্ত করা হয়েছে */}
        <Link to={`/product/${productId}`}>
          <div className="relative overflow-hidden rounded-xl bg-gray-50 mb-3 aspect-square cursor-pointer">
            <img 
              src={product.image || 'https://via.placeholder.com/200'} 
              alt={product.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-500" />
          <span>{product.rating || 4.5}</span>
        </div>

        <Link to={`/product/${productId}`}>
          <h3 className="font-bold text-gray-800 text-sm line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer">
            {product.title}
          </h3>
        </Link>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">মূল্য</p>
          <p className="text-base font-extrabold text-amber-600">৳{product.price}</p>
        </div>

        <button 
          onClick={() => addToCart(product)}
          className="p-2.5 bg-amber-500/10 hover:bg-amber-500 text-amber-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer font-bold"
          title="কার্টে যোগ করুন"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;