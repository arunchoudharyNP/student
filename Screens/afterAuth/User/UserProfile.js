import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CardCom from "../../../components/user/CardCom";
import * as ChatActions from "../../../Store/Actions/ChatActions";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";

import init from "../../../components/Helper/db";

import { firestore } from "firebase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    number: 5,
  }),
});

const UserProfile = (props) => {
  const dispatch = useDispatch();

  const [refreshing, setrefreshing] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const db = firestore();
  const parent = props.navigation.dangerouslyGetParent();

  const { name } = props.route.params;
  const [listners, setlistners] = useState([]);

  const startChat = (id, chatName, picture) => {
    db.collection("ServiceAccount")
      .doc(id)
      .set({ users: firestore.FieldValue.arrayUnion(name) }, { merge: true });

    props.navigation.navigate("chatScreen", {
      id,
      room: name,
      name: chatName,
      picture,
      expoPushToken,
    });
  };

  const loadListners = () => {
    setrefreshing(true);
    const serviceRef = db.collection("ServiceAccount");

    serviceRef.get().then((snapDoc) => {
      if (snapDoc.size > 0) {
        const resData = snapDoc.docs.map((element) => {
          return {
            Name: element.data().Name,
            ID: element.id,
            Picture: element.data().Picture,
          };
        });
        setrefreshing(false);
        setlistners(resData);
      }
    });
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    // This listener is fired whenever a notification is received while the app is foregrounded
    // notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    //   setNotification(notification);
    // });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Notifications.dismissAllNotificationsAsync();
      console.log(response);
    });

    // return () => {
    //   Notifications.removeNotificationSubscription(notificationListener.current);
    //   Notifications.removeNotificationSubscription(responseListener.current);
    // };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
      const {
        status: existingStatus,
      } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  useLayoutEffect(() => {
    loadListners();
    parent.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity>
            <Ionicons
              name="md-menu"
              size={36}
              onPress={() => {
                parent.openDrawer();
              }}
              color="white"
              style={{ marginLeft: 20, marginTop: 5 }}
            />
          </TouchableOpacity>
        );
      },
    });
  }, [props.navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CardCom
        data={listners}
        onRefresh={() => {
          loadListners();
        }}
        refreshing={refreshing}
        chatHandler={(id, name, picture) => startChat(id, name, picture)}
      />
    </View>
  );
};

export default UserProfile;
