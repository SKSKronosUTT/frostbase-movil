import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import Header from "../components/Header";

const tripData = [
  {
    id: 1,
    address: "Calle Principal 123, Ciudad A",
    orderNumber: "ORD-1001",
    status: "pending"
  },
  {
    id: 2,
    address: "Avenida Central 456, Ciudad B",
    orderNumber: "ORD-1002",
    status: "pending"
  },
  {
    id: 3,
    address: "Boulevard Norte 789, Ciudad C",
    orderNumber: "ORD-1003",
    status: "pending"
  },
  {
    id: 4,
    address: "Calle Sur 321, Ciudad D",
    orderNumber: "ORD-1004",
    status: "pending"
  },
  {
    id: 5,
    address: "Avenida Este 654, Ciudad E",
    orderNumber: "ORD-1005",
    status: "pending"
  }
];

const HomeScreen = () => {
  const [onTrip, setOnTrip] = useState(false);
  const [tripFinished, setTripFinished] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [stops, setStops] = useState(tripData);

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
    if (tripFinished) {
      // Mostrar mensaje de viaje completado
      return (
        <View style={styles.emptyTripContainer}>
          <Text style={styles.emptyTripText}>There are no Trips asigned</Text>
          <TouchableOpacity 
            style={styles.newTripButton} 
            onPress={startNewTrip}
          >
            <Text style={styles.newTripButtonText}>Plan new Trip</Text>
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
          <Text style={styles.sectionTitle}>Trip Schedule</Text>
          {stops.map((stop, index) => (
            <View key={stop.id} style={styles.stopCard}>
              <Text style={styles.stopNumber}>Stop #{index + 1}</Text>
              <Text style={styles.stopAddress}>{stop.address}</Text>
              <Text style={styles.stopDetails}>Order: {stop.orderNumber}</Text>
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
          <Text style={styles.sectionTitle}>Current Stop</Text>
          <View style={[styles.stopCard, styles.currentStopCard]}>
            <Text style={styles.stopNumber}>Stop #{currentStopIndex + 1}</Text>
            <Text style={styles.stopAddress}>{stops[currentStopIndex].address}</Text>
            <Text style={styles.stopDetails}>Order: {stops[currentStopIndex].orderNumber}</Text>
          </View>

          {currentStopIndex > 0 && (
            <>
              <Text style={styles.sectionTitle}>Completed Orders</Text>
              {completedStops.map((stop) => (
                <View key={stop.id} style={[styles.stopCard, styles.completedStopCard]}>
                  <Text style={styles.stopNumber}>Stop #{stop.id} ✓</Text>
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
    if (tripFinished) return "TRIP COMPLETED";
    if (!onTrip) return "START TRIP";
    return currentStopIndex < stops.length - 1 ? "NEXT STOP" : "END TRIP";
  };

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.body}>
        <TouchableOpacity 
          style={[
            styles.button, 
            tripFinished && styles.disabledButton
          ]} 
          onPress={handleTrip}
          disabled={tripFinished}
        >
          <Text style={[
            styles.buttonText,
            tripFinished && styles.disabledButtonText
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
    marginBottom: 20,
  },
  newTripButton: {
    backgroundColor: '#21BEBA',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  newTripButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;