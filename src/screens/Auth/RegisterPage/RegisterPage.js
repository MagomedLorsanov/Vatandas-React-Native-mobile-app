import React, { Component } from "react";
import { Image, View, ScrollView, AsyncStorage, YellowBox } from "react-native";
import {  Text, Button, Icon, Input  } from "react-native-elements";
import RNFetchBlob from "react-native-fetch-blob";
import { connect } from 'react-redux';
import ImagePicker from "react-native-image-picker";
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/blue";
import firebase from "firebase";
import ReactNativePickerModule from "react-native-picker-module";
import DropdownAlert from "react-native-dropdownalert";

import styles from "./Stylesheet";

import colors from "../../../constants/colors";

class RegisterPage extends Component {
  constructor(props) {
    super(props);
    YellowBox.ignoreWarnings(["Setting a timer"]);
    this.state = {
      userEmail: null,
      userPassword: null,
      userImage: null,
      firstName: null,
      lastName: null,
      biography: null,
      initials: null,
      userRole: "Individual",
      userOrganization: null,
      phoneNumber: null,
      userLocation: null,
      selectedCity: null,
      cities: ["Eskisehir", "Ankara", "Istanbul", "Izmir", "Bursa"],
      addedDocId: null
    };
    _isMounted = false;
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  _createUser = () => {
    let that = this;

    firebase.auth().createUserWithEmailAndPassword(
      this.state.userEmail,
      this.state.userPassword
  ).then(resp => {
      that.setState({ addedDocId : resp.user.uid })
      return firebase.firestore().collection('users').doc(resp.user.uid).set({
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          biography: this.state.biography,
          userEmail: this.state.userEmail,
          initials: this.state.firstName[0] + this.state.lastName[0],
          userRole: this.state.userRole,
          userOrganization: this.state.userOrganization,
          phoneNumber: this.state.phoneNumber,
          userLocation: this.state.selectedCity
      })
      
  }).then(() => {
    that._handleImageUpload();
  }).catch( err => {
    this.dropdown.alertWithType("error", "Error", err.message);
  })

  };

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, response => {
      let source = { uri: response.uri };
      this.setState({ userImage: source })
    });
  }

  _updateStore = (userId,imageURL) => {
    firebase.firestore()
        .collection("users")
        .doc(userId)
        .update({
           authorAvatarURL: imageURL
        });
  }

  _handleImageUpload = () => {
    const image = this.state.userImage.uri;

    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    let uploadBlob = null;
    let that = this;
    const sessionId = new Date().getTime();
    const imageRef = firebase
      .storage()
      .ref("images/")
      .child(`${sessionId}`);
    let mime = "image/jpg";
    fs.readFile(image, "base64")
      .then(data => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then(blob => {
        uploadBlob = blob;
        return imageRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return imageRef.getDownloadURL();
      })
      .then(url => {
        that.setState({ authorAvatarURL: url }, () => {

          that._updateStore(that.state.addedDocId,that.state.authorAvatarURL);

          if (this._isMounted) {
            this.dropdown.alertWithType(
              "success",
              "Success",
              "Successfully Registered"
            );
          }

          const keyId = new Date().getTime();
          this.props.navigation.navigate({
            routeName: "LoginPage",
            key: keyId
          });
          
        });
      })
      .catch(error => {
        this.dropdown.alertWithType("error", "Error", error.message);
      });
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUpdate() {
    this._isMounted = false;
  }

  render() {
    return (
      <View style={styles.containerMain}>
      <ScrollView contentContainerStyle={{ flexGrow: 1}}>

      

      <Text h3 style={{ textAlign: 'center'}}>REGISTRATION</Text>
       
        <View style={styles.formBody}>
          <Input
            placeholder="Email"
            multiline
            onChangeText={input => this.setState({ userEmail: input })}
          />
          <Input
            placeholder="First Name"
            multiline
            onChangeText={input => this.setState({ firstName: input })}
          />
          <Input
            placeholder="Last Name"
            multiline
            onChangeText={input => this.setState({ lastName: input })}
          />
          <Input
            placeholder="Biography"
            multiline
            onChangeText={input => this.setState({ biography: input })}
          />
          <Input
            placeholder="Phone Number"
            multiline
            onChangeText={input => this.setState({ phoneNumber: input })}
          />
           <Input
            placeholder="Password"
            multiline
            secureTextEntry
            onChangeText={input => this.setState({ userPassword: input })}
          />
        

          <Button
            icon={<Icon name="city" type="material-community" color="white" />}
            onPress={() => this.cityPickerRef.show()}
            title={this.state.selectedCity ? this.state.selectedCity : "Choose a City"}
            style={{ width: "40%", alignSelf: "center" }}
            containerStyle={{ paddingVertical: "4%" }}
          />

          <Button
            icon={<Icon name="photo-camera" type="material" color="white" />}
            onPress={this.selectPhotoTapped.bind(this)}
            title="Take a Photo"
            style={{ width: "40%", alignSelf: "center" }}
            containerStyle={{ paddingVertical: "4%" }}
          />

          <View
            style={[
              styles.avatar,
              styles.avatarContainer,
            ]}
          >
            {this.state.userImage === null ? (
              <Text style={{ textAlign: 'center'}}>No Image Selected</Text>
            ) : (
              <Image style={styles.avatar} source={this.state.userImage} />
            )}
          </View>

          <AwesomeButtonRick
            type="primary"
            progress
            style={{ alignSelf: "center" }}
            width={140}
            onPress={next => {
              this._createUser();
              next();
            }}
          >
            Create Post
          </AwesomeButtonRick>
        </View>
        <ReactNativePickerModule
          pickerRef={e => (this.cityPickerRef = e)}
          title={"Select a City"}
          items={this.state.cities}
          onValueChange={(value, index) => {
            this.setState(
              {
                selectedCity: value.toString()
              }
            );
          }}
        />
        </ScrollView>
        <DropdownAlert ref={ref => (this.dropdown = ref)} />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

export default connect(
  mapStateToProps,
  null
)(RegisterPage);

