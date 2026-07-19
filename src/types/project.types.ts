export interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  linkedQuotation?: string;
  client?: string;
  assignedVendors?: string[];
  projectManager?: string;
  startDate?: string;
  expectedEndDate?: string;
  expectedRevenue?: number;
  description?: string;
  status: string;
}

export interface ProjectFormValues {
  projectCode: string;
  projectName: string;
  linkedQuotation?: string;
  client?: string;
  assignedVendors?: string[];
  projectManager?: string;
  startDate?: string;
  expectedEndDate?: string;
  description?: string;
  status: string;
}
