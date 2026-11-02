import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import UserHeader from '../../components/user/UserHeader';
import UserFooter from '../../components/user/UserFooter';

const STATUS_STEPS = [
    { key: 'menunggu', label: 'Menunggu' },
    { key: 'survei_dijadwalkan', label: 'Survei Dijadwalkan' },
    { key: 'survei_selesai', label: 'Survei Selesai' },
    { key: 'proses_pengerjaan', label: 'Proses Pengerjaan' },
    { key: 'selesai', label: 'Selesai' },
];

function getStepIndex(status) {
    if (status === 'dibatalkan') return -1;
    return STATUS_STEPS.findIndex((s) => s.key === status);
}

export default function DetailReservasi() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [reservation, setReservation] = useState(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [message, setMessage] = useState('');
    const [testiError, setTestiError] = useState('');
    const [testiSuccess, setTestiSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchDetail = () => {
        api.get(`/reservations/${id}`).then((res) => {
            setReservation(res.data);
            setLoading(false);
        }).catch(() => {
            navigate('/reservasi');
        });
    };

    useEffect(() => {
        fetchDetail();
    }, [id]);

    const handleSubmitTestimonial = async (e) => {
        e.preventDefault();
        setTestiError('');
        setSubmitting(true);

        try {
            const res = await api.post(`/reservations/${id}/testimonial`, {
                rating,
                message,
            });
            setTestiSuccess(res.data.message);
            fetchDetail();
        } catch (err) {
            setTestiError(err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading || !reservation) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-on-surface-variant">Memuat...</p>
            </div>
        );
    }

    const currentStep = getStepIndex(reservation.status);
    const isCancelled = reservation.status === 'dibatalkan';
    const isSelesai = reservation.status === 'selesai';
    const hasTestimonial = !!reservation.testimonial;

    return (
        <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
            <UserHeader />

            <main className="flex-grow pt-[104px] pb-24 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full">
                <div className="mb-10 flex items-center gap-4">
                    <button
                        onClick={() => navigate('/reservasi')}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-low hover:bg-surface-container-highest transition-colors"
                    >
                        ←
                    </button>
                    <h1 className="text-2xl md:text-3xl font-headline-lg text-primary">
                        Detail Reservasi: {reservation.service.name}
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20">
                            <h2 className="text-xl font-headline-md text-primary mb-8">Status Proyek</h2>

                            {isCancelled ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                    <p className="font-semibold text-red-700 mb-1">Reservasi Dibatalkan</p>
                                    <p className="text-sm text-red-600">
                                        Alasan: {reservation.cancellation_reason}
                                    </p>
                                </div>
                            ) : (
                                <div className="relative flex justify-between items-start w-full overflow-x-auto pb-2">
                                    <div className="absolute left-0 top-5 w-full h-0.5 bg-outline-variant/30 z-0"></div>
                                    <div
                                        className="absolute left-0 top-5 h-0.5 bg-craftsman-gold z-0 transition-all"
                                        style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                                    ></div>

                                    {STATUS_STEPS.map((step, i) => (
                                        <div key={step.key} className="relative z-10 flex flex-col items-center gap-3 min-w-[80px]">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${i <= currentStep
                                                    ? 'bg-craftsman-gold border-[#e9c176] text-primary'
                                                    : 'bg-white border-outline-variant text-outline-variant'
                                                    }`}
                                            >
                                                {i === STATUS_STEPS.length - 1 ? '🏁' : '✓'}
                                            </div>
                                            <span
                                                className={`text-xs text-center ${i === currentStep ? 'text-craftsman-gold font-bold' : 'text-on-surface'
                                                    }`}
                                            >
                                                {step.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20">
                            <h2 className="text-xl font-headline-md text-primary mb-6 border-b border-outline-variant/20 pb-4">
                                Rincian Reservasi
                            </h2>
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <dt className="text-xs text-outline uppercase">Layanan</dt>
                                    <dd className="text-lg text-on-surface font-semibold">{reservation.service.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-outline uppercase">Estimasi Biaya</dt>
                                    <dd className="text-lg text-on-surface font-semibold">
                                        {reservation.estimated_cost
                                            ? `Rp ${Number(reservation.estimated_cost).toLocaleString('id-ID')}`
                                            : 'Belum ditentukan'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-outline uppercase">Tanggal Survei</dt>
                                    <dd className="text-on-surface">
                                        {reservation.survey_date
                                            ? new Date(reservation.survey_date).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric',
                                            })
                                            : 'Belum dijadwalkan'}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-xs text-outline uppercase">Catatan</dt>
                                    <dd className="text-on-surface">{reservation.notes || '-'}</dd>
                                </div>
                                <div className="md:col-span-2">
                                    <dt className="text-xs text-outline uppercase">Alamat Proyek</dt>
                                    <dd className="text-on-surface mt-1">{reservation.address}</dd>
                                </div>
                            </dl>
                        </section>
                    </div>

                    <div className="lg:col-span-1">
                        <section className="bg-white rounded-xl p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 sticky top-32">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-2xl">⭐</span>
                                <h2 className="text-xl font-headline-md text-primary">Testimoni</h2>
                            </div>

                            {!isSelesai ? (
                                <p className="text-sm text-on-surface-variant">
                                    Testimoni dapat diberikan setelah proyek berstatus selesai.
                                </p>
                            ) : hasTestimonial ? (
                                <div>
                                    <p className="text-sm text-on-surface-variant mb-4">
                                        Terima kasih, Anda sudah memberikan testimoni untuk reservasi ini.
                                    </p>
                                    <div className="flex text-[#e9c176] mb-2">
                                        {'★'.repeat(reservation.testimonial.rating)}
                                        {'☆'.repeat(5 - reservation.testimonial.rating)}
                                    </div>
                                    <p className="text-sm text-on-surface italic">"{reservation.testimonial.message}"</p>
                                    {reservation.testimonial.is_flagged && (
                                        <div className="mt-3 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-3 py-2 flex items-start gap-2">
                                            <span>⚠️</span>
                                            <span>
                                                Testimoni ini sedang ditinjau oleh admin dan untuk sementara belum tampil di halaman publik.
                                            </span>
                                        </div>
                                    )}
                                    {reservation.testimonial.admin_reply && (
                                        <div className="mt-4 pt-4 border-t border-outline-variant/20">
                                            <p className="text-xs text-outline uppercase mb-1">Balasan Admin</p>
                                            <p className="text-sm text-on-surface-variant">{reservation.testimonial.admin_reply}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-on-surface-variant mb-6">
                                        Proyek Anda telah selesai. Kami sangat menghargai masukan Anda.
                                    </p>

                                    {testiError && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-4">
                                            {testiError}
                                        </div>
                                    )}
                                    {testiSuccess && (
                                        <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded px-4 py-3 mb-4">
                                            {testiSuccess}
                                        </div>
                                    )}

                                    {!testiSuccess && (
                                        <form onSubmit={handleSubmitTestimonial} className="flex flex-col gap-6">
                                            <div>
                                                <label className="text-xs text-on-surface block mb-2">Penilaian Anda</label>
                                                <div className="flex items-center gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            type="button"
                                                            onClick={() => setRating(star)}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            className="text-2xl text-[#e9c176] hover:scale-110 transition-transform"
                                                        >
                                                            {(hoverRating || rating) >= star ? '★' : '☆'}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="text-xs text-on-surface block mb-2" htmlFor="review">
                                                    Ulasan
                                                </label>
                                                <textarea
                                                    id="review"
                                                    rows="5"
                                                    required
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Bagikan pengalaman Anda menggunakan layanan kami..."
                                                    className="w-full bg-surface border border-outline-variant rounded-lg p-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#b6c8df] resize-none"
                                                ></textarea>
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={submitting || rating === 0}
                                                className="w-full bg-craftsman-gold text-primary font-semibold py-4 rounded-lg hover:opacity-90 transition-colors shadow-sm disabled:opacity-50"
                                            >
                                                {submitting ? 'Mengirim...' : 'Kirim Testimoni'}
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <UserFooter />
        </div>
    );
}
