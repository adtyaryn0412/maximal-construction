import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const FILTERS = [
  { key: "semua", label: "Semua" },
  { key: "aktif", label: "Aktif" },
  { key: "nonaktif", label: "Nonaktif" },
];

export default function KelolaUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("semua");
  const [modalUser, setModalUser] = useState(null); 
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const fetchUsers = () => {
    setLoading(true);
    const params = {};
    if (activeFilter !== "semua") params.status = activeFilter;
    if (search.trim()) params.search = search.trim();
    api.get("/admin/users", { params })
      .then((res) => setUsers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(fetchUsers, 300); 
    return () => clearTimeout(timeout);
  }, [activeFilter, search]);

  const confirmToggle = async () => {
    if (!modalUser) return;
    setProcessing(true);
    try {
      await api.patch(`/admin/users/${modalUser.user.id}/${modalUser.action}`);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === modalUser.user.id ? { ...u, is_active: modalUser.action === "activate" } : u
        )
      );
      setModalUser(null);
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memproses permintaan.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-[1280px] mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900 mb-2">
            Kelola User
          </h2>
          <p className="text-zinc-500">Kelola akun pelanggan yang terdaftar di sistem.</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-4 mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center border border-zinc-100">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau email..."
            className="w-full bg-zinc-50 border border-zinc-300 text-sm rounded-lg pl-10 pr-4 py-2 focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border whitespace-nowrap transition-colors ${
                activeFilter === f.key
                  ? "bg-black text-white border-black"
                  : "bg-white text-zinc-500 border-zinc-300 hover:bg-zinc-100"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-zinc-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 border-b border-zinc-200">
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">No</th>
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Nama</th>
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Email</th>
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Nomor HP</th>
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Tanggal Daftar</th>
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold text-center">Reservasi</th>
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold text-center">Status</th>
                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-sm">
              {loading ? (
                <tr><td colSpan={8} className="py-8 px-6 text-center text-zinc-400">Memuat data...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={8} className="py-8 px-6 text-center text-zinc-400">Tidak ada user ditemukan.</td></tr>
              ) : (
                users.map((u, i) => (
                  <tr key={u.id} className={`hover:bg-zinc-50 transition-colors ${!u.is_active ? "bg-zinc-50/50" : ""}`}>
                    <td className="py-4 px-6 text-zinc-500">{i + 1}</td>
                    <td className="py-4 px-6 font-semibold text-zinc-900">{u.name}</td>
                    <td className="py-4 px-6 text-zinc-500">{u.email}</td>
                    <td className="py-4 px-6 text-zinc-500">{u.phone}</td>
                    <td className="py-4 px-6 text-zinc-500">
                      {new Date(u.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="py-4 px-6 text-center">{u.reservations_count ?? "-"}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          u.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {u.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/admin/user/${u.id}`)}
                          className="text-black hover:underline font-medium"
                        >
                          Lihat Detail
                        </button>
                        {u.is_active ? (
                          <button
                            onClick={() => setModalUser({ user: u, action: "deactivate" })}
                            className="px-3 py-1 rounded border border-red-600 text-red-600 hover:bg-red-50 transition-colors text-xs font-semibold"
                          >
                            Nonaktifkan
                          </button>
                        ) : (
                          <button
                            onClick={() => setModalUser({ user: u, action: "activate" })}
                            className="px-3 py-1 rounded border border-emerald-600 text-emerald-600 hover:bg-emerald-50 transition-colors text-xs font-semibold"
                          >
                            Aktifkan
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal konfirmasi */}
      {modalUser && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={(e) => e.target === e.currentTarget && setModalUser(null)}
        >
          <div className="bg-white rounded-xl shadow-2xl p-6 border border-zinc-200 w-full max-w-md">
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  modalUser.action === "deactivate" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                <span className="material-symbols-outlined">
                  {modalUser.action === "deactivate" ? "warning" : "check_circle"}
                </span>
              </div>
              <h3 className="text-lg font-['Montserrat'] font-bold text-zinc-900">
                {modalUser.action === "deactivate" ? "Nonaktifkan Akun User" : "Aktifkan Akun User"}
              </h3>
            </div>
            <p className="text-sm text-zinc-500 mb-6">
              {modalUser.action === "deactivate"
                ? `Akun "${modalUser.user.name}" tidak akan bisa login sampai diaktifkan kembali oleh admin. Lanjutkan?`
                : `Akun "${modalUser.user.name}" akan dapat login kembali setelah diaktifkan.`}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setModalUser(null)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-zinc-700 border border-zinc-300 hover:bg-zinc-100 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmToggle}
                disabled={processing}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-craftsman-gold text-white hover:brightness-110 transition-colors shadow-sm disabled:opacity-50"
              >
                {processing ? "Memproses..." : "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
