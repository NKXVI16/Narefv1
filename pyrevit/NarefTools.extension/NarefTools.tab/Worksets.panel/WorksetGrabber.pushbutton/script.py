# -*- coding: utf-8 -*-
"""Select, review and optionally export elements from a user workset.

Run this tool in a workshared model to pick a workset, narrow its
elements by category and type, select the matching elements in Revit,
and export the reviewed element data to CSV for coordination.
"""

__title__ = 'Workset\nGrabber'
__author__ = 'Naref'

from System.Collections.Generic import List

from pyrevit import revit, DB, forms, script
from naref_utils import export_rows_to_csv, pick_category

doc = revit.doc
uidoc = revit.uidoc
output = script.get_output()


class WorksetOption(object):
    def __init__(self, workset, count):
        self.workset = workset
        self.count = count

    def __str__(self):
        return '{} ({} element(s))'.format(self.workset.Name, self.count)


def get_element_name(element):
    try:
        if element.Name:
            return element.Name
    except Exception:
        pass
    return element.GetType().Name


def get_element_category(element):
    if element.Category is None:
        return '<no category>'
    return element.Category.Name


def get_element_type_name(element):
    try:
        type_id = element.GetTypeId()
        if type_id == DB.ElementId.InvalidElementId:
            return '<no type>'
        element_type = doc.GetElement(type_id)
        if element_type is None:
            return '<missing type>'
        return element_type.Name
    except Exception:
        return '<no type>'


def get_workset_element_ids(workset_id):
    workset_filter = DB.ElementWorksetFilter(workset_id)
    return list(DB.FilteredElementCollector(doc)
                .WherePasses(workset_filter)
                .WhereElementIsNotElementType()
                .ToElementIds())


def get_workset_options():
    options = []
    worksets = DB.FilteredWorksetCollector(doc) \
                 .OfKind(DB.WorksetKind.UserWorkset) \
                 .ToWorksets()
    for workset in worksets:
        options.append(WorksetOption(workset,
                                     len(get_workset_element_ids(workset.Id))))
    return sorted(options, key=lambda option: option.workset.Name.lower())


def get_elements(element_ids):
    elements = []
    for element_id in element_ids:
        element = doc.GetElement(element_id)
        if element is not None:
            elements.append(element)
    return elements


def filter_by_category(elements):
    categories = {}
    for element in elements:
        categories[get_element_category(element)] = get_element_category(element)

    picked = pick_category(categories,
                           'Workset Grabber - filter by category')
    if not picked:
        return elements, 'All categories'

    names = set([name for name, _ in picked])
    return [element for element in elements
            if get_element_category(element) in names], ', '.join(sorted(names))


def filter_by_type(elements):
    type_names = sorted(set([get_element_type_name(element)
                             for element in elements]))
    if not type_names:
        return elements, 'All types'

    picked = forms.SelectFromList.show(
        type_names,
        title='Workset Grabber - filter by type',
        multiselect=True,
        button_name='Select types')
    if not picked:
        return elements, 'All types'

    names = set(picked)
    return [element for element in elements
            if get_element_type_name(element) in names], ', '.join(sorted(names))


def print_report(workset, elements, category_filter, type_filter):
    output.print_md('# Workset Grabber - {}'.format(workset.Name))
    output.print_md('Category filter: **{}**'.format(category_filter))
    output.print_md('Type filter: **{}**'.format(type_filter))
    output.print_md('**{} element(s)** matched.'.format(len(elements)))

    if not elements:
        output.print_md('No elements matched the selected filters.')
        return

    for element in elements:
        output.print_md('- {} **{}** | {} | {}'.format(
            output.linkify(element.Id), get_element_category(element),
            get_element_type_name(element), get_element_name(element)))


def build_csv_rows(workset, elements):
    rows = []
    for element in elements:
        rows.append([workset.Name, element.Id.IntegerValue,
                     get_element_category(element),
                     get_element_type_name(element),
                     get_element_name(element)])
    return rows


if not doc.IsWorkshared:
    forms.alert('Workset Grabber only works in workshared models.',
                exitscript=True)

workset_options = get_workset_options()
if not workset_options:
    forms.alert('No user worksets found in this model.', exitscript=True)

selected = forms.SelectFromList.show(
    workset_options,
    title='Workset Grabber - pick a workset',
    button_name='Grab workset elements')
if not selected:
    script.exit()

elements = get_elements(get_workset_element_ids(selected.workset.Id))
elements, category_filter = filter_by_category(elements)
elements, type_filter = filter_by_type(elements)

print_report(selected.workset, elements, category_filter, type_filter)

if elements:
    uidoc.Selection.SetElementIds(List[DB.ElementId](
        [element.Id for element in elements]))

    if forms.alert('Export Workset Grabber report to CSV?',
                   yes=True, no=True):
        export_rows_to_csv(
            ['Workset', 'Element Id', 'Category', 'Type', 'Element Name'],
            build_csv_rows(selected.workset, elements))
