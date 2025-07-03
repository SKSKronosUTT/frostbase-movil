import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
//Icons
import Feather from '@expo/vector-icons/Feather';

const ProfileScreen = ({ navigation }) => {

    const [name, setName] = useState('John Doe Cuevas')
    const [email, setEmail] = useState('johndoe@gmail.com')
    const [plate, setPlate] = useState('ABC-123-D')
    const [model, setModel] = useState('Volvo BE')


    function logout(){
        //Fuga al login
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerArrow}>
                    <Feather name="arrow-left" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerText}>Profile</Text>
            </View>

            <View style={styles.body}>
                <Image 
                    style={styles.photo}
                    source={require('../assets/images/JackBox.jpg')}
                />
                <Text style={styles.text}>{name}</Text>
                <Text style={styles.subtext}>{email}</Text>
                <Feather name="truck" size={64} color="black" style={styles.truck}/>
                <Text style={styles.text}>{plate}</Text>
                <Text style={styles.subtext}>{model}</Text>

                {/* Botón para cerrar sesión */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>
                            LOG OUT
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E2ECF5',
        flex: 1
    },
    header:{
        display: 'flex',
        flexDirection: 'row',
        marginTop: 50,
    },
    headerArrow:{
        position: 'absolute',
        left: 20,
        zIndex: 1
    },
    headerText:{
        fontWeight: 'light',
        fontSize: 24,
        width: '100%',
        textAlign: 'center'
    },
    body:{
        display: 'flex',
        alignItems: 'center',
        paddingTop: 50,
        flex: 1,
    },
    photo:{
        width: 150,
        height: 150,
        borderRadius: 100
    },
    text:{
        fontWeight: 'bold',
        fontSize: 36,
        paddingTop: 20
    },
    subtext:{
        fontWeight: 'light',
        fontSize: 16,
        marginTop: 10
    },
    truck:{
        marginTop: 100,
    },
    footer:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 50,
        alignItems: 'center'
    },
    button: {
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 100,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 30,
        paddingRight: 30,
    },
    buttonText: {
        color: 'red',
        fontWeight: 'light',
        fontSize: 36
    }
})

export default ProfileScreen;