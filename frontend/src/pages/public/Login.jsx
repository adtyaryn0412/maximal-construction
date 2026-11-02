import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await api.post('/login', { email, password });
            login(res.data.user, res.data.token);
            navigate('/dashboard');
        } catch (err) {
            if (err.response?.status === 429) {
                setError(err.response.data.message);
            } else if (err.response?.data?.errors) {
                const firstError = Object.values(err.response.data.errors)[0][0];
                setError(firstError);
            } else {
                setError('Terjadi kesalahan. Silakan coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden font-['Montserrat']">
            {/* Background Image with Blur */}
            <div className="absolute inset-0 z-0">
                <div
                    className="w-full h-full bg-cover bg-center absolute inset-0"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600')",
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            </div>

            {/* Modal Card */}
            <div className="relative z-10 w-full max-w-5xl bg-white rounded-3xl shadow-[0px_10px_40px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row min-h-[600px] animate-slide-in-right">
                {/* Tombol Kembali (Absolute di seluruh card) */}
                <Link
                    to="/"
                    className="absolute top-6 right-6 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100/80 backdrop-blur hover:bg-zinc-200 text-zinc-600 hover:text-black transition-all group shadow-sm"
                    aria-label="Kembali ke beranda"
                    title="Kembali ke Beranda"
                >
                    <span className="material-symbols-outlined text-[18px] group-hover:scale-110 transition-transform">close</span>
                </Link>

                {/* Left Side: Image */}
                <div className="hidden md:block md:w-1/2 relative bg-zinc-900">
                    <img 
                        src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200" 
                        alt="Construction Site"
                        className="absolute inset-0 w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/60"></div>
                </div>

                {/* Right Side: Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white relative">
                    <div className="w-full flex flex-col gap-8">
                    <div className="flex flex-col gap-base">
                        <span className=" text-xs text-on-surface-variant uppercase tracking-widest">
                            Maximal Construction
                        </span>
                        <h1 className="font-display-lg text-3xl text-on-surface mb-2">Welcome Back</h1>
                        <p className=" text-on-surface-variant">
                            Please enter your credentials to access your dashboard.
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-gutter">
                        <div className="flex flex-col gap-base">
                            <label className=" text-xs text-on-surface" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full h-12 px-4 bg-surface rounded-lg border border-outline-variant focus:border-outline focus:ring-2 focus:ring-outline/20 transition-all text-on-surface outline-none"
                            />
                        </div>

                        <div className="flex flex-col gap-base">
                            <label className=" text-xs text-on-surface" htmlFor="password">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full h-12 px-4 pr-10 bg-surface rounded-lg border border-outline-variant focus:border-outline focus:ring-2 focus:ring-outline/20 transition-all text-on-surface outline-none"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors text-sm"
                                >
                                    {showPassword ? 'Sembunyikan' : 'Lihat'}
                                </button>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-outline-variant" />
                                <span className="text-sm text-on-surface-variant">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-on-surface hover:underline">
                                Forgot Password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 bg-craftsman-gold hover:opacity-90 text-primary rounded-lg  flex justify-center items-center gap-2 transition-all shadow active:scale-[0.98] disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <span className="text-sm text-on-surface-variant">Don't have an account? </span>
                        <Link to="/register" className="text-sm font-semibold text-on-surface hover:underline">
                            Create One
                        </Link>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
