import { useState, useMemo } from "react";

// Sample structural model — categories → types → instances, in the spirit of
// Revit's Snowdon Towers sample. Quantities are metric: length m, area m², volume m³.
const LEVELS = ["Foundation", "Level 1", "Level 2", "Level 3", "Level 4", "Roof"];

// Deterministic pseudo-random so the sample model is stable between sessions.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildInstances(seed, perLevel, base) {
  const rand = seeded(seed);
  const instances = [];
  let id = 1;
  LEVELS.forEach((level, li) => {
    const n = perLevel[li] || 0;
    for (let i = 0; i < n; i++) {
      const f = 0.85 + rand() * 0.3;
      instances.push({
        id: `${seed}-${id++}`,
        level,
        length: base.length * f,
        area: base.area * f,
        volume: base.volume * f,
      });
    }
  });
  return instances;
}

const MODEL = [
  {
    category: "Structural Columns",
    types: [
      { name: "Concrete 300 x 600mm", instances: buildInstances(11, [0, 8, 8, 8, 8, 0], { length: 3.4, area: 6.1, volume: 0.61 }) },
      { name: "Concrete 400 x 400mm", instances: buildInstances(12, [0, 6, 6, 6, 4, 0], { length: 3.4, area: 5.4, volume: 0.54 }) },
      { name: "Concrete 600 x 600mm", instances: buildInstances(13, [4, 4, 2, 0, 0, 0], { length: 3.4, area: 8.2, volume: 1.22 }) },
      { name: "Concrete Round 450mm", instances: buildInstances(14, [0, 3, 3, 3, 3, 0], { length: 3.4, area: 4.8, volume: 0.54 }) },
    ],
  },
  {
    category: "Structural Framing",
    types: [
      { name: "Concrete Beam 250 x 500mm", instances: buildInstances(21, [0, 14, 14, 14, 12, 6], { length: 6.2, area: 9.3, volume: 0.78 }) },
      { name: "Concrete Beam 300 x 600mm", instances: buildInstances(22, [0, 8, 8, 8, 8, 4], { length: 7.4, area: 13.3, volume: 1.33 }) },
      { name: "Steel UB 406 x 178 x 54", instances: buildInstances(23, [0, 0, 0, 0, 6, 8], { length: 8.1, area: 11.5, volume: 0.06 }) },
    ],
  },
  {
    category: "Structural Foundations",
    types: [
      { name: "Isolated Footing 2000 x 2000", instances: buildInstances(31, [12, 0, 0, 0, 0, 0], { length: 2.0, area: 4.0, volume: 2.4 }) },
      { name: "Strip Footing 600mm", instances: buildInstances(32, [8, 0, 0, 0, 0, 0], { length: 9.5, area: 5.7, volume: 1.71 }) },
      { name: "Raft Slab 500mm", instances: buildInstances(33, [1, 0, 0, 0, 0, 0], { length: 24.0, area: 460.0, volume: 230.0 }) },
    ],
  },
  {
    category: "Walls",
    types: [
      { name: 'Concrete 10"', instances: buildInstances(41, [4, 6, 6, 6, 6, 2], { length: 10.0, area: 48.0, volume: 21.9 }) },
      { name: 'Concrete 12"', instances: buildInstances(42, [4, 4, 4, 4, 4, 0], { length: 8.2, area: 39.4, volume: 12.0 }) },
      { name: 'Concrete 18"', instances: buildInstances(43, [2, 2, 2, 0, 0, 0], { length: 6.4, area: 30.7, volume: 14.0 }) },
      { name: 'Concrete 24" x 14', instances: buildInstances(44, [2, 1, 1, 0, 0, 0], { length: 5.1, area: 24.5, volume: 14.9 }) },
      { name: "Masonry Block 200mm", instances: buildInstances(45, [0, 10, 10, 10, 8, 0], { length: 7.5, area: 25.5, volume: 5.1 }) },
    ],
  },
  {
    category: "Floors",
    types: [
      { name: "Concrete Slab 200mm", instances: buildInstances(51, [0, 4, 4, 4, 4, 0], { length: 18.0, area: 210.0, volume: 42.0 }) },
      { name: "Concrete Slab 250mm", instances: buildInstances(52, [0, 2, 2, 2, 2, 2], { length: 15.0, area: 160.0, volume: 40.0 }) },
    ],
  },
];

const QUANTITY_FIELDS = [
  { key: "count", label: "Count" },
  { key: "length", label: "Length" },
  { key: "area", label: "Area" },
  { key: "volume", label: "Volume" },
];

const UNIT = { length: "m", area: "m²", volume: "m³" };

function typeKey(category, name) {
  return `${category}::${name}`;
}

function sumInstances(instances) {
  return instances.reduce(
    (acc, i) => ({ length: acc.length + i.length, area: acc.area + i.area, volume: acc.volume + i.volume }),
    { length: 0, area: 0, volume: 0 }
  );
}

function csvEscape(v) {
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows, filename) {
  const content = rows.map(r => r.map(csvEscape).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  a.download = filename;
  a.click();
}

const checkboxStyle = { accentColor: "#1a1a14", cursor: "pointer" };
const labelStyle = { fontSize: "12px", color: "#4a4a3a", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" };
const sectionTitle = { fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" };

export default function BOQExporter() {
  const [activeCategory, setActiveCategory] = useState("Walls");
  const [flags, setFlags] = useState({}); // typeKey -> { export, itemize, qaqc }
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState(null); // { category, type }
  const [tab, setTab] = useState("BOQ");
  const [quantities, setQuantities] = useState({ count: true, length: false, area: false, volume: true });
  const [byLevel, setByLevel] = useState(false);
  const [itemizeAll, setItemizeAll] = useState(false);
  const [decimals, setDecimals] = useState(2);
  const [exported, setExported] = useState(null);

  const fmt = (n) => n.toFixed(decimals);

  const category = MODEL.find(c => c.category === activeCategory);
  const visibleTypes = useMemo(() => {
    const q = search.toLowerCase();
    return category.types.filter(t => !q || t.name.toLowerCase().includes(q));
  }, [category, search]);

  const getFlags = (cat, name) => flags[typeKey(cat, name)] || { export: false, itemize: false, qaqc: false };
  const setFlag = (cat, name, field, value) => {
    const key = typeKey(cat, name);
    setFlags(f => ({ ...f, [key]: { ...getFlags(cat, name), [field]: value } }));
  };

  const allVisibleExported = visibleTypes.length > 0 && visibleTypes.every(t => getFlags(activeCategory, t.name).export);
  const toggleSelectAll = () => {
    setFlags(f => {
      const next = { ...f };
      visibleTypes.forEach(t => {
        const key = typeKey(activeCategory, t.name);
        next[key] = { ...(next[key] || { itemize: false, qaqc: false }), export: !allVisibleExported };
      });
      return next;
    });
  };

  // Every type across all categories marked for export, with its category attached
  const exportSelection = useMemo(() => {
    const rows = [];
    MODEL.forEach(c => c.types.forEach(t => {
      const f = flags[typeKey(c.category, t.name)];
      if (f?.export) rows.push({ category: c.category, type: t, flags: f });
    }));
    return rows;
  }, [flags]);

  const buildBoqRows = () => {
    const cols = ["Category", "Type Name"];
    if (byLevel) cols.push("Level");
    QUANTITY_FIELDS.forEach(({ key, label }) => {
      if (quantities[key]) cols.push(key === "count" ? label : `${label} (${UNIT[key]})`);
    });
    const rows = [cols];

    exportSelection.forEach(({ category: cat, type, flags: f }) => {
      const groups = byLevel
        ? LEVELS.map(l => ({ level: l, instances: type.instances.filter(i => i.level === l) })).filter(g => g.instances.length)
        : [{ level: null, instances: type.instances }];

      groups.forEach(g => {
        if (itemizeAll || f.itemize) {
          g.instances.forEach(inst => {
            const row = [cat, `${type.name} [${inst.id}]`];
            if (byLevel) row.push(g.level);
            QUANTITY_FIELDS.forEach(({ key }) => {
              if (!quantities[key]) return;
              row.push(key === "count" ? 1 : fmt(inst[key]));
            });
            rows.push(row);
          });
        } else {
          const totals = sumInstances(g.instances);
          const row = [cat, type.name];
          if (byLevel) row.push(g.level);
          QUANTITY_FIELDS.forEach(({ key }) => {
            if (!quantities[key]) return;
            row.push(key === "count" ? g.instances.length : fmt(totals[key]));
          });
          rows.push(row);
        }
      });
    });
    return rows;
  };

  const buildQaqcRows = () => {
    const rows = [["Category", "Type Name", "Instances", "Zero-Volume Instances", "Volume Outliers (±25% of type mean)", "Status"]];
    MODEL.forEach(c => c.types.forEach(t => {
      const f = flags[typeKey(c.category, t.name)];
      if (!f?.qaqc) return;
      const zero = t.instances.filter(i => i.volume <= 0).length;
      const mean = sumInstances(t.instances).volume / t.instances.length;
      const outliers = t.instances.filter(i => Math.abs(i.volume - mean) / mean > 0.25).length;
      rows.push([c.category, t.name, t.instances.length, zero, outliers, zero || outliers ? "REVIEW" : "PASS"]);
    }));
    return rows;
  };

  const handleExport = () => {
    const isBoq = tab === "BOQ";
    const rows = isBoq ? buildBoqRows() : buildQaqcRows();
    if (rows.length <= 1) {
      setExported(`No types marked for ${isBoq ? "Export" : "QA-QC"} yet — tick them in the table first.`);
      return;
    }
    const stamp = new Date().toISOString().slice(0, 10);
    downloadCsv(rows, `${isBoq ? "BOQ" : "QAQC"}_Export_${stamp}.csv`);
    setExported(`${rows.length - 1} row${rows.length !== 2 ? "s" : ""} exported to CSV.`);
    setTimeout(() => setExported(null), 4000);
  };

  const preview = selectedType
    ? sumInstances(MODEL.find(c => c.category === selectedType.category).types.find(t => t.name === selectedType.type).instances)
    : null;
  const previewCount = selectedType
    ? MODEL.find(c => c.category === selectedType.category).types.find(t => t.name === selectedType.type).instances.length
    : 0;

  const boqPreviewRows = tab === "BOQ" ? buildBoqRows() : buildQaqcRows();

  return (
    <div style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", background: "#f5f0e8", minHeight: "100vh", color: "#1a1a14" }}>
      <div style={{ padding: "40px 40px 28px", borderBottom: "1px solid #ddd8cc", background: "linear-gradient(180deg, #ede8e0 0%, #f5f0e8 100%)" }}>
        <h1 style={{ margin: "0 0 6px", fontSize: "32px", fontWeight: "400", letterSpacing: "-1px" }}>Data Exporter</h1>
        <p style={{ margin: 0, fontSize: "13px", color: "#8a8a7a" }}>BOQ and QA-QC export · sample structural model · {LEVELS.length} levels</p>
      </div>

      <div style={{ display: "flex", alignItems: "stretch", gap: "1px", background: "#ddd8cc", borderBottom: "1px solid #ddd8cc" }}>
        {/* Model categories */}
        <div style={{ width: "230px", flexShrink: 0, background: "#fff", padding: "20px 0" }}>
          <div style={{ ...sectionTitle, padding: "0 20px" }}>Model Category</div>
          {MODEL.map(c => (
            <button key={c.category} onClick={() => { setActiveCategory(c.category); setSearch(""); }}
              style={{ display: "flex", justifyContent: "space-between", width: "100%", padding: "9px 20px", background: activeCategory === c.category ? "#1a1a14" : "transparent", color: activeCategory === c.category ? "#f5f0e8" : "#4a4a3a", border: "none", fontSize: "12px", fontFamily: "inherit", cursor: "pointer", textAlign: "left" }}>
              <span>{c.category}</span>
              <span style={{ color: activeCategory === c.category ? "#8a8a7a" : "#aaa8a0", fontSize: "11px" }}>{c.types.reduce((n, t) => n + t.instances.length, 0)}</span>
            </button>
          ))}
        </div>

        {/* Type table */}
        <div style={{ flex: 1, background: "#fff", padding: "20px 24px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
            <label style={labelStyle}>
              <input type="checkbox" checked={allVisibleExported} onChange={toggleSelectAll} style={checkboxStyle} /> Select all
            </label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter types..." style={{ flex: 1, maxWidth: "280px", padding: "7px 12px", border: "1px solid #ccc8bc", fontSize: "12px", fontFamily: "inherit", outline: "none" }} />
            <span style={{ fontSize: "11px", color: "#aaa8a0", marginLeft: "auto" }}>Types: {visibleTypes.length}</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #ddd8cc" }}>
                {["Export", "Type Name", "Count", "Itemize", "QA-QC"].map(h => (
                  <th key={h} style={{ textAlign: h === "Type Name" ? "left" : "center", padding: "8px 6px", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", fontWeight: "400" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleTypes.map(t => {
                const f = getFlags(activeCategory, t.name);
                const isSelected = selectedType?.category === activeCategory && selectedType?.type === t.name;
                return (
                  <tr key={t.name} onClick={() => setSelectedType({ category: activeCategory, type: t.name })}
                    style={{ borderBottom: "1px solid #eee8e0", cursor: "pointer", background: isSelected ? "#f5f0e8" : "transparent" }}>
                    <td style={{ textAlign: "center", padding: "9px 6px" }}>
                      <input type="checkbox" checked={f.export} onClick={e => e.stopPropagation()} onChange={e => setFlag(activeCategory, t.name, "export", e.target.checked)} style={checkboxStyle} />
                    </td>
                    <td style={{ padding: "9px 6px" }}>{t.name}</td>
                    <td style={{ textAlign: "center", padding: "9px 6px", color: "#8a8a7a" }}>{t.instances.length}</td>
                    <td style={{ textAlign: "center", padding: "9px 6px" }}>
                      <input type="checkbox" checked={f.itemize} onClick={e => e.stopPropagation()} onChange={e => setFlag(activeCategory, t.name, "itemize", e.target.checked)} style={checkboxStyle} />
                    </td>
                    <td style={{ textAlign: "center", padding: "9px 6px" }}>
                      <input type="checkbox" checked={f.qaqc} onClick={e => e.stopPropagation()} onChange={e => setFlag(activeCategory, t.name, "qaqc", e.target.checked)} style={checkboxStyle} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Export options */}
        <div style={{ width: "310px", flexShrink: 0, background: "#fff", padding: "20px 24px" }}>
          <div style={sectionTitle}>Export Options</div>
          <div style={{ display: "flex", marginBottom: "16px" }}>
            {["BOQ", "QA-QC"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "7px 0", background: tab === t ? "#1a1a14" : "transparent", color: tab === t ? "#f5f0e8" : "#8a8a7a", border: "1px solid #ccc8bc", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginLeft: "-1px" }}>{t}</button>
            ))}
          </div>

          {tab === "BOQ" ? (
            <>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", marginBottom: "14px" }}>
                {QUANTITY_FIELDS.map(({ key, label }) => (
                  <label key={key} style={labelStyle}>
                    <input type="checkbox" checked={quantities[key]} onChange={e => setQuantities(q => ({ ...q, [key]: e.target.checked }))} style={checkboxStyle} /> {label}
                  </label>
                ))}
              </div>
              <label style={{ ...labelStyle, marginBottom: "8px" }}>
                <input type="checkbox" checked={byLevel} onChange={e => setByLevel(e.target.checked)} style={checkboxStyle} /> Breakdown aggregated BOQ by Level
              </label>
              <label style={{ ...labelStyle, marginBottom: "18px" }}>
                <input type="checkbox" checked={itemizeAll} onChange={e => setItemizeAll(e.target.checked)} style={checkboxStyle} /> Itemize instances for all selected types
              </label>
              <div style={sectionTitle}>CSV Options</div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <span style={{ fontSize: "12px", color: "#4a4a3a" }}>Decimal places</span>
                <select value={decimals} onChange={e => setDecimals(Number(e.target.value))} style={{ padding: "5px 10px", border: "1px solid #ccc8bc", fontSize: "12px", fontFamily: "inherit", background: "#fff" }}>
                  {[0, 1, 2, 3].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </>
          ) : (
            <p style={{ fontSize: "12px", color: "#8a8a7a", lineHeight: "1.7", marginBottom: "20px" }}>
              Exports a QA-QC report for every type ticked in the QA-QC column: instance counts, zero-volume elements, and volume outliers beyond ±25% of the type mean.
            </p>
          )}

          <div style={sectionTitle}>Preview / Geometry (selected item)</div>
          {preview ? (
            <div style={{ border: "1px solid #eee8e0", padding: "12px 14px", marginBottom: "20px" }}>
              <div style={{ fontSize: "12px", marginBottom: "8px" }}>{selectedType.type} <span style={{ color: "#aaa8a0" }}>· {previewCount} instances</span></div>
              {[["Length", preview.length, "m"], ["Area", preview.area, "m²"], ["Volume", preview.volume, "m³"]].map(([l, v, u]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#4a4a3a", marginBottom: "4px" }}>
                  <span>{l}</span><span>{fmt(v)} {u}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "11px", color: "#aaa8a0", marginBottom: "20px" }}>Click a type row to preview its aggregated geometry.</div>
          )}

          <button onClick={handleExport} style={{ width: "100%", padding: "12px 0", background: "#1a1a14", color: "#f5f0e8", border: "none", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit" }}>
            Export {tab} CSV
          </button>
          {exported && <div style={{ fontSize: "11px", color: "#4a8a6a", marginTop: "10px" }}>{exported}</div>}
        </div>
      </div>

      {/* Live preview of the CSV that Export will produce */}
      <div style={{ padding: "28px 40px 60px" }}>
        <div style={sectionTitle}>{tab} Export Preview · {Math.max(boqPreviewRows.length - 1, 0)} rows</div>
        {boqPreviewRows.length <= 1 ? (
          <div style={{ fontSize: "12px", color: "#aaa8a0", padding: "30px 0" }}>
            Tick the {tab === "BOQ" ? "Export" : "QA-QC"} column for one or more types to build the {tab} table.
          </div>
        ) : (
          <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #ddd8cc" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #ddd8cc" }}>
                  {boqPreviewRows[0].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa", fontWeight: "400", whiteSpace: "nowrap" }}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {boqPreviewRows.slice(1, 201).map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #eee8e0" }}>
                    {r.map((c, j) => <td key={j} style={{ padding: "8px 14px", color: j < 2 ? "#1a1a14" : "#4a4a3a", whiteSpace: "nowrap" }}>{c}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
            {boqPreviewRows.length > 201 && <div style={{ padding: "10px 14px", fontSize: "11px", color: "#aaa8a0" }}>Preview truncated at 200 rows — full table included in the CSV.</div>}
          </div>
        )}
      </div>
    </div>
  );
}
