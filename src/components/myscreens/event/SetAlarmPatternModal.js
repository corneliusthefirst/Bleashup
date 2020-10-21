/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable radix */
/* eslint-disable comma-dangle */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';

import { View, Platform, TouchableOpacity, Text } from 'react-native';
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
import GState from '../../../stores/globalState';
import Texts from '../../../meta/text';
export default class SetAlarmPatternModal extends BleashupModal {
    initialize() {
       /* this.state = {
            selected: this.props.pattern ? 
            this.props.pattern.filter(ele => ele.autoselected):
            AlarmPatterns().filter(ele => ele.autoselected),
            date: moment().format()
        };*/
    }
    state = {
        selected: this.props.pattern ?
            this.props.pattern.filter(ele => ele.autoselected) :
            AlarmPatterns().filter(ele => ele.autoselected),
        date: moment().format()
    }
    addItem(item) {
        this.setStatePure({
            selected: uniqBy([...this.state.selected, item],"id")
        })
    }
    removeItem(id) {
        this.setStatePure({
            selected: reject(this.state.selected, { id: id })
        });
    }
    patterns = AlarmPatterns()
    save() {
        this.props.save(this.state.selected,this.state.date);
        this.props.closed();
    }
    position = "center"
    swipeToClose = false
    modalHeight = 355
    modalWidth = 280
    onClosedModal() {
        this.props.closed();
        this.refs.flatlist && this.refs.flatlist.resetItemNumbers()
    }
    onOpenModal(){
        let alarms = this.props.pattern ?
            this.props.pattern.filter(ele => ele.autoselected) :
            AlarmPatterns().filter(ele => ele.autoselected)
        this.setStatePure({
             selected: alarms
        //date: moment().format()
        },() => {
           setTimeout(() => {
               this.refs.flatlist && this.refs.flatlist.scrollToEndReal()
           })
        })
    }
    borderRadius = 10
    _keyExtractor = (item, index) => { return item ? item.id : null; };
    modalBody() {
        return (
            <View style={{flex:1,borderRadius:10}}>
                <View style={{ width: "98%", height: 35, }}>
                    <View style={{ flexDirection: 'row', padding: '2%',justifyContent: 'center', }}>
                        <View style={{ textAlign:'center',alignSelf: 'center', }}>
                            <Text style={{
                                ...GState.defaultTextStyle, 
                                fontSize: 18, 
                                fontWeight: 'bold', 
                                padding: '1%', 
                                alignSelf: 'center',
                            }}>{this.props.dontSet ? Texts.alarms : Texts.set_alarm_pattern}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ margin: '3%', height: "80%", }}>
                    <View style={{ flex: 1 }}>
                        <BleashupFlatList
                            ref="flatlist"
                            fit
                            keyExtractor={this._keyExtractor}
                            dataSource={(this.props.pattern ? this.props.pattern : this.patterns).sort((a,b) => a.offset < b.offset ? 1 : -1)}
                            firstIndex={0}
                            renderPerBatch={7}
                            initialRender={15}
                            numberOfItems={this.props.pattern ? this.props.pattern.length : this.patterns.length}
                            renderItem={(item, index) => {
                                return item ?
                                    <View style={{ margin: '2%', }}>
                                        <SelectableAlarmPeriod 
                                        mechecked={this.state.selected.findIndex(ele => ele.id === item.id) >= 0} 
                                        item={item} 
                                        timeoute={parseInt(index) * 20} 
                                        key={index} 
                                        checked={item => this.addItem(item)} 
                                        unchecked={(id => this.removeItem(id))} />
                                    </View> : null;
                            }
                            }
                         />
                    </View>
                    <View style={{ flexDirection: 'column',justifyContent: 'center',alignSelf:'flex-end'}}>
                        {!this.props.dontSet && <CreateButton  
                        title={Texts.set} 
                        action={() => this.save()} style={{ 
                            ...shadower(2), borderWidth: 0, 
                            minWidth: 55, margin: 5,maxWidth: 100,
                            backgroundColor: ColorList.bodyDarkWhite,height:35,borderRadius:10 }} noround />}
                    </View>
                </View>
            </View>
        );
    }
}
