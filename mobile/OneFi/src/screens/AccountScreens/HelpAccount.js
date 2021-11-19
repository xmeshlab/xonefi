import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import {NavigationContainer, useNavigation } from '@react-navigation/native';
import YourAccountText from '../../texts/YourAccountText';
import { globalStyles } from '../../styles/globalStyle';


export default class HelpAccount extends Component{

    constructor(props) {
        super(props)
        this.state = {
            x: 0
        }
    }

    
    render(){
        const {goBack} = this.props.navigation
        return (
            <View style = {globalStyles.pageBackground}>
            <View style = {globalStyles.headerContainer}>
                <Text style = {globalStyles.headerText}>ACCOUNT HELP</Text>
            </View>
            {/* Should be okay to use ScrollView instead of FlatList */}
            <YourAccountText></YourAccountText>

            <View style = {{alignItems: 'center', justifyContent: 'center' }} >
                <TouchableOpacity style = {globalStyles.basicButton} onPress = {() => goBack()}> 
                    <Text style = {globalStyles.buttonText}>Back</Text>
                </TouchableOpacity>
            </View>

        </View>
        )
    }
}
const styles = StyleSheet.create({
    boldText: {
        fontWeight: 'normal'
    }
})