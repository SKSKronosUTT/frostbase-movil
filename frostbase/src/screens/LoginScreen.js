import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
//Icons
import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator } from "react-native";
//User
import { useUser } from "../context/UserContext";
import { api } from "../config/api";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login } = useUser();

    const togglePasswordVisibility = () => {
        setHidePassword(!hidePassword);
    };

    const handleLogin = async () => {
        // Validaciones básicas
        if (!email || !password) {
            Alert.alert("Error", "Please enter your email and password");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(api.url + 'User/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                if (data.status === 0) { // Login exitoso
                    // Formatear los datos del usuario para el contexto
                    const userData = {
                        id: data.data.id,
                        email: data.data.email,
                        name: data.data.name.fullName,
                        phone: data.data.phone,
                        isAdmin: data.data.isAdmin,
                        truckData: {
                            id: data.data.truckDefault.id,
                            brand: data.data.truckDefault.brand,
                            model: data.data.truckDefault.model,
                            licensePlate: data.data.truckDefault.licensePlate,
                            state: data.data.truckDefault.state.description
                        }
                    };

                    login(userData);

                    // Navegar a la pantalla principal
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'MainApp' }],
                    });
                } else {
                    Alert.alert("Error", data.error || "Wrong credentials");
                }
            } else {
                Alert.alert("Error", data.error || "Server error");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "Coud not connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.body}>
            {/* Logo FrostBase */}
            <Image 
                style={styles.logo}
                source={require('../assets/images/FROSTBASELOGO.png')}
            />
            <View style={styles.form}>
                <View style={styles.formData}>
                    <Text style={styles.formText}>Email</Text>
                    <TextInput
                        style={styles.formInput}
                        onChangeText={setEmail}
                        value={email}
                        placeholder="frost@base.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text style={styles.formText}>Password</Text>
                    <View style={styles.formPassword}>
                        <TextInput
                            secureTextEntry={hidePassword}
                            style={styles.formInput}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="********"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity 
                            onPress={togglePasswordVisibility} 
                            style={styles.eye}
                        >
                            {hidePassword ? 
                                <Feather name="eye" size={24} color="gray" /> : 
                                <Feather name="eye-off" size={24} color="gray" />}
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity 
                    style={[styles.button, loading && styles.disabledButton]} 
                    onPress={handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.buttonText}>Login</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: '#E2ECF5',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
    },
    logo: {
        marginTop: 100,
        width: '80%',
        height: '20%',
        resizeMode: 'contain',
    },
    form: {
        backgroundColor: '#FFF',
        width: '80%',
        height: 300,
        display: 'flex',
        alignItems: 'center',
        marginTop: 50,
        borderRadius: 16,
    },
    formData: {
        width: '70%',
        marginTop: 20
    },
    formText: {
        marginTop: 10
    },
    formInput: {
        borderWidth: 1,
        height: 50,
        width: '100%',
        borderRadius: 12,
        marginTop: 5,
        paddingLeft: 20,
        color: 'gray',
        borderColor: '#DDD'
    },
    formPassword: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    eye: {
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 5,
        paddingBottom: 5,
        right: 40
    },
    button: {
        backgroundColor: '#000080',
        borderRadius: 50,
        width: '60%',
        height: 40,
        marginTop: "10%",
        alignItems: 'center',
        justifyContent: 'center'
    },
    disabledButton: {
        backgroundColor: '#666699',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16
    }
})

export default LoginScreen;