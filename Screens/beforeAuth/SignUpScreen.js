import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from "react";
import { View, Image, StyleSheet, Alert } from "react-native";
import { colors } from "../../constants/style/theme";

import {
  Block,
  Text,
  Input,
  Button,
  Divider,
} from "../../components/helpingComponents";
import firebase, { firestore } from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const FORM_INPUT_UPDTAE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDTAE) {
    const updatedValues = {
      ...state.inputValue,
      [action.input]: action.value,
    };

    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };

    let updatedFormIsValid = true;

    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      inputValidities: updatedValidities,
      inputValue: updatedValues,
      formIsValid: updatedFormIsValid,
    };
  }
  return state;
};

const alert = (message) => {
  return Alert.alert("Error Occurred", message, [
    {
      text: "Cancel",
      onPress: () => console.log("Cancel Pressed"),
      style: "cancel",
    },
    { text: "OK", onPress: () => console.log("OK Pressed") },
  ]);
};

const SignUpScreen = (props) => {
  const db = firestore();
  const [error, setError] = useState();
  const [isLoading, setIsloading] = useState(false);

  const [formState, dispatchInput] = useReducer(formReducer, {
    inputValue: {
      userName: "",
      password: "",
      ID: "",
      OTP: "",
    },
    inputValidities: {
      userName: false,
      password: false,
      ID: false,
      OTP: false,
    },
    formIsValid: false,
  });

  const signUP = () => {
    console.log(formState.inputValue.OTP);
    const adminCollection = db
      .collection("AdminAccount")
      .doc(formState.inputValue.ID)
      .collection("GeneratedOTP");

    const userRef = db.collection("UserCred");

    userRef
      .where("OTP", "==", formState.inputValue.OTP)
      .get()
      .then((data) => {
        if (data.size == 0) {
          adminCollection
            .where("userOTP", "array-contains", formState.inputValue.OTP)
            .get()
            .then((querySnap) => {
              let id;
              let data;
              if (querySnap.size > 0) {
                querySnap.forEach((doc) => {
                  id = doc.id;
                  data = doc.data();
                });

                adminCollection.doc(id).update({
                  login: firebase.firestore.FieldValue.increment(1),
                });

                db.collection("UserCred").add({
                  userName: formState.inputValue.userName,
                  password: formState.inputValue.password,
                  ID: formState.inputValue.ID,
                  OTP: formState.inputValue.OTP,
                });
                Alert.alert("Successfully Registered", "Click Ok to Login", [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                  },
                  {
                    text: "OK",
                    onPress: () => props.navigation.navigate("loginScreen"),
                  },
                ]);

                console.log(id);
                console.log(data);
              } else {
                console.log("Not Found");
                alert("Credentials is Incorrect");
              }
            });
        } else {
          alert("Already Registered");
          console.log("Already Registered");
        }
      });

    // console.log(".......Result.....");
    // console.log(result);
    // console.log("..........");
  };

  function useIsMountedRef() {
    const isMountedRef = useRef(null);
    useEffect(() => {
      isMountedRef.current = true;
      return () => (isMountedRef.current = false);
    });
    return isMountedRef;
  }
  const isMountedRef = useIsMountedRef();

  useEffect(() => {
    if (isMountedRef.current) {
      if (error) {
        Alert.alert("An ERROR Occoured", error, [{ text: "Okay" }]);
      }
    }
  }, [error, isMountedRef, formState]);

  const signupHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchInput({
        type: FORM_INPUT_UPDTAE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchInput]
  );

  return (
    <ScrollView style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image
            style={{ resizeMode: "contain", width: 100, height: 100 }}
            source={require("../../assets/images/logo_circleDot.png")}
          />
        </View>

        <Text
          h1
          bold
          style={{
            marginTop: 10,
            marginLeft: 50,
            fontFamily: "open-sans-bold",
            color: "white",
          }}
        >
          Sign Up
        </Text>

        <Input
          id="userName"
          required
          LeftValue="user"
          vectorIcon="AntDesign"
          errorText="Please enter correct username"
          label="User Name"
          placeholder="Enter any imaginative name"
          style={styles.inputFeild}
          onInputChanges={signupHandler}
          initialValue=""
          initiallyValid={false}
        />

        <Input
          id="ID"
          required
          errorText="Please enter a valid ID"
          LeftValue="idcard"
          vectorIcon="Feather"
          label="ID"
          placeholder="Type your ID"
          style={styles.inputFeild}
          onInputChanges={signupHandler}
          initialValue=""
          initiallyValid={false}
        />

        <Input
          id="password"
          required
          minLength={5}
          errorText="Please enter a valid password"
          LeftValue="unlock"
          vectorIcon="Feather"
          password
          secure
          label="Password"
          placeholder="Type your password"
          style={styles.inputFeild}
          onInputChanges={signupHandler}
          initialValue=""
          initiallyValid={false}
        />

        <Input
          id="OTP"
          required
          minLength={5}
          errorText="Please enter a valid OTP"
          LeftValue="unlock"
          vectorIcon="Feather"
          password
          secure
          label="OTP"
          placeholder="Type your OTP"
          style={styles.inputFeild}
          onInputChanges={signupHandler}
          initialValue=""
          initiallyValid={false}
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <LinearGradient
            colors={["#CF406E", "#5D224F"]}
            locations={[0.1, 0.9]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.signUpButton, { marginLeft: 50 }]}
          >
            <TouchableOpacity
              onPress={() => props.navigation.navigate("loginScreen")}
              style={{ flexDirection: "row" }}
            >
              <AntDesign name="arrowleft" size={24} color="white" />
              <Text
                style={{
                  color: "white",
                  alignSelf: "center",
                  fontFamily: "open-sans-bold",
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={["#CF406E", "#5D224F"]}
            locations={[0.1, 0.9]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.signUpButton, { marginRight: 50 }]}
          >
            <TouchableOpacity
              onPress={() => {
                formState.inputValue.OTP && signUP();
              }}
              style={{ flexDirection: "row" }}
            >
              <Text
                style={{
                  color: "white",
                  alignSelf: "center",
                  fontFamily: "open-sans-bold",
                }}
              >
                Sign Up
              </Text>
              <AntDesign name="arrowright" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <Divider></Divider>

        <LinearGradient
          colors={["#CF406E", "#5D224F"]}
          locations={[0.1, 0.9]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.AdminButton}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("adminLogin")}
            style={{ flexDirection: "row" }}
          >
            <Text
              style={{
                color: "white",
                alignSelf: "center",
                fontFamily: "open-sans-bold",
              }}
            >
              Login as Admin
            </Text>
            <AntDesign
              name="arrowright"
              size={24}
              color="white"
              style={{ alignContent: "flex-end" }}
            />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
  BGimage: {
    width: "100%",
    height: 180,
  },
  imageContainer: {
    marginTop: 30,
    marginLeft: 40,
    paddingTop: 10,
  },

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
    marginHorizontal: 20,
    marginTop: 15,
  },

  socialImage: {
    resizeMode: "contain",
    height: 35,
    width: 35,
    marginHorizontal: 10,
  },
  signUpButton: {
    width: 100,
    alignSelf: "flex-end",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 20,
    marginRight: 50,
  },
  AdminButton: {
    padding: 10,
    marginHorizontal: 50,
    borderRadius: 20,
  },
});

export default SignUpScreen;
