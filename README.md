# G30 Logic Field Geology — v0.1

## Setup (free, GitHub Pages)
1. Create a GitHub repo, e.g. `g30-field-geology`.
2. Upload index.html, sw.js, manifest.json.
3. Repo Settings > Pages > Deploy from branch > main / root.
4. Open the Pages link on your phone (needs HTTPS for GPS + offline). Share > Add to Home Screen.

## Before going off-grid
Open the app with signal, pan to the field area, tap "Save area offline", choose max zoom, Download. Tiles stay on the phone.

## Features
- Base maps: USGS Imagery (public domain), USGS Topo, USGS Imagery+Topo, OpenTopoMap
- Live GPS position, accuracy, elevation; record GPS track
- Points, lines, polygons with names and notes; line length (ft/m), polygon area (acres, ha, sq ft)
- Coordinate display: WGS84, NAD83, NAD27 lat/lon; NAD83/NAD27/WGS84 UTM (auto zone)
- Navigate to any feature: distance + bearing, works offline on GPS alone
- Field notes saved on the phone
- Document summaries via Anthropic API key (queued when offline)
- Export everything as GeoJSON

## Known limits (v0.1)
- NAD27 uses the CONUS mean datum shift (about 5 m accuracy), not NADCON grids.
- Summaries take pasted text or .txt files; PDF reading is a later step.
- iPhone browsers cap offline storage; download only the areas you need.
