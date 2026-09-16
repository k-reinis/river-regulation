# River Regulation in the Svēte River Basin

Interactive historical river-regulation map developed within the **Water Cultures** research project. The application visualises how the river network of the Svēte basin and the surrounding Zemgale Plain (Latvia) was transformed through 20th-century regulation, drainage and agricultural intensification.

🔗 **Live map:** _add deployment URL_

---

## Water Cultures

| | |
|---|---|
| **Project** | Water Cultures: A Transformative Approach to Sustainable Human-Water Relations |
| **Sub-study** | River regulation in the 20th-century agro-industrial landscape: the case of the Zemgale Plain |
| **Funding organisation** | Latvian Council of Science (Latvijas Zinātnes padome) |
| **Project No.** | lzp-2023/1-0248 |
| **Implementer** | University of Latvia, Faculty of Geography and Earth Sciences |
| **Duration** | 01.01.2024–31.12.2026 |
| **Project site** | https://watercultures.lu.lv |

---

## About

This interactive web map explores historical river regulation in the Svēte River basin and the surrounding Zemgale Plain. It was developed for the sub-study on river regulation in the 20th-century agro-industrial landscape, examining transformations of the river network associated with agricultural intensification, drainage and broader landscape change.

River sections are classified by the approximate period of regulation:

- **Unregulated sections** – no evidence of straightening/channelisation in the consulted sources
- **Regulated before 1940** – sections altered prior to 1940
- **Regulated after 1940** – sections altered during the Soviet-era collective-farm drainage works

Historical river information can be compared against contemporary hydrographic data and against historical and modern basemaps. Clicking a river segment opens its recorded attributes (name, length, year in sources, associated collective farm and water body, notes).

---

## Features

- Toggleable thematic layers grouped by regulation status, contemporary rivers, and basin boundary
- Switchable basemaps, including a 1920–1940 cadastral plan for direct historical comparison
- Per-segment attribute pop-ups
- Responsive layout with collapsible legend and description panels

---

## Map layers

### Thematic (vector, GeoJSON)

| Layer | File | Geometry | Features |
|---|---|---|---|
| Unregulated sections | `public/nereguleti_full.geojson` | MultiLineString | 116 |
| Regulated before 1940 | `public/reguleti_pirms_1940_full.geojson` | MultiLineString | 126 |
| Regulated after 1940 | `public/reguleti_pec_1940_full.geojson` | MultiLineString | 104 |
| Contemporary rivers (Lielupe basin) | `public/lielupe_full.geojson`, `public/upes_outside.geojson` | MultiLineString | — |
| Svēte basin boundary | `public/svetes_baseins_full.geojson` | Polygon | 1 |

All GeoJSON is served in geographic coordinates (WGS 84 / CRS84).

**Regulation-layer attribute schema**

| Field | Meaning |
|---|---|
| `nosaukums` | River / section name |
| `garums` | Segment length |
| `posmaID` | Segment identifier |
| `gadsAvotos` | Year attested in sources |
| `regulets1940` | Regulation flag relative to 1940 |
| `kolhozs` | Associated collective farm (kolkhoz) |
| `udenskratuve` | Associated reservoir / water body |
| `piezimes` | Notes |

### Basemaps

| Basemap | Source / attribution |
|---|---|
| OpenStreetMap | © OpenStreetMap contributors |
| 1920–1940 Cadastral plan (ZM) | Ministry of Agriculture 1920–1940 cadastral plan, tiles via home.dodies.lv |
| Esri World Imagery | Tiles © Esri and contributors |
| LVM Relief model with contours (WMS) | LVM GeoServer (`public:DTM_contours`, EPSG:3059) |

---

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) + React 19 + TypeScript
- [React-Leaflet](https://react-leaflet.js.org) / [Leaflet](https://leafletjs.com) for mapping
- Tailwind CSS 4

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Build and serve production:

```bash
npm run build
npm run start
```

---

## Data sources

- **Regulation status and segment attributes** – digitised and interpreted by the author from historical maps and archival sources within the Water Cultures sub-study. _Add the specific archival / cartographic sources used._
- **Contemporary hydrography** – derived from Latvian national hydrographic data. _Confirm dataset and licence (e.g. LĢIA)._
- **Basemaps** – as attributed in the table above.

> The regulation classification reflects the sources consulted and the interpretation of the author; it should be read as an approximate historical reconstruction, not an authoritative cadastre.

---

## Author

Klāss Reinis Dzirkalis – klassdzirkalis@gmail.com

Developed as part of a Master's study at the University of Latvia, within the Water Cultures project.

---

## Citation

If you use this map or its data, please cite the project and author. _Add preferred citation once a DOI or fixed reference is available._

---

## Acknowledgements

This work was supported by the Latvian Council of Science, project *Water Cultures: A Transformative Approach to Sustainable Human-Water Relations* (No. lzp-2023/1-0248).

---

## License

Code is released under the MIT License (see `LICENSE`). Data licence: _set explicitly (e.g. CC BY 4.0) before public reuse._
