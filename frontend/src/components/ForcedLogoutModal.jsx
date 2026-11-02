import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ForcedLogoutModal() {
  const { forcedLogout, clearForcedLogout } = useAuth();
  const navigate = useNavigate();

  if (!forcedLogout) return null;

  const handleClose = () => {
    clearForcedLogout();
    navigate('/login');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl">block</span>
        </div>
        <h3 className="text-lg font-bold text-zinc-900 mb-2">Akun Anda Telah Dinonaktifkan</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Admin telah menonaktifkan akun Anda. Silakan hubungi admin jika ini adalah kesalahan.
        </p>
        <button
          onClick={handleClose}
          className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Mengerti
        </button>
      </div>
    </div>
  );
}