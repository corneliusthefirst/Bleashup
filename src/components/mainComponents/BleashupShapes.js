import React from 'react';
import { View, StyleSheet } from 'react-native';

var TriangleCorner = React.createClass({
  render: function () {
    return <View style={[styles.triangleCorner, this.props.style]} />;
  },
});

var TriangleCornerTopRight = React.createClass({
  render: function () {
    return <TriangleCorner style={styles.triangleCornerTopRight} />;
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 100,
    borderTopWidth: 100,
    borderRightColor: 'transparent',
    borderTopColor: 'red',
  },
  triangleCornerTopRight: {
    transform: [{ rotate: '90deg' }],
  },
});

export default { TriangleCorner, TriangleCornerTopRight };
