import React, { Component } from 'react';

import { View, Platform } from 'react-native';
import ModalBox from 'react-native-modalbox';
import { Button, Content, Text } from 'native-base';
import moment from 'moment';
import BleashupFlatList from '../../BleashupFlatList';
import SelectableAlarmPeriod from './SelectableAlarmPeriod';
import { reject } from "lodash"
import { MenuDivider } from 'react-native-material-menu';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
const UTCFormat = "YYYY-MM-DDTHH:mm:ss.SSS[Z]"
export default class SetAlarmPatternModal extends Component {
    constructor(props) {
        super(props)
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
    patterns = [{
        id: '1',
        date: moment(this.props.date).subtract(7, 'days'),
        text: "1 Week Before"
    }, {
        id: '2',
        date: moment(this.props.date).subtract(2, 'days'),
        text: "2 Days Befors"
    }, {
        id: '3',
        date: moment(this.props.date).subtract(1, 'days'),
        text: "1 day Before"

    }, {
        id: '4',
        autoselected: true,
        date: moment(this.props.date).subtract(3 * 600, 'seconds'),
        text: "30 Minuts Before",
    }, {
        id: '5',
        autoselected: true,
        date: moment(this.props.date).subtract(600, 'seconds'),
        text: "10 Minuts Before"
    }, {
        id: '6',
        autoselected: true,
        date: moment(this.props.date).subtract(60 * 5, 'seconds'),
        text: "5 Minuts Before"
    }, {
        id: '7',
        autoselected: true,
        date: moment(this.props.date).subtract(60 * 2, 'seconds'),
        text: "2 Minuts Before"
    }, {
        id: '8',
        date: moment(this.props.date).utc().format(UTCFormat),
        text: "On Time"
    }]
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
    _keyExtractor = (item, index) => { return item ? item.id : null };
    render() {
        return (
            <ModalBox
                backdropOpacity={0.7}
                backButtonClose={true}
                backdropPressToClose={true}
                //swipeToClose={false}
                position='center'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                }}
                style={{
                    height: "60%",
                    borderRadius: 10,
                    borderTopLeftRadius: 0,
                    borderTopRightRadius: 0,
                     backgroundColor: '#FEFFDE', width: "90%"
                }}
            >
                <View style={{ width: "100%", height: 50, }}>
                    <View style={{ flexDirection: 'row',...bleashupHeaderStyle,padding: '2%', }}>
                        <View style={{width:'70%'}}>
                            <Text style={{ fontSize: 20, alignSelf: 'flex-start', fontWeight: 'bold', fontStyle: 'italic', width: "76%", margin: '2%', padding: '1%', }}>{"Set Alarm Pattern"}</Text>
                        </View>
                        <View style={{width:'30%'}}>
                            <Button onPress={() => this.save()} style={{ alignSelf: 'flex-end', }} transparent><Text style={{ fontSize: 23, fontWeight: 'bold', }}>SET</Text></Button>
                        </View>
                    </View>
                </View>
                <View style={{ margin: '3%', height: "85%" }}>
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

                        </BleashupFlatList></View>
                </View>
            </ModalBox>
        );
    }
} 