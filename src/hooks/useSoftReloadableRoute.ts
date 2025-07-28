import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * Returns a key that forces React to remount the component
 * if the `?refresh=...` query is present.
 * Also strips the query string after mount.
 */
export function useSoftReloadableRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  const key = location.pathname + location.search;

  useEffect(() => {
    if (location.search.includes("refresh")) {
      navigate(location.pathname, { replace: true }); // clean up URL
    }
  }, [location.search, location.pathname, navigate]);

  return key;
}
