/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
} from "react-native";
import ColorList from '../../colorList';

export default class AccordionModuleNative extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    return (
      <View>
        {this.props._renderHeader(
          this.props.dataArray,
          this.state.expanded,
          this.toggleExpand
        )}
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View>{this.props._renderContent(this.props.dataArray)}</View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: !this.state.expanded });
  };
}

const styles = StyleSheet.create({
  parentHr: {
    height: 1,
    color: ColorList.bodySubtext,
    width: '100%',
  },
});
