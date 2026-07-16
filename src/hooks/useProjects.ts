import { useState, useEffect } from 'react';
import { ProjectService } from '../services/project.service';
import type { Project } from '../types/project.types';
import { useAuth } from '../contexts/AuthContext';

export function useProjects() {
  const { selectedCompanyId } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      if (!selectedCompanyId) {
        setProjects([]);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await ProjectService.getAll(selectedCompanyId);
        setProjects(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [selectedCompanyId]);

  return { projects, loading, error };
}
