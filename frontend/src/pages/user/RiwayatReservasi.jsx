import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import UserHeader from '../../components/user/UserHeader';
import UserFooter from '../../components/user/UserFooter';

const statusConfig = {
  menunggu: { label: 'Menunggu', bg: 'bg-surface-container-highest', text: 'text-on-surface-variant', dot: 'bg-on-surface-variant' },
  survei_dijadwalkan: { label: 'Survei Dijadwalkan', bg: 'bg-craftsman-gold/10', text: 'text-craftsman-gold', dot: 'bg-craftsman-gold' },
  survei_selesai: { label: 'Survei Selesai', bg: 'bg-craftsman-gold/10', text: 'text-craftsman-gold', dot: 'bg-craftsman-gold' },
  proses_pengerjaan: { label: 'Proses Pengerjaan', bg: 'bg-[#2D3E50]/10', text: 'text-[#2D3E50]', dot: 'bg-[#2D3E50]' },
  selesai: { label: 'Selesai', bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-700' },
  dibatalkan: { label: 'Dibatalkan', bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-700' },
};

const filters = [
  { key: 'semua', label: 'Semua' },
  { key: 'menunggu', label: 'Menunggu' },
  { key: 'survei_dijadwalkan', label: 'Survei Dijadwalkan' },
  { key: 'survei_selesai', label: 'Survei Selesai' },
  { key: 'proses_pengerjaan', label: 'Proses Pengerjaan' },
  { key: 'selesai', label: 'Selesai' },
  { key: 'dibatalkan', label: 'Dibatalkan' },
];

export default function RiwayatReservasi() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('semua');

  useEffect(() => {
    api.get('/reservations').then((res) => {
      setReservations(res.data);
      setLoading(false);
    });
  }, []);

  const filtered =
    activeFilter === 'semua'
      ? reservations
      : reservations.filter((r) => r.status === activeFilter);

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md antialiased">
      <UserHeader />

      <main className="flex-grow w-full max-w-container-max mx-auto px-4 md:px-margin-desktop py-12 pt-[104px]">
        <div className="mb-10">
          <h1 className="text-3xl font-headline-lg text-primary mb-2">Riwayat Reservasi</h1>
          <p className="text-on-surface-variant max-w-2xl">
            Pantau status pengajuan reservasi proyek Anda secara real-time. Hubungi admin jika
            terdapat kendala atau pertanyaan terkait jadwal survei dan pengerjaan.
          </p>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === f.key
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/30">
          {loading ? (
            <div className="p-12 text-center text-on-surface-variant">Memuat...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-on-surface-variant">
              Tidak ada reservasi dengan status ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-outline-variant/30 bg-surface-container-low/50">
                    <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider">Layanan</th>
                    <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider">Tanggal Diajukan</th>
                    <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider">Alamat</th>
                    <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs text-on-surface-variant uppercase tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filtered.map((r) => {
                    const cfg = statusConfig[r.status];
                    return (
                      <tr key={r.id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="py-5 px-6">
                          <div className="text-primary font-semibold">{r.service.name}</div>
                          <div className="text-xs text-on-surface-variant">ID: #RES-{r.id}</div>
                        </td>
                        <td className="py-5 px-6 text-sm text-on-surface-variant">
                          {new Date(r.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className="py-5 px-6 text-sm text-on-surface-variant max-w-xs truncate">
                          {r.address}
                        </td>
                        <td className="py-5 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${cfg.dot}`}></span>
                            {cfg.label}
                          </span>
                        </td>
                        <td className="py-5 px-6 text-right">
                          <Link
                            to={`/reservasi/detail/${r.id}`}
                            className="text-craftsman-gold text-sm font-semibold hover:underline"
                          >
                            Lihat Detail →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <UserFooter />
    </div>
  );
}
