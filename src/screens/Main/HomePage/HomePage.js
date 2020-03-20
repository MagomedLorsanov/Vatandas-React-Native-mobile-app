import React, { Component } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  ActivityIndicator,
  YellowBox
} from "react-native";
import { Header, Button, Icon } from "react-native-elements";
import firebase from "firebase";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import DropdownAlert from "react-native-dropdownalert";
import ReactNativePickerModule from "react-native-picker-module";
import NotificationPopup from 'react-native-push-notification-popup';
import moment from 'moment';

import PostComponent from "./PostComponent";

import colors from "../../../constants/colors";

import styles from "./Stylesheet";

class HomePage extends Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
    this.state = {
      isEmergency: false,
      selectedCity: null,
      loading: true,
      cities: ["Eskisehir", "Ankara", "Istanbul", "Izmir", "Bursa"],
      customPosts: null,
      activeUserEmail: null,
      activeUserId: null,
      activeUserName: null,
      activeUserSurname: null,
      posts: [],
      backKey: "backKey",
      newNotification: null,
    };
    _isMounted = false;
  }

  handleOnNavigateBack = (backKey) => {
    this.setState({
      backKey
    })
  }

 

  _handleLocation = async () => {
    if(this._isMounted){
    await AsyncStorage.getItem("userToken", (err, item) => {
      this.setState({ activeUserEmail: item }, () => {
        const that = this;
        firebase
          .firestore()
          .collection("users")
          .where("userEmail", "==", this.state.activeUserEmail.toString())
          .get()
          .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
              if(that._isMounted){
                that.setState({
                  selectedCity: doc.data().userLocation,
                  activeUserId: doc.id,
                  activeUserName: doc.data().firstName,
                  activeUserSurname: doc.data().lastName
                },() => that.setState({ loading: false }));
              }
            });
          })
          .catch(function(error) {
            console.log("Error getting documents: ", error);
          });
      });
    });
  }
  };

  _showNotif = notif => {
    this.popup.show({
      appTitle: 'Vatandas APP',
      timeText: "Now",
      title: notif.user,
      body: notif.content,
    });
  }

  componentWillMount() {
    this._isMounted = true;
    this._handleLocation();
  }
  componentWillUnmount(){
    this._isMounted = false
  }


  componentDidUpdate(prevProps) {
    if (prevProps.notifications !== this.props.notifications) {
      if(this._isMounted){
        this.setState({
          newNotification: this.props.notifications[0]
        },() => this._showNotif(this.state.newNotification))
      }
    }
  }
  


  render() {
    return (
      <View style={styles.container}>
        <Header
          backgroundColor={this.state.isEmergency ? 'red' : colors.white}
          centerComponent={
            <View>
              <Button
                disabled={this.state.loading}
                title={
                  this.state.selectedCity
                    ? this.state.selectedCity
                    : "Select a City"
                }
                type="clear"
                titleStyle={{
                  color: this.state.isEmergency ? colors.white : 'black',
                  paddingHorizontal: "4%"
                }}
                onPress={() => this.cityPickerRef.show()}
                icon={
                  <Icon
                    name="city"
                    size={22}
                    color={this.state.isEmergency ? colors.white : 'black'}
                    type="material-community"
                  />
                }
              />
            </View>
          }
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                this.setState({ isEmergency: !this.state.isEmergency })
              }
            >
              <Icon
                type="material-community"
                color={this.state.isEmergency ? colors.white : 'black'}
                name="alarm-light"
              />
            </TouchableOpacity>
          }
          rightComponent={
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("NewPost", {
                  firstName: this.state.activeUserName,
                  lastName: this.state.activeUserSurname,
                  userId: this.state.activeUserId,
                  userLocation: this.state.selectedCity,
                  onNavigateBack: this.handleOnNavigateBack
                })
              }
            >
              <Icon type="material" color={this.state.isEmergency ? colors.white : 'black'} name="add-box" />
            </TouchableOpacity>
          }
        />


        {!this.props.posts ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 60
            }}
          >
            <ActivityIndicator size="large" color={colors.mainTheme} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
            {this.state.isEmergency
              ? this.props.posts &&
                this.props.posts.map((post, index) => {
                  if (
                    post.postLocation == this.state.selectedCity &&
                    post.postType == "Emergency"
                  ) {
                    return <PostComponent post={post} key={index} />;
                  }
                })
              : this.props.posts &&
                this.props.posts.map((post, index) => {
                  if (post.postLocation == this.state.selectedCity) {
                    if (post.postType == "Emergency") {
                      return <View key={index} />;
                    }
                    return <PostComponent post={post} key={index} />;
                  }
                })}
          </ScrollView>
        )}
        <ReactNativePickerModule
          pickerRef={e => (this.cityPickerRef = e)}
          title={"Select a City"}
          items={this.state.cities}
          onValueChange={(value, index) => {
            this.setState(
              {
                selectedCity: value.toString()
              },
              () => {
                firebase
                  .firestore()
                  .collection("users")
                  .doc(this.state.activeUserId)
                  .update({
                    userLocation: this.state.selectedCity
                  });
              }
            );
          }}
        />
        <NotificationPopup ref={ref => this.popup = ref} />
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </View>
    );
  }
}

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
)(HomePage);
