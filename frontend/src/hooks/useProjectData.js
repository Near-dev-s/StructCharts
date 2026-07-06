import { useCallback, useEffect, useRef, useState } from "react";
import { listModules } from "../api/modules";
import { listConnections } from "../api/connections";

export function useProjectData(projectId) {
  const [modules, setModules] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const loadedOnceRef = useRef(false);

  // Solo la carga inicial (o el cambio de proyecto) debe mostrar el estado
  // "Cargando..." de página completa. Los reload() posteriores a una edición
  // (ej. tipear en un dato intercambiado) deben refrescar en segundo plano,
  // sin desmontar el editor ni robarle el foco al campo que se está editando.
  const reload = useCallback(async () => {
    if (!loadedOnceRef.current) setLoading(true);
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
      loadedOnceRef.current = true;
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadedOnceRef.current = false;
    reload();
  }, [reload]);

  return { modules, connections, loading, error, reload };
}
