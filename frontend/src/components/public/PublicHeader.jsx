import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useRef } from 'react';
import Logo from '../../assets/logo-maximal.png';

const navItems = [
  { id: 'beranda', label: 'Beranda', icon: 'home' },
  { id: 'tentang', label: 'Tentang', icon: 'info' },
  { id: 'layanan', label: 'Layanan', icon: 'construction' },
  { id: 'portofolio', label: 'Portofolio', icon: 'architecture' },
  { id: 'kontak', label: 'Kontak', icon: 'call' },
];

export default function PublicHeader() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('beranda');
  const [scrolled, setScrolled] = useState(false);

  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  const observerRef = useRef(null);
  const navRefs = useRef({});
  const navWrapRef = useRef(null);

  useEffect(() => {
    if (location.pathname !== '/') return;

    const sectionEls = navItems
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    if (!sectionEls.length) return;

    const ratioMap = {};

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { ratioMap[e.target.id] = e.intersectionRatio; });

        let best = null, bestRatio = 0;
        Object.entries(ratioMap).forEach(([id, ratio]) => {
          if (ratio > bestRatio) { bestRatio = ratio; best = id; }
        });

        if (best) setActiveSection(best);
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1.0] }
    );

    sectionEls.forEach((el) => observerRef.current.observe(el));
    return () => observerRef.current?.disconnect();
  }, [location.pathname]);

  useEffect(() => {
    const activeEl = navRefs.current[activeSection];
    const wrapperEl = navWrapRef.current;

    if (!activeEl || !wrapperEl || location.pathname !== '/') {
      setIndicatorStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }

    const wrapRect = wrapperEl.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    setIndicatorStyle({
      left: itemRect.left - wrapRect.left + itemRect.width * 0.1,
      width: itemRect.width * 0.8,
      opacity: 1,
    });
  }, [activeSection, location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isActive = (id) => location.pathname === '/' && activeSection === id;

  return (
    <>
      <header
      className={`fixed top-0 left-0 w-full z-50 h-16 transition-all duration-300
        ${scrolled
          ? 'bg-zinc-950/95 backdrop-blur-md shadow-lg shadow-black/30'
          : 'bg-zinc-950'
        }`}
    >
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop flex justify-between items-center h-full">


        <Link
          to="/"
          className="shrink-0 hover:opacity-80 transition-opacity"
        >
          <img src={Logo} alt="Maximal Construction" className="h-8 md:h-10 object-contain" />
        </Link>


        <nav ref={navWrapRef} className="hidden md:flex items-center gap-8 relative">
          {navItems.map((item) => (
            <a
              key={item.id}
              ref={(el) => { navRefs.current[item.id] = el; }}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`
                pb-2 text-xs font-bold uppercase tracking-wider transition-colors hover:text-craftsman-gold
                ${isActive(item.id) ? 'text-craftsman-gold' : 'text-white'}
              `}
            >
              {item.label}
            </a>
          ))}
          
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: indicatorStyle.left,
              width: indicatorStyle.width,
              opacity: indicatorStyle.opacity,
              transition: 'left 400ms cubic-bezier(0.25, 1, 0.5, 1), width 400ms cubic-bezier(0.25, 1, 0.5, 1), opacity 300ms ease',
              height: '2px',
              borderRadius: '9999px',
              backgroundColor: '#C8972B',
              pointerEvents: 'none',
            }}
          />
        </nav>


        <div className="flex items-center gap-4 shrink-0">
          {user ? (
            <>
              <span className={`hidden md:inline text-sm font-semibold transition-colors text-white hover:text-craftsman-gold`}>
                Halo, {user.name.split(' ')[0]}
              </span>
              <Link
                to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                className="bg-craftsman-gold text-primary text-xs font-bold px-6 py-2 rounded-full uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
              >
                Dashboard Saya
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`hidden md:block text-xs font-bold uppercase tracking-wider transition-colors text-white hover:text-craftsman-gold`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-craftsman-gold text-primary text-xs font-bold px-6 py-2 rounded-full uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

      </div>
      </header>

      {/* Mobile Floating Navigation Pill */}
      <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl">
          {navItems.map((item) => (
            <a
              key={`mobile-${item.id}`}
              href={`#${item.id}`}
              onClick={(e) => handleNavClick(e, item.id)}
              className={`flex flex-col items-center justify-center transition-all ${
                isActive(item.id) ? 'text-craftsman-gold scale-110' : 'text-white/60 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              {isActive(item.id) && (
                <span className="text-[9px] font-bold mt-1 uppercase tracking-wider">
                  {item.label}
                </span>
              )}
            </a>
          ))}
        </div>
      </nav>
    </>
  );
}
