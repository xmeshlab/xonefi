import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  Home from '../screen/home'
import  List from '../screen/list'
import  Dashboard from '../screen/dashboard'



const AppStack = createStackNavigator();
export default function Navigator(){

    return (
    <NavigationContainer>
    <AppStack.Navigator screenOptions={{ headerShown: true }} >
    <AppStack.Screen name="Home" component={Home} />
    <AppStack.Screen name="List" component={List} />
    <AppStack.Screen name="Dashboard" component={Dashboard} />
    </AppStack.Navigator>

    </NavigationContainer>
    );
}