export type Readiness = 'Ready to Apply' | 'Apply With Preparation' | 'Build Skills First';

export type SkillStatus = 'Missing' | 'Basic' | 'Familiar' | 'Intermediate' | 'Strong';
export type Priority = 'High' | 'Medium' | 'Low';

export interface SkillGap {
  skill: string;
  status: SkillStatus;
  priority: Priority;
}

export type QuestionCategory = 'Technical' | 'Role-specific' | 'Project-based' | 'Behavioral';

export interface InterviewQuestion {
  category: QuestionCategory;
  question: string;
  practiceAnswer: string;
}

export interface RoadmapDay {
  days: string;
  focus: string;
}

export interface AnalysisResult {
  matchScore: number;
  readiness: Readiness;
  summary: string;
  matchingSkills: string[];
  skillGaps: SkillGap[];
  technicalMatch: number;
  requirementMatch: number;
  interviewReadiness: number;
  recommendation: string;
  preparationTime: string;
  improvedSummary: string;
  interviewQuestions: InterviewQuestion[];
  learningRoadmap: RoadmapDay[];
  nextActions: string[];
}

export interface AnalyzeRequest {
  profile: string;
  targetRole: string;
  jobDescription: string;
}
