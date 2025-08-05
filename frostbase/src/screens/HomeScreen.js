import React, { useState, useEffect, useCallback } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator,
  Alert,
  RefreshControl
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
  const [currentTripId, setCurrentTripId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Obtener órdenes pendientes
  const fetchPendingOrders = async () => {
    try {
      const response = await fetch(api.url + 'Order/pending');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.status === 0 ? data.data : [];
    } catch (error) {
      console.error("Error fetching pending orders:", error);
      return [];
    }
  };

  // Iniciar un nuevo viaje en el backend
  const startTripInBackend = async () => {
    try {
      const startDate = new Date().toISOString();
      
      const tripData = {
        idTruck: user.truckData.id,
        idDriver: user.id,
        idRoute: route.id,
        startDate: startDate
      };

      const response = await fetch(api.url + 'Trip/Start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const responseData = await response.json();
      
      if (responseData.status === 0) {
        setCurrentTripId(responseData.data.id);
        return responseData.data.id;
      } else {
        throw new Error(responseData.message || "Failed to start trip");
      }
    } catch (error) {
      console.error("Error starting trip:", error);
      Alert.alert("Error", "Couldn't start trip in backend");
      throw error;
    }
  };

  // Iniciar una orden en el backend
  const startOrderInBackend = async (tripId, orderId) => {
    try {
      const response = await fetch(`${api.url}Trip/${tripId}/StartOrder/${orderId}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const responseData = await response.json();
      
      if (responseData.status !== 0) {
        throw new Error(responseData.message || "Failed to start order");
      }
    } catch (error) {
      console.error("Error starting order:", error);
      Alert.alert("Error", "Couldn't start order in backend");
      throw error;
    }
  };

  // Finalizar una orden en el backend
  const endOrderInBackend = async (tripId, orderId) => {
    try {
      const response = await fetch(`${api.url}Trip/${tripId}/EndOrder/${orderId}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const responseData = await response.json();
      
      if (responseData.status !== 0) {
        throw new Error(responseData.message || "Failed to end order");
      }
    } catch (error) {
      console.error("Error ending order:", error);
      Alert.alert("Error", "Couldn't end order in backend");
      throw error;
    }
  };

  // Finalizar el viaje en el backend
  const endTripInBackend = async (tripId) => {
    try {
      const response = await fetch(`${api.url}Trip/End/${tripId}`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const responseData = await response.json();
      
      if (responseData.status !== 0) {
        throw new Error(responseData.message || "Failed to end trip");
      }
    } catch (error) {
      console.error("Error ending trip:", error);
      Alert.alert("Error", "Couldn't end trip in backend");
      throw error;
    }
  };

  // Obtener ruta y combinar con órdenes pendientes
const fetchRouteWithPendingOrders = useCallback(async () => {
    setLoading(true);
    try {
      // Obtener la ruta específica del conductor y órdenes pendientes en paralelo
      const [routeResponse, pendingOrders] = await Promise.all([
        fetch(`${api.url}Route/driver/${user.id}`),
        fetchPendingOrders()
      ]);

      // Verificar respuesta de la ruta
      if (!routeResponse.ok) throw new Error(`HTTP error! status: ${routeResponse.status}`);
      
      const routeData = await routeResponse.json();
      
      // Si hay datos de ruta
      if (routeData.status === 0 && routeData.data) {
        const driverRoute = routeData.data;
        setRoute(driverRoute);
        
        // Obtener IDs de tiendas en la ruta
        const routeStoreIds = driverRoute.stores.map(store => store.store.id);
        
        // Filtrar órdenes pendientes que pertenecen a esta ruta
        const routePendingOrders = pendingOrders.filter(order => 
          routeStoreIds.includes(order.store.id)
        );

        // Crear paradas con órdenes pendientes
        const stopsWithPendingOrders = driverRoute.stores
          .filter(store => 
            pendingOrders.some(order => order.store.id === store.store.id)
          )
          .sort((a, b) => a.sequence - b.sequence)
          .map((stop, index) => {
            const order = pendingOrders.find(o => o.store.id === stop.store.id);
            return {
              id: stop.store.id,
              address: stop.store.location.address,
              storeName: stop.store.name,
              phone: stop.store.phone,
              latitude: stop.store.location.latitude,
              longitude: stop.store.location.longitude,
              orderNumber: order ? order.id : `STOP-${index + 1}`,
              status: "pending",
              orderDetails: order
            };
          });
        
        setStops(stopsWithPendingOrders);
        
        if (stopsWithPendingOrders.length === 0) {
          Alert.alert("Info", "No pending orders for your route");
        }
      } else {
        Alert.alert("Info", "You don't have an assigned Route");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Couldn't get route information");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchRouteWithPendingOrders();
  }, [fetchRouteWithPendingOrders]);

  // Función para manejar el refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRouteWithPendingOrders();
  }, [fetchRouteWithPendingOrders]);

  const updateTruckStatus = async (status) => {
    try {
      const response = await fetch(`${api.url}Truck`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: user.truckData.id,
          brand: user.truckData.brand,
          model: user.truckData.model,
          licensePlate: user.truckData.licensePlate,
          idStateTruck: status
        })
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const responseData = await response.json();
      
      if (responseData.status !== 0) {
        throw new Error(responseData.message || "Failed to update truck status");
      }
    } catch (error) {
      console.error("Error updating truck status:", error);
      Alert.alert("Error", "Couldn't update truck status");
      throw error;
    }
  };

  // Modificar la función handleTrip para incluir el cambio de estado
  const handleTrip = async () => {
    if (buttonLoading) return;
    setButtonLoading(true);

    try {
      if (!onTrip && !tripFinished) {
        // Iniciar viaje - cambiar estado a "In Route" (IR)
        await updateTruckStatus("IR");
        const tripId = await startTripInBackend();
        if (stops.length > 0) {
          await startOrderInBackend(tripId, stops[0].orderDetails.id);
        }
        setOnTrip(true);
        setTripFinished(false);
      } else if (onTrip) {
        const currentOrderId = stops[currentStopIndex].orderDetails.id;
        await endOrderInBackend(currentTripId, currentOrderId);
        
        const updatedStops = [...stops];
        updatedStops[currentStopIndex].status = "completed";
        setStops(updatedStops);
        if (currentStopIndex < stops.length - 1) {
          const nextOrderId = stops[currentStopIndex + 1].orderDetails.id;
          await startOrderInBackend(currentTripId, nextOrderId);
          setCurrentStopIndex(currentStopIndex + 1);
        } else {
          await finishTrip();
        }
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Operation failed. Please try again.");
    } finally {
      setButtonLoading(false);
    }
  };

  // Modificar finishTrip para cambiar estado a "Available" (AV)
  const finishTrip = async () => {
    try {
      await endTripInBackend(currentTripId);
      await updateTruckStatus("AV");
      
      setOnTrip(false);
      setTripFinished(true);
      setCurrentStopIndex(0);
      setCurrentTripId(null);
      setStops(stops.map(stop => ({...stop, status: "pending"})));
    } catch (error) {
      console.error("Error finishing trip:", error);
    }
  };

  // Modificar startNewTrip para asegurar estado correcto
  const startNewTrip = async () => {
    try {
      // Asegurarse que el camión está disponible antes de nuevo viaje
      await updateTruckStatus("AV");
      setTripFinished(false);
      await fetchRouteWithPendingOrders();
    } catch (error) {
      console.error("Error starting new trip:", error);
    }
  };

 const renderTripInfo = () => {
    if (loading && !refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#21BEBA" />
        </View>
      );
    }

    if (tripFinished) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#21BEBA']}
              tintColor="#21BEBA"
            />
          }
          contentContainerStyle={styles.emptyTripContainer}
        >
          <Text style={styles.emptyTripText}>Trip completed successfully</Text>
          <Text style={styles.routeName}>{route?.name}</Text>
          <TouchableOpacity 
            style={styles.newTripButton} 
            onPress={startNewTrip}
          >
            <Text style={styles.newTripButtonText}>Start new trip</Text>
          </TouchableOpacity>
        </ScrollView>
      );
    } else if (!onTrip) {
      return (
        <ScrollView 
          style={styles.tripInfoContainer}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#21BEBA']}
              tintColor="#21BEBA"
            />
          }
        >
          <Text style={styles.routeName}>{route?.name}</Text>
          <Text style={styles.sectionTitle}>Pending deliveries ({stops.length})</Text>
          {stops.length > 0 ? (
            stops.map((stop, index) => (
              <View key={stop.id} style={styles.stopCard}>
                <Text style={styles.stopNumber}>Delivery #{index + 1}</Text>
                <Text style={styles.storeName}>{stop.storeName}</Text>
                <Text style={styles.stopAddress}>{stop.address}</Text>
                <Text style={styles.stopDetails}>Phone: {stop.phone}</Text>
                <Text style={styles.orderNumber}>Order: {stop.orderNumber}</Text>
                <Text style={styles.deliveryDate}>
                  Deliver by: {new Date(stop.orderDetails.deliverDate).toLocaleDateString()}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noStopsText}>No pending deliveries for your route</Text>
          )}
        </ScrollView>
      );
    } else {
      const completedStops = stops.slice(0, currentStopIndex).reverse();

      return (
        <ScrollView 
          style={styles.tripProgressContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#21BEBA']}
              tintColor="#21BEBA"
            />
          }
        >
          <Text style={styles.routeName}>{route?.name}</Text>
          <Text style={styles.sectionTitle}>Current Delivery</Text>
          <View style={[styles.stopCard, styles.currentStopCard]}>
            <Text style={styles.stopNumber}>Delivery #{currentStopIndex + 1}</Text>
            <Text style={styles.storeName}>{stops[currentStopIndex].storeName}</Text>
            <Text style={styles.stopAddress}>{stops[currentStopIndex].address}</Text>
            <Text style={styles.stopDetails}>Phone: {stops[currentStopIndex].phone}</Text>
            <Text style={styles.orderNumber}>Order: {stops[currentStopIndex].orderNumber}</Text>
          </View>

          {currentStopIndex > 0 && (
            <>
              <Text style={styles.sectionTitle}>Completed deliveries</Text>
              {completedStops.map((stop, index) => (
                <View key={stop.id} style={[styles.stopCard, styles.completedStopCard]}>
                  <Text style={styles.stopNumber}>Delivery ✓</Text>
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
    if (!onTrip) return stops.length > 0 ? "START DELIVERIES" : "NO PENDING DELIVERIES";
    return currentStopIndex < stops.length - 1 ? "NEXT DELIVERY" : "COMPLETE TRIP";
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TouchableOpacity 
          style={[
            styles.button, 
            (tripFinished || loading || stops.length === 0 || buttonLoading) && styles.disabledButton
          ]} 
          onPress={handleTrip}
          disabled={tripFinished || loading || stops.length === 0 || buttonLoading}
        >
          {buttonLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[
              styles.buttonText,
              (tripFinished || loading || stops.length === 0) && styles.disabledButtonText
            ]}>
              {getButtonText()}
            </Text>
          )}
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
  orderNumber: {
    fontSize: 12,
    color: '#0277BD',
    marginTop: 4,
    fontWeight: '600'
  },
  deliveryDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    fontStyle: 'italic'
  },
  noStopsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16
  }
});

export default HomeScreen;