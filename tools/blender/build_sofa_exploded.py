"""
HEAVEN & CO. — construction-accurate sofa for the "Under the surface" exploded view.

Same outer design and dimensions as build_sofa.py, but built like a real
upholstered sofa, every layer a separate named node:

  SofaStructure
  ├── Legs           Leg_FL … Leg_BR              tapered oak legs
  ├── Frame          rails, arm posts, back stiles, corner blocks (kiln-dried beech)
  ├── SeatSupport    7 sinuous (zig-zag) steel springs + clips, 3 back webbing straps
  ├── Padding        high-density foam: deck pad, arm pads, back pad
  ├── Upholstery     linen shell: base, arms, back
  ├── SeatCushion_L/R    → *_Cover (linen) + *_Core (foam)
  └── BackCushion_L/R    → *_Cover (linen) + *_Core (fibre-wrapped foam)

Assembled, every inner layer sits fully inside the layer that covers it.
Materials: Fabric, Wood (legs), FrameWood, Steel, Webbing, Foam, Fibre.

Usage:
  blender -b --python tools/blender/build_sofa_exploded.py -- public/models/sofa_exploded.glb
"""

import math
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import forma_lib as F  # noqa: E402

out = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "sofa_exploded.glb"
F.reset()

# ── dimensions: identical to build_sofa.py ─────────────────────────────
W, D = 1.92, 0.88
LEG_H, BASE_H = 0.16, 0.20
BASE_TOP = LEG_H + BASE_H
ARM_W, ARM_H = 0.17, 0.44
INNER_W = W - 2 * ARM_W
BACK_D, BACK_H = 0.18, 0.42
BACK_FRONT_Y = D / 2 - BACK_D
SEAT_H = 0.15
SEAT_D = BACK_FRONT_Y + D / 2 - 0.02

FABRIC = F.material("Fabric", (0.69, 0.60, 0.47), 0.92)
WOOD = F.material("Wood", (0.45, 0.28, 0.15), 0.55)
FRAME = F.material("FrameWood", (0.78, 0.62, 0.42), 0.7)
STEEL = F.material("Steel", (0.18, 0.18, 0.19), 0.45, 1.0)
WEB = F.material("Webbing", (0.55, 0.52, 0.46), 0.9)
FOAM = F.material("Foam", (0.93, 0.86, 0.62), 0.95)
FIBRE = F.material("Fibre", (0.95, 0.93, 0.89), 0.95)

root = F.empty("SofaStructure")
legs, frame, support, padding, shell = (F.empty(n, root) for n in ("Legs", "Frame", "SeatSupport", "Padding", "Upholstery"))

# ── legs ──────────────────────────────────────────────────────────────
lx, ly = W / 2 - 0.11, D / 2 - 0.1
for name, x, y in (("Leg_FL", -lx, -ly), ("Leg_FR", lx, -ly), ("Leg_BL", -lx, ly), ("Leg_BR", lx, ly)):
    F.cone(name, 0.012, 0.021, LEG_H, (x, y, LEG_H / 2), legs, WOOD,
           rotation=(math.copysign(0.07, y), -math.copysign(0.07, x), 0))

# ── frame: kiln-dried beech, 30–40 mm sections ────────────────────────
RAIL_H, RAIL_T = 0.12, 0.035
rail_z = LEG_H + 0.015 + RAIL_H / 2
inset = 0.03  # frame sits inside the foam + fabric
F.timber("Rail_Front", (W - 2 * inset, RAIL_T, RAIL_H), (0, -D / 2 + inset + RAIL_T / 2, rail_z), frame, FRAME)
F.timber("Rail_Back", (W - 2 * inset, RAIL_T, RAIL_H), (0, D / 2 - inset - RAIL_T / 2, rail_z), frame, FRAME)
for s in (-1, 1):
    x_side = s * (W / 2 - inset - RAIL_T / 2)
    F.timber(f"Rail_Side_{'L' if s < 0 else 'R'}", (RAIL_T, D - 2 * inset - 2 * RAIL_T, RAIL_H), (x_side, 0, rail_z), frame, FRAME)
    # arm frame: front + back post, top rail, mid rail
    ax = s * (W / 2 - ARM_W / 2)
    for py, tag in ((-D / 2 + inset + 0.03, "Front"), (D / 2 - inset - 0.03, "Back")):
        F.timber(f"ArmPost_{tag}_{'L' if s < 0 else 'R'}", (0.04, 0.04, ARM_H - 0.05), (ax, py, LEG_H + (ARM_H - 0.05) / 2 + 0.01), frame, FRAME)
    F.timber(f"ArmTop_{'L' if s < 0 else 'R'}", (0.07, D - 2 * inset, 0.03), (ax, 0, LEG_H + ARM_H - 0.055), frame, FRAME)
    F.timber(f"ArmMid_{'L' if s < 0 else 'R'}", (0.025, D - 2 * inset - 0.06, 0.06), (ax, 0, LEG_H + 0.24), frame, FRAME)
    # back stile
    F.timber(f"BackStile_{'L' if s < 0 else 'R'}", (0.04, 0.035, BACK_H - 0.04), (s * (INNER_W / 2 - 0.02), D / 2 - inset - 0.05, BASE_TOP + (BACK_H - 0.04) / 2 - 0.02), frame, FRAME)
back_y = D / 2 - inset - 0.05
F.timber("BackRail_Top", (INNER_W, 0.035, 0.06), (0, back_y, BASE_TOP + BACK_H - 0.07), frame, FRAME)
F.timber("BackRail_Mid", (INNER_W, 0.025, 0.05), (0, back_y, BASE_TOP + 0.16), frame, FRAME)
# corner blocks glued + screwed into each base corner
for cx in (-1, 1):
    for cy in (-1, 1):
        F.timber(f"CornerBlock_{cx}{cy}", (0.07, 0.07, 0.08),
                 (cx * (W / 2 - inset - RAIL_T - 0.035), cy * (D / 2 - inset - RAIL_T - 0.035), rail_z), frame, FRAME,
                 rotation=(0, 0, math.radians(45)))
# centre stretcher
F.timber("Rail_Centre", (0.035, D - 2 * inset - 2 * RAIL_T, 0.08), (0, 0, rail_z - 0.02), frame, FRAME)

# ── seat support: sinuous springs front → back rail, back webbing ─────
spring_z = rail_z + RAIL_H / 2 + 0.01
y0, y1 = -D / 2 + inset + RAIL_T, D / 2 - inset - RAIL_T
n_springs = 7
for i in range(n_springs):
    x = -INNER_W / 2 + 0.11 + i * (INNER_W - 0.22) / (n_springs - 1)
    zig = 14
    pts = []
    for k in range(zig + 1):
        t = k / zig
        y = y0 + (y1 - y0) * t
        dx = 0.03 if k % 2 else -0.03
        if k in (0, zig):
            dx = 0
        pts.append((x + dx, y, spring_z + 0.022 * math.sin(math.pi * t)))  # slight crown
    F.tube(f"Spring_{i}", pts, 0.0035, support, STEEL, smooth_curve=False)
    for y in (y0 + 0.01, y1 - 0.01):
        F.timber(f"Clip_{i}_{'F' if y < 0 else 'B'}", (0.03, 0.02, 0.012), (x, y, spring_z), support, STEEL, bevel=0.002)
for i, x in enumerate((-INNER_W / 3, 0, INNER_W / 3)):
    F.timber(f"Webbing_{i}", (0.05, 0.004, BACK_H - 0.08), (x, back_y - 0.02, BASE_TOP + BACK_H / 2 - 0.02), support, WEB, bevel=0.001)

# ── foam padding (inside the fabric shell, around the frame) ──────────
F.upholstery("Foam_Deck", (W - 0.05, D - 0.05, 0.035), (0, 0, BASE_TOP - 0.025), padding, FOAM, bevel=0.012, puff=(0, 0, 0.003))
for s in (-1, 1):
    F.upholstery(f"Foam_Arm_{'L' if s < 0 else 'R'}", (ARM_W - 0.025, D - 0.025, ARM_H - 0.02),
                 (s * (W / 2 - ARM_W / 2), 0, LEG_H + ARM_H / 2 + 0.005), padding, FOAM, bevel=0.05, puff=(0.008, 0.006, 0.006))
F.upholstery("Foam_Back", (INNER_W - 0.02, BACK_D - 0.025, BACK_H - 0.02), (0, D / 2 - BACK_D / 2, BASE_TOP + BACK_H / 2),
             padding, FOAM, bevel=0.04, puff=(0.004, 0.008, 0.006))

# ── fabric shell (matches build_sofa.py's outer forms) ────────────────
F.upholstery("Shell_Base", (W, D, BASE_H), (0, 0, LEG_H + BASE_H / 2), shell, FABRIC, bevel=0.035, puff=(0.006, 0.01, 0.004))
for s in (-1, 1):
    F.upholstery(f"Shell_Arm_{'L' if s < 0 else 'R'}", (ARM_W, D, ARM_H), (s * (W / 2 - ARM_W / 2), 0, LEG_H + ARM_H / 2),
                 shell, FABRIC, bevel=0.055, puff=(0.012, 0.008, 0.01))
F.upholstery("Shell_Back", (INNER_W, BACK_D, BACK_H), (0, D / 2 - BACK_D / 2, BASE_TOP + BACK_H / 2), shell, FABRIC,
             bevel=0.045, puff=(0.006, 0.012, 0.008))

# ── loose cushions: fabric cover around a foam / fibre core ───────────
seat_w = INNER_W / 2 - 0.006
seat_y = BACK_FRONT_Y - SEAT_D / 2
for s, side in ((-1, "L"), (1, "R")):
    c = F.empty(f"SeatCushion_{side}", root, location=(s * INNER_W / 4, seat_y, BASE_TOP + SEAT_H / 2))
    F.upholstery(f"SeatCushion_{side}_Cover", (seat_w, SEAT_D, SEAT_H), (0, 0, 0), c, FABRIC, bevel=0.04, puff=(0.012, 0.018, 0.028))
    F.upholstery(f"SeatCushion_{side}_Core", (seat_w - 0.03, SEAT_D - 0.03, SEAT_H - 0.035), (0, 0, 0), c, FOAM,
                 bevel=0.012, puff=(0.002, 0.002, 0.006))

back_w, back_h = INNER_W / 2 - 0.012, 0.38
for s, side in ((-1, "L"), (1, "R")):
    c = F.empty(f"BackCushion_{side}", root, location=(s * INNER_W / 4, BACK_FRONT_Y - 0.075, BASE_TOP + SEAT_H + back_h / 2 - 0.02),
                rotation=(-0.16, 0, 0))
    F.upholstery(f"BackCushion_{side}_Cover", (back_w, 0.17, back_h), (0, 0, 0), c, FABRIC, bevel=0.045, puff=(0.014, 0.034, 0.014))
    F.upholstery(f"BackCushion_{side}_Core", (back_w - 0.035, 0.12, back_h - 0.04), (0, 0, 0), c, FIBRE,
                 bevel=0.03, puff=(0.006, 0.02, 0.006))

F.export(out)
