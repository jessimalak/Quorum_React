import React, { Component } from 'react';
import { View, ActivityIndicator, Image, StatusBar} from 'react-native';

export default class LoadingScreen extends Component {

  render() {
    return (
      <View style={{backgroundColor:"#fff", alignItems:"center", justifyContent: "center", height:'100%', width:'100%'}}>
          <Image source={require('../assets/logoc1.png')} style={{width:'100%', height:200, resizeMode:"center"}}/>
          <View style={{position: 'absolute', bottom: '25%', left: 0, right: 0}}>
            <ActivityIndicator size="large" color="#b37feb"></ActivityIndicator>
          </View>
      </View>
    );
  }
}
