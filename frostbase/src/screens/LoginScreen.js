import React, { useState } from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput, Alert } from "react-native";
//Icons
import Feather from '@expo/vector-icons/Feather';
import { ActivityIndicator } from "react-native";
//User
import { useUser } from "../context/UserContext";

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login, setTruckData } = useUser();

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
            const response = await fetch('http://192.168.0.11:5125/api/User');
            const data = await response.json();
            
            const user = data.data.find(u => 
                u.email.toLowerCase() === email.toLowerCase() && 
                u.password === password
            );

            if (user) {
                login(user);
                //Fetch Truck data
                try {
                    const r = await fetch(`http://192.168.0.11:5125/api/Truck/${user.idTruck}`);
                    const d = await r.json();
                    setTruckData(d.data);
                } catch (err) {
                    setError("Error fetching Truck data");
                }
                //Go to MainApp
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainApp' }],
                });
            } else {
                Alert.alert("Error", "Wrong Credentials");
            }
        } catch (error) {
            console.error("Login error:", error);
            Alert.alert("Error", "Can not access to the server");
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