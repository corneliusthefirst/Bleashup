/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import {
  View,
  LayoutAnimation,
  Platform,
  UIManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import ColorList from '../../colorList';
import { Icon } from 'native-base';
import BleashupScrollView from '../../BleashupScrollView';

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
  renderItem(dataArray,index) {
    return <View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: this.props.backgroundColor ?  this.props.backgroundColor : ColorList.bodyBackground,
        }}
      >
      <View style={{
        minWidth:'93%',
        marginBottom: 'auto',
        marginTop: 'auto',
      }}>
        {this.props._renderHeader(dataArray,index,() => {
          this.toggleExpand(dataArray);
        },this.state.expanded)}
        </View>
        {!this.props.hideToggler && <TouchableOpacity onPress={() => requestAnimationFrame(() => this.toggleExpand(dataArray))}>
          <View style={{ width: 30 }}>
            {this.expanded(dataArray) ? (
              <Icon style={{ fontSize: 18 }} type="AntDesign" name="up" />
            ) : (
                <Icon style={{ fontSize: 18 }} type="AntDesign" name="down" />
              )}
          </View>
        </TouchableOpacity>}
      </View>
      <View style={styles.parentHr} />
      {this.expanded(dataArray) && (
        <View>{this.props._renderContent(dataArray,index)}</View>
      )}
    </View>;
  }
  expanded(item) {
    return this.props.keyExtractor && this.state.expanded === this.props.keyExtractor(item);
  }

  render() {
    return <BleashupScrollView
      firstIndex={0}
      renderPerBatch={7}
      initialRender={15}
      numberOfItems={this.props.dataSource.length}
      keyExtractor={this.props.keyExtractor}
      dataSource={this.props.dataSource}
      backgroundColor={this.props.backgroundColor}
      renderItem={(item, index) => this.renderItem(item,index)}
     />;
  }
  toggleExpand = (item) => {
   !this.expanded(item) && this.props.onExpand && this.props.onExpand(item);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expanded: this.props.keyExtractor ? this.state.expanded === this.props.keyExtractor(item) ? null : this.props.keyExtractor(item) : item });
  };
}

const styles = StyleSheet.create({
  parentHr: {
    //height: 1,
    color: ColorList.bodySubtext,
    width: '100%',
  },
});
