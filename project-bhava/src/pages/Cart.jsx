import React from 'react';
import { Trash2, ChevronLeft, CreditCard } from 'lucide-react';
import { createOrder } from '../api/api';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart, setCart }) => {
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleCheckout = async () => {
    try {
      // Prepare the items for our custom Strapi controller
      const orderData = {
        total: total,
        items: cart.map(item => ({ id: item.id, quantity: item.quantity })),
        products: cart.map(item => item.id), // For the Strapi relation
      };

      const response = await createOrder(orderData);
      const token = response.data.data.token;
      
      // Clear cart after success
      setCart([]);
      navigate(`/success?token=${token}`);
    } catch (error) {
      console.error(error);
      alert("Error placing order. Check if Strapi is running!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="flex items-center text-slate-500 mb-6 hover:text-indigo-600 transition-colors">
        <ChevronLeft size={20} /> Back to Menu
      </button>

      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">Your cart is empty.</p>
        </div>
      ) : (
        <>
          <div className="space-y-4 mb-10">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden text-center text-2xl flex items-center justify-center">🍱</div>
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <p className="text-slate-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-slate-800">₹{item.price * item.quantity}</span>
                  <button onClick={() => removeFromCart(item.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-900 text-white p-6 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <span className="text-indigo-200 text-lg">Total Amount</span>
              <span className="text-3xl font-bold">₹{total}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-white text-indigo-900 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-indigo-50 transition-colors"
            >
              <CreditCard size={20} /> Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
