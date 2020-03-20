import React from 'react';
import { Dimensions, StyleSheet, PixelRatio } from 'react-native';

import colors from '../../../constants/colors';

let { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    formBody:{
        margin: '4%',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
      },
      avatarContainer: {
        borderColor: '#9B9B9B',
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center'
      },
      avatar: {
        width: 150,
        height: 150,
      },
});

module.exports = styles;