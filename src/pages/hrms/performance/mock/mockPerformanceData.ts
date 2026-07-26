import type { 
  AppraisalCycle, 
  Goal, 
  Competency, 
  RatingScale, 
  SelfReview, 
  ManagerReview, 
  CalibrationRecord 
} from '../types';

export const mockCycles: AppraisalCycle[] = [
  {
    id: 'C-2026-01',
    name: 'Annual Performance Review 2026',
    type: 'Annual',
    period: 'Jan 2026 - Dec 2026',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    selfReviewDeadline: '2026-11-15',
    managerReviewDeadline: '2026-11-30',
    hrReviewDeadline: '2026-12-15',
    departments: ['Engineering', 'Sales', 'Marketing', 'HR'],
    locations: ['New York', 'London', 'Remote'],
    grades: ['L1', 'L2', 'L3', 'L4', 'L5'],
    eligibleCount: 154,
    completionPercentage: 75,
    status: 'Active',
    description: 'Annual performance evaluation for all full-time employees.'
  },
  {
    id: 'C-2026-Q1',
    name: 'Q1 Check-in 2026',
    type: 'Quarterly',
    period: 'Jan 2026 - Mar 2026',
    startDate: '2026-01-01',
    endDate: '2026-03-31',
    selfReviewDeadline: '2026-04-05',
    managerReviewDeadline: '2026-04-15',
    hrReviewDeadline: '2026-04-20',
    departments: ['Sales', 'Marketing'],
    locations: ['All'],
    grades: ['All'],
    eligibleCount: 42,
    completionPercentage: 100,
    status: 'Completed',
    description: 'Quarterly goal check-in for revenue-generating teams.'
  },
  {
    id: 'C-2026-02',
    name: 'Mid-Year Review 2026',
    type: 'Bi-Annual',
    period: 'Jan 2026 - Jun 2026',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    selfReviewDeadline: '2026-07-15',
    managerReviewDeadline: '2026-07-31',
    hrReviewDeadline: '2026-08-15',
    departments: ['Engineering', 'Product'],
    locations: ['All'],
    grades: ['All'],
    eligibleCount: 89,
    completionPercentage: 15,
    status: 'Review Phase',
    description: 'Mid-year performance assessment and goal calibration.'
  }
];

export const mockGoals: Goal[] = [
  {
    id: 'G-001',
    title: 'Increase Q3 Revenue by 15%',
    description: 'Focus on enterprise clients to boost overall Q3 revenue.',
    employee: { id: 'EMP-01', name: 'John Doe', designation: 'Senior Account Executive', department: 'Sales' },
    cycleId: 'C-2026-01',
    category: 'Financial',
    weightage: 40,
    kpi: 'Quarterly Revenue',
    targetValue: 500000,
    currentValue: 350000,
    unit: '$',
    dueDate: '2026-09-30',
    priority: 'High',
    status: 'In Progress',
    progress: 70,
    comments: 'Tracking well against enterprise targets.',
    attachments: 2
  },
  {
    id: 'G-002',
    title: 'Launch Mobile App v2.0',
    description: 'Complete development and rollout of the new mobile application.',
    employee: { id: 'EMP-02', name: 'Jane Smith', designation: 'Engineering Lead', department: 'Engineering' },
    cycleId: 'C-2026-01',
    category: 'Productivity',
    weightage: 50,
    kpi: 'Launch Date',
    targetValue: 100,
    currentValue: 100,
    unit: '%',
    dueDate: '2026-08-15',
    priority: 'Critical',
    status: 'Completed',
    progress: 100
  },
  {
    id: 'G-003',
    title: 'Reduce Churn Rate to < 2%',
    description: 'Implement new customer success workflows to retain clients.',
    employee: { id: 'EMP-03', name: 'Alice Johnson', designation: 'Customer Success Manager', department: 'Support' },
    cycleId: 'C-2026-02',
    category: 'Customer Satisfaction',
    weightage: 30,
    kpi: 'Churn Percentage',
    targetValue: 2,
    currentValue: 3.5,
    unit: '%',
    dueDate: '2026-12-31',
    priority: 'Medium',
    status: 'In Progress',
    progress: 45
  }
];

export const mockCompetencies: Competency[] = [
  { id: 'COMP-1', name: 'Problem Solving', description: 'Ability to identify issues and implement effective solutions.', category: 'Core', weightage: 20, active: true },
  { id: 'COMP-2', name: 'Team Collaboration', description: 'Works well with others to achieve common goals.', category: 'Core', weightage: 15, active: true },
  { id: 'COMP-3', name: 'Technical Acumen', description: 'Possesses necessary technical skills for the role.', category: 'Technical', weightage: 25, active: true },
  { id: 'COMP-4', name: 'Strategic Thinking', description: 'Aligns work with long-term company vision.', category: 'Leadership', weightage: 20, active: true }
];

export const mockSelfReviews: SelfReview[] = [
  {
    id: 'SR-101',
    employeeId: 'EMP-01',
    cycleId: 'C-2026-02',
    goalAchievement: [
      { goalId: 'G-001', employeeRating: 4, employeeComment: 'Met most targets despite market downturn.' }
    ],
    competencyRatings: [
      { competencyId: 'COMP-1', employeeRating: 4, employeeComment: 'Resolved key client issues.' },
      { competencyId: 'COMP-2', employeeRating: 5, employeeComment: 'Mentored two junior reps.' }
    ],
    strengths: 'Client relationship management, closing deals under pressure.',
    areasOfImprovement: 'Technical product knowledge.',
    overallRating: 4.2,
    status: 'Submitted',
    submittedOn: '2026-07-10'
  }
];

export const mockManagerReviews: ManagerReview[] = [
  {
    id: 'MR-101',
    selfReviewId: 'SR-101',
    employee: { id: 'EMP-01', name: 'John Doe', designation: 'Senior Account Executive', department: 'Sales' },
    cycle: 'Mid-Year Review 2026',
    goalAssessment: [
      { goalId: 'G-001', managerRating: 4, managerComment: 'Agree with assessment. Great work.' }
    ],
    competencyAssessment: [
      { competencyId: 'COMP-1', managerRating: 4, managerComment: 'Strong problem solver.' },
      { competencyId: 'COMP-2', managerRating: 4, managerComment: 'Good team player, could lead more.' }
    ],
    promotionRecommendation: 'Maybe Later',
    trainingRecommendation: 'Advanced Technical Product Training',
    improvementPlan: 'Focus on understanding backend architecture to sell better.',
    overallRating: 4.0,
    managerComments: 'Solid half year. Keep pushing.',
    status: 'Pending'
  }
];

export const mockCalibrationRecords: CalibrationRecord[] = [
  {
    id: 'CAL-01',
    employee: { id: 'EMP-01', name: 'John Doe', designation: 'Senior Account Executive', department: 'Sales' },
    cycleId: 'C-2026-01',
    currentRating: 4.0,
    proposedRating: 3.8,
    reviewer: 'HR Committee',
    status: 'Pending'
  },
  {
    id: 'CAL-02',
    employee: { id: 'EMP-02', name: 'Jane Smith', designation: 'Engineering Lead', department: 'Engineering' },
    cycleId: 'C-2026-01',
    currentRating: 4.8,
    proposedRating: 4.8,
    finalRating: 4.8,
    reviewer: 'Engineering Director',
    status: 'Finalized'
  }
];

export const mockRatingScales: RatingScale[] = [
  {
    id: 'RS-1',
    name: 'Standard 5-Point Scale',
    minRating: 1,
    maxRating: 5,
    description: 'Standard scale from 1 (Needs Improvement) to 5 (Outstanding)',
    levels: [
      { value: 1, label: 'Needs Improvement', description: 'Consistently fails to meet expectations' },
      { value: 2, label: 'Below Expectations', description: 'Occasionally fails to meet expectations' },
      { value: 3, label: 'Meets Expectations', description: 'Consistently meets expectations' },
      { value: 4, label: 'Exceeds Expectations', description: 'Frequently exceeds expectations' },
      { value: 5, label: 'Outstanding', description: 'Consistently exceeds all expectations' }
    ]
  }
];
