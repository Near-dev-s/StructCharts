const COUPLING_ROW_LABELS = {
  DATA: "Acoplamiento de datos",
  STAMP: "Acoplamiento de sello",
  CONTROL: "Acoplamiento de control",
  sinClasificar: "Sin clasificar",
};

function line(char = "-", length = 60) {
  return char.repeat(length);
}

// Arma el reporte de calidad como texto plano estructurado (requisito 10):
// mismas secciones que el panel (resumen + observaciones por módulo), en un
// formato legible fuera de la aplicación.
export function buildReportText(report) {
  const { project, generatedAt, summary, modules } = report;
  const rows = [];

  rows.push("REPORTE DE CALIDAD DE DISEÑO — STRUCTCHART");
  rows.push(line("="));
  rows.push(`Proyecto: ${project.name}`);
  rows.push(`Generado: ${new Date(generatedAt).toLocaleString("es")}`);
  rows.push("");

  rows.push("RESUMEN");
  rows.push(line());
  rows.push(`Módulos: ${summary.totalModules}`);
  rows.push(`Conexiones: ${summary.totalConnections}`);
  rows.push(`Módulos con acoplamiento no deseable: ${summary.modulesWithUndesirableCoupling}`);
  rows.push(`Fan-out promedio: ${summary.averageFanOut}`);
  rows.push(`Fan-out máximo: ${summary.maxFanOut} (${summary.moduleWithMaxFanOut || "—"})`);
  rows.push("");
  for (const [key, count] of Object.entries(summary.couplingCounts)) {
    rows.push(`  ${COUPLING_ROW_LABELS[key]}: ${count}`);
  }
  rows.push("");

  rows.push("OBSERVACIONES POR MÓDULO");
  rows.push(line());
  for (const m of modules) {
    rows.push("");
    rows.push(`[${m.name}] (${m.type === "CONTROL" ? "Control" : "Subordinado"}, fan-out: ${m.fanOut})`);
    for (const obs of m.observations) {
      rows.push(`  - ${obs}`);
    }
  }

  return rows.join("\n");
}

export function downloadTextFile(text, fileName) {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = fileName;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
