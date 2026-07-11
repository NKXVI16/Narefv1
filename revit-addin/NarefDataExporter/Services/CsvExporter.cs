using System.Globalization;
using System.IO;
using System.Text;

namespace NarefDataExporter.Services;

public class ExportOptions
{
    public bool IncludeCount { get; set; } = true;
    public bool IncludeLength { get; set; }
    public bool IncludeArea { get; set; }
    public bool IncludeVolume { get; set; } = true;
    public bool BreakdownByLevel { get; set; }
    public bool ItemizeAll { get; set; }
    public int DecimalPlaces { get; set; } = 2;
}

/// <summary>Builds BOQ / QA-QC tables and writes them as CSV.</summary>
public static class CsvExporter
{
    public static List<string[]> BuildBoqRows(IEnumerable<TypeEntry> selection, ExportOptions options)
    {
        var header = new List<string> { "Category", "Type Name" };
        if (options.BreakdownByLevel) header.Add("Level");
        if (options.IncludeCount) header.Add("Count");
        if (options.IncludeLength) header.Add("Length (m)");
        if (options.IncludeArea) header.Add("Area (m²)");
        if (options.IncludeVolume) header.Add("Volume (m³)");
        var rows = new List<string[]> { header.ToArray() };

        foreach (TypeEntry type in selection.Where(t => t.Export))
        {
            var groups = options.BreakdownByLevel
                ? type.Instances.GroupBy(i => i.Level).OrderBy(g => g.Key, StringComparer.OrdinalIgnoreCase)
                : type.Instances.GroupBy(_ => "");

            foreach (var group in groups)
            {
                if (options.ItemizeAll || type.Itemize)
                {
                    foreach (InstanceQuantity inst in group)
                    {
                        var row = new List<string> { type.Category, $"{type.TypeName} [{inst.ElementId}]" };
                        if (options.BreakdownByLevel) row.Add(group.Key);
                        if (options.IncludeCount) row.Add("1");
                        if (options.IncludeLength) row.Add(Fmt(inst.Length, options));
                        if (options.IncludeArea) row.Add(Fmt(inst.Area, options));
                        if (options.IncludeVolume) row.Add(Fmt(inst.Volume, options));
                        rows.Add(row.ToArray());
                    }
                }
                else
                {
                    var row = new List<string> { type.Category, type.TypeName };
                    if (options.BreakdownByLevel) row.Add(group.Key);
                    if (options.IncludeCount) row.Add(group.Count().ToString(CultureInfo.InvariantCulture));
                    if (options.IncludeLength) row.Add(Fmt(group.Sum(i => i.Length), options));
                    if (options.IncludeArea) row.Add(Fmt(group.Sum(i => i.Area), options));
                    if (options.IncludeVolume) row.Add(Fmt(group.Sum(i => i.Volume), options));
                    rows.Add(row.ToArray());
                }
            }
        }
        return rows;
    }

    public static List<string[]> BuildQaQcRows(IEnumerable<TypeEntry> selection)
    {
        var rows = new List<string[]>
        {
            new[] { "Category", "Type Name", "Instances", "Zero-Volume Instances", "Missing Level", "Volume Outliers (±25% of type mean)", "Status" },
        };

        foreach (TypeEntry type in selection.Where(t => t.QaQc))
        {
            int zeroVolume = type.Instances.Count(i => i.Volume <= 0);
            int missingLevel = type.Instances.Count(i => i.Level == "No Level");
            double mean = type.Count > 0 ? type.TotalVolume / type.Count : 0;
            int outliers = mean > 0
                ? type.Instances.Count(i => Math.Abs(i.Volume - mean) / mean > 0.25)
                : 0;
            string status = zeroVolume + missingLevel + outliers > 0 ? "REVIEW" : "PASS";

            rows.Add(new[]
            {
                type.Category, type.TypeName,
                type.Count.ToString(CultureInfo.InvariantCulture),
                zeroVolume.ToString(CultureInfo.InvariantCulture),
                missingLevel.ToString(CultureInfo.InvariantCulture),
                outliers.ToString(CultureInfo.InvariantCulture),
                status,
            });
        }
        return rows;
    }

    public static void Write(List<string[]> rows, string filePath)
    {
        var sb = new StringBuilder();
        foreach (string[] row in rows)
            sb.AppendLine(string.Join(",", row.Select(Escape)));
        // UTF-8 BOM so Excel renders m²/m³ correctly.
        File.WriteAllText(filePath, sb.ToString(), new UTF8Encoding(true));
    }

    private static string Fmt(double value, ExportOptions options) =>
        value.ToString("F" + options.DecimalPlaces, CultureInfo.InvariantCulture);

    private static string Escape(string value) =>
        value.IndexOfAny(new[] { ',', '"', '\n' }) >= 0
            ? "\"" + value.Replace("\"", "\"\"") + "\""
            : value;
}
