import React, { Component } from "react";
import { Text, View } from "react-native";
import { Icon } from "react-native-elements";
import BottomNavigation, {
  FullTab
} from "react-native-material-bottom-navigation";

import HomePage from "./HomePage";
import Notification from "../Notification/Notification";
import ProfilePage from "../ProfilePage/ProfilePage";

import colors from "../../../constants/colors";

const TABNAMES = {
  HOME_PAGE: "homepage",
  NOTIFICATION: "notification",
  PROFILE_PAGE: "profile_page"
};

export default class HomeIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabName: TABNAMES.HOME_PAGE
    };
    _isMounted = false;
  }



  tabs = [
    {
      key: TABNAMES.HOME_PAGE,
      icon: "home-variant",
      label: "Home Page",
      barColor: colors.white,
      pressColor: colors.mainTheme
    },
    {
      key: TABNAMES.NOTIFICATION,
      icon: "bell-circle",
      label: "Notifications",
      barColor: colors.white,
      pressColor: colors.mainTheme
    },
    {
      key: TABNAMES.PROFILE_PAGE,
      icon: "account-box",
      label: "Profile Page",
      barColor: colors.white,
      pressColor: colors.mainTheme
    }
  ];

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  renderIcon = icon => ({ isActive }) => (
    <Icon size={24} type="material-community" color="black" name={icon} />
  );

  renderTab = ({ tab, isActive }) => (
    <FullTab
      isActive={isActive}
      key={tab.key}
      label={tab.label}
      labelStyle={{ fontSize: 10, color: 'black' }}
      renderIcon={this.renderIcon(tab.icon)}
    />
  );

  _handleTabNav = newTab => {
    if(this._isMounted){
    this.setState({ tabName: newTab.key });
  }
  };

  render() {
    const HomePageContent = <HomePage navigation={this.props.navigation}/>;

    const NotificationContent = <Notification navigation={this.props.navigation}/>;

    const ProfilePageContent = <ProfilePage navigation={this.props.navigation} key={"heeey"}/>;

    let { tabName } = this.state;

    let tabContent =
      tabName == TABNAMES.HOME_PAGE
        ? HomePageContent
        : tabName == TABNAMES.NOTIFICATION
        ? NotificationContent
        : ProfilePageContent;


    return (
      <View style={{ flex: 1}}>
          <View style={{ flex: 1}}>
          { tabContent }
          </View>
          <BottomNavigation
                    onTabPress={(newTab) => this._handleTabNav(newTab)}
                    renderTab={this.renderTab}
                    tabs={this.tabs}
                />
          
      </View>
    );
  }
}
