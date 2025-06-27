import React from "react";
import { View, Image, StyleSheet } from "react-native";

const SplashScreen = () => {

    return (
        <View style={styles.body}>
            {/* Logo FrostyDude */}
            <Image 
                style={styles.logo}
                source={require('../assets/images/FROSTYDUDEBLANCO.png')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#000080',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        marginTop: 50,
        height: 250,
        width: 250
    }
})

export default SplashScreen;