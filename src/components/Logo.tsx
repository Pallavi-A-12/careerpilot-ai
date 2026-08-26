import { Rocket } from 'lucide-react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
        <Rocket className="h-5 w-5" strokeWidth={2.2} />
      </div>
      <span className="font-display text-lg font-extrabold tracking-tight text-slate-900">
        CareerPilot <span className="text-brand-600">AI</span>
      </span>
    </div>
  );
}
