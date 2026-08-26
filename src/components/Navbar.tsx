import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onNavigate: (view: 'landing' | 'analyze') => void;
}

const NAV_LINKS = [
  { label: 'Home', target: 'home' },
  { label: 'How It Works', target: 'how' },
  { label: 'Features', target: 'features' },
];

export function Navbar({ onNavigate }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (target: string) => {
    setOpen(false);
    if (target === 'home' || target === 'how' || target === 'features') {
      const el = document.getElementById(target);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/85 backdrop-blur-md border-b border-slate-200/70 shadow-soft' : 'bg-transparent'
      }`}
    >
      <div className="container-app flex h-16 items-center justify-between">
        <button onClick={() => onNavigate('landing')} className="flex items-center" aria-label="CareerPilot AI home">
          <Logo />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.target}
              onClick={() => go(l.target)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button onClick={() => onNavigate('analyze')} className="btn-primary text-sm">
            Analyze Job
          </button>
        </div>

        <button
          className="btn-ghost md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 shadow-card animate-fade-in">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.target}
                onClick={() => go(l.target)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => {
                setOpen(false);
                onNavigate('analyze');
              }}
              className="btn-primary mt-2 w-full"
            >
              Analyze Job
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
