import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

const OrderSuccess = () => {
  return (
    <div className="max-w-md mx-auto my-16 px-4 text-center space-y-6">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
        <CheckCircle className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-black text-gray-800">অর্ডার সফল হয়েছে!</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          আপনার অর্ডারটি সফলভাবে গ্রহন করা হয়েছে। দ্রুতই আমাদের প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs text-gray-600 space-y-1">
        <p className="font-semibold text-gray-800">MegaStore ব্যবহারের জন্য  আন্তরিক ভাবে  ধন্যবাদ।।।</p>
        <p>আকর্ষণিও অফার নিয়ে  MegaStore সাথেই থাকুন ।।।</p>
      </div>

      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-bold transition-colors text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          আরও কেনাকাটা করুন
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;