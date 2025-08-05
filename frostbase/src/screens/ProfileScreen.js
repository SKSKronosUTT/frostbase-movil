import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Modal, FlatList, Alert, RefreshControl } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useUser } from "../context/UserContext";
import { api } from "../config/api";

const ProfileScreen = ({ navigation }) => {
    const { user, logout, login } = useUser();
    const [logo, setLogo] = useState(require('../assets/trucks/mercedes.png'));
    const [allTrucks, setAllTrucks] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTruck, setSelectedTruck] = useState(null);

    useEffect(() => {
        changeLogo(user.truckData?.brand);
    }, [user.truckData]);

    const fetchTrucksAndUsers = async () => {
        try {
            setRefreshing(true);
            const [trucksResponse, usersResponse] = await Promise.all([
                fetch(`${api.url}Truck`),
                fetch(`${api.url}User`)
            ]);

            if (!trucksResponse.ok || !usersResponse.ok) {
                throw new Error('Error fetching data');
            }

            const trucksData = await trucksResponse.json();
            const usersData = await usersResponse.json();

            if (trucksData.status === 0 && usersData.status === 0) {
                setAllTrucks(trucksData.data);
                setAllUsers(usersData.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            Alert.alert("Error", "Could not load data");
        } finally {
            setRefreshing(false);
            setLoading(false);
        }
    };

    const getAvailableTrucks = () => {
        const assignedTruckIds = allUsers
            .filter(u => u.truckDefault)
            .map(u => u.truckDefault.id);

        return allTrucks.filter(truck => 
            truck.state.id === 'AV' && 
            !assignedTruckIds.includes(truck.id)
        );
    };

    const openTruckSelectionModal = async () => {
        setLoading(true);
        setModalVisible(true);
        await fetchTrucksAndUsers();
    };

    const changeLogo = (brand) => {
        const logos = {
            'Volvo': require('../assets/trucks/volvo.png'),
            'Mercedes': require('../assets/trucks/mercedes.png'),
            'Scania': require('../assets/trucks/scania.png'),
            'Freightliner': require('../assets/trucks/freightliner.png'),
            'International': require('../assets/trucks/international.png'),
            'Kenworth': require('../assets/trucks/kenworth.png'),
            'Mack': require('../assets/trucks/mack.png'),
            'Peterbilt': require('../assets/trucks/peterbilt.png')
        };
        setLogo(logos[brand] || require('../assets/trucks/mercedes.png'));
    };

    const handleTruckChange = async () => {
        if (!selectedTruck) return;
        
        try {
            const currentUserData = allUsers.find(u => u.id === user.id);
            if (!currentUserData) throw new Error('User data not found');

            const updatedUser = {
                id: user.id,
                name: {
                    firstName: currentUserData.name.firstName,
                    lastName: currentUserData.name.lastName,
                    middleName: currentUserData.name.middleName
                },
                email: user.email,
                phone: user.phone,
                birthDate: user.birthDate,
                idTruckDefault: selectedTruck.id,
                active: true
            };

            const response = await fetch(`${api.url}User`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) throw new Error('Error updating truck');

            const data = await response.json();
            if (data.status === 0) {
                login({
                    ...user,
                    name: currentUserData.name.fullName,
                    truckData: {
                        id: selectedTruck.id,
                        brand: selectedTruck.brand,
                        model: selectedTruck.model,
                        licensePlate: selectedTruck.licensePlate,
                        state: selectedTruck.state
                    }
                });
                setModalVisible(false);
                Alert.alert("Success", "Truck updated successfully");
            }
        } catch (error) {
            console.error("Error updating truck:", error);
            Alert.alert("Error", error.message || "Failed to update truck");
        }
    };

    const handleLogout = () => {
        logout();
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    const renderTruckItem = ({ item }) => (
        <TouchableOpacity 
            style={[
                styles.truckItem,
                selectedTruck?.id === item.id && styles.selectedTruckItem
            ]}
            onPress={() => setSelectedTruck(item)}
        >
            <Text style={styles.truckText}>
                {item.brand} {item.model} - {item.licensePlate}
            </Text>
            <Text style={styles.truckStatus}>{item.state.description}</Text>
        </TouchableOpacity>
    );

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
                    {user.name}
                </Text>
                <Text style={styles.subtext}>{user.email}</Text>
                                
                {user.truckData ? (
                    <>
                        <Image 
                            style={styles.brand}
                            source={logo}
                        />
                        <Text style={styles.text}>{user.truckData.licensePlate}</Text>
                        <Text style={styles.subtext}>{user.truckData.brand} {user.truckData.model}</Text>
                        
                        <TouchableOpacity 
                            style={styles.changeTruckButton}
                            onPress={openTruckSelectionModal}
                        >
                            <Text style={styles.changeTruckButtonText}>Change Truck</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <Text style={styles.subtext}>Truck not assigned</Text>
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

            {/* Modal para seleccionar camión */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select a Truck</Text>
                        
                        {loading ? (
                            <ActivityIndicator size="large" color="#0277BD" />
                        ) : (
                            <>
                                <FlatList
                                    data={getAvailableTrucks()}
                                    renderItem={renderTruckItem}
                                    keyExtractor={item => item.id}
                                    style={styles.truckList}
                                    ListEmptyComponent={
                                        <Text style={styles.emptyText}>No available trucks</Text>
                                    }
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={refreshing}
                                            onRefresh={fetchTrucksAndUsers}
                                            colors={['#0277BD']}
                                        />
                                    }
                                />
                                
                                <View style={styles.modalButtons}>
                                    <TouchableOpacity 
                                        style={styles.modalButtonCancel}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity 
                                        style={[
                                            styles.modalButtonConfirm,
                                            !selectedTruck && styles.disabledButton
                                        ]}
                                        onPress={handleTruckChange}
                                        disabled={!selectedTruck}
                                    >
                                        <Text style={styles.modalButtonText}>Confirm</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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
    },
    brand:{
        marginTop: 10,
        width: 150,
        height: 150,
        resizeMode: 'contain'
    },
    text:{
        fontWeight: 'bold',
        fontSize: 36,
        paddingTop: 20,
        color: '#333'
    },
    subtext:{
        fontWeight: 'light',
        fontSize: 16,
        marginTop: 10,
        color: '#777'
    },
    footer:{
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 50,
        alignItems: 'center'
    },
    button: {
        marginTop: 30,
        marginBottom: 20,
        borderColor: '#F44336',
        borderWidth: 1,
        borderRadius: 100,
        paddingVertical: 10,
        paddingHorizontal: 30,
        backgroundColor: '#FEFEFE',
    },
    buttonText: {
        color: '#F44336',
        fontWeight: 'bold',
        fontSize: 24
    },
    changeTruckButton: {
        marginTop: 20,
        backgroundColor: '#0277BD',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20
    },
    changeTruckButtonText: {
        color: 'white',
        fontWeight: 'bold'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '70%'
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
    },
    truckList: {
        marginBottom: 15
    },
    truckItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    selectedTruckItem: {
        backgroundColor: '#E2ECF5'
    },
    truckText: {
        fontSize: 16
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    modalButtonCancel: {
        backgroundColor: '#F44336',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5
    },
    modalButtonConfirm: {
        backgroundColor: '#0277BD',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5
    },
    disabledButton: {
        backgroundColor: '#ccc'
    },
    modalButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    availableText: {
        fontSize: 16,
        color: '#0277BD',
        marginBottom: 10,
        fontWeight: 'bold'
    },
    truckStatus: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#666'
    }
})

export default ProfileScreen;