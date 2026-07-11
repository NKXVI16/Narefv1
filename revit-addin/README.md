# NAref Data Exporter — Revit Add-in

A Revit plugin for **BOQ (Bill of Quantities) and QA-QC export to CSV**, modeled on the
three-panel Data Exporter workflow:

- **Model Category** list (left) — every model category found in the open document, with instance counts
- **Type table** (middle) — per-type **Export / Count / Itemize / QA-QC** checkboxes, Select all, and a type filter
- **Export Options** (right) — BOQ and QA-QC tabs:
  - Quantity columns: **Count / Length / Area / Volume** (metric — m, m², m³)
  - **Breakdown aggregated BOQ by Level**
  - **Itemize instances** per type or for all selected types (rows carry the ElementId)
  - Decimal places for the CSV
  - **Preview / Geometry** panel showing aggregated length, area, and volume of the selected type
- **Highlight Selected Category** selects that category's elements in the model
- QA-QC report flags zero-volume elements, elements without a level, and volume outliers
  beyond ±25% of the type mean

## Requirements

- **Revit 2021–2026.** The target framework follows the Revit version automatically:
  2025+ builds against .NET 8, 2024 and earlier against .NET Framework 4.8.
- To build: [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
  (Visual Studio 2022 17.8+ includes it)

The Revit API assemblies come from the [Nice3point.Revit.Api](https://www.nuget.org/packages/Nice3point.Revit.Api.RevitAPI)
NuGet packages, so **no Revit installation is needed to compile**. The UI is WPF built in
code (no XAML), so the project even cross-compiles on Linux/macOS CI.

## Build

```powershell
cd revit-addin/NarefDataExporter
dotnet build -c Release                        # Revit 2025 (default)
dotnet build -c Release -p:RevitVersion=2024   # Revit 2024
dotnet build -c Release -p:RevitVersion=2026   # Revit 2026
```

Output: `revit-addin/NarefDataExporter/bin/Release/NarefDataExporter.dll`

## Install

Copy two things into your Revit add-ins folder for your Revit year
(`%AppData%\Autodesk\Revit\Addins\2024\`, `...\2025\`, etc.):

```
%AppData%\Autodesk\Revit\Addins\2025\
├── NarefDataExporter.addin          ← from revit-addin/
└── NarefDataExporter\
    └── NarefDataExporter.dll        ← from bin/Release/
```

PowerShell one-liner from the repo root after building:

```powershell
$addins = "$env:AppData\Autodesk\Revit\Addins\2025"
New-Item -ItemType Directory -Force "$addins\NarefDataExporter" | Out-Null
Copy-Item revit-addin\NarefDataExporter.addin $addins
Copy-Item revit-addin\NarefDataExporter\bin\Release\NarefDataExporter.dll "$addins\NarefDataExporter"
```

Start Revit, accept the add-in security prompt once, open a model, and find
**NAref Tools → QC Panel → Data Exporter** in the ribbon.

## Project layout

```
revit-addin/
├── NarefDataExporter.addin              Add-in manifest (copy to Addins folder)
└── NarefDataExporter/
    ├── NarefDataExporter.csproj
    ├── App.cs                           IExternalApplication — ribbon tab & button
    ├── DataExporterCommand.cs           IExternalCommand — collects data, shows dialog
    ├── Services/
    │   ├── QuantityModel.cs             InstanceQuantity / TypeEntry / CategoryGroup
    │   ├── QuantityCollector.cs         Revit API → quantities (levels, metric units)
    │   └── CsvExporter.cs               BOQ + QA-QC table building and CSV writing
    └── UI/
        └── DataExporterWindow.cs        WPF dialog (code-built, three-panel layout)
```

## How quantities are read

| Quantity | Source parameter(s) |
|----------|--------------------|
| Length   | `CURVE_ELEM_LENGTH`, else `INSTANCE_LENGTH_PARAM` |
| Area     | `HOST_AREA_COMPUTED` |
| Volume   | `HOST_VOLUME_COMPUTED` |
| Level    | `Element.LevelId`, else family/reference/schedule level parameters |

Values are converted from Revit internal units to metres via `UnitUtils`.
Elements whose category is not a model category (annotations, tags, views) are skipped.
