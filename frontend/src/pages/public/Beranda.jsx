import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { motion } from 'framer-motion';

import PublicHeader from '../../components/public/PublicHeader';
import PublicFooter from '../../components/public/PublicFooter';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const fadeRightVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
};

export default function Beranda() {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    api.get('/services')
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) setServices(data);
      }).catch(console.error);

    api.get('/projects')
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) setProjects(data.slice(0, 6));
      }).catch(console.error);

    api.get('/testimonials')
      .then((res) => {
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) setTestimonials(data.slice(0, 3));
      }).catch(console.error);
  }, []);

  return (
    <div className="bg-background text-on-surface overflow-x-hidden">
      <PublicHeader />

      {/* Hero */}
      <section className="relative h-screen flex items-center pt-20" id="beranda">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/40 z-10"></div>
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1600"
            alt="Konstruksi"
          />
        </div>
        <div className="relative z-20 px-4 md:px-margin-desktop max-w-container-max mx-auto w-full">
          <motion.div
            className="max-w-2xl text-white"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUpVariant} className="text-xs tracking-widest text-craftsman-gold mb-4 uppercase">
              Solusi Bangunan Profesional
            </motion.h2>
            <motion.h1 variants={fadeUpVariant} className="font-display-lg text-4xl md:text-6xl mb-6 leading-tight">
              Maximal Construction
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-lg mb-10">
              Melayani pembangunan berkualitas tinggi di wilayah Solo Raya & Grobogan dengan
              presisi arsitektural dan ketahanan material premium.
            </motion.p>
            <motion.div variants={fadeUpVariant} className="flex flex-wrap gap-4">
              <a
                href="#kontak"
                className="bg-craftsman-gold text-white px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                Reservasi Sekarang
              </a>
              <a
                href="#portofolio"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-primary transition-all"
              >
                Lihat Portofolio
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Tentang Kami */}
      <section className="py-24 bg-white" id="tentang">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {[
              ['100+', 'Proyek Selesai'],
              ['7', 'Tahun Pengalaman'],
              ['10+', 'Kota Dilayani'],
              ['100%', 'Garansi Kualitas'],
            ].map(([num, label]) => (
              <motion.div variants={fadeUpVariant} key={label} className="p-8 border border-outline-variant rounded-xl text-center hover:shadow-xl transition-shadow">
                <div className="text-4xl font-display-lg text-primary mb-2">{num}</div>
                <div className="text-xs text-on-surface-variant">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeRightVariant}
            >
              <h2 className="text-3xl font-headline-lg mb-8 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-20 after:h-1 after:bg-craftsman-gold">
                Tentang Kami
              </h2>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                Maximal Construction hadir sebagai mitra terpercaya dalam mewujudkan
                infrastruktur dan hunian impian Anda. Dengan mengedepankan nilai kejujuran dan
                ketepatan waktu, kami membangun reputasi solid di Jawa Tengah melalui dedikasi
                tanpa henti pada detail arsitektural.
              </p>
            </motion.div>
            <motion.div
              className="bg-surface-container p-10 rounded-2xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
            >
              <h3 className="text-xl font-headline-md mb-6">Mengapa Pilih Kami</h3>
              <ul className="space-y-6">
                {[
                  ['Transparansi Anggaran', 'Rincian biaya jujur tanpa biaya tersembunyi sejak awal proyek.'],
                  ['Material Premium Standar SNI', 'Hanya menggunakan bahan bangunan berkualitas tertinggi.'],
                  ['Tepat Waktu & Terjamin', 'Manajemen proyek profesional sesuai deadline yang disepakati.'],
                ].map(([title, desc]) => (
                  <li key={title} className="flex items-start gap-4">
                    <span className="text-craftsman-gold text-xl">✓</span>
                    <div>
                      <h4 className="font-bold text-primary">{title}</h4>
                      <p className="text-sm text-on-surface-variant">{desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Layanan */}
      <section className="py-24 bg-surface-container-low" id="layanan">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
          >
            <h2 className="text-3xl font-headline-lg mb-8 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-craftsman-gold">Layanan Kami</h2>
            <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
              Kami menawarkan solusi konstruksi menyeluruh untuk kebutuhan residensial dan
              komersial dengan standar engineering tinggi.
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {services.map((service) => (
              <motion.div variants={fadeUpVariant} key={service.id} className="bg-white p-10 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 group">
                <span className="material-symbols-outlined text-4xl text-craftsman-gold mb-6 block">
                  {service.icon_image || 'build'}
                </span>
                <h3 className="text-xl font-headline-md mb-4 group-hover:text-craftsman-gold transition-colors">
                  {service.name}
                </h3>
                <p className="text-on-surface-variant">{service.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Portofolio */}
      <section className="py-24 bg-white" id="portofolio">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <motion.div
            className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
          >
            <div>
              <h2 className="text-3xl font-headline-lg mb-8 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-20 after:h-1 after:bg-craftsman-gold">Portofolio Proyek</h2>
              <p className="text-lg text-on-surface-variant max-w-xl">
                Bukti nyata komitmen kami terhadap kualitas dan detail dalam setiap proyek
                konstruksi.
              </p>
            </div>
          </motion.div>

          {projects.length === 0 ? (
            <p className="text-on-surface-variant text-center py-12">Belum ada proyek ditampilkan.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {projects.map((project) => (
                <motion.div variants={fadeUpVariant} key={project.id} className="group overflow-hidden rounded-xl bg-white border border-outline-variant">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={`http://127.0.0.1:8000/storage/${project.cover_image}`}
                      alt={project.title}
                    />
                    <span className="absolute top-4 left-4 bg-craftsman-gold text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-headline-md mb-2">{project.title}</h4>
                    <div className="flex items-center gap-4 text-sm text-on-surface-variant mb-4">
                      <span>{project.location}</span>
                      <span>{project.year}</span>
                    </div>
                    <Link
                      to={`/portofolio/${project.id}`}
                      className="text-primary font-bold text-sm flex items-center gap-2 group-hover:translate-x-2 transition-transform"
                    >
                      Lihat Detail →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Testimoni */}
      <section className="py-24 bg-surface-container" id="testimoni">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <motion.h2
            className="text-3xl font-headline-lg text-center mb-16 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-craftsman-gold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
          >
            Apa Kata Mereka
          </motion.h2>

          {testimonials.length === 0 ? (
            <p className="text-on-surface-variant text-center">Belum ada testimoni.</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {testimonials.map((t) => (
                <motion.div variants={fadeUpVariant} key={t.id} className="bg-white p-10 rounded-2xl shadow-sm border border-outline-variant flex flex-col">
                  <div className="flex text-craftsman-gold mb-6">
                    {'★'.repeat(t.rating)}
                    {'☆'.repeat(5 - t.rating)}
                  </div>
                  <p className="italic text-on-surface-variant mb-8 leading-relaxed">"{t.message}"</p>
                  <div className="mt-auto">
                    <h5 className="font-bold text-primary">{t.user.name}</h5>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Kontak */}
      <section className="py-24 bg-white" id="kontak">
        <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
          <motion.h2
            className="text-3xl font-headline-lg mb-16 relative after:content-[''] after:absolute after:bottom-[-10px] after:left-0 after:w-20 after:h-1 after:bg-craftsman-gold"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeRightVariant}
          >
            Kontak Kami
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              className="h-[400px] lg:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-outline-variant bg-surface-container"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4248.606340974054!2d110.8758597109065!3d-7.567754674713544!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a1734f6e35333%3A0xa67d294231b76a6d!2sMaximal!5e1!3m2!1sid!2sid!4v1787327862766!5m2!1sid!2sid"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Workshop Maximal Construction"
              ></iframe>
            </motion.div>
            <motion.div
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeRightVariant} className="flex items-start gap-5 p-6 bg-surface-container-low border border-outline-variant/50 rounded-xl hover:shadow-sm hover:border-craftsman-gold/30 transition-shadow duration-300">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-craftsman-gold text-xl">location_on</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Alamat Workshop</p>
                  <p className="font-bold text-on-surface text-base">Dagen, Jaten, Karanganyar, Jawa Tengah</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">Area layanan: Solo Raya & Sekitarnya</p>
                </div>
              </motion.div>

              <motion.div variants={fadeRightVariant} className="flex items-start gap-5 p-6 bg-surface-container-low border border-outline-variant/50 rounded-xl hover:shadow-sm hover:border-craftsman-gold/30 transition-shadow duration-300">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-craftsman-gold text-xl">phone</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">WhatsApp / Telepon</p>
                  <p className="font-bold text-on-surface text-base">+62 813-2525-5005</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">Senin – Minggu, 08.00 – 17.00 WIB</p>
                </div>
              </motion.div>

              <motion.div variants={fadeRightVariant} className="flex items-start gap-5 p-6 bg-surface-container-low border border-outline-variant/50 rounded-xl hover:shadow-sm hover:border-craftsman-gold/30 transition-shadow duration-300">
                <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-craftsman-gold text-xl">mail</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-1">Email</p>
                  <p className="font-bold text-on-surface text-base">maximal.construction@gmail.com</p>
                  <p className="text-sm text-on-surface-variant mt-0.5">Respon dalam 1×24 jam</p>
                </div>
              </motion.div>
              {!user && (
                <motion.div variants={fadeUpVariant}>
                  <Link
                    to="/register"
                    className="w-full block text-center bg-craftsman-gold text-white py-6 rounded-xl font-bold text-xl hover:shadow-xl transition-shadow duration-300"
                  >
                    Jadwalkan Survei Gratis
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />

      <a
        href="https://wa.me/6281325255005"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-28 md:bottom-8 right-6 md:right-8 bg-[#25D366] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-2xl z-40 hover:scale-110 transition-transform"
        aria-label="Hubungi kami via WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 md:w-9 md:h-9">
          <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.23-.64.08-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3-.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35zm-5.46 5.56h-.01c-1.45 0-2.87-.39-4.12-1.13l-.3-.18-3.06.8.82-2.98-.2-.31A8.2 8.2 0 0 1 3.79 12c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.25 8.23zM12 2C6.48 2 2 6.48 2 12c0 1.76.46 3.48 1.33 5l-1.3 4.74 4.85-1.27A9.9 9.9 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
        </svg>
      </a>
    </div>
  );
}
