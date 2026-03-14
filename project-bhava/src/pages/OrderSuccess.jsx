import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Search, Home } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="flex justify-center mb-6">
        <div className="bg-emerald-100 p-4 rounded-full animate-bounce">
          <CheckCircle size={60} className="text-emerald-600" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Placed!</h1>
      <p className="text-slate-500 mb-10">Your food is being prepared with love.</p>
      
      <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-100 border border-slate-100 mb-10">
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mb-2">Your Token Number</p>
        <h2 className="text-6xl font-black text-indigo-600 tracking-tighter">#{token}</h2>
      </div>

      <div className="space-y-4">
        <Link 
          to={`/track?token=${token}`}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-4 rounded-2xl hover:bg-indigo-700 transition-colors"
        >
          <Search size={20} /> Track Live Status
        </Link>
        <Link 
          to="/"
          className="w-full flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-colors"
        >
          <Home size={20} /> Return to Menu
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
