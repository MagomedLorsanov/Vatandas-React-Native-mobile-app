import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';

import colors from '../../../constants/colors';

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: colors.mainTheme,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logoText: {
        fontSize: 16,
        color: colors.white
    }
});

module.exports = styles;