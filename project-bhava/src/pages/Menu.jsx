import React, { useState, useEffect } from 'react';
import { getProducts } from '../api/api';
import ProductCard from '../components/ProductCard';
import { Sparkles, ArrowRight, Search, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Menu = ({ addToCart, cartCount }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  const visibleProducts = filteredProducts.slice(0, 10);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-slate-50 border-t-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center font-black text-indigo-600">
            B
          </div>
        </div>
        <p className="mt-4 font-bold text-slate-400 tracking-widest uppercase text-xs">
          Curating Menu...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <section className="relative pt-12 pb-16 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full mb-6 animate-fade-in">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-widest">
              Order from home, pick up nearby
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-4 tracking-tighter leading-none">
            Order Ahead <br />
            <span className="gradient-text">Pickup When Ready.</span>
          </h1>
          <p className="max-w-2xl text-slate-500 font-medium text-lg leading-relaxed">
            Choose your nearby Smart Shop branch, place your order from home, and send someone later to
            collect it without waiting in line.
          </p>

          <div className="mt-10 relative max-w-xl group">
            <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
              <Search size={22} strokeWidth={2.5} />
            </div>
            <input
              type="text"
              placeholder="Search for dishes, cakes, or snacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-100 shadow-xl shadow-slate-200/50 px-16 py-6 rounded-[2rem] font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 focus:border-indigo-600 transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        <div className="absolute -top-24 -right-24 h-96 w-96 bg-indigo-100/50 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-24 h-64 w-64 bg-emerald-50/50 rounded-full blur-3xl"></div>
      </section>

      <main className="max-w-6xl mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
              Step 1
            </p>
            <p className="font-bold text-slate-700">Browse and add items from home.</p>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
              Step 2
            </p>
            <p className="font-bold text-slate-700">Choose shop and pickup time at checkout.</p>
          </div>
          <div className="bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-2">
              Step 3
            </p>
            <p className="font-bold text-slate-700">Track your token and collect when ready.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 px-8 py-4 rounded-2xl text-sm font-black transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-105'
                  : 'bg-white text-slate-400 border border-slate-50 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            {activeCategory} {searchTerm ? `Results for "${searchTerm}"` : 'Items'}
            <div className="h-1 w-12 bg-indigo-600 rounded-full"></div>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleProducts.length > 0 ? (
            visibleProducts.map((product) => (
              <ProductCard key={product.id} product={product} addToCart={addToCart} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="bg-white p-12 rounded-[3.5rem] inline-block shadow-sm border border-slate-50">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-[2rem] text-slate-300 mb-6">
                  <XCircle size={40} />
                </div>
                <p className="text-slate-800 text-xl font-black mb-2">No items found</p>
                <p className="text-slate-400 font-medium mb-6">
                  Try searching for something else or check another category.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setActiveCategory('All');
                  }}
                  className="text-indigo-600 font-black flex items-center gap-2 justify-center mx-auto hover:gap-3 transition-all"
                >
                  Clear all filters <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

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
              <span>View Pickup Bag</span>
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
