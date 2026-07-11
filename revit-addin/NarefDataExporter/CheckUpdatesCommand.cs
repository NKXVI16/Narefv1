using System.Diagnostics;
using Autodesk.Revit.Attributes;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using NarefDataExporter.Services;

namespace NarefDataExporter;

[Transaction(TransactionMode.Manual)]
public class CheckUpdatesCommand : IExternalCommand
{
    public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
    {
        Version current = UpdateChecker.CurrentVersion;
        Version? latest = UpdateChecker.GetLatestVersion(out string? error);

        if (latest is null)
        {
            TaskDialog.Show("Check for Updates",
                $"Installed version: {current.ToString(3)}\n\nCould not check for updates.\n{error}");
            return Result.Succeeded;
        }

        if (latest <= current)
        {
            TaskDialog.Show("Check for Updates",
                $"You are up to date.\n\nInstalled version: {current.ToString(3)}\nLatest release: {latest.ToString(3)}");
            return Result.Succeeded;
        }

        var dialog = new TaskDialog("Check for Updates")
        {
            MainInstruction = $"Version {latest.ToString(3)} is available",
            MainContent = $"Installed version: {current.ToString(3)}\n\n" +
                          "Download the new installer, close Revit, and run it — " +
                          "it replaces the installed add-in in place.",
            CommonButtons = TaskDialogCommonButtons.Close,
        };
        dialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink1, "Open the download page");

        if (dialog.Show() == TaskDialogResult.CommandLink1)
            Process.Start(new ProcessStartInfo(UpdateChecker.ReleasesPage) { UseShellExecute = true });

        return Result.Succeeded;
    }
}
