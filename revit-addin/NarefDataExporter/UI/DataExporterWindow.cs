using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using Autodesk.Revit.DB;
using Autodesk.Revit.UI;
using Microsoft.Win32;
using NarefDataExporter.Services;
using Binding = System.Windows.Data.Binding;
using Grid = System.Windows.Controls.Grid;
using TextBox = System.Windows.Controls.TextBox;
using ComboBox = System.Windows.Controls.ComboBox;
using CheckBox = System.Windows.Controls.CheckBox;
using TabControl = System.Windows.Controls.TabControl;
using Color = System.Windows.Media.Color;

namespace NarefDataExporter.UI;

/// <summary>
/// The Data Exporter dialog: model categories on the left, a type table with
/// Export / Itemize / QA-QC columns in the middle, export options on the right.
/// Built in code (no XAML) so the project compiles on any OS.
/// The window is modeless; Revit API work is marshalled through ExternalEventRunner.
/// </summary>
public class DataExporterWindow : Window
{
    private static readonly Brush Cream = Brush("#F5F0E8");
    private static readonly Brush Ink = Brush("#1A1A14");
    private static readonly Brush Muted = Brush("#8A8A7A");
    private static readonly Brush Body = Brush("#4A4A3A");
    private static readonly Brush Line = Brush("#DDD8CC");
    private static readonly Brush Ok = Brush("#4A8A6A");

    private readonly ExternalEventRunner _runner;
    private string _documentTitle;
    private List<CategoryGroup> _categories;
    private readonly ObservableCollection<TypeEntry> _visibleTypes = new();
    private bool _suppressSelectAll;
    private readonly TextBlock _docTitleText = new() { FontSize = 12, VerticalAlignment = VerticalAlignment.Bottom, Margin = new Thickness(16, 0, 0, 2) };

    private readonly ListBox _categoryList = new() { BorderThickness = new Thickness(0), DisplayMemberPath = "Name" };
    private readonly CheckBox _selectAll = new() { Content = "Select all", VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(0, 0, 12, 0) };
    private readonly TextBox _searchBox = new() { Width = 240, Padding = new Thickness(5, 3, 5, 3), VerticalContentAlignment = VerticalAlignment.Center, HorizontalAlignment = HorizontalAlignment.Left };
    private readonly TextBlock _typesCount = new() { Foreground = Muted, FontSize = 11, VerticalAlignment = VerticalAlignment.Center };
    private readonly DataGrid _typesGrid = new()
    {
        AutoGenerateColumns = false,
        CanUserAddRows = false,
        CanUserDeleteRows = false,
        HeadersVisibility = DataGridHeadersVisibility.Column,
        GridLinesVisibility = DataGridGridLinesVisibility.Horizontal,
        HorizontalGridLinesBrush = Brush("#EEE8E0"),
        BorderThickness = new Thickness(0),
        RowHeight = 26,
        SelectionMode = DataGridSelectionMode.Single,
    };

    private readonly TabControl _modeTabs = new() { BorderThickness = new Thickness(0), Background = Brushes.Transparent, Margin = new Thickness(0, 0, 0, 10) };
    private readonly CheckBox _countCheck = OptionCheck("Count", true);
    private readonly CheckBox _lengthCheck = OptionCheck("Length", false);
    private readonly CheckBox _areaCheck = OptionCheck("Area", false);
    private readonly CheckBox _volumeCheck = OptionCheck("Volume", true);
    private readonly CheckBox _byLevelCheck = OptionCheck("Breakdown aggregated BOQ by Level", false);
    private readonly CheckBox _itemizeAllCheck = OptionCheck("Itemize instances for all selected types", false);
    private readonly ComboBox _decimalsCombo = new() { Width = 55, SelectedIndex = 2 };

    private readonly TextBlock _previewTitle = new() { Text = "Click a type row to preview.", FontSize = 12, Foreground = Body, TextWrapping = TextWrapping.Wrap, Margin = new Thickness(0, 0, 0, 6) };
    private readonly TextBlock _previewLength = new() { FontSize = 12, Foreground = Body };
    private readonly TextBlock _previewArea = new() { FontSize = 12, Foreground = Body };
    private readonly TextBlock _previewVolume = new() { FontSize = 12, Foreground = Body };
    private readonly TextBlock _statusText = new() { VerticalAlignment = VerticalAlignment.Center, Foreground = Ok, FontSize = 12 };

    public DataExporterWindow(string documentTitle, List<CategoryGroup> categories, ExternalEventRunner runner)
    {
        _documentTitle = documentTitle;
        _categories = categories;
        _runner = runner;
        _docTitleText.Foreground = Muted;
        _docTitleText.Text = documentTitle;

        Title = "Data Exporter — BOQ and QA-QC export";
        Width = 980; Height = 620; MinWidth = 860; MinHeight = 520;
        WindowStartupLocation = WindowStartupLocation.CenterOwner;
        Background = Cream;

        BuildTypeGridColumns();
        Content = BuildLayout();

        _categoryList.ItemsSource = _categories;
        _typesGrid.ItemsSource = _visibleTypes;

        _categoryList.SelectionChanged += (_, _) => { _searchBox.Text = ""; RefreshVisibleTypes(); };
        _searchBox.TextChanged += (_, _) => RefreshVisibleTypes();
        _selectAll.Checked += SelectAllToggled;
        _selectAll.Unchecked += SelectAllToggled;
        _typesGrid.SelectionChanged += (_, _) => RefreshPreview();
        _decimalsCombo.SelectionChanged += (_, _) => RefreshPreview();

        if (_categories.Count > 0) _categoryList.SelectedIndex = 0;
    }

    // ── Layout ────────────────────────────────────────────────────────────

    private UIElement BuildLayout()
    {
        var root = new Grid { Margin = new Thickness(12) };
        root.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });
        root.RowDefinitions.Add(new RowDefinition { Height = new GridLength(1, GridUnitType.Star) });
        root.RowDefinitions.Add(new RowDefinition { Height = GridLength.Auto });

        // Header
        var header = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(2, 0, 0, 10) };
        header.Children.Add(new TextBlock { Text = "Data Exporter", FontSize = 18, Foreground = Ink, FontWeight = FontWeights.SemiBold });
        header.Children.Add(new TextBlock { Text = "·  BOQ and QA-QC export", FontSize = 12, Foreground = Muted, VerticalAlignment = VerticalAlignment.Bottom, Margin = new Thickness(10, 0, 0, 2) });
        header.Children.Add(_docTitleText);
        Grid.SetRow(header, 0);
        root.Children.Add(header);

        // Three panels
        var panels = new Grid();
        panels.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(230) });
        panels.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
        panels.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(290) });
        Grid.SetRow(panels, 1);
        root.Children.Add(panels);

        panels.Children.Add(Panel(0, BuildCategoryPanel()));
        panels.Children.Add(Panel(1, BuildTypesPanel()));
        panels.Children.Add(Panel(2, BuildOptionsPanel()));

        // Footer
        var footer = new Grid { Margin = new Thickness(0, 10, 0, 0) };
        footer.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
        footer.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        footer.Children.Add(_statusText);

        var buttons = new StackPanel { Orientation = Orientation.Horizontal };
        buttons.Children.Add(FooterButton("Refresh Model Data", RefreshModelData));
        buttons.Children.Add(FooterButton("Highlight Selected Category", HighlightCategory));
        var exportButton = FooterButton("Export", Export);
        exportButton.Background = Ink;
        exportButton.Foreground = Cream;
        exportButton.Padding = new Thickness(24, 6, 24, 6);
        buttons.Children.Add(exportButton);
        var closeButton = FooterButton("Close", () => Close());
        closeButton.Margin = new Thickness(0);
        buttons.Children.Add(closeButton);
        Grid.SetColumn(buttons, 1);
        footer.Children.Add(buttons);
        Grid.SetRow(footer, 2);
        root.Children.Add(footer);

        return root;
    }

    private UIElement BuildCategoryPanel()
    {
        var panel = new DockPanel();
        var label = SectionLabel("MODEL CATEGORY");
        DockPanel.SetDock(label, Dock.Top);
        panel.Children.Add(label);
        panel.Children.Add(_categoryList);
        return panel;
    }

    private UIElement BuildTypesPanel()
    {
        var panel = new DockPanel();

        var toolbar = new Grid { Margin = new Thickness(0, 0, 0, 8) };
        toolbar.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        toolbar.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
        toolbar.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
        toolbar.Children.Add(_selectAll);
        Grid.SetColumn(_searchBox, 1);
        toolbar.Children.Add(_searchBox);
        Grid.SetColumn(_typesCount, 2);
        toolbar.Children.Add(_typesCount);
        DockPanel.SetDock(toolbar, Dock.Top);
        panel.Children.Add(toolbar);

        panel.Children.Add(_typesGrid);
        return panel;
    }

    private UIElement BuildOptionsPanel()
    {
        var panel = new StackPanel();
        panel.Children.Add(SectionLabel("EXPORT OPTIONS"));

        // BOQ tab
        var boqPanel = new StackPanel { Margin = new Thickness(0, 10, 0, 0) };
        var quantityRow = new WrapPanel();
        quantityRow.Children.Add(_countCheck);
        quantityRow.Children.Add(_lengthCheck);
        quantityRow.Children.Add(_areaCheck);
        quantityRow.Children.Add(_volumeCheck);
        boqPanel.Children.Add(quantityRow);
        boqPanel.Children.Add(_byLevelCheck);
        boqPanel.Children.Add(_itemizeAllCheck);
        var csvLabel = SectionLabel("CSV OPTIONS");
        csvLabel.Margin = new Thickness(0, 8, 0, 6);
        boqPanel.Children.Add(csvLabel);
        var decimalsRow = new StackPanel { Orientation = Orientation.Horizontal };
        decimalsRow.Children.Add(new TextBlock { Text = "Decimal places", VerticalAlignment = VerticalAlignment.Center, Margin = new Thickness(0, 0, 8, 0) });
        foreach (int d in new[] { 0, 1, 2, 3 }) _decimalsCombo.Items.Add(d);
        _decimalsCombo.SelectedIndex = 2;
        decimalsRow.Children.Add(_decimalsCombo);
        boqPanel.Children.Add(decimalsRow);
        _modeTabs.Items.Add(new TabItem { Header = "BOQ", Content = boqPanel });

        // QA-QC tab
        _modeTabs.Items.Add(new TabItem
        {
            Header = "QA-QC",
            Content = new TextBlock
            {
                Margin = new Thickness(0, 10, 0, 0),
                TextWrapping = TextWrapping.Wrap,
                Foreground = Body,
                FontSize = 12,
                Text = "Exports a QA-QC report for every type ticked in the QA-QC column: instance counts, " +
                       "zero-volume elements, elements without a level, and volume outliers beyond ±25% of the type mean.",
            },
        });
        panel.Children.Add(_modeTabs);

        panel.Children.Add(SectionLabel("PREVIEW / GEOMETRY (SELECTED ITEM)"));
        var previewStack = new StackPanel();
        previewStack.Children.Add(_previewTitle);
        previewStack.Children.Add(_previewLength);
        previewStack.Children.Add(_previewArea);
        previewStack.Children.Add(_previewVolume);
        panel.Children.Add(new Border
        {
            BorderBrush = Brush("#EEE8E0"),
            BorderThickness = new Thickness(1),
            Padding = new Thickness(10),
            Margin = new Thickness(0, 0, 0, 10),
            Child = previewStack,
        });
        return panel;
    }

    private void BuildTypeGridColumns()
    {
        _typesGrid.Columns.Add(CheckColumn("Export", nameof(TypeEntry.Export), 55));
        _typesGrid.Columns.Add(new DataGridTextColumn
        {
            Header = "Type Name",
            Binding = new Binding(nameof(TypeEntry.TypeName)),
            Width = new DataGridLength(1, DataGridLengthUnitType.Star),
            IsReadOnly = true,
        });
        _typesGrid.Columns.Add(new DataGridTextColumn
        {
            Header = "Count",
            Binding = new Binding(nameof(TypeEntry.Count)),
            Width = new DataGridLength(55),
            IsReadOnly = true,
        });
        _typesGrid.Columns.Add(CheckColumn("Itemize", nameof(TypeEntry.Itemize), 58));
        _typesGrid.Columns.Add(CheckColumn("QA-QC", nameof(TypeEntry.QaQc), 55));
    }

    // ── Behaviour ─────────────────────────────────────────────────────────

    private CategoryGroup? ActiveCategory => _categoryList.SelectedItem as CategoryGroup;

    private void RefreshVisibleTypes()
    {
        _visibleTypes.Clear();
        if (ActiveCategory is null) return;

        string query = _searchBox.Text.Trim();
        foreach (TypeEntry type in ActiveCategory.Types)
        {
            if (query.Length == 0 || type.TypeName.IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0)
                _visibleTypes.Add(type);
        }
        _typesCount.Text = $"Types: {_visibleTypes.Count}";

        _suppressSelectAll = true;
        _selectAll.IsChecked = _visibleTypes.Count > 0 && _visibleTypes.All(t => t.Export);
        _suppressSelectAll = false;
    }

    private void SelectAllToggled(object sender, RoutedEventArgs e)
    {
        if (_suppressSelectAll) return;
        bool value = _selectAll.IsChecked == true;
        foreach (TypeEntry type in _visibleTypes) type.Export = value;
    }

    private void RefreshPreview()
    {
        if (_typesGrid.SelectedItem is not TypeEntry type)
        {
            _previewTitle.Text = "Click a type row to preview.";
            _previewLength.Text = _previewArea.Text = _previewVolume.Text = "";
            return;
        }
        string f = "F" + Math.Max(_decimalsCombo.SelectedIndex, 0);
        _previewTitle.Text = $"{type.TypeName} · {type.Count} instances";
        _previewLength.Text = $"Length:  {type.TotalLength.ToString(f)} m";
        _previewArea.Text = $"Area:  {type.TotalArea.ToString(f)} m²";
        _previewVolume.Text = $"Volume:  {type.TotalVolume.ToString(f)} m³";
    }

    private void HighlightCategory()
    {
        if (ActiveCategory is null) return;
        long categoryId = ActiveCategory.CategoryId;
        string categoryName = ActiveCategory.Name;

        // The window is modeless, so Revit API calls must run inside an API context.
        _runner.Run(app =>
        {
            UIDocument? uiDocument = app.ActiveUIDocument;
            if (uiDocument is null) return;
            var ids = new FilteredElementCollector(uiDocument.Document)
                .OfCategoryId(new ElementId(categoryId))
                .WhereElementIsNotElementType()
                .ToElementIds();
            uiDocument.Selection.SetElementIds(ids);
            _statusText.Text = $"{ids.Count} element(s) of \"{categoryName}\" selected in the model.";
        });
    }

    private void RefreshModelData()
    {
        _runner.Run(app =>
        {
            UIDocument? uiDocument = app.ActiveUIDocument;
            if (uiDocument is null) return;
            _documentTitle = uiDocument.Document.Title;
            _categories = QuantityCollector.Collect(uiDocument.Document);
            _docTitleText.Text = _documentTitle;
            _categoryList.ItemsSource = _categories;
            if (_categories.Count > 0) _categoryList.SelectedIndex = 0;
            RefreshVisibleTypes();
            _statusText.Text = $"Model data refreshed from \"{_documentTitle}\".";
        });
    }

    private void Export()
    {
        bool isBoq = _modeTabs.SelectedIndex == 0;
        var allTypes = _categories.SelectMany(c => c.Types).ToList();

        var options = new ExportOptions
        {
            IncludeCount = _countCheck.IsChecked == true,
            IncludeLength = _lengthCheck.IsChecked == true,
            IncludeArea = _areaCheck.IsChecked == true,
            IncludeVolume = _volumeCheck.IsChecked == true,
            BreakdownByLevel = _byLevelCheck.IsChecked == true,
            ItemizeAll = _itemizeAllCheck.IsChecked == true,
            DecimalPlaces = Math.Max(_decimalsCombo.SelectedIndex, 0),
        };

        List<string[]> rows = isBoq
            ? CsvExporter.BuildBoqRows(allTypes, options)
            : CsvExporter.BuildQaQcRows(allTypes);

        if (rows.Count <= 1)
        {
            TaskDialog.Show("Data Exporter",
                $"No types are marked for {(isBoq ? "Export" : "QA-QC")} yet — tick them in the table first.");
            return;
        }

        var dialog = new SaveFileDialog
        {
            Filter = "CSV files (*.csv)|*.csv",
            FileName = $"{(isBoq ? "BOQ" : "QAQC")}_{_documentTitle}_{DateTime.Now:yyyy-MM-dd}.csv",
        };
        if (dialog.ShowDialog(this) != true) return;

        try
        {
            CsvExporter.Write(rows, dialog.FileName);
            _statusText.Text = $"{rows.Count - 1} row(s) exported to {dialog.FileName}";
        }
        catch (Exception ex)
        {
            TaskDialog.Show("Data Exporter", "Export failed: " + ex.Message);
        }
    }

    // ── Small factories ───────────────────────────────────────────────────

    private static Brush Brush(string hex)
    {
        var brush = new SolidColorBrush((Color)ColorConverter.ConvertFromString(hex));
        brush.Freeze();
        return brush;
    }

    private static TextBlock SectionLabel(string text) =>
        new() { Text = text, FontSize = 10, Foreground = Muted, Margin = new Thickness(0, 0, 0, 6) };

    private static CheckBox OptionCheck(string content, bool isChecked) =>
        new() { Content = content, IsChecked = isChecked, Margin = new Thickness(0, 0, 12, 8), VerticalContentAlignment = VerticalAlignment.Center };

    private static Border Panel(int column, UIElement child)
    {
        var border = new Border
        {
            Background = Brushes.White,
            BorderBrush = Line,
            BorderThickness = column == 1 ? new Thickness(0, 1, 0, 1) : new Thickness(1),
            Padding = new Thickness(12, 10, 12, 10),
            Child = child,
        };
        Grid.SetColumn(border, column);
        return border;
    }

    private static Button FooterButton(string content, Action onClick)
    {
        var button = new Button { Content = content, Padding = new Thickness(14, 6, 14, 6), Margin = new Thickness(0, 0, 8, 0) };
        button.Click += (_, _) => onClick();
        return button;
    }

    private static DataGridCheckBoxColumn CheckColumn(string header, string property, double width) =>
        new()
        {
            Header = header,
            Binding = new Binding(property) { UpdateSourceTrigger = UpdateSourceTrigger.PropertyChanged },
            Width = new DataGridLength(width),
        };
}
