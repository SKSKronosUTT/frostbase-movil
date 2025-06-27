import React, {useState} from "react";
import { View, Image, StyleSheet, Text, TouchableOpacity, TextInput } from "react-native";
//Icons
import Feather from '@expo/vector-icons/Feather';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [hidePassword, setHidePassword] = useState(true);

    const togglePasswordVisibility = () => {
    setHidePassword(!hidePassword);
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
                        placeholder="abc@gmail.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    <Text styles={styles.formText}>Password</Text>
                    <View style={styles.formPassword}>
                        <TextInput
                            secureTextEntry={hidePassword}
                            style={styles.formInput}
                            onChangeText={setPassword}
                            value={password}
                            placeholder="********"
                            autoCapitalize="none"
                        />
                        <TouchableOpacity onPress={togglePasswordVisibility} style={styles.eye}>
                            {hidePassword ? <Feather name="eye" size={24} color="gray" /> : <Feather name="eye-off" size={24} color="gray" />}
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Login</Text>
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
    formText:{
        marginTop: 10
    },
    formInput:{
        borderWidth: 1,
        height: 50,
        width: '100%',
        borderRadius: 12,
        marginTop: 5,
        paddingLeft: 20,
        color: 'gray'
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
    buttonText:{
        color: '#FFF',
        fontSize: 16
    }
})

export default LoginScreen;