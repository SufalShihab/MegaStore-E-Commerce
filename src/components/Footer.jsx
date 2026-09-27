import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Store, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Share2, 
  MessageCircle, 
  Send, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Headphones 
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 font-sans border-t border-slate-800">
      {/* টপ ফিচার বার (Trust Badges) */}
      <div className="border-b border-slate-800/80 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">দ্রুত ডেলিভারি</h4>
              <p className="text-xs text-slate-400 mt-0.5">খুব দ্রুত আপনার ঠিকানায় পণ্য পৌঁছে দেওয়া হয়</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-colors">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">১০০% নিরাপদ পেমেন্ট</h4>
              <p className="text-xs text-slate-400 mt-0.5">ক্যাশ অন ডেলিভারি ও সুরক্ষিত অনলাইন পেমেন্ট</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800 hover:border-slate-700/80 transition-colors sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-xl flex items-center justify-center shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">২৪/৭ কাস্টমার সাপোর্ট</h4>
              <p className="text-xs text-slate-400 mt-0.5">যেকোনো প্রয়োজনে আমরা সবসময় পাশে আছি</p>
            </div>
          </div>
        </div>
      </div>

      {/* মূল ফুটার কন্টেন্ট */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
        
        {/* কোম্পানি পরিচিতি */}
        <div className="sm:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-slate-900 font-black shadow-lg shadow-amber-500/10">
              <Store className="w-6 h-6" />
            </div>
            <span className="text-xl font-black text-white tracking-wide">MegaStore</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
            আপনার পছন্দের সব পণ্য এক ছাদের নিচে। আমাদের মাল্টি-ভেন্ডর ই-কমার্স প্ল্যাটফর্ম থেকে সেরা মূল্যে ঘরে বসে সহজেই কেনাকাটা করুন এবং উপভোগ করুন দ্রুততম ডেলিভারি সেবা।
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#social" aria-label="Website" className="w-9 h-9 bg-slate-800 hover:bg-amber-500 hover:text-slate-900 text-slate-300 rounded-xl flex items-center justify-center transition-colors">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#social" aria-label="Share" className="w-9 h-9 bg-slate-800 hover:bg-amber-500 hover:text-slate-900 text-slate-300 rounded-xl flex items-center justify-center transition-colors">
              <Share2 className="w-4 h-4" />
            </a>
            <a href="#social" aria-label="Message" className="w-9 h-9 bg-slate-800 hover:bg-amber-500 hover:text-slate-900 text-slate-300 rounded-xl flex items-center justify-center transition-colors">
              <MessageCircle className="w-4 h-4" />
            </a>
            <a href="#social" aria-label="Send" className="w-9 h-9 bg-slate-800 hover:bg-amber-500 hover:text-slate-900 text-slate-300 rounded-xl flex items-center justify-center transition-colors">
              <Send className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* দ্রুত লিংকসমূহ */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            দ্রুত লিংক
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                হোম পেজ
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                সকল পণ্য
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                শপিং কার্ট
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                লগইন / রেজিস্টার
              </Link>
            </li>
          </ul>
        </div>

        {/* পলিসি ও শর্তাবলী */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            পলিসি ও শর্তাবলী
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm">
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                প্রাইভেসি পলিসি
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                ব্যবহারের শর্তাবলী
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                রিটার্ন ও রিফান্ড নীতি
              </Link>
            </li>
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5 group">
                <ArrowRight className="w-3.5 h-3.5 text-amber-500 group-hover:translate-x-0.5 transition-transform" /> 
                সেলার হোন
              </Link>
            </li>
          </ul>
        </div>

        {/* যোগাযোগ তথ্য */}
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-2">
            যোগাযোগ করুন
          </h3>
          <ul className="space-y-3 text-xs sm:text-sm text-slate-400">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-500 shrink-0" />
              <a href="tel:+8801700000000" className="hover:text-amber-400 transition-colors">+৮৮০ ১৭০০-০০০০০০</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-amber-500 shrink-0" />
              <a href="mailto:support@megastore.com" className="hover:text-amber-400 transition-colors">support@megastore.com</a>
            </li>
          </ul>
        </div>

      </div>

      {/* ফুটার বটম (কপিরাইট ও পেমেন্ট মেথড) */}
      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-slate-500">
          <p>© 2026 MegaStore Multi-Vendor E-Commerce. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center items-center gap-2.5 font-semibold text-slate-400">
            <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700/80">Bkash</span>
            <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700/80">Nagad</span>
            <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700/80">SSLCommerz</span>
            <span className="px-2.5 py-1 bg-slate-800/80 rounded-md border border-slate-700/80">COD</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;