import React from 'react';
import { Copy, Share2, ExternalLink } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminQR = () => {
  const shopUrl = window.location.origin;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shopUrl);
      toast.success('Shop link copied!');
    } catch (error) {
      toast.error('Could not copy the link.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-fade-in pb-20 px-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Share Shop Link</h2>
          <p className="text-slate-500 font-bold text-sm mt-2 uppercase tracking-widest">
            Use the direct website link for home pickup orders
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-12 rounded-[4rem] shadow-2xl shadow-indigo-100 border border-slate-50 flex flex-col justify-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-4">
            Customer Entry Link
          </p>
          <div className="bg-slate-50 rounded-[2rem] p-6 break-all text-slate-700 font-bold">
            {shopUrl}
          </div>
          <div className="flex gap-4 mt-8">
            <button
              onClick={copyLink}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100"
            >
              <Copy size={16} /> Copy Link
            </button>
            <button
              onClick={() => window.open(shopUrl, '_blank')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white border border-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              <ExternalLink size={16} /> Open Shop
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Share2 size={80} />
            </div>
            <h4 className="text-xl font-black mb-4">Recommended sharing flow</h4>
            <ul className="space-y-4 text-slate-300 text-sm font-medium">
              <li>1. Share this link on WhatsApp, Instagram, or Google Business profile.</li>
              <li>2. Customer opens the site from home and places a pickup order.</li>
              <li>3. Staff accept it, prepare it, and update status in admin.</li>
              <li>4. Customer sends someone only after the order turns Ready.</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
            <h4 className="font-black text-slate-800 mb-2">Where this link should appear</h4>
            <p className="text-slate-500 text-sm leading-relaxed">
              Add it to your WhatsApp bio, Google Maps listing, Instagram profile, and local
              customer groups so people can order from home without scanning any QR code.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminQR;
