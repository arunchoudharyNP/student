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
import firebaseConfig from "../../fireBaseWebConfig";
import { ScrollView } from "react-native-gesture-handler";

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
      <Text
        h1
        bold
        center
        style={{
          marginTop: 60,
          marginBottom: 30,
          fontFamily: "open-sans-bold",
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
        placeholder="Enter any username name "
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
        id="ID"
        required
        errorText="Please enter a valid ID"
        LeftValue="unlock"
        vectorIcon="Feather"
        label="ID"
        placeholder="Type your ID"
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

      <Text gray2 right style={{ marginRight: 50 }}>
        {" "}
        Forget Password?{" "}
      </Text>
      {isLoading ? (
        <ActivityIndicator size="small" color="black" />
      ) : (
        <Button
          gradient
          startColor={colors.accent}
          endColor={colors.primary}
          style={styles.button}
          onPress={() => {
            formState.inputValue.OTP && signUP();
          }}
        >
          <Text bold white center style={{ fontFamily: "open-sans-bold" }}>
            Sign Up
          </Text>
        </Button>
      )}

      <Divider></Divider>

      <Text h6 color="#95A5A6" style={{ alignSelf: "center" }}>
        {" "}
        Already Registered{" "}
      </Text>

      <Button
        gradient
        startColor={colors.accent}
        endColor={colors.primary}
        style={styles.button}
        onPress={() => props.navigation.navigate("loginScreen")}
      >
        <Text bold white center style={{ fontFamily: "open-sans-bold" }}>
          Sign In
        </Text>
      </Button>

      <Button
        gradient
        startColor={"#107278"}
        endColor={"#03939C"}
        style={styles.button}
        onPress={() => props.navigation.navigate("adminLogin")}
      >
        <Text bold white center style={{ fontFamily: "open-sans-bold" }}>
          Login as Admin
        </Text>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  BGimage: {
    width: "100%",
    height: 180,
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
});

export default SignUpScreen;
