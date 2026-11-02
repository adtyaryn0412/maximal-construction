import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import UserHeader from '../../components/user/UserHeader';
import UserFooter from '../../components/user/UserFooter';

const SERVICE_ICONS = {
  'Pemasangan Kanopi':  'roofing',
  'Pembuatan Pagar':    'fence',
  'Bangun Rumah & Kost':'apartment',
  'Renovasi Bangunan':  'construction',
  'Home Accessories':   'deck',
  'Konstruksi Baja':    'architecture',
};

function ServiceDropdown({ services, value, onChange }) {
  const [open, setOpen]     = useState(false);
  const wrapRef             = useRef(null);

  const selected = services.find((s) => String(s.id) === String(value));

  
  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const choose = (id) => { onChange(id); setOpen(false); };

  return (
    <div ref={wrapRef} className="relative">
      
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`
          w-full flex items-center justify-between gap-3
          bg-surface border rounded-xl px-4 py-3.5
          text-sm font-medium transition-all duration-200
          ${open
            ? 'border-craftsman-gold ring-2 ring-craftsman-gold/20 text-on-background'
            : 'border-outline-variant hover:border-craftsman-gold/60 text-on-surface-variant'
          }
        `}
      >
        <span className="flex items-center gap-3">
          {selected ? (
            <>
              <span className="material-symbols-outlined text-craftsman-gold text-[18px]">
                {SERVICE_ICONS[selected.name] || 'build'}
              </span>
              <span className="text-on-background font-semibold">{selected.name}</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-on-surface-variant/50 text-[18px]">
                handyman
              </span>
              <span>Pilih jenis layanan...</span>
            </>
          )}
        </span>

        
        <span
          className={`material-symbols-outlined text-[18px] text-on-surface-variant transition-transform duration-300 ${open ? 'rotate-180 text-craftsman-gold' : ''}`}
        >
          expand_more
        </span>
      </button>

      
      <div
        className={`
          absolute z-50 mt-2 w-full bg-white border border-outline-variant
          rounded-xl shadow-xl overflow-hidden
          transition-all duration-200 origin-top
          ${open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'}
        `}
      >
        
        <div className="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/50">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/60">
            Pilih Layanan
          </p>
        </div>

        <ul className="py-1 max-h-64 overflow-y-auto">
          {services.map((s) => {
            const isSelected = String(s.id) === String(value);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => choose(s.id)}
                  className={`
                    w-full flex items-center gap-4 px-4 py-3.5 text-left text-sm
                    transition-colors duration-150 group
                    ${isSelected
                      ? 'bg-craftsman-gold/10 text-craftsman-gold'
                      : 'text-on-surface hover:bg-surface-container'
                    }
                  `}
                >
                  <span
                    className={`
                      material-symbols-outlined text-[20px] flex-shrink-0
                      ${isSelected ? 'text-craftsman-gold' : 'text-on-surface-variant group-hover:text-craftsman-gold'}
                      transition-colors duration-150
                    `}
                  >
                    {SERVICE_ICONS[s.name] || 'build'}
                  </span>
                  <span className={`font-medium ${isSelected ? 'font-semibold' : ''}`}>
                    {s.name}
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[16px] text-craftsman-gold ml-auto">
                      check_circle
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const steps = [
  { title: '1. Reservasi Diajukan', desc: 'Anda mengisi form pengajuan reservasi proyek.' },
  { title: '2. Survei Lokasi',      desc: 'Tim kami akan mengunjungi lokasi untuk pengukuran.' },
  { title: '3. Estimasi Biaya',     desc: 'Penawaran harga detail akan dikirimkan kepada Anda.' },
  { title: '4. Proses Pengerjaan',  desc: 'Konstruksi dimulai sesuai jadwal yang disepakati.' },
  { title: '5. Selesai',            desc: 'Serah terima hasil pengerjaan proyek.' },
];

export default function AjukanReservasi() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [form, setForm]         = useState({ service_id: '', address: '', notes: '' });
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  useEffect(() => {
    api.get('/services').then((res) => setServices(res.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/reservations', form);
      navigate(`/reservasi/detail/${res.data.reservation.id}`);
    } catch (err) {
      if (err.response?.status === 429) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors)[0][0]);
      } else {
        setError('Terjadi kesalahan. Silakan coba lagi.');
      }
    } finally {
      setLoading(false);
    }
  };

  
  const inputCls = `
    block w-full bg-surface text-on-background border border-outline-variant
    rounded-xl py-3.5 px-4 text-sm
    placeholder:text-on-surface-variant/50
    focus:outline-none focus:border-craftsman-gold focus:ring-2 focus:ring-craftsman-gold/20
    transition-all duration-200 resize-none
  `;

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased">
      <UserHeader />

      <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-margin-desktop py-12 pt-[104px]">
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-display-lg text-primary mb-4">
            Ajukan Reservasi Baru
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Mulai proyek Anda dengan Maximal Construction. Isi detail di bawah ini untuk
            menjadwalkan survei lokasi dan estimasi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] p-8 md:p-10 border border-surface-container-low">

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2">
                    Pilih Layanan
                  </label>
                  <ServiceDropdown
                    services={services}
                    value={form.service_id}
                    onChange={(id) => setForm({ ...form, service_id: id })}
                  />
                  
                  <input
                    type="text"
                    required
                    value={form.service_id}
                    readOnly
                    className="sr-only"
                    tabIndex={-1}
                  />
                </div>

                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2" htmlFor="address">
                    Alamat Lokasi Proyek
                  </label>
                  <textarea
                    id="address"
                    required
                    rows="3"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Masukkan alamat lengkap lokasi pengerjaan..."
                    className={inputCls}
                  />
                </div>

                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary/60 mb-2" htmlFor="notes">
                    Catatan Tambahan
                    <span className="ml-1 text-on-surface-variant/50 normal-case tracking-normal font-normal">(Opsional)</span>
                  </label>
                  <textarea
                    id="notes"
                    rows="4"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    placeholder="Deskripsikan kebutuhan khusus atau preferensi material Anda..."
                    className={inputCls}
                  />
                </div>

                
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto bg-craftsman-gold hover:bg-craftsman-gold/85 active:scale-[0.98] text-white font-bold py-4 px-10 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        Memproses...
                      </>
                    ) : (
                      <>
                        Ajukan Reservasi Sekarang
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-[0px_4px_24px_rgba(0,0,0,0.06)] p-8 border border-surface-container-low sticky top-32">
              <h3 className="text-xl font-headline-md text-primary mb-8 border-b border-surface-variant pb-4">
                Tahapan Proses Reservasi
              </h3>
              <div className="relative border-l-2 border-surface-variant ml-4 space-y-8">
                {steps.map((step, i) => (
                  <div key={step.title} className="relative flex items-start">
                    <div
                      className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ring-4 ring-white ${
                        i === 0 ? 'bg-craftsman-gold' : 'bg-surface-variant'
                      }`}
                    />
                    <div className={`ml-6 ${i !== 0 ? 'opacity-60' : ''}`}>
                      <h4 className={`text-xs font-semibold ${i === 0 ? 'text-craftsman-gold' : 'text-primary'}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-on-surface-variant mt-1">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <UserFooter />
    </div>
  );
}

