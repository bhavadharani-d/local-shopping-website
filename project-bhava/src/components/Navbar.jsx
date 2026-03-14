import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Utensils, ShoppingBag, Search } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 px-6 py-3 z-50 md:top-0 md:bottom-auto md:border-t-0 md:border-b">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <Link to="/" className="hidden md:flex items-center gap-2 text-indigo-600 font-black text-2xl tracking-tighter">
          BHAVA SHOP
        </Link>
        
        <div className="flex justify-around items-center w-full md:w-auto md:gap-8">
          <Link 
            to="/" 
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${isActive('/') ? 'text-indigo-600' : 'text-slate-400 font-medium'}`}
          >
            <Utensils size={24} />
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Menu</span>
          </Link>
          
          <Link 
            to="/cart" 
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 relative transition-colors ${isActive('/cart') ? 'text-indigo-600' : 'text-slate-400 font-medium'}`}
          >
            <ShoppingBag size={24} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center border-2 border-white">
                {cartCount}
              </span>
            )}
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Cart</span>
          </Link>

          <Link 
            to="/track" 
            className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 transition-colors ${isActive('/track') ? 'text-indigo-600' : 'text-slate-400 font-medium'}`}
          >
            <Search size={24} />
            <span className="text-[10px] md:text-sm font-bold uppercase tracking-widest">Track</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
