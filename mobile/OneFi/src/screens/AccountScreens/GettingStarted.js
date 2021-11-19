import React, { Component } from 'react';

import Icon from 'react-native-vector-icons/Ionicons'

import { Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

import { globalStyles } from '../../styles/globalStyle';

export default class GettingStarted extends Component{
    
    

    render() {
        const {goBack} = this.props.navigation
        return (   
        <View style = {globalStyles.pageBackground}>
            <View style = {globalStyles.headerContainer}>
                <Text style = {globalStyles.headerText}>GETTING STARTED</Text>
            </View>

            <View style={{alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity style = {globalStyles.basicButton}> 
                    <Text style = {globalStyles.buttonText} onPress = {() => this.props.navigation.navigate("Help Account")}>Your Account?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton}> 
                    <Text style = {globalStyles.buttonText}>How Payment Works?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton}> 
                    <Text style = {globalStyles.buttonText}>How To Connect?</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => goBack()}> 
                    <Text style = {globalStyles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>

        </View>
        );
    }
}