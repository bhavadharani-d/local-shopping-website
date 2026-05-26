import React from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, PlusSquare, ArrowLeft, LogOut, QrCode, BarChart3 } from 'lucide-react';

const AdminLayout = ({ setAuth }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setAuth(false);
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', name: 'Orders', icon: <LayoutDashboard size={20} /> },
    { path: '/admin/analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/admin/stock', name: 'Stock', icon: <Box size={20} /> },
    { path: '/admin/qr', name: 'Shop Link', icon: <QrCode size={20} /> },
    { path: '/admin/products', name: 'Add Product', icon: <PlusSquare size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-100 flex-col p-6 h-screen sticky top-0">
        <div className="mb-12 px-2">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tighter">SMART SHOP ADMIN</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Shopkeeper Panel
          </p>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                isActive(item.path)
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                  : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-all mt-4"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>

        <div className="pt-8 border-t border-slate-50">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-4 rounded-2xl font-bold text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Live Shop
          </Link>
        </div>
      </aside>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 z-50 flex justify-around p-4 backdrop-blur-md">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 ${
              isActive(item.path) ? 'text-indigo-600' : 'text-slate-300'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold uppercase">{item.name}</span>
          </Link>
        ))}
      </nav>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto mb-20 md:mb-0">
        <header className="md:hidden flex justify-between items-center mb-8">
          <h1 className="text-xl font-black text-indigo-600 tracking-tighter">SMART SHOP ADMIN</h1>
          <button
            onClick={handleLogout}
            className="text-rose-400 p-2 hover:bg-rose-50 rounded-xl transition-all"
          >
            <LogOut size={22} />
          </button>
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
