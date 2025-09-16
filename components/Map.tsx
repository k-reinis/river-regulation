"use client";

import { MapContainer, TileLayer, GeoJSON, LayerGroup } from "react-leaflet";
import { useEffect, useState, useMemo } from "react";
import "leaflet/dist/leaflet.css";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import LegendEntry from "./legendEntry";
import debounce from "lodash.debounce";
import { TbStack2 } from "react-icons/tb";
import MapDescription from "./mapDescription";
import { WMSTileLayer } from "react-leaflet";
import * as L from "leaflet";

type LayerConfig = {
  name: string;
  url: string;
  color: string;
  fillOpacity?: number;
  opacity?: number;
  data: FeatureCollection | null;
  checked?: boolean;
  group?: string;
};

type BaseLayerConfig = {
  name: string;
  type: string;
  url: string;
  attribution: string;
  maxZoom?: number;
  checked?: boolean;
  layers?: string;
  format?: string;
  version?: string;
  transparent?: boolean;
  crs?: string;
};

type VisibilityState = Record<string, boolean>;

type LeafletLayerWithElement = L.Layer & {
  getElement?: () => HTMLElement | null;
};

const position: [number, number] = [56.7, 23.7];

export default function Map() {
  const [geojsonLayers, setGeojsonLayers] = useState<LayerConfig[]>([
    { name: "Svētes baseina robežas", url: "../svetes_baseins_full.geojson", color: "#FF7900", fillOpacity: 0, data: null, checked: true },
    { name: "Upes (teritorijā)", url: "/lielupe_full.geojson", color: "blue", opacity: 1, data: null, group: "Rivers", checked: false },
    { name: "Upes (ārpus teritorijas)", url: "/upes_outside.geojson", color: "blue", opacity: 0.2, data: null, group: "Rivers", checked: false },
    { name: "Neregulēti posmi", url: "/nereguleti_full.geojson", color: "#007FFF", opacity: 1, data: null, checked: true },
    { name: "Regulēti pirms 1940. gada - posmi, kas pārveidoti pirms 1940. gada", url: "/reguleti_pirms_1940_full.geojson", color: "#008080", opacity: 1, data: null, checked: true },
    { name: "Regulēti pēc 1940. gada - posmi, kas pārveidoti pēc 1940. gada", url: "/reguleti_pec_1940_full.geojson", color: "#4F42B5", opacity: 1, data: null, checked: true }
  ]);

  const [baseLayers, setBaseLayers] = useState<BaseLayerConfig[]>([
    {
      name: "OpenStreetMap",
      type: "xyz",
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: "© OpenStreetMap contributors",
      checked: false,
    },
    {
      name: "1920-1940 ZM Kadastra plāns",
      type: "xyz",
      url: "https://home.dodies.lv/tiles-kadastr/{z}/{x}/{y}.png",
      attribution: "ZM 1920-1940 Kadastra plāns",
      checked: true,
    },
    {
      name: "Esri World Imagery",
      type: "xyz",
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: "Tiles © Esri...",
      maxZoom: 18,
      checked: false,
    },
    {
      name: "LVM Reljefa modelis ar horizontālēm",
      type: "wms",
      url: "https://lvmgeoserver.lvm.lv/geoserver/ows?",
      layers: "public:DTM_contours",
      attribution: "LVM GeoServer",
      checked: false,
      format: "image/png",
      version: "1.3.0",
      crs: "EPSG:3059"
    },
    {
      name: "Atslēgts fons",
      type: "none",
      url: "",
      attribution: "",
      checked: false,
    }
  ]);

  const [activeBaseLayer, setActiveBaseLayer] = useState<string>("OpenStreetMap");

  const toggleBaseLayer = (name: string) => {
    setActiveBaseLayer(name);
    setBaseLayers(prev =>
      prev.map(layer => ({
        ...layer,
        checked: layer.name === name,
      }))
    );
  };

  const debouncedToggleLayer = useMemo(
    () =>
      debounce((name: string, isVisible: boolean) => {
        setVisibility(prev => ({ ...prev, [name]: isVisible }));
      }, 300),
    []
  );

  const [legendOpen, setLegendOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setLegendOpen(false);
      } else {
        setLegendOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    Promise.all(
      geojsonLayers.map(layer =>
        fetch(layer.url)
          .then(res => res.json())
          .then(data => ({ ...layer, data }))
      )
    ).then(setGeojsonLayers);
    // eslint-disable-next-line
  }, []);

  const toggleLayer = (name: string, isVisible: boolean) => {
    setVisibility(prev => ({ ...prev, [name]: isVisible }));
  };

  const [visibility, setVisibility] = useState<VisibilityState>(
    Object.fromEntries(
      geojsonLayers.map(layer => [layer.name, layer.checked ?? false])
    )
  );

  return (
    <MapContainer
      center={position}
      zoom={9}
      style={{
        height: "calc(var(--vh, 1vh) * 100)",
        width: "100%",
        cursor: "default"
      }}
      scrollWheelZoom={true}
      zoomControl={true}
      minZoom={5}
      maxZoom={18}
    >
      {/* Base Layers */}
      {baseLayers.map(layer =>
        layer.name === activeBaseLayer && (
          <TileLayer
            key={layer.name}
            url={layer.url}
            attribution={layer.attribution}
            maxZoom={layer.maxZoom}
          />
        )
      )}
      {/* "Atslēgts fons" background div */}
      {activeBaseLayer === "Atslēgts fons" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "beige",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
      )}

      {baseLayers.map(layer =>
        layer.name === activeBaseLayer &&
        (layer.type === "wms" ? (
          <WMSTileLayer
            key={layer.name}
            url={layer.url}
            layers={layer.layers}
            format={layer.format}
            version={layer.version}
            transparent={false}
            attribution={layer.attribution}
            maxZoom={18}
            minZoom={5}
          />
        ) : (
          <TileLayer
            key={layer.name}
            url={layer.url}
            attribution={layer.attribution}
            maxZoom={layer.maxZoom}
          />
        ))
      )}

      {/* Regulation layers */}
      {geojsonLayers.map(layer =>
        layer.data && !layer.group && visibility[layer.name] && layer.name !== "Svētes baseina robežas" && (
          <LayerGroup key={layer.name}>
            <GeoJSON
              data={layer.data}
              style={() => ({
                color: layer.color,
                weight: 3,
                fillOpacity: layer.fillOpacity ?? 0,
                opacity: layer.opacity ?? 1,
              })}
              interactive={
                layer.name === "Regulēti pirms 1940. gada - posmi, kas pārveidoti pirms 1940. gada" ||
                layer.name === "Regulēti pēc 1940. gada - posmi, kas pārveidoti pēc 1940. gada" ||
                layer.name === "Neregulēti posmi"
              }
              onEachFeature={
                (layer.name === "Regulēti pirms 1940. gada - posmi, kas pārveidoti pirms 1940. gada" ||
                  layer.name === "Regulēti pēc 1940. gada - posmi, kas pārveidoti pēc 1940. gada" ||
                  layer.name === "Neregulēti posmi")
                  ? (feature: Feature<Geometry, GeoJsonProperties>, leafletLayer: L.Layer) => {
                      let popupContent = "<table style='width: 100%; border-collapse: collapse;'>";
                      
                      if (layer.name === "Regulēti pirms 1940. gada - posmi, kas pārveidoti pirms 1940. gada" || layer.name === "Neregulēti posmi") {
                        // Only show nosaukums for this layer
                        const nosaukums = feature.properties?.nosaukums;
                        if (nosaukums !== null && nosaukums !== undefined && nosaukums !== "NULL") {
                          popupContent += `<tr>
                            <td style='padding: 4px 12px 4px 0; font-weight: bold; vertical-align: top; min-width: 140px;'>nosaukums</td>
                            <td style='padding: 4px 0; word-wrap: break-word;'>${nosaukums}</td>
                          </tr>`;
                        }
                      } else {
                        // Show all attributes for other layers
                        for (const key in feature.properties) {
                          const value = feature.properties[key];
                          if (value !== null && value !== undefined && value !== "NULL" && 
                              key !== "layer" && key !== "path") {
                            popupContent += `<tr>
                              <td style='padding: 4px 12px 4px 0; font-weight: bold; vertical-align: top; min-width: 140px;'>${key}</td>
                              <td style='padding: 4px 0; word-wrap: break-word;'>${value}</td>
                            </tr>`;
                          }
                        }
                      }
                      
                      popupContent += "</table>";
                      leafletLayer.bindPopup(popupContent, {
                        maxWidth: 350,
                        minWidth: 250
                      });

                      const element = (leafletLayer as LeafletLayerWithElement).getElement?.();
                      if (element) {
                        element.style.cursor = "pointer";
                        element.addEventListener("mouseenter", () => {
                          element.style.cursor = "pointer";
                        });
                        element.addEventListener("mouseleave", () => {
                          element.style.cursor = "default";
                        });
                      }
                    }
                  : undefined
              }
            />
          </LayerGroup>
        )
      )}

      {/* Rivers group */}
      <LayerGroup>
        {geojsonLayers
          .filter(layer => layer.group === "Rivers" && layer.data && visibility[layer.name])
          .map(layer => (
            <GeoJSON
              key={layer.name}
              data={layer.data!}
              style={() => ({
                color: layer.color,
                weight: 2,
                fillOpacity: layer.fillOpacity ?? 0,
                opacity: layer.opacity ?? 1,
              })}
              interactive={false}
              onEachFeature={(feature: Feature<Geometry, GeoJsonProperties>, leafletLayer: L.Layer) => {
                const element = (leafletLayer as LeafletLayerWithElement).getElement?.();
                if (element) {
                  element.style.cursor = "default";
                  element.style.pointerEvents = "none";
                }
              }}
            />
          ))}
      </LayerGroup>

      {/* Svētes baseina robežas as top layer */}
      {geojsonLayers.map(layer =>
        layer.data && layer.name === "Svētes baseina robežas" && visibility[layer.name] && (
          <LayerGroup key={layer.name}>
            <GeoJSON
              data={layer.data}
              style={() => ({
                color: layer.color,
                weight: 3,
                fillOpacity: layer.fillOpacity ?? 0,
                opacity: layer.opacity ?? 1,
              })}
              interactive={false}
              onEachFeature={(feature: Feature<Geometry, GeoJsonProperties>, leafletLayer: L.Layer) => {
                const element = (leafletLayer as LeafletLayerWithElement).getElement?.();
                if (element) {
                  element.style.cursor = "default";
                }
              }}
            />
          </LayerGroup>
        )
      )}

      {legendOpen && (
        <div
          style={{
            position: "absolute",
            top: "30px",
            right: "20px",
            background: "white",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 1000,
            maxWidth: "90vw",
            maxHeight: "80vh",
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setLegendOpen(false)}
            style={{
              position: "absolute",
              top: 6,
              right: 10,
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              zIndex: 1010,
            }}
            aria-label="Close legend"
          >
            ×
          </button>
          <h4 style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px" }}>Apzīmējumi</h4>

          <div style={{ marginTop: "12px", fontSize: "14px", marginLeft: "20px", textDecoration: "underline" }}>Upju regulācijas statuss</div>
          {geojsonLayers
            .filter(layer => layer.data && !layer.group && (
              layer.name.includes("Neregulēti posmi") ||
              layer.name.includes("Regulēti pirms 1940. gada - posmi, kas pārveidoti pirms 1940. gada") ||
              layer.name.includes("Regulēti pēc 1940. gada - posmi, kas pārveidoti pēc 1940. gada")
            ))
            .map(layer => (
              <LegendEntry
                key={layer.name}
                color={layer.color}
                name={layer.name}
                checked={visibility[layer.name]}
                onChange={(checked) => debouncedToggleLayer(layer.name, checked)}
              />
            ))}

          <div style={{ marginTop: "12px", fontSize: "14px", marginLeft: "20px", textDecoration: "underline" }}>Papildu informācija</div>
          {geojsonLayers
            .filter(layer => layer.data && !layer.group && layer.name.includes("Svētes baseina robežas"))
            .map(layer => (
              <LegendEntry
                key={layer.name}
                color={layer.color}
                name={layer.name}
                checked={visibility[layer.name]}
                onChange={(checked) => debouncedToggleLayer(layer.name, checked)}
              />
            ))}

          <LegendEntry
            key="Upes"
            color="blue"
            name="Mūsdienu upes - pašreizējais upju tīkls"
            checked={
              visibility["Upes (teritorijā)"] && visibility["Upes (ārpus teritorijas)"]
            }
            onChange={(checked) => {
              toggleLayer("Upes (teritorijā)", checked);
              toggleLayer("Upes (ārpus teritorijas)", checked);
            }}
          />

          <div style={{ marginTop: "12px", fontSize: "14px", marginLeft: "20px", textDecoration: "underline" }}>Pamatkartes</div>          {baseLayers.map(layer => (
            <div
              key={layer.name}
              style={{
                display: "flex",
                alignItems: "center",
                margin: "4px 0",
                cursor: "pointer",
                userSelect: "none"
              }}
              onClick={() => toggleBaseLayer(layer.name)}
            >
              <input
                type="radio"
                name="baseLayer"
                checked={layer.name === activeBaseLayer}
                onChange={() => toggleBaseLayer(layer.name)}
                style={{ marginRight: "8px" }}
                onClick={(e) => e.stopPropagation()}
              />
              <span style={{ cursor: "pointer" }}>{layer.name}</span>
            </div>
          ))}
        </div>
      )}
      {!legendOpen && (
        <button
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            zIndex: 1100,
            background: "white",
            borderRadius: "4px",
            width: 40,
            height: 40,
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            cursor: "pointer",
          }}
          onClick={() => setLegendOpen(true)}
          aria-label="Show legend"
        >
          <TbStack2 />
        </button>
      )}
      <MapDescription>
        <p>
          Karšu pārlūks izstrādāts pētījumā &quot;Upju regulēšana 20. gadsimta agro-industriālajā ainavā: Zemgales līdzenuma piemērs&quot;, projekta FLPP &quot;Ūdeņu kultūras: transformatīva pieeja ilgtspējīgām cilvēka-ūdeņu attiecībām&quot; ietvaros (lzp-2023/1-0248).
        </p>
        <p>Autors: Klāss Reinis Dzirkalis, klassdzirkalis@gmail.com</p>
        <p>https://github.com/k-reinis/river-regulation</p>
      </MapDescription>
    </MapContainer>
  );
}
