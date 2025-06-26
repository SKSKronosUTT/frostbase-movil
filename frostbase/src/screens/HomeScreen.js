import React, {useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const HomeScreen = () => {

    {/* Estas variables sirven para modificar los valores dinámicamente después con la API */}
    const [humedity, setHumedity] = useState('75');
    const [temperature, setTemperature] = useState('5');

    return (
        <View>
            {/* Aqui se despliegan los métricos */}
            <View style={styles.header}>
                <Text style={styles.headerText}>Humedity</Text>
                <Text style={styles.headerValue}>{humedity}%</Text>
                <Text style={styles.headerText}>Temperature</Text>
                <Text style={styles.headerValue}>{temperature}° C</Text>
            </View>

            <View style={styles.body}>
                {/* Botón para iniciar el viaje */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>START TRIP</Text>
                </TouchableOpacity>

                {/* Logo FrostyDude */}
                <Image 
                    style={styles.logo}
                    source={require('../assets/images/FROSTYDUDE.png')}
                />
            </View>
            

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        height: 250,
        paddingLeft: 30,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: '#88C6E7',
    },
    headerText: {
        color: 'white',
        fontSize: 36
    },
    headerValue: {
        color: 'white',
        fontSize: 48,
        marginLeft: 20
    },
    body:{
        display: 'flex',
        alignItems: 'center'
    },
    button: {
        marginTop: 50,
        borderColor: '#21BEBA',
        borderWidth: 1,
        borderRadius: 100,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },
    buttonText: {
        color: '#21BEBA',
        fontWeight: 'bold',
        fontSize: 36
    },
    logo: {
        marginTop: 50,
        height: 300,
        width: 300
    }
    

})

export default HomeScreen;