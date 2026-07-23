import { useState, useEffect } from 'react';
import { ProjectService } from '../services/project.service';
import type { Project } from '../types/project.types';
import { useAuth } from '../contexts/AuthContext';

export function useProjects() {
  const { selectedCompanyId } = useAuth();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchProjects() {
      if (!selectedCompanyId) {
        setProjects([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const data = await ProjectService.getAll(selectedCompanyId);
        
        if (isMounted) {
          const sortedData = data.sort((a, b) => {
            const idA = a.projectCode || a.projectName || a.id;
            const idB = b.projectCode || b.projectName || b.id;
            return idB.localeCompare(idA); // Descending
          });
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
