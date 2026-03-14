import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Menu = ({ addToCart, cartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-4 border-slate-50 border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-600">B</div>
      </div>
      <p className="mt-4 font-bold text-slate-400 tracking-widest uppercase text-xs">Curating Menu...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-6 animate-fade-in">
             <Sparkles size={16} />
             <span className="text-xs font-bold uppercase tracking-widest">Open for orders</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter leading-none">
            Freshly Made <br /> 
            <span className="gradient-text">Just For You.</span>
          </h1>
          <p className="text-slate-500 text-lg md:text-xl max-w-xl leading-relaxed">
            Experience the future of local shopping. Browse our curated menu and place your order in seconds.
          </p>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute -top-24 -right-24 h-96 w-96 bg-indigo-100/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 h-64 w-64 bg-emerald-50/50 rounded-full blur-3xl"></div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-32">
        <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                Featured Items
                <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
            </h2>
            <div className="flex gap-2">
                {/* Categories could go here */}
                {['All', 'Popular', 'Healthy'].map(cat => (
                    <button key={cat} className="hidden md:block transition-all hover:bg-white px-4 py-2 rounded-xl text-sm font-bold text-slate-400 hover:text-indigo-600">
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.length > 0 ? (
            products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                addToCart={addToCart} 
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
                <div className="bg-white p-10 rounded-[3rem] inline-block shadow-sm">
                    <p className="text-slate-400 font-bold mb-4">The kitchen is empty!</p>
                    <Link to="/" className="text-indigo-600 font-black flex items-center gap-2 justify-center">
                        Add Products in Strapi <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Cart Button (Mobile Only) */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 left-6 right-6 md:hidden">
            <Link 
                to="/cart"
                className="btn-primary w-full flex items-center justify-between px-8 shadow-2xl shadow-indigo-300"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-lg">
                        <Sparkles size={18} />
                    </div>
                    <span>View Ordering Bag</span>
                </div>
                <span className="bg-white text-indigo-600 px-3 py-1 rounded-full text-xs font-black">
                    {cartCount} Items
                </span>
            </Link>
        </div>
      )}
    </div>
  );
};

export default Menu;
