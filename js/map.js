// terrain-map.js
mapboxgl.accessToken = window.CONFIG.MAPBOX_TOKEN;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/satellite-streets-v12',
  center: [100.5, 13.75],
  zoom: 10,
  pitch: 60,
  bearing: -20,
  antialias: true
});

map.on('load', async () => {
  try {
    const response = await fetch('location.json');
    const locations = await response.json();

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

  // Add floating controls to top-right
  const controlBox = document.createElement('div');
  controlBox.style.position = 'absolute';
  controlBox.style.top = '10px';
  controlBox.style.right = '10px';
  controlBox.style.background = 'white';
  controlBox.style.padding = '10px';
  controlBox.style.borderRadius = '8px';
  controlBox.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
  controlBox.style.zIndex = '1';
  controlBox.innerHTML = `
    <div>
      <label for="view-toggle">View:</label>
      <select id="view-toggle">
        <option value="overhead">Overhead</option>
        <option value="perspective" selected>Perspective</option>
      </select>
    </div>
    <div style="margin-top: 8px;">
      <label for="exaggeration">Exaggeration:</label>
      <input type="range" id="exaggeration" min="0" max="3" step="0.1" value="1">
      <span id="exaggeration-value">1.0</span>
    </div>
  `;
  document.body.appendChild(controlBox);

  // Hook up exaggeration slider
  const slider = document.getElementById('exaggeration');
  const label = document.getElementById('exaggeration-value');

  slider.addEventListener('input', (e) => {
    const value = parseFloat(e.target.value);
    map.setTerrain({ source: 'mapbox-dem', exaggeration: value });
    label.textContent = value.toFixed(1);
  });

  // Hook up overhead/perspective toggle
  const viewToggle = document.getElementById('view-toggle');
  viewToggle.addEventListener('change', (e) => {
    if (e.target.value === 'overhead') {
      map.easeTo({ pitch: 0, bearing: 0 });
    } else {
      map.easeTo({ pitch: 60, bearing: -20 });
    }
  });
});

