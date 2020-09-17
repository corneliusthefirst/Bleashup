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
import BleashupScrollView from '../../BleashupScrollView';
import AntDesign  from 'react-native-vector-icons/AntDesign';
import GState from '../../../stores/globalState';

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
  renderItem(dataArray,key, index) {
    return <View key={key}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: this.props.backgroundColor ?  this.props.backgroundColor : ColorList.bodyBackground,
        }}
      >
      <View style={{
          minWidth: this.props.hideToggler?'100%':'93%',
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
              <AntDesign style={{...GState.defaultIconSize, fontSize: 18 }} type="AntDesign" name="up" />
            ) : (
                <AntDesign style={{...GState.defaultIconSize, fontSize: 18 }} type="AntDesign" name="down" />
              )}
          </View>
        </TouchableOpacity>}
      </View>
      <View style={styles.parentHr} />
      {this.expanded(dataArray) && (
        <View>{this.props._renderContent(dataArray, index)}</View>
      )}
    </View>;
  }
  expanded(item) {
    return this.props.keyExtractor && this.state.expanded === this.props.keyExtractor(item);
  }
  scrollToIndex(index){
    this.refs.accordion && this.refs.accordion.scrollToIndex(index)
  }
  render() {
    return <BleashupScrollView
      ref="accordion"
      firstIndex={0}
      renderPerBatch={7}
      initialRender={15}
      numberOfItems={this.props.dataSource.length}
      keyExtractor={this.props.keyExtractor}
      getItemLayout={this.props.getItemLayout}
      dataSource={this.props.dataSource}
      backgroundColor={this.props.backgroundColor}
      renderItem={(item, key,index) => this.renderItem(item,key,index)}
     />;
  }
  toggleExpand = (item) => {
   !this.expanded(item) && this.props.onExpand && this.props.onExpand(item);
    LayoutAnimation.configureNext({
                duration: 300,
                create: {
                    type: LayoutAnimation.Types.easeInEaseOut,
                  property: LayoutAnimation.Properties.scaleX,
                },
                update: { type: LayoutAnimation.Types.easeInEaseOut },
            });
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
