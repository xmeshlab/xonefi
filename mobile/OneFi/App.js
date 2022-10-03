/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import 'react-native-gesture-handler'
import * as React from 'react';
import Icon from 'react-native-vector-icons/Ionicons'

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import Connection from './src/screens/Connection'

import AccountStackScreen from './src/navigation_stacks/AccountStackScreen'
import PaymentStackScreen from './src/navigation_stacks/PaymentStackScreen'

const Tab = createBottomTabNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator

        initialRouteName = "Connect"
        screenOptions = {({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
          let iconName
          if (route.name === "Connect") {
            iconName = focused
            ? 'wifi'
            : 'wifi-outline' 
          } 
          else if (route.name === "Account") {
            iconName = focused 
              ? 'person' 
              : 'person-outline'
          } 
          else if (route.name === "Payment") {
            iconName = focused
              ? 'wallet'
              : 'wallet-outline'
          }

          return <Icon name = {iconName} size = {size} color = {color}  style = {{fontSize: 40}}/>

          },
        })}
        tabBarOptions = {{
          style: {height: 65},
          labelStyle: {fontSize: 15},
          keyboardHidesTabBar: true,
          activeTintColor: 'white',
          inactiveTintColor: '#f4623a',
          activeBackgroundColor: '#f4623a',
          inactiveBackgroundColor: '#e9e9e9'
        }}
      > 
      
        <Tab.Screen name = "Payment" component={PaymentStackScreen}/>
        <Tab.Screen name = "Connect" component={Connection} /> 
        <Tab.Screen name = "Account" component={AccountStackScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}
