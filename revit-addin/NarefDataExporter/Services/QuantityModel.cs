using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;

namespace NarefDataExporter.Services;

/// <summary>Quantities of a single element instance, converted to metric.</summary>
public class InstanceQuantity
{
    public long ElementId { get; init; }
    public string Level { get; init; } = "No Level";
    public double Length { get; init; }   // m
    public double Area { get; init; }     // m²
    public double Volume { get; init; }   // m³
}

/// <summary>One element type within a category — a row of the type table.</summary>
public class TypeEntry : INotifyPropertyChanged
{
    private bool _export;
    private bool _itemize;
    private bool _qaQc;

    public string Category { get; init; } = "";
    public string TypeName { get; init; } = "";
    public List<InstanceQuantity> Instances { get; init; } = new();

    public int Count => Instances.Count;
    public double TotalLength => Instances.Sum(i => i.Length);
    public double TotalArea => Instances.Sum(i => i.Area);
    public double TotalVolume => Instances.Sum(i => i.Volume);

    public bool Export { get => _export; set { _export = value; OnPropertyChanged(); } }
    public bool Itemize { get => _itemize; set { _itemize = value; OnPropertyChanged(); } }
    public bool QaQc { get => _qaQc; set { _qaQc = value; OnPropertyChanged(); } }

    public event PropertyChangedEventHandler? PropertyChanged;
    private void OnPropertyChanged([CallerMemberName] string? name = null) =>
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
}

public class CategoryGroup
{
    public string Name { get; init; } = "";
    public long CategoryId { get; init; }
    public ObservableCollection<TypeEntry> Types { get; init; } = new();
    public int InstanceCount => Types.Sum(t => t.Count);
    public override string ToString() => Name;
}
