import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Generic hook to manage return navigation context.
 * It checks if `location.state.returnTo` exists and routes there when `navigateBack` is called.
 * Otherwise, it routes to the provided fallback path.
 */
export function useReturnNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const returnPath = location.state?.returnTo;
  
  const navigateBack = (fallbackPath: string) => {
    if (returnPath) {
      navigate(returnPath, { state: { ...location.state } });
    } else {
      navigate(fallbackPath);
    }
  };

  return {
    navigateBack,
    returnPath
  };
}
