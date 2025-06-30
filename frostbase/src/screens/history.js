import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function HistoryScreen() {
  const transactions = [
    {
      id: 1,
      store: "Soriana Hiper",
      address: "Blvd. Gustavo Díaz Ordaz 17151, Jardines de La Mesa, 22680 Tijuana, B.C.",
      date: "17 Sep 2023",
      time: "10:34 AM",
      status: "confirmed"
    },
    // Puedes agregar más transacciones aquí
  ];

  function TransactionCard({ store, address, date, time, status }) {
    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionContent}>
          <View style={styles.transactionLeft}>
            <View style={styles.transactionIcon}>
              <Feather name="shopping-bag" size={24} color="#fff" />
            </View>
            <View style={styles.transactionDetails}>
              <Text style={styles.storeName} numberOfLines={1} ellipsizeMode="tail">
                {store}
              </Text>
              <Text style={styles.storeAddress} numberOfLines={2} ellipsizeMode="tail">
                {address}
              </Text>
            </View>
          </View>
          <View style={styles.transactionRight}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{status}</Text>
            </View>
            <Text style={styles.dateText}>{date}</Text>
            <Text style={styles.timeText}>{time}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.humiditySection}>
          <Text style={styles.weatherTitle}>Humidity</Text>
          <Text style={styles.weatherValue}>75%</Text>
        </View>
        <View style={styles.temperatureSection}>
          <Text style={styles.weatherTitle}>Temperature</Text>
          <Text style={styles.temperatureValue}>-50°</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.transactionsList}>
        {transactions.map((t) => (
          <TransactionCard key={t.id} {...t} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2ECF5',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  header: {
    width: '100%',
    height: 250,
    backgroundColor: '#7BB8E0',
    borderBottomLeftRadius: 20,   // Redondeo solo abajo
    borderBottomRightRadius: 20,  // Redondeo solo abajo
    borderTopLeftRadius: 0,       // Arriba plano
    borderTopRightRadius: 0,      // Arriba plano
    paddingTop: 40,
    paddingHorizontal: 20,
    justifyContent: 'center'
  },
  humiditySection: { marginBottom: 20 },
  temperatureSection: {},
  weatherTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '300'
  },
  weatherValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: '300'
  },
  temperatureValue: {
    color: 'white',
    fontSize: 48,
    fontWeight: '300'
  },
  transactionsList: {
    padding: 16,
    paddingBottom: 130,
    width: '100%', // Asegurar que ocupe todo el ancho
  },
  transactionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 20, // Más padding vertical
    paddingHorizontal: 16, // Más padding horizontal
    marginBottom: 20,
    borderWidth: 0,
    shadowColor: '#539DF3',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    width: '100%', // Asegurar que la tarjeta ocupe todo el ancho disponible
  },
  transactionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%', // Asegurar que el contenido ocupe todo el ancho
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16, // Margen derecho para separar del lado derecho
  },
  transactionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#B3C5F7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12, // Separación del ícono con el texto
    flexShrink: 0, // Evitar que el ícono se encoja
  },
  transactionDetails: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 48, // Altura mínima para alinear con el ícono
  },
  storeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
    lineHeight: 20, // Altura de línea específica
  },
  storeAddress: {
    fontSize: 13,
    color: '#444',
    lineHeight: 18, // Altura de línea específica para mejor legibilidad
    flexWrap: 'wrap',
  },
  transactionRight: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 90, // Ancho mínimo más generoso
    flexShrink: 0, // Evitar que se encoja
    minHeight: 48, // Altura mínima para alinear con el ícono
  },
  statusBadge: {
    backgroundColor: 'rgba(0,255,148,0.2)',
    borderRadius: 6, // Un poco más redondeado
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 8, // Más separación
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#5DC486',
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
  },
});