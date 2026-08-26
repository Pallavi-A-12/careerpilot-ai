import { useState } from 'react';
import { Sparkles, Loader2, FileText, Briefcase, ClipboardList, AlertCircle, Wand2 } from 'lucide-react';
import type { AnalyzeRequest } from '@/types';

interface AnalyzeFormProps {
  onSubmit: (req: AnalyzeRequest) => void;
  loading: boolean;
  error: string | null;
  onTryDemo: () => void;
}

const MIN_PROFILE = 20;
const MIN_JD = 50;

export function AnalyzeForm({ onSubmit, loading, error, onTryDemo }: AnalyzeFormProps) {
  const [profile, setProfile] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [touched, setTouched] = useState(false);

  const profileErr = touched && profile.trim().length < MIN_PROFILE;
  const roleErr = touched && !targetRole.trim();
  const jdErr = touched && jobDescription.trim().length < MIN_JD;

  const canSubmit =
    profile.trim().length >= MIN_PROFILE && targetRole.trim() && jobDescription.trim().length >= MIN_JD;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!canSubmit || loading) return;
    onSubmit({ profile: profile.trim(), targetRole: targetRole.trim(), jobDescription: jobDescription.trim() });
  };

  return (
    <div className="container-app py-10 md:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="chip bg-brand-50 text-brand-700 border border-brand-100">
            <Sparkles className="h-3.5 w-3.5" /> AI Career Analysis
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            Analyze Your Job Fit
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Paste your profile and the job description. CareerPilot AI will tell you if you're ready — and what to do next.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          {/* Profile */}
          <Field
            icon={FileText}
            label="Candidate Profile"
            hint="Paste your resume or describe your skills, education, projects and experience."
          >
            <textarea
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              rows={6}
              placeholder="Example: MCA graduate with knowledge of Java, Spring Boot, SQL, React, HTML, CSS, JavaScript. Built a Student Management System using Spring Boot and MySQL..."
              className={`input-base resize-y ${profileErr ? 'border-rose-400 focus:ring-rose-500/30' : ''}`}
            />
            <FieldFooter
              error={profileErr ? `Please enter at least ${MIN_PROFILE} characters describing your profile.` : null}
              count={profile.length}
              min={MIN_PROFILE}
            />
          </Field>

          {/* Target Role */}
          <Field icon={Briefcase} label="Target Job Role" hint="The role you're applying for.">
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="Example: Junior Java Developer"
              className={`input-base ${roleErr ? 'border-rose-400 focus:ring-rose-500/30' : ''}`}
            />
            {roleErr && <p className="mt-1.5 text-sm text-rose-600">Please enter a target job role.</p>}
          </Field>

          {/* Job Description */}
          <Field
            icon={ClipboardList}
            label="Job Description"
            hint="Paste the complete job description here."
          >
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              placeholder="Paste the full job description including responsibilities, requirements, and qualifications..."
              className={`input-base resize-y ${jdErr ? 'border-rose-400 focus:ring-rose-500/30' : ''}`}
            />
            <FieldFooter
              error={jdErr ? `Please enter at least ${MIN_JD} characters of the job description.` : null}
              count={jobDescription.length}
              min={MIN_JD}
            />
          </Field>

          {error && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 animate-fade-in">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" /> Analyze My Job
                </>
              )}
            </button>
            <button type="button" onClick={onTryDemo} disabled={loading} className="btn-secondary w-full sm:w-auto">
              <Wand2 className="h-4 w-4" /> Try an example
            </button>
          </div>
        </form>

        {loading && (
          <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-brand-100 bg-brand-50/50 px-6 py-8 text-center animate-fade-in">
            <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            <p className="text-sm font-medium text-brand-700">
              Analyzing your profile against the job requirements...
            </p>
            <p className="text-xs text-brand-600/70">This usually takes a few seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  hint,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-5 md:p-6">
      <div className="mb-3 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
          <Icon className="h-4.5 w-4.5" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-900">{label}</label>
          <p className="text-xs text-slate-500">{hint}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function FieldFooter({ error, count, min }: { error: string | null; count: number; min: number }) {
  return (
    <div className="mt-1.5 flex items-center justify-between">
      <span className="text-sm text-rose-600">{error}</span>
      <span className={`text-xs ${count < min ? 'text-slate-400' : 'text-slate-500'}`}>{count} characters</span>
    </div>
  );
}
