import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';

class BleashupShape extends Component {
  TriangleCorner = (style) => {
    return <View style={[styles.triangleCorner, style]} />;
  };

  TriangleCornerTopRight = (style) => {
    return (
      <View
        style={[styles.triangleCorner, styles.triangleCornerTopRight, style]}
      />
    );
  };

  triangleCornerBottomLeft = (style) => {
    return (
      <View
        style={[styles.triangleCorner, styles.triangleCornerBottomLeft, style]}
      />
    );
  };

  triangleCornerBottomRight = (style) => {
    return (
      <View
        style={[styles.triangleCorner, styles.triangleCornerBottomRight, style]}
      />
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    //borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 15,
    borderRightColor: 'transparent',
  },
  triangleCornerTopRight: {
    transform: [{ rotate: '90deg' }],
  },
  triangleCornerBottomLeft: {
    transform: [{ rotate: '270deg' }],
  },
  triangleCornerBottomRight: {
    transform: [{ rotate: '180deg' }],
  },
});

const BleashupShapes = new BleashupShape();
export default BleashupShapes;
