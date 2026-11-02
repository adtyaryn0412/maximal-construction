import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await axios.post("/admin/login", { email, password });
            login(res.data.user, res.data.token);
            navigate("/admin/dashboard");
        } catch (err) {
            const msg =
                err.response?.data?.errors?.email?.[0] ||
                err.response?.data?.message ||
                "Email atau password admin salah.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#1a1a1a] text-white font-['Montserrat']">
            <main className="w-full max-w-md z-10">
                {/* Brand */}
                <div className="text-center mb-10">
                    <h1 className="font-['Montserrat'] text-2xl font-bold tracking-tight text-[#f8f9fa] uppercase">
                        Maximal Construction
                    </h1>
                    <p className="text-[11px] text-[#858383] tracking-[0.2em] mt-1 font-['Montserrat'] font-semibold">
                        ADMIN PANEL
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl p-10 md:p-12 relative overflow-hidden shadow-[0px_4px_40px_rgba(0,0,0,0.4)] border border-white/5">
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Icon */}
                        <div className="w-12 h-12 rounded-full bg-[#edeeef] flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-black text-2xl">
                                lock
                            </span>
                        </div>

                        <h2 className="text-2xl text-black text-center mb-2 font-['Montserrat'] font-semibold">
                            Portal Admin
                        </h2>
                        <p className="text-sm text-[#444748] text-center mb-8">
                            Akses terbatas — khusus untuk administrator sistem.
                        </p>

                        {error && (
                            <div className="w-full mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="w-full space-y-6">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-[11px] tracking-[0.05em] text-[#444748] ml-1 font-semibold"
                                >
                                    EMAIL ADDRESS
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@maximal-construction.com"
                                    className="w-full bg-[#f3f4f5] border border-[#c4c7c7] rounded-lg px-4 py-3.5 text-black placeholder:text-black/30 focus:ring-2 focus:ring-craftsman-gold focus:border-craftsman-gold transition-all outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-[11px] tracking-[0.05em] text-[#444748] ml-1 font-semibold"
                                >
                                    PASSWORD
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#f3f4f5] border border-[#c4c7c7] rounded-lg px-4 py-3.5 text-black placeholder:text-black/30 focus:ring-2 focus:ring-craftsman-gold focus:border-craftsman-gold transition-all outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-craftsman-gold hover:opacity-90 active:scale-[0.98] text-primary text-[11px] font-semibold py-4 rounded-lg shadow-lg shadow-craftsman-gold/20 transition-all flex items-center justify-center gap-2 uppercase tracking-widest mt-4 disabled:opacity-50"
                            >
                                {loading ? "Memproses..." : "Masuk sebagai Admin"}
                                <span className="material-symbols-outlined text-[18px]">
                                    arrow_forward
                                </span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Footer link */}
                <div className="text-center mt-8">
                    <a
                        href="/"
                        className="text-sm text-[#858383] hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px]">
                            keyboard_backspace
                        </span>
                        Bukan admin? Kembali ke halaman utama
                    </a>
                </div>
      </main >
    </div >
  );
}
