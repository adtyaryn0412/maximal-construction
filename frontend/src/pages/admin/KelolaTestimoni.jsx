import { useEffect, useState } from "react";
import api from "../../api/axios";

const FILTERS = [
    { key: "semua", label: "Semua" },
    { key: "belum", label: "Belum Dibalas" },
    { key: "sudah", label: "Sudah Dibalas" },
    { key: "ditandai", label: "Ditandai Sistem" },
];

function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function KelolaTestimoni() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("semua");
    const [replyingId, setReplyingId] = useState(null);
    const [replyText, setReplyText] = useState("");
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);

    const fetchTestimonials = () => {
        setLoading(true);
        api.get("/admin/testimonials")
            .then((res) => setTestimonials(res.data))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const filtered = testimonials.filter((t) => {
        if (activeFilter === "belum") return !t.admin_reply;
        if (activeFilter === "sudah") return !!t.admin_reply;
        if (activeFilter === "ditandai") return !!t.is_flagged;
        return true;
    });

    const startReply = (t) => {
        setReplyingId(t.id);
        setReplyText("");
        setError("");
    };

    const cancelReply = () => {
        setReplyingId(null);
        setReplyText("");
        setError("");
    };

    const submitReply = async (id) => {
        if (!replyText.trim()) return;
        setError("");
        setSending(true);
        try {
            const res = await api.post(`/admin/testimonials/${id}/reply`, {
                admin_reply: replyText,
            });
            setTestimonials((prev) =>
                prev.map((t) => (t.id === id ? { ...t, admin_reply: res.data.testimonial?.admin_reply ?? replyText } : t))
            );
            setReplyingId(null);
            setReplyText("");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengirim balasan.");
        } finally {
            setSending(false);
        }
    };

    const handleDelete = async (t) => {
        if (!window.confirm(`Hapus testimoni dari "${t.user.name}"? Aksi ini tidak bisa dibatalkan.`)) return;
        setDeletingId(t.id);
        try {
            await api.delete(`/admin/testimonials/${t.id}`);
            setTestimonials((prev) => prev.filter((x) => x.id !== t.id));
        } catch (err) {
            alert(err.response?.data?.message || "Gagal menghapus testimoni.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="p-4 md:p-10 max-w-4xl mx-auto">
            <div className="mb-8">
                <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900 mb-2">
                    Kelola Testimoni
                </h2>
                <p className="text-zinc-500">
                    Semua ulasan pelanggan tampil secara transparan. Tanggapi ulasan untuk membangun kepercayaan.
                </p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-6 border-b border-zinc-200 mb-8 overflow-x-auto pb-px">
                {FILTERS.map((f) => (
                    <button
                        key={f.key}
                        onClick={() => setActiveFilter(f.key)}
                        className={`pb-3 px-1 text-xs uppercase tracking-wider whitespace-nowrap transition-colors font-semibold ${activeFilter === f.key
                            ? "text-black border-b-2 border-[#e9c176]"
                            : "text-zinc-500 hover:text-black"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* List */}
            {loading ? (
                <p className="text-zinc-500">Memuat data...</p>
            ) : filtered.length === 0 ? (
                <p className="text-zinc-400 text-center py-16">Tidak ada testimoni untuk filter ini.</p>
            ) : (
                <div className="grid gap-6">
                    {filtered.map((t) => (
                        <article
                            key={t.id}
                            className="bg-white p-6 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-zinc-100 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm">
                                        {getInitials(t.user?.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-[18px] font-semibold text-zinc-900">{t.user?.name}</h3>
                                        <p className="text-xs text-zinc-500 mt-1">{t.reservation?.service?.name}</p>
                                    </div>
                                </div>
                                <div className="flex text-[#e9c176]">
                                    {"★".repeat(t.rating)}
                                    {"☆".repeat(5 - t.rating)}
                                </div>
                            </div>

                            {t.is_flagged && (
                                <div className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded text-xs font-semibold mb-3">
                                    <span className="material-symbols-outlined text-[14px]">warning</span>
                                    Terdeteksi Konten Tidak Pantas
                                </div>
                            )}
                            <p className="text-zinc-800 mb-4">"{t.message}"</p>

                            {t.admin_reply ? (
                                <div className="bg-zinc-50 px-4 py-3 rounded-md border-l-4 border-[#e9c176] ml-4">
                                    <p className="text-xs font-semibold text-black mb-1">Balasan Admin:</p>
                                    <p className="text-sm text-zinc-600">{t.admin_reply}</p>
                                </div>
                            ) : replyingId === t.id ? (
                                <div className="space-y-3">
                                    {error && (
                                        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                            {error}
                                        </div>
                                    )}
                                    <textarea
                                        autoFocus
                                        rows={3}
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        placeholder="Tulis balasan untuk pelanggan..."
                                        className="w-full bg-zinc-50 border border-zinc-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] transition-all resize-none"
                                    ></textarea>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => submitReply(t.id)}
                                            disabled={sending || !replyText.trim()}
                                            className="bg-black text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50"
                                        >
                                            {sending ? "Mengirim..." : "Kirim Balasan"}
                                        </button>
                                        <button
                                            onClick={cancelReply}
                                            className="text-zinc-500 text-sm font-semibold px-4 py-2 rounded-md hover:bg-zinc-100 transition-colors"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => startReply(t)}
                                        className="text-craftsman-gold border border-[#e9c176] px-4 py-2 rounded-md hover:opacity-90/20 transition-colors uppercase text-xs font-semibold"
                                    >
                                        Balas Testimoni
                                    </button>
                                    <button
                                        onClick={() => handleDelete(t)}
                                        disabled={deletingId === t.id}
                                        className="text-red-600 border border-red-200 px-4 py-2 rounded-md hover:bg-red-50 transition-colors uppercase text-xs font-semibold disabled:opacity-50"
                                    >
                                        {deletingId === t.id ? "Menghapus..." : "Hapus"}
                                    </button>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
