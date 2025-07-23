import React, { useState, useEffect, useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Dimensions, 
  ScrollView 
} from 'react-native';
import Header from '../components/Header';
import { LineChart } from 'react-native-chart-kit';
import { useUser } from '../context/UserContext';

const AnalyticsScreen = () => {
  const { user } = useUser();
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener dimensiones de la pantalla
  const screenWidth = Dimensions.get('window').width * 0.9;
  const chartHeight = Dimensions.get('window').height * 0.35;

  const fetchData = async () => {
    try {
      const response = await fetch('http://192.168.0.11:5125/api/Reading');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Filtrar y ordenar datos
      const filteredData = result.data
        .filter(reading => reading.idTruck === user.idTruck)
        .sort((a, b) => new Date(a.date) - new Date(b.date));
      
      setReadings(filteredData);
      setLoading(false);
    } catch (err) {
      setError("Error loading data");
      setLoading(false);
      console.error(err);
    }
  };

  useEffect(() => {
    // Carga inicial
    fetchData();

    // Configurar intervalo para actualizaciones periódicas
    const intervalId = setInterval(() => {
      fetchData();
    }, 2000); // Actualizar cada 2 segundos

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [user.idTruck]);

  const prepareChartData = () => {
    const labels = readings.map(reading => 
      new Date(reading.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
    
    return {
      labels,
      datasets: [
        {
          data: readings.map(reading => reading.temperature),
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
          strokeWidth: 2
        },
        {
          data: readings.map(reading => reading.percHumidity),
          color: (opacity = 1) => `rgba(66, 165, 245, ${opacity})`,
          strokeWidth: 2
        }
      ]
    };
  };

  const chartConfig = {
    backgroundColor: '#FFF',
    backgroundGradientFrom: '#FFF',
    backgroundGradientTo: '#FFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#89B6DD'
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#89B6DD" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* Gráfica de Temperatura */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Temperature (°C)</Text>
          <LineChart
            data={{
              labels: prepareChartData().labels,
              datasets: [prepareChartData().datasets[0]]
            }}
            width={screenWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Gráfica de Humedad */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Humidity (%)</Text>
          <LineChart
            data={{
              labels: prepareChartData().labels,
              datasets: [prepareChartData().datasets[1]]
            }}
            width={screenWidth}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E2ECF5',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 10,
    marginTop: 20,
    width: '90%',
    alignItems: 'center'
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  chart: {
    borderRadius: 16,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
});

export default AnalyticsScreen;