import {StyleSheet} from 'react-native'

// Used to control the size of the fonts through out the application

// Font Constants
const FONT_SIZE = 20
const FONT_FAMILY = 'sans-serif-thin'
const FONT_FAMILY_HIGHLIGHT = 'sans-serif'

// Color Constants
const WHITE = '#ffffff'
const BLACK = '#000000'
const GRAY = '#5f5f5f'
const ORANGE = '#f4623a'

export const globalStyles = StyleSheet.create({

    // Page Styles
    pageBackground: {
        backgroundColor: WHITE,
        flex: 1,
    },

    // Container Styles
    headerContainer: {
        backgroundColor: ORANGE,
        //flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        height: "10%",
        width: '100%'
    },

    // Text Styles
    basicText: {
        fontFamily: FONT_FAMILY,
        color: GRAY,
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    highlightText : {
        fontFamily: FONT_FAMILY_HIGHLIGHT,
        color: GRAY,
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center'
    },
    headerText: {
        fontFamily: FONT_FAMILY,
        color: WHITE,
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center'
    },

    buttonText: {
        fontFamily: FONT_FAMILY, 
        color: WHITE,
        fontSize: 23,
        fontWeight: 'bold',
        letterSpacing: 2,
    },

    accountKeyText: {
        backgroundColor: WHITE, 
        borderColor: BLACK, 
        borderWidth: 2, 
        padding: 5, 
        alignContent: 'center', 
        borderRadius: 10
    },

    // Icon Styles
    basicIcon: {
        color: ORANGE,
        fontSize: 50,
        textAlign: 'center',
        textAlignVertical: 'center'
    },

    // Button Styles
    connectionButton: {
        //height: 200,
        //width: 200,
        //borderRadius: 100,
        height: "35%",
        width: '45%',
        borderRadius: 400,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    basicButton: {
        backgroundColor: ORANGE,
        //height: '10%',
        height: 35,
        width: '95%',
        borderRadius: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center', 
        marginTop: 7,
        marginBottom: 7,
    },

    // Input Box Styles
      formInput: {
        flex: 1,
        backgroundColor: WHITE,
        borderWidth: 4,
        borderColor: ORANGE,
        paddingRight: 10,
        paddingLeft: 10,
        margin: 1,
        fontSize: FONT_SIZE,
        borderRadius: 15,
        marginLeft: 7,
        marginRight: 7
      }
})