import React, { useState } from 'react';
import { addProduct, uploadImage } from '../../api/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Loader2, IndianRupee, Box, Tag, FileText } from 'lucide-react';

const AddProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        stock: '',
        category: 'Fast Food',
        description: '',
        image: null
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageId = null;
            
            // 1. Upload Image First if selected
            if (formData.image) {
                const imgData = new FormData();
                imgData.append('files', formData.image);
                const uploadResp = await uploadImage(imgData);
                imageId = uploadResp.data[0].id;
            }

            // 2. Add Product
            const productPayload = {
                name: formData.name,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                category: formData.category,
                description: formData.description,
                image: imageId,
                available: parseInt(formData.stock) > 0
            };

            await addProduct(productPayload);
            toast.success("Product added to menu!");
            navigate('/admin/stock');
        } catch (error) {
            console.error(error);
            toast.error("Failed to add product. Check API permissions?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-20">
            <div className="mb-10 text-center">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight mb-2">Add New Product</h2>
                <p className="text-slate-400 font-medium tracking-wide border-b border-indigo-100 inline-block pb-1">Expand your shop's offerings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload Area */}
                <div className="relative group h-64 w-full bg-white border-4 border-dashed border-slate-100 rounded-[3rem] overflow-hidden transition-all hover:border-indigo-100 mb-8">
                    {preview ? (
                        <div className="relative h-full w-full">
                            <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                            <button 
                                type="button" 
                                onClick={() => { setPreview(null); setFormData({ ...formData, image: null }); }}
                                className="absolute top-4 right-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-rose-500 shadow-lg hover:bg-white transition-all shadow-rose-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center h-full w-full cursor-pointer group">
                             <div className="bg-indigo-50 p-6 rounded-[2rem] text-indigo-500 mb-4 group-hover:scale-110 transition-transform duration-500">
                                <ImagePlus size={32} />
                             </div>
                             <span className="text-slate-400 font-black text-xs uppercase tracking-[0.2em]">Drop Product Image</span>
                             <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                        </label>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Product Name</label>
                        <div className="relative">
                            <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                required
                                type="text"
                                placeholder="Classic Burger"
                                className="w-full bg-white border border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Price (INR)</label>
                        <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                required
                                type="number"
                                placeholder="199"
                                className="w-full bg-white border border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Stock */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Initial Stock</label>
                        <div className="relative">
                            <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input 
                                required
                                type="number"
                                placeholder="50"
                                className="w-full bg-white border border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Category</label>
                        <div className="relative">
                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <select 
                                className="w-full bg-white border border-slate-50 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-bold text-slate-700 appearance-none"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Fast Food</option>
                                <option>Beverages</option>
                                <option>Bakery</option>
                                <option>Dairy</option>
                                <option>Daily Essentials</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Description</label>
                    <div className="relative">
                        <FileText className="absolute left-4 top-5 text-slate-300" size={18} />
                        <textarea 
                            rows="4"
                            placeholder="Tell customers about this item..."
                            className="w-full bg-white border border-slate-50 rounded-[2rem] py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-100 font-medium text-slate-600"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={24} /> : "Publish to Shop"}
                </button>
            </form>
        </div>
    );
};

// Simple wrapper icon
const Package = ({ size, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
);

export default AddProduct;
