"""
HEAVEN & CO. — The chair collection (four new chairs; the fifth is the existing
Ora tub chair from build_chair.py). One GLB per chair, each with a distinct
silhouette and material story:

  dining_chair.glb    Ask    — Scandinavian spindle-back dining chair, solid oak
  lounge_chair.glb    Linnea — high-back upholstered slipper chair, linen, oak legs
  armchair.glb        Tor    — Danish lounge armchair, walnut frame, leather cushions
  shell_chair.glb     Vale   — moulded upholstered shell on black steel rods, wool

Materials (swapped by name in the web app): Oak, Walnut, Fabric, Leather,
Wool, BlackSteel.

Usage:
  blender -b --python tools/blender/build_collection.py -- public/models
"""

import math
import os
import sys

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import forma_lib as F  # noqa: E402

out_dir = sys.argv[sys.argv.index("--") + 1] if "--" in sys.argv else "."


def mats():
    return {
        "Oak": F.material("Oak", (0.62, 0.45, 0.28), 0.55),
        "Walnut": F.material("Walnut", (0.30, 0.19, 0.12), 0.5),
        "Fabric": F.material("Fabric", (0.72, 0.64, 0.52), 0.92),
        "Leather": F.material("Leather", (0.55, 0.37, 0.24), 0.45),
        "Wool": F.material("Wool", (0.22, 0.33, 0.26), 0.95),
        "BlackSteel": F.material("BlackSteel", (0.05, 0.05, 0.05), 0.4, 1.0),
    }


def splay(x, y, a=0.07):
    return (math.copysign(a, y), -math.copysign(a, x), 0)


# ── Ask: spindle-back dining chair ─────────────────────────────────────
def dining_chair(M):
    root = F.empty("DiningChair")
    seat_z = 0.44
    F.upholstery("Seat", (0.46, 0.43, 0.032), (0, 0, seat_z), root, M["Oak"], bevel=0.012, puff=(0.002, 0.002, 0.004))
    for x, y in ((-0.19, -0.17), (0.19, -0.17)):
        F.cone(f"Leg_F{'L' if x < 0 else 'R'}", 0.013, 0.019, seat_z - 0.016, (x, y, (seat_z - 0.016) / 2), root, M["Oak"], rotation=splay(x, y, 0.05))
    # back legs continue up as posts
    for s in (-1, 1):
        F.tube(f"BackPost_{'L' if s < 0 else 'R'}", [(s * 0.2, 0.2, 0.0), (s * 0.19, 0.18, seat_z), (s * 0.21, 0.23, 0.76)], 0.016, root, M["Oak"])
    F.tube("TopRail", [(-0.215, 0.225, 0.745), (-0.1, 0.27, 0.775), (0.1, 0.27, 0.775), (0.215, 0.225, 0.745)], 0.02, root, M["Oak"])
    for i in range(5):
        x = -0.12 + i * 0.06
        F.tube(f"Spindle_{i}", [(x, 0.19, seat_z + 0.015), (x, 0.255 - abs(x) * 0.2, 0.765)], 0.008, root, M["Oak"], smooth_curve=False)
    for s in (-1, 1):
        F.tube(f"SideStretcher_{'L' if s < 0 else 'R'}", [(s * 0.2, -0.18, 0.15), (s * 0.2, 0.19, 0.15)], 0.009, root, M["Oak"], smooth_curve=False)
    F.tube("FrontStretcher", [(-0.2, -0.17, 0.22), (0.2, -0.17, 0.22)], 0.009, root, M["Oak"], smooth_curve=False)
    return root


# ── Linnea: high-back slipper lounge chair ─────────────────────────────
def lounge_chair(M):
    root = F.empty("LoungeChair")
    leg_h = 0.14
    for x, y in ((-0.25, -0.22), (0.25, -0.22), (-0.25, 0.22), (0.25, 0.22)):
        F.cone(f"Leg_{x}{y}", 0.011, 0.018, leg_h, (x, y, leg_h / 2), root, M["Oak"], rotation=splay(x, y))
    F.upholstery("SeatBase", (0.64, 0.62, 0.2), (0, 0, leg_h + 0.1), root, M["Fabric"], bevel=0.04, puff=(0.008, 0.01, 0.006))
    F.upholstery("SeatCushion", (0.58, 0.52, 0.1), (0, -0.03, leg_h + 0.2 + 0.05), root, M["Fabric"], bevel=0.035, puff=(0.01, 0.012, 0.022))
    F.upholstery("Back", (0.64, 0.15, 0.66), (0, 0.27, 0.66), root, M["Fabric"], bevel=0.075, puff=(0.012, 0.035, 0.012), rotation=(-0.22, 0, 0))
    return root


# ── Tor: walnut-framed Danish armchair with leather cushions ───────────
def armchair(M):
    root = F.empty("Armchair")
    r = 0.017
    for s in (-1, 1):
        x = s * 0.33
        side = "L" if s < 0 else "R"
        F.tube(f"FrontLeg_{side}", [(x, -0.3, 0.0), (x, -0.29, 0.58)], r, root, M["Walnut"], smooth_curve=False)
        F.tube(f"BackLeg_{side}", [(x, 0.3, 0.0), (x, 0.24, 0.3), (x, 0.3, 0.84)], r, root, M["Walnut"])
        F.tube(f"Armrest_{side}", [(x, -0.34, 0.6), (x, -0.05, 0.615), (x, 0.24, 0.6)], 0.024, root, M["Walnut"])
        F.tube(f"SeatRail_{side}", [(x, -0.29, 0.3), (x, 0.26, 0.3)], 0.014, root, M["Walnut"], smooth_curve=False)
    F.tube("FrontRail", [(-0.33, -0.29, 0.3), (0.33, -0.29, 0.3)], 0.016, root, M["Walnut"], smooth_curve=False)
    F.tube("BackRail", [(-0.33, 0.27, 0.32), (0.33, 0.27, 0.32)], 0.014, root, M["Walnut"], smooth_curve=False)
    F.tube("TopRail", [(-0.33, 0.3, 0.8), (0, 0.33, 0.82), (0.33, 0.3, 0.8)], 0.016, root, M["Walnut"])
    F.upholstery("SeatCushion", (0.6, 0.56, 0.11), (0, -0.01, 0.37), root, M["Leather"], bevel=0.035, puff=(0.008, 0.01, 0.018))
    F.upholstery("BackCushion", (0.6, 0.11, 0.44), (0, 0.24, 0.62), root, M["Leather"], bevel=0.035, puff=(0.008, 0.02, 0.008), rotation=(-0.28, 0, 0))
    return root


# ── Vale: moulded upholstered shell on black steel rods ────────────────
def shell_chair(M):
    root = F.empty("ShellChair")
    # profile (y, z) from the front lip of the seat, back and up to the top
    profile = [(-0.25, 0.43), (-0.2, 0.46), (-0.05, 0.465), (0.1, 0.46), (0.18, 0.48), (0.23, 0.56), (0.26, 0.68), (0.29, 0.82)]
    n_u, n_v = 22, 34

    def sample(t):
        # Catmull-Rom through the profile points: continuous tangents, so the
        # moulded surface has no ridges at the control points.
        n = len(profile)
        f = t * (n - 1)
        i = min(int(f), n - 2)
        k = f - i
        p0, p1, p2, p3 = (profile[max(i - 1, 0)], profile[i], profile[i + 1], profile[min(i + 2, n - 1)])

        def cr(a, b, c, d):
            return 0.5 * (2 * b + (-a + c) * k + (2 * a - 5 * b + 4 * c - d) * k * k + (-a + 3 * b - 3 * c + d) * k ** 3)

        return cr(p0[0], p1[0], p2[0], p3[0]), cr(p0[1], p1[1], p2[1], p3[1])

    grid = []
    for i in range(n_u):
        u = -1 + 2 * i / (n_u - 1)
        col = []
        for j in range(n_v):
            t = j / (n_v - 1)
            y, z = sample(t)
            back = max(0.0, (t - 0.55) / 0.45)            # 0 on the seat, 1 at the top
            half_w = 0.26 - 0.04 * back                    # tapers slightly toward the top
            z += 0.06 * abs(u) ** 3 * (1 - back)           # seat sides curl up
            y -= 0.07 * abs(u) ** 3 * back                 # back wraps forward
            col.append((u * half_w, y, z))
        grid.append(col)
    F.surface("Shell", grid, root, M["Wool"], thickness=0.04, levels=1, bevel=0.012)
    for x, y in ((-0.2, -0.17), (0.2, -0.17), (-0.19, 0.13), (0.19, 0.13)):
        fx, fy = x * 1.25, y * 1.35
        F.tube(f"Rod_{x}{y}", [(x, y, 0.45), (fx, fy, 0.0)], 0.0085, root, M["BlackSteel"], smooth_curve=False)
    F.tube("RodBrace_F", [(-0.21, -0.19, 0.3), (0.21, -0.19, 0.3)], 0.006, root, M["BlackSteel"], smooth_curve=False)
    return root


for fn, file in ((dining_chair, "dining_chair.glb"), (lounge_chair, "lounge_chair.glb"), (armchair, "armchair.glb"), (shell_chair, "shell_chair.glb")):
    F.reset()
    M = mats()
    root = fn(M)
    F.export(os.path.join(out_dir, file), root)
