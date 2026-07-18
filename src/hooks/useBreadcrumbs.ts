import { useEffect } from 'react';
import { useBreadcrumbContext, BreadcrumbItem } from '../contexts/BreadcrumbContext';

export function useBreadcrumbs(items: BreadcrumbItem[]) {
  const { setBreadcrumbs } = useBreadcrumbContext();

  useEffect(() => {
    setBreadcrumbs(items);
    
    // Clear breadcrumbs on unmount
    return () => {
      setBreadcrumbs([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(items), setBreadcrumbs]);
}
