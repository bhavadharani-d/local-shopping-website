import React from 'react';
import { Plus, Info, Star } from 'lucide-react';

const ProductCard = ({ product, addToCart }) => {
  const imageUrl = product.image 
    ? `http://localhost:1337${product.image.url}` 
    : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop';

  return (
    <div className="group relative bg-white rounded-[2rem] p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(99,102,241,0.1)] border border-slate-50">
      {/* Image Container with Hover Effect */}
      <div className="relative h-56 w-full overflow-hidden rounded-[1.5rem] mb-4">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex gap-2">
            <span className="glass-card px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
                <Star size={10} className="fill-indigo-600" /> Best Seller
            </span>
        </div>
        
        {/* Quick Add Overlay */}
        <div className="absolute inset-0 bg-indigo-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <button 
                onClick={() => addToCart(product)}
                className="bg-white text-indigo-600 p-4 rounded-full shadow-xl transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 font-bold flex items-center gap-2"
            >
                <Plus size={20} /> Add to Order
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-2 pb-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-extrabold text-xl text-slate-800 tracking-tight">{product.name}</h3>
          <span className="text-xl font-black text-indigo-600">₹{product.price}</span>
        </div>
        
        <p className="text-slate-400 text-sm mb-5 leading-relaxed line-clamp-2">
          {product.description || "Indulge in our chef's special creation, made with the finest local ingredients."}
        </p>
        
        <div className="flex items-center justify-between border-t border-slate-50 pt-4">
          <div className="flex items-center gap-2">
             <div className={`h-2 w-2 rounded-full ${product.stock < 5 ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
             <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {product.stock < 5 ? `Low Stock: ${product.stock}` : 'Available'}
             </span>
          </div>
          <button className="text-slate-300 hover:text-indigo-400 transition-colors">
            <Info size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
