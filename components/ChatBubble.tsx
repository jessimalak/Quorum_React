import React from 'react'
import {Text, View, TouchableOpacity, Image} from 'react-native'
import {useTheme} from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'
import sharedStyles from '../classes/Styles'

interface BubbleProps{
    onPress: Function
    img: string
    name: string
    text: string
    leido: boolean
    date: Date
}
function FormatDate(date:Date){
    let time = ('0' + (date.getHours() > 12 ? date.getHours() - 12 : date.getHours() ).toString()).slice(-2) + ':' + ('0' + date.getMinutes().toString()).slice(-2) + ' ' + (date.getHours() >= 12 ? 'pm' : 'am')
    let day = '';
    let month = date.getMonth()
    let lastDay = 28
    if(month == 0 || month == 2 || month == 4 || month == 6 || month == 7 || month == 9 || month == 11){
      lastDay = 31
    }else{
      lastDay= 30
    }
    let end = date.getDate() == lastDay
    let today = new Date()
    if(date.getDate() == today.getDate() -1 && month == today.getMonth()){
      day = 'Ayer'
    }else if(end && today.getDate() == 1 && (month == today.getMonth()-1 || today.getMonth() == 0)){
      day = 'Ayer'
    }else if(today.getDate() != date.getDate() && today.getMonth() != date.getMonth()){
      day = ('0' + date.getDate().toString()).slice(-2) + '-' + ('0' +( month + 1).toString()).slice(-2)
    }
    console.log(day, month, lastDay, date.getDate())
    return day + ' ' + time
  }

export default function ChatBubble({leido, name, text,img, onPress, date}:BubbleProps){
    const {colors} = useTheme()
    return (
        <TouchableOpacity onPress={() => onPress()}>
          <View style={[sharedStyles.card, { marginVertical: 5, paddingVertical: 10, paddingLeft: 5, flexDirection: "row", alignItems: "center", position: "relative", backgroundColor: colors.background }]}>
            <Image source={img === "none" ? require('../assets/useravatar.png') : { uri: img }} loadingIndicatorSource={require('../assets/useravatar.png')} style={{ width: 50, height: 50, resizeMode: "cover", borderRadius: 50 }} />
            {!leido && <Icon name="ellipse" size={20} color={colors.primary} style={{ position: 'absolute', top: -5, right: -5 }} /> }
            <View style={{ marginLeft: 5, width: '100%', flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: 'Roboto-Regular', paddingBottom: 5, color: colors.border }}>{name}</Text>
              <View style={{ flex: 1, flexDirection: 'row', overflow: 'hidden', alignItems: 'center' }}>
                <Text
                  style={
                    {
                      paddingRight: 15, flexWrap: "wrap",
                      // maxWidth: '90%',
                      flex: 1,
                      fontFamily: 'Roboto-Light',
                      color: colors.border
                    }}
                  numberOfLines={1}
                  ellipsizeMode="clip">
                  {text || 'sala de chat'}
                </Text>
                <Text style={
                  {
                    fontSize: 10, color: colors.border
                  }}>{FormatDate(date) || '00:00'}</Text>
              </View>
  
            </View>
          </View>
        </TouchableOpacity>
      )
}