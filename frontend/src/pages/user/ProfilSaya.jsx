import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import UserHeader from '../../components/user/UserHeader';
import UserFooter from '../../components/user/UserFooter';

export default function ProfilSaya() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    name:    user?.name    || '',
    email:   user?.email   || '',
    phone:   user?.phone   || '',
    address: user?.address || '',
  });
  const [snapshot, setSnapshot]     = useState({ ...profileForm });
  const [isEditing, setIsEditing]   = useState(false);
  const [profileMsg, setProfileMsg]   = useState('');
  const [profileSaving, setProfileSaving] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    current_password:      '',
    password:              '',
    password_confirmation: '',
  });
  const [passwordMsg,   setPasswordMsg]   = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleEditClick = () => {
    setSnapshot({ ...profileForm });
    setProfileMsg('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileForm({ ...snapshot });  
    setProfileMsg('');
    setIsEditing(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileSaving(true);
    try {
      await api.put('/profile', profileForm);
      setSnapshot({ ...profileForm });
      setProfileMsg('Perubahan berhasil disimpan.');
      setIsEditing(false);
    } catch (err) {
      setProfileMsg(err.response?.data?.message || 'Gagal menyimpan perubahan.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    setPasswordError('');
    setPasswordSaving(true);
    try {
      await api.put('/profile/password', passwordForm);
      setPasswordMsg('Password berhasil diubah.');
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
    } catch (err) {
      setPasswordError(
        err.response?.data?.errors
          ? Object.values(err.response.data.errors)[0][0]
          : err.response?.data?.message || 'Gagal mengubah password.'
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  
  const readonlyCls =
    'bg-surface-container-low border border-transparent rounded-xl p-3 text-on-background cursor-default select-text outline-none transition-all';

  
  const editCls =
    'bg-surface border border-outline-variant rounded-xl p-3 focus:border-craftsman-gold focus:ring-2 focus:ring-craftsman-gold/20 outline-none transition-all text-on-background';

  const inputCls = isEditing ? editCls : readonlyCls;

  const pwInputCls =
    'bg-surface border border-outline-variant rounded-xl p-3 focus:border-craftsman-gold focus:ring-2 focus:ring-craftsman-gold/20 outline-none transition-all text-on-background';

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <UserHeader />

      <main className="flex-grow px-4 md:px-margin-desktop py-12 pt-[104px] max-w-container-max mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          
          <div className="md:col-span-3 flex justify-between items-center mb-2">
            <div>
              <h1 className="text-3xl font-headline-lg text-primary">Profil Saya</h1>
              <p className="text-on-surface-variant mt-1">
                Kelola informasi akun dan pengaturan keamanan Anda.
              </p>
            </div>
          </div>

          
          <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8 md:col-span-2">

            
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-4">
              <h2 className="text-xl font-headline-md text-primary">Informasi Pribadi</h2>

              
              {!isEditing ? (
                <button
                  type="button"
                  onClick={handleEditClick}
                  className="flex items-center gap-2 text-sm font-semibold text-primary border border-outline-variant px-4 py-2 rounded-lg hover:border-craftsman-gold hover:text-craftsman-gold transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                  Edit Profil
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant border border-outline-variant px-4 py-2 rounded-lg hover:bg-surface-container transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                  Batal
                </button>
              )}
            </div>

            
            {profileMsg && (
              <div className={`text-sm rounded-xl px-4 py-3 mb-6 border ${
                profileMsg.includes('berhasil')
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {profileMsg}
              </div>
            )}

            
            {isEditing && (
              <div className="flex items-center gap-2 bg-craftsman-gold/8 border border-craftsman-gold/30 text-craftsman-gold text-xs font-medium rounded-xl px-4 py-2.5 mb-6">
                <span className="material-symbols-outlined text-[15px]">info</span>
                Mode edit aktif. Ubah informasi Anda lalu tekan Simpan.
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/50" htmlFor="name">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    readOnly={!isEditing}
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className={`w-full ${inputCls}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/50" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    readOnly={!isEditing}
                    value={profileForm.email}
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className={`w-full ${inputCls}`}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold uppercase tracking-widest text-primary/50" htmlFor="phone">
                    Nomor HP
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    readOnly={!isEditing}
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className={`w-full ${inputCls}`}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold uppercase tracking-widest text-primary/50" htmlFor="address">
                  Alamat Lengkap
                </label>
                <textarea
                  id="address"
                  rows="3"
                  readOnly={!isEditing}
                  value={profileForm.address}
                  onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                  className={`w-full resize-none ${inputCls}`}
                />
              </div>

              
              {isEditing && (
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex items-center gap-2 bg-craftsman-gold text-white px-6 py-3 rounded-xl font-semibold hover:bg-craftsman-gold/85 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {profileSaving ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">save</span>
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          
          <div className="md:col-span-1 space-y-8">

            
            <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-6 flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-craftsman-gold/15 flex items-center justify-center text-craftsman-gold font-bold text-xl">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <div className="font-bold text-primary">{user?.name}</div>
                <div className="text-sm text-on-surface-variant">{user?.email}</div>
              </div>
            </div>

            
            <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-8">
              <h2 className="text-xl font-headline-md text-primary mb-6 border-b border-outline-variant pb-4">
                Ubah Password
              </h2>

              {passwordError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                  {passwordError}
                </div>
              )}
              {passwordMsg && (
                <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-4">
                  {passwordMsg}
                </div>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                {[
                  { id: 'current_password', label: 'Password Lama',          placeholder: 'Masukkan password saat ini',               key: 'current_password' },
                  { id: 'password',         label: 'Password Baru',           placeholder: 'Min. 8 karakter, huruf besar/kecil, angka', key: 'password' },
                  { id: 'pw_confirm',       label: 'Konfirmasi Password Baru', placeholder: 'Ulangi password baru',                    key: 'password_confirmation' },
                ].map(({ id, label, placeholder, key }) => (
                  <div key={id} className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/50" htmlFor={id}>
                      {label}
                    </label>
                    <input
                      id={id}
                      type="password"
                      required
                      placeholder={placeholder}
                      value={passwordForm[key]}
                      onChange={(e) => setPasswordForm({ ...passwordForm, [key]: e.target.value })}
                      className={`w-full ${pwInputCls}`}
                    />
                  </div>
                ))}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="w-full flex items-center justify-center gap-2 bg-craftsman-gold text-white px-6 py-3 rounded-xl font-semibold hover:bg-craftsman-gold/85 active:scale-[0.98] transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {passwordSaving ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[16px]">lock_reset</span>
                        Ubah Password
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      <UserFooter />
    </div>
  );
}
