using System.Reflection;
using Autodesk.Revit.UI;

namespace NarefDataExporter;

/// <summary>Registers the "Data Exporter" button on a "NAref Tools" ribbon tab.</summary>
public class App : IExternalApplication
{
    public Result OnStartup(UIControlledApplication application)
    {
        const string tabName = "NAref Tools";
        application.CreateRibbonTab(tabName);
        RibbonPanel panel = application.CreateRibbonPanel(tabName, "QC Panel");

        string assemblyPath = Assembly.GetExecutingAssembly().Location;

        var exporterButton = new PushButtonData(
            "NarefDataExporter",
            "Data\nExporter",
            assemblyPath,
            "NarefDataExporter.DataExporterCommand")
        {
            ToolTip = "Export BOQ (Bill of Quantities) and QA-QC reports to CSV",
            LongDescription = "Select model categories and types, choose Count / Length / Area / Volume, " +
                              "optionally break the BOQ down by level or itemize instances, and export to CSV.",
        };
        panel.AddItem(exporterButton);

        var updatesButton = new PushButtonData(
            "NarefCheckUpdates",
            "Check\nUpdates",
            assemblyPath,
            "NarefDataExporter.CheckUpdatesCommand")
        {
            ToolTip = "Check GitHub for a newer version of the Data Exporter",
        };
        panel.AddItem(updatesButton);

        return Result.Succeeded;
    }

    public Result OnShutdown(UIControlledApplication application) => Result.Succeeded;
}
