import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../assets/logo-maximal.png';

const navItems = [
  { to: '/dashboard', label: 'Beranda', icon: 'home' },
  { to: '/reservasi/ajukan', label: 'Ajukan', icon: 'add_circle' },
  { to: '/reservasi', label: 'Riwayat', icon: 'history' },
  { to: '/profil', label: 'Profil', icon: 'person' },
];

export default function UserHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isActive = (to) => {
    if (to === '/reservasi') {
      return location.pathname === '/reservasi' || location.pathname.startsWith('/reservasi/detail');
    }
    return location.pathname === to;
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-primary/95 backdrop-blur-md shadow-md">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop flex justify-between items-center h-20">

        
        <Link
          to="/"
          className="shrink-0 hover:opacity-80 transition-opacity"
        >
          <img src={Logo} alt="Maximal Construction" className="h-8 md:h-10 object-contain" />
        </Link>

        
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={
                isActive(item.to)
                  ? 'px-4 text-sm font-semibold text-craftsman-gold border-b-2 border-craftsman-gold pb-1 transition-colors'
                  : 'px-4 text-sm text-white/60 hover:text-white transition-colors'
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>

        
        <div className="flex items-center gap-4 shrink-0">
          {user && (
            <span className="hidden md:inline text-xs text-white/40 tracking-wider">
              Halo,{' '}
              <span className="text-white/70 font-semibold">{user.name.split(' ')[0]}</span>
            </span>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-white/50 border border-white/10 hover:border-craftsman-gold hover:text-craftsman-gold px-3 py-1.5 rounded-full transition-all"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>logout</span>
            Keluar
          </button>
        </div>
      </div>
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-craftsman-gold/40 to-transparent" />
      </header>

      {/* Mobile Floating Navigation Pill */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[400px]">
        <div className="bg-zinc-900/95 backdrop-blur-xl border border-white/10 px-4 py-3 rounded-full flex items-center justify-between shadow-2xl">
          {navItems.map((item) => (
            <Link
              key={`mobile-${item.to}`}
              to={item.to}
              className={`flex flex-col items-center justify-center transition-all w-16 ${
                isActive(item.to) ? 'text-craftsman-gold scale-110' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              {isActive(item.to) && (
                <span className="text-[9px] font-bold mt-1 uppercase tracking-wider text-center line-clamp-1">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
