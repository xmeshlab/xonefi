import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'

import { Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { globalStyles } from '../../styles/globalStyle';

export default class ImportAccount extends Component{
    
    

    render() {
        const {goBack} = this.props.navigation
        return (   
        <View style = {globalStyles.pageBackground}>
          

            <View style={{alignItems: 'center', justifyContent: 'center'}}>

                <View style = {globalStyles.headerContainer}>
                    <Text style = {globalStyles.headerText}>IMPORT ACCOUNT</Text>
                </View>

                <Text style = {globalStyles.basicText}>Enter Private Key</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: '1%'}}> 
                    <TextInput style={globalStyles.formInput}></TextInput>
                </View>

                <Text style = {globalStyles.basicText}>Enter Password</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: '1%'}}> 
                    <TextInput style={globalStyles.formInput}></TextInput>
                </View>

                
                <Text style = {globalStyles.basicText}>Re-Enter Password</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: '1%'}}> 
                    <TextInput style={globalStyles.formInput}></TextInput>
                </View>

                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Save Account")}> 
                    <Text style = {globalStyles.buttonText}>Import</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Account")}> 
                    <Text style = {globalStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>

        </View>
        );
    }
}