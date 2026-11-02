import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";

const CATEGORIES = [
    { key: "semua", label: "Semua Log" },
    { key: "login_berhasil", label: "Login Berhasil" },
    { key: "login_gagal", label: "Login Gagal" },
    { key: "login_ditolak", label: "Login Ditolak" },
    { key: "keamanan", label: "Keamanan (Akses/Spam)" },
    { key: "reservasi", label: "Reservasi" },
    { key: "proyek", label: "Proyek" },
    { key: "layanan", label: "Layanan" },
    { key: "user", label: "User & Registrasi" },
    { key: "testimoni", label: "Testimoni" },
    { key: "hapus", label: "Aksi Hapus/Batal" },
];

const ACTION_META = {
    LOGIN_SUCCESS: { label: "Login Berhasil", icon: "login", color: "text-emerald-600" },
    ADMIN_LOGIN_SUCCESS: { label: "Login Admin Berhasil", icon: "login", color: "text-emerald-600" },
    LOGIN_FAILED: { label: "Login Gagal", icon: "lock_reset", color: "text-amber-600" },
    ADMIN_LOGIN_FAILED: { label: "Login Admin Gagal", icon: "lock_reset", color: "text-amber-600" },
    LOGIN_BLOCKED_INACTIVE: { label: "Login Ditolak (Nonaktif)", icon: "block", color: "text-red-600" },
    ADMIN_LOGIN_BLOCKED_INACTIVE: { label: "Login Admin Ditolak (Nonaktif)", icon: "block", color: "text-red-600" },
    LOGIN_REJECTED_WRONG_PORTAL: { label: "Login Ditolak (Portal Salah)", icon: "block", color: "text-red-600" },
    ADMIN_LOGIN_REJECTED_NOT_ADMIN: { label: "Login Admin Ditolak (Bukan Admin)", icon: "block", color: "text-red-600" },
    LOGOUT: { label: "Logout", icon: "logout", color: "text-zinc-500" },
    REGISTER_SUCCESS: { label: "Registrasi Baru", icon: "person_add", color: "text-emerald-600" },
    PASSWORD_CHANGED: { label: "Ganti Password", icon: "password", color: "text-secondary" },
    RESERVATION_STATUS_UPDATED: { label: "Update Status Reservasi", icon: "edit", color: "text-blue-600" },
    RESERVATION_CANCELLED: { label: "Reservasi Dibatalkan", icon: "cancel", color: "text-red-600" },
    RESERVATION_CREATED: { label: "Pengajuan Reservasi Baru", icon: "event_note", color: "text-emerald-600" },
    PROJECT_CREATED: { label: "Proyek Ditambahkan", icon: "add_circle", color: "text-emerald-600" },
    PROJECT_UPDATED: { label: "Proyek Diperbarui", icon: "edit", color: "text-blue-600" },
    PROJECT_DELETED: { label: "Proyek Dihapus", icon: "delete_forever", color: "text-red-600" },
    SERVICE_CREATED: { label: "Layanan Ditambahkan", icon: "add_circle", color: "text-emerald-600" },
    SERVICE_UPDATED: { label: "Layanan Diperbarui", icon: "edit", color: "text-blue-600" },
    SERVICE_DELETED: { label: "Layanan Dihapus", icon: "delete_forever", color: "text-red-600" },
    SERVICE_DELETE_BLOCKED: { label: "Hapus Layanan Ditolak", icon: "block", color: "text-amber-600" },
    USER_DEACTIVATED: { label: "User Dinonaktifkan", icon: "person_off", color: "text-red-600" },
    USER_ACTIVATED: { label: "User Diaktifkan", icon: "person", color: "text-emerald-600" },
    TESTIMONIAL_CREATED: { label: "Testimoni Baru", icon: "chat_bubble", color: "text-emerald-600" },
    TESTIMONIAL_REPLIED: { label: "Balas Testimoni", icon: "reply", color: "text-blue-600" },
    TESTIMONIAL_FLAGGED: { label: "Testimoni Ditandai (Spam/Kasar)", icon: "flag", color: "text-amber-600" },
    TESTIMONIAL_DELETED: { label: "Testimoni Dihapus", icon: "delete_forever", color: "text-red-600" },
    UNAUTHORIZED_ACCESS_ATTEMPT: { label: "Akses Tidak Sah (Ditolak)", icon: "gpp_maybe", color: "text-red-600" },
    ADMIN_LOGIN_RATE_LIMITED: { label: "Terlalu Banyak Percobaan Login", icon: "timer", color: "text-amber-600" },
};

function getMeta(action) {
    if (ACTION_META[action]) return ACTION_META[action];
    
    // Fallback: format constant string LIKE_THIS to "Like This"
    const formattedLabel = action
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
        
    return { label: formattedLabel, icon: "info", color: "text-zinc-500" };
}

function describeLog(log) {
    const meta = getMeta(log.action);
    let payload = null;
    try {
        payload = log.payload ? JSON.parse(log.payload) : null;
    } catch {
        payload = null;
    }
    if (payload) {
        const parts = Object.entries(payload).map(([k, v]) => `${k}: ${v}`);
        return `${meta.label} — ${parts.join(", ")}`;
    }
    return `${meta.label} (${log.method} ${log.url})`;
}

export default function LogAktivitas() {
    const location = useLocation();
    
    // Parse query params to get initial category if any
    const getInitialCategory = () => {
        const params = new URLSearchParams(location.search);
        return params.get("filter") || "semua";
    };

    const [logs, setLogs] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 });
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState(getInitialCategory());
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    
    // Sync category if URL changes (like when clicking notification while already on the page)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const filter = params.get("filter");
        if (filter && filter !== category) {
            setCategory(filter);
            setTempCategory(filter);
        }
    }, [location.search]);
    
    // Filter Modal States
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    
    const [tempCategory, setTempCategory] = useState("semua");
    const [tempStartDate, setTempStartDate] = useState("");
    const [tempEndDate, setTempEndDate] = useState("");

    const fetchLogs = () => {
        setLoading(true);
        const params = { page };
        if (category !== "semua") params.category = category;
        if (search.trim()) params.search = search.trim();
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        api.get("/admin/activity-logs", { params })
            .then((res) => {
                setLogs(res.data.logs.data);
                setMeta(res.data.logs);
                setStats(res.data.stats);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const timeout = setTimeout(fetchLogs, 300);
        return () => clearTimeout(timeout);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category, search, page, startDate, endDate]);

    useEffect(() => {
        setPage(1);
    }, [category, search, startDate, endDate]);

    return (
        <div className="p-4 md:p-10 max-w-[1280px] mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900">Log Aktivitas</h2>
                <p className="text-zinc-500 mt-2 max-w-2xl">
                    Riwayat aktivitas sistem Maximal Construction — login, perubahan data, dan aksi admin lainnya.
                </p>
            </div>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-zinc-400">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Total Log Hari Ini</p>
                        <h3 className="text-3xl font-['Montserrat'] font-bold text-zinc-900">{stats.total_hari_ini}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-emerald-500">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Login Berhasil</p>
                        <h3 className="text-3xl font-['Montserrat'] font-bold text-zinc-900">{stats.login_berhasil_hari_ini}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-amber-500">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Login Gagal</p>
                        <h3 className="text-3xl font-['Montserrat'] font-bold text-zinc-900">{stats.login_gagal_hari_ini}</h3>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border-l-4 border-red-500">
                        <p className="text-zinc-500 text-xs uppercase tracking-widest font-semibold mb-1">Aksi Hapus/Batal</p>
                        <h3 className="text-3xl font-['Montserrat'] font-bold text-zinc-900">{stats.aksi_hapus_hari_ini}</h3>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-zinc-100">
                <div className="p-6 border-b border-zinc-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            onClick={() => {
                                setTempCategory(category);
                                setTempStartDate(startDate);
                                setTempEndDate(endDate);
                                setShowFilterModal(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors shadow-md"
                        >
                            <span className="material-symbols-outlined text-[18px]">tune</span>
                            Filter
                        </button>
                        
                        {(category !== "semua" || startDate || endDate) && (
                            <button
                                onClick={() => {
                                    setCategory("semua");
                                    setStartDate("");
                                    setEndDate("");
                                }}
                                className="text-xs text-red-500 font-semibold hover:underline px-2"
                            >
                                Hapus Filter
                            </button>
                        )}
                    </div>
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-[18px]">
                            search
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Cari IP atau nama/email..."
                            className="pl-10 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm w-full lg:w-64 focus:ring-2 focus:ring-[#e9c176] outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-zinc-50 text-zinc-500 text-[11px] uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Waktu</th>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Alamat IP</th>
                                <th className="px-6 py-4 font-semibold">Jenis Aktivitas</th>
                                <th className="px-6 py-4 font-semibold">Deskripsi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 text-sm">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-400">Memuat data...</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center text-zinc-400">Tidak ada log ditemukan.</td></tr>
                            ) : (
                                logs.map((log) => {
                                    const meta = getMeta(log.action);
                                    return (
                                        <tr key={log.id} className="hover:bg-zinc-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-zinc-900 font-medium">
                                                {new Date(log.created_at).toLocaleString("id-ID", {
                                                    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-zinc-700">
                                                {log.user ? log.user.name : "—"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-zinc-500">
                                                {log.ip_address}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`flex items-center gap-2 font-semibold ${meta.color}`}>
                                                    <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                                                    {meta.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 max-w-md truncate text-zinc-500">
                                                {describeLog(log)}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && meta.last_page > 1 && (
                    <div className="px-6 py-4 bg-zinc-50 flex items-center justify-between">
                        <p className="text-sm text-zinc-500">
                            Menampilkan halaman <span className="font-bold text-zinc-900">{meta.current_page}</span> dari{" "}
                            <span className="font-bold text-zinc-900">{meta.last_page}</span> ({meta.total} aktivitas)
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={meta.current_page === 1}
                                className="w-8 h-8 flex items-center justify-center rounded border border-zinc-300 text-zinc-500 hover:bg-white disabled:opacity-30 transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                                disabled={meta.current_page === meta.last_page}
                                className="w-8 h-8 flex items-center justify-center rounded border border-zinc-300 text-zinc-500 hover:bg-white disabled:opacity-30 transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Filter Modal */}
            {showFilterModal && (
                <div 
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-[100]"
                    onClick={(e) => e.target === e.currentTarget && setShowFilterModal(false)}
                >
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-zinc-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-['Montserrat'] font-bold text-lg text-zinc-900">Filter Log Aktivitas</h3>
                            <button onClick={() => setShowFilterModal(false)} className="text-zinc-400 hover:text-zinc-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-zinc-700 mb-2">Kategori Aktivitas</label>
                                <select 
                                    value={tempCategory}
                                    onChange={(e) => setTempCategory(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-craftsman-gold outline-none transition-all"
                                >
                                    {CATEGORIES.map(c => (
                                        <option key={c.key} value={c.key}>{c.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Dari Tanggal</label>
                                    <input 
                                        type="date"
                                        value={tempStartDate}
                                        onChange={(e) => setTempStartDate(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-craftsman-gold outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-700 mb-2">Sampai Tanggal</label>
                                    <input 
                                        type="date"
                                        value={tempEndDate}
                                        onChange={(e) => setTempEndDate(e.target.value)}
                                        className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-craftsman-gold outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3">
                            <button 
                                onClick={() => {
                                    setTempCategory("semua");
                                    setTempStartDate("");
                                    setTempEndDate("");
                                }}
                                className="flex-1 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-200 transition-colors"
                            >
                                Reset
                            </button>
                            <button 
                                onClick={() => {
                                    setCategory(tempCategory);
                                    setStartDate(tempStartDate);
                                    setEndDate(tempEndDate);
                                    setShowFilterModal(false);
                                }}
                                className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-zinc-800 transition-colors"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
