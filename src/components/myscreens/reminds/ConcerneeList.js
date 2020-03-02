import React, { Component } from 'react';
import {View} from "react-native"
import BleashupFlatList from '../../BleashupFlatList';
import IntervalSeparator from './IntervalSeparator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ProfileView from '../invitations/components/ProfileView';
import { Item } from 'native-base';


export default class ConcerneeList extends Component{
    constructor(props){
        super(props)
    }
    _keyExtractor = (item, index) => index.toString()
    delay = 0
    render(){
        return <View>
        <BleashupFlatList
                firstIndex={0}
                renderPerBatch={5}
                initialRender={10}
                numberOfItems={this.props.contacts.length}
                keyExtractor={this._keyExtractor}
                dataSource={this.props.contacts}
                renderItem={(item, index) => {
                    this.delay = this.delay >= 15 ? 0 : this.delay + 1
                    return (this.props.complexReport ? <View key={index.toString()}>
                        {item.type === 'interval' ? <IntervalSeparator to={item.to}
                            actualInterval={this.props.actualInterval &&
                                item.from === this.props.actualInterval.start &&
                                item.to === this.props.actualInterval.end}
                            first={index === 0 ? true : false}
                            from={item.from}></IntervalSeparator> :
                            <Item style={{ margin: '1%', }} key={index.toString()}><View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{ margin: '2%', height: 60 }}><ProfileView delay={this.delay} phone={item.data.phone}></ProfileView>
                                </View>
                            </View></Item>}
                    </View> :
                        <Item style={{margin: '1%',}} key={index.toString()}><View style={{ display: 'flex', flexDirection: 'row', }}>
                                <View style={{ margin: '2%', height: 60 }}><ProfileView delay={this.delay} phone={item}></ProfileView>
                                </View>
                        </View></Item>)

                }}
        />
        </View>
    }
}