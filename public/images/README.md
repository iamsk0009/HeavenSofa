# HEAVEN & CO. image assets

Product and editorial JPEGs in this directory are original locally stored generated assets. They use a shared warm ivory studio palette for product views and natural daylight grading for room and craft photography. JPEG compression is quality 88; the current set is about 5 MB in total.

## Folders

- `products/<product>/`: three-quarter studio view and, where available, a direct front view.
- `lifestyle/`: homepage, living room, dining, lounge, bedroom and craftsmanship scenes.
- `materials/`: linen with oak, bouclé upholstery and walnut grain close-ups; the oak detail uses the same macro study that includes the visible linen-and-oak pairing.

## Product image mapping

The product paths and their material and room views are centralized in `src/data/catalog.js`. The configured product slugs are `linnea-sofa`, `ora-lounge-chair`, `terra-coffee-table`, `soren-dining-chair`, `alma-bed`, `nord-sideboard`, `sol-table-lamp` and `still-vessel-set`.

`public/models/` contains existing GLB assets for the sofa and several chairs. Blender is not installed in this environment, and the available headless browser could not initialize WebGL, so the new static product JPEGs are generated visual approximations based on the catalogue descriptions rather than renders exported from those GLBs. Confirm the generated furniture shapes against the GLB models before treating these preview images as production-accurate product photography.
