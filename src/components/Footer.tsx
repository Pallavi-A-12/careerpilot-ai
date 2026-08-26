import { ShieldCheck } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-app py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Logo />
          <p className="max-w-xl text-center text-xs leading-relaxed text-slate-500 md:text-right">
            CareerPilot AI provides AI-assisted career guidance. Always verify AI-generated
            recommendations and resume content before submitting applications.
          </p>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Built for students, fresh graduates, and early-career job seekers.</span>
        </div>
        <p className="mt-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} CareerPilot AI. Know Your Fit. Find Your Gaps. Get Job-Ready.
        </p>
      </div>
    </footer>
  );
}
