"""
Renders the exploded sofa layout (Workbench) to check spacing before it is
animated on the web. Offsets mirror EXPLODE in src/animations/sofaStructureAnimation.js
(converted to Blender axes: web x → x, web y → z, web z → -y).
Usage: blender -b --python tools/blender/preview_exploded.py -- <in.glb> <out.png> [assembled]
"""
import sys

import bpy
from mathutils import Vector

args = sys.argv[sys.argv.index("--") + 1:]
src, out = args[:2]
assembled = len(args) > 2

# web-space offsets [x, y, z]
EXPLODE = {
    "Legs": (0, -0.32, 0),
    "SeatSupport": (0, 0.42, 0),
    "Padding": (0, 0.86, 0),
    "Upholstery": (0, 1.32, 0),
    "SeatCushion_L": (2.45, 0.05, 0.15),
    "SeatCushion_R": (2.45, 0.05, 0.15),
    "BackCushion_L": (2.45, 0.6, 0.4),
    "BackCushion_R": (2.45, 0.6, 0.4),
}
CHILD = {  # cover lifts off its core
    "SeatCushion_L_Cover": (0, 0.36, 0), "SeatCushion_R_Cover": (0, 0.36, 0),
    "BackCushion_L_Cover": (0, 0.36, 0), "BackCushion_R_Cover": (0, 0.36, 0),
}

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)
if not assembled:
    for table in (EXPLODE, CHILD):
        for name, (x, y, z) in table.items():
            o = bpy.data.objects.get(name)
            if o:
                o.location += Vector((x, -z, y)) if o.parent is None or o.parent.name != "SofaStructure" or True else Vector()

cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
bpy.context.collection.objects.link(cam)
cam.data.lens = 50
cam.location = Vector((3.7, -6.3, 2.6))  # web (3.7, 2.6, 6.3)
target = Vector((1.2, -0.1, 0.85))
cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
bpy.context.scene.camera = cam
sc = bpy.context.scene
sc.render.engine = "BLENDER_WORKBENCH"
sc.display.shading.light = "STUDIO"
sc.display.shading.color_type = "MATERIAL"
sc.display.shading.show_shadows = True
sc.display.shading.show_cavity = True
sc.render.resolution_x, sc.render.resolution_y = 1280, 720
sc.render.filepath = out
bpy.ops.render.render(write_still=True)
