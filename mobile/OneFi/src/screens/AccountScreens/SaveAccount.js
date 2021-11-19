import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'

import { Text, View, Button, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { globalStyles } from '../../styles/globalStyle';

export default class SaveAccount extends Component{
    
    

    render() {
        const {goBack} = this.props.navigation
        return (   
        <View style = {globalStyles.pageBackground}>
            <View style = {globalStyles.headerContainer}>
                <Text style = {globalStyles.headerText}>SAVE ACCOUNT</Text>
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center' }}>

            <Text style = {globalStyles.basicText}>Address</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: '1%'}}> 
                    <TextInput style={globalStyles.formInput} editable = {false} ></TextInput>
                </View>

                <Text style = {globalStyles.basicText}>Private Key</Text>
                <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: '1%'}}> 
                    <TextInput style={globalStyles.formInput} editable = {false}></TextInput>
                </View>


                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Done Account")}> 
                    <Text style = {globalStyles.buttonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Account")}> 
                    <Text style = {globalStyles.buttonText}>Cancel</Text>
                </TouchableOpacity>
            </View>

        </View>
        );
    }
}