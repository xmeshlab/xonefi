import React, {Component, useState} from 'react';
import { Text, View, Switch, TextInput, TouchableOpacity} from 'react-native';
import { globalStyles } from '../styles/globalStyle' 
import Icon from 'react-native-vector-icons/Ionicons'

export default class Payment extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isTimeEnabled: true,
            isDataEnabled: true,
            // For the time and data, the type is of string to allow for 
            // input in the text fields
            maxTime: '456',
            maxData: '123', 
            accountBalance: 456,
            frozenBalance: 123,
            availableBalance: 987 
        }
    }

    changeMaxTime(time) {
        this.state.setState({maxTime: time})
    }

    render() {
        return (
        <View style = {globalStyles.pageBackground}>

            
            <View style={{alignItems: 'baseline',justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
                <View style = {globalStyles.headerContainer}>
                    <Text style = {globalStyles.headerText}>PAYMENT</Text>
                </View>
                <View style = {{flexDirection: 'row'}}>
                    <Text style = {globalStyles.basicText}>Pay For Time: </Text>
                    <Switch
                        trackColor = {{false: 'gray', true: '#f4623a'}}
                        thumbColor={this.state.isTimeEnabled ? "orange" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        value={this.state.isTimeEnabled}
                        onValueChange={(isTimeEnabled) => this.setState({isTimeEnabled: isTimeEnabled})}

                    />
                </View>
                <View style = {{flexDirection: 'row'}}>
                    <Text style = {globalStyles.basicText}>Pay For Data: </Text>
                    <Switch
                        trackColor = {{false: 'gray', true: '#f4623a'}}
                        thumbColor={this.state.isDataEnabled ? "orange" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        value={this.state.isDataEnabled}
                        onValueChange={(isDataEnabled) => this.setState({isDataEnabled: isDataEnabled})}
                    />
                </View>

                <View style = {{flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', margin: '1%'}}>
                    <Icon name = 'alarm-outline' style = {globalStyles.basicIcon}></Icon>
                    <Text style = {[globalStyles.basicText, {paddingRight: '2.5%'}]}>Max. OFI/Hr</Text>
                    <TextInput
                        style = {globalStyles.formInput}
                        keyboardType={'numeric'}
                        defaultValue = {this.state.maxTime}
                        editable = {this.state.isTimeEnabled}
                    />
                </View>


                <View style = {{flexDirection: 'row', margin: '1%'}}>
                <Icon name = 'analytics-outline' style = {globalStyles.basicIcon}></Icon>
                    <Text style = {globalStyles.basicText}>Max. OFI/Mb</Text>

                    {/*Todo: Implement functions for changing state values from Text Input*/}
                    <TextInput
                        style = {globalStyles.formInput}
                        keyboardType={'numeric'}
                        defaultValue = {this.state.maxData}
                        editable = {this.state.isDataEnabled}
                    />
                </View>
                <TouchableOpacity style = {globalStyles.basicButton} activeOpacity={0.5}>
                    <Text style = {globalStyles.buttonText}>Save Settings</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {globalStyles.basicButton} activeOpacity={0.5} >
                    <Text style = {globalStyles.buttonText}>Update Balances</Text>
                </TouchableOpacity>
                <Text style = {globalStyles.basicText}>Account Balance: {this.state.accountBalance} OFI</Text>
                <Text style = {globalStyles.basicText}>Frozen Balance: {this.state.frozenBalance} OFI</Text>
                <Text style = {globalStyles.basicText}>Available Balance: {this.state.availableBalance} OFI</Text>
            </View>
        </View>
        );
    }
}