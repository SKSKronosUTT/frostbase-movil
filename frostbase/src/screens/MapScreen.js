import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Dimensions, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const MapScreen = () => {
  return (
    <View style={styles.container}>
      {}
      <Image 
        style={styles.backgroundImage} 
        source={require('../assets/images/map.png')} 
        /* Imagen del mapa de la Ciudad de México con líneas de metro */
      />
      
      {}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Busca aquí"
          placeholderTextColor="#868686"
        />
        <View style={styles.searchIcons}>
          <Feather name="search" size={20} color="#616161" />
          <Feather name="filter" size={16} color="#64B5F6" />
        </View>
      </View>
      
  
      
      {}
      <Text style={styles.locationLabel}>Casa</Text>
      
      {}
      {/* <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Agregar nuevo lugar</Text>
      </TouchableOpacity> */}
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
  backgroundImage: {
    width: width,
    height: height,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  searchContainer: {
    width: width * 0.85,
    height: 66,
    position: 'absolute',
    left: width * 0.075,
    top: Platform.OS === 'ios' ? 86 : 56,
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
  mapMarker: {
    position: 'absolute',
    left: 149,
    top: 429,
    width: 30,
    height: 40,
  },
  pinBase: {
    width: 19.26,
    height: 31.89,
    backgroundColor: '#BF360C',
    borderRadius: 10,
    position: 'absolute',
    left: 8,
    top: 8,
  },
  pinTop: {
    width: 16.09,
    height: 18.72,
    backgroundColor: '#BF360C',
    borderRadius: 8,
    position: 'absolute',
    left: 2,
    top: 11,
  },
  pinShadow: {
    width: 14.49,
    height: 10.59,
    backgroundColor: '#BF360C',
    opacity: 0.3,
    borderRadius: 5,
    position: 'absolute',
    left: 4,
    top: 0,
  },
  locationLabel: {
    position: 'absolute',
    left: width * 0.12,
    top: height - 120,
    width: width * 0.6,
    color: '#0A0909',
    fontSize: 15,
    fontFamily: 'Inter',
    fontWeight: '400',
  },
  // addButton: {
  //   position: 'absolute',
  //   left: width * 0.12,
  //   right: width * 0.12,
  //   top: height - 50,
  //   height: 50,
  //   backgroundColor: '#64B5F6',
  //   borderRadius: 25,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // addButtonText: {
  //   color: 'white',
  //   fontSize: 15,
  //   fontFamily: 'Inter',
  //   fontWeight: '700',
  // },
});

export default MapScreen;