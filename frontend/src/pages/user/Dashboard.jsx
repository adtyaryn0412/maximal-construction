import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import UserHeader from '../../components/user/UserHeader';
import UserFooter from '../../components/user/UserFooter';

const statusLabel = {
  menunggu: 'Menunggu',
  survei_dijadwalkan: 'Survei Dijadwalkan',
  survei_selesai: 'Survei Selesai',
  proses_pengerjaan: 'Proses Pengerjaan',
  selesai: 'Selesai',
  dibatalkan: 'Dibatalkan',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reservations').then((res) => {
      setReservations(res.data);
      setLoading(false);
    });
  }, []);

  const activeReservation = reservations.find(
    (r) => r.status !== 'selesai' && r.status !== 'dibatalkan'
  );
  const recentReservations = reservations.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col font-body-md antialiased">
      <UserHeader />

      <main className="flex-grow pt-[100px] px-4 md:px-margin-desktop max-w-container-max mx-auto w-full pb-20">
        <section className="mb-12 mt-8">
          <h1 className="text-3xl md:text-5xl font-display-lg text-primary mb-2">
            Selamat Datang Kembali, {user?.name}
          </h1>
          <p className="text-lg text-on-surface-variant max-w-2xl">
            Pantau proyek aktif Anda, kelola reservasi, dan lihat riwayat pengerjaan melalui
            dashboard ini.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            {loading ? (
              <div className="p-8 text-on-surface-variant">Memuat...</div>
            ) : activeReservation ? (
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-headline-lg text-primary">Proyek Aktif</h2>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-craftsman-gold/30 text-craftsman-gold text-xs font-semibold border border-[#e9c176]/50">
                    <span className="w-2 h-2 rounded-full bg-craftsman-gold mr-2"></span>
                    {statusLabel[activeReservation.status]}
                  </span>
                </div>
                <h3 className="text-xl font-headline-md text-on-surface mb-2">
                  {activeReservation.service.name}
                </h3>
                <p className="text-on-surface-variant mb-6">{activeReservation.address}</p>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/20">
                  <div>
                    <p className="text-xs text-outline uppercase mb-1">Jadwal Survei</p>
                    <p className="font-semibold text-primary">
                      {activeReservation.survey_date
                        ? new Date(activeReservation.survey_date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-outline uppercase mb-1">Estimasi Biaya</p>
                    <p className="font-semibold text-primary">
                      {activeReservation.estimated_cost
                        ? `Rp ${Number(activeReservation.estimated_cost).toLocaleString('id-ID')}`
                        : 'Belum ditentukan'}
                    </p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Link
                    to={`/reservasi/detail/${activeReservation.id}`}
                    className="bg-[#1A1A1A] text-white hover:bg-[#2D3E50] transition-all px-6 py-3 rounded font-semibold uppercase tracking-wider text-sm flex items-center gap-2"
                  >
                    Lihat Detail Proyek →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-8 text-on-surface-variant">
                Belum ada Reservasi aktif saat ini.
              </div>
            )}
          </div>

          <div className="lg:col-span-4">
            <Link
              to="/reservasi/ajukan"
              className="block bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-8 h-full hover:shadow-lg transition-all group"
            >
              <h3 className="text-xl font-headline-md text-primary mb-2">
                Ajukan Reservasi Baru
              </h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Mulai proyek konstruksi atau renovasi Anda selanjutnya dengan kami.
              </p>
              <span className="text-sm font-semibold text-primary uppercase tracking-wider flex items-center gap-2 group-hover:text-craftsman-gold transition-colors">
                Reservasi Sekarang →
              </span>
            </Link>
          </div>
        </div>

        <section className="mt-16">
          <div className="flex justify-between items-end mb-6 border-b border-outline-variant/30 pb-4">
            <h2 className="text-2xl font-headline-lg text-primary">Riwayat Reservasi</h2>
            <Link
              to="/reservasi"
              className="text-on-surface-variant hover:text-primary text-sm font-semibold uppercase tracking-wider flex items-center gap-1"
            >
              Lihat Semua →
            </Link>
          </div>
          <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
            {recentReservations.length === 0 ? (
              <div className="p-6 text-on-surface-variant">Belum ada riwayat reservasi.</div>
            ) : (
              <div className="divide-y divide-surface-variant">
                {recentReservations.map((r) => (
                  <div key={r.id} className="p-6 flex justify-between items-center hover:bg-surface-container-low transition-colors">
                    <span className="font-semibold text-primary">{r.service.name}</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-xs font-semibold">
                      {statusLabel[r.status]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <UserFooter />
    </div>
  );
}
