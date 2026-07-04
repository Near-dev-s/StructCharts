import { useCallback, useEffect, useState } from "react";
import { listModules } from "../api/modules";
import { listConnections } from "../api/connections";

export function useProjectData(projectId) {
  const [modules, setModules] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [modulesData, connectionsData] = await Promise.all([
        listModules(projectId),
        listConnections(projectId),
      ]);
      setModules(modulesData);
      setConnections(connectionsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { modules, connections, loading, error, reload };
}
