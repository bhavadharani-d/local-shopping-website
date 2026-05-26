import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct } from '../../api/api';
import { toast } from 'react-hot-toast';
import { Box, Plus, Minus, AlertTriangle, Search } from 'lucide-react';

const AdminStock = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const resp = await getProducts();
            setProducts(resp.data.data);
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const handleStockUpdate = async (documentId, currentStock, delta) => {
        const newStock = Math.max(0, currentStock + delta);
        try {
            await updateProduct(documentId, { stock: newStock, available: newStock > 0 });
            setProducts(prev => prev.map(p => p.documentId === documentId ? { ...p, stock: newStock, available: newStock > 0 } : p));
            toast.success("Stock updated", { id: `stock-${documentId}` }); // Single toast
        } catch (error) {
            toast.error("Failed to update stock");
        }
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center font-bold text-slate-400">Loading Stock...</div>;

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Stock Management</h2>
                    <p className="text-slate-400 font-medium text-sm">Monitor and update inventory levels</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search products..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-50 rounded-2xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-100 placeholder:text-slate-300 font-medium"
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                    <div key={product.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 group hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-500">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                                🍕
                            </div>
                            {product.stock < 5 && (
                                <div className="flex items-center gap-1.5 animate-pulse">
                                    <div className="h-2 w-2 rounded-full bg-rose-600 shadow-[0_0_10px_rgba(225,29,72,0.8)]"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-600">Panic! Low Stock</span>
                                </div>
                            )}
                        </div>

                        <h3 className="font-black text-xl text-slate-800 mb-1">{product.name}</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6">{product.category || 'General'}</p>

                        <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                             <span className="text-slate-400 font-bold text-xs uppercase tracking-widest">In Stock</span>
                             <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => handleStockUpdate(product.documentId, product.stock, -1)}
                                    className="h-8 w-8 bg-white text-slate-400 hover:text-rose-500 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 border border-slate-50"
                                >
                                    <Minus size={14} />
                                </button>
                                <span className={`text-xl font-black w-8 text-center ${product.stock < 5 ? 'text-orange-500' : 'text-slate-800'}`}>
                                    {product.stock}
                                </span>
                                <button 
                                    onClick={() => handleStockUpdate(product.documentId, product.stock, 1)}
                                    className="h-8 w-8 bg-white text-slate-400 hover:text-indigo-600 rounded-lg flex items-center justify-center shadow-sm hover:shadow-md transition-all active:scale-95 border border-slate-50"
                                >
                                    <Plus size={14} />
                                </button>
                             </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="py-20 text-center bg-white rounded-[3rem]">
                    <Box className="mx-auto text-slate-100 mb-4" size={60} />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No products found matching your search</p>
                </div>
            )}
        </div>
    );
};

export default AdminStock;
