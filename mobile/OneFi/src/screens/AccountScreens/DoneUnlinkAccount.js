import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'

import { Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { globalStyles } from '../../styles/globalStyle';

export default class DoneUnlinkAccount extends Component{
    
    

    render() {
        const {goBack} = this.props.navigation
        return (   
        <View style = {globalStyles.pageBackground}>
            <View style = {globalStyles.headerContainer}>
                <Text style = {globalStyles.headerText}>DONE</Text>
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center' }}>
                <Text style = {globalStyles.basicText}>
                    Your Account has been unlinked. 
                </Text>
                <Text style = {globalStyles.basicText}>
                    You are all set!
                </Text>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Account")}> 
                    <Text style = {globalStyles.buttonText}>Exit</Text>
                </TouchableOpacity>
            </View>

        </View>
        );
    }
}