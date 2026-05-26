import React from 'react';
import { Plus, Info, Star, AlertCircle } from 'lucide-react';
import appleImage from '../../images/apple.webp';
import jungleLionCakeImage from '../../images/jungle-joy-lion-cake.webp';

const ProductCard = ({ product, addToCart }) => {
  const LOCAL_IMAGE_MAP = {
    'apple': appleImage,
    'jungle joy lion cake': jungleLionCakeImage,
  };

  // 🎯 THE ULTIMATE TRUTH MAP (Freshly Verified IDs)
  const EXACT_IMAGE_MAP = {
    // Cakes
    'jungle joy lion cake': '1535254973040-607b474cb8c2',
    'jungle safari adventure cake': '1535254973040-607b474cb8c2',
    'red velvet delight': '1616031037011-087000171abe',
    'blueberry cheesecake': '1533134242443-d4fd215305ad',
    'black forest classic': '1606312619070-d48b4c652a52',
    'pineapple paradise': '1565958011703-44f9a29b08d8',
    'chocolate cake': '1606312619112-ad1143c4850a',
    'rich chocolate truffle': '1562447471-9b1990998636',
    'truflle indulgence': '1562447471-9b1990998636', 
    'mango mousse cake': '1591154707335-44bb2759c6b3',
    'vanilla bean cake': '1523217582562-09d0def993a6',
    'butterscotch crunch': '1582716401301-b2407dc7563d',
    'strawberry shortcake': '1464305795204-6f5bdf7f8740',
    'opera cake': '1558961312-50345c252220',

    // Burgers
    'classic veggie burger': '1568901346375-23c9450c58cd',
    'crispy paneer burger': '1610440042657-6dd2c44c5e27',
    'big cheese burger': '1572802419224-296b0aeee0d9',
    'mushroom swiss burger': '1550547660-d9450f859349',
    'sweet potato burger': '1525059696034-4767759ad7ac',

    // Pizza
    'margherita gold': '1574071318508-1cd304da64d',
    'paneer tikka pizza': '1565299624946-b28f40a0ae38',
    'farmhouse special': '1593560708920-61dd98c46a4e',
    'spicy jalapeno pizza': '1604908812723-57f3521e1069',
    'garden veggie pizza': '1513104890138-7c749659a591',

    // Drinks
    'cold coffee classic': '1517701604599-bb29b565090c',
    'mango lassi': '1576092768241-dec231879fc3',
    'fresh lime soda': '1513558161293-cdaf765ed2fd',
    'iced peach tea': '1556679343-c7306c1976bc',
    'chocolate milkshake': '1572490122747-3968b75cc699',
    'strawberry smoothie': '1547514701-426322609993',
    'virgin mojito': '1513558161293-cdaf765ed2fd',
    'orange juice': '1613478223719-2ab802602423',
    'hot cocoa': '1544787210-282d9cf94fa3',
    'masala chai': '1576092768241-dec231879fc3',

    // Snacks
    'french fries': '1573080496219-bb080dd4f877',
    'peri peri fries': '1630383249396-0580bfd867c0',
    'garlic breadsticks': '1541745537-7689914d5d3b',
    'cheese nachos': '1513456852971-30c0b8199d4d',
    'vegetable momos': '1523905330026-b8bd1f5f320e',
    'onion rings': '1639023733306-44766e403fa0',
    'samosa duo': '1601050638911-c3269d04041d',
    'spring rolls': '1475855531242-23c76b15a91d',
    'potato wedges': '1566818616-56dec85c9827',
    'chilli paneer dry': '1610440042657-6dd2c44c5e27',

    // Desserts
    'gulab jamun': '1589119634706-e7592cf1e63a',
    'dark choco brownie': '1564355808539-22fda35bed7e',
    'apple pie': '1568571780-45f47769e634',
    'fruit salad': '1519996521431-b2ad4400bb1d',
    'vanilla ice cream': '1501443762994-82bd5dace89a',
    'chocolate lava cake': '1562447471-9b1990998636',
    'tiramisu cup': '1571877427382-796a026bc72b',
    'rasmalai delight': '1589119634706-e7592cf1e63a',
    'baklava plate': '1589119634706-e7592cf1e63a',
    'creme brulee': '1470148056626-241598287752',

    // Others
    'apple': '1567306226416-28f714952842'
  };

  const getFallback = (cat) => {
    if (cat === 'Cakes') return 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800';
    if (cat === 'Burgers') return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800';
    if (cat === 'Pizza') return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800';
    return 'https://images.unsplash.com/photo-1504674900263-55d8d9436a0d?q=80&w=800';
  };

  const name = product.name.toLowerCase().trim();
  const initialUrl = LOCAL_IMAGE_MAP[name] || (EXACT_IMAGE_MAP[name]
    ? `https://images.unsplash.com/photo-${EXACT_IMAGE_MAP[name]}?auto=format&fit=crop&q=80&w=800`
    : getFallback(product.category));

  const [imgUrl, setImgUrl] = React.useState(initialUrl);

  // Sync image if product changes
  React.useEffect(() => {
    setImgUrl(initialUrl);
  }, [product.name]);

  const handleImageError = () => {
    setImgUrl(getFallback(product.category));
  };

  const isLowStock = product.stock > 0 && product.stock <= 5;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className={`group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(99,102,241,0.12)] border border-slate-50 flex flex-col h-full ${isOutOfStock ? 'opacity-75 grayscale-[0.5]' : ''}`}>
      
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden rounded-[2rem] mb-6">
        <img 
          src={imgUrl} 
          alt={product.name} 
          onError={handleImageError}
          className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
            {isLowStock && (
                <span className="bg-orange-500 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-orange-200 animate-pulse">
                    <AlertCircle size={12} /> Low Stock
                </span>
            )}
            {isOutOfStock && (
                <span className="bg-slate-800 text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                    Out of Stock
                </span>
            )}
        </div>

        <div className="absolute top-4 right-4">
             <span className="glass-card px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Star size={12} className="fill-indigo-600" /> {product.category || 'Popular'}
            </span>
        </div>
        
        {/* Quick Add Overlay (Desktop Only) */}
        {!isOutOfStock && (
            <div className="hidden md:flex absolute inset-0 bg-indigo-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 items-center justify-center backdrop-blur-[2px]">
                <button 
                    onClick={() => addToCart(product)}
                    className="bg-white text-indigo-600 px-6 py-4 rounded-2xl shadow-2xl transform translate-y-10 group-hover:translate-y-0 transition-all duration-500 font-black flex items-center gap-3 hover:bg-indigo-600 hover:text-white"
                >
                    <Plus size={20} strokeWidth={3} /> Add to Order
                </button>
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 px-2">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-black text-2xl text-slate-800 tracking-tight leading-tight">{product.name}</h3>
          <span className="text-2xl font-black text-indigo-600">₹{product.price}</span>
        </div>
        
        <p className="text-slate-400 text-sm mb-6 leading-relaxed line-clamp-2 font-medium">
          {product.description || "Indulge in our chef's special creation, made with the finest local ingredients."}
        </p>

        {/* Mobile Order Button */}
        {!isOutOfStock && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="md:hidden w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-4 rounded-[1.25rem] mb-6 font-black flex items-center justify-center gap-3 shadow-lg shadow-indigo-100 active:scale-[0.98] transition-all duration-200"
          >
            <Plus size={20} strokeWidth={3} /> 
            <span>Order Now</span>
          </button>
        )}
        
        <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
          <div className="flex items-center gap-3">
             <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? 'bg-slate-300' : isLowStock ? 'bg-orange-500 animate-pulse' : 'bg-emerald-500'}`}></div>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                {isOutOfStock ? 'Sold Out' : isLowStock ? `Only ${product.stock} Left` : 'In Stock'}
             </span>
          </div>
          <button className="text-slate-300 hover:text-indigo-400 transition-colors p-2 rounded-full hover:bg-indigo-50">
            <Info size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
