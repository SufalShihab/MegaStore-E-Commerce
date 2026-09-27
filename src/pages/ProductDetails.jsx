import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingCart, ShieldCheck, RefreshCw, Truck, 
  MapPin, Camera, Tag
} from 'lucide-react';
import API from '../api/axios';
import { useCartStore } from '../store/useCartStore';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // কমেন্ট ও রিভিউর স্টেট
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewImage, setReviewImage] = useState('');

  // প্রশ্ন ও উত্তরের স্টেট
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState('');

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      let foundProduct = null;

      try {
        const res = await API.get(`/products/${id}`);
        foundProduct = res.data;
      } catch (err) {
        console.warn('API থেকে প্রডাক্ট পাওয়া যায়নি, LocalStorage চেক করা হচ্ছে...');
      }

      if (!foundProduct) {
        const localProducts = JSON.parse(localStorage.getItem('products')) || [];
        foundProduct = localProducts.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
      }

      if (foundProduct) {
        setProduct(foundProduct);
        const mainImg = foundProduct.image || foundProduct.images?.[0] || 'https://via.placeholder.com/400';
        setSelectedImage(mainImg);
        setReviews(foundProduct.reviews || []);
        setQuestions(foundProduct.questions || []);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!token) return alert('কমেন্ট করতে প্রথমে লগইন করুন!');
    if (!newComment.trim()) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      };

      const reviewData = {
        rating: newRating,
        comment: newComment,
        images: reviewImage ? [reviewImage] : []
      };

      const res = await API.post(`/products/${id}/reviews`, reviewData, config);
      
      setReviews(res.data.reviews || [res.data, ...reviews]);
      setNewComment('');
      setReviewImage('');
      alert('আপনার কমেন্ট সফলভাবে পোস্ট হয়েছে!');
    } catch (err) {
      console.error('Review submit error:', err);
      alert(err.response?.data?.message || 'কমেন্ট পোস্ট করতে সমস্যা হয়েছে।');
    }
  };

  const handleAddQuestion = (e) => {
    e.preventDefault();
    if (!token) return alert('প্রশ্ন করতে প্রথমে লগইন করুন!');
    if (!newQuestion.trim()) return;

    const newQ = {
      id: Date.now(),
      userName: user.name || user.username || 'ইউজার',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      question: newQuestion,
      answer: 'উত্তর শীঘ্রই দেওয়া হবে...',
      answeredBy: product?.sellerName || 'Seller'
    };

    setQuestions([newQ, ...questions]);
    setNewQuestion('');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);

    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      alert('চেকআউট করতে হলে প্রথমে লগইন করুন!');
      localStorage.setItem('redirectPath', '/checkout');
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  const handleAddToCartClick = () => {
    addToCart(product, quantity);
    alert('প্রডাক্টটি সফলভাবে কার্টে যোগ করা হয়েছে!');
  };

  if (loading) return <div className="text-center py-10 font-bold text-gray-600">প্রোডাক্ট লোড হচ্ছে...</div>;
  if (!product) return <div className="text-center py-10 text-rose-500 font-bold">প্রোডাক্ট পাওয়া যায়নি!</div>;

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image || 'https://via.placeholder.com/400'];

  return (
    <div className="bg-gray-100 min-h-screen py-2 font-sans">
      <div className="max-w-7xl mx-auto px-1 sm:px-3 space-y-2 sm:space-y-4">
        
        {/* TOP SECTION: Product Details */}
        <div className="bg-white rounded-md shadow-sm p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Image Gallery */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-2">
            <div className="border rounded-md overflow-hidden h-72 sm:h-80 md:h-96 flex items-center justify-center bg-gray-50">
              <img 
                src={selectedImage} 
                alt={product.title || product.name} 
                className="w-full h-full object-contain" 
              />
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {productImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 border rounded overflow-hidden shrink-0 transition-all ${
                      selectedImage === img ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-gray-200 opacity-80'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7 xl:col-span-5 space-y-3">
            <h1 className="text-base sm:text-xl font-semibold text-gray-800 leading-snug">
              {product.title || product.name}
            </h1>
            
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
                <span className="ml-1 text-gray-700 font-semibold">{reviews.length} Ratings</span>
              </div>
              <span>|</span>
              <span>{questions.length} Answered Questions</span>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 border-y py-1.5 border-gray-100">
              <span>Brand: <span className="text-sky-600 font-semibold">{product.brand || 'No Brand'}</span></span>
              <span>|</span>
              <span>Category: <span className="text-amber-600 font-semibold">{product.category || 'General'}</span></span>
            </div>

            <div className="bg-emerald-600 text-white px-3 py-1.5 rounded flex justify-between items-center text-xs font-bold">
              <span>SHOP NOW!</span>
              <span className="bg-amber-400 text-slate-900 px-2 py-0.5 rounded text-[10px]">PAYDAY SALE</span>
            </div>

            <div className="space-y-0.5">
              <div className="text-2xl font-bold text-amber-600">৳ {product.price}</div>
              {(product.originalPrice || product.oldPrice) && (
                <div className="text-xs text-gray-400 line-through">
                  ৳ {product.originalPrice || product.oldPrice}
                </div>
              )}
            </div>

            {product.stock && (
              <div className="text-xs font-semibold text-emerald-600">
                In Stock: {product.stock} items available
              </div>
            )}

            <div className="flex items-center gap-3 text-xs pt-1">
              <span className="text-gray-500 font-medium">Quantity:</span>
              <div className="flex items-center border rounded overflow-hidden">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-2.5 py-1 bg-gray-100 font-bold hover:bg-gray-200"
                >-</button>
                <span className="px-3 py-1 font-semibold text-gray-800">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="px-2.5 py-1 bg-gray-100 font-bold hover:bg-gray-200"
                >+</button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded text-xs sm:text-sm transition-colors shadow-sm"
              >
                Buy Now
              </button>

              <button 
                onClick={handleAddToCartClick}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-2.5 rounded text-xs sm:text-sm transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </button>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="lg:col-span-12 xl:col-span-3 bg-gray-50 p-3 rounded-md space-y-3 text-xs border border-gray-100">
            <div>
              <span className="text-gray-400 font-medium block mb-1">Delivery Options</span>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-700 leading-tight">
                    {user?.address || user?.location || 'Rajshahi, Chapai Nawabganj'}
                  </div>
                  <button 
                    onClick={() => navigate('/profile')} 
                    className="text-amber-600 text-[10px] cursor-pointer font-bold hover:underline mt-0.5 inline-block"
                  >
                    CHANGE
                  </button>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            <div className="flex items-start gap-2">
              <Truck className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-gray-700">Standard Delivery</div>
                <span className="text-gray-400 text-[10px]">
                  Guaranteed in {product.deliveryTime || '2-4 days'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0" />
              <span className="text-gray-700 font-semibold">
                {product.cashOnDelivery !== false ? 'Cash on Delivery Available' : 'Cash on Delivery Unavailable'}
              </span>
            </div>

            <hr className="border-gray-200" />

            <div>
              <span className="text-gray-400 font-medium block mb-1">Return & Warranty</span>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-gray-700">
                    {product.returnPolicy || '14 days easy return'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-500 shrink-0" />
                  <span className="text-gray-700">
                    {product.warranty || 'Warranty not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product details description */}
        <div className="bg-white rounded-md shadow-sm p-3 sm:p-5 space-y-3">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 border-b pb-1.5">
            Product details of {product.title || product.name}
          </h2>
          <div className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {product.description || 'no description available.'}
          </div>
          
          {product.tags && (
            <div className="pt-2 border-t flex items-center gap-2 text-xs">
              <Tag className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="font-semibold text-gray-700">Tags:</span>
              <span className="text-gray-500">{product.tags}</span>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-md shadow-sm p-3 sm:p-5 space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 border-b pb-1.5">Ratings & Reviews</h2>
          
          <form onSubmit={handleAddReview} className="bg-gray-50 p-2.5 sm:p-3 rounded border border-gray-100 space-y-2">
            <h3 className="text-xs font-bold text-gray-700">রিভিউ বা মতামত লিখুন:</h3>
            <textarea
              rows="2"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="পণ্য সম্পর্কে আপনার মন্তব্য লিখুন..."
              className="w-full p-2 border rounded text-xs outline-none focus:border-amber-500 bg-white"
            />
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 cursor-pointer bg-white border border-gray-300 text-gray-600 px-2.5 py-1 rounded text-xs hover:bg-gray-100">
                  <Camera className="w-3.5 h-3.5 text-amber-500" />
                  <span>ছবি যুক্ত করুন</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {reviewImage && <span className="text-[10px] text-emerald-600 font-bold">✓ ছবি সিলেক্ট হয়েছে</span>}
              </div>

              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold px-4 py-1 rounded text-xs transition-colors">
                পোস্ট করুন
              </button>
            </div>
          </form>

          <div className="space-y-3">
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-400">এখনো কোনো রিভিউ দেওয়া হয়নি।</p>
            ) : (
              reviews.map((rev) => (
                <div key={rev._id || rev.id} className="border-b last:border-b-0 pb-3 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-700">{rev.userName}</span>
                    <span className="text-gray-400 text-[10px]">{rev.date}</span>
                  </div>
                  <p className="text-xs text-gray-600">{rev.comment}</p>
                  {rev.images && rev.images.length > 0 && (
                    <div className="flex gap-1.5 pt-1 overflow-x-auto">
                      {rev.images.map((img, i) => (
                        <img key={i} src={img} alt="review" className="w-12 h-12 object-cover border rounded shrink-0" />
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Q&A Section */}
        <div className="bg-white rounded-md shadow-sm p-3 sm:p-5 space-y-4">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 border-b pb-1.5">
            Questions About This Product ({questions.length})
          </h2>
          
          <form onSubmit={handleAddQuestion} className="flex gap-2">
            <input 
              type="text" 
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your question(s) here..." 
              className="flex-1 p-2 border rounded text-xs outline-none focus:border-amber-500"
            />
            <button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded text-xs uppercase shrink-0">
              Ask Question
            </button>
          </form>

          <div className="space-y-3">
            {questions.length === 0 ? (
              <p className="text-xs text-gray-400">এখনো কোনো প্রশ্ন করা হয়নি।</p>
            ) : (
              questions.map((q) => (
                <div key={q.id} className="border-b last:border-b-0 pb-2.5 space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5">
                    <span className="bg-sky-500 text-white font-bold text-[9px] px-1 py-0.5 rounded shrink-0 mt-0.5">Q</span>
                    <div>
                      <span className="font-semibold text-gray-800">{q.question}</span>
                      <div className="text-[10px] text-gray-400">{q.userName} - {q.date}</div>
                    </div>
                  </div>
                  {q.answer && (
                    <div className="flex items-start gap-1.5 pl-4">
                      <span className="bg-gray-400 text-white font-bold text-[9px] px-1 py-0.5 rounded shrink-0 mt-0.5">A</span>
                      <div>
                        <span className="text-gray-600">{q.answer}</span>
                        <div className="text-[10px] text-gray-400">{q.answeredBy}</div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;