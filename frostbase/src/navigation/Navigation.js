import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

//Icons
import Feather from '@expo/vector-icons/Feather';

//Screens
import HomeScreen from "../screens/HomeScreen";

const Tab = createBottomTabNavigator();

function MyTabs() {
    return(
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray'
            }}
        >
            <Tab.Screen name="Home" component={HomeScreen} 
                options={{
                    //headerShown: false
                    tabBarIcon: (color) => {
                        return <Feather name="home" color={color} size={20} />
                    }
                }}
            />
            <Tab.Screen name="Map" component={HomeScreen} 
                options={{
                    //headerShown: false
                    tabBarIcon: (color) => {
                        return <Feather name="map" color={color} size={20} />
                    }
                }}
            />
            <Tab.Screen name="Analytics" component={HomeScreen} 
                options={{
                    //headerShown: false
                    tabBarIcon: (color) => {
                        return <Feather name="bar-chart-2" color={color} size={20} />
                    }
                }}
            />
            <Tab.Screen name="History" component={HomeScreen} 
                options={{
                    //headerShown: false
                    tabBarIcon: (color) => {
                        return <Feather name="clock" color={color} size={20} />
                    }
                }}
            />
            <Tab.Screen name="Profile" component={HomeScreen} 
                options={{
                    //headerShown: false
                    tabBarIcon: (color) => {
                        return <Feather name="user" color={color} size={20} />
                    }
                }}
            />

        </Tab.Navigator>
    );
}

export default function Navigation() {
    return(
        <NavigationContainer>
            <MyTabs />
        </NavigationContainer>
    )
}