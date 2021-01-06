import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, Image} from 'react-native';
import LinearGradient  from "react-native-linear-gradient";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage'
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import user from '../classes/User';
import Crypto from '../classes/Crypto'
import codes from '../classes/Data'
import {AuthContext} from '../classes/Auth'
//@ts-ignore
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const usersCollection = firestore().collection('usuarios');
const crypto = new Crypto;

export default function LoginScreen({navigation}) {
  const {signIn} = React.useContext(AuthContext);
  const [mail, setMail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [visiblePass, isVisible] = useState(true);
  // state = {
  //   email: "",
  //   password: "",
  //   error: null,
  //   hidePass: true
  // }

 async function login() {
    if (mail == "") {
      setError("Debes escribir tu correo");
    } else if (password == "" || password.length < 6) {
      setError("Sin tu contraseña no puedes entrar")
    }
    else {
      user.mail = mail
      auth().signInWithEmailAndPassword(mail.trim(), password.trim()).then(async(userData) => {
        //@ts-ignore
        user.id = userData.user?.uid
        //@ts-ignore
        await saveLocal("mail", userData.user?.email)
        await usersCollection.doc(user.id).get().then(async(info)=>{
          const data = info.data()
          let name = crypto.Decrypt(data.nombre, codes[13], "B", true, false);
          let username = crypto.Decrypt(data.username, codes[13], "B", true, false);
          let estado = crypto.Decrypt(data.estado, codes[13], "B", true, false);
          user.estado = estado;
          user.name = name;
          user.username = username;
          await saveLocal("id", user.id);
          await saveLocal("name", crypto.Decrypt(name, codes[4], "A", false, false));
          await saveLocal("username", crypto.Decrypt(username, codes[4], "A", false, false));
          await saveLocal("estado", crypto.Decrypt(estado, codes[4], "A", false, false));
          signIn({id: user.id, name: name});
        })
      }).catch(
        error => setError(error.message)
      )
    }
  }

  async function saveLocal(key: string, value: string){
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error)
    }
  }

    return (
      <View style={styles.container}>
        <StatusBar />
        <LinearGradient colors={['#b37feb', '#13c2c2']} style={styles.linearGradient}>
          <Image style={styles.img} source={require("../assets/logow05.png")}/>
          <View style={styles.box_container}>
            <View style={styles.errorMessage}>
              <Text style={styles.error}>{error}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                autoCapitalize="none"
                autoCompleteType="email"
                onChangeText={email => setMail(email)}
                value={mail}
              ></TextInput>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputTitle}>Contraseña</Text>
              <View style={styles.input}>
                <TextInput
                style={{flex:1, color:'#fff'}}
                autoCapitalize="none"
                autoCompleteType="password"
                secureTextEntry={visiblePass}
                onChangeText={password => setPass(password)}
                value={password}
              ></TextInput>
              <Icon onPress={()=>isVisible(!visiblePass)} name="eye" size={16} color="#fff"/>
              </View>
              
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>login()}>
              <Text style={{ color: "#fff", fontSize: 18, marginRight: 10 }}>Listo</Text>
              <Icon name="check" size={20} color="#fff"/>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button_mini}
              //@ts-ignore
              onPress={() => { navigation.navigate("Register") }}>
              <Text style={{ color: "#fff" }}>¿No tienes cuenta?, Registrarme</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button_mini}
              //@ts-ignore
              onPress={() => {navigation.navigate("Register") }}>
              <Text style={{ color: "#fff" }}>Olvidé mi contraseña</Text>
            </TouchableOpacity>
          </View>

        </LinearGradient>


      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',

  },
  box_container: {
    padding: 20,
    width: '90%',
    // height: '100%',
    // backgroundColor: '#ffffffaa',
    // marginTop: '15%',
    borderRadius: 15
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  inputTitle: {
    color: "#eee"
  },
  input: {
    borderBottomColor: "#eee",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: "#eee",
    flexDirection: 'row',
    alignItems:'center'
  },
  inputContainer: {
    marginBottom: 35
  },
  button: {
    // marginHorizontal: 30,
    backgroundColor: '#b37feb',
    borderRadius: 10,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  button_mini: {
    marginTop: 15,
    height: 25,
    marginHorizontal: 30,
    // backgroundColor: '#b37feb',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  errorMessage: {
    marginHorizontal: 30,
    alignItems: 'center'
  },
  error: {
    color: '#f00'
  },
  img:{
    height: '25%',
    width: '100%',
    resizeMode: 'contain',
    marginTop: 30
  }
});
