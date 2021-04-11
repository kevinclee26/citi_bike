// load data from API
// https://gbfs.citibikenyc.com/gbfs/en/station_information.json

var base_url='https://gbfs.citibikenyc.com/gbfs/en/station_information.json'

// create the map
// https://leafletjs.com/examples/quick-start/
var myMap=L.map('mapid').setView([40.7128, -74.006], 13);

var streetLayer=L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    'attribution': 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    'maxZoom': 18,
    'id': 'mapbox/streets-v11',
    'tileSize': 512,
    'zoomOffset': -1,
    'accessToken': API_KEY
	}).addTo(myMap);

var myIcon = L.icon({
    'iconUrl': "https://img.icons8.com/doodle/48/000000/apple.png",
    'iconSize': [20, 20],
    'iconAnchor': [0, 0]
});

d3.json(base_url).then(function(data){
	// console.log(data);
	var markerGroup=[]
	
	// slice data so Kevin's computer doesn't explode
	stations_ary=data['data']['stations'].slice(0, 50)

	// create markers for each station
	// L.marker([lat, lon])
	stations_ary.forEach(function(one_station){
		var marker=L.marker([one_station['lat'], one_station['lon']], {'icon': myIcon})
					.bindPopup(`<h3>${one_station['name']}</h3><h3>Capacity: ${one_station['capacity']}</h3>`)
		// marker.addTo(myMap)
		markerGroup.push(marker) // push each freshly added marker to array
	})
	var stationLayerGroup=L.layerGroup(markerGroup)
			    		   .addTo(myMap);

	var baseLayers={
				    "Mapbox": streetLayer
				    // "OpenStreetMap": osm
				   };
	var overlays={
				    "Marker": stationLayerGroup
				    // "Roads": roadsLayer
				 };
	L.control.layers(baseLayers, overlays).addTo(myMap);
	var legend=L.control({'position': 'bottomright'})
	legend.onAdd = function() {
	    var div = L.DomUtil.create('div', 'info legend'); // create a div with a class "info"
	    div.innerHTML=`<h3>Number of Stations: ${stations_ary.length}</h3>`
	    return div;
	};
	legend.addTo(myMap)
})





