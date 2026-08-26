import {
  ArrowRight,
  FileText,
  Briefcase,
  Sparkles,
  Target,
  Brain,
  ListChecks,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
} from 'lucide-react';

interface LandingProps {
  onAnalyze: () => void;
}

const STEPS = [
  {
    icon: FileText,
    title: 'Add Your Profile',
    desc: 'Enter your skills, education, experience, projects, and other relevant information.',
  },
  {
    icon: Briefcase,
    title: 'Add a Job Description',
    desc: 'Paste the job description you want to apply for and name the target role.',
  },
  {
    icon: Sparkles,
    title: 'Get Your AI Career Analysis',
    desc: 'CareerPilot AI identifies your strengths, skill gaps, readiness level, interview topics, and learning priorities.',
  },
];

const FEATURES = [
  {
    icon: Target,
    title: 'Job Match Analysis',
    desc: 'Understand how well your profile matches the target job with a clear match score.',
  },
  {
    icon: TrendingUp,
    title: 'Skill Gap Detection',
    desc: 'Identify important skills you are missing or need to improve, with priority levels.',
  },
  {
    icon: FileText,
    title: 'Resume Improvement',
    desc: 'Get AI suggestions to make your professional summary more relevant to the target role.',
  },
  {
    icon: MessageSquare,
    title: 'Interview Preparation',
    desc: 'Generate interview questions based specifically on the target job, with practice answers.',
  },
  {
    icon: GraduationCap,
    title: 'Personalized Learning Roadmap',
    desc: 'Get a focused 14-day learning plan based on your missing skills.',
  },
  {
    icon: ListChecks,
    title: 'Clear Next Actions',
    desc: 'Know exactly what to do next with three prioritized action steps.',
  },
];

export function Landing({ onAnalyze }: LandingProps) {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section id="home" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
          <div className="absolute right-0 top-40 h-64 w-64 rounded-full bg-sky-200/30 blur-3xl" />
        </div>

        <div className="container-app pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="animate-fade-up">
              <span className="chip bg-brand-50 text-brand-700 border border-brand-100">
                <Sparkles className="h-3.5 w-3.5" /> AI-Powered Career Readiness
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl">
                Know Your Fit. <br />
                Find Your Gaps. <br />
                <span className="text-brand-600">Get Job-Ready.</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600">
                CareerPilot AI analyzes your skills against real job descriptions and gives you a
                personalized roadmap to become interview-ready.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button onClick={onAnalyze} className="btn-primary text-base">
                  Analyze My Job <ArrowRight className="h-5 w-5" />
                </button>
                <a href="#how" className="btn-secondary text-base">
                  How It Works
                </a>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>No sign-up required. Get your analysis in seconds.</span>
              </div>
            </div>

            <HeroPreview />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="bg-white py-20">
        <div className="container-app">
          <SectionHeading
            eyebrow="How It Works"
            title="Three steps to job-ready"
            subtitle="From profile to personalized roadmap in minutes."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.title} className="card p-7 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="font-display text-3xl font-extrabold text-slate-200">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="container-app">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need to land the role"
            subtitle="A complete career readiness toolkit powered by AI."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="card group p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-glow animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20">
        <div className="container-app">
          <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 to-brand-900 px-8 py-14 text-center shadow-glow md:px-16 md:py-20">
            <Brain className="mx-auto h-10 w-10 text-brand-200" />
            <h2 className="mt-4 text-3xl font-extrabold text-white md:text-4xl">
              Ready to find out if you're job-ready?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-brand-100">
              Paste your profile and a job description. Get a full career readiness report in seconds.
            </p>
            <button onClick={onAnalyze} className="btn mt-7 bg-white px-6 py-3.5 text-base text-brand-700 hover:bg-brand-50 active:scale-[0.98]">
              Analyze My Job <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span className="text-sm font-semibold uppercase tracking-wider text-brand-600">{eyebrow}</span>
      <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{title}</h2>
      <p className="mt-3 text-base text-slate-600">{subtitle}</p>
    </div>
  );
}

function HeroPreview() {
  return (
    <div className="relative animate-scale-in">
      <div className="card relative z-10 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Job Match Score</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-5xl font-extrabold text-slate-900">78%</span>
              <span className="chip mb-1.5 bg-amber-50 text-amber-700">Apply With Prep</span>
            </div>
          </div>
          <ScoreRing value={78} />
        </div>

        <div className="mt-5 space-y-3">
          <Bar label="Technical Skill Match" value={80} color="bg-brand-500" />
          <Bar label="Job Requirement Match" value={75} color="bg-sky-500" />
          <Bar label="Interview Readiness" value={65} color="bg-violet-500" />
        </div>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Your Strengths</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {['Java', 'SQL', 'Spring Boot', 'REST APIs', 'Git'].map((s) => (
              <span key={s} className="chip bg-emerald-50 text-emerald-700 border border-emerald-100">
                <CheckCircle2 className="h-3.5 w-3.5" /> {s}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Skill Gaps</p>
          <div className="mt-2 space-y-1.5">
            {[
              { s: 'Docker', p: 'High' },
              { s: 'Microservices', p: 'High' },
              { s: 'JUnit', p: 'Medium' },
            ].map((g) => (
              <div key={g.s} className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700">{g.s}</span>
                <span className={`chip text-xs ${g.p === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>
                  {g.p}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 -z-0 h-full w-full rounded-2xl border border-brand-200/60 bg-brand-50/40" />
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-semibold text-slate-900">{value}%</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
      <circle cx="40" cy="40" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
      <circle
        cx="40"
        cy="40"
        r={r}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="7"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
