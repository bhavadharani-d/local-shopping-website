import React, { useState, useEffect, useRef } from 'react';
import { getOrders, getProducts, getShops, updateOrderStatus } from '../../api/api';
import { toast } from 'react-hot-toast';
import { Clock, CheckCircle, Flame, Package } from 'lucide-react';

const STATUS_PRIORITY = {
  Received: 1,
  Accepted: 2,
  Preparing: 3,
  Ready: 4,
  Collected: 5,
};

const STATUS_ACTIONS = {
  Received: {
    label: 'Accept Order',
    nextStatus: 'Accepted',
    className: 'bg-violet-600 hover:bg-violet-700 shadow-violet-100',
  },
  Accepted: {
    label: 'Start Preparing',
    nextStatus: 'Preparing',
    className: 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100',
  },
  Preparing: {
    label: 'Mark Ready',
    nextStatus: 'Ready',
    className: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100',
  },
  Ready: {
    label: 'Mark Collected',
    nextStatus: 'Collected',
    className: 'bg-slate-800 hover:bg-slate-700 shadow-slate-200',
  },
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShopName, setSelectedShopName] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    daily: { revenue: 0, profit: 0 },
    monthly: { revenue: 0, profit: 0 },
    yearly: { revenue: 0, profit: 0 },
    popularItem: 'None',
    totalOrders: 0,
    activeOrders: 0,
  });

  const lastOrderIdRef = useRef(null);
  const audioRef = useRef(new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'));

  const sortOrders = (rawOrders) =>
    [...rawOrders].sort((a, b) => {
      if (STATUS_PRIORITY[a.status] !== STATUS_PRIORITY[b.status]) {
        return STATUS_PRIORITY[a.status] - STATUS_PRIORITY[b.status];
      }
      return new Date(a.pickupTime || a.createdAt) - new Date(b.pickupTime || b.createdAt);
    });

  const calculateDetailedAnalytics = (ordersData) => {
    const now = new Date();
    const nextStats = {
      daily: { revenue: 0, profit: 0 },
      monthly: { revenue: 0, profit: 0 },
      yearly: { revenue: 0, profit: 0 },
      popularItem: 'None',
      totalOrders: ordersData.length,
      activeOrders: ordersData.filter((order) => !['Collected'].includes(order.status)).length,
    };

    const productCounts = {};

    ordersData.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const amt = Number(order.totalAmount || 0);
      const orderProfit = Number(order.totalProfit ?? amt * 0.4);

      order.items?.forEach((item) => {
        productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
      });

      if (now - orderDate < 86400000) {
        nextStats.daily.revenue += amt;
        nextStats.daily.profit += orderProfit;
      }

      if (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      ) {
        nextStats.monthly.revenue += amt;
        nextStats.monthly.profit += orderProfit;
      }

      if (orderDate.getFullYear() === now.getFullYear()) {
        nextStats.yearly.revenue += amt;
        nextStats.yearly.profit += orderProfit;
      }
    });

    const sortedItems = Object.entries(productCounts).sort((a, b) => b[1] - a[1]);
    nextStats.popularItem = sortedItems.length > 0 ? sortedItems[0][0] : 'None';

    setStats(nextStats);
  };

  const fetchData = async (isAutoRefresh = false, shopName = selectedShopName) => {
    try {
      const requests = [getOrders(shopName), getProducts()];
      if (shops.length === 0) {
        requests.push(getShops());
      }

      const responses = await Promise.all(requests);
      const [ordersResp, productsResp, shopsResp] = responses;
      const sortedOrders = sortOrders(ordersResp.data.data || []);
      const allProducts = productsResp.data.data || [];

      if (shopsResp) {
        setShops(shopsResp.data.data || []);
      }

      if (isAutoRefresh && sortedOrders.length > 0) {
        const latestId = sortedOrders[0].documentId;
        if (lastOrderIdRef.current && latestId !== lastOrderIdRef.current) {
          audioRef.current.play().catch(() => {});
          toast('New pickup order!', { icon: '🔔' });
        }
      }

      if (sortedOrders.length > 0) {
        lastOrderIdRef.current = sortedOrders[0].documentId;
      }

      setOrders(sortedOrders);
      setProducts(allProducts);
      calculateDetailedAnalytics(sortedOrders);
    } catch (error) {
      if (!isAutoRefresh) toast.error('Dashboard sync failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(false, selectedShopName);
  }, [selectedShopName]);

  useEffect(() => {
    const interval = setInterval(() => fetchData(true, selectedShopName), 15000);
    return () => clearInterval(interval);
  }, [selectedShopName, shops.length]);

  const handleStatusUpdate = async (documentId, newStatus) => {
    try {
      await updateOrderStatus(documentId, newStatus);
      toast.success(`Order moved to ${newStatus}`);
      fetchData(false, selectedShopName);
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const lowStockItems = products.filter((product) => product.stock > 0 && product.stock <= 5);
  const fallbackProduct = products.find((product) => product.name && product.name !== 'Test');
  const fanFavoriteName =
    stats.popularItem === 'Test' || stats.popularItem === 'None'
      ? fallbackProduct?.name || 'None'
      : stats.popularItem;

  const getStatusTheme = (status) => {
    switch (status) {
      case 'Received':
        return { color: 'text-blue-600 bg-blue-50 border-blue-100', icon: <Clock size={16} /> };
      case 'Accepted':
        return { color: 'text-violet-600 bg-violet-50 border-violet-100', icon: <Clock size={16} /> };
      case 'Preparing':
        return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <Flame size={16} className="animate-pulse" /> };
      case 'Ready':
        return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: <CheckCircle size={16} /> };
      case 'Collected':
        return { color: 'text-slate-600 bg-slate-100 border-slate-200', icon: <CheckCircle size={16} /> };
      default:
        return { color: 'text-slate-500 bg-slate-50 border-slate-100', icon: <Clock size={16} /> };
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <div className="h-16 w-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="font-black text-slate-300 uppercase tracking-widest text-xs">
          Syncing pickup orders...
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in pb-20 px-4 max-w-[1600px] mx-auto">
      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            className={`bg-white p-8 rounded-[3rem] border ${
              lowStockItems.length > 0 ? 'border-rose-200 bg-rose-50/30' : 'border-slate-100'
            } shadow-sm relative overflow-hidden`}
          >
            <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
              Inventory Health
              {lowStockItems.length > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  Action
                </span>
              )}
            </h3>
            <div className="flex flex-wrap gap-2">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item) => (
                  <div
                    key={item.id}
                    className="px-4 py-2 bg-white border border-rose-100 shadow-sm rounded-xl flex items-center gap-2"
                  >
                    <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-black text-slate-700">
                      {item.name} ({item.stock})
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-sm font-bold italic">Stock is healthy</p>
              )}
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[3rem] shadow-2xl shadow-indigo-200/10 text-white flex items-center justify-between">
            <div>
              <p className="text-indigo-300 text-[10px] font-black tracking-widest uppercase mb-1">
                Fan Favorite
              </p>
              <h3 className="text-2xl font-black">{fanFavoriteName}</h3>
            </div>
            <div className="h-14 w-14 bg-white/10 rounded-[2rem] flex items-center justify-center text-2xl">
              Best
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-800">Order Status Snapshot</h3>
              <p className="text-slate-400 font-medium text-sm">
                Quick view for the live pickup queue
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-[2rem] px-6 py-5 flex items-center justify-between">
              <span className="font-bold text-slate-500">Ready for pickup</span>
              <span className="font-black text-emerald-600 text-2xl">
                {orders.filter((order) => order.status === 'Ready').length}
              </span>
            </div>
            <div className="bg-slate-50 rounded-[2rem] px-6 py-5 flex items-center justify-between">
              <span className="font-bold text-slate-500">Collected orders</span>
              <span className="font-black text-indigo-600 text-2xl">
                {orders.filter((order) => order.status === 'Collected').length}
              </span>
            </div>
            <div className="bg-slate-50 rounded-[2rem] px-6 py-5 flex items-center justify-between">
              <span className="font-bold text-slate-500">Still active</span>
              <span className="font-black text-rose-500 text-2xl">
                {orders.filter((order) => order.status !== 'Collected').length}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50/30">
            <div>
              <h3 className="text-2xl font-black text-slate-800">Pickup Queue</h3>
              <p className="text-indigo-600 font-bold text-sm tracking-tight">
                {stats.activeOrders} orders still in progress
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <select
                value={selectedShopName}
                onChange={(e) => setSelectedShopName(e.target.value)}
                className="px-5 py-3 bg-white border border-slate-100 text-slate-500 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">All Shops</option>
                {shops.map((shop) => (
                  <option key={shop.id} value={shop.name}>
                    {shop.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => fetchData(false, selectedShopName)}
                className="px-6 py-3 bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:border-indigo-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
              >
                Refresh Queue
              </button>
            </div>
          </div>

          <div className="overflow-x-auto p-4">
            <table className="w-full">
              <thead>
                <tr className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-6 py-4 text-left">Token</th>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Pickup</th>
                  <th className="px-6 py-4 text-left">Items</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {orders.map((order) => {
                  const action = STATUS_ACTIONS[order.status];
                  return (
                    <tr
                      key={order.id}
                      className={`transition-all ${
                        order.status === 'Collected'
                          ? 'opacity-40 hover:opacity-100 bg-slate-50/20'
                          : 'group'
                      }`}
                    >
                      <td className="px-6 py-8">
                        <div className="flex flex-col">
                          <span
                            className={`text-2xl font-black ${
                              order.status === 'Collected' ? 'text-slate-400' : 'text-indigo-600'
                            }`}
                          >
                            #{order.tokenNumber}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase">
                            {new Date(order.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-800">
                            {order.customerName || 'Anonymous'}
                          </span>
                          <span className="text-indigo-500 text-xs font-bold font-mono">
                            {order.customerPhone || '---'}
                          </span>
                          {order.orderNotes && (
                            <span className="text-slate-400 text-xs mt-2 max-w-[220px]">
                              {order.orderNotes}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-col text-sm">
                          <span className="font-black text-slate-800">{order.shopName || 'Smart Shop'}</span>
                          <span className="text-slate-400 font-medium">
                            {order.pickupTime
                              ? new Date(order.pickupTime).toLocaleString()
                              : 'Pickup time not set'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div className="flex flex-wrap gap-2 max-w-[220px]">
                          {order.items?.map((item, i) => (
                            <span
                              key={i}
                              className="bg-slate-100 text-slate-500 text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-tighter"
                            >
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-8">
                        <div
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-wider border shadow-sm ${getStatusTheme(order.status).color}`}
                        >
                          {getStatusTheme(order.status).icon}
                          {order.status}
                        </div>
                      </td>
                      <td className="px-6 py-8 text-right">
                        {action ? (
                          <button
                            onClick={() => handleStatusUpdate(order.documentId, action.nextStatus)}
                            className={`text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl ${action.className}`}
                          >
                            {action.label}
                          </button>
                        ) : (
                          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center opacity-40 ml-auto">
                            <CheckCircle size={20} />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="py-40 text-center opacity-30">
              <Package className="mx-auto mb-4" size={60} />
              <h3 className="text-2xl font-black italic">No pickup orders yet</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
