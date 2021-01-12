import React,{useState} from 'react';
import { StyleSheet, Text, View, StatusBar, Image, KeyboardAvoidingView } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useTheme } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import user from '../classes/User'
import codes from '../classes/Data'
import Crypto from '../classes/Crypto'
import {AuthContext} from '../classes/Auth'
//@ts-ignore
import Icon from 'react-native-vector-icons/Ionicons'

const crypto = new Crypto;

const usersColl = firestore().collection('usuarios');
//@ts-ignore
export default function RegisterScreen({navigation}) {
    //@ts-ignore
    const {signUp} = React.useContext(AuthContext);
    const [mail, setMail] = useState("");
    const [name, setName] = useState("");
    const [username, setUserName] = useState("");
    const [password1, setPass1] = useState("");
    const [password2, setPass2] = useState("");
    const [error, setError] = useState("");
    const [visiblePass, isVisible] = useState(true);
    const [icon, setIcon] = useState('eye-outline')
    const {colors} = useTheme()
    // state = {
    //     username:"",
    //     name:"",
    //     email: "",
    //     password1: "",
    //     password2: "",
    //     error: null
    // }

    async function register () {
        user.estado = "Hola, soy nuev@ en Quorum"
        user.username = username;
        user.name = name
        user.mail = mail
        await saveLocal("mail", mail);
        await saveLocal("name", name);
        await saveLocal("username", username);
        await saveLocal("estado", 'Hola, soy nuev@ en Quorum');
        const username_ = crypto.Encrypt(username, codes[4], "A", false, false)
        const name_ = crypto.Encrypt(name, codes[4], "A", false, false)
        const email_ = crypto.Encrypt(mail, codes[4], "A", false, false)
        auth().createUserWithEmailAndPassword(mail.trim(), password1.trim()).then(async(userdata)=>{
            //@ts-ignore
            user.id = userdata.user?.uid
            userdata.user?.updateProfile({
                displayName: username
            })
            await saveLocal("id", user.id)
            await usersColl.doc(user.id).set({
                username: crypto.Encrypt(username_, codes[13], "B", true, false),
                mail: crypto.Encrypt(email_, codes[13], "B", true, false),
                nombre: crypto.Encrypt(name_, codes[13], "B", true, false),
                estado: "Hola, soy nuev@ en Quorum",
                verified: false
            }).then(()=>{
                signUp({username: username, toke: user.id})
            }).catch(error => setError(error.message))
            
        }).catch(
            error => setError(error.message)
        )
    }

    async function saveLocal(key: string, value: string) {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.log(error)
        }
    }

        return (
            <View style={styles.container}>
                <StatusBar />
                <LinearGradient colors={[colors.card, colors.notification]} start={{x:0.1, y:0.1}} style={styles.linearGradient}>
                    <KeyboardAvoidingView behavior='position' style={styles.box_container}>
                        <Image style={styles.img} source={require('../assets/namew05.png')}/>
                        <View style={styles.errorMessage}>
                            <Text style={styles.error}>{error}</Text>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputTitle}>Nombre de usuario</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                onChangeText={username => setUserName(username)}
                                value={username}
                            ></TextInput>
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputTitle}>Tu nombre</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize='words'
                                autoCompleteType="name"
                                onChangeText={name => setName(name)}
                                value={name}
                            ></TextInput>
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
                                style={{flex: 1, color: "#fff"}}
                                autoCapitalize="none"
                                autoCompleteType="password"
                                secureTextEntry={visiblePass}
                                onChangeText={password1 => setPass1(password1)}
                                value={password1}
                            />
                            <Icon onPress={()=>{isVisible(!visiblePass); icon == 'eye-outline' ? setIcon('eye-off-outline') : setIcon('eye-outline')}} name={icon} size={24} color="#fff"/>
                            </View>
                            
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputTitle}>Repite tu contraseña</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize="none"
                                secureTextEntry
                                onChangeText={password2 =>setPass2(password2 )}
                                value={password2}
                            ></TextInput>
                        </View>
                        <TouchableOpacity style={[styles.button, {backgroundColor: colors.card}]} onPress={()=>register()}>
                            <Text style={{ color: "#fff", fontSize: 18, marginRight:10 }}>Listo</Text>
                            <View style={{position: 'absolute', right: 15}}>
                                <Icon name="log-in-outline" size={32} color="#fff"/>
                            </View>
                            
                        </TouchableOpacity>
                    </KeyboardAvoidingView>

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
        padding: 10,
        width: '90%',
        // height: '100%',
        // backgroundColor: '#ffffff33'
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
        position: 'relative',
        borderRadius: 10,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    errorMessage: {
        marginHorizontal: 30,
        alignItems: 'center'
    },
    error: {
        color: '#f00'
    },
    img:{
        height: '10%',
        width: '100%',
        resizeMode: 'contain',
        marginTop: 10,
        marginBottom: 15
    }
});
