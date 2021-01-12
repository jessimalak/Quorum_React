import React, { useEffect, useLayoutEffect, useState, useCallback } from 'react';
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient'
//@ts-ignore
import Icon from 'react-native-vector-icons/Ionicons'
import { Bubble, GiftedChat, Time, Send, InputToolbar, Composer } from 'react-native-gifted-chat'
//@ts-ignore
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { useTheme } from '@react-navigation/native'
//@ts-ignore
import { CameraKitCamera } from 'react-native-camera-kit'
//@ts-ignore
import EmojiBoard from 'react-native-emoji-board'
import user from '../classes/User';

//@ts-ignore
export default function ChatScreen({ route, navigation }) {
  const { name, id, img } = route.params;
  const { colors } = useTheme();
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
            <Menu ref={(ref) => (_menu = ref)}
              button={<Icon onPress={() => _menu.show()} name="ellipsis-vertical" size={26} color={colors.text} style={{ backgroundColor: colors.card, paddingLeft: 5, paddingRight: 10, paddingVertical: 8 }} />}>
              <MenuItem>{<Icon name="trash-outline" size={18} color="#000" />} Vaciar chat</MenuItem>
              <MenuItem>{<Icon name="lock-closed-outline" size={18} color="#000" />} Bloquear</MenuItem>
            </Menu>
          </View>)
      },
      headerTitle: (props) => {
        return (
          <TouchableOpacity onPress={() => alert(name)}>
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
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: 1606169203000,
        user: {
          _id: 5,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
        video: "https://firebasestorage.googleapis.com/v0/b/transforma-app.appspot.com/o/MonitorFantasma%2045018.mp4?alt=media&token=0cb0b229-49db-4c56-8b93-3155c5f63a1e"
      },
      {
        _id: 3,
        text: 'how are you wey?',
        createdAt: 1606169303000,
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
        image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.boostability.com%2Fwp-content%2Fuploads%2F2014%2F09%2FPanda-Update.jpg&f=1&nofb=1"
      },
      {
        _id: 0,
        text: 'KYC viejo lesbiano',
        createdAt: new Date(),
        user: {
          _id: 0,
          name: 'JessiMalak',

        },
        audio: "https://firebasestorage.googleapis.com/v0/b/transforma-app.appspot.com/o/Amurrao.mp3?alt=media&token=a2ba9b1b-400e-43fa-8340-ccfe03c53289"
      },
    ])
  }, [])
  let idM = 0;
  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    if (idM == 3) {
      idM = 0
    } else {
      idM++
    }
  }, [])


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
            color: colors.background
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
            backgroundColor: colors.text,
          },
          left: {
            backgroundColor: colors.notification,
          }

        }}
        textStyle={{
          right: {
            color: colors.background,
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
              user={{ _id: idM, name: user.username }}
              onSend={messages => onSend(messages)}
              renderSend={sendButton}
              renderBubble={StyledBubble}
              renderActions={emojis}
              onPressActionButton={() => SetVisibleEmoji(true)}
              // renderAccessory={camera}
              renderInputToolbar={input}
            />
          )
        }
        <EmojiBoard showBoard={emojiVisible} onClick={(emoji:string) => { console.log(emoji) }} />
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
