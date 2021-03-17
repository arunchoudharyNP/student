import React, {
  useLayoutEffect,
  useState,
  useEffect,
  useCallback,
} from "react";
import { shallowEqual, useDispatch } from "react-redux";
import { Button, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as AdminActions from "../../../Store/Actions/AdminActions";
import * as UserActions from "../../../Store/Actions/UsersActions";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";

import firebase, { firestore } from "firebase";
import firebaseConfig from "../../../fireBaseWebConfig";
import { FlatList } from "react-native-gesture-handler";

import { AnimatedCircularProgress } from "react-native-circular-progress";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const AdminProfile = (props) => {
  let db = firestore();
  let resData = [];
  const dispatch = useDispatch();
  const [OTP, setOTP] = useState([]);

  const { docId } = props.route.params;

  // const OTPs = useSelector((state) => state.UsersOTP.OTP);
  const OTPs = useSelector((state) => {
    return state.UsersOTP.OTP;
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("tabPress", () =>
      setOTP(OTPs)
    );
    return unsubscribe;
  }, [OTPs]);

  const loadOTP = useCallback(async () => {
    resData = await db
      .collection("AdminAccount")
      .doc(docId)
      .collection("GeneratedOTP")
      .get()
      .then((snapShot) => {
        const resData = snapShot.docs.map((element) => {
          return {
            count: element.data().count,
            login: element.data().login,
            title: element.id,
            userOTP: element.data().userOTP,
          };
        });

        dispatch(UserActions.getUserOTP(resData));
        // dispatch(UserActions.setLoginCount(resData))
        return resData;
      })
      .catch((err) => {
        console.log(err);
      });
    setOTP(resData);
    return resData;
  });

  // useEffect(() => {
  //   loadOTP().then((data) => {
  //     dispatch(UserActions.getUserOTP(data));
  //   });
  // }, [resData]);

  const parent = props.navigation.dangerouslyGetParent();

  const logoutHandler = () => {
    dispatch(AdminActions.logout(props.navigation));
  };

  useLayoutEffect(() => {
    const unsubscribe = loadOTP();
    parent.setOptions({
      headerLeft: () => {
        return (
          <TouchableOpacity>
            <Ionicons
              name="md-menu"
              size={36}
              onPress={() => {
                props.navigation.openDrawer();
              }}
              color="white"
              style={{ marginLeft: 20, marginTop: 5 }}
            />
          </TouchableOpacity>
        );
      },
    });
    return () => unsubscribe;
  }, []);

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Text style={styles.textStyle}>{item.title}</Text>
          <AnimatedCircularProgress
            size={120}
            width={3}
            fill={
              // otpData.find((value) => value.title == item.title)
              //   ? otpData.find((value) => value.title == item.title).count
              //   : 0
              // item.count
              item.login
            }
            tintColor="#00e0ff"
            backgroundColor="#3d5875"
          >
            {(fill) => (
              <Text style={{ fontSize: 22 }}>
                {fill}/{item.count}
              </Text>
            )}
          </AnimatedCircularProgress>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View>
        <FlatList
          data={OTP}
          keyExtractor={(item) => item.title}
          renderItem={renderItem}
        />
        {/* <TouchableOpacity style={styles.refresh} onPress={()=>{setOTP(OTPs)}}>
          <Text>Refresh</Text>

        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
    borderRadius: 30,
    borderColor: "black",
    borderWidth: 1,
    margin: 4,
  },
  userContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  textStyle: {
    fontSize: 36,
    textTransform: "uppercase",
    padding: 20,
  },
  gaugeStyle: {},
  refresh: {
    marginTop: 50,
  },
});

export default AdminProfile;
