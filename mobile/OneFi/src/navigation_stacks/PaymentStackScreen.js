import React, { Component } from 'react';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Payment from '../screens/Payment';

export default class PaymentStackScreen extends Component {
    
    render() {
        const PaymentStack = createStackNavigator()
        return (
            <PaymentStack.Navigator screenOptions={{headerShown: false}}>
                <PaymentStack.Screen name = "Payment" component = {Payment}/>
            </PaymentStack.Navigator> 
        )
    }
}