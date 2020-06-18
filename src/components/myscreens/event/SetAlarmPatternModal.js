import React, { Component } from 'react';

import { View, Platform, TouchableOpacity } from 'react-native';
import ModalBox from 'react-native-modalbox';
import { Button, Content, Text } from 'native-base';
import moment from 'moment';
import BleashupFlatList from '../../BleashupFlatList';
import SelectableAlarmPeriod from './SelectableAlarmPeriod';
import { reject } from "lodash"
import { MenuDivider } from 'react-native-material-menu';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import { AlarmPatterns } from '../../../services/recurrenceConfigs';
import CreateButton from './createEvent/components/ActionButton';
import shadower from '../../shadower';
import ColorList from '../../colorList';
import BleashupModal from '../../mainComponents/BleashupModal';
export default class SetAlarmPatternModal extends BleashupModal {
    initialize() {
        state = {
            selected: []
        }
    }
    state = {
        selected: []
    }
    addItem(item) {
        this.setState({
            selected: [...this.state.selected, item]
        })
    }
    removeItem(id) {
        this.setState({
            selected: reject(this.state.selected, { id: id })
        })
    }
    patterns = AlarmPatterns()
    save() {
        this.props.save(this.state.selected.map(ele => {
            return {
                date: parseInt(Platform.OS === 'ios'
                    ? moment(this.props.date).diff(ele.date, 'minutes')
                        .toISOString() : moment(this.props.date).diff(ele.date, 'minutes'))
            }
        }))
        this.props.closed()
    }
    position = "center"
    swipeToClose = false
    modalHeight = "60%"
    modalWidth = "90%"
    onClosedModal() {
        this.props.closed()
    }
    borderRadius = 10
    _keyExtractor = (item, index) => { return item ? item.id : null };
    modalBody() {
        return (
            <View>
                <View style={{ width: "90%", height: 35, }}>
                    <View style={{ flexDirection: 'row', padding: '2%', }}>
                        <View style={{ width: '80%' }}>
                            <Text style={{ fontSize: 18, alignSelf: 'flex-start', fontWeight: 'bold', padding: '1%', }}>{"Set Alarm Pattern"}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ margin: '3%', height: "80%" }}>
                    <View style={{ hieght: "" }}>
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
                                        <SelectableAlarmPeriod item={item} timeoute={parseInt(index) * 20} key={index} checked={item => this.addItem(item)} unchecked={(id => this.removeItem(id))}>
                                        </SelectableAlarmPeriod>
                                        <MenuDivider color="#1FABAB" />
                                    </View> : null
                            }
                            }
                        >

                        </BleashupFlatList>
                    </View>
                    <View style={{ width: '20%', alignSelf: 'center', marginTop: "0%",flexDirection: 'column',justifyContent: 'center',}}>
                        <CreateButton title={"Set"} action={() =>
                            this.save()} style={{ ...shadower(4), borderWidth: 0, backgroundColor: ColorList.bodyDarkWhite, }}>
                        </CreateButton>
                    </View>
                </View>
            </View>
        );
    }
} 