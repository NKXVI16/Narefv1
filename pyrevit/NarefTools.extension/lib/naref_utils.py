# -*- coding: utf-8 -*-
"""Small shared helpers for NarefTools pyRevit scripts."""

import csv

from pyrevit import forms


def _csv_value(value):
    if value is None:
        text = ''
    else:
        text = unicode(value)
    try:
        return text.encode('utf-8')
    except Exception:
        return str(value)


def export_rows_to_csv(headers, rows):
    path = forms.save_file(file_ext='csv',
                           default_name='NarefTools_Report.csv',
                           title='Save CSV Report')
    if not path:
        return None

    try:
        with open(path, 'wb') as csv_file:
            writer = csv.writer(csv_file)
            writer.writerow([_csv_value(header) for header in headers])
            for row in rows:
                writer.writerow([_csv_value(value) for value in row])
    except Exception as err:
        forms.alert('Could not export CSV:\n{}'.format(err), exitscript=False)
        return None

    forms.alert('CSV exported:\n{}'.format(path))
    return path


def pick_category(prompt_categories_dict, title):
    picked = forms.SelectFromList.show(
        sorted(prompt_categories_dict.keys()),
        title=title,
        multiselect=True,
        button_name='Select categories')
    if not picked:
        return []
    return [(name, prompt_categories_dict[name]) for name in picked]
