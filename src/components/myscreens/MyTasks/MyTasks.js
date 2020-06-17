/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, Icon } from 'native-base';
import {
  Platform,
  UIManager,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import stores from '../../../stores/index';
import { observer } from 'mobx-react';
import { find, reject } from 'lodash';
import ColorList from '../../colorList';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import BleashupSrollView from '../../BleashupScrollView';
import AccordionModuleNative from './BleashupAccordion';
import ActivityProfile from "../currentevents/components/ActivityProfile";
import Remind from "../reminds";
import moment from "moment";
import RelationProfile from '../../RelationProfile';

@observer
class MyTasksView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      localRemindData: [],
      RemindCreationState: false,
      dataArray: [],
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    stores.Events.readFromStore().then((events) => {
      events = reject(events, { id: 'newEventId' });
      this.setState({ dataArray: events });
    });
  }

  back = () => {
    this.props.navigation.navigate('Home');
  };

  _keyExtractor = (item, index) => item.id;

  _renderHeader = (item, expanded,toggleExpand) => {
    return (
        <View style={{marginLeft: 15}}>
          { item.type === 'relation' ? <RelationProfile Event={item} />  :
          <ActivityProfile Event={item} joint={true} /> }
        </View>
    );
  };

  _renderContent = (item) => {
    let user = stores.LoginStore.user;
    let member = find(item.participant, { phone: user.phone });
    let master = member.master;

    //console.warn("item is", item);
    return (
      <View style={{ maxHeight: item.reminds.length > 0 ? 450 : 0,flex: 1, }}>
        <Remind
          share={{
            id: "456322",
            date: moment().format(),
            sharer: stores.LoginStore.user.phone,
            item_id: "a7f976f0-8cd8-11ea-9234-ebf9c3b94af7",
            event_id: item.id,
          }}
          startLoader={() => {
            this.setState({
              working: true,
            });
          }}
          stopLoader={() => {
            this.setState({
              working: false,
            });
          }}
          openMenu={() => this.openMenu()}
          clearCurrentMembers={() => {
            this.setState({ currentRemindMembers: null });
          }}
          mention={(Item) => this.mention(Item)}
          master={master}
          computedMaster={false}
          working={false}
          event={item}
          event_id={item.id}
          removeHeader
        />
      </View>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: ColorList.bodyBackground }}>
        <View style={{ height: '8%' }}>
          <View
            style={{
              height: ColorList.headerHeight,
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              ...bleashupHeaderStyle,
            }}
          >
            <View style={{ width: '18%', alignItems: 'center' }}>
              <Icon
                name="arrow-back"
                active={true}
                type="MaterialIcons"
                style={{ color: ColorList.headerIcon }}
                onPress={this.back}
              />
            </View>

            <View
              style={{ width: '64%', paddingLeft: '4%', alignItems: 'center' }}
            >
              <Text
                style={{
                  fontSize: ColorList.headerFontSize,
                  fontWeight: 'bold',
                }}
              >
                Tasks / Reminds
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: '92%' }}>
        <View>
            <AccordionModuleNative
              keyExtractor={this._keyExtractor}
              dataSource={this.state.dataArray}
              _renderHeader={this._renderHeader}
              _renderContent={this._renderContent}
            />
         </View>
        </View>
      </View>
    );
  }
}

export default MyTasksView;
