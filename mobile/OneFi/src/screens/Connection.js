import React, { Component } from 'react';

import {Animated, Text, View, TouchableOpacity, Platform } from 'react-native';

import {globalStyles} from '../styles/globalStyle'

import Icon from 'react-native-vector-icons/Ionicons'

import WifiManager from 'react-native-wifi-reborn'

import Heartbeat from '../BackgroundProcess/Heartbeat'


/*
Tutorial used for background process
https://medium.com/reactbrasil/how-to-create-an-unstoppable-service-in-react-native-using-headless-js-93656b6fd5d1

https://github.com/mathias5r/rn-heartbeat

*/


import { PermissionsAndroid } from 'react-native';


// Needed the first time they use the app to allow the app to 
// find the wifi spots near by
async function getPermission() {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission is required for WiFi connections',
      message:
        'This app needs location permission as this is required  ' +
        'to scan for wifi networks.',
      buttonNegative: 'DENY',
      buttonPositive: 'ALLOW',
    },
  );
  if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  // You can now use react-native-wifi-reborn
  } else {
  // Permission denied
  }
}


export default class Connection extends Component {
    scaleInAnimated = new Animated.Value(0)
    scaleOutAnimated = new Animated.Value(1)

    constructor(props) {
        super(props)
        this.state = {
            connectionButtonColor: '#cc0d00',
            connectionStatus: false,
            routerID: '123abc456ef89',
            wifiList: []

        }
    }

    connect = () => {
      if (this.state.connectionStatus == false){
          this.setState({connectionButtonColor: '#45ad45'})
          this.setState({connectionStatus: true})
      }
      else {
          this.setState({connectionButtonColor: '#cc0d00'})
          this.setState({connectionStatus: false})
      }
    }
    getWifiList = async() => {
      let wifiList = await WifiManager.loadWifiList()
      let test = ""
      for (let i = 0; i < wifiList.length; i++)
      {
        test += wifiList[0].SSID;
      }
      alert('wifi list' + test)
    }

    connectionButtonPress = () => {
      SCALE.pressOutAnimation(this.scaleOutAnimated); 
      getPermission()
      if (Platform.OS == 'android')
      {
        this.getWifiList();
      }

      // Heartbeat.startService()
      this.connect()
    }


    
    render() {
        return (   
        <View style = {globalStyles.pageBackground}>
            <View style = {globalStyles.headerContainer}>
                <Text style = {globalStyles.headerText}>CONNECTION</Text>
            </View>
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', alignContent: 'center'}}>
                <TouchableOpacity 
                    style = {[globalStyles.connectionButton, {backgroundColor: this.state.connectionButtonColor, paddingLeft: '1.5%', paddingTop: '1.5%'}, SCALE.getScaleTransformationStyle(this.scaleOutAnimated, 1, 1.05)]} 
                    activeOpacity = {0.6} 
                    onPressIn = {() => {SCALE.pressInAnimation(this.scaleInAnimated)}}
                    onPressOut = {() => {this.connectionButtonPress()}}
                    > 
                    <Animated.View>
                      <Icon name = 'power' style = {{fontSize: 100, color: 'white'}}></Icon>
                    </Animated.View>
                </TouchableOpacity>
                <Text style= {[globalStyles.basicText, {paddingTop: '3%'}]}>Connection Status</Text>
                <Text style = {[globalStyles.basicText, {color: this.state.connectionButtonColor, fontSize: 50}]}>{this.state.connectionStatus ? 'Connected' : 'Disconnected'}</Text>
                <Text style = {globalStyles.basicText}>Router ID: {this.state.routerID}</Text>
            </View>
        </View>
        );
    }
}

const SCALE = {
    // this defines the terms of our scaling animation. 
    getScaleTransformationStyle(animated: Animated.Value, startSize: number = 1, endSize: number = 0.99) {
      const interpolation = animated.interpolate({
        inputRange: [0, 1],
        outputRange: [startSize, endSize],
      });
      return {
        transform: [
          { scale: interpolation },
        ],
      };
    },
    // This defines animation behavior we expext onPressIn
   pressInAnimation(animated: Animated.Value, duration: number = 150) {
      animated.setValue(0);
      Animated.timing(animated, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }).start();
    },
    // This defines animatiom behavior we expect onPressOut
    pressOutAnimation(animated: Animated.Value, duration: number = 150) {
      animated.setValue(1);
      Animated.timing(animated, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }).start();
    },
  };