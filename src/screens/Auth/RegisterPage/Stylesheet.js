import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

let { width, height } = Dimensions.get('window');

import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.mainTheme,
        justifyContent: 'center',
    },
    textInputs: {
        width: '90%',
        height: 400,
        alignSelf: 'center',
        borderRadius: 10
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.white,
        textAlign: 'center',
        padding: '2%'
    },
    registerLink:{
        color: colors.white,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    registerBody:{
        marginTop: '4%'
    }
});

module.exports = styles;