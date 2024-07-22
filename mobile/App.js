import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Ionicons";

// Context && Reduxt-Toolkit
import { useContext } from "react";
import { AuthContext, AuthContextProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import store from "./store/store";

// Screens
import HomeScreen from "./screens/HomeScreen";
import Profile from "./screens/Profile";
import Login from "./screens/Login";
import Register from "./screens/Register";
import SuggestedUsers from "./screens/SuggestedUsers";
import Notifications from "./screens/Notifications";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SuggestedUsers"
        component={SuggestedUsers}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const MainTabs = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Login") {
            iconName = focused ? "log-in" : "log-in-outline";
          } else if (route.name === "Register") {
            iconName = focused ? "person-add" : "person-add-outline";
          } else if (route.name === "SuggestedUsers") {
            iconName = focused ? "people" : "people-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarShowLabel: false,
      })}
      tabBarOptions={{
        activeTintColor: "#3498DB",
        inactiveTintColor: "gray",
      }}
    >
      {authUser ? (
        <>
          <Tab.Screen
            name="Home"
            component={HomeStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="SuggestedUsers"
            component={SuggestedUsers}
            options={{ headerShown: false }}
          />

          <Tab.Screen
            name="Notifications"
            component={Notifications}
            options={{
              headerShown: false,
              tabBarIcon: ({ color, size }) => (
                <Icon name="notifications" size={size} color={color} />
              ),
            }}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Login"
            component={AuthStack}
            options={{ headerShown: false }}
          />
          <Tab.Screen
            name="Register"
            component={AuthStack}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthContextProvider>
          <Provider store={store}>
            <MainTabs />
          </Provider>
        </AuthContextProvider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
