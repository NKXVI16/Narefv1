using System.Collections.ObjectModel;
using Autodesk.Revit.DB;

namespace NarefDataExporter.Services;

/// <summary>Walks the document and groups model element instances by category and type.</summary>
public static class QuantityCollector
{
    private static readonly BuiltInParameter[] LevelParams =
    {
        BuiltInParameter.FAMILY_LEVEL_PARAM,
        BuiltInParameter.INSTANCE_REFERENCE_LEVEL_PARAM,
        BuiltInParameter.SCHEDULE_LEVEL_PARAM,
        BuiltInParameter.FAMILY_BASE_LEVEL_PARAM,
    };

    public static List<CategoryGroup> Collect(Document doc)
    {
        var elements = new FilteredElementCollector(doc)
            .WhereElementIsNotElementType()
            .WhereElementIsViewIndependent()
            .Where(e => e.Category is { CategoryType: CategoryType.Model, IsTagCategory: false }
                        && e.GetTypeId() != ElementId.InvalidElementId);

        var groups = new SortedDictionary<string, (long id, Dictionary<string, List<InstanceQuantity>> types)>();

        foreach (Element e in elements)
        {
            string categoryName = e.Category.Name;
            string typeName = (doc.GetElement(e.GetTypeId()) as ElementType)?.Name ?? "Unknown Type";

            if (!groups.TryGetValue(categoryName, out var group))
            {
                group = (e.Category.Id.Value, new Dictionary<string, List<InstanceQuantity>>());
                groups[categoryName] = group;
            }
            if (!group.types.TryGetValue(typeName, out var instances))
            {
                instances = new List<InstanceQuantity>();
                group.types[typeName] = instances;
            }

            instances.Add(new InstanceQuantity
            {
                ElementId = e.Id.Value,
                Level = ResolveLevel(doc, e),
                Length = ToMetric(GetDouble(e, BuiltInParameter.CURVE_ELEM_LENGTH, BuiltInParameter.INSTANCE_LENGTH_PARAM), UnitTypeId.Meters),
                Area = ToMetric(GetDouble(e, BuiltInParameter.HOST_AREA_COMPUTED), UnitTypeId.SquareMeters),
                Volume = ToMetric(GetDouble(e, BuiltInParameter.HOST_VOLUME_COMPUTED), UnitTypeId.CubicMeters),
            });
        }

        return groups.Select(g => new CategoryGroup
        {
            Name = g.Key,
            CategoryId = g.Value.id,
            Types = new ObservableCollection<TypeEntry>(
                g.Value.types.OrderBy(t => t.Key).Select(t => new TypeEntry
                {
                    Category = g.Key,
                    TypeName = t.Key,
                    Instances = t.Value,
                })),
        }).ToList();
    }

    private static string ResolveLevel(Document doc, Element e)
    {
        if (e.LevelId != ElementId.InvalidElementId && doc.GetElement(e.LevelId) is Level level)
            return level.Name;

        foreach (BuiltInParameter bip in LevelParams)
        {
            Parameter? p = e.get_Parameter(bip);
            if (p is { HasValue: true } && p.StorageType == StorageType.ElementId
                && doc.GetElement(p.AsElementId()) is Level paramLevel)
                return paramLevel.Name;
        }
        return "No Level";
    }

    private static double GetDouble(Element e, params BuiltInParameter[] candidates)
    {
        foreach (BuiltInParameter bip in candidates)
        {
            Parameter? p = e.get_Parameter(bip);
            if (p is { HasValue: true } && p.StorageType == StorageType.Double)
                return p.AsDouble();
        }
        return 0;
    }

    private static double ToMetric(double internalValue, ForgeTypeId unit) =>
        internalValue == 0 ? 0 : UnitUtils.ConvertFromInternalUnits(internalValue, unit);
}
