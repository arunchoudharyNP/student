import React, { useState } from "react";
import { Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../Screens/afterAuth/DashboardScreen";
import {
  WelcomeScreen,
  SignUpScreen,
  LoginScreen,
  AdminLogin,
} from "../Screens/beforeAuth/index";

import AdminProfile from "../Screens/afterAuth/Admin/AdminProfile";

const RootNavigator = (props) => {
  const [isUserLogged, setisUserLogged] = useState(false);
  const [isAdminLogged, setisAdminLogged] = useState(false);
  const DrawerNav = createDrawerNavigator();
  const RootNav = createStackNavigator();

  const AuthStack = () => {
    return (
      <RootNav.Navigator initialRouteName="loginScreen">
        <RootNav.Screen
          options={{ headerShown: false }}
          name="welcomeScreen"
          component={WelcomeScreen}
        />
        <RootNav.Screen
          options={{ headerShown: false }}
          name="signUpScreen"
          component={SignUpScreen}
        />
        <RootNav.Screen
          options={{ headerShown: false }}
          name="loginScreen"
          component={LoginScreen}
        />
        <RootNav.Screen
          options={{ headerShown: false }}
          name="adminLogin"
          component={AdminLogin}
        />
        <RootNav.Screen
          options={{ headerShown: false }}
          name="adminProfile"
          component={AdminProfile}
        />
      </RootNav.Navigator>
    );
  };

  const AdminStack = () => {
    return (
      <DrawerNav.Navigator>
        <DrawerNav.Screen name="adminProfile" component={AdminProfile} />
      </DrawerNav.Navigator>
    );
  };

  const UserStack = () => {
    return (
      <DrawerNav.Navigator>
        <DrawerNav.Screen name="dashboardScreen" component={DashboardScreen} />
      </DrawerNav.Navigator>
    );
  };

  if (!isUserLogged && !isAdminLogged) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  if (isUserLogged) {
    return (
      <NavigationContainer>
        <UserStack />
      </NavigationContainer>
    );
  }

  if (isAdminLogged) {
    return (
      <NavigationContainer>
        <AdminStack />
      </NavigationContainer>
    );
  }
};

export default RootNavigator;
