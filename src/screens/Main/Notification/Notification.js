import React, { Component } from 'react';
import { 
    View,
    ScrollView, 
    ActivityIndicator , 
    YellowBox,
    StyleSheet 
} from 'react-native';
import { Header, Text} from 'react-native-elements';
import firebase from "firebase";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";

import colors from '../../../constants/colors';

import NotificationBox from './NotificationBox';

class Notification extends Component {

  constructor(props){
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
  }


  

    
  render() {
    return (
        <View style={styles.container}>
        <Header 
          backgroundColor={colors.mainTheme}
          centerComponent={
              <Text style={{ color: colors.white }}>Notifications</Text>
          }
        >
        </Header>
        
            <View style={{ flex: 1,marginTop: 20}}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {
                  this.props.notifications ?
                  this.props.notifications.map((item,index) => {
                    return <NotificationBox item={item} key={index} />
                  })
                  :
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator size="large" color={colors.mainTheme}/>
                  </View>
                }
            </ScrollView>
            </View>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})


const mapStateToProps = state => {
  return {
    posts: state.firestore.ordered.posts,
    auth: state.firebase.auth,
    notifications: state.firestore.ordered.notifications,
    firebase: state.firebase,
    activeUser: state.auth.activeUser
  };
};

export default compose(
  connect(mapStateToProps),
  firestoreConnect([
    { collection: "posts", orderBy: ["createdAt", "desc"] },
    {
      collection: "notifications",
      orderBy: ["time", "desc"]
    }
  ])
)(Notification);