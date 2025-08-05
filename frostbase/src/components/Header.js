import { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useUser } from "../context/UserContext";
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av'; // Importamos el módulo de audio
import { api } from "../config/api";

const Header = () => {
    const { user } = useUser();
    const [humidity, setHumidity] = useState(null);
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState(null);
    const [alert, setAlert] = useState({ temp: false, humidity: false });
    const soundRef = useRef(null); // Referencia para el sonido
    const lastAlertTimeRef = useRef({ temp: 0, humidity: 0 }); // Tiempo de última alerta

    // Cargar el sonido al iniciar
    useEffect(() => {
        async function loadSound() {
            const { sound } = await Audio.Sound.createAsync(
                require('../assets/sound/alert.mp3') // Asegúrate de tener este archivo
            );
            soundRef.current = sound;
        }
        loadSound();

        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    // Función para reproducir sonido
    const playAlertSound = async () => {
        try {
            if (soundRef.current) {
                await soundRef.current.replayAsync();
            }
        } catch (error) {
            console.error("Error playing sound:", error);
        }
    };

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
            // const response = await fetch(api.url + 'Reading/Truck/' + user.truckData.id + '?truckId=' + user.truckData.id);
            const response = await fetch(api.url + 'Reading/Latest/Truck/' + user.truckData.id);
            console.log(user.truckData.id)
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//a            
            const data = await response.json();
            const truckReadings = data
            
            if (truckReadings) {
                const latestReading = truckReadings;
                setHumidity(latestReading.percHumidity);
                setTemperature(latestReading.temp);
                
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
    
    // Función mejorada para validar las lecturas
    const validateReadings = (temp, hum) => {
        const now = Date.now();
        const newAlert = { temp: false, humidity: false };
        const ALERT_COOLDOWN = 60000; // 30 segundos entre alertas

        // Validación de temperatura
        if (temp > params.maxTemperature || temp < params.minTemperature) {
            newAlert.temp = true;
            if ((now - lastAlertTimeRef.current.temp > ALERT_COOLDOWN)) {
                Alert.alert(
                    "Temperature Alert",
                    `The temperature (${temp}°C) is out of parameters (${params.minTemperature}°C - ${params.maxTemperature}°C)`,
                    [{ text: "OK" }]
                );
                console.log('alerta');
                playAlertSound();
                lastAlertTimeRef.current.temp = now;
            }
        }

        // Validación de humedad
        if (hum > params.maxHumidity || hum < params.minHumidity) {
            newAlert.humidity = true;
            if ((now - lastAlertTimeRef.current.humidity > ALERT_COOLDOWN)) {
                Alert.alert(
                    "Humidity Alert",
                    `The humidity (${hum}%) is out of parameters (${params.minHumidity}% - ${params.maxHumidity}%)`,
                    [{ text: "OK" }]
                );
                playAlertSound();
                lastAlertTimeRef.current.humidity = now;
            }
        }

        setAlert(newAlert);
    };

    // Cargar parámetros sólo una vez
    useEffect(() => {
        fetchParameters();
    }, []);

    // Configurar intervalo para lecturas
    useEffect(() => {
        fetchReadings();
        const interval = setInterval(fetchReadings, 10000);

        return () => clearInterval(interval);
    }, [params]);

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