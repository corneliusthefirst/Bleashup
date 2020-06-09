/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { Text, Icon } from 'native-base';
import { Dimensions, Platform, UIManager, View } from 'react-native';
import stores from '../../../stores/index';
import { observer } from 'mobx-react';
import LocalTasksCreation from './localTasksCreation';
import { find, findIndex, uniqBy, reject, filter } from 'lodash';
import ColorList from '../../colorList';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import AccordionComponent from './AccordionModule';
import BleashupFlatList from '../../BleashupFlatList';
import BleashupScrollView from '../../BleashupScrollView';

let { height, width } = Dimensions.get('window');
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

  updateData = (newremind) => {
    //console.warn("come back value",newremind)
    this.setState({
      localRemindData: [...this.state.localRemindData, newremind],
    });
  };

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

            {/*<View style={{ width: "18%", alignItems: "center" }}>
              <TouchableOpacity>
                <Icon
                  type="AntDesign"
                  name="plus"
                  style={{ color: ColorList.headerIcon }}
                  onPress={this.AddRemind}
                />
              </TouchableOpacity>
            </View>*/}
          </View>
        </View>

        <View style={{ height: '92%' }}>
          <BleashupScrollView
            firstIndex={0}
            renderPerBatch={7}
            initialRender={10}
            numberOfItems={this.state.dataArray.length}
            keyExtractor={this._keyExtractor}
            dataSource={this.state.dataArray}
            renderItem={(item, index) => {
              return <AccordionComponent dataArray={[item]} {...this.props} />;
            }}
          />
        </View>
      </View>
    );
  }
}
export default MyTasksView;

/**     <View style={{height:"92%"}}>
        <BleashupFlatList
          initialRender={5}
          renderPerBatch={5}
          onScroll={this._onScroll}
          firstIndex={0}
          keyExtractor={this._keyExtractor}
          dataSource={this.state.localRemindData}
          renderItem={(item, index) => {
            return (
              <MyTasksCard {...this.props} item={item} key={index} parentCardList={this}>
              </MyTasksCard>
            );
          }}
        >
        </BleashupFlatList >


      </View>

        /*stores.LoginStore.getUser().then((user)=>{
           stores.Reminds.readFromStore().then((Reminds)=>{
           let reminds = filter(Reminds,{event_id:user.phone});
            this.setState({localRemindData:reminds});
         //console.warn("ok",reminds)
      })
 })*/
