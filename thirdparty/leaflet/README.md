# Leaflet 1.9.4

Browser distribution used by [the map example](../../examples/gtamap.html).

Files are copied unchanged from the published [leaflet 1.9.4 package](https://registry.npmjs.org/leaflet/-/leaflet-1.9.4.tgz):

- `dist/leaflet.js`, its referenced source map, and `dist/leaflet.css` are stored in this directory.
- The five images from `dist/images/` are stored in `images/`, preserving their relative paths.
- The package's `LICENSE` is included unchanged. Preserve this [BSD-2-Clause notice](LICENSE), including the Volodymyr Agafonkin and CloudMade credits.

Upstream source: [Leaflet v1.9.4](https://github.com/Leaflet/Leaflet/tree/v1.9.4).
Archive SHA-256: `84c65a256e50657896f54c33bd857b6849ebe94c817803be818bf32a3dde0b77`.

These files are served locally. The map example separately requests map tiles from CARTO and retains its CARTO and OpenStreetMap attribution; bundling Leaflet does not bundle map tiles.
