# -*- coding: utf-8 -*-
"""Find elements in the active view that are missing tags.

Pick one or more taggable categories and the tool scans the active
view, compares elements against the tags placed in that view, and
reports every untagged element with a clickable link so you can jump
straight to it. Optionally selects all offenders when done.
"""

__title__ = 'Taggles\nShame'
__author__ = 'Naref'

from System.Collections.Generic import List

from pyrevit import revit, DB, forms, script

doc = revit.doc
uidoc = revit.uidoc
output = script.get_output()

# Taggable categories offered to the user, mapped to BuiltInCategory.
CATEGORY_OPTIONS = {
    'Doors': DB.BuiltInCategory.OST_Doors,
    'Windows': DB.BuiltInCategory.OST_Windows,
    'Walls': DB.BuiltInCategory.OST_Walls,
    'Rooms': DB.BuiltInCategory.OST_Rooms,
    'Furniture': DB.BuiltInCategory.OST_Furniture,
    'Casework': DB.BuiltInCategory.OST_Casework,
    'Plumbing Fixtures': DB.BuiltInCategory.OST_PlumbingFixtures,
    'Mechanical Equipment': DB.BuiltInCategory.OST_MechanicalEquipment,
    'Electrical Fixtures': DB.BuiltInCategory.OST_ElectricalFixtures,
    'Lighting Fixtures': DB.BuiltInCategory.OST_LightingFixtures,
    'Generic Models': DB.BuiltInCategory.OST_GenericModel,
    'Specialty Equipment': DB.BuiltInCategory.OST_SpecialityEquipment,
    'Structural Framing': DB.BuiltInCategory.OST_StructuralFraming,
    'Structural Columns': DB.BuiltInCategory.OST_StructuralColumns,
}


def get_tagged_element_ids(view):
    """Collect ids of every element that already has a tag in the view."""
    tagged_ids = set()

    for tag in DB.FilteredElementCollector(doc, view.Id) \
                 .OfClass(DB.IndependentTag) \
                 .ToElements():
        try:
            # Revit 2022+ (a tag can reference multiple elements)
            for eid in tag.GetTaggedLocalElementIds():
                tagged_ids.add(eid.IntegerValue)
        except AttributeError:
            eid = tag.TaggedLocalElementId
            if eid != DB.ElementId.InvalidElementId:
                tagged_ids.add(eid.IntegerValue)

    # Room tags are SpatialElementTags, collected separately.
    for room_tag in DB.FilteredElementCollector(doc, view.Id) \
                      .OfCategory(DB.BuiltInCategory.OST_RoomTags) \
                      .WhereElementIsNotElementType() \
                      .ToElements():
        try:
            if room_tag.Room is not None:
                tagged_ids.add(room_tag.Room.Id.IntegerValue)
        except Exception:
            pass

    return tagged_ids


def find_untagged(view, categories, tagged_ids):
    untagged = []
    for label, bic in categories:
        elements = DB.FilteredElementCollector(doc, view.Id) \
                     .OfCategory(bic) \
                     .WhereElementIsNotElementType() \
                     .ToElements()
        for element in elements:
            if element.Id.IntegerValue not in tagged_ids:
                untagged.append((label, element))
    return untagged


active_view = doc.ActiveView
if active_view.IsTemplate or not active_view.CanBePrinted:
    forms.alert('Run this tool in a graphical project view '
                '(plan, section, elevation or 3D).', exitscript=True)

picked = forms.SelectFromList.show(
    sorted(CATEGORY_OPTIONS.keys()),
    title='Taggles Shame - pick categories to check',
    multiselect=True,
    button_name='Check for missing tags')
if not picked:
    script.exit()

categories = [(name, CATEGORY_OPTIONS[name]) for name in picked]
tagged_ids = get_tagged_element_ids(active_view)
untagged = find_untagged(active_view, categories, tagged_ids)

output.print_md('# Taggles Shame - "{}"'.format(active_view.Name))
output.print_md('Categories checked: **{}**'.format(', '.join(picked)))

if not untagged:
    output.print_md('## All elements are tagged. Nothing to be '
                    'ashamed of.')
    script.exit()

output.print_md('## {} untagged element(s) found:'.format(len(untagged)))
for label, element in untagged:
    name = element.Name or '<unnamed>'
    output.print_md('- {} **{}** | {}'.format(
        output.linkify(element.Id), label, name))

if forms.alert('{} untagged element(s) found.\n\n'
               'Select them all in the view?'.format(len(untagged)),
               yes=True, no=True):
    ids = List[DB.ElementId]([element.Id for _, element in untagged])
    uidoc.Selection.SetElementIds(ids)
