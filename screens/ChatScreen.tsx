import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
import Icon from 'react-native-vector-icons/Ionicons'
import { Bubble, GiftedChat, Time, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
//@ts-ignore
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { useTheme } from '@react-navigation/native'
//@ts-ignore
import { CameraKitCamera } from 'react-native-camera-kit'
import user from '../classes/User';
import Store from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import Crypto from '../classes/Crypto'
import 'dayjs/locale/es'
let id_ = user.id;

//@ts-ignore
export default function ChatScreen({ route, navigation }) {
  const { name, id, img, tipo, leido } = route.params;
  const theme = useTheme();
  const { colors } = theme;
  const [mensajes, setMessages] = useState([]);
  const [cameraVisible, OpenCamera] = useState(false);
  const [emojiVisible, SetVisibleEmoji] = useState(false)

  //@ts-ignore
  let _menu = null;

  useLayoutEffect(() => {

    navigation.setOptions({
      headerTitleStyle: {
        fontFamily: 'Raleway-Regular',
      },
      // headerTitle: name,
      headerRight: () => {
        return (
          <View style={{ flexDirection: "row", alignItems: 'center' }}>
            <Icon name="call-outline" size={32} color={colors.text} style={{ backgroundColor: colors.card, paddingHorizontal: 10 }} />
            <Menu ref={(ref: any) => (_menu = ref)}
              button={<Icon onPress={() => _menu.show()} name="ellipsis-vertical" size={26} color={colors.text} style={{ backgroundColor: colors.card, paddingLeft: 5, paddingRight: 10, paddingVertical: 8 }} />}>
              <MenuItem>{<Icon name="trash-outline" size={18} color="#000" />} Vaciar chat</MenuItem>
              <MenuItem>{<Icon name="lock-closed-outline" size={18} color="#000" />} Bloquear</MenuItem>
            </Menu>
          </View>)
      },
      headerTitle: (props: any) => {
        return (
          <TouchableOpacity onPress={() => console.info(name)}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image style={{ height: 44, width: 44, resizeMode: 'cover', borderRadius: 44 }} source={img == 'none' ? require('../assets/useravatar.png') : { uri: img }} />
              <Text ellipsizeMode='tail' textBreakStrategy='simple' style={{ fontSize: 20, color: colors.text, fontFamily: 'Raleway-Regular', marginLeft: 10 }}>{name}</Text>
            </View>
          </TouchableOpacity>
        )
      }
    })

  })

  useEffect(() => {
    console.info(user, id)
    console.info(auth().currentUser)
    const ref = tipo == 'sala' ?
      Store().collection('salas').doc(id)
      : Store().collection('usuarios').doc(user.id)
        .collection('chats').doc(id)
    const unsuscribe = ref.collection('Mensajes').onSnapshot((snapshot) => {
      const snap = snapshot.docChanges().filter(({ type }) => type == 'added').map(({ doc }) => {
        const data = doc.data()
        const isOther = data.user._id == id
        try {
          const code = isOther ? user.id : id;
          data.text = Crypto.Decrypt(Crypto.Decrypt(data.text, code, "R", false), "GET Random", "A", true, 13)
        } catch (error) {
          console.log('try', error)
        }
        if (isOther && mensajes.length > 0 && tipo == 'contacto') {
          ref.update({ leido: true })
        }
        return { ...data, createdAt: data.createdAt.toDate() }
      }).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      setMessages_(snap)
    })
    if(tipo == 'contacto' && !leido){
      ref.update({leido: true})
    }
    return () => unsuscribe()
  }, [])
  const setMessages_ = useCallback((message = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, message))
    console.log('callback', message)
  }, [mensajes])

  const onSend = (message = []) => {
    let { createdAt } = message[0]
    //@ts-ignore
    message[0].text = Crypto.Encrypt(message[0].text, 'SELECT MAIN code', "A", true, 13)
    //@ts-ignore
    const text = message[0].text
    //@ts-ignore
    message[0].text = Crypto.Encrypt(message[0].text, id, "R", false)
    if (tipo == 'contacto') {
      const me = Store().collection('usuarios').doc(id_).collection('chats').doc(id)
      const other = Store().collection('usuarios').doc(id).collection('chats').doc(id_)
      me.collection('Mensajes').add(message[0]).then(() => {
        me.update({ last: { createdAt, text }, leido: true })
        other.collection('Mensajes').add(message[0]).then(() => {
          other.update({ last: { createdAt, text }, leido: false })
        }).catch(e=>{
          console.warn('error "other"', e)
        })
      }).catch(e=>{
        console.warn('error "me"',e)
      })
    }else{
      Store().collection('salas').doc(id).collection('Mensajes').add(message[0])
    }
  }


  const placeColor = colors.text + "aa"

  //@ts-ignore
  const sendButton = (props) => {
    return (
      <Send {...props}
        textStyle={{
          color: colors.card
        }}
        label="Oh"
        children={<Icon name="send" size={32} color={colors.text} style={{ height: 40, width: 45 }} />}
      //   sendButtonProps={()=>{
      //      // <TouchableHighlight onPress={() => onSend(messages)} underlayColor={colors.card} style={{backgroundColor: colors.primary, borderRadius: 24, height: 40, width: 40, marginBottom: 3, marginRight:3, alignItems: 'center', justifyContent: 'center'}}>
      //  return (<Icon name="send" size={24} color={colors.card} style={{height: 32, width: 32}}/>)
      // // </TouchableHighlight>
      //   }}
      />
    )
  }
  //@ts-ignore
  const hora = (props) => {
    return (
      <Time {...props}
        timeTextStyle={{
          left: {
            color: placeColor
          },
          right: {
            color: placeColor
          }
        }}
      />
    )
  }
  //@ts-ignore
  const StyledBubble = (props) => {
    return (
      <Bubble {...props}
        wrapperStyle={{
          right: {
            backgroundColor: colors.background,
          },
          left: {
            backgroundColor: colors.notification,
          }

        }}
        textStyle={{
          right: {
            color: colors.text,
            fontFamily: 'Roboto-Regular'
          },
          left: {
            color: colors.text,
            fontFamily: 'Roboto-Regular'
          }
        }}
        usernameStyle={{
          color: placeColor,
          fontFamily: 'Roboto-Regular'
        }}
        renderTime={hora}
      />
    )
  }
  //@ts-ignore
  const inputComposer = (props) => {
    return (
      <Composer {...props}
        textInputStyle={{
          color: colors.text
        }}
        placeholderTextColor={placeColor}

      />
    )
  }

  //@ts-ignore
  const input = (props) => {
    return (
      <InputToolbar {...props}
        containerStyle={{
          backgroundColor: colors.card,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        renderComposer={inputComposer}

      />
    )
  }

  //@ts-ignore
  const emojis = (props) => {
    return (
      <Icon onPress={() => { OpenCamera(true) }} style={{ backgroundColor: colors.card }} name="happy-outline" size={35} color={colors.text} />
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar />
      <LinearGradient colors={[colors.card, colors.notification]} style={styles.linearGradient}>
        {cameraVisible ? (<CameraKitCamera
          // ref={(cam) => (this.camera = cam)}
          style={{
            flex: 1,
            backgroundColor: 'white',
          }}
          cameraOptions={{
            flashMode: 'auto', // on/off/auto(default)
            focusMode: 'on', // off/on(default)
            zoomMode: 'on', // off/on(default)
            ratioOverlay: '18:9', // optional
            ratioOverlayColor: '#00000077', // optional
          }}
          resetFocusTimeout={0} // optional
          resetFocusWhenMotionDetected={true} // optional
        />) : (
          <GiftedChat
            //@ts-ignore
            style={{ height: '100%', width: '100%' }}
            placeholder="Escribe un mensaje..."
            showUserAvatar={false}
            inverted={true}
            renderUsernameOnMessage={true}
            alignTop={true}
            messages={mensajes}
            user={{ _id: user.id, name: user.username }}
            onSend={message => onSend(message)}
            renderSend={sendButton}
            renderBubble={StyledBubble}
            renderActions={emojis}
            onPressActionButton={() => SetVisibleEmoji(true)}
            // renderAccessory={camera}
            renderInputToolbar={input}
            locale='es'
          />
        )
        }
      </LinearGradient>


    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  box_container: {
    width: '100%',
    height: '100%'
  },
  linearGradient: {
    width: '100%',
    height: '100%',
    flex: 1
  }
});
