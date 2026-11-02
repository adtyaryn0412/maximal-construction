import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

const NAV_ITEMS = [
  { icon: 'dashboard', label: 'Dasbor', path: '/admin/dashboard' },
  { icon: 'calendar_month', label: 'Reservasi', path: '/admin/reservasi' },
  { icon: 'architecture', label: 'Portofolio', path: '/admin/portofolio' },
  { icon: 'construction', label: 'Layanan', path: '/admin/layanan' },
  { icon: 'reviews', label: 'Testimoni', path: '/admin/testimoni' },
  { icon: 'person', label: 'User', path: '/admin/user' },
  { icon: 'history', label: 'Log', path: '/admin/log' },
];

export default function AdminLayout() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/" replace />;

  const location = useLocation();

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-['Montserrat'] relative pb-20 md:pb-0">
      <AdminSidebar />

      <main className="md:pl-64 flex flex-col min-h-screen">
        <AdminHeader />

        <div className="flex-1 overflow-y-auto px-4 md:px-0">
          <Outlet />
        </div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 px-1">
        <div className="grid grid-cols-7 w-full h-16 items-center">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={`mob-${item.path}`}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-craftsman-gold' : 'text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <span className="material-symbols-outlined text-[20px] md:text-[24px]">
                  {item.icon}
                </span>
                <span className="text-[7.5px] font-bold tracking-tight truncate w-full text-center px-0.5 leading-none">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
