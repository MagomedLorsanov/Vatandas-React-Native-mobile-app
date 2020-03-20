import React, { Component } from "react";
import { Image, Text, View, TouchableOpacity, Keyboard } from "react-native";
import { Header, Button, Icon, Input, CheckBox } from "react-native-elements";
import RNFetchBlob from "react-native-fetch-blob";
import { connect } from 'react-redux';
import ImagePicker from "react-native-image-picker";
import AwesomeButtonRick from "react-native-really-awesome-button/src/themes/blue";
import firebase from "firebase";
import DropdownAlert from "react-native-dropdownalert";

import styles from "./Stylesheet";

import colors from "../../../constants/colors";

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postImage: null,
      postImageURL: "",
      checked1: false,
      checked2: false,
      checked3: false,
      postImage: null,
      title: "",
      content: "",
      postImageURL: "",
      postType: "Emergency",
      postStatus: "Issues",
      postLocation: "Eskisehir"
    };
    _isMounted = false;
    this.selectPhotoTapped = this.selectPhotoTapped.bind(this);
  }

  _createPost = () => {
    firebase
      .firestore()
      .collection("posts")
      .add({
        title: this.state.title,
        content: this.state.content,
        postImageURL: this.state.postImageURL,
        postType: this.state.checked1
          ? "Emergency"
          : this.state.checked2
          ? "Complaint"
          : "Advice",
        postStatus: "Issues",
        postLocation: this.props.navigation.getParam("userLocation", null),
        authorFirstName: this.props.navigation.getParam("firstName", null),
        authorLastName: this.props.navigation.getParam(
          "lastName",
          null
        ),
        authorId: this.props.navigation.getParam("userId", null),
        createdAt: new Date(),
        postImportance: 1
      })
      .then(addedDoc => {
        this.setState({ addedDocId : addedDoc.id },() => {
          this._handleImageUpload();
        })
      })
      .catch(err => {
        this.dropdown.alertWithType("error", "Error", err.message);
      });
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

    ImagePicker.launchCamera(options, response => {
      let source = { uri: response.uri };
      this.setState({ postImage: source })
    });
  }

  _updateStore = (postId,imageURL) => {
    firebase.firestore()
        .collection("posts")
        .doc(postId)
        .update({
           postImageURL: imageURL
        });
  }

  _handleImageUpload = () => {
    const image = this.state.postImage.uri;

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
        that.setState({ postImageURL: url }, () => {

          that._updateStore(that.state.addedDocId,that.state.postImageURL);

          if (this._isMounted) {
            this.dropdown.alertWithType(
              "success",
              "Success",
              "Successfully Created a Post"
            );
          }

          
          const keyId = new Date().getTime();
          this.props.navigation.navigate({
            routeName: "HomeIndex",
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
        <Header
          leftComponent={
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate({
                  routeName: "HomeIndex",
                  key: "newKeys"
                })
              }
            >
              <Icon name="arrow-back" size={32} color={colors.white} />
            </TouchableOpacity>
          }
          backgroundColor={colors.mainTheme}
          centerComponent={{
            text: "Create Post",
            style: { color: "#fff", fontSize: 16, fontWeight: "bold" }
          }}
        />
        <View style={styles.formBody}>
          <Input
            placeholder="Title of a issue"
            multiline
            onChangeText={input => this.setState({ title: input })}
          />
          <Input
            placeholder="Description of a issue"
            multiline
            onChangeText={input => this.setState({ content: input })}
          />
          <Text
            h4
            style={{ textAlign: "center", fontWeight: "bold", margin: "4%" }}
          >
            Type of Post
          </Text>
          <View
            style={{
              flexDirection: "row",
              paddingVertical: "4%",
              alignSelf: "center"
            }}
          >
            <View>
              <CheckBox
                center
                title="Emergency"
                containerStyle={{ padding: "-6%" }}
                textStyle={{ fontSize: 12 }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={this.state.checked1}
                onPress={() =>
                  this.setState(
                    {
                      checked1: true,
                      checked2: false,
                      checked3: false
                    },
                    () => Keyboard.dismiss()
                  )
                }
              />
            </View>

            <View>
              <CheckBox
                center
                title="Advice"
                containerStyle={{ padding: "-6%" }}
                textStyle={{ fontSize: 12 }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={this.state.checked3}
                onPress={() =>
                  this.setState(
                    {
                      checked1: false,
                      checked2: false,
                      checked3: true
                    },
                    () => Keyboard.dismiss()
                  )
                }
              />
            </View>

            <View>
              <CheckBox
                center
                title="Complaint"
                containerStyle={{ padding: "-6%" }}
                textStyle={{ fontSize: 12 }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={this.state.checked2}
                onPress={() =>
                  this.setState(
                    {
                      checked1: false,
                      checked2: true,
                      checked3: false
                    },
                    () => Keyboard.dismiss()
                  )
                }
              />
            </View>
          </View>

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
              { marginBottom: 20 }
            ]}
          >
            {this.state.postImage === null ? (
              <Text>No Image Selected</Text>
            ) : (
              <Image style={styles.avatar} source={this.state.postImage} />
            )}
          </View>

          <AwesomeButtonRick
            type="primary"
            progress
            style={{ alignSelf: "center" }}
            width={140}
            onPress={next => {
              this._createPost();
              next();
            }}
          >
            Create Post
          </AwesomeButtonRick>
        </View>
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
)(NewPost);

