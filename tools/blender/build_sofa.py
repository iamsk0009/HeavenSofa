"""
HEAVEN & CO. — two-seater sofa asset builder (Blender 4.x, headless).

Builds the Scene 01 sofa from soft, subdivided upholstery parts and exports a
GLB with one named mesh per component, grouped for the Phase 5 exploded view:

  Sofa
  ├── Legs          Leg_FL, Leg_FR, Leg_BL, Leg_BR
  ├── Frame         Base, Arm_L, Arm_R, Back
  ├── SeatCushions  SeatCushion_L, SeatCushion_R
  ├── BackCushions  BackCushion_L, BackCushion_R
  └── Pillows       Pillow

Materials are named Fabric / Accent / Wood; the web app swaps them for its own
PBR materials by name.

Usage:
  blender -b --python tools/blender/build_sofa.py -- public/models/sofa.glb

Coordinates (Blender, Z-up): X = width, -Y = front, Z = up, origin on the
floor at the sofa centre. The glTF exporter converts to Y-up / +Z front.
"""

import math
import sys

import bpy

out_path = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "sofa.glb"

bpy.ops.wm.read_factory_settings(use_empty=True)

# ── dimensions (metres) ────────────────────────────────────────────────
W, D = 1.92, 0.88           # overall width / depth
LEG_H = 0.16
BASE_H = 0.20
BASE_TOP = LEG_H + BASE_H   # 0.36
ARM_W, ARM_H = 0.17, 0.44
INNER_W = W - 2 * ARM_W     # 1.58
BACK_D, BACK_H = 0.18, 0.42
BACK_FRONT_Y = D / 2 - BACK_D  # front face of the back frame
SEAT_H = 0.15
SEAT_D = BACK_FRONT_Y + D / 2 - 0.02


# ── materials ─────────────────────────────────────────────────────────
def make_material(name, rgb, roughness):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    return m


FABRIC = make_material("Fabric", (0.69, 0.60, 0.47), 0.92)
ACCENT = make_material("Accent", (0.45, 0.17, 0.09), 0.9)
WOOD = make_material("Wood", (0.45, 0.28, 0.15), 0.55)


# ── helpers ───────────────────────────────────────────────────────────
def group(name, parent=None):
    e = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(e)
    e.parent = parent
    return e


def finalize(obj, material, parent, uv_size=1.0):
    """Apply modifiers, smooth-shade, world-scale UVs, assign material."""
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.convert(target="MESH")
    bpy.ops.object.shade_smooth()

    # Cube projection gives every part the same texel density, so the linen
    # weave has one consistent scale across the whole sofa.
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.cube_project(cube_size=uv_size)
    bpy.ops.object.mode_set(mode="OBJECT")

    obj.data.materials.clear()
    obj.data.materials.append(material)
    obj.parent = parent
    return obj


def inflate(obj, size, puff):
    """
    Dome every face of a subdivided box outward, like a filled cushion.
    Each axis' faces bulge by puff[axis] metres at their centre, falling to
    zero at the edges, so seams stay straight and crisp.
    """
    half = [s / 2 for s in size]
    for v in obj.data.vertices:
        p = list(v.co)
        n = [max(-1.0, min(1.0, p[i] / half[i])) for i in range(3)]
        for a in range(3):
            b, c = [i for i in range(3) if i != a]
            # weight ≈ 1 only on the faces perpendicular to axis a
            w = abs(n[a]) ** 6 * (1 - n[b] ** 2) * (1 - n[c] ** 2)
            p[a] += math.copysign(puff[a] * w, n[a])
        v.co = p


def upholstery(name, size, location, parent, *, bevel=0.04, puff=(0.01, 0.01, 0.01),
               rotation=(0, 0, 0), material=FABRIC):
    """
    Soft upholstered block:
      simple subdivision  → dense, even grid to deform
      inflate             → domed faces of a filled cushion (edges untouched)
      angle-limited bevel → rounded seams on the real edges only
      Catmull-Clark       → smooth, sewn-fabric surface
    `puff` = (x, y, z) bulge in metres at each face centre.
    """
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.active_object
    o.name = o.data.name = name
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    sub = o.modifiers.new("density", "SUBSURF")
    sub.subdivision_type = "SIMPLE"
    sub.levels = 3
    bpy.ops.object.convert(target="MESH")
    inflate(o, size, puff)

    bev = o.modifiers.new("seam", "BEVEL")
    bev.width = bevel
    bev.segments = 3
    bev.limit_method = "ANGLE"
    bev.angle_limit = math.radians(50)

    smooth = o.modifiers.new("smooth", "SUBSURF")
    smooth.levels = smooth.render_levels = 1

    finalize(o, material, parent)
    o.location = location
    o.rotation_euler = rotation
    return o


def leg(name, x, y, parent):
    bpy.ops.mesh.primitive_cone_add(vertices=24, radius1=0.012, radius2=0.021, depth=LEG_H)
    o = bpy.context.active_object
    o.name = o.data.name = name
    finalize(o, WOOD, parent, uv_size=0.2)
    o.location = (x, y, LEG_H / 2)
    # splay outward: feet move away from the centre
    o.rotation_euler = (math.copysign(0.07, y), -math.copysign(0.07, x), 0)
    return o


# ── build ─────────────────────────────────────────────────────────────
root = group("Sofa")
legs = group("Legs", root)
frame = group("Frame", root)
seats = group("SeatCushions", root)
backs = group("BackCushions", root)
pillows = group("Pillows", root)

lx, ly = W / 2 - 0.11, D / 2 - 0.1
leg("Leg_FL", -lx, -ly, legs)
leg("Leg_FR", lx, -ly, legs)
leg("Leg_BL", -lx, ly, legs)
leg("Leg_BR", lx, ly, legs)

upholstery("Base", (W, D, BASE_H), (0, 0, LEG_H + BASE_H / 2), frame, bevel=0.035, puff=(0.006, 0.01, 0.004))

for side, name in ((-1, "Arm_L"), (1, "Arm_R")):
    upholstery(name, (ARM_W, D, ARM_H), (side * (W / 2 - ARM_W / 2), 0, LEG_H + ARM_H / 2),
               frame, bevel=0.055, puff=(0.012, 0.008, 0.01))

upholstery("Back", (INNER_W, BACK_D, BACK_H), (0, D / 2 - BACK_D / 2, BASE_TOP + BACK_H / 2),
           frame, bevel=0.045, puff=(0.006, 0.012, 0.008))

seat_w = INNER_W / 2 - 0.006
seat_y = BACK_FRONT_Y - SEAT_D / 2
for side, name in ((-1, "SeatCushion_L"), (1, "SeatCushion_R")):
    upholstery(name, (seat_w, SEAT_D, SEAT_H), (side * INNER_W / 4, seat_y, BASE_TOP + SEAT_H / 2),
               seats, bevel=0.04, puff=(0.012, 0.018, 0.028))

back_w = INNER_W / 2 - 0.012
back_h = 0.38
for side, name in ((-1, "BackCushion_L"), (1, "BackCushion_R")):
    upholstery(name, (back_w, 0.17, back_h),
               (side * INNER_W / 4, BACK_FRONT_Y - 0.075, BASE_TOP + SEAT_H + back_h / 2 - 0.02),
               backs, bevel=0.045, puff=(0.014, 0.034, 0.014), rotation=(-0.16, 0, 0))

# Single accent pillow leaning into the right back cushion. Negative X/Z
# puff pinches the sides inward so the corners point, like a filled pillow.
upholstery("Pillow", (0.38, 0.05, 0.38), (0.52, BACK_FRONT_Y - 0.2, BASE_TOP + SEAT_H + 0.18),
           pillows, bevel=0.02, puff=(-0.035, 0.06, -0.035), rotation=(-0.3, 0, 0.14), material=ACCENT)

bpy.ops.export_scene.gltf(
    filepath=out_path,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_materials="EXPORT",
)
print(f"[build_sofa] exported {out_path}")
