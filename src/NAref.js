import { useState, useMemo } from "react";

// All images from Wikimedia Commons - open license, no CORS issues
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
    key_design_moves: ["Shared party walls reduce construction cost per unit","Structural frame pre-built for future vertical expansion","Dense urban infill maintains city connectivity"],
    materials: ["Reinforced concrete", "Masonry block", "Corrugated metal"],
    site_strategy: "Dense urban plot within existing city fabric, preserving resident proximity to jobs and services rather than relocating to periphery.",
    program: "93 residential units with shared open space and incremental expansion provision",
    awards: "Pritzker Architecture Prize 2016 (Aravena)",
    tags: ["incremental", "social", "latin america", "affordable", "self-build"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Quinta+Monroy" },
      { label: "Dezeen", url: "https://www.dezeen.com/?s=Quinta+Monroy" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Quinta_Monroy" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Quinta_Monroy_ELEMENTAL.jpg/800px-Quinta_Monroy_ELEMENTAL.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Quinta_Monroy_ELEMENTAL.jpg/400px-Quinta_Monroy_ELEMENTAL.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Quinta_Monroy_ELEMENTAL.jpg/400px-Quinta_Monroy_ELEMENTAL.jpg",
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
    key_design_moves: ["Circular plan creates strong collective identity","Projecting communal volumes break the ring's regularity","Inward courtyard acts as shared social heart"],
    materials: ["Brick", "Copper", "Concrete", "Timber"],
    site_strategy: "Placed at the edge of a new university district, the circular form creates a landmark while its courtyard provides sheltered semi-public space.",
    program: "360 student rooms, communal kitchens per floor, music rooms, gym, common hall",
    awards: "Nominated Mies van der Rohe Award 2007",
    tags: ["circular", "collective", "student", "nordic", "courtyard"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Tietgen+Dormitory" },
      { label: "Dezeen", url: "https://www.dezeen.com/?s=Tietgen+Dormitory" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Tietgen_Dormitory" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Tietgen_Dormitory.jpg/800px-Tietgen_Dormitory.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Tietgen_Dormitory.jpg/400px-Tietgen_Dormitory.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Tietgen_Dormitory.jpg/400px-Tietgen_Dormitory.jpg",
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
    key_design_moves: ["354 prefabricated concrete boxes assembled in 3D array","Each unit's roof becomes the next unit's garden terrace","Pedestrian streets and bridges thread through the structure"],
    materials: ["Precast concrete", "Steel connections", "Glass"],
    site_strategy: "Built on a pier extending into the St. Lawrence River for Expo 67, creating a dense urban village on the waterfront.",
    program: "158 residential units ranging from 1 to 4 bedrooms, gardens, communal amenities",
    awards: "National Historic Site of Canada 2009",
    tags: ["brutalist", "modular", "prefab", "iconic", "experimental", "terrace"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Habitat+67" },
      { label: "Dezeen", url: "https://www.dezeen.com/?s=Habitat+67" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Habitat_67" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Habitat_67%2C_southwest_view.jpg/800px-Habitat_67%2C_southwest_view.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Habitat67_crop.jpg/400px-Habitat67_crop.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Habitat_67%2C_southwest_view.jpg/400px-Habitat_67%2C_southwest_view.jpg",
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
    key_design_moves: ["Figure-8 plan creates two distinct courtyard identities","Continuous sloping bike and pedestrian path from ground to roof","Ground floor commercial activates street edges"],
    materials: ["Brick", "Glass", "Steel", "Concrete"],
    site_strategy: "Located in Orestad, a new district south of Copenhagen, the building creates its own urban scale and internal street life in an otherwise sparse suburban context.",
    program: "476 apartments, penthouses, commercial units, offices at ground level",
    awards: "World Architecture Festival — Best Residential Building 2011",
    tags: ["mixed-use", "figure-eight", "nordic", "BIG", "promenade", "rooftop"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=8+House+BIG" },
      { label: "Dezeen", url: "https://www.dezeen.com/?s=8+House+BIG" },
      { label: "BIG", url: "https://big.dk/projects/8-house" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/8_House_Copenhagen.jpg/800px-8_House_Copenhagen.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/8_House_Copenhagen.jpg/400px-8_House_Copenhagen.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/8_House_Copenhagen.jpg/400px-8_House_Copenhagen.jpg",
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
    key_design_moves: ["Half-built party wall structure enables self-completion","Open ground floor framing allows flexible future infill","Dense site layout maximises unit count within budget"],
    materials: ["Reinforced concrete", "Masonry", "Steel frame"],
    site_strategy: "Urban infill site within the city, maintaining resident access to existing urban networks and employment.",
    program: "70 incremental residential units with self-build expansion capacity",
    awards: "Not Available",
    tags: ["incremental", "social", "mexico", "affordable", "self-build", "elemental"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Monterrey+Housing+Elemental" },
      { label: "Plataforma Arquitectura", url: "https://www.plataformaarquitectura.cl/cl/search?q=Monterrey+Elemental" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Quinta_Monroy_ELEMENTAL.jpg/800px-Quinta_Monroy_ELEMENTAL.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Quinta_Monroy_ELEMENTAL.jpg/400px-Quinta_Monroy_ELEMENTAL.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Quinta_Monroy_ELEMENTAL.jpg/400px-Quinta_Monroy_ELEMENTAL.jpg",
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
    key_design_moves: ["Continuous bamboo screen as climatic and aesthetic envelope","Sliding screen panels allow residents to control privacy and light","Courtyard block typology adapted for Mediterranean climate"],
    materials: ["Bamboo", "Concrete", "Glass", "Steel"],
    site_strategy: "Inserted into the Carabanchel social housing development on Madrid's southern periphery, the bamboo facade creates identity within a repetitive urban fabric.",
    program: "100 social housing units with communal courtyard and ground floor amenities",
    awards: "Not Available",
    tags: ["social", "facade", "bamboo", "mediterranean", "FOA", "screen"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Carabanchel+Housing" },
      { label: "Dezeen", url: "https://www.dezeen.com/?s=Carabanchel+Housing" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Carabanchel_Housing_FOA.jpg/800px-Carabanchel_Housing_FOA.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Carabanchel_Housing_FOA.jpg/400px-Carabanchel_Housing_FOA.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Carabanchel_Housing_FOA.jpg/400px-Carabanchel_Housing_FOA.jpg",
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
    key_design_moves: ["Grid of mini neighbourhoods each with distinct facade treatment","Mixed tenure — social, private, live-work — within one structure","Public walkways and shared decks thread through the building"],
    materials: ["Steel", "Timber", "Glass", "Aluminium cladding"],
    site_strategy: "Cantilevered over the IJ waterway on a former industrial pier, the building reads as a moored vessel and activates Amsterdam's western docklands.",
    program: "157 units across 8 housing typologies, live-work units, communal spaces, commercial",
    awards: "Not Available",
    tags: ["mixed-use", "MVRDV", "waterfront", "colourful", "neighbourhood", "amsterdam"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Silodam+MVRDV" },
      { label: "MVRDV", url: "https://www.mvrdv.nl/projects/111/silodam" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Silodam" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Silodam_Amsterdam.jpg/800px-Silodam_Amsterdam.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Silodam_Amsterdam.jpg/400px-Silodam_Amsterdam.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Silodam_Amsterdam.jpg/400px-Silodam_Amsterdam.jpg",
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
    key_design_moves: ["140 capsules bolted independently to concrete shafts","Each capsule prefabricated off-site and crane-installed","Design anticipates capsule replacement every 25 years"],
    materials: ["Precast concrete", "Corten steel capsule shells", "Porthole windows"],
    site_strategy: "Located in Shimbashi, Tokyo's salarymen district, the tower served as pied-a-terre units for workers staying in the city during the week.",
    program: "140 single-occupancy capsule units, each 10 sqm with built-in appliances",
    awards: "Designated culturally significant prior to demolition in 2022",
    tags: ["metabolism", "capsule", "japan", "iconic", "experimental", "prefab", "tokyo"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Nakagin+Capsule+Tower" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Nakagin_Capsule_Tower" },
      { label: "Dezeen", url: "https://www.dezeen.com/?s=Nakagin+Capsule+Tower" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Nakagin.jpg/600px-Nakagin.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Nakagin_Capsule_Tower_03.jpg/400px-Nakagin_Capsule_Tower_03.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Nakagin.jpg/400px-Nakagin.jpg",
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
    key_design_moves: ["Mix of 16-storey tower and lower perimeter blocks","Elevated pedestrian deck links all buildings","Community facilities including pool and sports hall embedded in estate"],
    materials: ["Reinforced concrete", "Brick", "Glass curtain wall"],
    site_strategy: "Built on a blitzed site in the City of London fringe, the estate introduced residential density adjacent to the financial district.",
    program: "559 residential units, community centre, swimming pool, sports facilities, nursery",
    awards: "Grade II* Listed Building",
    tags: ["brutalist", "public housing", "london", "post-war", "listed", "walkways"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Golden+Lane+Estate" },
      { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Golden_Lane_Estate" },
      { label: "Dezeen", url: "https://www.dezeen.com/?s=Golden+Lane+Estate" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Golden_Lane_Estate_from_Fann_Street.jpg/800px-Golden_Lane_Estate_from_Fann_Street.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Golden_Lane_Estate_from_Fann_Street.jpg/400px-Golden_Lane_Estate_from_Fann_Street.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Golden_Lane_Estate_from_Fann_Street.jpg/400px-Golden_Lane_Estate_from_Fann_Street.jpg",
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
    key_design_moves: ["Linear blocks oriented perpendicular to waterfront for view access","Consistent facade rhythm with subtle variation in balcony depth","Ground floor public path maintains waterfront permeability"],
    materials: ["Render", "Concrete", "Aluminium windows", "Timber balconies"],
    site_strategy: "Positioned along the Neue Donau leisure waterway, the project forms part of Vienna's coordinated waterfront residential development strategy.",
    program: "220 residential units with ground floor commercial and direct waterfront access",
    awards: "Not Available",
    tags: ["waterfront", "vienna", "minimalist", "urban edge", "contemporary"],
    sources: [
      { label: "Archdaily", url: "https://www.archdaily.com/search/projects?q=Wohnpark+Neue+Donau" },
      { label: "Divisare", url: "https://divisare.com/search?q=Krischanitz" }
    ],
    image_cover: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Wohnpark_Neue_Donau_Wien.jpg/800px-Wohnpark_Neue_Donau_Wien.jpg",
    image_2: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Wohnpark_Neue_Donau_Wien.jpg/400px-Wohnpark_Neue_Donau_Wien.jpg",
    image_3: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Wohnpark_Neue_Donau_Wien.jpg/400px-Wohnpark_Neue_Donau_Wien.jpg",
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

const FALLBACK = "https://placehold.co/600x400/2a2a20/c8a96e?text=No+Image";

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

  const imgSrc = (url, key) => imgErrors[key] ? FALLBACK : url;
  const onImgError = (key) => setImgErrors(e => ({ ...e, [key]: true }));

  const copyData = () => {
    if (!selected) return;
    navigator.clipboard.writeText(JSON.stringify(selected, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    if (!selected) return;
    const content = `NAref — Housing Architecture Reference\n${"=".repeat(50)}\n\nPROJECT: ${selected.name}\nARCHITECT: ${selected.architect}\nYEAR: ${selected.year}\nLOCATION: ${selected.location}\nTYPOLOGY: ${selected.typology}\nSTYLE: ${selected.style}\nUNITS: ${selected.units}\nTOTAL AREA: ${selected.total_area}\nFLOORS: ${selected.floors}\n\nCONCEPT\n${selected.concept}\n\nSITE STRATEGY\n${selected.site_strategy}\n\nKEY DESIGN MOVES\n${selected.key_design_moves.map((m, i) => `${i + 1}. ${m}`).join("\n")}\n\nMATERIALS\n${selected.materials.join(", ")}\n\nPROGRAM\n${selected.program}\n\nAWARDS\n${selected.awards}\n\nSOURCES\n${selected.sources.map(s => `${s.label}: ${s.url}`).join("\n")}\n\nTAGS\n${selected.tags.join(", ")}\n\n${"=".repeat(50)}\nGenerated by NAref`;
    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `NAref_${selected.name.replace(/\s+/g, "_")}.txt`;
    a.click();
  };

  const lastUpdated = PROJECTS.reduce((a, b) => a.last_updated > b.last_updated ? a : b).last_updated;

  return (
    <div style={{ fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", background: "#f5f0e8", minHeight: "100vh", color: "#1a1a14" }}>

      <div style={{ background: "#1a1a14", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
          <span style={{ fontSize: "18px", color: "#f5f0e8", letterSpacing: "3px" }}>NAref</span>
          <span style={{ fontSize: "10px", color: "#5a5a4a", letterSpacing: "3px", textTransform: "uppercase" }}>Housing Archive</span>
        </div>
        <div style={{ fontSize: "10px", color: "#5a5a4a", letterSpacing: "2px" }}>LAST UPDATED: {lastUpdated}</div>
      </div>

      <div style={{ padding: "48px 40px 36px", borderBottom: "1px solid #ddd8cc", background: "linear-gradient(180deg, #ede8e0 0%, #f5f0e8 100%)" }}>
        <div style={{ maxWidth: "560px" }}>
          <h1 style={{ margin: "0 0 8px", fontSize: "40px", fontWeight: "400", letterSpacing: "-1px", lineHeight: "1.1" }}>Housing<br />Reference Library</h1>
          <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#8a8a7a", lineHeight: "1.7", maxWidth: "440px" }}>Structured architectural data for students — concept, materials, program, and design moves from the world's most significant housing projects.</p>
          <div style={{ position: "relative", maxWidth: "480px" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by project, architect, concept, or tag..." style={{ width: "100%", padding: "14px 48px 14px 18px", border: "1px solid #ccc8bc", background: "#fff", fontSize: "13px", fontFamily: "inherit", color: "#1a1a14", outline: "none", boxSizing: "border-box" }} />
            <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }}>⌕</span>
          </div>
        </div>
      </div>

      <div style={{ padding: "16px 40px", borderBottom: "1px solid #ddd8cc", display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap", background: "#f5f0e8" }}>
        {[
          { label: "Typology", value: typology, set: setTypology, options: TYPOLOGIES },
          { label: "Style", value: style, set: setStyle, options: STYLES },
          { label: "Year", value: year, set: setYear, options: YEARS }
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "10px", letterSpacing: "2px", color: "#8a8a7a", textTransform: "uppercase" }}>{f.label}</span>
            <select value={f.value} onChange={e => f.set(e.target.value)} style={{ padding: "6px 28px 6px 10px", border: "1px solid #ccc8bc", background: "#fff", fontSize: "12px", fontFamily: "inherit", color: "#1a1a14", cursor: "pointer", outline: "none", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%238a8a7a'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 8px center" }}>
              {f.options.map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
        ))}
        <div style={{ marginLeft: "auto", display: "flex" }}>
          {["all", "favourites"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "6px 16px", background: activeTab === tab ? "#1a1a14" : "transparent", color: activeTab === tab ? "#f5f0e8" : "#8a8a7a", border: "1px solid #ccc8bc", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontFamily: "inherit", marginLeft: "-1px" }}>
              {tab === "favourites" ? `★ Saved (${favourites.length})` : `All (${PROJECTS.length})`}
            </button>
          ))}
        </div>
        <div style={{ fontSize: "11px", color: "#aaa8a0" }}>{filtered.length} project{filtered.length !== 1 ? "s" : ""}</div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 260px)" }}>
        <div style={{ flex: 1, padding: "32px 40px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px", alignContent: "start" }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => setSelected(p)} style={{ background: "#fff", border: selected?.id === p.id ? "2px solid #1a1a14" : "1px solid #ddd8cc", cursor: "pointer", transition: "all 0.15s", overflow: "hidden" }}>
              <div style={{ height: "180px", overflow: "hidden", position: "relative", background: "#e8e4dc" }}>
                <img src={imgSrc(p.image_cover, `${p.id}_c`)} onError={() => onImgError(`${p.id}_c`)} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={e => toggleFav(p.id, e)} style={{ position: "absolute", top: "10px", right: "10px", background: "rgba(255,255,255,0.9)", border: "none", width: "28px", height: "28px", cursor: "pointer", fontSize: "14px" }}>
                  {favourites.includes(p.id) ? "★" : "☆"}
                </button>
                <div style={{ position: "absolute", bottom: "10px", left: "10px", background: "rgba(26,26,20,0.85)", color: "#f5f0e8", fontSize: "9px", letterSpacing: "2px", padding: "4px 8px", textTransform: "uppercase" }}>{p.typology}</div>
              </div>
              <div style={{ padding: "16px 18px 14px" }}>
                <div style={{ fontSize: "15px", marginBottom: "4px" }}>{p.name}</div>
                <div style={{ fontSize: "12px", color: "#8a8a7a", marginBottom: "10px" }}>{p.architect} · {p.year}</div>
                <div style={{ fontSize: "11px", color: "#aaa8a0", marginBottom: "12px", lineHeight: "1.6", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.concept}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "12px" }}>
                  {p.tags.slice(0, 3).map((t, i) => <span key={i} style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", padding: "2px 7px", border: "1px solid #ddd8cc", color: "#8a8a7a" }}>{t}</span>)}
                </div>
                <div style={{ borderTop: "1px solid #eee8e0", paddingTop: "10px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {p.sources.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ color: "#c8a030", textDecoration: "none", fontSize: "10px" }}>↗ {s.label}</a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div style={{ width: "400px", flexShrink: 0, borderLeft: "1px solid #ddd8cc", background: "#fff", overflowY: "auto", position: "sticky", top: 0, maxHeight: "calc(100vh - 52px)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: "#e8e4dc" }}>
              <div style={{ gridColumn: "1/-1", height: "150px", overflow: "hidden" }}>
                <img src={imgSrc(selected.image_cover, `${selected.id}_dc`)} onError={() => onImgError(`${selected.id}_dc`)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ height: "68px", overflow: "hidden" }}>
                <img src={imgSrc(selected.image_2, `${selected.id}_d2`)} onError={() => onImgError(`${selected.id}_d2`)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ height: "68px", overflow: "hidden" }}>
                <img src={imgSrc(selected.image_3, `${selected.id}_d3`)} onError={() => onImgError(`${selected.id}_d3`)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid #eee8e0" }}>
              {[
                { label: copied ? "Copied!" : "Copy Data", action: copyData },
                { label: "Download", action: downloadTxt },
                { label: favourites.includes(selected.id) ? "★ Saved" : "☆ Save", action: () => toggleFav(selected.id, { stopPropagation: () => {} }) }
              ].map((btn, i) => (
                <button key={i} onClick={btn.action} style={{ flex: 1, padding: "10px 0", background: "transparent", border: "none", borderRight: i < 2 ? "1px solid #eee8e0" : "none", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#8a8a7a", cursor: "pointer", fontFamily: "inherit" }}>{btn.label}</button>
              ))}
            </div>

            <div style={{ padding: "24px" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", color: "#c8a030", textTransform: "uppercase", marginBottom: "8px" }}>{selected.typology}</div>
              <h2 style={{ margin: "0 0 6px", fontSize: "20px", fontWeight: "400", lineHeight: "1.3" }}>{selected.name}</h2>
              <div style={{ fontSize: "13px", color: "#8a8a7a", marginBottom: "20px" }}>{selected.architect} · {selected.location} · {selected.year}</div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#eee8e0", marginBottom: "24px" }}>
                {[{ l: "Units", v: selected.units }, { l: "Area", v: selected.total_area }, { l: "Floors", v: selected.floors }, { l: "Style", v: selected.style.split(" / ")[0] }].map((s, i) => (
                  <div key={i} style={{ background: "#fff", padding: "12px 14px" }}>
                    <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#aaa", textTransform: "uppercase", marginBottom: "4px" }}>{s.l}</div>
                    <div style={{ fontSize: "13px" }}>{s.v}</div>
                  </div>
                ))}
              </div>

              {[{ title: "Concept", content: selected.concept }, { title: "Site Strategy", content: selected.site_strategy }, { title: "Program", content: selected.program }, { title: "Awards", content: selected.awards }].map(s => (
                <div key={s.title} style={{ marginBottom: "20px" }}>
                  <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "8px" }}>{s.title}</div>
                  <p style={{ margin: 0, fontSize: "12px", lineHeight: "1.8", color: "#4a4a3a" }}>{s.content}</p>
                </div>
              ))}

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Key Design Moves</div>
                {selected.key_design_moves.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "11px", color: "#c8a030", flexShrink: 0 }}>0{i + 1}</span>
                    <span style={{ fontSize: "12px", color: "#4a4a3a", lineHeight: "1.7" }}>{m}</span>
                  </div>
                ))}
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Materials</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selected.materials.map((m, i) => <span key={i} style={{ fontSize: "10px", padding: "4px 10px", border: "1px solid #ddd8cc", color: "#6a6a5a" }}>{m}</span>)}
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Tags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {selected.tags.map((t, i) => <span key={i} style={{ fontSize: "10px", padding: "4px 10px", background: "#f5f0e8", color: "#8a8a7a" }}>{t}</span>)}
                </div>
              </div>

              <div style={{ paddingTop: "16px", borderTop: "1px solid #eee8e0" }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#aaa", textTransform: "uppercase", marginBottom: "10px" }}>Sources</div>
                {selected.sources.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noreferrer" style={{ display: "block", fontSize: "11px", color: "#c8a030", marginBottom: "8px", textDecoration: "none" }}>↗ {s.label}</a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
