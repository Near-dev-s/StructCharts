const { classifyCoupling, couplingLabel, isUndesirableCoupling } = require("./coupling");

// Umbral clásico de diseño estructurado: un módulo que llama a más de ~7
// subordinados suele indicar que concentra demasiadas responsabilidades.
const HIGH_FAN_OUT_THRESHOLD = 7;

function buildQualityReport(modules, connections) {
  const byModuleId = new Map(modules.map((m) => [m.id, { outgoing: [], incoming: [] }]));

  const classifiedConnections = connections.map((c) => {
    const couplingType = classifyCoupling(c.dataItems);
    return { ...c, couplingType, couplingLabel: couplingLabel(couplingType) };
  });

  for (const c of classifiedConnections) {
    byModuleId.get(c.fromModuleId)?.outgoing.push(c);
    byModuleId.get(c.toModuleId)?.incoming.push(c);
  }

  const moduleReports = modules.map((m) => {
    const { outgoing, incoming } = byModuleId.get(m.id);
    const fanOut = outgoing.length;
    const observations = [];

    if (m.type === "CONTROL" && fanOut === 0) {
      observations.push(
        "Es un módulo de control pero no llama a ningún módulo subordinado: revisar si faltan conexiones por modelar."
      );
    }

    if (fanOut > HIGH_FAN_OUT_THRESHOLD) {
      observations.push(
        `Fan-out de ${fanOut}: por encima del rango recomendado (hasta ${HIGH_FAN_OUT_THRESHOLD}). Considerar introducir un nivel intermedio de control.`
      );
    }

    for (const c of outgoing) {
      if (isUndesirableCoupling(c.couplingType)) {
        observations.push(`Conexión saliente hacia "${c.toModule.name}": ${c.couplingLabel.toLowerCase()}.`);
      }
    }
    for (const c of incoming) {
      if (isUndesirableCoupling(c.couplingType)) {
        observations.push(`Conexión entrante desde "${c.fromModule.name}": ${c.couplingLabel.toLowerCase()}.`);
      }
    }

    const hasUndesirableCoupling = [...outgoing, ...incoming].some((c) => isUndesirableCoupling(c.couplingType));

    if (observations.length === 0) {
      observations.push("Sin observaciones: acoplamiento de datos y fan-out dentro de rangos razonables.");
    }

    return {
      id: m.id,
      name: m.name,
      type: m.type,
      fanOut,
      hasUndesirableCoupling,
      observations,
    };
  });

  const couplingCounts = { DATA: 0, STAMP: 0, CONTROL: 0, sinClasificar: 0 };
  for (const c of classifiedConnections) {
    if (c.couplingType) couplingCounts[c.couplingType] += 1;
    else couplingCounts.sinClasificar += 1;
  }

  const fanOuts = moduleReports.map((m) => m.fanOut);
  const totalFanOut = fanOuts.reduce((sum, n) => sum + n, 0);
  const maxFanOut = fanOuts.length ? Math.max(...fanOuts) : 0;
  const moduleWithMaxFanOut = moduleReports.find((m) => m.fanOut === maxFanOut) || null;

  const summary = {
    totalModules: modules.length,
    totalConnections: connections.length,
    couplingCounts,
    modulesWithUndesirableCoupling: moduleReports.filter((m) => m.hasUndesirableCoupling).length,
    averageFanOut: modules.length ? Math.round((totalFanOut / modules.length) * 100) / 100 : 0,
    maxFanOut,
    moduleWithMaxFanOut: moduleWithMaxFanOut ? moduleWithMaxFanOut.name : null,
  };

  return { summary, modules: moduleReports };
}

module.exports = { buildQualityReport };
