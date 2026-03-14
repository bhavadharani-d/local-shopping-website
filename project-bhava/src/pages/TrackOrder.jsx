import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../api/api';
import { Loader2, RefreshCw, ChevronLeft } from 'lucide-react';

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('token');
  
  const [token, setToken] = useState(tokenFromUrl || '');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStatus = async (tokenToFetch) => {
    if (!tokenToFetch) return;
    setLoading(true);
    setError('');
    try {
      const response = await getOrderDetails(tokenToFetch);
      if (response.data.data.length > 0) {
        setOrder(response.data.data[0]);
      } else {
        setOrder(null);
        setError("Token not found. Please check and try again.");
      }
    } catch (err) {
      setError("Failed to fetch order status.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenFromUrl) {
      fetchStatus(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStatus(token);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Order Received': return 'text-slate-500 bg-slate-100';
      case 'Preparing': return 'text-amber-600 bg-amber-50';
      case 'Ready': return 'text-emerald-600 bg-emerald-50';
      case 'Delivered': return 'text-indigo-600 bg-indigo-50';
      default: return 'text-slate-500 bg-slate-100';
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-10">
      <button onClick={() => navigate('/')} className="flex items-center text-slate-500 mb-6 hover:text-indigo-600 transition-colors">
        <ChevronLeft size={20} /> Back
      </button>

      <h1 className="text-3xl font-bold mb-8">Track Order</h1>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex gap-2">
          <input 
            type="number" 
            placeholder="Enter 4-digit Token" 
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1 bg-white border border-slate-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 disabled:bg-slate-300"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : "Track"}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-center mb-6">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-100 text-center">
          <p className="text-slate-400 text-sm font-medium uppercase mb-2">Order Status</p>
          <div className={`inline-block px-4 py-1 rounded-full font-bold text-sm mb-6 ${getStatusColor(order.order_status)}`}>
            {order.order_status}
          </div>
          
          <div className="space-y-4 text-left">
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">Token</span>
              <span className="font-bold text-slate-800">#{order.token}</span>
            </div>
            <div className="flex justify-between border-b border-slate-50 pb-2">
              <span className="text-slate-400">Total</span>
              <span className="font-bold text-slate-800">₹{order.total}</span>
            </div>
          </div>

          <button 
            onClick={() => fetchStatus(order.token)}
            className="mt-8 flex items-center justify-center gap-2 text-indigo-600 font-bold mx-auto hover:text-indigo-700"
          >
            <RefreshCw size={18} /> Refresh Status
          </button>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
