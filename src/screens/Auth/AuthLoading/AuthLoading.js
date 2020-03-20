import React, { Component } from 'react';
import { Text, View, ActivityIndicator, YellowBox } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './Stylesheet';

export default class AuthLoading extends Component {

  
  constructor(props){
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
  }

  async componentDidMount(){
    let token = await AsyncStorage.getItem('userToken');
  
   if(token){
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.navigate('LoginPage');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.logoText}>VATANDAŞ</Text>
        <ActivityIndicator size="large" color="lightblue" />
      </View>
    )
  }
}
