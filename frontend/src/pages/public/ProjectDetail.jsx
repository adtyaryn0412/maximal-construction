import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';
import ScrollReveal from '../../components/ui/ScrollReveal';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    api.get(`/projects/${id}`).then((res) => setProject(res.data));
  }, [id]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const storageUrl = (path) => `http://127.0.0.1:8000/storage/${path}`;

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center space-y-4">
          <span className="material-symbols-outlined text-5xl text-outline animate-spin">progress_activity</span>
          <p className="text-on-surface-variant">Memuat proyek...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <PublicHeader />

      <main className="pt-16">
        <section className="relative w-full h-[600px] md:h-[716px] overflow-hidden">
          <img
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            src={storageUrl(project.cover_image)}
            alt={project.title}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full px-4 md:px-margin-desktop pb-16 md:pb-20">
            <div className="max-w-container-max mx-auto">
              <span className="inline-block bg-tertiary-fixed text-on-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-widest rounded mb-4">
                {project.category}
              </span>
              <h1 className="text-white font-display-lg text-4xl md:text-5xl lg:text-display-lg max-w-2xl leading-tight">
                {project.title}
              </h1>
            </div>
          </div>
        </section>

        <section className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-16">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-gutter">
            <div className="lg:w-2/3 space-y-12">
              <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
                <Link to="/#portofolio" className="flex items-center gap-1 font-bold hover:text-craftsman-gold transition-colors">
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                  Kembali ke Portofolio
                </Link>
              </nav>

              <ScrollReveal variant="up">
                <article className="space-y-6">
                  <h2 className="text-2xl md:text-headline-lg font-headline-lg text-primary border-l-4 border-craftsman-gold pl-6">
                    Konsep &amp; Konstruksi
                  </h2>
                  <div className="text-on-surface-variant text-base md:text-body-lg leading-relaxed space-y-4">
                    {project.description
                      ? project.description.split('\n').filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                      : (
                        <>
                          <p>
                            Proyek {project.title} merupakan perpaduan harmonis antara fungsionalitas
                            kontemporer dan kearifan lokal. Pendekatan arsitektural kami berfokus pada
                            efisiensi ruang dan pencahayaan alami, memanfaatkan struktur rangka baja
                            yang presisi untuk menciptakan bentang lebar tanpa kolom tengah yang
                            mengganggu pandangan.
                          </p>
                          <p>
                            Maximal Construction menerapkan standar manajemen proyek yang ketat untuk
                            memastikan setiap detail teknis, mulai dari pondasi hingga finishing
                            interior, dieksekusi dengan presisi milimeter. Penggunaan material premium
                            memberikan kestabilan termal sekaligus estetika yang abadi.
                          </p>
                        </>
                      )
                    }
                  </div>
                </article>
              </ScrollReveal>

              {project.galleries?.length > 0 && (
                <ScrollReveal variant="up" delay="delay-100">
                  <div>
                    <h3 className="text-xl font-headline-md text-primary mb-6 border-l-4 border-craftsman-gold pl-6">
                      Galeri Proyek
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.galleries.map((g, i) => (
                        <ScrollReveal key={g.id} variant="up" delay={`delay-[${i * 100}ms]`}>
                          <div className="group overflow-hidden rounded-xl h-64 relative">
                            <img
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              src={storageUrl(g.image_url)}
                              alt=""
                            />
                          </div>
                        </ScrollReveal>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
            <aside className="lg:w-1/3 space-y-8">
              <ScrollReveal variant="right">
                <div className="bg-white rounded-xl p-8 md:p-10 border border-outline-variant/30 shadow-sm">
                  <h3 className="text-xl md:text-headline-md font-headline-md mb-8 text-primary">
                    Informasi Proyek
                  </h3>
                  <ul className="space-y-6">
                    <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-craftsman-gold mt-0.5">location_on</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Lokasi</p>
                        <p className="font-semibold text-on-surface">{project.location}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-craftsman-gold mt-0.5">calendar_today</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Tahun</p>
                        <p className="font-semibold text-on-surface">{project.year}</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-4">
                      <span className="material-symbols-outlined text-craftsman-gold mt-0.5">category</span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Kategori</p>
                        <p className="font-semibold text-on-surface">{project.category}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </ScrollReveal>

              <ScrollReveal variant="right" delay="delay-200">
                <div className="bg-primary text-on-primary rounded-xl p-8 md:p-10 relative overflow-hidden">
                  <div className="absolute -right-12 -top-12 w-32 h-32 bg-craftsman-gold/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 space-y-4">
                    <h4 className="text-xl md:text-headline-md font-headline-md text-craftsman-gold leading-tight">
                      Wujudkan Proyek Impian Anda!
                    </h4>
                    <p className="text-on-primary-fixed-variant text-sm md:text-body-md leading-relaxed">
                      Jadikan mahakarya ini sebagai awal mula inspirasi Anda. Segera jadwalkan konsultasi dan survei lokasi untuk mulai merealisasikan bangunan impian bersama tim profesional kami.
                    </p>
                    <Link
                      to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'}
                      className="w-full block text-center bg-craftsman-gold text-primary py-4 font-bold text-sm uppercase tracking-wider rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 mt-6 shadow-lg"
                    >
                      Ajukan Reservasi Sekarang
                    </Link>
                  </div>
                </div>
              </ScrollReveal>

            </aside>
          </div>
        </section>
      </main>

      <PublicFooter />

      <a
        href="https://wa.me/6281325255005"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-28 md:bottom-8 right-6 md:right-8 bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 transition-transform"
        aria-label="Chat WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.588-5.946 0-6.556 5.332-11.888 11.888-11.888 3.176 0 6.161 1.237 8.404 3.48s3.481 5.229 3.481 8.408c0 6.556-5.332 11.888-11.888 11.888-2.003 0-3.963-.506-5.703-1.465l-6.301 1.694zm6.105-4.515c1.61.962 3.271 1.441 4.931 1.441 5.393 0 9.781-4.388 9.781-9.781 0-2.613-1.017-5.07-2.864-6.917s-4.304-2.865-6.917-2.865c-5.393 0-9.781 4.388-9.781 9.781 0 2.115.669 4.149 1.933 5.86l-.999 3.65 3.75-.999zm11.334-4.49c-.062-.103-.228-.165-.477-.29s-1.474-.727-1.702-.81-.394-.125-.56.125-.643.81-.788.975-.29.187-.539.062s-1.057-.39-2.014-1.244c-.745-.664-1.248-1.484-1.393-1.734s-.015-.384.11-.508c.112-.112.25-.29.375-.436s.166-.25.25-.415.042-.312-.021-.436-.56-1.35-.768-1.85c-.203-.487-.41-.42-.56-.427-.143-.007-.308-.009-.473-.009s-.432.062-.657.311-.861.843-.861 2.056.884 2.388.996 2.54 1.739 2.656 4.212 3.722c.588.254 1.048.405 1.406.518.591.188 1.129.161 1.554.098.474-.07 1.474-.602 1.682-1.184s.208-1.08.145-1.184z" />
        </svg>
      </a>
    </div>
  );
}