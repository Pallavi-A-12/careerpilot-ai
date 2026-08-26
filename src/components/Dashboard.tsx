import { useState } from 'react';
import { CheckCircle2, ChevronDown, Copy, Check } from 'lucide-react';
import type { AnalysisResult, Readiness, SkillGap, Priority } from '@/types';

const READINESS_STYLE: Record<Readiness, { dot: string; chip: string; label: string }> = {
  'Ready to Apply': { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Ready to Apply' },
  'Apply With Preparation': { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Apply With Preparation' },
  'Build Skills First': { dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-200', label: 'Build Skills First' },
};

const PRIORITY_STYLE: Record<Priority, string> = {
  High: 'bg-rose-50 text-rose-600',
  Medium: 'bg-amber-50 text-amber-700',
  Low: 'bg-slate-100 text-slate-600',
};

const STATUS_STYLE: Record<string, string> = {
  Missing: 'bg-rose-50 text-rose-600',
  Basic: 'bg-amber-50 text-amber-700',
  Familiar: 'bg-sky-50 text-sky-700',
  Intermediate: 'bg-brand-50 text-brand-700',
  Strong: 'bg-emerald-50 text-emerald-700',
};

interface DashboardProps {
  result: AnalysisResult;
  targetRole: string;
  originalProfile: string;
  onAnalyzeAnother: () => void;
}

export function Dashboard({ result, targetRole, originalProfile, onAnalyzeAnother }: DashboardProps) {
  const rs = READINESS_STYLE[result.readiness] ?? READINESS_STYLE['Apply With Preparation'];

  return (
    <div className="container-app py-8 md:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">Your Career Readiness Report</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
            {targetRole}
          </h1>
        </div>
        <button onClick={onAnalyzeAnother} className="btn-secondary self-start sm:self-auto">
          Analyze Another Job
        </button>
      </div>

      <div className="mt-8 space-y-6">
        {/* Top: Score + Readiness + Summary */}
        <div className="grid gap-6 lg:grid-cols-3">
          <ScoreCard score={result.matchScore} rs={rs} />
          <div className="card p-6 lg:col-span-2 animate-fade-up">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Summary</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700">{result.summary}</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <BreakdownBar label="Technical Skill Match" value={result.technicalMatch} color="bg-brand-500" />
              <BreakdownBar label="Job Requirement Match" value={result.requirementMatch} color="bg-sky-500" />
              <BreakdownBar label="Interview Readiness" value={result.interviewReadiness} color="bg-violet-500" />
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div className="card overflow-hidden animate-fade-up">
          <div className={`flex items-center gap-2 px-6 py-3 ${rs.chip} border-b ${rs.chip.includes('emerald') ? 'border-emerald-200' : rs.chip.includes('amber') ? 'border-amber-200' : 'border-rose-200'}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${rs.dot}`} />
            <span className="text-sm font-bold">{rs.label}</span>
          </div>
          <div className="p-6">
            <p className="text-base leading-relaxed text-slate-700">{result.recommendation}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm font-medium text-slate-500">Recommended Preparation Time:</span>
              <span className="chip bg-brand-50 text-brand-700 font-bold">{result.preparationTime}</span>
            </div>
          </div>
        </div>

        {/* Matching Skills + Skill Gaps */}
        <div className="grid gap-6 lg:grid-cols-2">
          <MatchingSkills skills={result.matchingSkills} />
          <SkillGaps gaps={result.skillGaps} />
        </div>

        {/* Resume Improvement */}
        <ResumeImprovement original={originalProfile} improved={result.improvedSummary} />

        {/* Interview Prep */}
        <InterviewPrep questions={result.interviewQuestions} />

        {/* Learning Roadmap */}
        <LearningRoadmap roadmap={result.learningRoadmap} />

        {/* Next Actions */}
        <NextActions actions={result.nextActions} />

        {/* Disclaimer */}
        <p className="rounded-xl bg-slate-100 px-4 py-3 text-center text-xs leading-relaxed text-slate-500">
          CareerPilot AI provides AI-assisted career guidance. Always verify AI-generated
          recommendations and resume content before submitting applications.
        </p>
      </div>
    </div>
  );
}

function ScoreCard({ score, rs }: { score: number; rs: { dot: string; chip: string; label: string } }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;
  return (
    <div className="card flex flex-col items-center justify-center p-6 animate-fade-up">
      <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">Job Match Score</p>
      <div className="relative mt-4">
        <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
          <circle
            cx="70"
            cy="70"
            r={r}
            fill="none"
            stroke={score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#f43f5e'}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl font-extrabold text-slate-900">{score}%</span>
        </div>
      </div>
      <div className={`mt-4 chip border ${rs.chip}`}>
        <span className={`h-2 w-2 rounded-full ${rs.dot}`} />
        {rs.label}
      </div>
    </div>
  );
}

function BreakdownBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="font-bold text-slate-900">{value}%</span>
      </div>
      <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MatchingSkills({ skills }: { skills: string[] }) {
  return (
    <div className="card p-6 animate-fade-up">
      <h3 className="text-base font-bold text-slate-900">Your Strengths</h3>
      <p className="mt-1 text-sm text-slate-500">Skills you have that match the job requirements.</p>
      {skills.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No matching skills were identified.</p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((s) => (
            <span key={s} className="chip bg-emerald-50 text-emerald-700 border border-emerald-100">
              <CheckCircle2 className="h-4 w-4" /> {s}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SkillGaps({ gaps }: { gaps: SkillGap[] }) {
  return (
    <div className="card p-6 animate-fade-up">
      <h3 className="text-base font-bold text-slate-900">Skills You Should Improve</h3>
      <p className="mt-1 text-sm text-slate-500">Missing or weak skills, with priority.</p>
      {gaps.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No significant skill gaps detected.</p>
      ) : (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-2 pr-4">Skill</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2">Priority</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g) => (
                <tr key={g.skill} className="border-b border-slate-50 last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-slate-800">{g.skill}</td>
                  <td className="py-2.5 pr-4">
                    <span className={`chip text-xs ${STATUS_STYLE[g.status] ?? 'bg-slate-100 text-slate-600'}`}>{g.status}</span>
                  </td>
                  <td className="py-2.5">
                    <span className={`chip text-xs ${PRIORITY_STYLE[g.priority] ?? PRIORITY_STYLE.Medium}`}>{g.priority}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ResumeImprovement({ original, improved }: { original: string; improved: string }) {
  const [show, setShow] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(improved);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="card p-6 animate-fade-up">
      <h3 className="text-base font-bold text-slate-900">Improve Your Professional Summary</h3>
      <p className="mt-1 text-sm text-slate-500">AI rewrites your summary using only the information you provided.</p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Current Profile</p>
          <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-600 max-h-48 overflow-y-auto">
            {original}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">AI Improved Profile</p>
            {show && (
              <button onClick={copy} className="btn-ghost text-xs">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
          </div>
          <div className="mt-2 rounded-xl border border-brand-100 bg-brand-50/40 p-4 text-sm leading-relaxed text-slate-700 max-h-48 overflow-y-auto">
            {show ? improved : <span className="text-slate-400">Click "Improve My Summary" to reveal the AI-improved version.</span>}
          </div>
        </div>
      </div>

      <button onClick={() => setShow((v) => !v)} className="btn-secondary mt-5 text-sm">
        {show ? 'Hide' : 'Improve My Summary'}
      </button>
    </div>
  );
}

function InterviewPrep({ questions }: { questions: AnalysisResult['interviewQuestions'] }) {
  const [open, setOpen] = useState<number | null>(null);

  const cats: Record<string, string> = {
    Technical: 'bg-brand-50 text-brand-700',
    'Role-specific': 'bg-sky-50 text-sky-700',
    'Project-based': 'bg-violet-50 text-violet-700',
    Behavioral: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="card p-6 animate-fade-up">
      <h3 className="text-base font-bold text-slate-900">AI Interview Preparation</h3>
      <p className="mt-1 text-sm text-slate-500">Job-specific questions with practice answers. Click a question to reveal the answer.</p>

      {questions.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No interview questions were generated.</p>
      ) : (
        <div className="mt-4 space-y-2">
          {questions.map((q, i) => (
            <div key={i} className="rounded-xl border border-slate-200">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-start gap-3 px-4 py-3 text-left"
              >
                <span className={`chip shrink-0 text-xs ${cats[q.category] ?? 'bg-slate-100 text-slate-600'}`}>{q.category}</span>
                <span className="flex-1 text-sm font-medium text-slate-800">{q.question}</span>
                <ChevronDown className={`mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="border-t border-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-600 animate-fade-in">
                  <span className="font-semibold text-slate-700">Practice Answer: </span>
                  {q.practiceAnswer}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LearningRoadmap({ roadmap }: { roadmap: AnalysisResult['learningRoadmap'] }) {
  return (
    <div className="card p-6 animate-fade-up">
      <h3 className="text-base font-bold text-slate-900">Your Personalized Learning Roadmap</h3>
      <p className="mt-1 text-sm text-slate-500">A 14-day plan focused on your skill gaps for this job.</p>

      {roadmap.length === 0 ? (
        <p className="mt-4 text-sm text-slate-400">No roadmap was generated.</p>
      ) : (
        <div className="mt-5 space-y-0">
          {roadmap.map((r, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {i + 1}
                </div>
                {i < roadmap.length - 1 && <div className="my-1 w-px flex-1 bg-slate-200" />}
              </div>
              <div className="pb-5">
                <p className="text-sm font-bold text-brand-700">{r.days}</p>
                <p className="mt-0.5 text-sm text-slate-700">{r.focus}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function NextActions({ actions }: { actions: string[] }) {
  return (
    <div className="card p-6 animate-fade-up">
      <h3 className="text-base font-bold text-slate-900">Your Next 3 Actions</h3>
      <p className="mt-1 text-sm text-slate-500">Start here — these are your highest-impact next steps.</p>
      <div className="mt-4 space-y-2.5">
        {actions.slice(0, 3).map((a, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
              {i + 1}
            </div>
            <p className="text-sm font-medium text-slate-700">{a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
