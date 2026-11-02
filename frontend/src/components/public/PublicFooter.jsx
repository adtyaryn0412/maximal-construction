import Logo from '../../assets/logo-maximal.png';

export default function PublicFooter() {
  const navLinks = [
    ['Beranda', '/#beranda'],
    ['Tentang Kami', '/#tentang'],
    ['Layanan', '/#layanan'],
    ['Portofolio', '/#portofolio'],
  ];

  const services = [
    'Bangun Rumah',
    'Kanopi & Pagar',
    'Renovasi',
    'Konstruksi Baja',
  ];

  return (
    <footer className="bg-primary text-on-primary relative overflow-hidden">
      
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-craftsman-gold to-transparent" />

      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-craftsman-gold/5 blur-3xl pointer-events-none" />
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop pt-20 pb-28 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">

          
          <div className="md:col-span-1">
            <div className="mb-6 -ml-2">
              <img src={Logo} alt="Maximal Construction" className="h-20 md:h-24 object-contain" />
            </div>
            <p className="text-sm text-on-primary-fixed-variant leading-relaxed">
              Penyedia jasa konstruksi premium dengan fokus pada ketahanan struktur dan
              keindahan arsitektural. Melayani Solo Raya, Grobogan, dan sekitarnya.
            </p>
          </div>

          
          <div>
            <h5 className="text-xs font-bold mb-6 uppercase tracking-widest text-craftsman-gold">
              Navigasi
            </h5>
            <ul className="space-y-4">
              {navLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-sm text-on-primary-fixed-variant hover:text-craftsman-gold transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold mb-6 uppercase tracking-widest text-craftsman-gold">
              Layanan
            </h5>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service} className="text-sm text-on-primary-fixed-variant">
                  {service}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-bold mb-6 uppercase tracking-widest text-craftsman-gold">
              Kontak
            </h5>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-craftsman-gold text-lg">location_on</span>
                <span className="text-sm text-on-primary-fixed-variant">Surakarta, Jawa Tengah</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-craftsman-gold text-lg">phone</span>
                <span className="text-sm text-on-primary-fixed-variant">+62 813-2525-5005</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-craftsman-gold text-lg">mail</span>
                <span className="text-sm text-on-primary-fixed-variant">maximal.construction@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-on-primary-fixed mt-16 pt-8 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-primary-fixed-variant">
            © 2026 Maximal Construction. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
