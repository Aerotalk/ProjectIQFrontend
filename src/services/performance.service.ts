import { api } from '../lib/api';
import { AppraisalCycle, Goal, SelfReview, ManagerReview, CalibrationRecord, Competency, RatingScale } from '../pages/hrms/performance/types';

const BASE_URL = '/hrms/performance';

export const performanceService = {
  // Rating Scales & Competencies
  getRatingScales: () => api.get(`${BASE_URL}/rating-scales`),
  createRatingScale: (data: Partial<RatingScale>) => api.post(`${BASE_URL}/rating-scales`, data),
  
  getCompetencies: () => api.get(`${BASE_URL}/competencies`),
  createCompetency: (data: Partial<Competency>) => api.post(`${BASE_URL}/competencies`, data),
  updateCompetency: (id: string, data: Partial<Competency>) => api.put(`${BASE_URL}/competencies/${id}`, data),
  deleteCompetency: (id: string) => api.delete(`${BASE_URL}/competencies/${id}`),

  // Appraisal Cycles
  getCycles: () => api.get(`${BASE_URL}/cycles`),
  getCycleById: (id: string) => api.get(`${BASE_URL}/cycles/${id}`),
  createCycle: (data: Partial<AppraisalCycle>) => api.post(`${BASE_URL}/cycles`, data),
  updateCycle: (id: string, data: Partial<AppraisalCycle>) => api.put(`${BASE_URL}/cycles/${id}`, data),
  deleteCycle: (id: string) => api.delete(`${BASE_URL}/cycles/${id}`),

  // Goals / KRAs
  getGoals: () => api.get(`${BASE_URL}/goals`),
  getGoalById: (id: string) => api.get(`${BASE_URL}/goals/${id}`),
  createGoal: (data: any) => api.post(`${BASE_URL}/goals`, data),
  updateGoal: (id: string, data: any) => api.put(`${BASE_URL}/goals/${id}`, data),
  deleteGoal: (id: string) => api.delete(`${BASE_URL}/goals/${id}`),

  // Reviews
  getSelfReviews: () => api.get(`${BASE_URL}/reviews/self`),
  getSelfReviewById: (id: string) => api.get(`${BASE_URL}/reviews/self/${id}`),
  createSelfReview: (data: any, submit: boolean = false) => api.post(`${BASE_URL}/reviews/self?submit=${submit}`, data),
  updateSelfReview: (id: string, data: any, submit: boolean = false) => api.put(`${BASE_URL}/reviews/self/${id}?submit=${submit}`, data),

  getManagerReviews: () => api.get(`${BASE_URL}/reviews/manager`),
  getManagerReviewById: (id: string) => api.get(`${BASE_URL}/reviews/manager/${id}`),
  updateManagerReview: (id: string, data: any, submit: boolean = false) => api.put(`${BASE_URL}/reviews/manager/${id}?submit=${submit}`, data),

  // Calibration
  getCalibrationRecords: () => api.get(`${BASE_URL}/calibration`),
  getCalibrationByCycle: (cycleId: string) => api.get(`${BASE_URL}/calibration/cycle/${cycleId}`),
  updateCalibration: (id: string, data: any) => api.put(`${BASE_URL}/calibration/${id}`, data),
  finalizeCalibration: (id: string) => api.post(`${BASE_URL}/calibration/${id}/finalize`),

  // Dashboard & Reports
  getDashboardKPIs: () => api.get(`${BASE_URL}/dashboard/kpis`),
  getDepartmentRatings: (cycleId?: string) => {
    const params = cycleId ? `?cycleId=${cycleId}` : '';
    return api.get(`${BASE_URL}/reports/department-ratings${params}`);
  },
  getPromotionRecommendations: (cycleId?: string) => {
    const params = cycleId ? `?cycleId=${cycleId}` : '';
    return api.get(`${BASE_URL}/reports/promotions${params}`);
  }
};
