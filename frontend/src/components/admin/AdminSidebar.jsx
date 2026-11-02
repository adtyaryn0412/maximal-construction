import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo-maximal.png';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
  { icon: 'calendar_month', label: 'Kelola Reservasi', path: '/admin/reservasi' },
  { icon: 'architecture', label: 'Kelola Portofolio', path: '/admin/portofolio' },
  { icon: 'construction', label: 'Kelola Layanan', path: '/admin/layanan' },
  { icon: 'reviews', label: 'Kelola Testimoni', path: '/admin/testimoni' },
  { icon: 'person', label: 'Kelola User', path: '/admin/user' },
  { icon: 'history', label: 'Log Aktivitas', path: '/admin/log' },
];

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-black flex-col py-6 shadow-md z-50">
      <div className="px-6 mb-8">
        <Link to="/admin/dashboard" className="block w-full hover:opacity-80 transition-opacity">
          <img src={Logo} alt="Maximal Construction" className="w-full max-w-[160px] object-contain" />
        </Link>
        <p className="text-xs text-[#858383] tracking-widest uppercase mt-1">
          Admin Panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 transition-all ${isActive
                  ? 'bg-craftsman-gold text-black rounded-full'
                  : 'text-[#c8c6c5] hover:text-white rounded-lg'
                }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-[16px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-[#474746] pt-4 px-2">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-[#ffdad6] rounded-lg mx-2 my-1 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="text-[16px]">Logout</span>
        </button>
      </div>
    </aside>
  );
}
