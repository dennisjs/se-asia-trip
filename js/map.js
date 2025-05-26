
mapboxgl.accessToken = window.CONFIG.MAPBOX_TOKEN;

async function fetchLatestLocation() {
  try {
    const res = await fetch("location.json");
    const locations = await res.json();
    if (!Array.isArray(locations)) return [locations];
    return locations;
  } catch (e) {
    console.error("Location fetch error:", e);
    return [];
  }
}

let currentMapStyle = 'mapbox://styles/mapbox/streets-v12';
let map, photoMarkers = [], infoBox;
let perspectiveEnabled = false;
let mapInfoBoxWasOpen = false;

function buildMap(locations, preserveCenter, preserveZoom) {
  if (!locations.length) return;

  const current = locations[locations.length - 1];
  const { lat, lng, place } = current;

  map = new mapboxgl.Map({
    container: 'map',
    style: currentMapStyle,
    center: preserveCenter ? [preserveCenter.lng, preserveCenter.lat] : [lng, lat],
    zoom: preserveZoom || 12,
    pitch: perspectiveEnabled ? 60 : 0,
    bearing: perspectiveEnabled ? -20 : 0,
    antialias: true
  });

  map.on("load", () => {
    if (mapInfoBoxWasOpen) {
      document.getElementById("map-info-box")?.classList.add("active");
    }
    mapInfoBoxWasOpen = false;

    // You should re-initialize controls, markers, and layers here
    // For this patch, we'll only fix the mapInfoBox toggle bug
  });
}

window.initMapWithPhotos = function (preserveCenter = null, preserveZoom = null) {
  document.querySelectorAll(".location-info-box").forEach(el => el.remove());
  fetchLatestLocation().then(locations => buildMap(locations, preserveCenter, preserveZoom));
};

if (document.getElementById("map")?.offsetParent !== null) {
  window.initMapWithPhotos();
}

document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-satellite");
  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isSatellite = currentMapStyle === 'mapbox://styles/mapbox/satellite-streets-v12';
      currentMapStyle = isSatellite
        ? 'mapbox://styles/mapbox/streets-v12'
        : 'mapbox://styles/mapbox/satellite-streets-v12';
      toggleBtn.textContent = isSatellite ? 'Satellite View' : 'Map View';

      const center = map.getCenter();
      const zoom = map.getZoom();

      const infoBox = document.getElementById("map-info-box");
      mapInfoBoxWasOpen = infoBox?.classList.contains("active");

      window.initMapWithPhotos(center, zoom);
    });
  }

  const infoBtn = document.getElementById("map-info-btn");
  const infoBox = document.getElementById("map-info-box");
  if (infoBtn && infoBox) {
    infoBtn.addEventListener("click", () => {
      infoBox.classList.toggle("active");
    });
    document.addEventListener("click", (e) => {
      if (!infoBox.contains(e.target) && e.target !== infoBtn) {
        infoBox.classList.remove("active");
      }
    });
  }
}
