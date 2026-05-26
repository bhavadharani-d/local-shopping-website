import React, { useState, useEffect, useRef } from 'react';
import { getOrders, getShops, updateOrderStatus } from '../../api/api';
import { ChefHat, CheckCircle2, Flame, Loader2, Bell, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';

const STATUS_PRIORITY = {
  Received: 1,
  Accepted: 2,
  Preparing: 3,
  Ready: 4,
  Collected: 5,
};

const STATUS_ACTIONS = {
  Received: {
    nextStatus: 'Accepted',
    label: 'ACCEPT ORDER',
    tone: 'bg-violet-600 hover:bg-violet-500 shadow-violet-600/20',
    icon: <Clock size={24} />,
  },
  Accepted: {
    nextStatus: 'Preparing',
    label: 'START PREPARING',
    tone: 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/20',
    icon: <Flame size={24} />,
  },
  Preparing: {
    nextStatus: 'Ready',
    label: 'MARK READY',
    tone: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20',
    icon: <CheckCircle2 size={24} />,
  },
  Ready: {
    nextStatus: 'Collected',
    label: 'MARK COLLECTED',
    tone: 'bg-slate-200 hover:bg-slate-100 text-slate-900 shadow-slate-400/20',
    icon: <CheckCircle2 size={24} />,
  },
};

const KitchenView = () => {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShopName, setSelectedShopName] = useState('');
  const [loading, setLoading] = useState(true);
  const audioRef = useRef(null);
  const previousOrdersCount = useRef(0);

  const fetchOrders = async (shopName = selectedShopName) => {
    try {
      const requests = [getOrders(shopName)];
      if (shops.length === 0) {
        requests.push(getShops());
      }

      const responses = await Promise.all(requests);
      const [ordersResp, shopsResp] = responses;
      const allOrders = ordersResp.data.data || [];

      if (shopsResp) {
        setShops(shopsResp.data.data || []);
      }

      const activeOrders = [...allOrders]
        .filter((order) => order.status !== 'Collected')
        .sort((a, b) => {
          if (STATUS_PRIORITY[a.status] !== STATUS_PRIORITY[b.status]) {
            return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
          }
          return new Date(a.pickupTime || a.createdAt) - new Date(b.pickupTime || b.createdAt);
        });

      if (activeOrders.length > previousOrdersCount.current) {
        audioRef.current?.play().catch(() => {});
        toast('New pickup order received!', { icon: '🔔' });
      }

      setOrders(activeOrders);
      previousOrdersCount.current = activeOrders.length;
    } catch (error) {
      console.error('Kitchen fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedShopName);
  }, [selectedShopName]);

  useEffect(() => {
    const interval = setInterval(() => fetchOrders(selectedShopName), 15000);
    return () => clearInterval(interval);
  }, [selectedShopName, shops.length]);

  const handleStatusUpdate = async (documentId, currentStatus) => {
    const action = STATUS_ACTIONS[currentStatus];
    if (!action) return;

    try {
      await updateOrderStatus(documentId, action.nextStatus);
      toast.success(`Order moved to ${action.nextStatus}`);
      fetchOrders(selectedShopName);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-slate-400">
        <Loader2 className="animate-spin mb-4" size={48} />
        <p className="font-black tracking-widest uppercase text-xs">Awaiting Pickup Orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <audio
        ref={audioRef}
        src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"
        preload="auto"
      />

      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-4 rounded-3xl shadow-lg shadow-indigo-600/20">
            <ChefHat size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Kitchen View</h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Home orders scheduled for pickup
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:items-center">
          <select
            value={selectedShopName}
            onChange={(e) => setSelectedShopName(e.target.value)}
            className="px-5 py-3 bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          >
            <option value="">All Shops</option>
            {shops.map((shop) => (
              <option key={shop.id} value={shop.name}>
                {shop.name}
              </option>
            ))}
          </select>
          <div className="text-right">
            <span className="text-rose-500 block text-2xl font-black animate-pulse">{orders.length}</span>
            <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">
              Active Tickets
            </span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full py-40 text-center bg-slate-800/50 rounded-[3.5rem] border border-slate-700">
            <Bell size={64} className="mx-auto text-slate-700 mb-4" />
            <h2 className="text-2xl font-black text-slate-600 italic">No pickup tickets in queue</h2>
          </div>
        ) : (
          orders.map((order) => {
            const action = STATUS_ACTIONS[order.status];
            const isReady = order.status === 'Ready';
            const cardTone =
              order.status === 'Received'
                ? 'bg-slate-800 border-blue-500 shadow-blue-600/10'
                : order.status === 'Accepted'
                  ? 'bg-violet-900/30 border-violet-600 shadow-violet-600/10'
                  : order.status === 'Preparing'
                    ? 'bg-indigo-900/30 border-indigo-600 shadow-indigo-600/10'
                    : 'bg-emerald-900/20 border-emerald-500 shadow-emerald-600/10';

            return (
              <div
                key={order.id}
                className={`p-8 rounded-[3rem] border-2 transition-all duration-500 shadow-xl ${cardTone}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="h-20 min-w-20 px-4 rounded-3xl flex items-center justify-center border bg-white/5 border-white/10">
                    <span className="text-4xl font-black text-white">#{order.tokenNumber}</span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                      isReady
                        ? 'bg-emerald-500 text-white'
                        : order.status === 'Preparing'
                          ? 'bg-indigo-600 text-white'
                          : order.status === 'Accepted'
                            ? 'bg-violet-600 text-white'
                            : 'bg-blue-600 text-white'
                    }`}
                  >
                    {order.status}
                  </div>
                </div>

                <div className="space-y-2 mb-6">
                  <p className="text-white font-black text-xl">{order.customerName || 'Anonymous'}</p>
                  <p className="text-slate-400 text-sm">{order.customerPhone || 'No phone provided'}</p>
                  <p className="text-slate-300 text-sm">
                    {order.shopName || 'Smart Shop'}
                    {order.pickupTime ? ` • ${new Date(order.pickupTime).toLocaleString()}` : ''}
                  </p>
                  {order.orderNotes && <p className="text-slate-400 text-sm">{order.orderNotes}</p>}
                </div>

                <div className="space-y-4 mb-8">
                  <div className="text-slate-500 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                    Ticket Details
                    <div className="h-px flex-1 bg-white/5"></div>
                  </div>
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-white">
                      <span className="font-black text-xl">
                        {item.quantity}x <span className="text-slate-200 ml-1">{item.name}</span>
                      </span>
                    </div>
                  ))}
                </div>

                {action ? (
                  <button
                    onClick={() => handleStatusUpdate(order.documentId, order.status)}
                    className={`w-full py-6 rounded-3xl font-black text-xl flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95 ${action.tone}`}
                  >
                    {action.icon} {action.label}
                  </button>
                ) : (
                  <div className="w-full py-6 rounded-3xl bg-slate-700/20 text-slate-500 font-black flex items-center justify-center gap-2 border border-slate-700/30">
                    <CheckCircle2 size={20} /> DONE
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default KitchenView;
