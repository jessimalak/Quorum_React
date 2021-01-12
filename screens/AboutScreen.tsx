import React, { Component } from 'react';
import { View, ActivityIndicator, Image, StatusBar, Text} from 'react-native';
import { useTheme } from '@react-navigation/native'


export default function AboutScreen() {
    const {colors} = useTheme();

    return (
      <View style={{backgroundColor:colors.background, alignItems:"center", justifyContent: "center", height:'100%', width:'100%'}}>
          <StatusBar barStyle="light-content" backgroundColor={colors.card} />
          <Image source={require('../assets/logoc1.png')} style={{width:'100%', height:200, resizeMode:"center"}}/>
          <Text style={{color: colors.border}}> Versión 0.0.1a</Text>
          <Text style={{color: colors.border}}>Unnamed</Text>
      </View>
    );
  }

