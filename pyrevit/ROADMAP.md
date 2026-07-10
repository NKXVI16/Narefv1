# NarefTools — pyRevit Build Roadmap

Build plan: 2 tools per day, easiest to hardest. Each tool ships as a
pushbutton inside `NarefTools.extension`.

## Schedule & Status

| Day | Date (2026) | Tool | Panel | Status |
|-----|-------------|------|-------|--------|
| 1 | Jul 10 | 3D Isolation Trap — isolate selection in a dedicated 3D view with section box | QA Tools | ✅ Done |
| 1 | Jul 10 | Taggles Shame — report untagged elements in the active view | QA Tools | ✅ Done |
| 2 | Jul 11 | WarningsSnitch — extract all model warnings, group by severity, export to CSV | QA Tools | ⏳ Planned |
| 2 | Jul 11 | Workset Grabber — list worksets with element counts, select/review elements by workset | Worksets | ⏳ Planned |
| 3 | Jul 12 | Click Counter — sequential numbering (prefix + increment) by clicking elements, with ISelectionFilter | Modify | ⏳ Planned |
| 3 | Jul 12 | Lazy Sheet Creator — pick views, create sheet with chosen title block, place views automatically | Sheets | ⏳ Planned |
| 4 | Jul 13 | Workset Police Dept — QA rules for workset assignment, batch-fix wrong assignments, CSV report | Worksets | ⏳ Planned |
| 4 | Jul 13 | AutoPlanner — generate floor plans, ceiling plans, sections, elevations and 3D views for selected levels in one command | Views | ⏳ Planned |

## Tool Notes (analysis)

### 1. 3D Isolation Trap (done)
- `View3D.CreateIsometric`, per-user view reuse, combined bounding box →
  section box with 3 ft offset, `IsolateElementsTemporary`.

### 2. Taggles Shame (done)
- Collects `IndependentTag` (handles both `GetTaggedLocalElementIds`
  for Revit 2022+ and legacy `TaggedLocalElementId`) plus room tags,
  diffs against taggable categories in the active view, clickable report.

### 3. WarningsSnitch
- `doc.GetWarnings()` → `FailureMessage.GetDescriptionText()`,
  `GetFailingElements()`. Group by description, count, linkified report,
  CSV export via `script.get_output()` + `csv` module.

### 4. Workset Grabber
- `FilteredWorksetCollector` (`WorksetKind.UserWorkset`), element counts
  via `ElementWorksetFilter`, select-by-workset, CSV export.
  Must check `doc.IsWorkshared` first.

### 5. Click Counter
- `uidoc.Selection.PickObject` loop + `ISelectionFilter` restricted to a
  chosen category; user picks target parameter, prefix, start number,
  padding. Esc ends the loop gracefully.

### 6. Lazy Sheet Creator
- Pick unplaced views (`Viewport.CanAddViewToSheet`), pick title block
  type, `ViewSheet.Create`, place with `Viewport.Create` on a simple
  grid layout.

### 7. Workset Police Dept
- Rules mapping category → expected workset (user-configured, saved with
  `script.get_config()`); scan, report violations, batch-fix by setting
  `WorksetId` parameter, CSV report.

### 8. AutoPlanner
- Pick levels + view kinds. `ViewPlan.Create` (floor/ceiling),
  `ViewSection.CreateSection` with oriented bounding boxes,
  elevation markers via `ElevationMarker.CreateElevationMarker`,
  `View3D.CreateIsometric`. Naming convention + duplicate handling.

## Install (see pyrevit/README.md)
Add the `pyrevit` folder of this repo as a pyRevit extension search path,
or copy `NarefTools.extension` into `%APPDATA%\pyRevit\Extensions`.
