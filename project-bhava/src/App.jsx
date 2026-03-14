import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 pb-24 md:pb-0 md:pt-20">
        <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
        
        <Routes>
          <Route path="/" element={<Menu addToCart={addToCart} cartCount={cart.length} />} />
          <Route path="/cart" element={<Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/track" element={<TrackOrder />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
