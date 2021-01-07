import 'react-native-gesture-handler';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import LinearGradient from "react-native-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage'
//@ts-ignore
import Icon from 'react-native-vector-icons/Ionicons'
import ModalView, { Button } from '../components/Modal'
// import Button from '../components/ModalButton'
import { useTheme } from '@react-navigation/native'
import user from '../classes/User'
import sharedStyles from '../classes/Styles';
import * as Animatable from 'react-native-animatable'
import { TouchableHighlight } from 'react-native-gesture-handler';
import Guy from '../components/GuyFawkes'

let tempo = [
  {
    name: "pandita",
    time: "7:00 pm",
    read: false,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.boostability.com%2Fwp-content%2Fuploads%2F2014%2F09%2FPanda-Update.jpg&f=1&nofb=1",
    subname: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe odio temporibus dolorem at omnis magni nesciunt et unde. Dolore vitae quisquam minima inventore."
  },
  {
    name: "gatita",
    time: "6:00 pm",
    read: true,
    img: "https://randomwordgenerator.com/img/picture-generator/52e1d5424b56aa14f1dc8460962e33791c3ad6e04e50744074267bd69149c7_640.jpg",
    subname: "Maxime totam, fugiat vel consectetur ratione odit molestiae excepturi quasi?"
  },
  {
    name: "gapandita0",
    time: "12:30 am",
    img: "none",
    read: false,
    subname: "Nisi repellat ea deserunt odit ducimus dolorum itaque aspernatur ab praesentium non."
  },
  {
    name: "gapandita1",
    time: "ayer 7:00 pm",
    img: "none",
    read: true,
    subname: "Briana Lilith"
  },
  {
    name: "josefini",
    time: "ayer 10:40 pm",
    read: true,
    img: "https://randomwordgenerator.com/img/picture-generator/50e3d5424e5bb10ff3d8992cc12c30771037dbf852547941772d7bdd9348_640.jpg",
    subname: "Jugemos"
  },
  {
    name: "gatita1",
    time: "12/11/20 7:00 pm",
    img: "none",
    read: false,
    subname: "Sapiente sit suscipit voluptas id eos quisquam."
  },
  {
    name: "gapandita2",
    time: "12/11/20 7:00 pm",
    read: true,
    img: "https://randomwordgenerator.com/img/picture-generator/57e1d74b4854af14f1dc8460962e33791c3ad6e04e5074417d2e72dd974ec6_640.jpg",
    subname: "Lucifer Jesús Cera"
  },
  {
    name: "gapandita3",
    time: "12/11/20 7:00 pm",
    img: "none",
    read: true,
    subname: "Briana Lilith Cera"
  },
  {
    name: "moderato",
    time: "7:00 pm",
    read: false,
    img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.boostability.com%2Fwp-content%2Fuploads%2F2014%2F09%2FPanda-Update.jpg&f=1&nofb=1",
    subname: "ipsum dolor sit amet consectetur, adipisicing elit. Saepe odio temporibus dolorem at omnis magni nesciunt et unde. Dolore vitae quisquam minima inventore."
  },
  {
    name: "laperradetucasa",
    time: "6:00 pm",
    read: true,
    img: "https://randomwordgenerator.com/img/picture-generator/52e1d5424b56aa14f1dc8460962e33791c3ad6e04e50744074267bd69149c7_640.jpg",
    subname: "Maxime totam, fugiat vel consectetur ratione molestiae excepturi quasi?"
  },
  {
    name: "saranety",
    time: "12:30 am",
    img: "none",
    read: false,
    subname: "Nisi repellat ea deserunt odit ducimus dolorum itaque aspernatur ab praesentium non."
  },
  {
    name: "zafi",
    time: "ayer 7:00 pm",
    img: "none",
    read: true,
    subname: "Briana Lilith"
  },
  {
    name: "malakias",
    time: "ayer 10:40 pm",
    read: true,
    img: "https://randomwordgenerator.com/img/picture-generator/50e3d5424e5bb10ff3d8992cc12c30771037dbf852547941772d7bdd9348_640.jpg",
    subname: "Jhon Malakias"
  },
  {
    name: "unalocarandom",
    time: "12/11/20 7:00 pm",
    img: "none",
    read: false,
    subname: "Sapiente sit suscipit volupta id eos quisquam."
  },
  {
    name: "gapandita5",
    time: "12/11/20 7:00 pm",
    read: true,
    img: "https://randomwordgenerator.com/img/picture-generator/57e1d74b4854af14f1dc8460962e33791c3ad6e04e5074417d2e72dd974ec6_640.jpg",
    subname: "Lucifer Jesús"
  },
  {
    name: "gapandita4",
    time: "12/11/20 7:00 pm",
    img: "none",
    read: true,
    subname: "Briana Lilith"
  }
]
// getChats = async () => {
//   let Chatses = new Array;
//   await firebase.database().ref("Usuarios").once("value").then((snapshot) => {
//     snapshot.forEach((element) => {
//       let { username, nombre } = element.val();
//       let chat = { name: username, subname: nombre, id: element.key };
//       Chatses.push(chat);
//     })
//   })
//   this.setState({ chats: Chatses })
// }

//@ts-ignore
export default function Main({ navigation }) {
  const { colors } = useTheme();
  const card = colors.background + "dd"
  useLayoutEffect(() => {
    const parent = navigation.dangerouslyGetParent()
    parent.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: 'center' }}>
          <Icon.Button style={{ paddingHorizontal: 10, backgroundColor: colors.card }} onPress={() => { ShowCreateModal(true) }} name="people-outline" size={32} color="#fff" />
          <TouchableHighlight onPress={()=>{ShowPrivateModal(true)}} underlayColor={colors.notification} style={{height: 32, width: 32, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10, backgroundColor: colors.card, marginRight: 10}}>
            <Guy color={colors.text} size={32} />
            </TouchableHighlight> 
          {/* <Icon.Button style={{ paddingHorizontal: 10, backgroundColor: colors.card }} onPress={() => ShowPrivateModal(true)} name="transgender-outline" size={32} color="#fff" /> */}
        </View>)
    })
  })

  async function getData() {
    try {
      //@ts-ignore
      user.estado = await AsyncStorage.getItem('estado');
      //@ts-ignore
      user.name = await AsyncStorage.getItem('name');
      //@ts-ignore
      user.username = await AsyncStorage.getItem('username');
      //@ts-ignore
      user.mail = await AsyncStorage.getItem('mail');
    }
    catch (e) {

    }
  }

  useEffect(() => {
    getData()
  })

  const [PrivateModalState, ShowPrivateModal] = useState(false);
  const [CreateModalState, ShowCreateModal] = useState(false);

  //@ts-ignore
  const showChat = (chat) => {
    return (
      <TouchableOpacity onPress={() => { navigation.navigate("Chat", { id: chat.id, name: chat.name }) }}>
        <Animatable.View animation="bounceInLeft" delay={500} duration={1500} style={[sharedStyles.card, { marginVertical: 5, paddingVertical: 10, paddingLeft: 5, flexDirection: "row", alignItems: "center", position: "relative", backgroundColor: card }]}>
          <Image source={chat.img === "none" ? require('../assets/useravatar.png') : { uri: chat.img }} loadingIndicatorSource={require('../assets/useravatar.png')} style={{ width: 50, height: 50, resizeMode: "cover", borderRadius: 50 }} />
          {!chat.read ? <Icon name="ellipse" size={20} color={colors.primary} style={{ position: 'absolute', top: -5, right: -5 }} /> : null}
          <View style={{ marginLeft: 5, width: '100%', flex: 1 }}>
            <Text style={{ fontSize: 16, fontFamily: 'Roboto-Regular', paddingBottom: 5, color: colors.border }}>{chat.name}</Text>
            <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden', alignItems: 'center' }}>
              <Text
                style={
                  {
                    paddingRight: 15, flexWrap: "wrap",
                    maxWidth: '90%',
                    flex: 1,
                    fontFamily: 'Roboto-Light',
                    color: colors.border
                  }}
                numberOfLines={1}
                ellipsizeMode="clip">
                {chat.subname/* {this.dec(chat.subname, "codes[8]", "R")} */}
              </Text>
              <Text style={
                {
                  fontSize: 10, color: colors.border
                }}>{chat.time}</Text>
            </View>

          </View>
        </Animatable.View>
      </TouchableOpacity>
    )
  }
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient colors={[colors.card, colors.notification]} style={sharedStyles.linearGradient}>
        <StatusBar barStyle='light-content' backgroundColor={colors.card} />
        <FlatList
          style={{ paddingBottom: 10 }}
          data={tempo}
          //@ts-ignore
          keyExtractor={item => item.name}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => showChat(item)} />

        <ModalView visible={PrivateModalState} title="Ingresar a sala privada">
          <Guy color={colors.border} size={72} />
          <TextInput style={[sharedStyles.modalInput, { width: '90%', borderBottomColor: colors.border }]} placeholderTextColor={colors.background == "#ffffff" ? '#333' : '#aaa'} placeholder="Código de acceso" />
          <View style={styles.buttonContainer}>
            <Button
              isCancel={false}
              icon={true}
              //@ts-ignore
              onPress={() => ShowPrivateModal(false)} />
            <Button
              isCancel={true}
              icon={true}
              //@ts-ignore
              onPress={() => ShowPrivateModal(false)} />
          </View>
        </ModalView>

      </LinearGradient>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    width: '50%'
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center'
  }
});
