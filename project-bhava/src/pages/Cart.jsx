import React, { useEffect, useState } from 'react';
import { Trash2, ChevronLeft, CreditCard, Loader2 } from 'lucide-react';
import { createOrder, getShops } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const HOUR_OPTIONS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTE_OPTIONS = ['00', '15', '30', '45'];
const PERIOD_OPTIONS = ['AM', 'PM'];

const getTodayDateLabel = () =>
  new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

const formatTimeLabel = (hour, minute, period) => `${hour}:${minute} ${period}`;

const buildPickupDateTime = (hour, minute, period) => {
  const now = new Date();
  const pickupDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let hour24 = Number.parseInt(hour, 10);
  if (period === 'AM' && hour24 === 12) hour24 = 0;
  if (period === 'PM' && hour24 !== 12) hour24 += 12;

  pickupDate.setHours(hour24, Number.parseInt(minute, 10), 0, 0);
  return pickupDate;
};

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    shopName: '',
    pickupHour: '09',
    pickupMinute: '00',
    pickupPeriod: 'AM',
    notes: '',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedShop = shops.find((shop) => shop.name === customerInfo.shopName) || null;
  const todayLabel = getTodayDateLabel();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getShops();
        const activeShops = response.data.data || [];
        setShops(activeShops);
        if (activeShops.length > 0) {
          setCustomerInfo((prev) => ({
            ...prev,
            shopName: prev.shopName || activeShops[0].name,
          }));
        }
      } catch (error) {
        console.error('Failed to load shops:', error);
        toast.error('Could not load pickup shops.');
      } finally {
        setShopsLoading(false);
      }
    };

    fetchShops();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in your contact details.');
      return;
    }

    if (customerInfo.phone.length < 10) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    if (!customerInfo.shopName || !selectedShop) {
      toast.error('Please choose a pickup shop.');
      return;
    }

    const pickupDateTime = buildPickupDateTime(
      customerInfo.pickupHour,
      customerInfo.pickupMinute,
      customerInfo.pickupPeriod
    );

    if (pickupDateTime.getTime() <= Date.now()) {
      toast.error('Please choose a pickup time later today.');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const pickupTime = pickupDateTime.toISOString();
      const pickupLabel = formatTimeLabel(
        customerInfo.pickupHour,
        customerInfo.pickupMinute,
        customerInfo.pickupPeriod
      );

      const orderData = {
        totalAmount: total,
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        shopName: customerInfo.shopName,
        pickupTime,
        orderNotes: customerInfo.notes,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);
      const tokenNumber = response.data.data.tokenNumber;

      toast.success('Pickup order placed successfully!');
      setCart([]);
      localStorage.removeItem('cart');

      navigate(
        `/success?tokenNumber=${tokenNumber}&phone=${customerInfo.phone}&name=${encodeURIComponent(
          customerInfo.name
        )}&shop=${encodeURIComponent(selectedShop.name)}&pickupTime=${encodeURIComponent(
          pickupTime
        )}&pickupLabel=${encodeURIComponent(pickupLabel)}`
      );
    } catch (error) {
      console.error('Order failed:', error);
      toast.error(error?.response?.data?.error?.message || 'Failed to place order.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-48">
      <button
        onClick={() => navigate('/')}
        className="flex items-center text-slate-500 mb-6 hover:text-indigo-600 transition-colors font-bold"
      >
        <ChevronLeft size={20} /> Back to Menu
      </button>

      <h1 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
        Schedule Your Pickup Order
      </h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
          <div className="text-6xl mb-4 text-indigo-100 italic">empty</div>
          <p className="text-slate-400 font-bold">Your bag is empty.</p>
          <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-black">
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-[2.5rem]">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-3">
              Exact Flow
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm font-semibold text-slate-600">
              <div>1. Pick your nearest Smart shop</div>
              <div>2. Choose today&apos;s pickup time</div>
              <div>3. Track status until the order is ready</div>
            </div>
          </div>

          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl overflow-hidden flex items-center justify-center text-2xl">
                    Item
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800">{item.name}</h3>
                    <p className="text-indigo-600 font-bold text-sm">
                      Rs.{item.price} x {item.quantity}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-slate-800">Rs.{item.price * item.quantity}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
              Pickup Details
              <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Enter your name"
                  className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/10 transition-all outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">
                  Pickup Shop
                </label>
                <select
                  name="shopName"
                  value={customerInfo.shopName}
                  onChange={handleInputChange}
                  disabled={shopsLoading || shops.length === 0}
                  className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/10 transition-all outline-none disabled:text-slate-300"
                >
                  {shops.length === 0 ? (
                    <option value="">
                      {shopsLoading ? 'Loading shops...' : 'No pickup shops available'}
                    </option>
                  ) : (
                    shops.map((shop) => (
                      <option key={shop.id} value={shop.name}>
                        {shop.name}
                      </option>
                    ))
                  )}
                </select>
                {selectedShop && (
                  <p className="text-xs text-slate-400 font-medium mt-2 px-2">
                    {selectedShop.address} • {selectedShop.hours || 'Hours not added yet'}
                  </p>
                )}
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">
                  Pickup Day
                </label>
                <div className="w-full bg-slate-50 px-6 py-4 rounded-2xl font-bold text-slate-700">
                  {todayLabel}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">
                  Pickup Time
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select
                    name="pickupHour"
                    value={customerInfo.pickupHour}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-none px-4 py-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/10 outline-none"
                  >
                    {HOUR_OPTIONS.map((hour) => (
                      <option key={hour} value={hour}>
                        {hour}
                      </option>
                    ))}
                  </select>
                  <select
                    name="pickupMinute"
                    value={customerInfo.pickupMinute}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-none px-4 py-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/10 outline-none"
                  >
                    {MINUTE_OPTIONS.map((minute) => (
                      <option key={minute} value={minute}>
                        {minute}
                      </option>
                    ))}
                  </select>
                  <select
                    name="pickupPeriod"
                    value={customerInfo.pickupPeriod}
                    onChange={handleInputChange}
                    className="bg-slate-50 border-none px-4 py-4 rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-indigo-600/10 outline-none"
                  >
                    {PERIOD_OPTIONS.map((period) => (
                      <option key={period} value={period}>
                        {period}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-slate-400 font-medium mt-2 px-2">
                  Pickup will be booked for today at{' '}
                  {formatTimeLabel(
                    customerInfo.pickupHour,
                    customerInfo.pickupMinute,
                    customerInfo.pickupPeriod
                  )}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-1 block">
                  Notes for Shop
                </label>
                <textarea
                  rows="3"
                  name="notes"
                  value={customerInfo.notes}
                  onChange={handleInputChange}
                  placeholder="Optional: custom message, send someone else to collect..."
                  className="w-full bg-slate-50 border-none px-6 py-4 rounded-2xl font-medium text-slate-700 focus:ring-2 focus:ring-indigo-600/10 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-6 md:relative md:p-0">
            <div className="max-w-2xl mx-auto bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-indigo-100 border border-white/5 backdrop-blur-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-slate-400 block text-xs font-bold uppercase tracking-widest mb-1">
                    Total to Pay
                  </span>
                  <span className="text-4xl font-black">Rs.{total}</span>
                </div>
                <div className="h-14 w-14 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
                  <CreditCard size={28} className="text-white" />
                </div>
              </div>
              <div className="mb-2 text-sm text-slate-300 font-medium">
                Pickup from <span className="text-white font-bold">{selectedShop?.name || 'Select a shop'}</span>
              </div>
              <div className="mb-5 text-sm text-slate-300 font-medium">
                Today at{' '}
                <span className="text-white font-bold">
                  {formatTimeLabel(
                    customerInfo.pickupHour,
                    customerInfo.pickupMinute,
                    customerInfo.pickupPeriod
                  )}
                </span>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isPlacingOrder || shopsLoading || shops.length === 0}
                className="w-full bg-white text-slate-900 font-black py-6 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isPlacingOrder ? (
                  <Loader2 className="animate-spin text-indigo-600" size={24} />
                ) : (
                  <>Place Pickup Order</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
