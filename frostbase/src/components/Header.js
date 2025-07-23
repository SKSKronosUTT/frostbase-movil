import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => {
    const [humidity, setHumidity] = useState();
    const [temperature, setTemperature] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const idTruck = "674a4001000000000000001a";

    const fetchData = async () => {
        try {
            //Cambiar por un Endpoint que solo regrese la ultima lectura del IDTruck especificado
            //La IP cambia cuando esté en la web
            const response = await fetch('http://192.168.0.11:5125/api/Reading');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Filtrar lecturas
            const truckReadings = data.data
                .filter(reading => reading.idTruck === idTruck)
                .sort((a, b) => new Date(b.date) - new Date(a.date));
            
            if (truckReadings.length > 0) {
                const latestReading = truckReadings[0];
                setHumidity(latestReading.percHumidity);
                setTemperature(latestReading.temperature);
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
    

    {/* Código para recabar las medidas */}
    useEffect(() => {
        fetchData();
        
        const interval = setInterval(() => {
            fetchData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return(
        <View style={styles.header}>
            <Text style={styles.headerText}>Humidity</Text>
            <Text style={styles.headerValue}>{humidity}%</Text>
            <Text style={styles.headerText}>Temperature</Text>
            <Text style={styles.headerValue}>{temperature}° C</Text>
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
        fontWeight: 300
    },
    headerValue: {
        color: 'white',
        fontSize: 48,
        marginLeft: 20,
    }
})

export default Header;