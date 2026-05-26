import React, { useEffect, useMemo, useState } from 'react';
import { getOrders, getShops } from '../../api/api';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  CircleDollarSign,
  PackageCheck,
  Activity,
  Clock3,
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const formatCurrency = (value) => `Rs.${Math.floor(value).toLocaleString()}`;

const formatShortTime = (date) =>
  new Intl.DateTimeFormat('en-IN', {
    hour: 'numeric',
    hour12: true,
  }).format(date);

const STATUS_COLORS = {
  Received: '#3b82f6',
  Accepted: '#8b5cf6',
  Preparing: '#f59e0b',
  Ready: '#10b981',
  Collected: '#6366f1',
};

const MetricCard = ({ label, value, helper, icon, accent }) => (
  <article className="relative overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-7 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
    <div className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${accent}`}></div>
    <div className="mb-8 flex items-center justify-between">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</span>
      <div className="rounded-2xl bg-slate-50 p-3 text-slate-700">{icon}</div>
    </div>
    <div className="space-y-2">
      <p className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-400">{helper}</p>
    </div>
  </article>
);

const ShopBars = ({ rows }) => {
  const maxValue = Math.max(...rows.map((row) => row.orders), 1);

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.name} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-slate-700">{row.name}</span>
            <span className="font-black text-slate-500">{row.orders} orders</span>
          </div>
          <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
              style={{ width: `${(row.orders / maxValue) * 100}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  let offsetCursor = 0;

  return (
    <div className="flex flex-col lg:flex-row items-center gap-8">
      <div className="relative h-48 w-48 shrink-0">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="18" />
          {data.map((item) => {
            const segment = total > 0 ? (item.value / total) * circumference : 0;
            const ring = (
              <circle
                key={item.label}
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={`${segment} ${circumference - segment}`}
                strokeDashoffset={-offsetCursor}
                strokeLinecap="round"
              />
            );
            offsetCursor += segment;
            return ring;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Orders</span>
          <span className="text-4xl font-black text-slate-900">{total}</span>
        </div>
      </div>

      <div className="w-full space-y-3">
        {data.map((item) => (
          <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              <span className="font-bold text-slate-700">{item.label}</span>
            </div>
            <span className="font-black text-slate-500">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrendDiagram = ({ buckets }) => {
  const width = 820;
  const height = 360;
  const chartLeft = 70;
  const chartRight = 36;
  const chartTop = 36;
  const chartBottom = 232;
  const chartWidth = width - chartLeft - chartRight;
  const chartHeight = chartBottom - chartTop;
  const maxValue = Math.max(...buckets.map((bucket) => bucket.value), 1);
  const guideSteps = 4;
  const slotWidth = chartWidth / Math.max(buckets.length, 1);
  const barWidth = Math.min(54, slotWidth * 0.45);

  const points = buckets.map((bucket, index) => {
    const x = chartLeft + slotWidth * index + slotWidth / 2;
    const barHeight = Math.max((bucket.value / maxValue) * (chartHeight - 18), bucket.value > 0 ? 18 : 0);
    const y = chartBottom - barHeight;
    return { ...bucket, x, y, barHeight };
  });

  const linePoints = points.map((point) => `${point.x},${point.y}`).join(' ');
  const areaPath = points.length
    ? [
        `M ${points[0].x} ${chartBottom}`,
        ...points.map((point) => `L ${point.x} ${point.y}`),
        `L ${points[points.length - 1].x} ${chartBottom}`,
        'Z',
      ].join(' ')
    : '';
  const peakBucket = [...buckets].sort((a, b) => b.value - a.value)[0];

  return (
    <div className="rounded-[2.5rem] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f8faff_100%)] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Today&apos;s Flow</p>
          <p className="mt-2 text-sm font-medium text-slate-500">
            Each bar shows orders placed in that 4-hour slot, with the line showing the pace change.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Peak Slot</p>
            <p className="mt-1 text-sm font-black text-slate-900">{peakBucket?.label || '--'}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.05)]">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Peak Orders</p>
            <p className="mt-1 text-sm font-black text-indigo-600">{peakBucket?.value ?? 0}</p>
          </div>
          <div className="rounded-2xl bg-white px-4 py-3 shadow-[0_10px_25px_rgba(15,23,42,0.05)] col-span-2 sm:col-span-1">
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Live Window</p>
            <p className="mt-1 text-sm font-black text-emerald-600">
              {buckets.find((bucket) => bucket.isCurrentWindow)?.label || '--'}
            </p>
          </div>
        </div>
      </div>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-[360px] w-full">
        <defs>
          <linearGradient id="analyticsBarFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
          <linearGradient id="analyticsAreaFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {Array.from({ length: guideSteps + 1 }, (_, index) => {
          const ratio = index / guideSteps;
          const y = chartBottom - ratio * chartHeight;
          const guideValue = Math.round(maxValue * ratio);
          return (
            <g key={index}>
              <line
                x1={chartLeft}
                y1={y}
                x2={width - chartRight}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray={index === 0 ? '0' : '5 8'}
              />
              <text
                x={chartLeft - 16}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400"
                style={{ fontSize: '11px', fontWeight: 800 }}
              >
                {guideValue}
              </text>
            </g>
          );
        })}

        {areaPath ? <path d={areaPath} fill="url(#analyticsAreaFill)" /> : null}

        {points.map((point) => (
          <g key={point.label}>
            <rect
              x={point.x - barWidth / 2}
              y={point.value > 0 ? point.y : chartBottom - 8}
              width={barWidth}
              height={point.value > 0 ? point.barHeight : 8}
              rx={barWidth / 2}
              fill={point.isCurrentWindow ? 'url(#analyticsBarFill)' : '#e9eefc'}
              opacity={point.isCurrentWindow ? 1 : 0.95}
            />
            <text
              x={point.x}
              y={point.value > 0 ? point.y - 12 : chartBottom - 16}
              textAnchor="middle"
              className={point.isCurrentWindow ? 'fill-indigo-600' : 'fill-slate-400'}
              style={{ fontSize: '13px', fontWeight: 900 }}
            >
              {point.value}
            </text>
          </g>
        ))}

        {points.length > 1 ? (
          <polyline
            points={linePoints}
            fill="none"
            stroke="#1e293b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.9"
          />
        ) : null}

        {points.map((point) => (
          <g key={`${point.label}-dot`}>
            <circle cx={point.x} cy={point.y} r="5.5" fill="#ffffff" stroke="#1e293b" strokeWidth="3" />
            {point.isCurrentWindow ? <circle cx={point.x} cy={point.y} r="12" fill="#6366f1" opacity="0.12" /> : null}
          </g>
        ))}

        {points.map((point) => (
          <g key={`${point.label}-footer`}>
            <rect
              x={point.x - 48}
              y="270"
              width="96"
              height="58"
              rx="18"
              fill={point.isCurrentWindow ? '#eef2ff' : '#ffffff'}
              stroke={point.isCurrentWindow ? '#c7d2fe' : '#e2e8f0'}
            />
            <text
              x={point.x}
              y="294"
              textAnchor="middle"
              className="fill-slate-400"
              style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '0.16em' }}
            >
              {point.label}
            </text>
            <text
              x={point.x}
              y="318"
              textAnchor="middle"
              className={point.isCurrentWindow ? 'fill-indigo-600' : 'fill-slate-900'}
              style={{ fontSize: '24px', fontWeight: 900 }}
            >
              {point.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

const AdminAnalytics = () => {
  const [orders, setOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [selectedShopName, setSelectedShopName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [ordersResp, shopsResp] = await Promise.all([getOrders(selectedShopName), getShops()]);
        setOrders(ordersResp.data.data || []);
        setShops(shopsResp.data.data || []);
      } catch (error) {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedShopName]);

  const metrics = useMemo(() => {
    const now = new Date();
    const revenue = orders.reduce((sum, order) => sum + Number(order.totalAmount || 0), 0);
    const profit = orders.reduce((sum, order) => sum + Number(order.totalProfit || 0), 0);
    const todayOrders = orders.filter((order) => now - new Date(order.createdAt) < 86400000);
    const averageOrderValue = orders.length > 0 ? revenue / orders.length : 0;
    const activeOrders = orders.filter((order) => order.status !== 'Collected').length;
    const readyOrders = orders.filter((order) => order.status === 'Ready').length;
    const collectedOrders = orders.filter((order) => order.status === 'Collected').length;

    const shopBreakdown = shops
      .map((shop) => ({
        name: shop.name,
        orders: orders.filter((order) => order.shopName === shop.name).length,
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    const topShop = shopBreakdown[0];

    const statusBreakdown = ['Received', 'Accepted', 'Preparing', 'Ready', 'Collected'].map((status) => ({
      label: status,
      value: orders.filter((order) => order.status === status).length,
      color: STATUS_COLORS[status],
    }));

    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const recentTimeBuckets = Array.from({ length: 6 }, (_, index) => {
      const bucketStart = new Date(startOfDay.getTime() + index * 4 * 60 * 60 * 1000);
      const bucketEnd = new Date(bucketStart.getTime() + 4 * 60 * 60 * 1000);
      const value = orders.filter((order) => {
        const createdAt = new Date(order.createdAt);
        return createdAt >= bucketStart && createdAt < bucketEnd;
      }).length;

      return {
        label: formatShortTime(bucketStart),
        value,
        isCurrentWindow: now >= bucketStart && now < bucketEnd,
      };
    });

    return {
      revenue,
      profit,
      todayOrders,
      averageOrderValue,
      activeOrders,
      readyOrders,
      collectedOrders,
      topShop,
      shopBreakdown,
      statusBreakdown,
      recentTimeBuckets,
    };
  }, [orders, shops]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh]">
        <div className="h-14 w-14 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
        <p className="font-black text-slate-300 uppercase tracking-widest text-xs">
          Loading analytics...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <section className="relative overflow-hidden rounded-[3rem] border border-slate-100 bg-white px-8 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.06)]">
        <div className="absolute -top-20 -right-16 h-56 w-56 rounded-full bg-indigo-100/70 blur-3xl"></div>
        <div className="absolute -bottom-20 left-12 h-48 w-48 rounded-full bg-emerald-100/50 blur-3xl"></div>

        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <Clock3 size={14} />
              Smart Shop Analytics
            </div>
            <h2 className="mt-5 text-4xl md:text-5xl font-black tracking-tight text-slate-900">
              See what the business is
              <span className="block text-indigo-600">earning, moving, and finishing.</span>
            </h2>
            <p className="mt-4 max-w-2xl text-slate-500 text-base md:text-lg font-medium leading-relaxed">
              This view is built for fast understanding with charts, not just numbers.
            </p>
          </div>

          <div className="xl:min-w-[280px]">
            <label className="mb-2 block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              Focus Branch
            </label>
            <select
              value={selectedShopName}
              onChange={(e) => setSelectedShopName(e.target.value)}
              className="w-full rounded-[1.75rem] border border-slate-100 bg-white px-5 py-4 text-sm font-bold text-slate-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100"
            >
              <option value="">All Shops</option>
              {shops.map((shop) => (
                <option key={shop.id} value={shop.name}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6">
        <MetricCard
          label="Revenue"
          value={formatCurrency(metrics.revenue)}
          helper={`${orders.length} total orders loaded`}
          icon={<CircleDollarSign size={22} className="text-indigo-500" />}
          accent="from-indigo-500 via-violet-500 to-fuchsia-500"
        />
        <MetricCard
          label="Profit"
          value={formatCurrency(metrics.profit)}
          helper={metrics.revenue > 0 ? `${Math.round((metrics.profit / metrics.revenue) * 100)}% profit margin` : 'No sales yet'}
          icon={<TrendingUp size={22} className="text-emerald-500" />}
          accent="from-emerald-500 via-lime-400 to-teal-400"
        />
        <MetricCard
          label="Today's Orders"
          value={metrics.todayOrders.length}
          helper={`${metrics.readyOrders} ready right now`}
          icon={<ShoppingBag size={22} className="text-violet-500" />}
          accent="from-violet-500 via-fuchsia-500 to-pink-500"
        />
        <MetricCard
          label="Average Order"
          value={formatCurrency(metrics.averageOrderValue)}
          helper={`${metrics.activeOrders} still active`}
          icon={<Activity size={22} className="text-amber-500" />}
          accent="from-amber-500 via-orange-400 to-rose-400"
        />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.25fr_0.95fr] gap-6">
        <div className="rounded-[3rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Order Volume Trend</h3>
              <p className="text-slate-400 font-medium text-sm">
                Orders across today&apos;s 4-hour time slots
              </p>
            </div>
            <div className="rounded-full bg-indigo-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600">
              Today
            </div>
          </div>

          <TrendDiagram buckets={metrics.recentTimeBuckets} />
        </div>

        <div className="rounded-[3rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Status Distribution</h3>
              <p className="text-slate-400 font-medium text-sm">
                Where the current orders are sitting now
              </p>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              Queue Mix
            </div>
          </div>

          <DonutChart data={metrics.statusBreakdown} />
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
        <div className="rounded-[3rem] border border-slate-100 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">Shop Comparison</h3>
              <p className="text-slate-400 font-medium text-sm">
                Which branches are handling the most pickup load
              </p>
            </div>
            <div className="rounded-full bg-amber-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-600">
              Top Branches
            </div>
          </div>

          <ShopBars rows={metrics.shopBreakdown.length > 0 ? metrics.shopBreakdown : [{ name: 'No shop data yet', orders: 0 }]} />
        </div>

        <div className="rounded-[3rem] bg-slate-900 p-8 text-white shadow-[0_30px_80px_rgba(15,23,42,0.2)]">
          <div className="flex items-center gap-3 mb-6">
            <Store className="text-indigo-300" size={24} />
            <h3 className="text-2xl font-black">Quick Read</h3>
          </div>

          <div className="space-y-4">
            <div className="rounded-[2rem] bg-white/5 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Top Shop</p>
              <p className="mt-2 text-2xl font-black text-white">{metrics.topShop?.name || 'No data yet'}</p>
            </div>
            <div className="rounded-[2rem] bg-white/5 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ready to hand over</p>
              <p className="mt-2 text-2xl font-black text-emerald-300">{metrics.readyOrders} orders</p>
            </div>
            <div className="rounded-[2rem] bg-white/5 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Collected so far</p>
              <p className="mt-2 text-2xl font-black text-indigo-300">{metrics.collectedOrders} orders</p>
            </div>
            <div className="rounded-[2rem] bg-white/5 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">What this means</p>
              <p className="mt-2 text-sm leading-7 text-slate-300">
                Use the status chart to see queue health, the trend line to judge pace, and the shop bars to compare branch load quickly.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminAnalytics;
