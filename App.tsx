import 'react-native-gesture-handler';
import React, { useEffect, useState, useReducer, useMemo } from 'react';
import { Alert, Appearance } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthContext } from './classes/Auth'
import {
  menta_light,
  menta_dark,
  violeta_light,
  violeta_dark, 
  rojo_light, 
  rojo_dark, 
  dark, 
  light,
  nature_dark,
  nature_light
} from './classes/Themes'
import user from './classes/User'
import auth from '@react-native-firebase/auth'

import { NavigationContainer, useTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import messaging from '@react-native-firebase/messaging'

import LoginScreen from './screens/LoginScreen'
import ChatScreen from './screens/ChatScreen'
import RegisterScreen from './screens/RegisterScreen'
import MainScreen from './screens/MainScreen'
import SettingsScreen from './screens/SettingsScreen'
import SearchScreen from './screens/SearchScreen'
import LoadingScreen from './screens/LoadingScreen'
import AboutScreen from './screens/AboutScreen'

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
          },
          headerShown: false
        }}
      />
      <ChatStack.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          headerBackImage: (props) => {
            return (<Icon name="chevron-back-outline" size={32} color={props.tintColor} />)
          }
        }}
      />
      <ChatStack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'Acerca de...',
          headerTitleStyle: {
            fontFamily: 'Raleway-Regular'
          },
          headerTitleAlign: 'center',
          headerBackImage: (props) => {
            return (<Icon name="chevron-back-outline" size={32} color={props.tintColor} />)
          }
        }}
      />
    </ChatStack.Navigator>

  )
}

const MainStack = createBottomTabNavigator();
const MainStackScreen = () => {
  const { colors } = useTheme();
  return (
    <MainStack.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: string = '';

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
        inactiveTintColor: colors.text,
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
      <AuthStack.Screen name="Login" component={LoginScreen} options={{
        title: "Bienvenidx a Quorum", headerTitleStyle: {
          fontFamily: 'Raleway-Regular'
        }, headerTitleAlign: 'center'
      }} />
      <AuthStack.Screen name="Register" component={RegisterScreen}
        options={{
          title: "Regístrate",
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontFamily: 'Raleway-Regular'
          },
          headerBackImage: (props) => {
            return (<Icon name="chevron-back-outline" size={32} color={props.tintColor} />)
          }
        }} />
    </AuthStack.Navigator>
  )
}

export default function App() {
  const scheme = Appearance.getColorScheme()
  const [State, setState] = useState(false);
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

  function setTema(tema: string | null) {
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
        case "rojo_light":
          setTheme(rojo_light)
          user.theme = "rojo_light"
          break;
        case "rojo_dark":
          setTheme(rojo_dark)
          user.theme = "rojo_dark"
          break;
        case "dark":
          setTheme(dark);
          user.theme = 'dark'
          break;
        case "light":
          setTheme(light);
          user.theme = 'light'
          break;
        case 'nature_dark':
          setTheme(nature_dark)
          user.theme = 'nature_dark'
          break;
        case 'nature_light':
          setTheme(nature_light)
          user.theme = 'nature_light'
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
  }

  useEffect(() => {
    async function getTheme() {
      let tema = await AsyncStorage.getItem('tema')
      setTema(tema)
    }
    getTheme()
  }, [user.theme])

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      await auth().onAuthStateChanged(user_ => {
        if (user_) {
          user.id = user_.uid
          user.mail = user_.email
          user.username = user_.displayName
          userToken = user_.uid
          console.log(user_)
        }
      })
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      if (!State) {
        RNBootSplash.hide();
        setState(true)
      }
    };

    // bootstrapAsync();
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    bootstrapAsync();
  }, []);

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
      setTheme: (theme: string | null) => setTema(theme)
    }),
    []);

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer theme={theme}>
        {state.isLoading ? (<LoadingScreen />)
          : state.userToken == null ? (<AuthStackScreen />)
            : (<ChatStackScreen />)
        }
      </NavigationContainer>
    </AuthContext.Provider>
  )
};