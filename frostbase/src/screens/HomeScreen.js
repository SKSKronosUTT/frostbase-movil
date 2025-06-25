import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const HomeScreen = () => {

    return (
        <View
            style={{
                display:'flex',
                flexDirection:'row',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Text style={{fontSize: 100}}>Home 🧊</Text>
        </View>
    )
}

export default HomeScreen;