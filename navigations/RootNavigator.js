import React, { useState, useEffect, useRef } from "react";


import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import DashboardScreen from "../Screens/afterAuth/DashboardScreen";
import {
  WelcomeScreen,
  SignUpScreen,
  LoginScreen,
  AdminLogin,
} from "../Screens/beforeAuth/index";

import Verify from "../Screens/Verify";

import AdminProfile from "../Screens/afterAuth/Admin/AdminProfile";

const RootNavigator = (props) => {

  const navigationRef = useRef();
  const [isUserLogged, setisUserLogged] = useState(false);
  const [isAdminLogged, setisAdminLogged] = useState(false);
  const DrawerNav = createDrawerNavigator();
  const RootNav = createStackNavigator();


  const [adminUserName, setadminUserName] = useState("");
  const [adminDocId, setadminDocId] = useState("");
  const [adminData, setadminData] = useState(false);


  const getUpdatedStateAdmin = () => {
    console.log("State updated");
    if (adminDocId) {
      setadminUserName(null);
      setadminDocId(null);
    }
  };

  const getAdminAuthData = async () => {
    setadminData(false);
    AsyncStorage.getItem("adminData")
      .then(function (adminData) {
        console.log("adminData ....." + adminData);
        const transformedData = JSON.parse(adminData);
        if (transformedData) {
          setadminUserName(transformedData.userName);
          setadminDocId(transformedData.docId);
          setadminData(true);
        }
      })
      .catch(function (error) {
        console.log("Error " + error);
        setadminData(false);
      });
  };

  useEffect(() => {
    console.log("UseEffect called");

    getAdminAuthData();
  }, [adminUserName, adminDocId]);


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
        <RootNav.Screen
          options={{ headerShown: false }}
          name="verify"
          component={Verify}
        />
      </RootNav.Navigator>
    );
  };

  const AdminStack = () => {
    return (
      <DrawerNav.Navigator>
        <DrawerNav.Screen name="adminProfile" component={AdminProfile} />
        <DrawerNav.Screen name="verify" component={Verify} />
      </DrawerNav.Navigator>
    );
  };

  const UserStack = () => {
    return (
      <DrawerNav.Navigator>
        <DrawerNav.Screen name="dashboardScreen" component={DashboardScreen} />
        <DrawerNav.Screen name="verify" component={Verify} />
      </DrawerNav.Navigator>
    );
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={(state) => {
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        if (currentRouteName === "verify") {
          getUpdatedStateAdmin();
          getAdminAuthData();
        }
      }}
    >
      {adminData ? (
        <AdminStack />
      ) : isUserLogged ? (
        <UserStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
