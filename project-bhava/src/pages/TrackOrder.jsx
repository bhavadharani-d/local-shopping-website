import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getOrderDetails } from '../api/api';
import { Loader2, RefreshCw, ChevronLeft, Clock, CheckCircle, Flame } from 'lucide-react';

const formatPickupTime = (pickupTime) => {
  if (!pickupTime) {
    return 'As scheduled';
  }

  return `Today at ${new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(pickupTime))}`;
};

const TrackOrder = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tokenFromUrl = searchParams.get('tokenNumber') || searchParams.get('token');

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
      if (response.data.data && response.data.data.length > 0) {
        setOrder(response.data.data[0]);
      } else {
        setOrder(null);
        setError('Token number not found. Please check and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch order status. Is the server running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenFromUrl) {
      fetchStatus(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  useEffect(() => {
    let interval;

    if (order && !['Ready', 'Collected'].includes(order.status)) {
      interval = setInterval(async () => {
        try {
          const response = await getOrderDetails(order.tokenNumber);
          if (response.data.data && response.data.data.length > 0) {
            setOrder(response.data.data[0]);
          }
        } catch (err) {
          console.error('Silent refresh failed', err);
        }
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [order]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStatus(token);
  };

  const getStatusTheme = (status) => {
    switch (status) {
      case 'Received':
        return {
          color: 'text-blue-600 bg-blue-50',
          icon: <Clock size={24} />,
          desc: 'Your pickup order has been received by the shop.',
        };
      case 'Accepted':
        return {
          color: 'text-violet-600 bg-violet-50',
          icon: <Clock size={24} />,
          desc: 'The shop has accepted your order and scheduled it for pickup.',
        };
      case 'Preparing':
        return {
          color: 'text-amber-600 bg-amber-50',
          icon: <Flame size={24} className="animate-pulse" />,
          desc: 'Your order is being prepared for pickup.',
        };
      case 'Ready':
        return {
          color: 'text-emerald-600 bg-emerald-50',
          icon: <CheckCircle size={24} />,
          desc: 'Your order is ready. You can send someone to collect it now.',
        };
      case 'Collected':
        return {
          color: 'text-slate-700 bg-slate-100',
          icon: <CheckCircle size={24} />,
          desc: 'This pickup order has already been collected.',
        };
      default:
        return {
          color: 'text-slate-500 bg-slate-50',
          icon: <Clock size={24} />,
          desc: 'Checking status...',
        };
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-10">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-slate-500 mb-6 hover:text-indigo-600 transition-colors font-bold text-sm"
      >
        <ChevronLeft size={18} /> Back to Menu
      </button>

      <h1 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">
        Track Your Pickup Order
      </h1>

      <form onSubmit={handleSubmit} className="mb-10">
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter Token (e.g. 1001)"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="flex-1 bg-white border border-slate-200 px-6 py-4 rounded-[1.5rem] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-indigo-700 disabled:bg-slate-300 transition-all shadow-lg shadow-indigo-100"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Track'}
          </button>
        </div>
      </form>

      {error && (
        <div className="bg-rose-50 text-rose-600 p-6 rounded-[2rem] text-center mb-6 font-bold text-sm border border-rose-100">
          {error}
        </div>
      )}

      {order && (
        <div className="bg-white rounded-[3rem] p-10 border border-slate-50 shadow-2xl shadow-slate-100 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4">
            Current Progress
          </p>

          <div
            className={`inline-flex items-center gap-2 px-6 py-2 rounded-full font-black text-sm mb-4 ${getStatusTheme(order.status).color}`}
          >
            {getStatusTheme(order.status).icon}
            {order.status}
          </div>

          <p className="text-slate-500 text-sm mb-10 font-medium">{getStatusTheme(order.status).desc}</p>

          <div className="space-y-6 text-left bg-slate-50 p-6 rounded-[2rem]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Token Number
              </span>
              <span className="font-black text-indigo-600 text-xl">#{order.tokenNumber}</span>
            </div>
            <div className="h-px bg-slate-200/50 w-full"></div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Total Amount
              </span>
              <span className="font-black text-slate-800 text-xl">Rs.{order.totalAmount}</span>
            </div>
            <div className="h-px bg-slate-200/50 w-full"></div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Pickup Shop
              </span>
              <span className="font-black text-slate-800 text-right">
                {order.shopName || 'Smart Shop'}
              </span>
            </div>
            <div className="h-px bg-slate-200/50 w-full"></div>
            <div className="flex justify-between items-center gap-6">
              <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">
                Pickup Time
              </span>
              <span className="font-black text-slate-800 text-right">
                {formatPickupTime(order.pickupTime)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                Live Updates
              </span>
            </div>
          </div>

          <button
            onClick={() => fetchStatus(order.tokenNumber)}
            disabled={loading}
            className="mt-4 flex items-center justify-center gap-2 text-slate-300 font-black mx-auto hover:text-indigo-400 transition-colors uppercase text-[10px] tracking-[0.2em]"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Manual Refresh
          </button>
        </div>
      )}

      {!order && !loading && !error && (
        <div className="text-center py-10 opacity-40">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Enter your token to see live updates
          </p>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
