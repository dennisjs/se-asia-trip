// terrain-map.js
mapboxgl.accessToken = window.CONFIG.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: [100.5, 13.75],  // Default view (Bangkok region)
  zoom: 10,
  pitch: 60,
  bearing: -20,
  antialias: true
});

map.on('load', () => {
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
