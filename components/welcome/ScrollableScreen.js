import React, { Component } from 'react';
import {  Image ,Dimensions,StyleSheet} from 'react-native';

import {Block, Text} from '../../components/helpingComponents';

const { width, height } = Dimensions.get("window");

class ScrollableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  

  render() {
    return (
      <Block >
        <Image style={styles.image} source={this.props.source}  overflow='visible' resizeMode='contain' /> 
        <Block width={width} >
        <Text h3 gray center > {this.props.text}  </Text>
        </Block>
        
      </Block>
    );
  }
}

const styles = StyleSheet.create({
    image:{
        overflow: 'hidden',
        width:width,
        height:height/2
    }

})

export default ScrollableScreen;
