import { Link } from 'react-router-dom';

export default function UserFooter() {
  return (
    <footer className="w-full bg-primary text-white relative overflow-hidden">
      
      <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-craftsman-gold to-transparent" />

      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-8 flex flex-col md:flex-row justify-between items-center gap-6">

        
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" className="font-headline-md font-bold text-white hover:text-craftsman-gold transition-colors tracking-tight">
            Maximal Construction
          </Link>
          <span className="text-xs text-white/40 tracking-wider">
            © 2026 · Precise Engineering, Premium Quality
          </span>
        </div>

        
        <nav className="flex items-center gap-6 flex-wrap justify-center">
          <a
            href="#"
            className="text-xs text-white/50 hover:text-craftsman-gold transition-colors uppercase tracking-widest"
          >
            Privacy Policy
          </a>
          <span className="text-white/20 text-xs">|</span>
          <a
            href="#"
            className="text-xs text-white/50 hover:text-craftsman-gold transition-colors uppercase tracking-widest"
          >
            Terms of Service
          </a>
          <span className="text-white/20 text-xs">|</span>
          <a
            href="mailto:maximal.construction@gmail.com"
            className="text-xs text-white/50 hover:text-craftsman-gold transition-colors uppercase tracking-widest"
          >
            Support
          </a>
        </nav>
      </div>
    </footer>
  );
}
