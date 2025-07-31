import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  StyleSheet, 
  TextInput, 
  Dimensions, 
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';
import { WebView } from 'react-native-webview'; 
import { api } from '../config/api';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  const { user } = useUser();
  const [truckLocation, setTruckLocation] = useState({
    latitude: 32.454339, 
    longitude: -116.978086
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState('');

  const truckSvgBase64 = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNjQwIj48IS0tIUZvbnQgQXdlc29tZSBGcmVlIDcuMC4wIGJ5IEBmb250YXdlc29tZSAtIGh0dHBzOi8vZm9udGF3ZXNvbWUuY29tIExpY2Vuc2UgLSBodHRwczovL2ZvbnRhd2Vzb21lLmNvbS9saWNlbnNlL2ZyZWUgQ29weXJpZ2h0IDIwMjUgRm9udGljb25zLCBJbmMuLS0+PHBhdGggZmlsbD0iIzc0QzBGQyIgZD0iTTMyIDE2MEMzMiAxMjQuNyA2MC43IDk2IDk2IDk2TDM4NCA5NkM0MTkuMyA5NiA0NDggMTI0LjcgNDQ4IDE2MEw0NDggMTkyTDQ5OC43IDE5MkM1MTUuNyAxOTIgNTMyIDE5OC43IDU0NCAyMTAuN0w1ODkuMyAyNTZDNjAxLjMgMjY4IDYwOCAyODQuMyA2MDggMzAxLjNMNjA4IDQ0OEM2MDggNDgzLjMgNTc5LjMgNTEyIDU0NCA1MTJMNTQwLjcgNTEyQzUzMC4zIDU0OC45IDQ5Ni4zIDU3NiA0NTYgNTc2QzQxNS43IDU3NiAzODEuOCA1NDguOSAzNzEuMyA1MTJMMjY4LjcgNTEyQzI1OC4zIDU0OC45IDIyNC4zIDU3NiAxODQgNTc2QzE0My43IDU3NiAxMDkuOCA1NDguOSA5OS4zIDUxMkw5NiA1MTJDNjAuNyA1MTIgMzIgNDgzLjMgMzIgNDQ4TDMyIDE2MHpNNTQ0IDM1Mkw1NDQgMzAxLjNMNDk4LjcgMjU2TDQ0OCAyNTZMNDQ4IDM1Mkw1NDQgMzUyek0yMjQgNDg4QzIyNCA0NjUuOSAyMDYuMSA0NDggMTg0IDQ0OEMxNjEuOSA0NDggMTQ0IDQ2NS45IDE0NCA0ODhDMTQ0IDUxMC4xIDE2MS45IDUyOCAxODQgNTI4QzIwNi4xIDUyOCAyMjQgNTEwLjEgMjI0IDQ4OHpNNDU2IDUyOEM0NzguMSA1MjggNDk2IDUxMC4xIDQ5NiA0ODhDNDk2IDQ2NS45IDQ3OC4xIDQ0OCA0NTYgNDQ4QzQzMy45IDQ0OCA0MTYgNDY1LjkgNDE2IDQ4OEM0MTYgNTEwLjEgNDMzLjkgNTI4IDQ1NiA1Mjh6Ii8+PC9zdmc+';

  const fetchTruckLocation = async () => {
    try {
      const response = await fetch(api.url + 'Reading');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Filtrar lecturas para nuestro camión y ordenar por fecha
      const truckReadings = result.data
        .filter(reading => reading.truck.id === user.truckData.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      console.log(truckReadings);
      if (truckReadings.length > 0) {
        const latestReading = truckReadings[0];
        setTruckLocation({
          latitude: latestReading.location.latitude,
          longitude: latestReading.location.longitude
        });
        setLastUpdate(new Date(latestReading.date).toLocaleTimeString());
      } else {
        setError("No location data");
      }
      
      setLoading(false);
    } catch (err) {
      setError("Error getting location");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    // Carga inicial
    fetchTruckLocation();

    // Configurar intervalo para actualizaciones
    const intervalId = setInterval(() => {
      fetchTruckLocation();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [user.truckData.id]);

  // HTML con mapa minimalista y colores fríos
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.015">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { 
            height: 100vh; 
            width: 100vw; 
            background-color: #E2ECF5; /* Fondo que combina con tu app */
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Mapa minimalista con colores fríos
          var map = L.map('map').setView([${truckLocation.latitude}, ${truckLocation.longitude}], 17);
          
          // (CartoDB Positron)
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            
            maxZoom: 19
          }).addTo(map);
          
          // Ícono SVG personalizado
          var truckIcon = L.divIcon({
            html: \`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="40" height="40">
                <path fill="#096bb6ff" d="M32 160C32 124.7 60.7 96 96 96L384 96C419.3 96 448 124.7 448 160L448 192L498.7 192C515.7 192 532 198.7 544 210.7L589.3 256C601.3 268 608 284.3 608 301.3L608 448C608 483.3 579.3 512 544 512L540.7 512C530.3 548.9 496.3 576 456 576C415.7 576 381.8 548.9 371.3 512L268.7 512C258.3 548.9 224.3 576 184 576C143.7 576 109.8 548.9 99.3 512L96 512C60.7 512 32 483.3 32 448L32 160zM544 352L544 301.3L498.7 256L448 256L448 352L544 352zM224 488C224 465.9 206.1 448 184 448C161.9 448 144 465.9 144 488C144 510.1 161.9 528 184 528C206.1 528 224 510.1 224 488zM456 528C478.1 528 496 510.1 496 488C496 465.9 478.1 448 456 448C433.9 448 416 465.9 416 488C416 510.1 433.9 528 456 528z"/>
              </svg>
            \`,
            className: 'truck-icon',
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
          });
          
          var marker = L.marker([${truckLocation.latitude}, ${truckLocation.longitude}], {
            icon: truckIcon
          }).addTo(map)
            .bindPopup('You Truck<br>Actualizado: ${lastUpdate}');
            
          function updateMap(lat, lng) {
            map.setView([lat, lng]);
            marker.setLatLng([lat, lng]);
            marker.getPopup().setContent('Tu camión<br>Actualizado: ${lastUpdate}');
          }
        </script>
      </body>
    </html>
  `;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#89B6DD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={styles.map}
        onMessage={(event) => {
          
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    position: 'relative',
    backgroundColor: 'white',
    overflow: 'hidden',
    borderRadius: 20,
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E2ECF5',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  searchContainer: {
    width: '85%',
    height: 66,
    position: 'absolute',
    left: '7.5%',
    top: Platform.OS === 'ios' ? 50 : 30,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  searchInput: {
    flex: 1,
    color: '#868686',
    fontSize: 15,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  searchIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});

export default MapScreen;