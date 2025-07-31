import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';
import { useUser } from '../context/UserContext';
import { api } from '../config/api';

const HistoryScreen = () => {
  const { user } = useUser();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  // Función para formatear la hora
  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString('es-MX', options);
  };

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(api.url + 'Trip');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 0) {
          // Filtrar viajes completados por el conductor actual
          const completedTrips = data.data.filter(trip => 
            trip.driver.id === user.id && 
            trip.state.id === 'CP' // Completed trips
          );
          
          setTrips(completedTrips);
        } else {
          setError("Error al obtener los viajes");
        }
      } catch (err) {
        console.error("Error fetching trips:", err);
        setError("Could not connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [user.id]);

  const TransactionCard = ({ trip }) => {
    // Tomamos la primera orden para mostrar información de la tienda
    const firstOrder = trip.orders[0];
    const startDate = formatDate(trip.tripTime.startTime);
    const startTime = formatTime(trip.tripTime.startTime);
    const endTime = formatTime(trip.tripTime.endTime);

    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionContent}>
          <View style={styles.transactionLeft}>
            <View style={styles.transactionIcon}>
              <Feather name="truck" size={24} color="#fff" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.storeName} numberOfLines={1} ellipsizeMode="tail">
                {trip.route.name}
              </Text>
              <Text style={styles.storeAddress} numberOfLines={2} ellipsizeMode="tail">
                {firstOrder?.store?.location?.address || 'Location no available'}
              </Text>
              <Text style={styles.truckInfo}>
                {trip.truck.brand} {trip.truck.model} - {trip.truck.licensePlate}
              </Text>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{trip.state.message}</Text>
            </View>
            <Text style={styles.dateText}>{startDate}</Text>
            <Text style={styles.timeText}>{startTime} - {endTime}</Text>
            <Text style={styles.ordersText}>
              {trip.orders.length} {trip.orders.length === 1 ? 'order' : 'orders'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0277BD" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      {trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={48} color="#B3C5F7" />
          <Text style={styles.emptyText}>You do not have completed trips.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.transactionsList}>
          {trips.map((trip) => (
            <TransactionCard key={trip.id} trip={trip} />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2ECF5',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 18,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    color: '#555',
    fontSize: 18,
    marginTop: 16,
    textAlign: 'center',
  },
  transactionsList: {
    padding: 16,
    paddingBottom: 130,
    width: '100%', 
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 20, 
    paddingHorizontal: 16, 
    marginBottom: 20,
    borderWidth: 0,
    shadowColor: '#539DF3',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    width: '100%', 
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%', 
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16,
  },
  transactionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#0277BD',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12, 
    flexShrink: 0,
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 48, 
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
    lineHeight: 20, 
  },
  storeAddress: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18, 
    flexWrap: 'wrap',
  },
  truckInfo: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 90, 
    flexShrink: 0, 
    minHeight: 48, 
  },
  statusBadge: {
    backgroundColor: 'rgba(0,255,148,0.2)',
    borderRadius: 6, 
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0277BD',
    textAlign: 'center',
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(38,39,58,0.6)',
    marginBottom: 2,
    textAlign: 'right',
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(38,39,58,0.6)',
    textAlign: 'right',
    marginBottom: 4,
  },
  ordersText: {
    fontSize: 11,
    color: '#0277BD',
    fontWeight: '600',
  },
});

export default HistoryScreen;