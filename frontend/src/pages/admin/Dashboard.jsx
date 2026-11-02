import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

const STATUS_LABEL = {
  menunggu: { text: "Menunggu", cls: "bg-amber-50 text-amber-700 border-amber-200/50" },
  survei_dijadwalkan: { text: "Proses", cls: "bg-blue-50 text-blue-700 border-blue-200/50" },
  survei_selesai: { text: "Proses", cls: "bg-blue-50 text-blue-700 border-blue-200/50" },
  proses_pengerjaan: { text: "Proses", cls: "bg-blue-50 text-blue-700 border-blue-200/50" },
  selesai: { text: "Selesai", cls: "bg-emerald-50 text-emerald-700 border-emerald-200/50" },
  dibatalkan: { text: "Dibatalkan", cls: "bg-red-50 text-red-700 border-red-200/50" },
};

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/dashboard-summary")
      .then((res) => setSummary(res.data))
      .finally(() => setLoading(false));
  }, []);

  const cards = summary
    ? [
        { label: "Total Reservasi", value: summary.total_reservasi, icon: "assignment", iconColor: "text-blue-500" },
        { label: "Total Portofolio", value: summary.total_portofolio, icon: "photo_library", iconColor: "text-amber-500" },
        { label: "Total Layanan", value: summary.total_layanan, icon: "handyman", iconColor: "text-purple-500" },
        { label: "Total Testimoni", value: summary.total_testimoni, icon: "reviews", iconColor: "text-pink-500" },
      ]
    : [];

  return (
    <div className="p-4 md:p-10 max-w-[1280px] mx-auto space-y-10">
      <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900">
        Selamat Datang, Admin
      </h2>

      {loading ? (
        <p className="text-zinc-500">Memuat data...</p>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card) => (
              <div key={card.label} className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold">
                    {card.label}
                  </p>
                  <span className={`material-symbols-outlined ${card.iconColor} text-[24px]`}>
                    {card.icon}
                  </span>
                </div>
                <h3 className="text-4xl font-['Montserrat'] font-extrabold text-zinc-900">
                  {card.value}
                </h3>
              </div>
            ))}
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">calendar_month</span>
                <h3 className="text-lg font-['Montserrat'] font-bold text-zinc-900">
                  Reservasi Terbaru
                </h3>
              </div>
              <Link to="/admin/reservasi" className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 uppercase tracking-widest font-semibold">
                Lihat Semua
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/50">
                    {["ID", "Nama Pelanggan", "Layanan", "Alamat", "Nomor HP", "Tanggal Diajukan", "Status"].map((h) => (
                      <th key={h} className="px-6 py-4 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {summary.reservasi_terbaru.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-zinc-400 text-sm">Belum ada reservasi.</td></tr>
                  ) : (
                    summary.reservasi_terbaru.map((r) => {
                      const st = STATUS_LABEL[r.status] || { text: r.status, cls: "bg-zinc-50 text-zinc-700 border-zinc-200/50" };
                      return (
                        <tr key={r.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-zinc-900 font-medium">#{r.id}</td>
                          <td className="px-6 py-4 text-sm text-zinc-900 font-medium">{r.nama_pelanggan}</td>
                          <td className="px-6 py-4 text-sm text-zinc-500">{r.layanan}</td>
                          <td className="px-6 py-4 text-sm text-zinc-500">{r.alamat}</td>
                          <td className="px-6 py-4 text-sm text-zinc-500">{r.no_hp}</td>
                          <td className="px-6 py-4 text-sm text-zinc-500">{r.tanggal_diajukan}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold border uppercase tracking-wider ${st.cls}`}>
                              {st.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Testimoni Terbaru */}
            <section className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-pink-500">reviews</span>
                  <h3 className="text-lg font-['Montserrat'] font-bold text-zinc-900">
                    Testimoni Terbaru
                  </h3>
                </div>
                <Link to="/admin/testimoni" className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 uppercase tracking-widest font-semibold transition-colors">
                  Lihat Semua
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse h-full">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50">
                      {["Pelanggan", "Pesan", "Tanggal"].map((h) => (
                        <th key={h} className="px-6 py-4 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {!summary.testimoni_terbaru || summary.testimoni_terbaru.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-400 text-sm">Belum ada testimoni.</td></tr>
                    ) : (
                      summary.testimoni_terbaru.map((t) => (
                        <tr key={t.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="text-sm text-zinc-900 font-bold">{t.nama_pelanggan}</div>
                            <div className="text-[11px] text-amber-500 flex items-center mt-1">
                              <span className="material-symbols-outlined text-[14px]">star</span>
                              <span className="ml-1">{t.rating}/5</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-600 max-w-[200px] truncate" title={t.pesan}>
                            "{t.pesan}"
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-400 whitespace-nowrap">{t.tanggal}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Log Aktivitas Terbaru */}
            <section className="bg-white rounded-xl shadow-sm border border-zinc-200 overflow-hidden flex flex-col">
              <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-500">history</span>
                  <h3 className="text-lg font-['Montserrat'] font-bold text-zinc-900">
                    Aktivitas Terbaru
                  </h3>
                </div>
                <Link to="/admin/log" className="text-xs text-zinc-500 hover:text-zinc-900 flex items-center gap-1 uppercase tracking-widest font-semibold transition-colors">
                  Lihat Semua
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse h-full">
                  <thead>
                    <tr className="border-b border-zinc-100 bg-zinc-50/50">
                      {["User", "Aksi", "Waktu"].map((h) => (
                        <th key={h} className="px-6 py-4 text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {!summary.log_terbaru || summary.log_terbaru.length === 0 ? (
                      <tr><td colSpan={3} className="px-6 py-8 text-center text-zinc-400 text-sm">Belum ada log.</td></tr>
                    ) : (
                      summary.log_terbaru.map((l) => (
                        <tr key={l.id} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-6 py-4 text-sm text-zinc-900 font-medium">{l.user}</td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-zinc-100 text-zinc-700">
                              {l.aksi}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-zinc-400 whitespace-nowrap">{l.waktu}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
