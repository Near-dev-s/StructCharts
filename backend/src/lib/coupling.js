// Clasifica el acoplamiento de una conexión según la naturaleza de los datos
// que intercambia (requisito 5). Si conviven varias naturalezas en la misma
// conexión, gana la más indeseable: control > sello (estructura) > datos.
const COUPLING_LABELS = {
  CONTROL: "Acoplamiento de control",
  STAMP: "Acoplamiento de sello",
  DATA: "Acoplamiento de datos",
};

// Versión corta para espacios reducidos, como la etiqueta de una conexión
// en el diagrama (el detalle completo se ve en el panel lateral).
const COUPLING_SHORT_LABELS = {
  CONTROL: "Control",
  STAMP: "Sello",
  DATA: "Datos",
};

const UNDESIRABLE_COUPLINGS = new Set(["CONTROL", "STAMP"]);

function classifyCoupling(dataItems) {
  if (!dataItems || dataItems.length === 0) return null;

  if (dataItems.some((item) => item.nature === "CONTROL_FLAG")) return "CONTROL";
  if (dataItems.some((item) => item.nature === "STRUCTURE")) return "STAMP";
  return "DATA";
}

function couplingLabel(couplingType) {
  return couplingType ? COUPLING_LABELS[couplingType] : null;
}

function couplingShortLabel(couplingType) {
  return couplingType ? COUPLING_SHORT_LABELS[couplingType] : null;
}

function isUndesirableCoupling(couplingType) {
  return UNDESIRABLE_COUPLINGS.has(couplingType);
}

module.exports = { classifyCoupling, couplingLabel, couplingShortLabel, isUndesirableCoupling };
