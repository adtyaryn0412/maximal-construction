import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setGeneralError('');
        setLoading(true);

        try {
            const res = await api.post('/register', form);
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 429) {
                setGeneralError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setGeneralError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        'block w-full rounded bg-surface border border-outline-variant text-on-surface focus:border-outline focus:ring-2 focus:ring-outline/20 transition-all py-3 px-4 shadow-sm outline-none';

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 font-['Montserrat']">
            {/* Background Image with Blur */}
            <div className="fixed inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center absolute inset-0"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600')",
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-[0px_10px_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row min-h-[600px] my-8 animate-slide-in-left">
                {/* Tombol Kembali */}
                <Link
                    to="/"
                    className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100/80 backdrop-blur hover:bg-zinc-200 text-zinc-600 hover:text-black transition-all group shadow-sm"
                    aria-label="Kembali ke beranda"
                    title="Kembali ke Beranda"
                >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">close</span>
                </Link>

                {/* Left Side: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col bg-white relative">
                    <div className="w-full flex flex-col mt-2">
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">
                            Maximal Construction
                        </p>
                        <h1 className="font-display-lg text-3xl text-on-surface mb-8">
                            Create Your Account
                        </h1>

                        {generalError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded px-4 py-3 mb-6">
                                {generalError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-on-surface-variant mb-2" htmlFor="name">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                    {errors.name && (
                                        <p className="text-red-600 text-xs mt-1">{errors.name[0]}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-on-surface-variant mb-2" htmlFor="email">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                    {errors.email && (
                                        <p className="text-red-600 text-xs mt-1">{errors.email[0]}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-on-surface-variant mb-2" htmlFor="phone">
                                        Nomor HP
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        value={form.phone}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-600 text-xs mt-1">{errors.phone[0]}</p>
                                    )}
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-xs text-on-surface-variant mb-2" htmlFor="address">
                                        Alamat
                                    </label>
                                    <textarea
                                        id="address"
                                        name="address"
                                        required
                                        rows="3"
                                        value={form.address}
                                        onChange={handleChange}
                                        className={`${inputClass} resize-none`}
                                    ></textarea>
                                    {errors.address && (
                                        <p className="text-red-600 text-xs mt-1">{errors.address[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-xs text-on-surface-variant mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        value={form.password}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                    {errors.password && (
                                        <p className="text-red-600 text-xs mt-1">{errors.password[0]}</p>
                                    )}
                                </div>

                                <div>
                                    <label
                                        className="block text-xs text-on-surface-variant mb-2"
                                        htmlFor="password_confirmation"
                                    >
                                        Konfirmasi Password
                                    </label>
                                    <input
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        type="password"
                                        required
                                        value={form.password_confirmation}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-4 px-4 rounded-lg bg-craftsman-gold hover:opacity-90 text-primary font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Memproses...' : 'Register Now'}
                                </button>
                            </div>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-on-surface-variant">
                                Already have an account?{' '}
                                <Link to="/login" className="font-semibold text-on-surface hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Image */}
                <div className="hidden md:block md:w-1/2 relative bg-zinc-900">
                    <img 
                        src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200" 
                        alt="Construction Workers"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-l from-black/20 to-black/60"></div>
                </div>
            </div>
        </div>
    );
}
