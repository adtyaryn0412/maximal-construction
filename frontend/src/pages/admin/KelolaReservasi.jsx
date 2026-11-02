import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const FILTERS = [
    { key: "semua", label: "Semua" },
    { key: "menunggu", label: "Menunggu" },
    { key: "survei_dijadwalkan", label: "Survei Dijadwalkan" },
    { key: "survei_selesai", label: "Survei Selesai" },
    { key: "proses_pengerjaan", label: "Proses Pengerjaan" },
    { key: "selesai", label: "Selesai" },
    { key: "dibatalkan", label: "Dibatalkan" },
];

const STATUS_BADGE = {
    menunggu: "border-amber-500 text-amber-700 bg-amber-50",
    survei_dijadwalkan: "border-cyan-500 text-cyan-700 bg-cyan-50",
    survei_selesai: "border-indigo-500 text-indigo-700 bg-indigo-50",
    proses_pengerjaan: "border-blue-500 text-blue-700 bg-blue-50",
    selesai: "border-emerald-500 text-emerald-700 bg-emerald-50",
    dibatalkan: "border-red-500 text-red-700 bg-red-50",
};

const STATUS_LABEL = Object.fromEntries(FILTERS.map((f) => [f.key, f.label]));

const PER_PAGE = 6;

export default function KelolaReservasi() {
    const [activeFilter, setActiveFilter] = useState("semua");
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const params = activeFilter !== "semua" ? { status: activeFilter } : {};
        api
            .get("/admin/reservations", { params })
            .then((res) => setReservations(res.data))
            .finally(() => setLoading(false));
        setPage(1);
    }, [activeFilter]);

    const filtered = reservations.filter((r) =>
        r.user.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    return (
        <div className="p-4 md:p-10 max-w-[1280px] mx-auto space-y-8">
            <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900">
                Kelola Reservasi
            </h2>

            {/* Filter & Search */}
            <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-6 flex flex-col gap-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((f) => (
                            <button
                                key={f.key}
                                onClick={() => setActiveFilter(f.key)}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${activeFilter === f.key
                                        ? "bg-black text-white shadow-md"
                                        : "text-zinc-500 hover:bg-zinc-100 font-medium"
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full max-w-md">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
                            search
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            placeholder="Cari Nama Pelanggan..."
                            className="w-full pl-12 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-craftsman-gold focus:border-craftsman-gold outline-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-zinc-50">
                            <tr>
                                {["No/ID", "Nama Pelanggan", "Layanan", "Alamat", "Nomor HP", "Tanggal Diajukan", "Status", "Aksi"].map(
                                    (h) => (
                                        <th
                                            key={h}
                                            className={`px-6 py-5 text-[11px] text-zinc-500 uppercase tracking-wider font-bold border-b border-zinc-200 ${h === "Aksi" ? "text-center" : ""
                                                }`}
                                        >
                                            {h}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-zinc-400 text-sm">
                                        Memuat data...
                                    </td>
                                </tr>
                            ) : paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-zinc-400 text-sm">
                                        Tidak ada reservasi ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                paginated.map((r) => (
                                    <tr key={r.id} className="hover:bg-zinc-50 transition-colors">
                                        <td className="px-6 py-5 text-zinc-500 font-medium">RES-{String(r.id).padStart(6, "0")}</td>
                                        <td className="px-6 py-5 font-semibold text-zinc-900">{r.user.name}</td>
                                        <td className="px-6 py-5 text-zinc-500">{r.service.name}</td>
                                        <td className="px-6 py-5 max-w-xs truncate text-zinc-500">{r.address}</td>
                                        <td className="px-6 py-5 text-zinc-500">{r.user.phone}</td>
                                        <td className="px-6 py-5 text-zinc-500">
                                            {new Date(r.created_at).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-6 py-5">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full border ${STATUS_BADGE[r.status] || "border-zinc-300 text-zinc-600 bg-zinc-50"
                                                    }`}
                                            >
                                                {STATUS_LABEL[r.status] || r.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={() => navigate(`/admin/reservasi/${r.id}`)}
                                                className="bg-craftsman-gold text-white px-5 py-2 rounded-lg text-sm font-bold shadow-sm hover:brightness-110 active:scale-[0.98] transition-all"
                                            >
                                                Kelola
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && filtered.length > 0 && (
                    <div className="px-6 py-5 bg-zinc-50 flex items-center justify-between">
                        <p className="text-sm text-zinc-500">
                            Menampilkan <span className="font-bold text-zinc-900">{paginated.length}</span> dari{" "}
                            <span className="font-bold text-zinc-900">{filtered.length}</span> reservasi
                        </p>
                        <div className="flex gap-2 items-center">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button
                                    key={p}
                                    onClick={() => setPage(p)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${p === page ? "bg-black text-white" : "hover:bg-zinc-200 font-medium"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded-lg hover:bg-zinc-200 transition-colors disabled:opacity-30"
                            >
                                <span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
