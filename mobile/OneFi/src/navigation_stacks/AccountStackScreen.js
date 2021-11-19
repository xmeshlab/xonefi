import React, { Component } from 'react';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Account from '../screens/Account';
import GettingStarted from '../screens/AccountScreens/GettingStarted';

import GenerateAccount from '../screens/AccountScreens/GenerateAccount';
import HelpAccount from '../screens/AccountScreens/HelpAccount';
import SaveAccount from '../screens/AccountScreens/SaveAccount';
import DoneAccount from '../screens/AccountScreens/DoneAccount';
import ImportAccount from '../screens/AccountScreens/ImportAccount';
import UnlinkAccount from '../screens/AccountScreens/UnlinkAccount';
import DoneUnlinkAccount from '../screens/AccountScreens/DoneUnlinkAccount';

export default class AccountStackScreen extends Component {
    
    render() {
        const AccountStack = createStackNavigator()
        return (
            <AccountStack.Navigator screenOptions={{headerShown: false}}>
                <AccountStack.Screen name = "Account" component = {Account}/>
                <AccountStack.Screen name = "Getting Started" component = {GettingStarted}/>
                <AccountStack.Screen name = "Generate Account" component = {GenerateAccount} />
                <AccountStack.Screen name = "Help Account" component = {HelpAccount} />
                <AccountStack.Screen name = "Save Account" component = {SaveAccount} />
                <AccountStack.Screen name = "Done Account" component = {DoneAccount} />
                <AccountStack.Screen name = "Import Account" component = {ImportAccount} />
                <AccountStack.Screen name = "Unlink Account" component = {UnlinkAccount} />
                <AccountStack.Screen name = "Done Unlink Account" component = {DoneUnlinkAccount} />
            </AccountStack.Navigator> 
        )
    }

}