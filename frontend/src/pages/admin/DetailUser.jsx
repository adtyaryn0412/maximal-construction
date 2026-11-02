import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function DetailUser() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/admin/users/${id}`)
      .then((res) => setUser(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-4 md:p-10 text-zinc-500">Memuat data...</div>;
  if (!user) return <div className="p-4 md:p-10 text-zinc-500">User tidak ditemukan.</div>;

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto">
      <Link
        to="/admin/user"
        className="inline-flex items-center gap-2 text-zinc-500 hover:text-black text-sm mb-6 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Kembali ke Kelola User
      </Link>

      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-zinc-100 p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900">{user.name}</h2>
            <p className="text-sm text-zinc-500 mt-1">{user.email}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              user.is_active
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {user.is_active ? "Aktif" : "Nonaktif"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-zinc-500 block mb-1">Nomor HP</span>
            <span className="text-zinc-900 font-medium">{user.phone || "-"}</span>
          </div>
          <div>
            <span className="text-zinc-500 block mb-1">Tanggal Daftar</span>
            <span className="text-zinc-900 font-medium">
              {new Date(user.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
          </div>
          <div className="md:col-span-2">
            <span className="text-zinc-500 block mb-1">Alamat</span>
            <span className="text-zinc-900">{user.address || "-"}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-zinc-100 overflow-hidden">
        <div className="p-6 border-b border-zinc-100">
          <h3 className="text-lg font-['Montserrat'] font-bold text-zinc-900">Riwayat Reservasi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-100">
                <th className="py-3 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Layanan</th>
                <th className="py-3 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Tanggal</th>
                <th className="py-3 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {(!user.reservations || user.reservations.length === 0) ? (
                <tr><td colSpan={3} className="py-6 px-6 text-center text-zinc-400">Belum ada reservasi.</td></tr>
              ) : (
                user.reservations.map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="py-3 px-6 text-zinc-900">{r.service?.name}</td>
                    <td className="py-3 px-6 text-zinc-500">
                      {new Date(r.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-3 px-6 text-zinc-500">{r.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
