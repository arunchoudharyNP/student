import React, { useState, useEffect, useRef } from "react";

import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-community/async-storage";

import { StyleSheet, View, Image, Text } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DashboardScreen from "../Screens/afterAuth/DashboardScreen";
import {
  WelcomeScreen,
  SignUpScreen,
  LoginScreen,
  AdminLogin,
} from "../Screens/beforeAuth/index";
import CustomDrawerComponent from "../components/navigation/CustomDrawerComponent";

import Verify from "../Screens/Verify";

import AdminProfile from "../Screens/afterAuth/Admin/AdminProfile";
import CreateUsers from "../Screens/afterAuth/Admin/CreateUsers";
import Users from "../Screens/afterAuth/Admin/Users";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import UserProfile from "../Screens/afterAuth/User/UserProfile";
import UserDrawerCom from "../components/navigation/UserDrawerCom";
import ChatScreen from "../Screens/afterAuth/User/ChatScreen";

const RootNavigator = (props) => {
  const navigationRef = useRef();

  const DrawerNav = createDrawerNavigator();
  const RootNav = createStackNavigator();
  const TabNav = createBottomTabNavigator();
  const AdminHome = createStackNavigator();

  const [adminUserName, setadminUserName] = useState("");
  const [adminDocId, setadminDocId] = useState("");
  const [adminData, setadminData] = useState(false);

  const [userName, setuserName] = useState("");
  const [userData, setuserData] = useState(false);

  const getUpdatedStateAdmin = () => {
    console.log("State updated");
    if (adminDocId) {
      setadminUserName(null);
      setadminDocId(null);
    }

    if (userName) {
      setuserName(null);
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

  const getUserAuthData = async () => {
    setuserData(false);
    AsyncStorage.getItem("userData")
      .then(function (userData) {
        console.log("userData ....." + userData);
        const transformedData = JSON.parse(userData);
        if (transformedData) {
          setuserName(transformedData.userName);
          setuserData(true);
        }
      })
      .catch(function (error) {
        console.log("Error " + error);
        setuserData(false);
      });
  };

  useEffect(() => {
    console.log("UseEffect called");

    getAdminAuthData();
    getUserAuthData();
  }, [adminUserName, adminDocId, userName]);

  const headerLogo = () => {
    return (
      <View style={{ flex: 1, flexDirection: "row" }}>
        <Image
          style={styles.logoImage}
          source={require("../assets/images/appLogo.png")}
        />
        <Text style={styles.logoTitle}>Friends</Text>
      </View>
    );
  };

  const BottomTabAdmin = () => {
    return (
      <TabNav.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "home") {
              iconName = focused ? "home" : "home-outline";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "create") {
              iconName = focused
                ? "account-multiple-plus"
                : "account-multiple-plus-outline";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            } else if (route.name === "users") {
              iconName = focused ? "account-group" : "account-group-outline";
              return (
                <MaterialCommunityIcons
                  name={iconName}
                  size={size}
                  color={color}
                />
              );
            }

            // You can return any component that you like here!
          },
        })}
        tabBarOptions={{
          activeTintColor: "#044b59",
          inactiveTintColor: "gray",
        }}
      >
        <TabNav.Screen
          name="home"
          component={AdminProfile}
          initialParams={{ docId: adminDocId }}
        />
        <TabNav.Screen name="create" component={CreateUsers} />
        <TabNav.Screen name="users" component={Users} />
      </TabNav.Navigator>
    );
  };

  const HomeForAdmin = () => {
    return (
      <AdminHome.Navigator>
        <AdminHome.Screen
          name="adminMain"
          component={BottomTabAdmin}
          options={{
            headerTitle: headerLogo,
            // headerStyle: {
            //   backgroundColor: "#044b59",
            // },
            headerBackground: () => (
              <LinearGradient
                colors={["#297a8a", "#10356c"]}
                style={{ flex: 1 }}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 0, y: 1 }}
              />
            ),
          }}
        />
      </AdminHome.Navigator>
    );
  };

  const AuthStack = () => {
    return (
      <RootNav.Navigator initialRouteName="welcomeScreen">
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
      <DrawerNav.Navigator
        drawerContent={(props) => (
          <CustomDrawerComponent {...props} name={"ABESIT"} picture={null} />
        )}
      >
        <DrawerNav.Screen name="adminProfile" component={HomeForAdmin} />
        <DrawerNav.Screen name="verify" component={Verify} />
      </DrawerNav.Navigator>
    );
  };

  const UserStack = () => {
    return (
      <DrawerNav.Navigator
        drawerContent={(props) => (
          <UserDrawerCom {...props} name={userName} picture={null} />
        )}
      >
        <DrawerNav.Screen
          name="userProfile"
          component={UserProfile}
          initialParams={{ name: userName }}
          options={{
            headerShown: true,
            headerTitle: headerLogo,
            headerStyle: {
              backgroundColor: "#044b59",
            },
            // headerBackground: () => (
            //   <LinearGradient
            //     colors={["blue", "#10356c"]}
            //     style={{ flex: 1 }}
            //     start={{ x: 0, y: 0.2 }}
            //     end={{ x: 0, y: 1 }}
            //   />
            // ),
          }}
        />
        <DrawerNav.Screen name="verify" component={Verify} />
        <DrawerNav.Screen name="chatScreen" component={ChatScreen} />
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
          getUserAuthData();
        }
      }}
    >
      {adminData ? <AdminStack /> : userData ? <UserStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  logoImage: {
    resizeMode: "contain",
    height: 55,
    width: 40,
    marginLeft: 35,
    marginRight: 10,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: "500",
    fontFamily: "Caveat",
    color: "white",
    marginTop: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
});

export default RootNavigator;
