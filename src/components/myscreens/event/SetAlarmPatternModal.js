/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable radix */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';

import { View, Platform, TouchableOpacity } from 'react-native';
import ModalBox from 'react-native-modalbox';
import { Button, Content, Text } from 'native-base';
import moment from 'moment';
import BleashupFlatList from '../../BleashupFlatList';
import SelectableAlarmPeriod from './SelectableAlarmPeriod';
import { reject,uniqBy } from "lodash"
import { MenuDivider } from 'react-native-material-menu';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import { AlarmPatterns } from '../../../services/recurrenceConfigs';
import CreateButton from './createEvent/components/ActionButton';
import shadower from '../../shadower';
import ColorList from '../../colorList';
import BleashupModal from '../../mainComponents/BleashupModal';
export default class SetAlarmPatternModal extends BleashupModal {
    initialize() {
        this.state = {
            selected: []
        };
    }
    state = {
        selected: []
    }
    addItem(item) {
        this.setState({
            selected: uniqBy([...this.state.selected, item],"id")
        })
    }
    removeItem(id) {
        this.setState({
            selected: reject(this.state.selected, { id: id })
        });
    }
    patterns = AlarmPatterns()
    save() {
        this.props.save(this.state.selected.map(ele => {
            return {
                date: parseInt(Platform.OS === 'ios'
                    ? moment(this.props.date).diff(ele.date, 'minutes')
                        .toISOString() : moment(this.props.date).diff(ele.date, 'minutes'))
            };
        }));
        this.props.closed();
    }
    position = "center"
    swipeToClose = false
    modalHeight = 355
    modalWidth = 280
    onClosedModal() {
        this.props.closed();
    }
    borderRadius = 10
    _keyExtractor = (item, index) => { return item ? item.id : null; };
    modalBody() {
        return (
            <View style={{flex:1,borderRadius:10}}>
                <View style={{ width: "98%", height: 35, }}>
                    <View style={{ flexDirection: 'row', padding: '2%',justifyContent: 'center', }}>
                        <View style={{ textAlign:'center',alignSelf: 'center', }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', padding: '1%', alignSelf: 'center',}}>{"Set Alarm Pattern"}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ margin: '3%', height: "80%", }}>
                    <View style={{ flex: 1 }}>
                        <BleashupFlatList
                            listKey={"contacts"}
                            keyExtractor={this._keyExtractor}
                            dataSource={this.props.pattern ? this.props.pattern : this.patterns}
                            firstIndex={0}
                            renderPerBatch={7}
                            initialRender={15}
                            numberOfItems={this.props.pattern ? this.props.pattern.length : this.patterns.length}
                            renderItem={(item, index) => {
                                // console.error(item, "pppppp")
                                return item ?
                                    <View style={{ margin: '2%', }}>
                                        <SelectableAlarmPeriod item={item} timeoute={parseInt(index) * 20} key={index} checked={item => this.addItem(item)} unchecked={(id => this.removeItem(id))} />
                                    </View> : null;
                            }
                            }
                         />
                    </View>
                    <View style={{ width: 55,margin: 5,flexDirection: 'column',justifyContent: 'center',alignSelf:'flex-end'}}>
                        <CreateButton title={"Set"} action={() =>
                            this.save()} style={{ ...shadower(2), borderWidth: 0, backgroundColor: ColorList.bodyDarkWhite,height:35,borderRadius:10 }} noround />
                    </View>
                </View>
            </View>
        );
    }
}
