using Autodesk.Revit.UI;

namespace NarefDataExporter;

/// <summary>
/// Bridges the modeless window and the Revit API: UI event handlers queue an
/// action here, and Revit executes it in a valid API context via ExternalEvent.
/// Must be constructed inside an API context (e.g. an IExternalCommand).
/// </summary>
public class ExternalEventRunner : IExternalEventHandler, IDisposable
{
    private readonly ExternalEvent _event;
    private Action<UIApplication>? _pending;

    public ExternalEventRunner()
    {
        _event = ExternalEvent.Create(this);
    }

    public void Run(Action<UIApplication> action)
    {
        _pending = action;
        _event.Raise();
    }

    public void Execute(UIApplication app)
    {
        Action<UIApplication>? action = _pending;
        _pending = null;
        try
        {
            action?.Invoke(app);
        }
        catch (Exception ex)
        {
            TaskDialog.Show("Data Exporter", ex.Message);
        }
    }

    public string GetName() => "NAref Data Exporter";

    public void Dispose() => _event.Dispose();
}
