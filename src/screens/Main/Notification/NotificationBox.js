import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Icon } from 'react-native-elements';
import CardView from 'react-native-cardview';
import moment from 'moment';

import colors from '../../../constants/colors';

const {height, width} = Dimensions.get('window');

export default class NotificationBox extends Component {
  render() {

    let {
      content,
      user,
      time
    } = this.props.item;

    return (
      <View style={styles.container}>
        <View style={styles.cardContainer}>
            <CardView
                cardElevation={7}
                cardMaxElevation={6}
                cornerRadius={10}
            >
            <View style={styles.cardContent}>
               
                <Text style={styles.cardTitle}>{user}</Text>
              
                <Text style={styles.cardTitle}>{content}</Text>
                <Icon 
                    name="alert"
                    size={22}
                    color={colors.white}
                    type={'material-community'}
                />
            </View>
            </CardView>
        </View>
      </View>
    )
  }
}


const styles = StyleSheet.create({
    container: {
        height: height/8,
        width: width/1.1,
        alignSelf: 'center'
    },
    cardContainer:{
    },
    cardContent:{
        flexDirection: 'row',
        paddingVertical: '4%',
        justifyContent: 'space-between',
        backgroundColor: colors.notifColor,
        paddingHorizontal: '4%'
    },
    cardTitle:{
        fontFamily: 'Muli-Bold',
        color: colors.white,
    },
})