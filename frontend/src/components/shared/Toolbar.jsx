export default function Toolbar({ onAddModule, onAutoLayout, onShowReport }) {
  return (
    <div className="toolbar">
      <button type="button" onClick={onAddModule}>+ Módulo</button>
      <button type="button" onClick={onAutoLayout}>Auto-organizar (árbol)</button>
      <button type="button" onClick={onShowReport}>Reporte de calidad</button>
    </div>
  );
}
