import { createStackNavigator, createBottomTabNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'
import AuthLoading from '../screens/Auth/AuthLoading/AuthLoading';
import LoginPage from '../screens/Auth/LoginPage/LoginPage';
import RegisterPage from '../screens/Auth/RegisterPage/RegisterPage';

import HomePage from '../screens/Main/HomePage/HomePage';
import Notification from '../screens/Main/Notification/Notification';
import ProfilePage from '../screens/Main/ProfilePage/ProfilePage';
import NewPost from '../screens/Main/NewPost/NewPost';

import HomeIndex from '../screens/Main/HomePage/HomeIndex';

import colors from '../constants/colors';



const AuthStack = createStackNavigator({
    AuthLoading,
    LoginPage,
    RegisterPage
},{
    initialRouteName: "AuthLoading",
    headerMode: 'none'
});


const HomeStack = createStackNavigator({
    HomeIndex,
    HomePage,
    Notification,
    ProfilePage,
    NewPost
},{
    initialRouteName: "HomeIndex",
    headerMode: 'none'
});


// const HomeStack = createMaterialBottomTabNavigator({
//     HomePage: { screen: HomePage },
//     Notification: { screen: Notification },
//     ProfilePage: { screen: ProfilePage },
// },{
//     initialRouteName: "HomePage",
//     barStyle: { backgroundColor: colors.mainTheme},
// });




const AppNavigator = createSwitchNavigator({
    Auth: AuthStack,
    Home: HomeStack,
});

export default createAppContainer(AppNavigator);