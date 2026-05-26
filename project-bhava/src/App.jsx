import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import OrderSuccess from './pages/OrderSuccess';
import TrackOrder from './pages/TrackOrder';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminStock from './pages/admin/AdminStock';
import AddProduct from './pages/admin/AddProduct';
import KitchenView from './pages/admin/KitchenView';
import AdminQR from './pages/admin/AdminQR';

import AdminLogin from './pages/admin/AdminLogin';
import { Navigate } from 'react-router-dom';

/**
 * ProtectedRoute Component
 * Redirects to login if not authenticated
 */
const ProtectedRoute = ({ children, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function AppContent({ cart, setCart, addToCart, removeFromCart, isAdminAuthenticated, setIsAdminAuthenticated }) {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className={`min-h-screen bg-slate-50 ${!isAdminRoute ? 'pb-24 md:pb-0 md:pt-20' : ''}`}>
      <Toaster position="bottom-center" />
      
      {/* Show regular navbar only on customer routes */}
      {!isAdminRoute && <Navbar cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />}
      
      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Menu addToCart={addToCart} cartCount={cart.length} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} />
        <Route path="/success" element={<OrderSuccess />} />
        <Route path="/track" element={<TrackOrder />} />
        <Route path="/cart/admin" element={<Navigate to="/admin" replace />} />

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin setAuth={setIsAdminAuthenticated} />} />

        {/* Admin Routes (Shopkeeper Panel) - Protected */}
        <Route path="/admin" element={
          <ProtectedRoute isAuthenticated={isAdminAuthenticated}>
            <AdminLayout setAuth={setIsAdminAuthenticated} />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="stock" element={<AdminStock />} />
          <Route path="products" element={<AddProduct />} />
          <Route path="kitchen" element={<KitchenView />} />
          <Route path="qr" element={<AdminQR />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('admin_auth') === 'true';
  });
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    // Stock Validation
    const existingInCart = cart.find(item => item.id === product.id);
    const currentQtyInCart = existingInCart ? existingInCart.quantity : 0;

    if (product.stock !== undefined && currentQtyInCart >= product.stock) {
      toast.error(`Only ${product.stock} items available matching your selection.`, {
        style: { borderRadius: '16px', background: '#e11d48', color: '#fff' }
      });
      return;
    }

    toast.success(`${product.name} added to bag`, {
      style: {
        borderRadius: '20px',
        background: '#312e81',
        padding: '12px 24px',
        color: '#fff',
        fontWeight: 'bold',
      },
      iconTheme: {
        primary: '#fff',
        secondary: '#312e81',
      },
    });
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
      <AppContent 
        cart={cart} 
        setCart={setCart} 
        addToCart={addToCart} 
        removeFromCart={removeFromCart} 
        isAdminAuthenticated={isAdminAuthenticated}
        setIsAdminAuthenticated={setIsAdminAuthenticated}
      />
    </Router>
  );
}

export default App;
