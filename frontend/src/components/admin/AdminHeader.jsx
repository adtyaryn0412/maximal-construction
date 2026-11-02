import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

export default function AdminHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSOP, setShowSOP] = useState(false);
  
  // Notification States
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    // Fetch latest anomaly logs
    const fetchAnomalies = async () => {
      try {
        const res = await api.get('/admin/activity-logs', { params: { category: 'keamanan', per_page: 5 } });
        const logs = res.data?.logs?.data || [];
        setNotifications(logs);
        
        if (logs.length > 0) {
          const latestId = logs[0].id;
          const lastSeenId = localStorage.getItem('last_seen_anomaly_id');
          if (!lastSeenId || parseInt(lastSeenId, 10) < latestId) {
            setHasUnread(true);
          }
        }
      } catch (err) {
        console.error('Failed to fetch anomalies', err);
      }
    };
    fetchAnomalies();
    
    // Auto-refresh anomalies every minute
    const interval = setInterval(fetchAnomalies, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Handle click outside notification dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleNotifications = () => {
    if (!showNotifications && notifications.length > 0) {
      // Mark as read
      localStorage.setItem('last_seen_anomaly_id', notifications[0].id.toString());
      setHasUnread(false);
    }
    setShowNotifications(!showNotifications);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayLabel = currentTime.toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const timeLabel = currentTime.toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).replace(/\./g, ':');

  return (
    <header className="flex justify-between items-center w-full px-4 md:px-10 py-4 bg-white shadow-sm z-40 sticky top-0">
      <div className="flex flex-col md:flex-row md:items-center gap-0 md:gap-3 text-[#444748] font-medium text-[10px] md:text-base leading-tight">
        <span>{todayLabel}</span>
        <span className="hidden md:inline text-zinc-300">|</span>
        <span className="font-semibold text-zinc-600">
          {timeLabel}
        </span>
      </div>
      <div className="flex items-center gap-6 relative">
        <div className="relative" ref={notifRef}>
          <span 
            className="material-symbols-outlined text-[#444748] hover:text-black transition-colors cursor-pointer relative" 
            title="Kotak Masuk Anomali"
            onClick={handleToggleNotifications}
          >
            notifications
            {hasUnread && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
            )}
          </span>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-zinc-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
              <div className="px-4 py-3 border-b border-zinc-100 bg-zinc-50 flex justify-between items-center">
                <h3 className="font-bold font-['Montserrat'] text-sm text-zinc-800">Log Anomali Terbaru</h3>
                <span className="text-[10px] uppercase font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Keamanan</span>
              </div>
              
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-xs text-zinc-500">Sistem aman. Tidak ada anomali.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-zinc-50">
                    {notifications.map((log) => (
                      <div key={log.id} className="p-4 hover:bg-zinc-50 transition-colors flex gap-3 items-start">
                        <span className="material-symbols-outlined text-[18px] text-red-500 mt-0.5">
                          {log.action.includes('RATE_LIMITED') ? 'timer' : 'gpp_maybe'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-zinc-900 truncate">
                            {log.action.includes('RATE_LIMITED') ? 'Terlalu Banyak Percobaan Login' : 'Akses Tidak Sah (Ditolak)'}
                          </p>
                          <div className="flex flex-col gap-0.5 mt-1">
                            <p className="text-[10px] text-zinc-500 truncate"><span className="font-bold text-zinc-600">IP:</span> {log.ip_address} • {log.user ? log.user.name : 'Unknown User'}</p>
                            <p className="text-[9px] text-zinc-400 truncate font-mono bg-zinc-100 px-1 py-0.5 rounded w-max max-w-full border border-zinc-200" title={log.user_agent}>
                              {log.method} {log.url}
                            </p>
                          </div>
                          <p className="text-[9px] font-bold text-zinc-400 mt-1.5">
                            {new Date(log.created_at).toLocaleString("id-ID", {
                              day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", second: "2-digit"
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="p-3 border-t border-zinc-100 bg-white">
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/admin/log?filter=keamanan');
                  }}
                  className="w-full py-2 text-xs font-semibold text-craftsman-gold hover:bg-craftsman-gold/10 rounded-lg transition-colors text-center"
                >
                  Lihat Semua Log Keamanan
                </button>
              </div>
            </div>
          )}
        </div>
        <span 
          className="material-symbols-outlined text-[#444748] hover:text-black transition-colors cursor-pointer"
          onClick={() => setShowSOP(true)}
        >
          help
        </span>
        
        <div className="flex items-center gap-3 border-l border-[#c4c7c7] pl-4 md:pl-6">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold truncate max-w-[120px]">{user?.name || 'Admin'}</p>
            <p className="text-xs text-[#444748]">Administrator</p>
          </div>
          <span className="material-symbols-outlined text-[36px] text-[#c4c7c7]">
            account_circle
          </span>
        </div>
      </div>

      {showSOP && (
        <div 
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setShowSOP(false)}
        >
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-lg w-full border border-zinc-200">
            <div className="flex items-center gap-3 mb-6">
              <span className="material-symbols-outlined text-craftsman-gold text-3xl">menu_book</span>
              <h2 className="text-xl font-bold font-['Montserrat']">SOP Admin Sistem</h2>
            </div>
            
            <div className="space-y-4 text-sm text-zinc-600 font-medium">
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                <p>Selalu periksa <b>Log Aktivitas</b> secara berkala untuk memantau keamanan dan mendeteksi anomali.</p>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-blue-600">check_circle</span>
                <p>Perubahan <b>Status Reservasi</b> akan langsung terlihat oleh Klien. Pastikan data sudah valid sebelum menyetujui atau menolak reservasi.</p>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-amber-600">check_circle</span>
                <p>Jaga kerahasiaan privasi data kontak Klien dan moderasi Testimoni dari kata-kata yang tidak pantas (Spam).</p>
              </div>
              <div className="flex gap-3">
                <span className="material-symbols-outlined text-red-600">check_circle</span>
                <p>Tindakan <b>Hapus Proyek / Layanan</b> bersifat permanen dan tidak dapat dikembalikan. Lakukan dengan hati-hati.</p>
              </div>
            </div>

            <button 
              onClick={() => setShowSOP(false)}
              className="mt-8 w-full py-3 bg-black text-white rounded-lg font-semibold hover:bg-zinc-800 transition-colors"
            >
              Saya Mengerti
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
