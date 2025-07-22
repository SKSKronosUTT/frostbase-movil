import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useUser } from "../context/UserContext";

const ProfileScreen = ({ navigation }) => {
    const { user, truckData, logout, setTruckData } = useUser();
    const [loading, setLoading] = useState(!truckData);
    const [error, setError] = useState(null);
    const [logo, setLogo] = useState(require('../assets/trucks/scania.png'));

    useEffect(() => {
        const fetchTruckData = async () => {
            if (user?.idTruck && !truckData) {
                try {
                    const response = await fetch(`http://192.168.0.11:5125/api/Truck/${user.idTruck}`);
                    const data = await response.json();
                    setTruckData(data.data);

                    changeLogo(data.data.brand)
                } catch (err) {
                    setError("Error fetching Truck data");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchTruckData();
    }, [user?.idTruck]);

    const changeLogo = (brand) => {
        switch (brand) {
            case 'Volvo':
                setLogo(require('../assets/trucks/volvo.png'));
                break;
            case 'Mercedes':
                setLogo(require('../assets/trucks/mercedes.png'));
                break;
            case 'Scania':
                setLogo(require('../assets/trucks/scania.png'));
                break;
            case 'MAN':
                setLogo(require('../assets/trucks/man.png'));
                break;
            case 'DAF':
                setLogo(require('../assets/trucks/daf.png'));
                break;
            case 'Iveco':
                setLogo(require('../assets/trucks/iveco.png'));
                break;
        
            default:
                break;
        }
    }

    const handleLogout = () => {
        logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>User data not available</Text>
            </View>
        );
    }

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#000080" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.headerArrow}
                    onPress={() => navigation.goBack()}
                >
                    <Feather name="arrow-left" size={24} color="black"/>
                </TouchableOpacity>
                <Text style={styles.headerText}>Profile</Text>
            </View>

            <View style={styles.body}>
                <Image 
                    style={styles.photo}
                    source={require('../assets/images/FROSTYDUDE.png')}
                />
                <Text style={styles.text}>
                    {user.name.firstName} {user.name.lastName} {user.name.middleName ? user.name.middleName : ""}
                </Text>
                <Text style={styles.subtext}>{user.email}</Text>
                                
                {truckData ? (
                    <>
                        <Image 
                            style={styles.brand}
                            source={logo}
                        />
                        <Text style={styles.text}>{truckData.licensePlate}</Text>
                        <Text style={styles.subtext}>{truckData.brand} {truckData.model}</Text>
                    </>
                ) : (
                    <Text style={styles.subtext}>Truck not asigned</Text>
                )}

                {/* Botón para cerrar sesión */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.button} onPress={handleLogout}>
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
        width: 200,
        height: 200,
    },
    brand:{
        marginTop: 50,
        width: 100,
        height: 100,
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