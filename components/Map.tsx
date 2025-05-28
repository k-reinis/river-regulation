// @ts-nocheck
"use client";

import { MapContainer, TileLayer, LayersControl, GeoJSON, LayerGroup } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

const position = [56.5, 23.5];

export default function Map() {
  const [geojsonLayers, setGeojsonLayers] = useState([
    { name: "Upes", url: "/upes_inside.geojson", color: "purple", fillOpacity: 0, data: null, checked: false },
    { name: "Pētījuma teritorija", url: "../petijuma_teritorija.geojson", color: "green", fillOpacity: 0, data: null, checked: true  },
    { name: "Rivers (inside)", url: "/upes_inside.geojson", color: "blue", opacity: 1, data: null, group: "Rivers", checked: false },
    { name: "Rivers (outside)", url: "/upes_outside.geojson", color: "blue", opacity: 0.2, data: null, group: "Rivers", checked: false }, 
    { name: "Nemainītie posmi", url: "/nereguleti.geojson", color: "rgb(0, 64, 128)", opacity: 1, data: null, checked: true }, 
    { name: "Regulēti pirms 1940", url: "/reguleti_pirms_1940.geojson", color: "rgb(0, 191, 255)", opacity: 1, data: null, checked: true  },
    { name: "Regulēti pēc 1940", url: "/reguleti_pec_1940.geojson", color: "rgb(128, 0, 128)", opacity: 1, data: null, checked: true  }
  ]);

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

  return (
    <MapContainer center={position} zoom={9} style={{ height: "100vh", width: "100%" }}>
      <LayersControl position="topright">
        {/* Base Layers */}
        <LayersControl.BaseLayer name="OpenStreetMap" checked>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap contributors' />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="1920-1940 ZM Kadastra plāns">
          <TileLayer url="https://home.dodies.lv/tiles-kadastr/{z}/{x}/{y}.png" attribution="ZM 1920-1940 Kadastra plāns" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Esri World Imagery">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='Tiles © Esri...' maxZoom={18} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Atslēgts fons">
  <TileLayer
    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png"
    attribution=""
    opacity={0}
    zIndex={1}
  />
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "beige",
      zIndex: 0,
      pointerEvents: "none"
    }}
  />
</LayersControl.BaseLayer>

        {/* Individual overlays */}

        {geojsonLayers.map(
  layer =>
    layer.data && !layer.group && (
      <LayersControl.Overlay key={layer.name} name={layer.name} checked={layer.checked}>
        <LayerGroup>
          <GeoJSON
            data={layer.data}
            style={() => ({
              color: layer.color,
              weight: 2,
              fillOpacity: layer.fillOpacity ?? 0,
              opacity: layer.opacity ?? 1,
            })}
            onEachFeature={
              layer.name === "Regulēti pirms 1940" || layer.name === "Regulēti pēc 1940" || layer.name === "Neregulēti"
                ? (feature, leafletLayer) => {
                    let popupContent = "<table>";
                    for (const key in feature.properties) {
                      popupContent += `<tr><td><b>${key}</b></td><td>${feature.properties[key]}</td></tr>`;
                    }
                    popupContent += "</table>";
                    leafletLayer.bindPopup(popupContent);
                  }
                : undefined
            }
          />
        </LayerGroup>
      </LayersControl.Overlay>
    )
)}


        {/* Combined overlay for rivers */}
        <LayersControl.Overlay name="Rivers (inside/outside)" >
          <LayerGroup>
            {geojsonLayers
              .filter(layer => layer.group === "Rivers" && layer.data)
              .map(layer => (
                <GeoJSON
                  key={layer.name}
                  data={layer.data}
                  style={() => ({
                    color: layer.color,
                    weight: 2,
                    fillOpacity: layer.fillOpacity ?? 0,
                    opacity: layer.opacity ?? 1,
                    checked: layer.checked
                  })}
                />
              ))}
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>
    </MapContainer>
  );
}
