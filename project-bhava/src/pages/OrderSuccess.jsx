import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Search, Home } from 'lucide-react';

const formatPickupSummary = (pickupTime, pickupLabel) => {
  if (pickupLabel) {
    return `Today at ${pickupLabel}`;
  }

  if (!pickupTime) {
    return 'Pickup time chosen at checkout';
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(pickupTime));
};

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const tokenNumber = searchParams.get('tokenNumber');
  const customerName = searchParams.get('name') || 'Customer';
  const shopName = searchParams.get('shop') || 'Smart Shop';
  const pickupTime = searchParams.get('pickupTime');
  const pickupLabel = searchParams.get('pickupLabel');

  const SHOP_PHONE = '919876543210';
  const whatsappMsg = `Hi! I placed a pickup order (Token: #${tokenNumber}). Name: ${customerName}. Pickup shop: ${shopName}. Track here: ${window.location.origin}/track?tokenNumber=${tokenNumber}`;
  const whatsappUrl = `https://wa.me/${SHOP_PHONE}?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="max-w-md mx-auto px-6 py-20 text-center">
      <div className="flex justify-center mb-8">
        <div className="bg-emerald-100 p-6 rounded-full animate-bounce shadow-lg shadow-emerald-50 text-emerald-600">
          <CheckCircle size={64} />
        </div>
      </div>

      <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">Pickup Order Sent!</h1>
      <p className="text-slate-500 font-medium mb-12">
        The shop has your order. Track it live and send a person once it is ready.
      </p>

      <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-100 border border-slate-50 mb-12 relative overflow-hidden group">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-50 group-hover:bg-indigo-100 transition-colors"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-50 group-hover:bg-emerald-100 transition-colors"></div>

        <p className="text-slate-400 text-xs font-black uppercase tracking-[0.2em] mb-4 relative z-10">
          Your Token Number
        </p>
        <h2 className="text-7xl font-black text-indigo-600 tracking-tighter relative z-10">
          #{tokenNumber || '----'}
        </h2>
        <div className="relative z-10 mt-6 bg-slate-50 rounded-[2rem] p-4 text-left">
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">
            Pickup Summary
          </p>
          <p className="font-bold text-slate-700">{shopName}</p>
          <p className="text-sm text-slate-500">
            {formatPickupSummary(pickupTime, pickupLabel)}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-3 bg-emerald-500 text-white font-black py-5 rounded-[1.5rem] hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-100 transition-all active:scale-[0.98]"
        >
          Confirm on WhatsApp
        </a>
        <Link
          to={`/track?tokenNumber=${tokenNumber}`}
          className="w-full flex items-center justify-center gap-3 bg-indigo-600 text-white font-black py-5 rounded-[1.5rem] hover:bg-indigo-700 transition-all active:scale-[0.98]"
        >
          <Search size={22} /> Track Live Status
        </Link>
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-3 bg-slate-100 text-slate-400 font-black py-5 rounded-[1.5rem] hover:bg-slate-200 transition-all active:scale-[0.98]"
        >
          <Home size={22} /> Return to Menu
        </Link>
      </div>

      <p className="mt-12 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
        Show this token at the shop counter during pickup
      </p>
    </div>
  );
};

export default OrderSuccess;
