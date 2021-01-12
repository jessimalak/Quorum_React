import 'react-native-gesture-handler';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, StatusBar, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
//@ts-ignore
import Icon from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import user from '../classes/User'
import sharedStyles from '../classes/Styles'
import { useTheme } from '@react-navigation/native'
import { AuthContext } from '../classes/Auth'
import ModalView, { Button } from '../components/Modal'
import QRCode from 'react-native-qrcode-svg'
import Crypto from '../classes/Crypto'
import code from '../classes/Data'

//@ts-ignore
export default function SettingsScreen({navigation}) {
    //@ts-ignore
    const { signOut } = React.useContext(AuthContext);
    async function signout() {
        await AsyncStorage.clear();
        signOut();
    }

    const { colors } = useTheme();
    const cardColor = colors.background + "dd"
    const [isEnabled, SetEnabled] = useState(user.systemTheme);
    const [visibleQR, SetVisible] = useState(false);
    const [qrvalue, SetqrValue] = useState("none");
    const SetSystemTheme = () => {
        if (user.systemTheme) {
            user.systemTheme = false;
            SetEnabled(false);
            SetTheme('menta_light');
        } else {
            user.systemTheme = true;
            SetEnabled(true)
            SetTheme('system');
        }
    }

    async function SetTheme(tema: string) {
        if (tema == "system") {
            AsyncStorage.removeItem("tema")
        } else {
            if (!user.systemTheme) await AsyncStorage.setItem('tema', tema);
        }
    }

    const crypt = new Crypto;

    function createQR() {
        if (qrvalue == "none") {
            let name = crypt.Encrypt(user.username, code[5], "A", false, false)
            let id_ = crypt.Encrypt(crypt.Reverse(user.id), code[5], "A", true, false)
            let type = crypt.Encrypt("usuario", code[5], "A", false, true)
            SetqrValue("QUORUM µ" + type + "µ" + id_ + "µ" + name)
        }
        SetVisible(true)
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle={colors.text == '#000000' ? 'dark-content' : 'light-content'} />
            <LinearGradient colors={[colors.card, colors.notification]}
                start={{ x: 0.1, y: 0.1 }}
                style={sharedStyles.linearGradient}>
                <View style={[sharedStyles.card, { backgroundColor: cardColor }]}>
                    <View style={{ flexDirection: "row" }}>
                        <Image source={require('../assets/useravatar.png')} style={styles.imgage} />
                        <View style={styles.dataContainer}>
                            <Text style={{ color: colors.border }}>{user.username}</Text>
                            <Text style={{ color: colors.border }}>{user.mail}</Text>
                            <Text style={{ color: colors.border }}>{user.estado}</Text>
                            <View style={{ flexDirection: "row" }}>
                                <Button isCancel={true} icon={true} name="qr-code-outline" size={32} onPress={() => { createQR() }} />
                            </View>
                        </View>
                    </View>
                </View>
                <View style={[sharedStyles.card, { backgroundColor: cardColor }]}>
                    <Text style={{ fontFamily: "Raleway-Regular", fontSize: 18, marginBottom: 5, color: colors.border}}>Temas</Text>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ flex: 1, fontFamily: 'Roboto-Regular', color: colors.border }}>Predeterminado del sistema</Text>
                        <Switch value={isEnabled} thumbColor={isEnabled ? colors.card : colors.primary} onValueChange={SetSystemTheme} />
                    </View>
                    <Text style={{ fontSize: 18, fontFamily: "Roboto-Light", marginLeft: 5, color: colors.border  }}>Claros</Text>
                    <View style={[styles.themeContainer, { opacity: isEnabled ? 0.5 : 1, borderColor: colors.border }]}>
                        <TouchableOpacity onPress={() => { SetTheme("menta_light") }}>
                            <View style={{ backgroundColor: "#b37feb", borderColor: "#13c2c2", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme('violeta_light') }}>
                            <View style={{ backgroundColor: "#7159f7", borderColor: "#b859f7", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme("azul_light") }}>
                            <View style={{ backgroundColor: "#40a9ff", borderColor: "#36cfc9", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme("rojo_light") }}>
                            <View style={{ backgroundColor: "#ff7875", borderColor: "#ff4d4f", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme("light") }}>
                            <View style={{ backgroundColor: "#fff", borderColor: "#d8d8d8", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 18, fontFamily: "Roboto-Light", marginLeft: 5, color: colors.border}}>Oscuros</Text>
                    <View style={[styles.themeContainer, { opacity: isEnabled ? 0.5 : 1, borderColor: colors.border }]}>
                        <TouchableOpacity onPress={() => { SetTheme("menta_dark") }}>
                            <View style={{ backgroundColor: "#9e1068", borderColor: "#006d75", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme('violeta_dark') }}>
                            <View style={{ backgroundColor: "#51258f", borderColor: "#75204f", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme("azul_dark") }}>
                            <View style={{ backgroundColor: "#164c7e", borderColor: "#137485", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme("rojo_dark") }}>
                            <View style={{ backgroundColor: "#a8071a", borderColor: "#791a1f", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { SetTheme("dark") }}>
                            <View style={{ backgroundColor: "#161616", borderColor: "#4d4b4b", borderWidth: 3, height: 30, width: 30, borderRadius: 15 }}></View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={[sharedStyles.card, {backgroundColor: cardColor, flexDirection: 'column'}]}>
                    <TouchableOpacity onPress={()=>{navigation.navigate("About")}} style={[styles.listItem, {borderBottomColor: colors.border+"33", borderBottomWidth: 1}]} >
                        <Icon name="information" size={32} color={colors.border}/>
                        <Text style={{ fontSize: 16, fontFamily: "Roboto-Light", marginLeft: 5, color: colors.border}}>Acerca de</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{signout()}} style={styles.listItem} >
                        <Icon name="log-out-outline" size={32} color={colors.border}/>
                        <Text style={{ fontSize: 16, fontFamily: "Roboto-Light", marginLeft: 5, color: colors.border}}>Cerrar sesión</Text>
                    </TouchableOpacity>
                </View>
                <ModalView title="Tu QR" visible={visibleQR}>
                    {qrvalue != "none"
                        ? <QRCode value={qrvalue} size={250} />
                        : <ActivityIndicator style={{ height: 250 }} size='large' color={colors.card} />}
                    <View style={{ width: '100%', marginTop: 15, height: 18 }}>
                        <Button style={{ padding: 15, height: 23 }} size={18} isCancel={false} icon={false} onPress={() => { SetVisible(false) }} texto="Listo" />
                    </View>
                </ModalView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imgage: {
        height: 120,
        width: 120
    },
    dataContainer: {
        justifyContent: "space-around",
        flex: 1
    },
    themeContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 5,
        borderRadius: 5,
        borderWidth: 1,
        paddingVertical: 5
    },
    listItem:{
        paddingVertical: 5,
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center'
    }
});
