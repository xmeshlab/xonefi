import React, { Component } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'
import { globalStyles } from '../styles/globalStyle';

import { GettingStarted } from '../screens/AccountScreens/GettingStarted';



export default class Account extends Component{

    constructor(props) {
        
        super(props)
        this.state = {
            // Todo: Research the security of state variables in react native
            //      May need to figure something out about the account key
            accountKey: '123456789abcdef123'
        }
    }

    /**
     * Set up logic to hid certain buttons based on 
     * the status of the account
     * Ex: Don't display unlink account until an account has 
     * been created
     */
    
    render(){
        return (
        <View style={globalStyles.pageBackground}>
            <View style = {globalStyles.headerContainer}>
                <Text style = {globalStyles.headerText}>ACCOUNT</Text>
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center' }}>
                {/* Eventually make this go to its own page not in the bottom tab */}
                {/* https://reactnavigation.org/docs/tab-based-navigation/ */}
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Getting Started")}> 
                    <Text style = {globalStyles.buttonText} >Getting Started</Text>
                </TouchableOpacity>
                <View style = {{flexDirection: 'row'}}>
                <Icon name = 'person' style = {globalStyles.basicIcon}></Icon>
                    <Text style = {globalStyles.basicText}>Account</Text>
                </View>
                <Text style = {globalStyles.accountKeyText}>0x{this.state.accountKey}</Text>

                {/* Have a button similar to the eye on password inputs to hide and show hex value*/}
                {/* Security concerns with data being on front end, how to blur? Is it a concern for the key to be here */}
                <TouchableOpacity style = {globalStyles.basicButton}> 
                    <Text style = {globalStyles.buttonText}>Show Account ID</Text>
                </TouchableOpacity>

                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Generate Account")}> 
                    <Text style = {globalStyles.buttonText} >Generate New Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Import Account")}> 
                    <Text style = {globalStyles.buttonText} >Import Account</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton}> 
                    <Text style = {globalStyles.buttonText}>Export Private Key </Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => this.props.navigation.navigate("Unlink Account")}> 
                    <Text style = {globalStyles.buttonText}>Unlink Account</Text>
                </TouchableOpacity>
            </View>
        </View>
        
        );
    }
}