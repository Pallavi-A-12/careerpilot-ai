import type { AnalysisResult, AnalyzeRequest } from '@/types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/analyze-career`;

export class AnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export async function analyzeCareer(
  req: AnalyzeRequest
): Promise<AnalysisResult> {
  let res: Response;

  try {
    res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req),
    });
  } catch (error) {
    console.error('Network error calling Edge Function:', error);

    throw new AnalysisError(
      'Network error. Please check your connection and try again.'
    );
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;

    try {
      const body = await res.json();

      console.error('Edge Function error:', body);

      if (body?.error) {
        message = body.error;
      }

      if (body?.details) {
        console.error('Details:', body.details);
      }
    } catch {
      // Ignore JSON parsing errors
    }

    throw new AnalysisError(message);
  }

  let data: unknown;

  try {
    data = await res.json();
  } catch {
    throw new AnalysisError(
      'Received an invalid response from the server.'
    );
  }

  const result = normalizeResult(data);

  if (!result) {
    throw new AnalysisError(
      'The AI response was incomplete. Please try again.'
    );
  }

  return result;
}

function num(v: unknown, fallback = 0): number {
  const n =
    typeof v === 'string'
      ? parseInt(v, 10)
      : typeof v === 'number'
        ? v
        : NaN;

  return Number.isFinite(n)
    ? Math.max(0, Math.min(100, n))
    : fallback;
}

function str(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback;
}

function arr<T>(
  v: unknown,
  map: (item: unknown) => T
): T[] {
  return Array.isArray(v) ? v.map(map) : [];
}

function normalizeResult(
  data: unknown
): AnalysisResult | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const d = data as Record<string, unknown>;

  const readiness = str(
    d.readiness,
    'Apply With Preparation'
  ) as AnalysisResult['readiness'];

  return {
    matchScore: num(d.matchScore),

    readiness,

    summary: str(d.summary),

    matchingSkills: arr<string>(
      d.matchingSkills,
      (x) => str(x)
    ),

    skillGaps: arr(
      d.skillGaps,
      (x) => {
        const g = x as Record<string, unknown>;

        return {
          skill: str(g.skill),

          status: (
            str(
              g.status,
              'Missing'
            ) as AnalysisResult['skillGaps'][number]['status']
          ) || 'Missing',

          priority: (
            str(
              g.priority,
              'Medium'
            ) as AnalysisResult['skillGaps'][number]['priority']
          ) || 'Medium',
        };
      }
    ),

    technicalMatch: num(d.technicalMatch),

    requirementMatch: num(d.requirementMatch),

    interviewReadiness: num(
      d.interviewReadiness
    ),

    recommendation: str(
      d.recommendation
    ),

    preparationTime: str(
      d.preparationTime
    ),

    improvedSummary: str(
      d.improvedSummary
    ),

    interviewQuestions: arr(
      d.interviewQuestions,
      (x) => {
        const q = x as Record<string, unknown>;

        return {
          category: (
            str(
              q.category,
              'Technical'
            ) as AnalysisResult['interviewQuestions'][number]['category']
          ) || 'Technical',

          question: str(q.question),

          practiceAnswer: str(
            q.practiceAnswer
          ),
        };
      }
    ),

    learningRoadmap: arr(
      d.learningRoadmap,
      (x) => {
        const r = x as Record<string, unknown>;

        return {
          days: str(r.days),
          focus: str(r.focus),
        };
      }
    ),

    nextActions: arr<string>(
      d.nextActions,
      (x) => str(x)
    ),
  };
}