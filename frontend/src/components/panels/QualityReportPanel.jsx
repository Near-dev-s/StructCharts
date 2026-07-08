import { useEffect, useState } from "react";
import { getQualityReport } from "../../api/reports";
import { buildReportText, downloadTextFile } from "../../utils/exportReportText";

const COUPLING_ROW_LABELS = {
  DATA: "Acoplamiento de datos",
  STAMP: "Acoplamiento de sello",
  CONTROL: "Acoplamiento de control",
  sinClasificar: "Sin clasificar",
};

export default function QualityReportPanel({ projectId, onClose }) {
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getQualityReport(projectId)
      .then(setReport)
      .catch((err) => setError(err.message));
  }, [projectId]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <h3>Reporte de calidad del diseño</h3>
          <div className="panel-actions">
            {report && (
              <button
                type="button"
                onClick={() => {
                  const fileName = `${report.project.name.replace(/[^\w\-]+/g, "_")}_reporte.txt`;
                  downloadTextFile(buildReportText(report), fileName);
                }}
              >
                Exportar texto
              </button>
            )}
            <button type="button" onClick={onClose}>✕</button>
          </div>
        </div>

        {error && <p className="error">{error}</p>}
        {!report && !error && <p>Generando reporte...</p>}

        {report && (
          <>
            <p className="module-metrics">
              Proyecto: <strong>{report.project.name}</strong>
            </p>

            <div className="report-summary">
              <div>
                <strong>{report.summary.totalModules}</strong>
                <span>módulos</span>
              </div>
              <div>
                <strong>{report.summary.totalConnections}</strong>
                <span>conexiones</span>
              </div>
              <div>
                <strong>{report.summary.modulesWithUndesirableCoupling}</strong>
                <span>módulos con acoplamiento no deseable</span>
              </div>
              <div>
                <strong>{report.summary.averageFanOut}</strong>
                <span>fan-out promedio</span>
              </div>
              <div>
                <strong>
                  {report.summary.maxFanOut} ({report.summary.moduleWithMaxFanOut || "—"})
                </strong>
                <span>fan-out máximo</span>
              </div>
            </div>

            <table className="report-coupling-table">
              <tbody>
                {Object.entries(report.summary.couplingCounts).map(([key, count]) => (
                  <tr key={key}>
                    <td>{COUPLING_ROW_LABELS[key]}</td>
                    <td>{count}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4>Observaciones por módulo</h4>
            <ul className="report-module-list">
              {report.modules.map((m) => (
                <li key={m.id} className={m.hasUndesirableCoupling ? "report-module-flagged" : undefined}>
                  <div className="report-module-header">
                    <strong>{m.name}</strong>
                    <span>fan-out: {m.fanOut}</span>
                  </div>
                  <ul>
                    {m.observations.map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
