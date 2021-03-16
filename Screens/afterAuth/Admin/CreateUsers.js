import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  LogBox,
  Alert,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-community/async-storage";

import { useDispatch } from "react-redux";
import NumericInput from "react-native-numeric-input";
import { Text as TextCom, Button } from "../../../components/helpingComponents";
import * as UsersActions from "../../../Store/Actions/UsersActions";

import firebase, { firestore } from "firebase";
import firebaseConfig from "../../../fireBaseWebConfig";

import { useSelector } from "react-redux";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const CreateUsers = (props) => {
  const [count, setcount] = useState(0);
  const [title, settitle] = useState("");
  const [generatedOTP, setgeneratedOTP] = useState([]);
  const [docId, setdocId] = useState("");

  console.log(docId);
  let db = firestore();
  const dispatch = useDispatch();

  LogBox.ignoreLogs(["componentWillReceiveProps has been renamed"]);

  function randomString(length, chars) {
    var mask = "";
    if (chars.indexOf("a") > -1) mask += "abcdefghijklmnopqrstuvwxyz";
    if (chars.indexOf("A") > -1) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (chars.indexOf("#") > -1) mask += "0123456789";
    if (chars.indexOf("!") > -1) mask += "~`!@#$%^&*()_+-={}[]:\";'<>?,./|\\";
    var result = "";
    for (var i = length; i > 0; --i)
      result += mask[Math.floor(Math.random() * mask.length)];
    return result;
  }

  const getAdminAuthData = async () => {
    AsyncStorage.getItem("adminData")
      .then(function (adminData) {
        console.log("adminData ....." + adminData);
        const transformedData = JSON.parse(adminData);
        if (transformedData) {
          setdocId(transformedData.docId);
        }
      })
      .catch(function (error) {
        console.log("Error " + error);
      });
  };

  const createOTPFunction = (count, length, chars) => {
    let i;
    let OtpArray = [];
    for (i = 0; i < count; i++) {
      OtpArray = OtpArray.concat(randomString(length, chars));
    }
    if (OtpArray.length > 0) {
      setgeneratedOTP(() => OtpArray);
    }
  };

  useEffect(() => {
    getAdminAuthData();
    if (generatedOTP.length > 0) {
      console.log("Generated OTP....." + generatedOTP);

      saveOTP()
      // .then(() => {
      //   return dispatch(
      //     UsersActions.createUsersOTP(title, generatedOTP, count)
      //   );
      // });

      setgeneratedOTP([]);
    }
  }, [generatedOTP]);

  const saveOTP = async () => {
    const OtpArray = generatedOTP;
    const exist = await db
      .collection("AdminAccount")
      .doc(docId)
      .collection("GeneratedOTP")
      .doc(title)
      .set(
        {
          login: 0,
          count: firebase.firestore.FieldValue.increment(count),
          userOTP: firebase.firestore.FieldValue.arrayUnion(...OtpArray),
        },
        { merge: true }
      );
      dispatch(
        UsersActions.createUsersOTP(title, generatedOTP, count)
      );

    return exist;
  };

  const SubmitHandler = () => {
    createOTPFunction(count, 6, "aA#");
  };

  return (
    <View style={{ backgroundColor: "white", flex: 1 }}>
      <View
        style={{
          flexDirection: "row",

          borderBottomWidth: 1,
          margin: 2,
          justifyContent: "space-between",
          marginTop: 40,
          marginBottom: 20,
        }}
      >
        <View style={{ alignSelf: "center" }}>
          <Text style={{ fontSize: 16, color: "black", fontWeight: "700" }}>
            {" "}
            Enter Title{" "}
          </Text>
        </View>
        <TextInput
          style={{ width: 235, height: 40, margin: 5 }}
          placeholder="Enter title of your user"
          onChangeText={(text) => {
            settitle(text);
          }}
          value={title}
        />
      </View>

      <View
        style={{
          flexDirection: "row",
          borderBottomWidth: 1,
          margin: 2,
          justifyContent: "space-between",
          marginVertical: 20,
        }}
      >
        <View style={{ alignSelf: "center" }}>
          <Text style={{ fontSize: 16, color: "black", fontWeight: "700" }}>
            {" "}
            Enter Count{" "}
          </Text>
        </View>
        <NumericInput
          value={count}
          onChange={(val) => {
            setcount(val);
          }}
          onLimitReached={(isMax, msg) => console.log(isMax, msg)}
          totalWidth={240}
          totalHeight={50}
          iconSize={25}
          step={1}
          minValue={0}
          maxValue={100}
          valueType="real"
          rounded
          textColor="black"
          iconStyle={{ color: "white" }}
          rightButtonBackgroundColor="#10356c"
          leftButtonBackgroundColor="#297a8a"
        />
      </View>

      <Button
        gradient
        startColor={"#10356c"}
        endColor={"#297a8a"}
        style={styles.button}
        onPress={() => {
          Keyboard.dismiss();
          SubmitHandler();
          Alert.alert(
            "OTP Generated",
            "OTP has been generated successfully",
            [{ text: "OK", onPress: () => console.log("OK Pressed") }],
            { cancelable: false }
          );
        }}
      >
        <TextCom bold white center style={{ fontFamily: "open-sans-bold" }}>
          Create
        </TextCom>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  inputTitle: {
    marginLeft: 50,
    lineHeight: 18,
    fontSize: 17,
    paddingVertical: 0,
  },
  inputFeild: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: "#C5CCD6",
    borderBottomWidth: 2,
    marginHorizontal: 50,
    paddingLeft: 25,
  },
  button: {
    alignSelf: "center",
    width: 240,
  },
});

export default CreateUsers;
