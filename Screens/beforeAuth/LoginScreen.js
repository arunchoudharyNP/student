import React, {
  useState,
  useEffect,
  useCallback,
  useReducer,
  useRef,
} from "react";
import { View, Image, StyleSheet } from "react-native";
import { colors } from "../../constants/style/theme";

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
  const [error, setError] = useState();
  const [isLoading, setIsloading] = useState(false);

  const [formState, dispatchInput] = useReducer(formReducer, {
    inputValue: {
      userName: "",
      password: "",
      OTP: "",
    },
    inputValidities: {
      userName: false,
      password: false,
      OTP: false,
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

  return (
    <View style={styles.container}>
      <Text
        h1
        bold
        center
        style={{
          marginTop: 150,
          marginBottom: 30,
          fontFamily: "open-sans-bold",
        }}
      >
        Login
      </Text>

      <Input
        id="username"
        required
        LeftValue="user"
        vectorIcon="AntDesign"
        minLength={10}
        maxLength={10}
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
          onPress={() => {}}
        >
          <Text bold white center style={{ fontFamily: "open-sans-bold" }}>
            Sign In
          </Text>
        </Button>
      )}

      <Divider></Divider>

      <Text h6 color="#95A5A6" style={{ alignSelf: "center" }}>
        {" "}
        Not Registered{" "}
      </Text>

      <Button
        gradient
        startColor={colors.accent}
        endColor={colors.primary}
        style={styles.button}
        onPress={()=>props.navigation.navigate("signUpScreen")}
      >
        <Text bold white center style={{ fontFamily: "open-sans-bold" }}>
          Sign Up
        </Text>
      </Button>

      <Button
        gradient
        startColor={"#107278"}
        endColor={"#03939C"}
        style={styles.button}
        onPress={()=>props.navigation.navigate("adminLogin")}
      >
        <Text bold white center style={{ fontFamily: "open-sans-bold" }}>
          Login as Admin
        </Text>
      </Button>
    </View>
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

export default LoginScreen;
