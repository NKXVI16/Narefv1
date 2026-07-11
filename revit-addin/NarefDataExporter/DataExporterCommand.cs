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
    public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
    {
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

        var window = new DataExporterWindow(uiDocument, categories);
        _ = new WindowInteropHelper(window) { Owner = commandData.Application.MainWindowHandle };
        window.ShowDialog();

        return Result.Succeeded;
    }
}
