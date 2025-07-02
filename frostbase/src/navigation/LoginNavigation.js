import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import Navigation from './Navigation';

const LoginStackNavigation = createNativeStackNavigator();

function LoginNavigation(){
    return (
        <NavigationContainer>
            <LoginStackNavigation.Navigator
                initialRouteName='Login'
            >
                <LoginStackNavigation.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{
                        headerShown: false
                    }}
                />
                <LoginStackNavigation.Screen
                    name="Navigation"
                    component={Navigation}
                    options={{
                        headerShown: false
                    }}
                />
            </LoginStackNavigation.Navigator>
        </NavigationContainer>
    )
}

export default LoginNavigation;