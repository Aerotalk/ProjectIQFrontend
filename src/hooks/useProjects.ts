import { useState, useEffect } from 'react';
import { ProjectService } from '../services/project.service';
import type { Project } from '../types/project.types';
import { useAuth } from '../contexts/AuthContext';

const projectCache: Record<string, Project[]> = {};
const projectPromises: Record<string, Promise<Project[]>> = {};

export const invalidateProjectsCache = (companyId: string) => {
  delete projectCache[companyId];
};

export function useProjects() {
  const { selectedCompanyId } = useAuth();
  
  const [projects, setProjects] = useState<Project[]>(() => 
    selectedCompanyId && projectCache[selectedCompanyId] ? projectCache[selectedCompanyId] : []
  );
  
  const [loading, setLoading] = useState(() => 
    selectedCompanyId ? !projectCache[selectedCompanyId] : false
  );
  
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      if (!selectedCompanyId) {
        setProjects([]);
        setLoading(false);
        return;
      }

      if (projectCache[selectedCompanyId]) {
        setProjects(projectCache[selectedCompanyId]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        if (!projectPromises[selectedCompanyId]) {
          projectPromises[selectedCompanyId] = ProjectService.getAll(selectedCompanyId).then(data => {
            const sortedData = data.sort((a, b) => {
              const idA = a.projectCode || a.projectName || a.id;
              const idB = b.projectCode || b.projectName || b.id;
              return idB.localeCompare(idA); // Descending
            });
            projectCache[selectedCompanyId] = sortedData;
            return sortedData;
          }).finally(() => {
            delete projectPromises[selectedCompanyId];
          });
        }

        const sortedData = await projectPromises[selectedCompanyId];
        
        if (isMounted) {
          setProjects(sortedData);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [selectedCompanyId]);

  return { projects, loading, error };
}
