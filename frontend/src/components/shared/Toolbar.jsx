export default function Toolbar({ onAddModule, onAutoLayout }) {
  return (
    <div className="toolbar">
      <button type="button" onClick={onAddModule}>+ Módulo</button>
      <button type="button" onClick={onAutoLayout}>Auto-organizar (árbol)</button>
    </div>
  );
}
