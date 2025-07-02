import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

//Icons
import Feather from '@expo/vector-icons/Feather';

//Screens
import HomeScreen from "../screens/HomeScreen";
import HistoryScreen from "../screens/HistoryScreen";

const Tab = createBottomTabNavigator();

function MyTabs() {
    return(
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                tabBarIcon: ({color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'Map') {
                        iconName = 'map';
                    } else if (route.name === 'Analytics') {
                        iconName = 'bar-chart-2';
                    } else if (route.name === 'History') {
                        iconName = 'clock';
                    } else if (route.name === 'Profile') {
                        iconName = 'user';
                    }

                    return <Feather name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                headerShown: false
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Map" component={HomeScreen} />
            <Tab.Screen name="Analytics" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Profile" component={HomeScreen} />
        </Tab.Navigator>
    );
}

export default function Navigation() {
    return(
        <MyTabs />
    )
}