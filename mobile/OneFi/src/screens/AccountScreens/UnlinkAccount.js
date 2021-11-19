import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'

import { Text, View, TouchableOpacity} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { globalStyles } from '../../styles/globalStyle';

export default class UnlinkAccount extends Component{
    
    

    render() {
        const {goBack} = this.props.navigation
        return (   
        <View style = {globalStyles.pageBackground}>
            <View style = {globalStyles.headerContainer}>
                <Text style = {globalStyles.headerText}>UNLINK ACCOUNT</Text>
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center' }}>
                <Text style = {globalStyles.basicText}>
                    If you have not saved your private key, this account will be lost forever
                    with all funds stored in it. If you have your private key stored, you will be able to restore this
                    account on any device. By confirming deletion of this account, you agree to permanetly erase the
                    stored private key from this device.
                </Text>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Done Unlink Account")}> 
                    <Text style = {globalStyles.buttonText}>Unlink</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Account")}> 
                    <Text style = {globalStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>

        </View>
        );
    }
}