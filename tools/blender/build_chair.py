"""
HEAVEN & CO. — sculptural accent (tub) chair asset builder (Blender 4.x, headless).

A continuous curved backrest shell that sweeps down into the arms, a domed
round seat cushion, an upholstered seat base and a recessed oak plinth.
One named mesh per component:

  AccentChair
  ├── Plinth      (Wood)
  ├── SeatBase    (Fabric)
  ├── Seat        (Fabric)
  └── Backrest    (Fabric)

Usage:
  blender -b --python tools/blender/build_chair.py -- public/models/accent_chair.glb

Coordinates (Blender, Z-up): -Y = front, origin on the floor at the centre.
"""

import math
import sys

import bmesh
import bpy

out_path = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "accent_chair.glb"
bpy.ops.wm.read_factory_settings(use_empty=True)

# ── dimensions (metres) ────────────────────────────────────────────────
R = 0.42            # outer shell radius → 0.84 m wide
SHELL_T = 0.11      # shell thickness
PLINTH_H = 0.07
SEAT_BASE_TOP = 0.30
SEAT_H = 0.13       # cushion thickness → seat height ≈ 0.45
H_ARM = 0.58        # shell top height at the arm ends
H_BACK = 0.77       # shell top height at the centre back
ARC = math.radians(250)  # shell wraps 250°, leaving a 110° opening at the front


def make_material(name, rgb, roughness):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    return m


FABRIC = make_material("Fabric", (0.58, 0.20, 0.09), 0.95)
WOOD = make_material("Wood", (0.45, 0.28, 0.15), 0.55)


def finalize(obj, material, parent):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.shade_smooth()
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.cube_project(cube_size=1.0)  # 1 UV unit = 1 m, consistent texel density
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.data.materials.clear()
    obj.data.materials.append(material)
    obj.parent = parent
    return obj


def add_soft_modifiers(obj, bevel, smooth_levels=1, angle=50):
    b = obj.modifiers.new("seam", "BEVEL")
    b.width = bevel
    b.segments = 3
    b.limit_method = "ANGLE"
    b.angle_limit = math.radians(angle)
    s = obj.modifiers.new("smooth", "SUBSURF")
    s.levels = s.render_levels = smooth_levels


def round_block(name, radius, height, z_center, parent, *, bulge_top=0.0, bevel=0.03,
                material=FABRIC, y=0.0):
    """
    Cylinder with all-quad topology: a subdivided cube whose (x, y) are mapped
    square → disc, so the caps subdivide cleanly (no triangle-fan pinching).
    """
    bpy.ops.mesh.primitive_cube_add(size=2)
    o = bpy.context.active_object
    o.name = o.data.name = name
    sub = o.modifiers.new("density", "SUBSURF")
    sub.subdivision_type = "SIMPLE"
    sub.levels = 3
    bpy.ops.object.convert(target="MESH")

    for v in o.data.vertices:
        x, yy, z = v.co
        dx = x * math.sqrt(max(0.0, 1 - yy * yy / 2))
        dy = yy * math.sqrt(max(0.0, 1 - x * x / 2))
        nz = z
        if bulge_top and z > 0:
            r2 = dx * dx + dy * dy
            nz = z + (bulge_top / (height / 2)) * (z ** 6) * max(0.0, 1 - r2)
        v.co = (dx * radius, dy * radius, nz * height / 2)

    add_soft_modifiers(o, bevel)
    finalize(o, material, parent)
    o.location = (0, y, z_center)
    return o


def backrest(parent):
    """
    Open curved shell: a quad strip swept around the back, its top edge rising
    from arm height at the front to full height at the back, with a slight
    barrel swell at mid-height. Solidified and subdivided into a soft,
    organic form.
    """
    n_a, n_z = 44, 8
    a0 = math.pi / 2 - ARC / 2   # back is +Y (angle 90°)
    bm = bmesh.new()
    grid = []
    for i in range(n_a):
        phi = a0 + ARC * i / (n_a - 1)
        back = ((1 + math.sin(phi)) / 2) ** 1.6       # 1 at the back, 0 at the arm ends
        top = H_ARM + (H_BACK - H_ARM) * back
        # arm ends roll down instead of stopping in a flat vertical cut
        end = min(i, n_a - 1 - i) / (n_a * 0.14)
        if end < 1:
            top -= 0.16 * (1 - math.sin(end * math.pi / 2)) ** 1.5
        col = []
        for j in range(n_z):
            t = j / (n_z - 1)
            r = R * (1 + 0.035 * math.sin(math.pi * t))  # barrel swell
            z = PLINTH_H + (top - PLINTH_H) * t
            col.append(bm.verts.new((r * math.cos(phi), r * math.sin(phi), z)))
        grid.append(col)
    for i in range(n_a - 1):
        for j in range(n_z - 1):
            bm.faces.new((grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]))

    mesh = bpy.data.meshes.new("Backrest")
    bm.to_mesh(mesh)
    bm.free()
    o = bpy.data.objects.new("Backrest", mesh)
    bpy.context.collection.objects.link(o)

    solid = o.modifiers.new("thickness", "SOLIDIFY")
    solid.thickness = SHELL_T
    solid.offset = -1          # grow inward (face normals point outward)
    solid.use_even_offset = True
    add_soft_modifiers(o, bevel=0.035, smooth_levels=2, angle=40)
    return finalize(o, FABRIC, parent)


# ── build ─────────────────────────────────────────────────────────────
root = bpy.data.objects.new("AccentChair", None)
bpy.context.collection.objects.link(root)

round_block("Plinth", 0.3, PLINTH_H, PLINTH_H / 2, root, bevel=0.01, material=WOOD)
round_block("SeatBase", R - 0.02, SEAT_BASE_TOP - PLINTH_H, (PLINTH_H + SEAT_BASE_TOP) / 2, root,
            bevel=0.04)
round_block("Seat", R - SHELL_T + 0.02, SEAT_H, SEAT_BASE_TOP + SEAT_H / 2, root,
            bulge_top=0.03, bevel=0.045, y=-0.015)
backrest(root)

bpy.ops.export_scene.gltf(
    filepath=out_path,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_materials="EXPORT",
)
print(f"[build_chair] exported {out_path}")
