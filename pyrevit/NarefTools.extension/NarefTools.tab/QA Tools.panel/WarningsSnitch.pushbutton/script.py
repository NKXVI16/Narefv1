# -*- coding: utf-8 -*-
"""Report every model warning and optionally export the results to CSV.

Run this tool in any project model to group Revit warnings by their
description, print a clickable report of failing elements, and export
the warning data to CSV for a shareable QA record.
"""

__title__ = 'Warnings\nSnitch'
__author__ = 'Naref'

from pyrevit import revit, DB, forms, script
from naref_utils import export_rows_to_csv

doc = revit.doc
output = script.get_output()


def get_element_name(element_id):
    element = doc.GetElement(element_id)
    if element is None:
        return '<missing element>'
    try:
        if element.Name:
            return element.Name
    except Exception:
        pass
    return element.GetType().Name


def get_failing_elements(warning):
    try:
        return list(warning.GetFailingElements())
    except Exception:
        return []


def group_warnings(warnings):
    grouped = {}
    for warning in warnings:
        description = warning.GetDescriptionText()
        if description not in grouped:
            grouped[description] = []
        grouped[description].append(warning)
    return grouped


def print_report(grouped_warnings):
    output.print_md('# Warnings Snitch - {}'.format(doc.Title))
    total = sum([len(warnings) for warnings in grouped_warnings.values()])
    output.print_md('**{} warning(s)** grouped into **{} warning type(s)**.'.format(
        total, len(grouped_warnings)))

    for description in sorted(grouped_warnings.keys()):
        warnings = grouped_warnings[description]
        failing_ids = []
        for warning in warnings:
            failing_ids.extend(get_failing_elements(warning))

        output.print_md('## {} occurrence(s), {} failing element(s)'.format(
            len(warnings), len(failing_ids)))
        output.print_md(description)

        if not failing_ids:
            output.print_md('- No failing elements reported by Revit.')
            continue

        for element_id in failing_ids:
            output.print_md('- {} {}'.format(
                output.linkify(element_id), get_element_name(element_id)))


def build_csv_rows(grouped_warnings):
    rows = []
    for description in sorted(grouped_warnings.keys()):
        warnings = grouped_warnings[description]
        failing_ids = []
        for warning in warnings:
            failing_ids.extend(get_failing_elements(warning))

        if not failing_ids:
            rows.append([description, len(warnings), 0, '', ''])
            continue

        for element_id in failing_ids:
            rows.append([description, len(warnings), len(failing_ids),
                         element_id.IntegerValue,
                         get_element_name(element_id)])
    return rows


warnings = list(doc.GetWarnings())
if not warnings:
    forms.alert('No Revit warnings found in this model.', exitscript=True)

grouped = group_warnings(warnings)
print_report(grouped)

if forms.alert('Export Warnings Snitch report to CSV?',
               yes=True, no=True):
    export_rows_to_csv(
        ['Warning Description', 'Occurrence Count',
         'Failing Element Count', 'Element Id', 'Element Name'],
        build_csv_rows(grouped))
