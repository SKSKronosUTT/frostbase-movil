import React, { useState, useEffect, useContext } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert 
} from "react-native";
import Header from "../components/Header";
import { useUser } from "../context/UserContext";
import { api } from "../config/api";

const HomeScreen = () => {
  const { user } = useUser();
  const [onTrip, setOnTrip] = useState(false);
  const [tripFinished, setTripFinished] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [stops, setStops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState(null);
  // Obtener las rutas del conductor
  const fetchRoutes = async () => {
    try {
      const response = await fetch(api.url + 'Route');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 0 && data.data.length > 0) {
        // Filtrar rutas por el conductor actual
        const driverRoute = data.data.find(r => 
          r.driver.id === user.id
        );
        
        if (driverRoute) {
          setRoute(driverRoute);
          // Ordenar las paradas por sequence y mapear a nuestro formato
          const sortedStops = driverRoute.stores
            .sort((a, b) => a.sequence - b.sequence)
            .map((stop, index) => ({
              id: stop.store.id,
              address: stop.store.location.address,
              storeName: stop.store.name,
              phone: stop.store.phone,
              latitude: stop.store.location.latitude,
              longitude: stop.store.location.longitude,
              orderNumber: `STOP-${index + 1}`,
              status: "pending"
            }));
          
          setStops(sortedStops);
        } else {
          Alert.alert("Info", "You don't have an asigned Route");
        }
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routes:", error);
      Alert.alert("Error", "Could'nt get Route information");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [user.id]);

  const handleTrip = () => {
    if (!onTrip && !tripFinished) {
      // Iniciar nuevo viaje
      setOnTrip(true);
      setTripFinished(false);
    } else if (onTrip) {
      // Avanzar en el viaje
      const updatedStops = [...stops];
      updatedStops[currentStopIndex].status = "completed";
      setStops(updatedStops);
      
      if (currentStopIndex < stops.length - 1) {
        setCurrentStopIndex(currentStopIndex + 1);
      } else {
        // Finalizar viaje
        finishTrip();
      }
    }
  };

  const finishTrip = () => {
    setOnTrip(false);
    setTripFinished(true);
    setCurrentStopIndex(0);
    setStops(stops.map(stop => ({...stop, status: "pending"})));
  };

  const startNewTrip = () => {
    setTripFinished(false);
  };

  const renderTripInfo = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#21BEBA" />
        </View>
      );
    }

    if (tripFinished) {
      // Mostrar mensaje de viaje completado
      return (
        <View style={styles.emptyTripContainer}>
          <Text style={styles.emptyTripText}>Trip completed successfully</Text>
          <Text style={styles.routeName}>{route?.name}</Text>
          <TouchableOpacity 
            style={styles.newTripButton} 
            onPress={startNewTrip}
          >
            <Text style={styles.newTripButtonText}>Start new trip</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (!onTrip) {
      // Mostrar planificación del viaje
      return (
        <ScrollView 
          style={styles.tripInfoContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.routeName}>{route?.name}</Text>
          <Text style={styles.sectionTitle}>Trip schedule</Text>
          {stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopCard}>
              <Text style={styles.stopNumber}>Stop #{index + 1}</Text>
              <Text style={styles.storeName}>{stop.storeName}</Text>
              <Text style={styles.stopAddress}>{stop.address}</Text>
              <Text style={styles.stopDetails}>Phone: {stop.phone}</Text>
            </View>
          ))}
        </ScrollView>
      );
    } else {
      // Mostrar progreso del viaje
      const completedStops = stops
        .slice(0, currentStopIndex)
        .reverse();

      return (
        <ScrollView style={styles.tripProgressContainer}>
          <Text style={styles.routeName}>{route?.name}</Text>
          <Text style={styles.sectionTitle}>Current Stop</Text>
          <View style={[styles.stopCard, styles.currentStopCard]}>
            <Text style={styles.stopNumber}>Stop #{currentStopIndex + 1}</Text>
            <Text style={styles.storeName}>{stops[currentStopIndex].storeName}</Text>
            <Text style={styles.stopAddress}>{stops[currentStopIndex].address}</Text>
            <Text style={styles.stopDetails}>Phone: {stops[currentStopIndex].phone}</Text>
          </View>

          {currentStopIndex > 0 && (
            <>
              <Text style={styles.sectionTitle}>Completed stops</Text>
              {completedStops.map((stop, index) => (
                <View key={stop.id} style={[styles.stopCard, styles.completedStopCard]}>
                  <Text style={styles.stopNumber}>Stop ✓</Text>
                  <Text style={styles.storeName}>{stop.storeName}</Text>
                  <Text style={styles.stopAddress}>{stop.address}</Text>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      );
    }
  };

  const getButtonText = () => {
    if (loading) return "LOADING...";
    if (tripFinished) return "TRIP COMPLETED";
    if (!onTrip) return "START TRIP";
    return currentStopIndex < stops.length - 1 ? "NEXT STOP" : "FINISH TRIP";
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TouchableOpacity 
          style={[
            styles.button, 
            (tripFinished || loading || stops.length === 0) && styles.disabledButton
          ]} 
          onPress={handleTrip}
          disabled={tripFinished || loading || stops.length === 0}
        >
          <Text style={[
            styles.buttonText,
            (tripFinished || loading || stops.length === 0) && styles.disabledButtonText
          ]}>
            {getButtonText()}
          </Text>
        </TouchableOpacity>

        {renderTripInfo()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2ECF5',
  },
  body: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    marginTop: 30,
    marginBottom: 20,
    borderColor: '#21BEBA',
    borderWidth: 1,
    borderRadius: 100,
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: 'white',
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
    borderColor: '#BDBDBD',
  },
  buttonText: {
    color: '#21BEBA',
    fontWeight: 'bold',
    fontSize: 24,
  },
  disabledButtonText: {
    color: '#9E9E9E',
  },
  routeName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0277BD',
    marginVertical: 10,
    alignSelf: 'center',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginVertical: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  tripInfoContainer: {
    width: '90%',
    marginTop: 10,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tripProgressContainer: {
    width: '90%',
    marginTop: 10,
  },
  stopCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  currentStopCard: {
    borderLeftWidth: 5,
    borderLeftColor: '#beb421ff',
  },
  completedStopCard: {
    opacity: 0.7,
    borderLeftWidth: 5,
    borderLeftColor: '#2ECC71',
  },
  stopNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 5,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#34495E',
    marginBottom: 5,
  },
  stopAddress: {
    fontSize: 16,
    color: '#34495E',
    marginBottom: 5,
  },
  stopDetails: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  emptyTripContainer: {
    width: '90%',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyTripText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  newTripButton: {
    backgroundColor: '#21BEBA',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 15,
  },
  newTripButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;