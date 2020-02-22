import React, { Component } from 'react';
import { View } from "react-native"
import ModalBox from 'react-native-modalbox';
import { Button, Icon, Content,Text } from 'native-base';
import { findIndex } from 'lodash';
import { SceneView } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';

export default class SelectDays extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    checked = (code) => findIndex(this.props.daysSelected, (ele) => ele === code) >= 0 ? true : false
    renderItem(item) {
        return <Button style={{width:"100%"}} key={item.code} onPress={() => this.checked(item.code) ? this.props.removeCode(item.code) : this.props.addCode(item.code)} transparent><Text>{`${item.day}`}</Text><Icon style={{alignSelf: 'flex-end',}} type={"MaterialIcons"} name={this.checked(item.code) ? "radio-button-checked" : "radio-button-unchecked"}></Icon></Button>
    }
    state = {}
    renderAll(){
        return this.props.daysOfWeek.map(ele =>{
            return this.renderItem(ele)
        })
    }
    render() {
        return (
            <ModalBox
                coverScreen={true}
                entry={'top'}
                position={'center'}
                backdropOpacity={0.7}
                backButtonClose={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.onClosed()
                }}
                style={{
                    width: '50%',
                    height: '50%',
                    backgroundColor: '#FEFFDE',
                    borderRadius: 8
                }}
            >
                <View>
                <View style={{margin: '2%',justifyContent: 'center',alignSelf: 'center',}}>
                        <Text style={{width:'90%',alignSelf:'center',fontWeight:'bold'}}>{"Select days in the week "}</Text>
                        {//<Icon style={{ margin: '2%', }} onPress={() => this.props.onClosed()} type={"EvilIcons"} name="close"></Icon>
            }

                </View>
                    <ScrollView>
                        {this.renderAll()}
                    </ScrollView>
                </View>
            </ModalBox>
        )
    }
}