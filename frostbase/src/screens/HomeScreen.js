import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

//import Header
import Header from "../components/Header";

const HomeScreen = () => {

    const [onTrip, setOnTrip] = useState(false);

    function handleTrip(){
        setOnTrip(!onTrip);
    }

    return (
        <View>
            {/* Aqui se despliegan los métricos */}
            <Header />

            <View style={styles.body}>
                {/* Botón para iniciar el viaje */}
                <TouchableOpacity style={styles.button} onPress={handleTrip}>
                    <Text style={styles.buttonText}>
                        {onTrip ? "END TRIP" : "START TRIP"}
                    </Text>
                </TouchableOpacity>

                {/* Logo FrostyDude dinámico cuando no está en viaje */}
                {!onTrip && (
                    <Image 
                        style={styles.logo}
                        source={require('../assets/images/FROSTYDUDE.png')}
                    />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body:{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#E2ECF5',
        height: "100%"
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