import { useState } from "react";
import NArchRef from './NAref';
import BOQExporter from './BOQExporter';

const VIEWS = [
  { id: "library", label: "Reference Library" },
  { id: "boq", label: "BOQ Exporter" },
];

export default function App() {
  const [view, setView] = useState("library");
  return (
    <div>
      <div style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", background: "#11110c", padding: "0 40px", display: "flex", gap: "0", height: "40px", alignItems: "stretch" }}>
        {VIEWS.map(v => (
          <button key={v.id} onClick={() => setView(v.id)}
            style={{ padding: "0 20px", background: "transparent", color: view === v.id ? "#f5f0e8" : "#5a5a4a", border: "none", borderBottom: view === v.id ? "2px solid #c8a030" : "2px solid transparent", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            {v.label}
          </button>
        ))}
      </div>
      {view === "library" ? <NArchRef /> : <BOQExporter />}
    </div>
  );
}
