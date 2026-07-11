# NarefTools — pyRevit Extension

Custom pyRevit tools for Revit QA, documentation and workset workflows.
Built incrementally (1–2 tools/day) — see [ROADMAP.md](ROADMAP.md) for the
schedule and status of each tool.

## Requirements
- Autodesk Revit 2021+ (tools handle 2022+ API changes where relevant)
- [pyRevit](https://github.com/pyrevitlabs/pyRevit) 4.8+

## Installation

**Option A — extension search path (recommended for dev):**
1. Clone this repo.
2. In Revit: pyRevit tab → Settings → Custom Extension Directories →
   add the full path to this repo's `pyrevit` folder.
3. Reload pyRevit (pyRevit tab → Reload).

**Option B — copy:**
Copy `NarefTools.extension` into `%APPDATA%\pyRevit\Extensions` and
reload pyRevit.

A **NarefTools** tab will appear in the Revit ribbon.

## Tools

### QA Tools panel
| Tool | What it does |
|------|--------------|
| **3D Isolation Trap** | Isolates your current selection in a dedicated per-user 3D view, crops it with a section box, and jumps you into it. |
| **Taggles Shame** | Scans the active view for elements missing tags (doors, windows, rooms, etc.) and prints a clickable report; optionally selects the offenders. |
| **Warnings Snitch** | Groups all Revit model warnings by description, reports failing elements with clickable links, and optionally exports the QA data to CSV. |

### Worksets panel
| Tool | What it does |
|------|--------------|
| **Workset Grabber** | Lists user worksets with live element counts, filters by category and type, selects matching elements, and optionally exports the review to CSV. |

More tools land daily per the roadmap.
