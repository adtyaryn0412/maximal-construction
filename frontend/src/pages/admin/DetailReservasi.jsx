import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

const STATUS_OPTIONS = [
    { value: "survei_dijadwalkan", label: "Survei Dijadwalkan" },
    { value: "survei_selesai", label: "Survei Selesai" },
    { value: "proses_pengerjaan", label: "Proses Pengerjaan" },
    { value: "selesai", label: "Selesai" },
];

export default function DetailReservasiAdmin() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);

    const [status, setStatus] = useState("");
    const [surveyDate, setSurveyDate] = useState("");
    const [estimatedCost, setEstimatedCost] = useState("");
    const [workStartDate, setWorkStartDate] = useState("");
    const [workEndDate, setWorkEndDate] = useState("");
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [saveSuccess, setSaveSuccess] = useState("");

    const [cancelReason, setCancelReason] = useState("");
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState("");

    const fetchDetail = () => {
        api.get(`/admin/reservations/${id}`).then((res) => {
            const r = res.data;
            setReservation(r);
            setStatus(
                ["survei_dijadwalkan", "survei_selesai", "proses_pengerjaan", "selesai"].includes(r.status)
                    ? r.status
                    : "survei_dijadwalkan"
            );
            setSurveyDate(r.survey_date || "");
            setEstimatedCost(r.estimated_cost || "");
            setWorkStartDate(r.work_start_date || "");
            setWorkEndDate(r.work_end_date || "");
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaveError("");
        setSaveSuccess("");
        setSaving(true);
        try {
            const res = await api.patch(`/admin/reservations/${id}/status`, {
                status,
                survey_date: surveyDate || null,
                estimated_cost: estimatedCost || null,
                work_start_date: workStartDate || null,
                work_end_date: workEndDate || null,
            });
            setReservation(res.data.reservation);
            setSaveSuccess("Perubahan berhasil disimpan.");
        } catch (err) {
            setSaveError(err.response?.data?.message || "Gagal menyimpan perubahan.");
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = async (e) => {
        e.preventDefault();
        setCancelError("");
        if (!cancelReason.trim()) return;
        setCancelling(true);
        try {
            const res = await api.patch(`/admin/reservations/${id}/cancel`, {
                cancellation_reason: cancelReason,
            });
            setReservation(res.data.reservation);
        } catch (err) {
            setCancelError(err.response?.data?.message || "Gagal membatalkan reservasi.");
        } finally {
            setCancelling(false);
        }
    };

    if (loading || !reservation) {
        return (
            <div className="p-4 md:p-10 text-zinc-500">Memuat data...</div>
        );
    }

    const isCancelled = reservation.status === "dibatalkan";
    const isSelesai = reservation.status === "selesai";
    const canEdit = !isCancelled && !isSelesai;

    return (
        <div className="p-4 md:p-10 max-w-[1280px] mx-auto">
            <div className="mb-8">
                <Link
                    to="/admin/reservasi"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-black transition-colors text-sm mb-4"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Kembali ke Kelola Reservasi
                </Link>
                <h3 className="text-2xl font-['Montserrat'] font-bold text-zinc-900 mb-1">
                    Detail Reservasi: {reservation.user.name}
                </h3>
                <p className="text-zinc-500 text-sm">
                    ID Reservasi: #RES-{String(reservation.id).padStart(6, "0")}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-7 flex flex-col gap-8">
                    {/* Info Pelanggan */}
                    <section className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-8">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1 h-6 bg-craftsman-gold rounded-full"></span>
                            <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">
                                Informasi Pelanggan
                            </h3>
                        </div>
                        <div className="bg-zinc-50 rounded-xl p-6 space-y-4">
                            <div className="flex justify-between border-b border-zinc-200 pb-3">
                                <span className="text-sm text-zinc-500">Nama Pelanggan</span>
                                <span className="text-sm font-semibold text-zinc-900">{reservation.user.name}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-200 pb-3">
                                <span className="text-sm text-zinc-500">Nomor HP</span>
                                <span className="text-sm font-semibold text-zinc-900">{reservation.user.phone}</span>
                            </div>
                            <div className="flex justify-between border-b border-zinc-200 pb-3">
                                <span className="text-sm text-zinc-500">Layanan</span>
                                <span className="text-sm font-semibold text-black">{reservation.service.name}</span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-sm text-zinc-500 block">Alamat</span>
                                <span className="text-sm text-zinc-900 leading-relaxed block">{reservation.address}</span>
                            </div>
                            {reservation.notes && (
                                <div className="mt-4 p-4 bg-white border border-dashed border-zinc-300 rounded-lg">
                                    <span className="text-[11px] text-zinc-500 uppercase mb-2 block font-semibold">Catatan</span>
                                    <p className="text-sm italic text-zinc-600">"{reservation.notes}"</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Update Progres */}
                    {canEdit && (
                        <section className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-1 h-6 bg-craftsman-gold rounded-full"></span>
                                <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">
                                    Update Progres &amp; Status
                                </h3>
                            </div>

                            {saveError && (
                                <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                    {saveError}
                                </div>
                            )}
                            {saveSuccess && (
                                <div className="mb-4 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                                    {saveSuccess}
                                </div>
                            )}

                            <form onSubmit={handleSave} className="space-y-6">
                                <div>
                                    <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase">
                                        Status Tahapan
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 appearance-none focus:ring-2 focus:ring-craftsman-gold outline-none text-sm"
                                        >
                                            {STATUS_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                                            expand_more
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase">
                                            Jadwal Survei
                                        </label>
                                        <input
                                            type="date"
                                            value={surveyDate}
                                            onChange={(e) => setSurveyDate(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-craftsman-gold outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase">
                                            Estimasi Biaya (IDR)
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">
                                                Rp
                                            </span>
                                            <input
                                                type="number"
                                                value={estimatedCost}
                                                onChange={(e) => setEstimatedCost(e.target.value)}
                                                placeholder="0"
                                                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg pl-10 pr-4 py-3 focus:ring-2 focus:ring-craftsman-gold outline-none text-sm font-semibold"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase">
                                            Tanggal Mulai Pengerjaan
                                        </label>
                                        <input
                                            type="date"
                                            value={workStartDate}
                                            onChange={(e) => setWorkStartDate(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-craftsman-gold outline-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase">
                                            Tanggal Selesai Pengerjaan
                                        </label>
                                        <input
                                            type="date"
                                            value={workEndDate}
                                            onChange={(e) => setWorkEndDate(e.target.value)}
                                            className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-craftsman-gold outline-none text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full mt-4 py-4 bg-craftsman-gold hover:brightness-110 text-white font-semibold rounded-lg shadow-lg shadow-craftsman-gold/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    <span className="material-symbols-outlined">save</span>
                                    {saving ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
                                </button>
                            </form>
                        </section>
                    )}

                    {isCancelled && (
                        <section className="bg-red-50 border border-red-200 rounded-xl p-8">
                            <p className="font-semibold text-red-700 mb-1">Reservasi ini telah dibatalkan</p>
                            <p className="text-sm text-red-600">Alasan: {reservation.cancellation_reason}</p>
                        </section>
                    )}

                    {isSelesai && reservation.testimonial && (
                        <section className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-8">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-1 h-6 bg-craftsman-gold rounded-full"></span>
                                <h3 className="text-[11px] text-zinc-500 uppercase tracking-widest font-bold">
                                    Testimoni Pelanggan
                                </h3>
                            </div>
                            <div className="flex text-[#e9c176] mb-2">
                                {"★".repeat(reservation.testimonial.rating)}
                                {"☆".repeat(5 - reservation.testimonial.rating)}
                            </div>
                            <p className="text-sm text-zinc-700 italic">"{reservation.testimonial.message}"</p>
                        </section>
                    )}
                </div>

                {/* Right Column */}
                {canEdit && (
                    <div className="lg:col-span-5 flex flex-col gap-8">
                        <section className="bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] p-8 border-t-4 border-red-600">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="material-symbols-outlined text-red-600">warning</span>
                                <h3 className="text-[11px] text-red-600 font-bold uppercase tracking-widest">
                                    Konfirmasi Pembatalan
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-zinc-500">
                                    Pembatalan reservasi akan menghentikan seluruh proses yang sedang berjalan. Aksi ini tidak dapat dibatalkan.
                                </p>

                                {cancelError && (
                                    <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                        {cancelError}
                                    </div>
                                )}

                                <form onSubmit={handleCancel}>
                                    <label className="block text-[11px] font-bold text-zinc-500 mb-2 uppercase">
                                        Alasan Pembatalan
                                    </label>
                                    <textarea
                                        value={cancelReason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        required
                                        placeholder="Mohon masukkan alasan pembatalan..."
                                        className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-4 text-sm focus:ring-2 focus:ring-red-600 outline-none h-32 placeholder:text-zinc-400"
                                    ></textarea>
                                    <button
                                        type="submit"
                                        disabled={cancelling}
                                        className="w-full py-4 border-2 border-red-600 text-red-600 hover:bg-red-50 font-semibold rounded-lg flex items-center justify-center gap-2 transition-all mt-4 disabled:opacity-50"
                                    >
                                        <span className="material-symbols-outlined">cancel</span>
                                        {cancelling ? "MEMPROSES..." : "BATALKAN RESERVASI"}
                                    </button>
                                </form>
                            </div>
                        </section>
                    </div>
                )}
            </div>
        </div>
    );
}
