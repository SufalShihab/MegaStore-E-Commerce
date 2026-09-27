import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

const ProductCard = ({ product }) => {
  const { addToCart } = useCartStore();

  if (!product) return null;

  const productId = product._id || product.id;
  const productImage = product.image || product.images?.[0] || 'https://via.placeholder.com/200';
  const productTitle = product.title || product.name || 'নতুন প্রোডাক্ট';

  return (
    <div className="bg-white rounded-lg sm:rounded-xl border border-gray-100 p-1.5 sm:p-2.5 shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between h-full">
      <div>
        {/* মোবাইলে aspect-[4/3] (আড়াআড়ি চওড়া) এবং বড় স্ক্রিনে aspect-square */}
        <Link to={`/product/${productId}`} className="block mb-1 sm:mb-2">
          <div className="w-full aspect-[4/3] sm:aspect-square overflow-hidden rounded-md sm:rounded-lg bg-gray-50 cursor-pointer relative">
            <img 
              src={productImage} 
              alt={productTitle} 
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* রেটিং */}
        <div className="flex items-center gap-1 text-amber-500 text-[9px] sm:text-[10px] font-semibold mb-0.5">
          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-500" />
          <span>{product.rating || 4.5}</span>
        </div>

        {/* টাইটেল */}
        <Link to={`/product/${productId}`}>
          <h3 className="font-semibold text-gray-800 text-[11px] sm:text-xs truncate hover:text-amber-600 transition-colors cursor-pointer leading-tight" title={productTitle}>
            {productTitle}
          </h3>
        </Link>
      </div>

      {/* ফুটার (মূল্য ও বাটন) */}
      <div className="mt-1.5 pt-1 sm:pt-1.5 border-t border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-[8px] sm:text-[9px] text-gray-400 leading-none">মূল্য</p>
          <p className="text-[11px] sm:text-xs md:text-sm font-extrabold text-amber-600 mt-0.5">
            ৳{product.price ? product.price.toLocaleString() : '0'}
          </p>
        </div>

        <button 
          onClick={() => addToCart(product)}
          className="p-1 sm:p-1.5 bg-amber-500/10 hover:bg-amber-500 active:scale-95 text-amber-600 hover:text-slate-900 rounded-md sm:rounded-lg transition-all cursor-pointer font-bold shrink-0"
          title="কার্টে যোগ করুন"
          aria-label="Add to cart"
        >
          <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;