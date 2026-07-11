using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace NarefDataExporter.Setup;

/// <summary>
/// Console installer for the NAref Data Exporter Revit add-in.
/// Detects installed Revit versions from their Addins folders and copies the
/// matching build of the add-in into each. Run with /uninstall to remove.
/// </summary>
internal static class Program
{
    private const string AddinFileName = "NarefDataExporter.addin";
    private const string DllFolderName = "NarefDataExporter";
    private const string DllFileName = "NarefDataExporter.dll";

    // Which embedded payload serves which Revit year. 2025+ builds are .NET 8,
    // 2024 is .NET Framework 4.8.
    private static readonly Dictionary<int, string> PayloadByYear = new()
    {
        [2024] = "payload.2024.NarefDataExporter.dll",
        [2025] = "payload.2025.NarefDataExporter.dll",
        [2026] = "payload.2025.NarefDataExporter.dll",
    };

    private static int Main(string[] args)
    {
        Version version = Assembly.GetExecutingAssembly().GetName().Version ?? new Version(0, 0, 0);
        bool uninstall = args.Any(a =>
            a.Equals("/uninstall", StringComparison.OrdinalIgnoreCase) ||
            a.Equals("/u", StringComparison.OrdinalIgnoreCase));
        bool quiet = args.Any(a => a.Equals("/quiet", StringComparison.OrdinalIgnoreCase));

        Console.WriteLine("==============================================");
        Console.WriteLine($"  NAref Data Exporter {version.ToString(3)} — {(uninstall ? "Uninstaller" : "Installer")}");
        Console.WriteLine("  BOQ and QA-QC export for Autodesk Revit");
        Console.WriteLine("==============================================");
        Console.WriteLine();

        string addinsRoot = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Autodesk", "Revit", "Addins");

        List<int> detectedYears = PayloadByYear.Keys
            .Where(year => Directory.Exists(Path.Combine(addinsRoot, year.ToString())))
            .OrderBy(year => year)
            .ToList();

        if (detectedYears.Count == 0)
        {
            Console.WriteLine("No supported Revit versions were found.");
            Console.WriteLine($"Looked for: {string.Join(", ", PayloadByYear.Keys.OrderBy(y => y))}");
            Console.WriteLine($"under: {addinsRoot}");
            Console.WriteLine();
            Console.WriteLine("Start Revit once (so it creates its Addins folder) and run this installer again.");
            return Pause(quiet, 1);
        }

        Console.WriteLine($"Detected Revit: {string.Join(", ", detectedYears)}");
        Console.WriteLine();

        int failures = 0;
        foreach (int year in detectedYears)
        {
            string yearFolder = Path.Combine(addinsRoot, year.ToString());
            try
            {
                if (uninstall) Uninstall(yearFolder);
                else Install(yearFolder, PayloadByYear[year]);
                Console.WriteLine($"  [OK] Revit {year} — {(uninstall ? "removed" : "installed")}");
            }
            catch (Exception ex)
            {
                failures++;
                Console.WriteLine($"  [FAILED] Revit {year} — {ex.Message}");
                Console.WriteLine("           Close Revit and run the installer again.");
            }
        }

        Console.WriteLine();
        if (failures == 0 && !uninstall)
        {
            Console.WriteLine("Done. Start Revit and look for the \"NAref Tools\" ribbon tab.");
            Console.WriteLine("On first start, click \"Always Load\" in Revit's add-in security prompt.");
        }
        else if (failures == 0)
        {
            Console.WriteLine("Done. The add-in has been removed.");
        }
        return Pause(quiet, failures == 0 ? 0 : 1);
    }

    private static void Install(string yearFolder, string dllResource)
    {
        string dllFolder = Path.Combine(yearFolder, DllFolderName);
        Directory.CreateDirectory(dllFolder);
        WriteResource("payload." + AddinFileName, Path.Combine(yearFolder, AddinFileName));
        WriteResource(dllResource, Path.Combine(dllFolder, DllFileName));
    }

    private static void Uninstall(string yearFolder)
    {
        string addinPath = Path.Combine(yearFolder, AddinFileName);
        string dllFolder = Path.Combine(yearFolder, DllFolderName);
        if (File.Exists(addinPath)) File.Delete(addinPath);
        if (Directory.Exists(dllFolder)) Directory.Delete(dllFolder, recursive: true);
    }

    private static void WriteResource(string resourceName, string destination)
    {
        using Stream? stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
        if (stream is null)
            throw new InvalidOperationException($"Embedded payload \"{resourceName}\" is missing from the installer.");
        using FileStream file = File.Create(destination);
        stream.CopyTo(file);
    }

    private static int Pause(bool quiet, int exitCode)
    {
        if (!quiet)
        {
            Console.WriteLine();
            Console.Write("Press any key to close...");
            try { Console.ReadKey(intercept: true); } catch (InvalidOperationException) { /* no console input */ }
        }
        return exitCode;
    }
}
