import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function KelolaPortofolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("Semua Kategori");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = () => {
    setLoading(true);
    api.get("/admin/projects")
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const categories = ["Semua Kategori", ...new Set(projects.map((p) => p.category))];

  const filtered = activeCategory === "Semua Kategori"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus proyek ini beserta seluruh galerinya? Aksi ini tidak bisa dibatalkan.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus proyek.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-['Montserrat'] font-bold text-zinc-900 mb-1">
            Kelola Portofolio
          </h2>
          <p className="text-sm text-zinc-500">
            Kelola dan tampilkan proyek terbaik Anda.
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/portofolio/tambah")}
          className="bg-craftsman-gold hover:opacity-90 text-zinc-950 font-bold text-sm px-6 py-3 rounded-lg flex items-center gap-2 shadow-sm transition-all hover:-translate-y-0.5"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Tambah Proyek Baru
        </button>
      </div>

      {/* Filter kategori */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? "bg-black text-white shadow-md"
                : "bg-white border border-zinc-300 text-zinc-500 hover:bg-zinc-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <p className="text-zinc-500">Memuat data...</p>
      ) : filtered.length === 0 ? (
        <p className="text-zinc-400 text-center py-16">Belum ada proyek.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-transparent hover:border-zinc-200 hover:shadow-lg transition-all group"
            >
              <div className="h-48 relative overflow-hidden bg-zinc-100">
                <img
                  src={`http://127.0.0.1:8000/storage/${project.cover_image}`}
                  alt={project.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm text-white px-3 py-1 rounded-md text-[10px] uppercase tracking-wider font-semibold">
                  {project.category}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg leading-snug text-black mb-4 line-clamp-2 font-['Montserrat'] font-semibold">
                  {project.title}
                </h3>
                <div className="flex flex-col gap-2 mb-6">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                    <span>{project.year}</span>
                  </div>
                </div>
                <div className="flex gap-2 border-t border-zinc-100 pt-4">
                  <button
                    onClick={() => navigate(`/admin/portofolio/${project.id}/edit`)}
                    className="flex-1 py-2 flex items-center justify-center gap-2 text-black hover:bg-zinc-100 rounded-md transition-colors text-sm font-semibold"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={deletingId === project.id}
                    className="flex-1 py-2 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 rounded-md transition-colors text-sm font-semibold disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    {deletingId === project.id ? "Menghapus..." : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
