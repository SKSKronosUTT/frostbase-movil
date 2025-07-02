import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Header from '../components/Header';

const HistoryScreen = () => {
  const transactions = [
    {
      id: 1,
      store: "Soriana Hiper",
      address: "Blvd. Gustavo Díaz Ordaz 17151, Jardines de La Mesa, 22680 Tijuana, B.C.",
      date: "17 Sep 2023",
      time: "10:34 AM",
      status: "confirmed"
    },
   
  ];

  const TransactionCard = ({ store, address, date, time, status }) => {
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
  };

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.transactionsList}>
        {transactions.map((t) => (
          <TransactionCard key={t.id} {...t} />
        ))}
      </ScrollView>
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
    backgroundColor: '#B3C5F7',
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

export default HistoryScreen;