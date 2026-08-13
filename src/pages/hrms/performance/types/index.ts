export type AppraisalCycleStatus = 'Draft' | 'Active' | 'Review Phase' | 'Calibration' | 'Completed' | 'Archived';
export type GoalStatus = 'Not Started' | 'In Progress' | 'Under Review' | 'Completed' | 'Cancelled';
export type ReviewStatus = 'Pending' | 'Draft' | 'Submitted' | 'Manager Reviewed' | 'HR Reviewed' | 'Finalized';
export type CompetencyCategory = 'Core' | 'Leadership' | 'Technical' | 'Functional';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Department {
  id: string;
  name: string;
}

export interface EmployeeInfo {
  id: string;
  name: string;
  avatarUrl?: string;
  designation: string;
  department: string;
}

export interface AppraisalCycle {
  id: string;
  name: string;
  type: 'Annual' | 'Bi-Annual' | 'Quarterly' | 'Probation' | 'Project';
  period: string;
  startDate: string;
  endDate: string;
  selfReviewDeadline: string;
  managerReviewDeadline: string;
  hrReviewDeadline: string;
  departments: string[];
  locations: string[];
  grades: string[];
  eligibleCount: number;
  completionPercentage: number;
  status: AppraisalCycleStatus;
  description?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  employee: EmployeeInfo;
  cycleId: string;
  category: string;
  weightage: number;
  kpi: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  dueDate: string;
  priority: PriorityLevel;
  status: GoalStatus;
  progress: number;
  comments?: string;
  attachments?: number;
}

export interface Competency {
  id: string;
  name: string;
  description: string;
  category: CompetencyCategory;
  weightage: number;
  active: boolean;
}

export interface RatingScale {
  id: string;
  name: string;
  minRating: number;
  maxRating: number;
  description: string;
  levels: { value: number; label: string; description?: string }[];
}

export interface ReviewTemplate {
  id: string;
  name: string;
  competencies: string[]; // Competency IDs
  sections: string[]; // e.g., ['Goals', 'Competencies', 'Strengths', 'Areas of Improvement']
  active: boolean;
}

export interface SelfReview {
  id: string;
  employeeId: string;
  employee?: EmployeeInfo;
  cycleId: string;
  cycleName?: string;
  goalAchievement: { goalId: string; employeeRating: number; employeeComment: string }[];
  competencyRatings: { competencyId: string; employeeRating: number; employeeComment: string }[];
  strengths: string;
  areasOfImprovement: string;
  overallRating: number;
  status: ReviewStatus;
  submittedOn?: string;
}

export interface ManagerReview {
  id: string;
  selfReviewId: string; // Link to self review
  employee: EmployeeInfo;
  manager?: EmployeeInfo;
  cycle: string;
  goalAssessment: { goalId: string; managerRating: number; managerComment: string }[];
  competencyAssessment: { competencyId: string; managerRating: number; managerComment: string }[];
  promotionRecommendation: 'Yes' | 'No' | 'Maybe Later';
  trainingRecommendation: string;
  improvementPlan: string;
  overallRating: number;
  managerComments: string;
  status: ReviewStatus;
  submittedOn?: string;
}

export interface CalibrationRecord {
  id: string;
  employee: EmployeeInfo;
  cycleId: string;
  currentRating: number; // The rating from Manager Review
  proposedRating: number; // Proposed by HR/Calibration committee
  finalRating?: number; // Final approved
  reviewer: string;
  status: 'Pending' | 'Calibrated' | 'Finalized';
}
