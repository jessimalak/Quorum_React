import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, PermissionsAndroid, Platform } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
// import firebase from '../classes/Firebase'
import sharedStyles from '../classes/Styles';
//@ts-ignore
import Icon from 'react-native-vector-icons/AntDesign'
//@ts-ignore
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { useTheme } from '@react-navigation/native'
// import user from '../classes/User'
import Crypto from '../classes/Crypto'
import ModalView, { Button } from '../components/Modal'
import codes from '../classes/Data';
import { FlatList } from 'react-native-gesture-handler';

const crypto = new Crypto;

export default function SearchScreen() {
  // state = {
  //   email: "",
  //   name: "",
  //   enc: "",
  //   text: "",
  //   searching: true,
  //   icon: "account-plus",
  //   placeholder: "Buscar usuario",
  //   searchType: "Usuario",
  //   theme: 0
  // }
  const [value, Setvalue] = useState("");
  const [searching, isSearch] = useState(false);
  const [type, setType] = useState("Usuario");
  const [scannerOpen, Scan] = useState(false);
  const [icon, setIcon] = useState('adduser')
  const [modalqr, SetVisible] = useState(false)
  const [userqr, setUser] = useState([{}])
  const [resultados, SetResult] = useState([]);

  function changeFilter() {
    if (type == "Usuario") {
      setIcon('addusergroup');
      setType('Sala')
    } else {
      setIcon('adduser');
      setType('Usuario')
    }
  }

  function search() {
    // alert(crypto.Encrypt(this.state.text, "Holu", "A"));
  }

  //@ts-ignore
  const onBarcodeScan = (value) => {

    if (value.includes('QUORUM µ')) {
      let data = value.split("µ");
      let username = crypto.Decrypt(data[3], codes[5], "A", false, false);
      let uid = crypto.Decrypt(data[2], codes[5], "A", true, false);
      uid = crypto.Reverse(uid)
      setUser({ name: username, id: uid })
      Scan(false);
      SetVisible(true)
    }
  }
  const onOpneScanner = () => {
    // To Start Scanning
    if (Platform.OS === 'android') {
      async function requestCameraPermission() {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'Camera Permission',
              message: 'La cámara se usara para escanear códigos QR',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            Scan(true);
          } else {
            alert('No podrás escanear un QR si no permites el uso de la cámara');
          }
        } catch (err) {
          alert('Camera permission err', err);
          console.warn(err);
        }
      }
      requestCameraPermission();
    } else {
      // setQrvalue('');
      Scan(true);
    }
  };
  const { colors } = useTheme();

  const Item = (data) => {
    return (
      <View>
        <Text>{ }</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      {scannerOpen ?
        (<View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.close} onPress={() => Scan(false)}>
            <Icon name="close" size={48} color={colors.primary} />
          </TouchableOpacity>
          <CameraKitCameraScreen
            showFrame={false}
            scanBarcode={true}
            laserColor={'#b37feb'}
            frameColor={'#13c2c2'}
            offsetForScannerFrame={5}
            heightForScannerFrame={500}
            colorForScannerFrame={'red'}
            //@ts-ignore
            onReadCode={(event) =>
              onBarcodeScan(event.nativeEvent.codeStringValue)
            }
          />
        </View>)
        : (<LinearGradient colors={[colors.card, colors.notification]}
          start={{ x: 0.1, y: 0.1 }}
          style={sharedStyles.linearGradient}>
          <View style={[sharedStyles.card, styles.search, { backgroundColor: colors.background }]}>
            <TouchableOpacity onPress={() => changeFilter()} style={{ marginHorizontal: 5 }}>
              <Icon name={icon} size={32} color={colors.border} />
            </TouchableOpacity>
            <TextInput onChangeText={text => Setvalue(text)} placeholder={'Buscar ' + type} placeholderTextColor={colors.border + "aa"} style={{ flex: 1, color: colors.text }}></TextInput>
            <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={() => search()}>
              <Icon name="search1" size={24} color={colors.border} />
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingHorizontal: 5, marginRight: 5 }} onPress={() => onOpneScanner()}>
              <Icon name="scan1" size={24} color={colors.border} />
            </TouchableOpacity>
          </View>
          <FlatList renderItem={({ item }) => Item(item)} data={resultados} numColumns={2} />
          <ModalView title="Añadir contacto" visible={modalqr} >
            <Text style={{ fontSize: 16 }}>Añadir a</Text>
            <Text style={{ fontFamily: 'Raleway-Regular', fontSize: 18, marginBottom: 10 }}>{userqr.name}</Text>
            <View style={{ flex: 1, flexDirection: 'row', marginBottom: 20 }}>
              <Button icon={true} isCancel={false} />
              <Button icon={true} isCancel={true} onPress={() => { SetVisible(false) }} />
            </View>
          </ModalView>
        </LinearGradient>
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box_container: {
    padding: 15,
    backgroundColor: '#fff',
    opacity: 0.5
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#b37feb',
    borderRadius: 15,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center'
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 3
  }
});
