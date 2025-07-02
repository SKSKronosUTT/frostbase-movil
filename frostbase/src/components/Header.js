import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => {
    const [humidity, setHumidity] = useState(75);
    const [temperature, setTemperature] = useState(5.0);

    {/* Código para simular los valores cada 2 segundos */}
    useEffect(() => {
        const interval = setInterval(() => {
            const humidityVariation = (Math.random() * 4 - 2).toFixed(0);
            const tempVariation = (Math.random().toFixed(1) * 1 - 0.5).toFixed(1);
            
            setHumidity(humidity + parseInt(humidityVariation));
            setTemperature(parseFloat(temperature) + parseFloat(tempVariation));

        }, 2000);

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
        backgroundColor: '#89B6DD',
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