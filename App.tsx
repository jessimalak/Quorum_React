import 'react-native-gesture-handler';
import React, { useEffect, useState, useReducer, useMemo } from 'react';
//@ts-ignore
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from './classes/Auth'
import { menta_light, menta_dark, violeta_light, violeta_dark } from './classes/Themes'
import user from './classes/User'

import { AppearanceProvider, useColorScheme } from 'react-native-appearance';
import { NavigationContainer, useTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'
import RegisterScreen from './screens/RegisterScreen'
import MainScreen from './screens/MainScreen'
import SettingsScreen from './screens/SettingsScreen'
import SearchScreen from './screens/SearchScreen'
import LoadingScreen from './screens/LoadingScreen'

import RNBootSplash from "react-native-bootsplash";

const ChatStack = createStackNavigator();
const ChatStackScreen = () => {
  return (

    <ChatStack.Navigator>
      <ChatStack.Screen
        name="Chats"
        component={MainStackScreen}
        options={{
          title: 'QUORUM',
          headerTitleStyle: {
            fontFamily: 'Raleway-Regular',
            fontSize: 23,
            color: "#fff"
          }
        }}
      />
      <ChatStack.Screen name="Chat" component={ChatScreen} />
    </ChatStack.Navigator>

  )
}

const MainStack = createBottomTabNavigator();
const MainStackScreen = () => {
  const { colors } = useTheme();
  return (
    <MainStack.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Buscar') {
          iconName = focused
            ? 'search'
            : 'search-outline';
        } else if (route.name === 'Chats') {
          iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
        } else if (route.name === 'Perfil') {
          iconName = focused ? 'person' : 'person-outline';
        }
        // You can return any component that you like here!
        return <Icon name={iconName} size={size} color={color} />;
      },
    })}
      tabBarOptions={{
        activeTintColor: colors.primary,
        inactiveTintColor: "#fff",
        showLabel: false
      }}>
      <MainStack.Screen name="Chats" component={MainScreen} />
      <MainStack.Screen name="Buscar" component={SearchScreen} />
      <MainStack.Screen options={{
        title: "Buscar"
      }} name="Perfil" component={SettingsScreen} />
    </MainStack.Navigator>
  )
}

const AuthStack = createStackNavigator();
const AuthStackScreen = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: "Bienvenidx a Quorum" }} />
      <AuthStack.Screen name="Register" component={RegisterScreen} options={{ title: "Regístrate" }} />
    </AuthStack.Navigator>
  )
}

export default function App() {
  const scheme = useColorScheme();
  const { colors } = useTheme();
  const [State, setState] = useState(false);
  const [usuario, setUser] = useState();
  const [theme, setTheme] = useState(menta_light)
  const [state, dispatch] = useReducer(
    //@ts-ignore
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    }
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      let tema;
      try {
        userToken = await AsyncStorage.getItem('id');
        tema = await AsyncStorage.getItem('tema')
        if (userToken != null) user.id = userToken;
        if (tema != null) {
          user.systemTheme = false;
          switch (tema) {
            case "violeta_light":
              setTheme(violeta_light)
              user.theme = "violeta_light"
              break;
            case "violeta_dark":
              setTheme(violeta_dark)
              user.theme = "violeta_dark"
              break;
            case "menta_light":
              setTheme(menta_light)
              user.theme = "menta_light"
              break;
              case "menta_dark":
              setTheme(menta_dark)
              user.theme = "menta_dark"
              break;
          }
        } else {
          user.systemTheme = true
          if (scheme == 'dark') {
            setTheme(menta_dark)
            user.theme = "menta_dark"
          } else {
            setTheme(menta_light)
            user.theme = "menta_dark"
          }
        }
      } catch (e) {
        // Restoring token failed
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      if (!State) {
        RNBootSplash.hide();
        setState(true)
      }
    };

    bootstrapAsync();
  });

  const authContext = useMemo(
    () => ({
      //@ts-ignore
      signIn: async data => {
        dispatch({ type: 'SIGN_IN', token: data.id });
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      //@ts-ignore
      signUp: async data => {
        dispatch({ type: 'SIGN_IN', token: data.token });
      },
    }),
    []
  );

  return (
    <AppearanceProvider>
      <AuthContext.Provider value={authContext}>
        <NavigationContainer theme={theme}>
          {state.isLoading ? (<LoadingScreen />)
            : state.userToken == null ? (<AuthStackScreen />)
              : (<ChatStackScreen />)
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </AppearanceProvider>

  )
};