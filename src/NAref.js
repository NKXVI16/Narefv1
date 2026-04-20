import { useState, useMemo } from "react";

const PROJECTS = [
  {
    id: 1,
    name: "Quinta Monroy Housing",
    architect: "Elemental (Alejandro Aravena)",
    year: "2004",
    location: "Iquique, Chile",
    typology: "Social Housing",
    style: "Incremental / Contemporary",
    units: "93",
    total_area: "3,500 sqm",
    floors: "2",
    concept: "Each family received half a well-built house — the structurally complex half — with space designed for self-build expansion. The project reframes social housing as an investment framework, not a welfare product.",
    key_design_moves: [
      "Shared party walls reduce construction cost per unit",
      "Structural frame pre-built for future vertical expansion",
      "Dense urban infill maintains city connectivity"
    ],
    materials: ["Reinforced concrete", "Masonry block", "Corrugated metal"],
    site_strategy: "Dense urban plot within existing city fabric, preserving resident proximity to jobs and services rather than relocating to periphery.",
    program: "93 residential units with shared open space and incremental expansion provision",
    awards: "Pritzker Architecture Prize 2016 (Aravena)",
    tags: ["incremental", "social", "latin america", "affordable", "self-build"],
    sources: ["archdaily.com", "plataformaarquitectura.cl", "dezeen.com"],
    image_cover: "https://images.adsttc.com/media/images/5e77/1304/b357/6520/1600/0015/large_jpg/portada_AA175-Quinta-Monroy-ELEMENTAL.jpg",
    image_2: "https://images.adsttc.com/media/images/5e77/12e3/b357/6520/1600/0013/large_jpg/AA175-Quinta-Monroy-ELEMENTAL.jpg",
    image_3: "https://images.adsttc.com/media/images/5e77/1320/b357/6520/1600/0017/large_jpg/AA175-Quinta-Monroy-ELEMENTAL.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 2,
    name: "Tietgen Dormitory",
    architect: "Lundgaard & Tranberg Arkitekter",
    year: "2006",
    location: "Copenhagen, Denmark",
    typology: "Student Housing",
    style: "Contemporary / Circular",
    units: "360",
    total_area: "24,700 sqm",
    floors: "7",
    concept: "A circular building form mediates between the individual and the collective — private rooms face outward to the city while shared kitchens and terraces project inward to a communal courtyard, creating layered social thresholds.",
    key_design_moves: [
      "Circular plan creates strong collective identity",
      "Projecting communal volumes break the ring's regularity",
      "Inward courtyard acts as shared social heart"
    ],
    materials: ["Brick", "Copper", "Concrete", "Timber"],
    site_strategy: "Placed at the edge of a new university district, the circular form creates a landmark while its courtyard provides sheltered semi-public space.",
    program: "360 student rooms, communal kitchens per floor, music rooms, gym, common hall",
    awards: "Nominated Mies van der Rohe Award 2007",
    tags: ["circular", "collective", "student", "nordic", "courtyard"],
    sources: ["archdaily.com", "dezeen.com", "divisare.com"],
    image_cover: "https://images.adsttc.com/media/images/5196/c9f2/b3fc/4b00/0001/0063/large_jpg/stringio.jpg",
    image_2: "https://images.adsttc.com/media/images/5196/ca27/b3fc/4b00/0001/0065/large_jpg/stringio.jpg",
    image_3: "https://images.adsttc.com/media/images/5196/ca4e/b3fc/4b00/0001/0067/large_jpg/stringio.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 3,
    name: "Habitat 67",
    architect: "Moshe Safdie",
    year: "1967",
    location: "Montreal, Canada",
    typology: "Experimental Collective Housing",
    style: "Brutalist / Modular",
    units: "158",
    total_area: "37,161 sqm",
    floors: "12",
    concept: "A utopian vision to combine the qualities of a suburban house — garden, privacy, fresh air — with the density and urban connectivity of an apartment building, achieved through stacking prefabricated concrete modules.",
    key_design_moves: [
      "354 prefabricated concrete boxes assembled in 3D array",
      "Each unit's roof becomes the next unit's garden terrace",
      "Pedestrian streets and bridges thread through the structure"
    ],
    materials: ["Precast concrete", "Steel connections", "Glass"],
    site_strategy: "Built on a pier extending into the St. Lawrence River for Expo 67, creating a dense urban village on the waterfront.",
    program: "158 residential units ranging from 1 to 4 bedrooms, gardens, communal amenities",
    awards: "National Historic Site of Canada 2009",
    tags: ["brutalist", "modular", "prefab", "iconic", "experimental", "terrace"],
    sources: ["archdaily.com", "dezeen.com", "archello.com"],
    image_cover: "https://images.adsttc.com/media/images/5cec/59e6/284d/d1fd/4800/008d/large_jpg/GettyImages-515082046.jpg",
    image_2: "https://images.adsttc.com/media/images/5cec/5a1d/284d/d1fd/4800/0090/large_jpg/GettyImages-182704045.jpg",
    image_3: "https://images.adsttc.com/media/images/5cec/5a4e/284d/d1fd/4800/0092/large_jpg/GettyImages-182698861.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 4,
    name: "8 House",
    architect: "BIG — Bjarke Ingels Group",
    year: "2010",
    location: "Copenhagen, Denmark",
    typology: "Mixed-Use Residential",
    style: "Contemporary / Parametric",
    units: "476",
    total_area: "61,000 sqm",
    floors: "10",
    concept: "Two loops of housing interlock in a figure-eight plan, creating a continuous sloping promenade from street level to the rooftop. The form combines the density of a city block with the intimacy of a townhouse neighbourhood.",
    key_design_moves: [
      "Figure-8 plan creates two distinct courtyard identities",
      "Continuous sloping bike and pedestrian path from ground to roof",
      "Ground floor commercial activates street edges"
    ],
    materials: ["Brick", "Glass", "Steel", "Concrete"],
    site_strategy: "Located in Ørestad, a new district south of Copenhagen, the building creates its own urban scale and internal street life in an otherwise sparse suburban context.",
    program: "476 apartments, penthouses, commercial units, offices at ground level",
    awards: "World Architecture Festival — Best Residential Building 2011",
    tags: ["mixed-use", "figure-eight", "nordic", "BIG", "promenade", "rooftop"],
    sources: ["archdaily.com", "dezeen.com", "big.dk"],
    image_cover: "https://images.adsttc.com/media/images/5226/7c55/e8e4/4e00/0001/00ac/large_jpg/stringio.jpg",
    image_2: "https://images.adsttc.com/media/images/5226/7d6b/e8e4/4e00/0001/00b6/large_jpg/stringio.jpg",
    image_3: "https://images.adsttc.com/media/images/5226/7d1c/e8e4/4e00/0001/00b2/large_jpg/stringio.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 5,
    name: "Monterrey Housing",
    architect: "Elemental (Alejandro Aravena)",
    year: "2010",
    location: "Monterrey, Mexico",
    typology: "Social Housing",
    style: "Incremental / Contemporary",
    units: "70",
    total_area: "Not Available",
    floors: "2",
    concept: "A second application of Elemental's half-a-house strategy adapted to a Mexican context — families occupy one half of a two-storey structure with structural provisions enabling them to complete the other half over time.",
    key_design_moves: [
      "Half-built party wall structure enables self-completion",
      "Open ground floor framing allows flexible future infill",
      "Dense site layout maximises unit count within budget"
    ],
    materials: ["Reinforced concrete", "Masonry", "Steel frame"],
    site_strategy: "Urban infill site within the city, maintaining resident access to existing urban networks and employment.",
    program: "70 incremental residential units with self-build expansion capacity",
    awards: "Not Available",
    tags: ["incremental", "social", "mexico", "affordable", "self-build", "elemental"],
    sources: ["archdaily.com", "plataformaarquitectura.cl"],
    image_cover: "https://images.adsttc.com/media/images/5596/14c9/e58e/ce26/1b00/002e/large_jpg/PORTADA_monterrey.jpg",
    image_2: "https://images.adsttc.com/media/images/5596/14d8/e58e/ce26/1b00/002f/large_jpg/monterrey2.jpg",
    image_3: "https://images.adsttc.com/media/images/5596/14e6/e58e/ce26/1b00/0030/large_jpg/monterrey3.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 6,
    name: "Carabanchel Social Housing",
    architect: "Foreign Office Architects (FOA)",
    year: "2007",
    location: "Madrid, Spain",
    typology: "Social Housing",
    style: "Contemporary / Parametric",
    units: "100",
    total_area: "14,000 sqm",
    floors: "6",
    concept: "A perforated bamboo screen wraps the entire building facade, acting as a climatic filter that provides solar shading and privacy while maintaining ventilation — a low-tech ecological strategy embedded in a high-density urban block.",
    key_design_moves: [
      "Continuous bamboo screen as climatic and aesthetic envelope",
      "Sliding screen panels allow residents to control privacy and light",
      "Courtyard block typology adapted for Mediterranean climate"
    ],
    materials: ["Bamboo", "Concrete", "Glass", "Steel"],
    site_strategy: "Inserted into the Carabanchel social housing development on Madrid's southern periphery, the bamboo facade creates identity within a repetitive urban fabric.",
    program: "100 social housing units with communal courtyard and ground floor amenities",
    awards: "Not Available",
    tags: ["social", "facade", "bamboo", "mediterranean", "FOA", "screen"],
    sources: ["archdaily.com", "dezeen.com", "divisare.com"],
    image_cover: "https://images.adsttc.com/media/images/5026/e9f8/28ba/0d12/1500/00ac/large_jpg/stringio.jpg",
    image_2: "https://images.adsttc.com/media/images/5026/e9e8/28ba/0d12/1500/00aa/large_jpg/stringio.jpg",
    image_3: "https://images.adsttc.com/media/images/5026/e9f0/28ba/0d12/1500/00ab/large_jpg/stringio.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 7,
    name: "Silodam",
    architect: "MVRDV",
    year: "2003",
    location: "Amsterdam, Netherlands",
    typology: "Mixed-Use Residential",
    style: "Contemporary / Colourful",
    units: "157",
    total_area: "17,000 sqm",
    floors: "10",
    concept: "A city within a building — Silodam stacks diverse housing typologies, tenures and sizes in a grid of neighbourhoods, each with its own identity expressed through facade colour and material. The mix replicates urban diversity in a single structure.",
    key_design_moves: [
      "Grid of 'mini neighbourhoods' each with distinct facade treatment",
      "Mixed tenure — social, private, live-work — within one structure",
      "Public walkways and shared decks thread through the building"
    ],
    materials: ["Steel", "Timber", "Glass", "Aluminium cladding"],
    site_strategy: "Cantilevered over the IJ waterway on a former industrial pier, the building reads as a moored vessel and activates Amsterdam's western docklands.",
    program: "157 units across 8 housing typologies, live-work units, communal spaces, commercial",
    awards: "Not Available",
    tags: ["mixed-use", "MVRDV", "waterfront", "colourful", "neighbourhood", "amsterdam"],
    sources: ["archdaily.com", "mvrdv.nl", "dezeen.com"],
    image_cover: "https://images.adsttc.com/media/images/5026/f55e/28ba/0d12/1500/0175/large_jpg/stringio.jpg",
    image_2: "https://images.adsttc.com/media/images/5026/f56a/28ba/0d12/1500/0176/large_jpg/stringio.jpg",
    image_3: "https://images.adsttc.com/media/images/5026/f572/28ba/0d12/1500/0177/large_jpg/stringio.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 8,
    name: "Nakagin Capsule Tower",
    architect: "Kisho Kurokawa",
    year: "1972",
    location: "Tokyo, Japan",
    typology: "Capsule / Experimental Housing",
    style: "Metabolist",
    units: "140",
    total_area: "3,091 sqm",
    floors: "13",
    concept: "The physical embodiment of Japanese Metabolism — replaceable prefabricated capsules plugged onto two concrete service cores, theorising a city of interchangeable parts that could be updated without demolishing the whole.",
    key_design_moves: [
      "140 capsules bolted independently to concrete shafts",
      "Each capsule prefabricated off-site and crane-installed",
      "Design anticipates capsule replacement every 25 years"
    ],
    materials: ["Precast concrete", "Corten steel capsule shells", "Porthole windows"],
    site_strategy: "Located in Shimbashi, Tokyo's salarymen district, the tower served as pied-à-terre units for workers staying in the city during the week.",
    program: "140 single-occupancy capsule units, each 10 sqm with built-in appliances",
    awards: "Demolished 2022 — designated culturally significant prior to demolition",
    tags: ["metabolism", "capsule", "japan", "iconic", "experimental", "prefab", "tokyo"],
    sources: ["archdaily.com", "dezeen.com", "archello.com"],
    image_cover: "https://images.adsttc.com/media/images/628b/2540/c616/3201/650a/3166/large_jpg/nakagin-capsule-tower-kisho-kurokawa-shimbashi-tokyo-japan_3.jpg",
    image_2: "https://images.adsttc.com/media/images/628b/2555/c616/3201/650a/3168/large_jpg/nakagin-capsule-tower-kisho-kurokawa-shimbashi-tokyo-japan_5.jpg",
    image_3: "https://images.adsttc.com/media/images/628b/2564/c616/3201/650a/3169/large_jpg/nakagin-capsule-tower-kisho-kurokawa-shimbashi-tokyo-japan_6.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 9,
    name: "Golden Lane Estate",
    architect: "Chamberlin, Powell and Bon",
    year: "1962",
    location: "London, United Kingdom",
    typology: "Public Housing / Estate",
    style: "Brutalist",
    units: "559",
    total_area: "Not Available",
    floors: "16",
    concept: "A post-war vision of civilised urban living for working people — the estate combines high-rise and low-rise blocks around generously landscaped courts, with elevated walkways creating a pedestrian city above street level.",
    key_design_moves: [
      "Mix of 16-storey tower and lower perimeter blocks",
      "Elevated pedestrian deck links all buildings",
      "Community facilities including pool and sports hall embedded in estate"
    ],
    materials: ["Reinforced concrete", "Brick", "Glass curtain wall"],
    site_strategy: "Built on a blitzed site in the City of London fringe, the estate introduced residential density adjacent to the financial district.",
    program: "559 residential units, community centre, swimming pool, sports facilities, nursery",
    awards: "Grade II* Listed Building",
    tags: ["brutalist", "public housing", "london", "post-war", "listed", "walkways"],
    sources: ["archdaily.com", "e-architect.com", "dezeen.com"],
    image_cover: "https://images.adsttc.com/media/images/5e5e/4f3b/b357/6520/1600/009b/large_jpg/GoldenLane_AW_068.jpg",
    image_2: "https://images.adsttc.com/media/images/5e5e/4f4a/b357/6520/1600/009c/large_jpg/GoldenLane_AW_069.jpg",
    image_3: "https://images.adsttc.com/media/images/5e5e/4f5a/b357/6520/1600/009d/large_jpg/GoldenLane_AW_070.jpg",
    last_updated: "2025-01-10"
  },
  {
    id: 10,
    name: "Wohnpark Neue Donau",
    architect: "Adolf Krischanitz",
    year: "1997",
    location: "Vienna, Austria",
    typology: "Urban Residential",
    style: "Contemporary / Minimalist",
    units: "220",
    total_area: "Not Available",
    floors: "8",
    concept: "A precisely ordered housing complex along the Neue Donau waterfront, where repetitive yet carefully proportioned facades create a coherent urban edge while internal organisation maximises views and cross-ventilation for every unit.",
    key_design_moves: [
      "Linear blocks oriented perpendicular to waterfront for view access",
      "Consistent facade rhythm with subtle variation in balcony depth",
      "Ground floor public path maintains waterfront permeability"
    ],
    materials: ["Render", "Concrete", "Aluminium windows", "Timber balconies"],
    site_strategy: "Positioned along the Neue Donau leisure waterway, the project forms part of Vienna's coordinated waterfront residential development strategy.",
    program: "220 residential units with ground floor commercial and direct waterfront access",
    awards: "Not Available",
    tags: ["waterfront", "vienna", "minimalist", "urban edge", "contemporary"],
    sources: ["archdaily.com", "divisare.com"],
    image_cover: "https://images.adsttc.com/media/images/5026/e0e0/28ba/0d12/1500/006e/large_jpg/stringio.jpg",
    image_2: "https://images.adsttc.com/media/images/5026/e0ec/28ba/0d12/1500/006f/large_jpg/stringio.jpg",
    image_3: "https://images.adsttc.com/media/images/5026/e0f8/28ba/0d12/1500/0070/large_jpg/stringio.jpg",
    last_updated: "2025-01-15"
  }
];

const TYPOLOGIES = ["All", ...new Set(PROJECTS.map(p => p.typology))];
const STYLES = ["All", ...new Set(PROJECTS.map(p => p.style.split(" / ")[0]))];
const YEARS = ["All", "Before 1980", "1980–2000", "2000–2010", "2010–present"];

function filterByYear(project, range) {
  const y = parseInt(project.year);
  if (range === "All") return true;
  if (range === "Before 1980") return y < 1980;
  if (range === "1980–2000") return y >= 1980 && y <= 2000;
  if (range === "2000–2010") return y >= 2000 && y <= 2010;
  if (range === "2010–present") return y > 2010;
  return true;
}

export default function NAref() {
  const [search, setSearch] = useState("");
  const [typology, setTypology] = useState("All");
  const [style, setStyle] = useState("All");
  const [year, setYear] = useState("All");
  const [selected, setSelected] = useState(null);
  const [favourites, setFavourites] = useState([]);
  const [copied, setCopied] = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(() => {
    return PROJECTS.filter(p => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.architect.toLowerCase().includes(q) || p.concept.toLowerCase().includes(q) || p.tags.some(t => t.includes(q));
      const matchTypology = typology === "All" || p.typology === typology;
      const matchStyle = style === "All" || p.style.includes(style);
      const matchYear = filterByYear(p, year);
      const matchFav = activeTab !== "favourites" || favourites.includes(p.id);
      return matchSearch && matchTypology && matchStyle && matchYear && matchFav;
    });
  }, [search, typology, style, year, activeTab, favourites]);

  const toggleFav = (id, e) => {
    e.stopPropagation();
    setFavourites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const copyData = () => {
    if (!selected) return;
    const text = JSON.stringify(selected, null, 2);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadPDF = () => {
    if (!selected) return;
    const content = `
NAref — Housing Architecture Reference
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROJECT: ${selected.name}
ARCHITECT: ${selected.architect}
YEAR: ${selected.year}
LOCATION: ${selected.location}
TYPOLOGY: ${selected.typology}
STYLE: ${selected.style}
UNITS: ${selected.units}
TOTAL AREA: ${selected.total_area}
FLOORS: ${selected.floors}

CONCEPT
${selected.concept}

SITE STRATEGY
${selected.site_strategy}

KEY DESIGN MOVES
${selected.key_design_moves.map((m, i) => `${i + 1}. ${m}`).join("\n")}

MATERIALS
${selected.materials.join(", ")}

PROGRAM
${selected.program}

AWARDS
${selected.awards}

SOURCES
${selected.sources.join(", ")}

TAGS
${selected.tags.join(", ")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated by NAref — naref.vercel.app
    `.trim();
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NAref_${selected.name.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  const lastUpdated = PROJECTS.reduce((a, b) => a.last_updated > b.last_updated ? a : b).last_updated;

  return (
    <div style={{
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
      background: "#f5f0e8",
      minHeight: "100vh",
      color: "#1a1a14"
    }}>

      {/* Top bar */}
      <div style={{
        background: "#1a1a14",
        padding: "0 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "52px"
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{ fontSize: "18px", color: "#f5f0e8", letterSpacing: "3px", fontWeight: "400" }}>NAref</span>
          <span style={{ fontSize: "10px", color: "#5a5a4a", letterSpacing: "3px", textTransform: "uppercase" }}>Housing Archive</span>
        </div>
        <div style={{ fontSize: "10px", color: "#5a5a4a", letterSpacing: "2px" }}>
          LAST UPDATED: {lastUpdated}
        </div>
      </div>

      {/* Hero */}
      <div style={{
        padding: "48px 40px 36px",
        borderBottom: "1px solid #ddd8cc",
        background: "linear-gradient(180deg, #ede8e0 0%, #f5f0e8 100%)"
      }}>
        <div style={{ maxWidth: "560px" }}>
          <h1 style={{ margin: "0 0 8px", fontSize: "40px", fontWeight: "400", letterSpacing: "-1px", lineHeight: "1.1", color: "#1a1a14" }}>
            Housing<br />Reference Library
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#8a8a7a", lineHeight: "1.7", maxWidth: "440px" }}>
            Structured architectural data for students — concept, materials, program, and design moves from the world's most significant housing projects.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: "480px" }}>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by project, architect, concept, or tag..."
              style={{
                width: "100%",
                padding: "14px 48px 14px 18px",
                border: "1px solid #ccc8bc",
                background: "#fff",
                fontSize: "13px",
                fontFamily: "inherit",
                color: "#1a1a14",
                outline: "none",
                boxSizing: "border-box",
                letterSpacing: "0.3px"
              }}
            />
            <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#aaa", fontSize: "16px" }}>⌕</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        padding: "16px 40px",
        borderBottom: "1px solid #ddd8cc",
        display: "flex",
        gap: "24px",
        alignItems: "center",
        flexWrap: "wrap",
        background: "#f5f0e8"
      }}>
        {[
          { label: "Typology", value: typology, set: setTypology, options: TYPOLOGIES },
          { label: "Style", value: style, set: setStyle, options: STYLES },
          { label: "Year", value: year, set: setYear, options: YEARS }
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#8a8a7a", textTransform: "uppercase" }}>{f.label}</span>
            <select
              value={f.value}
              onChange={e => f.set(e.target.value)}
              style={{
                padding: "6px 28px 6px 10px",
                border: "1px solid #ccc8bc",
                background: "#fff",
                fontSize: "12px",
                fontFamily: "inherit",
                color: "#1a1a14",
                cursor: "pointer",
                outline: "none",
                appearance: "none",
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a8a7a'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center"
              }}
            >
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}

        <div style={{ marginLeft: "auto", display: "flex", gap: "0" }}>
          {["all", "favourites"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              padding: "6px 16px",
              background: activeTab === tab ? "#1a1a14" : "transparent",
              color: activeTab === tab ? "#f5f0e8" : "#8a8a7a",
              border: "1px solid #ccc8bc",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
              marginLeft: "-1px"
            }}>
              {tab === "favourites" ? `★ Saved (${favourites.length})` : `All (${PROJECTS.length})`}
            </button>
          ))}
        </div>

        <div style={{ fontSize: "11px", color: "#aaa8a0", letterSpacing: "1px" }}>
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 260px)" }}>

        {/* Grid */}
        <div style={{
          flex: 1,
          padding: "32px 40px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
          alignContent: "start"
        }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0", color: "#aaa" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>◻</div>
              <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" }}>No projects found</div>
            </div>
          ) : filtered.map(p => (
            <div
              key={p.id}
              onClick={() => setSelected(p)}
              style={{
                background: "#fff",
                border: selected?.id === p.id ? "2px solid #1a1a14" : "1px solid #ddd8cc",
                cursor: "pointer",
                transition: "all 0.15s",
                overflow: "hidden"
              }}
            >
              {/* Image */}
              <div style={{ height: "180px", background: "#e8e4dc", overflow: "hidden", position: "relative" }}>
                {!imgErrors[`${p.id}_cover`] ? (
                  <img
                    src={p.image_cover}
                    alt={p.name}
                    onError={() => setImgErrors(e => ({ ...e, [`${p.id}_cover`]: true }))}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "11px", letterSpacing: "2px" }}>
                    NO IMAGE
                  </div>
                )}
                {/* Fav button */}
                <button
                  onClick={e => toggleFav(p.id, e)}
                  style={{
                    position: "absolute", top: "10px", right: "10px",
                    background: "rgba(255,255,255,0.9)",
                    border: "none", width: "28px", height: "28px",
                    cursor: "pointer", fontSize: "14px",
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}
                >
                  {favourites.includes(p.id) ? "★" : "☆"}
                </button>
                {/* Typology badge */}
                <div style={{
                  position: "absolute", bottom: "10px", left: "10px",
                  background: "rgba(26,26,20,0.85)", color: "#f5f0e8",
                  fontSize: "9px", letterSpacing: "2px", padding: "4px 8px",
                  textTransform: "uppercase"
                }}>
                  {p.typology}
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "16px 18px 14px" }}>
                <div style={{ fontSize: "15px", fontWeight: "400", marginBottom: "4px", lineHeight: "1.3" }}>{p.name}</div>
                <div style={{ fontSize: "12px", color: "#8a8a7a", marginBottom: "10px" }}>{p.architect} · {p.year}</div>
                <div style={{ fontSize: "11px", color: "#aaa8a0", marginBottom: "12px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {p.concept}
                </div>
                {/* Tags */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                  {p.tags.slice(0, 3).map((t, i) => (
                    <span key={i} style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", padding: "2px 7px", border: "1px solid #ddd8cc", color: "#8a8a7a" }}>{t}</span>
                  ))}
                </div>
                {/* Source */}
                <div style={{ fontSize: "10px", color: "#bbb8b0", letterSpacing: "1px", borderTop: "1px solid #eee8e0", paddingTop: "10px" }}>
                  Source: {p.sources[0]}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{
            width: "400px",
            flexShrink: 0,
            borderLeft: "1px solid #ddd8cc",
            background: "#fff",
            overflowY: "auto",
            position: "sticky",
            top: 0,
            maxHeight: "calc(100vh - 52px)"
          }}>
            {/* Images */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", height: "220px" }}>
              <div style={{ gridColumn: "1/-1", background: "#e8e4dc", overflow: "hidden" }}>
                {!imgErrors[`${selected.id}_cover_detail`] ? (
                  <img src={selected.image_cover} alt="" onError={() => setImgErrors(e => ({ ...e, [`${selected.id}_cover_detail`]: true }))} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
                ) : <div style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center", color: "#aaa", fontSize: "11px" }}>NO IMAGE</div>}
              </div>
              <div style={{ background: "#e8e4dc", overflow: "hidden", height: "68px" }}>
                {!imgErrors[`${selected.id}_2`] ? (
                  <img src={selected.image_2} alt="" onError={() => setImgErrors(e => ({ ...e, [`${selected.id}_2`]: true }))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : <div style={{ height: "100%", background: "#e0dcd4" }} />}
              </div>
              <div style={{ background: "#e8e4dc", overflow: "hidden", height: "68px" }}>
                {!imgErrors[`${selected.id}_3`] ? (
                  <img src={selected.image_3} alt="" onError={() => setImgErrors(e => ({ ...e, [`${selected.id}_3`]: true }))} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : <div style={{ height: "100%", background: "#e0dcd4" }} />}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", borderBottom: "1px solid #eee8e0" }}>
              {[
                { label: copied ? "Copied!" : "Copy Data", action: copyData },
                { label: "Download", action: downloadPDF },
                { label: favourites.includes(selected.id) ? "★ Saved" : "☆ Save", action: (e) => toggleFav(selected.id, { stopPropagation: () => {} }) }
              ].map((btn, i) => (
                <button key={i} onClick={btn.action} style={{
                  flex: 1, padding: "10px 0",
                  background: "transparent", border: "none",
                  borderRight: i < 2 ? "1px solid #eee8e0" : "none",
                  fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
                  color: "#8a8a7a", cursor: "pointer", fontFamily: "inherit"
                }}>{btn.label}</button>
              ))}
            </div>

            {/* Content */}
            <div style={{ padding: "24px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#c8a030", textTransform: "uppercase", marginBottom: "8px" }}>{selected.typology}</div>
              <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "400", lineHeight: "1.3" }}>{selected.name}</h2>
              <div style={{ fontSize: "13px", color: "#8a8a7a", marginBottom: "20px" }}>{selected.architect} · {selected.location} · {selected.year}</div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#eee8e0", marginBottom: "24px" }}>
                {[
                  { l: "Units", v: selected.units },
                  { l: "Area", v: selected.total_area },
                  { l: "Floors", v: selected.floors },
                  { l: "Style", v: selected.style.split(" / ")[0] }
                ].map((s, i) => (
                  <div key={i} style={{ background: "#fff", padding: "12px 14px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#aaa", textTransform: "uppercase", marginBottom: "4px" }}>{s.l}</div>
                    <div style={{ fontSize: "13px", color: "#1a1a14" }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {/* Sections */}
              {[
                { title: "Concept", content: selected.concept },
                { title: "Site Strategy", content: selected.site_strategy },
                { title: "Program", content: selected.program },
                { title: "Awards", content: selected.awards }
              ].map(s => (
                <div key={s.title} style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "8px" }}>{s.title}</div>
                  <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.8", color: "#4a4a3a" }}>{s.content}</p>
                </div>
              ))}

              {/* Design moves */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Key Design Moves</div>
                {selected.key_design_moves.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#c8a030", flexShrink: 0, marginTop: "1px" }}>0{i + 1}</span>
                    <span style={{ fontSize: "12px", color: "#4a4a3a", lineHeight: "1.7" }}>{m}</span>
                  </div>
                ))}
              </div>

              {/* Materials */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Materials</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selected.materials.map((m, i) => (
                    <span key={i} style={{ fontSize: "10px", padding: "4px 10px", border: "1px solid #ddd8cc", color: "#6a6a5a", letterSpacing: "1px" }}>{m}</span>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Tags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selected.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: "10px", padding: "4px 10px", background: "#f5f0e8", color: "#8a8a7a", letterSpacing: "1px" }}>{t}</span>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div style={{ paddingTop: "16px", borderTop: "1px solid #eee8e0" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Sources</div>
                {selected.sources.map((s, i) => (
                  <div key={i} style={{ fontSize: "11px", color: "#c8a030", marginBottom: "4px" }}>↗ {s}</div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
