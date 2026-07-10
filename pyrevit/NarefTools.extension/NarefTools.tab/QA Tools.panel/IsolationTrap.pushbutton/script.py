# -*- coding: utf-8 -*-
"""Isolate the selected elements in a dedicated 3D view.

Select one or more elements in any view, then run this tool.
It creates (or reuses) a 3D view named "Isolation Trap - <username>",
crops it to the selection with a section box, temporarily isolates
the selected elements, and switches you to that view for deeper
inspection and coordination.
"""

__title__ = '3D Isolation\nTrap'
__author__ = 'Naref'

from System.Collections.Generic import List

from pyrevit import revit, DB, forms

doc = revit.doc
uidoc = revit.uidoc

SECTION_BOX_OFFSET = 3.0  # feet of breathing room around the selection


def get_selected_element_ids():
    selection = revit.get_selection()
    if not selection or not selection.element_ids:
        forms.alert('Select at least one element first, then run the tool.',
                    exitscript=True)
    return list(selection.element_ids)


def get_3d_view_type():
    for vft in DB.FilteredElementCollector(doc).OfClass(DB.ViewFamilyType):
        if vft.ViewFamily == DB.ViewFamily.ThreeDimensional:
            return vft
    forms.alert('No 3D view family type found in this model.',
                exitscript=True)


def get_or_create_isolation_view(view_name):
    for view in DB.FilteredElementCollector(doc).OfClass(DB.View3D):
        if not view.IsTemplate and view.Name == view_name:
            return view
    view = DB.View3D.CreateIsometric(doc, get_3d_view_type().Id)
    view.Name = view_name
    return view


def combined_bounding_box(element_ids):
    box = None
    for eid in element_ids:
        element = doc.GetElement(eid)
        if element is None:
            continue
        el_box = element.get_BoundingBox(None)
        if el_box is None:
            continue
        if box is None:
            box = DB.BoundingBoxXYZ()
            box.Min = el_box.Min
            box.Max = el_box.Max
        else:
            box.Min = DB.XYZ(min(box.Min.X, el_box.Min.X),
                             min(box.Min.Y, el_box.Min.Y),
                             min(box.Min.Z, el_box.Min.Z))
            box.Max = DB.XYZ(max(box.Max.X, el_box.Max.X),
                             max(box.Max.Y, el_box.Max.Y),
                             max(box.Max.Z, el_box.Max.Z))
    return box


def apply_section_box(view, box):
    if box is None:
        return
    offset = DB.XYZ(SECTION_BOX_OFFSET, SECTION_BOX_OFFSET,
                    SECTION_BOX_OFFSET)
    box.Min = box.Min - offset
    box.Max = box.Max + offset
    view.IsSectionBoxActive = True
    view.SetSectionBox(box)


selected_ids = get_selected_element_ids()
username = doc.Application.Username or 'user'
target_view_name = 'Isolation Trap - {}'.format(username)

with revit.Transaction('3D Isolation Trap'):
    iso_view = get_or_create_isolation_view(target_view_name)
    apply_section_box(iso_view, combined_bounding_box(selected_ids))
    if iso_view.IsTemporaryHideIsolateActive():
        iso_view.DisableTemporaryViewMode(
            DB.TemporaryViewMode.TemporaryHideIsolate)
    id_collection = List[DB.ElementId](selected_ids)
    iso_view.IsolateElementsTemporary(id_collection)

uidoc.ActiveView = iso_view
uidoc.Selection.SetElementIds(List[DB.ElementId](selected_ids))
