using System.Windows.Interop;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using NarefDataExporter.Services;
using NarefDataExporter.UI;

namespace NarefDataExporter;

[Transaction(TransactionMode.ReadOnly)]
public class DataExporterCommand : IExternalCommand
{
    // The window is modeless so Revit stays usable; keep a single instance.
    private static DataExporterWindow? _window;

    public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
    {
        if (_window is { IsLoaded: true })
        {
            _window.Activate();
            return Result.Succeeded;
        }

        UIDocument uiDocument = commandData.Application.ActiveUIDocument;
        if (uiDocument?.Document is not Document doc)
        {
            message = "Open a model before running the Data Exporter.";
            return Result.Cancelled;
        }

        List<CategoryGroup> categories = QuantityCollector.Collect(doc);
        if (categories.Count == 0)
        {
            TaskDialog.Show("Data Exporter", "No model elements with types were found in this document.");
            return Result.Cancelled;
        }

        var runner = new ExternalEventRunner();
        var window = new DataExporterWindow(doc.Title, categories, runner);
        _ = new WindowInteropHelper(window) { Owner = commandData.Application.MainWindowHandle };
        window.Closed += (_, _) =>
        {
            _window = null;
            runner.Dispose();
        };
        _window = window;
        window.Show();

        return Result.Succeeded;
    }
}
