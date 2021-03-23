import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from "react";
import { View, Image, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { colors } from "../../constants/style/theme";
import * as UserActions from "../../Store/Actions/UsersActions";
import { useDispatch } from "react-redux";
import firebase, { firestore } from "firebase";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import {
  Block,
  Text,
  Input,
  Button,
  Divider,
} from "../../components/helpingComponents";

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

const LoginScreen = (props) => {
  const db = firestore();

  const dispatch = useDispatch();
  const [error, setError] = useState();
  const [isLoading, setIsloading] = useState(false);

  const [formState, dispatchInput] = useReducer(formReducer, {
    inputValue: {
      userName: "",
      password: "",
    },
    inputValidities: {
      userName: false,
      password: false,
    },
    formIsValid: false,
  });

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

  const login = () => {
    const userRef = db.collection("UserCred");

    userRef
      .where("userName", "==", formState.inputValue.userName)
      .where("password", "==", formState.inputValue.password)
      .get()
      .then((querySnap) => {
        if (querySnap.size > 0) {
          console.log("Data Found");

          dispatch(
            UserActions.userAuth(
              props.navigation,
              formState.inputValue.userName
            )
          );
        } else {
          Alert.alert(
            "Please login with correct credential",
            " Credential not match"
          );
        }
      });
  };

  return (
    <View style={styles.container}>
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
        Login as User
      </Text>

      <Input
        id="userName"
        required
        LeftValue="user"
        vectorIcon="AntDesign"
        errorText="Please enter correct username"
        label="User Name"
        placeholder="Enter registered user name "
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

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <LinearGradient
          colors={["#CF406E", "#5D224F"]}
          locations={[0.1, 0.9]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.signUpButton, { marginLeft: 50 }]}
        >
          <TouchableOpacity
            onPress={() => props.navigation.navigate("signUpScreen")}
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
              Sign Up
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
              login();
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
              Sign In
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
          <AntDesign name="arrowright" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>
    </View>
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
    paddingTop:10
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
    backgroundColor: "#CF406E",
    flexDirection: "row",
    padding: 10,
    marginHorizontal: 50,
    borderRadius: 20,
    justifyContent: "space-between",
  },
});

export default LoginScreen;
