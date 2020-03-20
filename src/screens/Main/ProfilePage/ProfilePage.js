import React, { Component } from "react";
import {
  View,
  StyleSheet,
  AsyncStorage,
  ScrollView,
  Image,
  ActivityIndicator,
  Animated,
  TouchableOpacity
} from "react-native";
import { Icon, Text } from "react-native-elements";
import firebase from "firebase";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import moment from "moment";

import colors from "../../../constants/colors";
import PostComponent from "../HomePage/PostComponent";

const HEADER_MAX_HEIGHT = 120;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 80;
const PROFILE_IMAGE_MIN_HEIGHT = 40;

const DEFAULT_IMG =
  "http://icons.iconarchive.com/icons/bokehlicia/captiva/256/user-icon.png";

class ProfilePage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(0),
      selectedCity: null,
      loading: true,
      customPosts: null,
      activeUserEmail: null,
      activeUserId: null,
      activeUserName: "",
      activeUserSurname: "",
      activeUserBio: "",
      activeUserAvatar: null,
      postCount: 0
    };
    _isMounted = false;
  }

 
  

  _handleLocation = async () => {
    if (this._isMounted) {
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
                  that.setState(
                    {
                      selectedCity: doc.data().userLocation,
                      activeUserId: doc.id,
                      activeUserName: doc.data().firstName,
                      activeUserSurname: doc.data().lastName,
                      activeUserBio: doc.data().biography,
                      activeUserAvatar: doc.data().authorAvatarURL
                    },
                    () => {
                      that.setState({ loading: false }); 
                      if(that.props.posts){
                        let x = [];
                        that.props.posts.map(item => {
                          if(item.authorId == that.state.activeUserId){
                           x.push(item);
                          }
                        })
                        that.setState({ postCount: x.length })
                      }
                    }
                  );
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


  

  async componentDidMount() {
    this._isMounted = true;
    await this._handleLocation();
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let {
      activeUserId,
      activeUserName,
      activeUserSurname,
      activeUserBio,
      activeUserAvatar,
      postCount
    } = this.state;

    const headerHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    });
    const profileImageHeight = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
      extrapolate: "clamp"
    });

    const profileImageMarginTop = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [
        HEADER_MAX_HEIGHT - PROFILE_IMAGE_MAX_HEIGHT / 2,
        HEADER_MAX_HEIGHT + 5
      ],
      extrapolate: "clamp"
    });
    const headerZindex = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 120],
      outputRange: [0, 0, 1000],
      extrapolate: "clamp"
    });

    const headerTitleBottom = this.state.scrollY.interpolate({
      inputRange: [
        0,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 5 + PROFILE_IMAGE_MIN_HEIGHT,
        HEADER_MAX_HEIGHT -
          HEADER_MIN_HEIGHT +
          5 +
          PROFILE_IMAGE_MIN_HEIGHT +
          26
      ],
      outputRange: [-20, -20, -20, 0],
      extrapolate: "clamp"
    });

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            backgroundColor: "lightskyblue",
            height: headerHeight,
            zIndex: headerZindex,
            elevation: headerZindex, //required for android
            alignItems: "center"
          }}
        >
          <Animated.View
            style={{ position: "absolute", bottom: headerTitleBottom }}
          >
            <Text
              style={{ color: "white", fontSize: 14, fontWeight: "bold" }}
            >{`${activeUserName} ${activeUserSurname}`}</Text>
          </Animated.View>
        </Animated.View>

        <ScrollView
          style={{ flex: 1 }}
          scrollEventThrottle={16}
          onScroll={Animated.event([
            { nativeEvent: { contentOffset: { y: this.state.scrollY } } }
          ])}
        >
          <Animated.View
            style={{
              height: profileImageHeight,
              width: profileImageHeight,
              borderRadius: PROFILE_IMAGE_MAX_HEIGHT / 2,
              borderColor: "white",
              borderWidth: 3,
              overflow: "hidden",
              marginTop: profileImageMarginTop,
              marginLeft: 10
            }}
          >
            <Image
              source={{
                uri: activeUserAvatar ? activeUserAvatar : DEFAULT_IMG
              }}
              style={{ flex: 1, width: null, height: null }}
            />
          </Animated.View>
          <View>
            <Text
              style={{ fontWeight: "bold", fontSize: 26, paddingLeft: 10 }}
            >{`${activeUserName} ${activeUserSurname}`}</Text>
          </View>

          <View>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  flex: 1,
                  textAlign: "center",
                  paddingVertical: "4%"
                }}
              >
                " {activeUserBio} "
              </Text>
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                alignItems: "center"
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  backgroundColor: colors.mainTheme,
                  borderRadius: 10,
                  alignSelf: "center"
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 16,
                    color: "#fff",
                    padding: "2%"
                  }}
                >
                  Posts:
                </Text>
                <Text
                  style={{
                    fontSize: 16,
                    marginLeft: "2%",
                    color: "#fff",
                    padding: "2%"
                  }}
                >
                  {postCount}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  AsyncStorage.clear();
                  this.props.navigation.navigate("AuthLoading");
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: 'center',
                    backgroundColor: colors.mainTheme,
                    borderRadius: 10,
                    alignSelf: "center"
                  }}
                >
                  <Icon
                    type="material-community"
                    size={18}
                    color="#fff"
                    name="logout"
                    containerStyle={{ paddingHorizontal: '4%'}}
                  />
                  <Text style={{
                    fontSize: 16,
                    marginLeft: "2%",
                    color: "#fff",
                    padding: "2%",
                    fontWeight: 'bold'
                  }}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            {this.props.posts ? (
              <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {this.props.posts &&
                  this.props.posts.map((post, index) => {
                    if (post.authorId == activeUserId) {
                      return (
                        <PostComponent
                          post={post}
                          key={index}
                          editUser={true}
                        />
                      );
                    }
                    return <View key={index} />;
                  })}
              </ScrollView>
            ) : (
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
            )}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

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
)(ProfilePage);
