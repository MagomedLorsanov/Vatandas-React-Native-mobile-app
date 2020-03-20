import React, { Component } from "react";
import { View } from "react-native";
import { Card, Button, Text, Icon, Avatar } from "react-native-elements";
import firebase from "firebase";

const DEFAULT_IMG =
  "http://icons.iconarchive.com/icons/bokehlicia/captiva/256/user-icon.png";

import colors from "../../../constants/colors";

export default class PostComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isClicked: false,
      postImportance: 0,
      authorAvatar: DEFAULT_IMG
    };
    _authorImg = DEFAULT_IMG;
  }

  _handlePress = () => {
    const { post } = this.props;
    this.setState(
      {
        isClicked: !this.state.isClicked
      },
      () => {
        if (this.state.isClicked) {
          this.setState(
            {
              postImportance: this.state.postImportance + 1
            },
            () => {
              this._handleImportanceChange(post);
            }
          );
        } else {
          this.setState(
            {
              postImportance: this.state.postImportance - 1
            },
            () => {
              this._handleImportanceChange(post);
            }
          );
        }
      }
    );
  };



  _handleDelete = () => {
    let { post } = this.props;
    firebase
      .firestore()
      .collection("posts")
      .doc(post.id)
      .delete()
      .then(() => alert("Successfully Deleted Post"))
  };

  _handleImportanceChange = post => {
    firebase
      .firestore()
      .collection("posts")
      .doc(post.id)
      .update({
        postImportance: this.state.postImportance
      });
  };

  _handleAvatar = post => {
    const docRef = firebase
      .firestore()
      .collection("users")
      .doc(post.authorId);

    let that = this;
    docRef
      .get()
      .then(function(doc) {
        if (doc.exists) {
          that.setState({
            authorAvatar: doc.data().authorAvatarURL.toString()
          });
        } else {
          return DEFAULT_IMG;
        }
      })
      .catch(function(error) {
        console.log(error.message);
      });
  };

  async componentWillMount() {
    const { postImportance } = this.props.post;
    this._handleAvatar(this.props.post);
    await this.setState({
      postImportance: postImportance ? postImportance : 1
    });
  }

  render() {
    const {
      content,
      authorFirstName,
      authorLastName,
      title,
      postImageURL,
      postType
    } = this.props.post;

    return (
      <View>
        <Card
          title={title}
          image={{ uri: postImageURL ? postImageURL : DEFAULT_IMG }}
        >
          <Text style={{ fontSize: 14, marginLeft: "2%", color: "black" }}>
            {content}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: "2%"
            }}
          >
            {this.state.authorAvatar == DEFAULT_IMG ? (
              <View />
            ) : (
              <Avatar
                rounded
                source={{
                  uri: this.state.authorAvatar
                    ? this.state.authorAvatar
                    : DEFAULT_IMG
                }}
              />
            )}

            <Text style={{ fontSize: 18, marginLeft: "2%" }}>
              {`${authorFirstName} ${authorLastName}`}
            </Text>
          </View>
          <View
            style={{
              backgroundColor:
                postType == "Complaint"
                  ? "blue"
                  : postType == "Advice"
                  ? "green"
                  : "red",
              paddingVertical: "2%",
              width: "30%",
              alignSelf: "center",
              borderRadius: 10
            }}
          >
            <Text
              style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}
            >{`${postType}`}</Text>
          </View>
          <Button
            onPress={this._handlePress}
            icon={
              <Icon
                name={
                  this.state.isClicked ? "sort-descending" : "sort-ascending"
                }
                type="material-community"
                color="#ffffff"
              />
            }
            buttonStyle={{
              borderRadius: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
              backgroundColor: this.state.isClicked ? "green" : "#03A9F4"
            }}
            containerStyle={{ paddingVertical: "2%" }}
            title={`Importance  ${
              this.state.postImportance ? this.state.postImportance : 0
            }`}
          />
          {this.props.editUser ? (
            <Button
              onPress={this._handleDelete}
              icon={
                <Icon
                  name="file-cancel"
                  type="material-community"
                  color="#ffffff"
                />
              }
              buttonStyle={{
                borderRadius: 0,
                marginLeft: 0,
                marginRight: 0,
                marginBottom: 0,
                backgroundColor: "red"
              }}
              containerStyle={{
                paddingVertical: "2%",
                alignSelf: "center",
                width: "50%"
              }}
              title="Delete Post"
            />
          ) : (
            <View />
          )}
        </Card>
      </View>
    );
  }
}
