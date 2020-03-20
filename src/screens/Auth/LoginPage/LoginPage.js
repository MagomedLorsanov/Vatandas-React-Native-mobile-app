import React, { Component } from 'react'
import { View, TouchableOpacity, ActivityIndicator, AsyncStorage,YellowBox } from 'react-native'
import DropdownAlert from 'react-native-dropdownalert';
import { Kohana } from 'react-native-textinput-effects';
import { Text } from 'react-native-elements';
import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/blue';
import MaterialsIcon from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';
import { signIn } from '../../../store/actions/authActions';
import firebase from 'firebase';

import colors from '../../../constants/colors';
import styles from './Stylesheet';

class LoginPage extends Component {

  constructor(props){
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
    this.state= {
      email: null,
      password: null,
      loading: false
    }
    _isMounted = false;
  }

  componentDidMount(){
    this._isMounted = true;
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  _handleLoginAction = async() => {


    const { email, password } = this.state;

    this.setState({ loading: true });

    this.props.signIn(this.state)

    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        if(this._isMounted){
        this.setState({ loading: false });
        AsyncStorage.setItem('userToken', email);
        this.props.navigation.navigate('Home');
      }
      })
      .catch(error => {
        this.setState({ loading: false });
        this.dropdown.alertWithType('error', 'Error', error.message);
      })
  }


  render() {

   
    return (
      <View style={styles.container}>
        {
          this.state.loading
          ?
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size="large" color={colors.white}/>
          </View>
          :
          <View>
            <Text h1 style={{ color: '#fff', textAlign: 'center'}}>VATANDAŞ</Text>
        <Text style={styles.logoText}>Login</Text>
        <View style={styles.loginBody}>
        <View style={styles.textInputs}>
          <Kohana
            style={{ backgroundColor: '#f9f5ed' }}
            label={'Username'}
            onChangeText={val => this.setState({ email: val})}
            iconClass={MaterialsIcon}
            iconName={'account-box'}
            iconColor={'#f4d29a'}
            inputPadding={16}
            labelStyle={{ color: '#91627b' }}
            inputStyle={{ color: '#91627b' }}
            labelContainerStyle={{ padding: 20 }}
            iconContainerStyle={{ padding: 20 }}
            useNativeDriver
          />
          <Kohana
            style={{ backgroundColor: '#f9f5ed' }}
            label={'Password'}
            onChangeText={val => this.setState({ password: val})}
            iconClass={MaterialsIcon}
            iconName={'vpn-key'}
            iconColor={'#f4d29a'}
            inputPadding={16}
            labelStyle={{ color: '#91627b' }}
            inputStyle={{ color: '#91627b' }}
            labelContainerStyle={{ padding: 20 }}
            iconContainerStyle={{ padding: 20 }}
            useNativeDriver
            secureTextEntry
          />
        
        
        </View>
        
         
     <AwesomeButtonRick
        type="primary"
        progress
        style={{ alignSelf: 'center'}}
        width={140}
        onPress={next => {
          this._handleLoginAction();
          next();
        }}
      >
      Login
      </AwesomeButtonRick>
        </View>
        <View style={styles.registerBody}>
        <Text style={styles.registerLink}>Don't Have Account Yet?</Text>
        <TouchableOpacity onPress={() => this.props.navigation.navigate('RegisterPage')}>
          <Text style={[styles.registerLink, {color: 'orange'}]}>Register Here</Text>
        </TouchableOpacity>
        </View>
        </View>
        }
        <DropdownAlert ref={ref => this.dropdown = ref} />
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
      authError: state.auth.authError,
      auth: state.firebase.auth,
      authResult: state.auth
  }
}


const mapDispatchToProps = dispatch => {
  return {
      signIn: creds => dispatch(signIn(creds))
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(LoginPage);
