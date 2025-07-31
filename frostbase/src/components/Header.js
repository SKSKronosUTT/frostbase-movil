import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useUser } from "../context/UserContext";
import { Ionicons } from '@expo/vector-icons';
import { api } from "../config/api";

const Header = () => {
    const { user } = useUser();
    const [humidity, setHumidity] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(null);
    const [alert, setAlert] = useState({ temp: false, humidity: false });
    
    // Función para obtener los parámetros
    const fetchParameters = async () => {
        try {
            const response = await fetch(api.url + 'Parameter');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            if (data.status === 0) {
                setParams(data.data);
            }
        } catch (err) {
            console.error("Error fetching parameters:", err);
        }
    };

    // Función para obtener las lecturas
    const fetchReadings = async () => {
        try {
            const response = await fetch(api.url + 'Reading');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            const truckReadings = data.data
                .filter(reading => reading.truck.id === user.truckData.id)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (truckReadings.length > 0) {
                const latestReading = truckReadings[0];
                setHumidity(latestReading.percHumidity);
                setTemperature(latestReading.temp);
                
                // Validar contra parámetros si están disponibles
                if (params) {
                    validateReadings(
                        latestReading.temp, 
                        latestReading.percHumidity
                    );
                }
            } else {
                setError("No data for this Truck");
            }
            
            setLoading(false);
        } catch (err) {
            setError("Error getting data");
            setLoading(false);
            console.error("Fetch error:", err);
        }
    };
    
    // Función para validar las lecturas
    const validateReadings = (temp, hum) => {
        const newAlert = { temp: false, humidity: false };
        
        if (temp > params.maxTemperature || temp < params.minTemperature) {
            newAlert.temp = true;
            // Mostrar alerta solo la primera vez que se detecta
            if (!alert.temp) {
                Alert.alert(
                    "Temperature Alert",
                    `The temperature (${temp}°C) is out of parameters (${params.minTemperature}°C - ${params.maxTemperature}°C)`
                );
            }
        }
        
        if (hum > params.maxHumidity || hum < params.minHumidity) {
            newAlert.humidity = true;
            // Mostrar alerta solo la primera vez que se detecta
            if (!alert.humidity) {
                Alert.alert(
                    "Humidity Alert",
                    `The humidity (${hum}%) is out of parameters (${params.minHumidity}% - ${params.maxHumidity}%)`
                );
            }
        }
        
        setAlert(newAlert);
    };

    useEffect(() => {
        // Cargar parámetros primero
        fetchParameters();
        
        // Luego configurar el intervalo para lecturas
        fetchReadings();
        const interval = setInterval(fetchReadings, 5000);

        return () => clearInterval(interval);
    }, [params]); // Se ejecuta de nuevo si params cambia

    // Estilos condicionales para alertas
    const getValueStyle = (type) => {
        const baseStyle = {
            color: 'white',
            fontSize: 48,
            marginLeft: 20,
        };
        
        if (type === 'temp' && alert.temp) {
            return {
                ...baseStyle,
                color: '#e50000ff', // Rojo para alerta
                fontWeight: 'bold'
            };
        }
        
        if (type === 'humidity' && alert.humidity) {
            return {
                ...baseStyle,
                color: '#e50000ff', // Rojo para alerta
                fontWeight: 'bold'
            };
        }
        
        return baseStyle;
    };

    return(
        <View style={styles.header}>
            <View style={styles.row}>
                <Text style={styles.headerText}>Humidity</Text>
                {alert.humidity && (
                    <Ionicons name="warning" size={24} color="#e50000ff" style={styles.alertIcon} />
                )}
            </View>
            <Text style={getValueStyle('humidity')}>
                {humidity !== null ? `${humidity}%` : '--'}
            </Text>
            
            <View style={styles.row}>
                <Text style={styles.headerText}>Temperature</Text>
                {alert.temp && (
                    <Ionicons name="warning" size={24} color="#e50000ff" style={styles.alertIcon} />
                )}
            </View>
            <Text style={getValueStyle('temp')}>
                {temperature !== null ? `${temperature}° C` : '--'}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: 300,
        paddingLeft: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: '#0277BD',
    },
    headerText: {
        color: 'white',
        fontSize: 36,
        fontWeight: '300'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    alertIcon: {
        marginLeft: 10
    },
    loadingText: {
        color: 'white',
        fontSize: 18,
        marginLeft: 20,
    }
})

export default Header;