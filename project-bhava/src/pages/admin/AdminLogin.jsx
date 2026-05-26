import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminLogin = ({ setAuth }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple password check for now
    // In a real app, this would be an API call to Strapi
    setTimeout(() => {
      if (password === 'admin123') {
        localStorage.setItem('admin_auth', 'true');
        setAuth(true);
        toast.success('Welcome back, Admin!', {
            style: { borderRadius: '20px', background: '#312e81', color: '#fff' }
        });
        navigate('/admin');
      } else {
        toast.error('Incorrect Password', {
            style: { borderRadius: '20px', background: '#e11d48', color: '#fff' }
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-[2.5rem] text-white mb-6 shadow-2xl shadow-indigo-200 animate-float">
            <Lock size={32} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">Admin Access</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Secure Gateway for SMART SHOP</p>
        </div>

        {/* Login Form */}
        <div className="bg-white p-10 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles size={80} className="text-indigo-600" />
          </div>

          <form onSubmit={handleLogin} className="relative z-10">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-4">Master Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                    <Lock size={18} />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border-none px-12 py-5 rounded-2xl font-bold text-slate-800 focus:ring-4 focus:ring-indigo-600/10 transition-all placeholder:text-slate-300"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Enter Dashboard</span>
                    <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="mt-10 text-center text-slate-400 text-sm font-medium">
          Not an admin? <button onClick={() => navigate('/')} className="text-indigo-600 font-black">Go back to shop</button>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
