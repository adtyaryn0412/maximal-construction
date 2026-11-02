import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";

export default function FormProyek() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [year, setYear] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");

    const [coverFile, setCoverFile] = useState(null);
    const [coverPreview, setCoverPreview] = useState(null);
    const [existingGallery, setExistingGallery] = useState([]);
    const [galleryFiles, setGalleryFiles] = useState([]);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!isEdit) return;
        api.get(`/admin/projects`).then((res) => {
            const project = res.data.find((p) => String(p.id) === id);
            if (project) {
                setTitle(project.title);
                setCategory(project.category);
                setYear(project.year);
                setLocation(project.location);
                setDescription(project.description);
                setCoverPreview(`http://127.0.0.1:8000/storage/${project.cover_image}`);
                setExistingGallery(project.galleries || []);
            }
            setLoading(false);
        });
    }, [id, isEdit]);

    const handleCoverChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e) => {
        setGalleryFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    };

    const removeNewGalleryFile = (idx) => {
        setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSaving(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", category);
        formData.append("year", year);
        formData.append("location", location);
        formData.append("description", description);
        if (coverFile) formData.append("cover_image", coverFile);
        galleryFiles.forEach((file) => formData.append("gallery_images[]", file));

        try {
            if (isEdit) {
                await api.post(`/admin/projects/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                if (!coverFile) {
                    setError("Cover image wajib diunggah.");
                    setSaving(false);
                    return;
                }
                await api.post("/admin/projects", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }
            navigate("/admin/portofolio");
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan proyek. Periksa kembali data yang diisi.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-4 md:p-10 text-zinc-500">Memuat data...</div>;
    }

    return (
        <div className="p-4 md:p-10 max-w-[1280px] mx-auto">
            <div className="mb-8">
                <Link
                    to="/admin/portofolio"
                    className="inline-flex items-center gap-2 text-zinc-500 hover:text-black text-sm transition-colors mb-4"
                >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Kembali ke Portofolio
                </Link>
                <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900 mb-1">
                    {isEdit ? "Edit Proyek" : "Tambah Proyek Baru"}
                </h2>
                <p className="text-sm text-zinc-500">
                    Lengkapi detail proyek di bawah untuk {isEdit ? "memperbarui" : "menambahkan"} portofolio.
                </p>
            </div>

            {error && (
                <div className="mb-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left: Informasi Utama */}
                <div className="lg:col-span-7 bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-zinc-100">
                    <h3 className="text-lg font-['Montserrat'] font-bold text-zinc-900 mb-6 pb-4 border-b border-zinc-100">
                        Informasi Utama
                    </h3>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm text-zinc-500 mb-2">Judul Proyek</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-zinc-500 mb-2">Kategori</label>
                                <input
                                    type="text"
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    placeholder="Rumah, Konstruksi, Kanopi, ..."
                                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-zinc-500 mb-2">Tahun Penyelesaian</label>
                                <input
                                    type="text"
                                    required
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] outline-none transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-500 mb-2">Lokasi Proyek</label>
                            <input
                                type="text"
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-zinc-500 mb-2">Deskripsi Proyek</label>
                            <textarea
                                required
                                rows={5}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-[#e9c176] focus:border-[#e9c176] outline-none transition-all resize-y"
                            ></textarea>
                        </div>
                    </div>
                </div>

                {/* Right: Media Visual */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="bg-white rounded-xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-zinc-100">
                        <h3 className="text-lg font-['Montserrat'] font-bold text-zinc-900 mb-6 pb-4 border-b border-zinc-100">
                            Media Visual
                        </h3>

                        {/* Cover */}
                        <div className="mb-8">
                            <label className="block text-sm text-zinc-500 mb-2">
                                Cover Image {!isEdit && <span className="text-red-500">*</span>}
                            </label>
                            <div className="relative w-full h-64 rounded-lg overflow-hidden group border border-zinc-300 bg-zinc-100">
                                {coverPreview ? (
                                    <img src={coverPreview} alt="cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                                        Belum ada gambar
                                    </div>
                                )}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                    <span className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2">
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Ganti Cover
                                    </span>
                                    <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
                                </label>
                            </div>
                        </div>

                        {/* Galeri */}
                        <div>
                            <label className="block text-sm text-zinc-500 mb-2">Galeri Foto Proyek</label>
                            <div className="grid grid-cols-3 gap-4">
                                {existingGallery.map((g) => (
                                    <div key={g.id} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-300 bg-zinc-100">
                                        <img
                                            src={`http://127.0.0.1:8000/storage/${g.image_url}`}
                                            alt="galeri"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                                {galleryFiles.map((file, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-300 group">
                                        <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewGalleryFile(idx)}
                                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                        >
                                            <span className="material-symbols-outlined text-xs">close</span>
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-lg border-2 border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400 hover:text-black hover:border-black transition-all cursor-pointer bg-white">
                                    <span className="material-symbols-outlined text-2xl mb-1">add</span>
                                    <span className="text-[10px]">Tambah</span>
                                    <input type="file" accept="image/*" multiple onChange={handleGalleryChange} className="hidden" />
                                </label>
                            </div>
                            {isEdit && (
                                <p className="text-xs text-zinc-400 mt-3">
                                    Foto galeri lama belum bisa dihapus dari sini — hubungi pengembang jika perlu endpoint hapus galeri terpisah.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/portofolio")}
                            className="px-6 py-3 rounded-lg border border-zinc-300 text-zinc-700 text-sm font-semibold hover:bg-zinc-100 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-3 rounded-lg bg-craftsman-gold text-zinc-950 font-bold text-sm hover:opacity-90 transition-colors shadow-sm disabled:opacity-50"
                        >
                            {saving ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
