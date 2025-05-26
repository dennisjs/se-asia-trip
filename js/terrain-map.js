// terrain-map.js
mapboxgl.accessToken = window.CONFIG.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: [100.5, 13.75],  // Temporary default view
  zoom: 10,
  pitch: 60,
  bearing: -20,
  antialias: true
});

map.on('load', async () => {
  // Fetch most recent location from location.json
  try {
    const response = await fetch('location.json');
    const locations = await response.json();

    // Sort by arrival_date and get the latest
    const latest = locations
      .filter(loc => loc.arrival_date)
      .sort((a, b) => new Date(b.arrival_date) - new Date(a.arrival_date))[0];

    if (latest && latest.lng && latest.lat) {
      map.jumpTo({ center: [latest.lng, latest.lat] });
    }
  } catch (e) {
    console.warn("Could not load location.json, using default center.", e);
  }

  map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.terrain-rgb',
    tileSize: 512,
    maxzoom: 14
  });

  map.setTerrain({ source: 'mapbox-dem', exaggeration: 1.0 });

  map.addLayer({
    id: 'hillshade',
    type: 'hillshade',
    source: 'mapbox-dem',
    layout: {},
    paint: {}
  });

  // Hook up exaggeration control
  const slider = document.getElementById('exaggeration');
  const label = document.getElementById('exaggeration-value');

  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    map.setTerrain({ source: 'mapbox-dem', exaggeration: value });
    label.textContent = value.toFixed(1);
  });
});
