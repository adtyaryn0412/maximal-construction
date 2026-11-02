import { useEffect, useState } from "react";
import api from "../../api/axios";

const emptyForm = { name: "", description: "", is_active: true, icon_name: "construction" };

const availableIcons = [
    { name: "construction", label: "Konstruksi Umum" },
    { name: "roofing", label: "Atap / Kanopi" },
    { name: "fence", label: "Pagar / Besi" },
    { name: "apartment", label: "Bangunan / Rumah" },
    { name: "architecture", label: "Arsitektur / Baja" },
    { name: "deck", label: "Eksterior / Teras" },
    { name: "plumbing", label: "Pipa / Air" },
    { name: "electrical_services", label: "Listrik / Kelistrikan" },
    { name: "format_paint", label: "Pengecatan" },
    { name: "handyman", label: "Perbaikan / Tukang" },
    { name: "foundation", label: "Pondasi" },
    { name: "carpenter", label: "Kayu / Mebel" },
    { name: "engineering", label: "Teknik Sipil" }
];

export default function KelolaLayanan() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fetchServices = () => {
        setLoading(true);
        api.get("/admin/services")
            .then((res) => setServices(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const openAddModal = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError("");
        setModalOpen(true);
    };

    const openEditModal = (service) => {
        setEditingId(service.id);
        setForm({
            name: service.name,
            description: service.description,
            is_active: !!service.is_active,
            icon_name: service.icon_image || "construction",
        });
        setError("");
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);



    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("is_active", form.is_active ? "1" : "0");
        formData.append("icon_image", form.icon_name);

        try {
            if (editingId) {
                await api.post(`/admin/services/${editingId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await api.post("/admin/services", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            setModalOpen(false);
            fetchServices();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan layanan.");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (service) => {
        if (!window.confirm(`Hapus layanan "${service.name}"? Aksi ini tidak bisa dibatalkan.`)) return;
        setDeletingId(service.id);
        try {
            await api.delete(`/admin/services/${service.id}`);
            setServices((prev) => prev.filter((s) => s.id !== service.id));
        } catch (err) {
            alert(
                err.response?.data?.message ||
                "Layanan tidak bisa dihapus karena masih ada reservasi yang menggunakannya. Gunakan toggle nonaktifkan sebagai gantinya."
            );
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-[1280px] mx-auto">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900">
                        Kelola Layanan
                    </h2>
                    <p className="text-sm text-zinc-500 mt-2 max-w-2xl">
                        Kelola daftar layanan yang ditawarkan kepada pelanggan. Pastikan informasi layanan selalu up-to-date untuk memudahkan proses reservasi.
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="bg-craftsman-gold text-zinc-950 font-semibold text-sm px-6 py-3 rounded-md hover:opacity-90 hover:shadow-md transition-all flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Tambah Layanan Baru
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-zinc-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-zinc-50 border-b border-zinc-200">
                                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold w-16 text-center">No</th>
                                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Nama Layanan</th>
                                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold">Deskripsi Singkat</th>
                                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold text-center">Status</th>
                                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold text-center">Reservasi Terkait</th>
                                <th className="py-4 px-6 text-[11px] text-zinc-500 uppercase tracking-wider font-bold text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100">
                            {loading ? (
                                <tr><td colSpan={6} className="py-8 px-6 text-center text-zinc-400 text-sm">Memuat data...</td></tr>
                            ) : services.length === 0 ? (
                                <tr><td colSpan={6} className="py-8 px-6 text-center text-zinc-400 text-sm">Belum ada layanan.</td></tr>
                            ) : (
                                services.map((s, i) => (
                                    <tr key={s.id} className="hover:bg-zinc-50 transition-colors group">
                                        <td className="py-4 px-6 text-sm text-zinc-500 text-center">{i + 1}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded bg-zinc-100 flex items-center justify-center overflow-hidden">
                                                    <span className="material-symbols-outlined text-[16px] text-zinc-950">
                                                        {s.icon_image || 'construction'}
                                                    </span>
                                                </div>
                                                <span className="text-black font-semibold">{s.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-zinc-500 max-w-xs truncate">{s.description}</td>
                                        <td className="py-4 px-6 text-center">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${s.is_active
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-red-50 text-red-700 border-red-200"
                                                    }`}
                                            >
                                                {s.is_active ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className="bg-zinc-100 px-3 py-1 rounded-full text-xs font-medium">
                                                {s.reservations_count ?? "-"}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(s)}
                                                    className="p-2 text-zinc-500 hover:text-craftsman-gold transition-colors rounded bg-zinc-50 hover:bg-zinc-100"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(s)}
                                                    disabled={deletingId === s.id}
                                                    className="p-2 text-zinc-500 hover:text-red-600 transition-colors rounded bg-zinc-50 hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
                    onClick={(e) => e.target === e.currentTarget && closeModal()}
                >
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg border border-zinc-200 flex flex-col">
                        <div className="px-8 py-6 border-b border-zinc-100 flex justify-between items-center">
                            <h3 className="text-xl font-['Montserrat'] font-bold text-zinc-900">
                                {editingId ? "Edit Layanan" : "Tambah Layanan Baru"}
                            </h3>
                            <button onClick={closeModal} className="text-zinc-500 hover:text-black p-1 rounded-full hover:bg-zinc-100">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="p-8 flex flex-col gap-6">
                                {error && (
                                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                                        {error}
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Ikon Layanan</label>
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined text-3xl text-zinc-950">{form.icon_name}</span>
                                        </div>
                                        <select
                                            value={form.icon_name}
                                            onChange={(e) => setForm((f) => ({ ...f, icon_name: e.target.value }))}
                                            className="flex-1 bg-zinc-50 border border-zinc-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] transition-all"
                                        >
                                            {availableIcons.map((icon) => (
                                                <option key={icon.name} value={icon.name}>
                                                    {icon.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Nama Layanan</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                                        placeholder="Misal: Pemasangan Atap Baja Ringan"
                                        className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] transition-all"
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Deskripsi</label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={form.description}
                                        onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                        placeholder="Jelaskan detail layanan secara singkat..."
                                        className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] transition-all resize-none"
                                    ></textarea>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                                    <div>
                                        <span className="block text-sm font-semibold text-zinc-700">Status Layanan</span>
                                        <span className="text-xs text-zinc-400">Tentukan apakah layanan ini tampil untuk klien publik.</span>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.is_active}
                                            onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-zinc-300 rounded-full peer peer-checked:bg-craftsman-gold transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                                    </label>
                                </div>
                            </div>

                            <div className="px-8 py-6 border-t border-zinc-100 flex justify-end gap-4 bg-zinc-50 rounded-b-xl">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-6 py-2.5 rounded-md text-zinc-600 font-semibold text-sm hover:bg-zinc-200 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-black text-white font-semibold text-sm px-6 py-2.5 rounded-md hover:bg-zinc-800 transition-all disabled:opacity-50"
                                >
                                    {saving ? "Menyimpan..." : "Simpan"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
