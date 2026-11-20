"""
Shared helpers for HEAVEN & CO.'s headless Blender asset builders.

Conventions (Blender, Z-up): X = width, -Y = front, origin on the floor at
the piece's centre. The glTF exporter converts to Y-up with +Z front.
Every finished mesh gets cube-projected UVs at 1 UV unit = 1 m, so the web
app's procedural fabric/wood maps have one consistent texel density.
"""

import math

import bmesh
import bpy


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def material(name, rgb, roughness=0.8, metallic=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*rgb, 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    return m


def empty(name, parent=None, location=(0, 0, 0), rotation=(0, 0, 0)):
    e = bpy.data.objects.new(name, None)
    bpy.context.collection.objects.link(e)
    e.parent = parent
    e.location = location
    e.rotation_euler = rotation
    return e


def _activate(obj):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj


def finalize(obj, mat, parent, *, smooth=True, angle=None, uv_size=1.0):
    """Apply modifiers, shade, world-scale UVs, assign material, parent."""
    _activate(obj)
    bpy.ops.object.convert(target="MESH")
    if angle is not None:
        bpy.ops.object.shade_smooth_by_angle(angle=angle)
    elif smooth:
        bpy.ops.object.shade_smooth()
    bpy.ops.object.mode_set(mode="EDIT")
    bpy.ops.mesh.select_all(action="SELECT")
    bpy.ops.uv.cube_project(cube_size=uv_size)
    bpy.ops.object.mode_set(mode="OBJECT")
    obj.data.materials.clear()
    obj.data.materials.append(mat)
    obj.parent = parent
    return obj


def _soft(obj, bevel, levels=1, angle=50):
    b = obj.modifiers.new("seam", "BEVEL")
    b.width = bevel
    b.segments = 3
    b.limit_method = "ANGLE"
    b.angle_limit = math.radians(angle)
    if levels:
        s = obj.modifiers.new("smooth", "SUBSURF")
        s.levels = s.render_levels = levels


def inflate(obj, size, puff):
    """Dome each face of a subdivided box outward (edges stay put)."""
    half = [s / 2 for s in size]
    for v in obj.data.vertices:
        p = list(v.co)
        n = [max(-1.0, min(1.0, p[i] / half[i])) for i in range(3)]
        for a in range(3):
            b, c = [i for i in range(3) if i != a]
            w = abs(n[a]) ** 6 * (1 - n[b] ** 2) * (1 - n[c] ** 2)
            p[a] += math.copysign(puff[a] * w, n[a])
        v.co = p


def upholstery(name, size, location, parent, mat, *, bevel=0.04, puff=(0.01, 0.01, 0.01), rotation=(0, 0, 0)):
    """Soft upholstered (or foam) block: dense grid → inflate → bevel → subsurf."""
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
    _soft(o, bevel)
    finalize(o, mat, parent)
    o.location = location
    o.rotation_euler = rotation
    return o


def timber(name, size, location, parent, mat, *, bevel=0.004, rotation=(0, 0, 0)):
    """Machined timber section: crisp box with small eased arrises."""
    bpy.ops.mesh.primitive_cube_add(size=1)
    o = bpy.context.active_object
    o.name = o.data.name = name
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    b = o.modifiers.new("arris", "BEVEL")
    b.width = bevel
    b.segments = 2
    finalize(o, mat, parent, angle=math.radians(40))
    o.location = location
    o.rotation_euler = rotation
    return o


def cone(name, r_bottom, r_top, height, location, parent, mat, *, rotation=(0, 0, 0), vertices=24):
    """Tapered turned leg; origin at its centre."""
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=r_bottom, radius2=r_top, depth=height)
    o = bpy.context.active_object
    o.name = o.data.name = name
    finalize(o, mat, parent, angle=math.radians(40), uv_size=0.2)
    o.location = location
    o.rotation_euler = rotation
    return o


def tube(name, points, radius, parent, mat, *, smooth_curve=True, resolution=12, caps=True):
    """Round-section rod along a polyline (smoothed as a NURBS-like path)."""
    curve = bpy.data.curves.new(name, "CURVE")
    curve.dimensions = "3D"
    curve.bevel_depth = radius
    curve.bevel_resolution = 4
    curve.use_fill_caps = caps
    spline = curve.splines.new("NURBS" if smooth_curve and len(points) > 2 else "POLY")
    spline.points.add(len(points) - 1)
    for p, co in zip(spline.points, points):
        p.co = (*co, 1.0)
    if spline.type == "NURBS":
        spline.use_endpoint_u = True
        spline.order_u = min(4, len(points))
        spline.resolution_u = resolution
    o = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(o)
    return finalize(o, mat, parent, uv_size=0.3)


def round_block(name, radius, height, z_center, parent, mat, *, bulge_top=0.0, bevel=0.03, y=0.0, ry=None):
    """Cylinder/ellipse block with all-quad caps (square→disc mapping)."""
    ry = ry or radius
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
            nz = z + (bulge_top / (height / 2)) * (z ** 6) * max(0.0, 1 - dx * dx - dy * dy)
        v.co = (dx * radius, dy * ry, nz * height / 2)
    _soft(o, bevel)
    finalize(o, mat, parent)
    o.location = (0, y, z_center)
    return o


def surface(name, grid, parent, mat, *, thickness=0.03, levels=2, bevel=0.01):
    """Solidified quad surface from a 2D grid of (x, y, z) points [u][v]."""
    bm = bmesh.new()
    verts = [[bm.verts.new(p) for p in col] for col in grid]
    for i in range(len(verts) - 1):
        for j in range(len(verts[0]) - 1):
            bm.faces.new((verts[i][j], verts[i + 1][j], verts[i + 1][j + 1], verts[i][j + 1]))
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    o = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(o)
    solid = o.modifiers.new("thickness", "SOLIDIFY")
    solid.thickness = thickness
    solid.offset = 0
    solid.use_even_offset = True
    _soft(o, bevel, levels=levels, angle=40)
    return finalize(o, mat, parent)


def export(path, root=None):
    """Export everything, or only `root` and its descendants."""
    kwargs = dict(filepath=path, export_format="GLB", export_apply=True, export_yup=True, export_materials="EXPORT")
    if root is not None:
        bpy.ops.object.select_all(action="DESELECT")
        root.select_set(True)
        for c in root.children_recursive:
            c.select_set(True)
        kwargs["use_selection"] = True
    bpy.ops.export_scene.gltf(**kwargs)
    print(f"[forma] exported {path}")
