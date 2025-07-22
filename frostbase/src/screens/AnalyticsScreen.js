import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Header from '../components/Header';

const AnalyticsScreen = () => {


  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.chart}>
        <Text>Monitoring</Text>
        <Text>CHART</Text>
      </View>
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
  chart:{
    backgroundColor: '#FFF',
    width: '90%',
    height: '50%',
    marginTop: 50,
    borderRadius: 16
  },

});

export default AnalyticsScreen;