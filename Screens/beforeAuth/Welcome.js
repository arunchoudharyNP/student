import React, { Component } from "react";
import {
  Animated,
  Dimensions,
  Image,
  FlatList,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Button, Block, Text } from "../../components/helpingComponents";
import { theme } from "../../constants/style";
import ScrollableScreen from "../../components/welcome/ScrollableScreen";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

class Welcome extends Component {
  scrollX = new Animated.Value(0);

  state = {
    showTerms: false,
  };

  renderTermsService() {
    return (
      <Modal
        animationType="slide"
        visible={this.state.showTerms}
        onRequestClose={() => this.setState({ showTerms: false })}
      >
        <Block
          padding={[theme.sizes.padding * 2, theme.sizes.padding]}
          space="between"
        >
          <Text h2 light>
            Terms of Service
          </Text>

          <ScrollView style={{ marginVertical: theme.sizes.padding }}>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              1. Your use of the Service is at your sole risk. The service is
              provided on an "as is" and "as available" basis.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              2. Support for Expo services is only available in English, via
              e-mail.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              3. You understand that Expo uses third-party vendors and hosting
              partners to provide the necessary hardware, software, networking,
              storage, and related technology required to run the Service.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              4. You must not modify, adapt or hack the Service or modify
              another website so as to falsely imply that it is associated with
              the Service, Expo, or any other Expo service.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              5. You may use the Expo Pages static hosting service solely as
              permitted and intended to host your organization pages, personal
              pages, or project pages, and for no other purpose. You may not use
              Expo Pages in violation of Expo's trademark or other rights or in
              violation of applicable law. Expo reserves the right at all times
              to reclaim any Expo subdomain without liability to you.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              6. You agree not to reproduce, duplicate, copy, sell, resell or
              exploit any portion of the Service, use of the Service, or access
              to the Service without the express written permission by Expo.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              7. We may, but have no obligation to, remove Content and Accounts
              containing Content that we determine in our sole discretion are
              unlawful, offensive, threatening, libelous, defamatory,
              pornographic, obscene or otherwise objectionable or violates any
              party's intellectual property or these Terms of Service.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              8. Verbal, physical, written or other abuse (including threats of
              abuse or retribution) of any Expo customer, employee, member, or
              officer will result in immediate account termination.
            </Text>
            <Text
              caption
              gray
              height={24}
              style={{ marginBottom: theme.sizes.base }}
            >
              9. You understand that the technical processing and transmission
              of the Service, including your Content, may be transferred
              unencrypted and involve (a) transmissions over various networks;
              and (b) changes to conform and adapt to technical requirements of
              connecting networks or devices.
            </Text>
          </ScrollView>

          <Block middle padding={[theme.sizes.base / 2, 0]}>
            <Button
              gradient
              onPress={() => this.setState({ showTerms: false })}
            >
              <Text center white>
                I understand
              </Text>
            </Button>
          </Block>
        </Block>
      </Modal>
    );
  }

  renderIllustrations() {
    const { illustrations } = this.props;

    return (
      <FlatList
        horizontal
        pagingEnabled
        scrollEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        snapToAlignment="center"
        ref={(ref) => (this.flatlist = ref)}
        data={illustrations}
        extraDate={this.state}
        keyExtractor={(item, index) => `${item.id}`}
        renderItem={({ item }) => (
          <ScrollableScreen source={item.source} text={item.text} />
        )}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { x: this.scrollX } },
            },
          ],
          { useNativeDriver: false }
        )}
      />
    );
  }

  renderSteps() {
    const { illustrations } = this.props;
    const stepPosition = Animated.divide(this.scrollX, width);
    return (
      <Block row center middle>
        {illustrations.map((item, index) => {
          const opacity = stepPosition.interpolate({
            inputRange: [index - 1, index, index + 1],
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Block
              animated
              flex={false}
              key={`step-${index}`}
              color="gray"
              style={[styles.steps, { opacity }]}
            />
          );
        })}
      </Block>
    );
  }

  render() {
    const { navigation } = this.props;
    const { illustrations } = this.props;
    var num = 0;

    return (
      <Block color="white" flex={1}>
        <Block flex={1.2}>
          <Block flex={1} left center bottom>
            <Image
              style={styles.image}
              source={require("../../assets/images/logo-example.jpg")}
            />
            <Text style={styles.logotext} h3 gray2>
              {" "}
              App Name
            </Text>
          </Block>

          
        </Block>
        <Block flex={3.2}>{this.renderIllustrations()}</Block>
        <Block flex={1}>
          <Block row spaceBetween end>
            <TouchableOpacity
              onPress={() =>
                this.flatlist.scrollToIndex({
                  index: num > 0 ? (num = num - 1) : num,
                })
              }
            >
              {/* <Image
                style={styles.navigate1}
                resizeMode="contain"
                source={require("../assets/images/left.png")}
              /> */}
            </TouchableOpacity>
            {this.renderSteps()}
            <TouchableOpacity
              onPress={() =>
                this.flatlist.scrollToIndex({
                  index: num < 2 ? (num = num + 1) : num,
                })
              }
            >
              {/* <Image
                style={styles.navigate2}
                resizeMode="contain"
                source={require("../assets/images/Right.png")}
              /> */}
            </TouchableOpacity>
          </Block>
          {/* <Button onPress={() => this.setState({ showTerms: true })}>
            <Text center caption gray>
              Terms of service
            </Text>
          </Button> */}
          <Block bottom middle center>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("signUpScreen");
              }}
            >
              <Image
                style={styles.skipImage}
                source={require("../../assets/images/Skip.jpg")}
              />
            </TouchableOpacity>
          </Block>
        </Block>

        {/* {this.renderTermsService()} */}
      </Block>
    );
  }
}

Welcome.defaultProps = {
  illustrations: [
    {
      id: 1,
      source: require("../../assets/images/A.png"),
      text: "Text to describe your application",
    },
    {
      id: 2,
      source: require("../../assets/images/B.png"),
      text: "Text to describe your application",
    },
    {
      id: 3,
      source: require("../../assets/images/C.png"),
      text: "Text to describe your application",
    },
  ],
};

const styles = StyleSheet.create({
  stepsContainer: {
    position: "absolute",
    bottom: theme.sizes.base * 3,
    right: 0,
    left: 0,
  },
  steps: {
    width: 7,
    height: 7,
    borderRadius: 8,
    marginHorizontal: 4,
    marginBottom: 20,
  },
  image: {
    resizeMode: "contain",
    width: "30%",
    marginTop: 20,
    marginRight: 120,
  },
  logotext: {
    position: "relative",
    left: 20,
    bottom: 58,
  },
  skipImage: {
    marginTop:50,
    width: 75,
    height: 35,
  },
  navigate1: {
    height: 50,
    width: 50,
    marginLeft: 25,
  },
  navigate2: {
    height: 50,
    width: 50,
    marginRight: 25,
  },
  textDescription: {
    marginHorizontal: 10,
  },
});

export default Welcome;
