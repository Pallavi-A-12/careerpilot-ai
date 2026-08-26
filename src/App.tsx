import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Landing } from '@/components/Landing';
import { AnalyzeForm } from '@/components/AnalyzeForm';
import { Dashboard } from '@/components/Dashboard';
import { analyzeCareer, AnalysisError } from '@/lib/aiService';
import type { AnalysisResult, AnalyzeRequest } from '@/types';

type View = 'landing' | 'analyze' | 'result';

const DEMO: AnalyzeRequest = {
  profile:
    'MCA graduate with knowledge of Java, Spring Boot, SQL, React, HTML, CSS, JavaScript. Built a Student Management System using Spring Boot and MySQL. Completed a REST API project for an e-commerce backend. Familiar with Git and basic Docker usage.',
  targetRole: 'Junior Java Developer',
  jobDescription:
    'We are hiring a Junior Java Developer. Requirements: Core Java, Spring Boot, REST APIs, SQL, Git. Nice to have: Docker, microservices, JUnit testing. Responsibilities: develop backend services, write unit tests, collaborate with the team on API design.',
};

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [targetRole, setTargetRole] = useState('');
  const [originalProfile, setOriginalProfile] = useState('');

  const goLanding = () => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goAnalyze = () => {
    setError(null);
    setView('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (req: AnalyzeRequest) => {
    setLoading(true);
    setError(null);
    setOriginalProfile(req.profile);
    setTargetRole(req.targetRole);
    try {
      const res = await analyzeCareer(req);
      setResult(res);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      const msg = e instanceof AnalysisError ? e.message : 'We couldn\'t complete the analysis right now. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    handleSubmit(DEMO);
  };

  const analyzeAnother = () => {
    setResult(null);
    setError(null);
    setView('analyze');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onNavigate={view === 'landing' ? goAnalyze : goLanding} />

      <main className="flex-1">
        {view === 'landing' && <Landing onAnalyze={goAnalyze} />}
        {view === 'analyze' && (
          <AnalyzeForm onSubmit={handleSubmit} loading={loading} error={error} onTryDemo={handleDemo} />
        )}
        {view === 'result' && result && (
          <Dashboard
            result={result}
            targetRole={targetRole}
            originalProfile={originalProfile}
            onAnalyzeAnother={analyzeAnother}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
