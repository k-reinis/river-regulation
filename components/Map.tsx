
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





const position: [number, number] = [56.5, 23.8];




export default function Map() {
  const [geojsonLayers, setGeojsonLayers] = useState<LayerConfig[]>([

    { name: "Pētījuma teritorija", url: "../petijuma_teritorija.geojson", color: "green", fillOpacity: 0, data: null, checked: true  },
    { name: "Svētes baseina robežas*", url: "../svetes_baseins.geojson", color: "yellow", fillOpacity: 0, data: null, checked: false},
    { name: "Upes (teritorijā)", url: "/upes_inside.geojson", color: "blue", opacity: 1, data: null, group: "Rivers", checked: false },
    { name: "Upes (ārpus teritorijas)", url: "/upes_outside.geojson", color: "blue", opacity: 0.2, data: null, group: "Rivers", checked: false }, 
    { name: "Neregulēti", url: "/nereguleti.geojson", color: "rgb(0, 64, 128)", opacity: 1, data: null, checked: true }, 
    { name: "Regulēti pirms 1940", url: "/reguleti_pirms_1940.geojson", color: "rgb(0, 191, 255)", opacity: 1, data: null, checked: true  },
    { name: "Regulēti pēc 1940", url: "/reguleti_pec_1940.geojson", color: "rgb(128, 0, 128)", opacity: 1, data: null, checked: true  }
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
    // Optional: Update checked state for legend UI
    setBaseLayers(prev =>
      prev.map(layer => ({
        ...layer,
        checked: layer.name === name,
      }))
    );
  };
  
  const debouncedToggleLayer = useMemo(() => 
    debounce((name: string, isVisible: boolean) => {
      setVisibility(prev => ({ ...prev, [name]: isVisible }));
    }, 300),
  []);

  const [legendOpen, setLegendOpen] = useState(true);

// Detect mobile (screen width) and set initial state
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
  

  // ... your imports and types ...


  return (
    <MapContainer center={position} zoom={9} style={{ height: "100vh", width: "100%" }}   scrollWheelZoom={true} zoomControl={true}   minZoom={5}
    maxZoom={18}>
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
  layer.name === activeBaseLayer && (
    layer.type === "wms" ? (
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
        // add other WMS options as needed
      />
    ) : (
      <TileLayer
        key={layer.name}
        url={layer.url}
        attribution={layer.attribution}
        maxZoom={layer.maxZoom}
      />
    )
  )
)}


{geojsonLayers.map(layer =>
  layer.data && !layer.group && visibility[layer.name] && (
    <LayerGroup key={layer.name}>
      <GeoJSON
        data={layer.data}
        style={() => ({
          color: layer.color,
          weight: 3,
          fillOpacity: layer.fillOpacity ?? 0,
          opacity: layer.opacity ?? 1,
        })}
        onEachFeature={
          layer.name === "Regulēti pirms 1940" || layer.name === "Regulēti pēc 1940" || layer.name === "Neregulēti"
            ? (feature: Feature<Geometry, GeoJsonProperties>, leafletLayer: L.Layer) => {
                let popupContent = "<table>";
                for (const key in feature.properties) {
                  const value = feature.properties[key];
                  // Skip if value is null, undefined, or the string "NULL"
                  if (value !== null && value !== undefined && value !== "NULL") {
                    popupContent += `<tr><td><b>${key}</b></td><td>${value}</td></tr>`;
                  }
                }
                popupContent += "</table>";
                leafletLayer.bindPopup(popupContent);
              }
            : undefined
        }
        
      />
    </LayerGroup>
    
  )
)}

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
      />
    ))}
</LayerGroup>

{legendOpen && (
  <div
    style={{
      position: "absolute",
      top: "15px",
      right: "15px",
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
        right: 6,
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
    <h4 style={{ margin: "0 0 8px 0" }}>Apzīmējumi</h4>
    {/* Overlay layers */}
    {geojsonLayers
      .filter(layer => layer.data && !layer.group)
      .map(layer => (
        <LegendEntry
          key={layer.name}
          color={layer.color}
          name={layer.name}
          checked={visibility[layer.name]}
          onChange={(checked) => debouncedToggleLayer(layer.name, checked)}

        />
      ))}
    {/* Grouped layers */}
    
<LegendEntry
  key="Upes"
  color="blue" // or a color that represents both, or a legend swatch
  name="Mūsdienu upes"
  checked={
    visibility["Upes (teritorijā)"] && visibility["Upes (ārpus teritorijas)"]
  }
  onChange={(checked) => {
    toggleLayer("Upes (teritorijā)", checked);
    toggleLayer("Upes (ārpus teritorijas)", checked);
  }}
/>

    {/* Base layers */}
    <div style={{ marginTop: "8px" }}>Pamatkartes</div>
    {baseLayers.map(layer => (
      <div key={layer.name} style={{ display: "flex", alignItems: "center", margin: "4px 0" }}>
        <input
          type="radio"
          name="baseLayer"
          checked={layer.name === activeBaseLayer}
          onChange={() => toggleBaseLayer(layer.name)}
          style={{ marginRight: "8px" }}
        />
        <span>{layer.name}</span>
      </div>
    ))}
  </div>
)}
{!legendOpen && (
  <button
    style={{
      position: "absolute",
      top: 15,
      right: 15,
      zIndex: 1100,
      background: "white",
      borderRadius: "50%",
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
<p>*Svētes baseina robežas norādītas, jo Svētes baseina upēm pieejama plašāka informācija</p>
    <p>
Karšu pārlūks izstrādāts pētījumā &quot;Upju regulēšana 20. gadsimta agro-industriālajā ainavā: Zemgales līdzenuma piemērs&quot;, projekta FLPP &quot;Ūdeņu kultūras: transformatīva pieeja ilgtspējīgām cilvēka-ūdeņu attiecībām&quot; ietvaros (lzp-2023/1-0248).
    </p>
    <p>Autors: Klāss Reinis Dzirkalis, klassdzirkalis@gmail.com</p>
    <p>https://github.com/k-reinis/river-regulation</p>
  </MapDescription>
    </MapContainer>
  );
}
