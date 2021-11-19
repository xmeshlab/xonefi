import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { globalStyles } from '../styles/globalStyle';


export default class YourAccountText extends Component {

    render(){

        return (
            <View style = {globalStyles.pageBackground}>
            {/* Should be okay to use ScrollView instead of FlatList */}
            <ScrollView>
                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight: '2%'}]}>
                    To use OneFi, you need a crypto account. Crypto accounts are 
                    <Text style = {globalStyles.highlightText}> different </Text>
                    from traditional online accounts. Please read 
                    <Text style = {globalStyles.highlightText}> carefully </Text>
                    the following information before generating or importing an account.
                </Text>

                <Text></Text>

                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight:'2%'}]}>
                    - Your account is 
                    <Text style = {globalStyles.highlightText}> not </Text>
                    stored remotely on some server. Your account can produce a trace of online transactions, 
                    but its credentials are generated and stored by you.
                </Text>

                <Text></Text>

                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight:'2%'}]}>
                    - Your account is a random private key that you 
                    <Text style = {globalStyles.highlightText}> must keep in secret</Text>
                    .
                </Text>

                <Text></Text>

                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight:'2%'}]}>
                    - If you lose your private key, you lose your account. 
                    There is no "private key reset" function.
                </Text>

                <Text></Text>

                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight:'2%'}]}>
                    - Who knows the private key of your account effectively owns your account, and 
                    there is no way to reverse this.
                </Text>

                <Text></Text>

                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight:'2%'}]}>
                    - OneFi asks you for a password to encrypt and decrypt your private key. This password
                    is used only locally for secure storage of your private key, and it 
                    <Text style = {globalStyles.highlightText}> does not </Text>
                    allow you to access your account online or on another computer
                </Text>

                <Text></Text>

                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight:'2%'}]}>
                    - If you do not have an account, OneFi Manager will secruly generate one for you.
                </Text>

                <Text></Text>

                <Text style = {[globalStyles.basicText, {textAlign: 'left', paddingLeft: '2%', paddingRight:'2%'}]}>
                    - If you already have an accout, you can import it using the private key of this account.
                </Text>
                
            </ScrollView>

        </View>
        )
    }
}
const styles = StyleSheet.create({
    boldText: {
        fontWeight: 'normal'
    }
})