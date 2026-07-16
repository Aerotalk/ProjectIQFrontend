export interface Project {
  id: string;
  projectCode: string;
  projectName: string;
  description?: string;
  status: string;
}

export interface ProjectFormValues {
  projectCode: string;
  projectName: string;
  description?: string;
  status: string;
}
