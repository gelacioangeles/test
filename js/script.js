let map, infoWindow;

function initMap() {
  // Initializing the map centered on IIT.
  const IIT = { lat: 41.831299, lng: -87.627274 };
  map = new google.maps.Map(document.getElementById("map"), {
    center: IIT,
    zoom: 10,
  });
  
  // Creating a marker for IIT.
  const markerIIT = new google.maps.Marker({
    position: IIT,
    map,
    title: "Illinois Institute of Technology",
  });

  // Made the content structured for the info window.
  const contentString = `
    <div style="color: black;">
      <h1>Illinois Institute of Technology</h1>
      <p>Illinois Institute of Technology (IIT) is a private university in Chicago.</p>
    </div>`;
  
  const infowindowIIT = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: "IIT",
  });
  
  // This shows the info window on marker hover.
  markerIIT.addListener("mouseover", () => {
    infowindowIIT.open(map, markerIIT);
  });
  
  // Initializes a InfoWindow for Geolocation.
  infoWindow = new google.maps.InfoWindow();
  
  // Creating a button for the user's current location.
  const locationButton = document.createElement("button");
  locationButton.textContent = "Find Current Location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
  // Adding a event listener for the location button.
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
		  
          infoWindow.setPosition(pos);
          // Added in a message for the current location info window.
          const currentLocationString = `
            <div style="color: black;">
              <h2>FOUND YOU!</h2>
              <p>These are your coordinates: ${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}</p>
            </div>`;
          infoWindow.setContent(currentLocationString);
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });
  
  // Creating the small triangle vertices.
  const triangleCoords = createTriangleCoords(IIT, 16000);
  
  // Creating and displays the triangle on the map.
  const triangle = new google.maps.Polygon({
    paths: triangleCoords,
    strokeColor: "#000000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
    fillColor: "rgba(0, 0, 0, 0)",
    fillOpacity: 0,
  });

  triangle.setMap(map);
}

// The function to calculate triangle coordinates.
function createTriangleCoords(center, sideLength) {
  const height = (Math.sqrt(3) / 2) * sideLength;
  return [
    { lat: center.lat + (height / 111320), lng: center.lng },
    { lat: center.lat - (sideLength / (2 * 111320)), lng: center.lng - (sideLength / (2 * 111320 * Math.cos(Math.PI / 180 * center.lat))) }, // Bottom left vertex
    { lat: center.lat - (sideLength / (2 * 111320)), lng: center.lng + (sideLength / (2 * 111320 * Math.cos(Math.PI / 180 * center.lat))) }, // Bottom right vertex
  ];
}

// This handles any Geolocation errors.
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: Current Location Cannot Be Found."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}

// Shows the initMap function to the global scope.
window.initMap = initMap;