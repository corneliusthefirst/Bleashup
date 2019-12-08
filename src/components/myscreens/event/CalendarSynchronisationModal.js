import React, { Component } from 'react';

import {View} from "react-native"
import ModalBox from 'react-native-modalbox';
import { Button,Content,Text } from 'native-base';

export default class CalendarSynchronisationModal extends Component{
    constructor(props){
        super(props)
    }

    render() {
        return (
             <ModalBox
                backdropOpacity={0.7}
                backButtonClose={true}
                backdropPressToClose={false}
                //swipeToClose={false}
                position='center'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                }}
                style={{
                    height: "40%",
                    borderRadius: 10, backgroundColor: '#FEFFDE', width: "90%"
                }}
             >
                <Content showsVerticalScrollIndicator={false} style={{ margin: "10%", flexDirection: 'column', }}>
                    <View style={{ width: "100%", height: 50 }}>
                        <Text style={{ fontSize: 25, alignSelf: 'center', fontWeight: 'bold', fontStyle: 'italic', }}>{"Calendar Synchronisation"}</Text>
                    </View>
                    <View style={{ margin: '3%', }}>
                        <Text style={{color:'gray',fontSize: 12,fontWeight: 'bold',fontStyle: 'italic',}}>{"This Activity Has Not Yet Been Added To Your Calendar ; Let's Add It To Your Calendar So That You Should Properly Reminded of IT."}</Text>
                    </View>
                    <View style={{ alignSelf: 'flex-end', flexDirection: 'row',margin: '3%', }}>
                        <Button onPress={() => this.props.closed()} style={{ width: 100, marginRight: 60, alignItems: 'center', }} danger><Text>Cancel</Text></Button>
                        <Button onPress={() => this.props.callback()} style={{ width: 100, alignItems: 'center', }} success><Text>{"Sync"}</Text></Button>
                    </View>
                </Content>
             </ModalBox>
        );
    }
} 