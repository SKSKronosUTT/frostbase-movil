import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

const Header = () => {
    {/* Estas variables sirven para modificar los valores dinámicamente después con la API */}
    const [humedity, setHumedity] = useState('75');
    const [temperature, setTemperature] = useState('5');

    return(
        <View style={styles.header}>
            <Text style={styles.headerText}>Humedity</Text>
            <Text style={styles.headerValue}>{humedity}%</Text>
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