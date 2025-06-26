import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

//import Header
import Header from "../components/Header";

const HomeScreen = () => {

    return (
        <View>
            {/* Aqui se despliegan los métricos */}
            <Header />

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