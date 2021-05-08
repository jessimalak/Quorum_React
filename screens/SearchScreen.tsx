import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity, PermissionsAndroid, Platform, Image } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
// import firebase from '../classes/Firebase'
import sharedStyles from '../classes/Styles';
//@ts-ignore
import Icon from 'react-native-vector-icons/AntDesign'
//@ts-ignore
import { CameraKitCameraScreen } from 'react-native-camera-kit';
import { useTheme } from '@react-navigation/native'
// import user from '../classes/User'
import crypto from '../classes/Crypto'
import ModalView, { Button } from '../components/Modal'
import codes from '../classes/Data';
import { FlatList } from 'react-native-gesture-handler';

const datica = [
  {
    name: 'manuelito Naranjo',
    verified: true,
    username: 'ultralord',
    img: ''
  },
  {
    name: 'Daniel Alveiro',
    verified: false,
    username: 'dannyphantom',
    img: 'https://www.cbr.com/wp-content/uploads/2017/02/Danny-Phantom-Public-Enemy.jpg'
  },
  {
    name: 'Carla Manuela',
    verified: false,
    username: 'carlota24',
    img: ''
  },
  {
    name: 'Jessica Malak',
    verified: true,
    username: 'jessimalak',
    img: ''
  },
  {
    name: 'Kimi Sofia',
    verified: false,
    username: 'gatita_official',
    img: ''
  },
  {
    name: 'manuelito Antonio Naranjo',
    verified: false,
    username: 'ultralord01',
    img: ''
  },
  {
    name: 'Daniel Alveiro grajales',
    verified: true,
    username: 'dannyphantom5',
    img: 'https://www.cbr.com/wp-content/uploads/2017/02/Danny-Phantom-Public-Enemy.jpg'
  },
  {
    name: 'Carla Manuela',
    verified: false,
    username: 'carlota2',
    img: ''
  },
  {
    name: 'Jessica Malak',
    verified: true,
    username: 'maquinadeguerra32',
    img: ''
  },
  {
    name: 'Kimi Sofia',
    verified: true,
    username: 'gatita',
    img: ''
  }
]

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
  const { colors } = useTheme();
  const cardColor = colors.background + 'dd'

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
      let username = crypto.Decrypt(data[3], codes[5], "A", false, 5);
      let uid = crypto.Decrypt(data[2], codes[5], "A", true, 5);
      uid = crypto.Reverse(uid)
      //@ts-ignore
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

  //@ts-ignore
  const Item = (data) => {
    return (
      <View style={[sharedStyles.card, { backgroundColor: cardColor, width: '95%', marginRight: 0, paddingVertical: 10, marginTop: 0, flexDirection: 'row' }]}>
        <View style={{ position: 'relative' }}>
          {data.img ?
            (<Image source={{ uri: data.img }}
              style={{ width: 50, height: 50, resizeMode: "cover", borderRadius: 50, marginRight: 5 }}
            />) :
            (<View style={{ width: 50, height: 50, borderRadius: 50, marginRight: 5, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.card + 'aa' }}>
              <Text style={{ color: colors.border, fontSize: 20, fontFamily: 'Raleway-Regular' }}>{data.username[0].toUpperCase()}</Text>
            </View>)
          }

        </View>
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ color: colors.border, textAlign: 'center', fontFamily: 'Roboto-Regular' }}>{data.verified ? data.username + " " : data.username}{data.verified ? (<Icon name="check" size={14} color={colors.primary} />) : null} </Text>
          <Text numberOfLines={2} textBreakStrategy='balanced' ellipsizeMode='tail' style={{ color: colors.border, flex: 1, fontFamily: 'Roboto-Light' }}>{data.name}</Text>
        </View>
        <TouchableOpacity style={{ justifyContent: 'center' }}>
          <Icon name="adduser" size={32} color={colors.border} />
        </TouchableOpacity>

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
          <View style={[styles.search, { backgroundColor: colors.card }]}>
            <TouchableOpacity onPress={() => changeFilter()} style={{ marginHorizontal: 5 }}>
              <Icon name={icon} size={32} color={colors.text} />
            </TouchableOpacity>
            <TextInput onChangeText={text => Setvalue(text)} placeholder={'Buscar ' + type} placeholderTextColor={colors.text + "aa"} style={{ flex: 1, color: colors.text }}></TextInput>
            <TouchableOpacity style={{ paddingHorizontal: 5 }} onPress={() => search()}>
              <Icon name="search1" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingHorizontal: 5, marginRight: 5 }} onPress={() => onOpneScanner()}>
              <Icon name="scan1" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList renderItem={({ item }) => Item(item)} data={datica} numColumns={1} keyExtractor={item => item.username} />
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
    padding: 5,
    width: '100%',
    height: 56,
    marginBottom: 5
  },
  close: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 10,
    zIndex: 3
  }
});
