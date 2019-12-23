import React, { Component } from 'react';

import {View} from "react-native"
import ModalBox from 'react-native-modalbox';
import { Button,Content,Text, Title } from 'native-base';

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
                    borderRadius: 10, backgroundColor: '#FEFFDE', width: "93%"
                }}
             >
                <Content showsVerticalScrollIndicator={false} style={{ margin: "10%", flexDirection: 'column', }}>
                    <View style={{ width: "100%", height: 50,alignSelf: 'center', }}>
                        <Title style={{ marginLeft: "1%",fontSize: 22, alignSelf: 'center', fontWeight: 'bold', fontStyle: 'italic', color:'#0A4E52' }}>{"Calendar Synchronisation"}</Title>
                    </View>
                    <View style={{}}>
                        <Text style={{color:'gray',fontSize: 12,fontWeight: 'bold',fontStyle: 'italic',}}>{"This Activity Has Not Yet Been Added To Your Calendar ; Let's Add It To Your Calendar So That You Should Properly Reminded of IT."}</Text>
                    </View>
                    <View style={{ alignSelf: 'center', flexDirection: 'row',margin: '6%',width:"100%",}}>
                        <Button onPress={() => this.props.closed()} style={{ width: 100, 
                            marginRight: "9%", borderRadius: 10, alignItems: 'center', }} 
                        light><Text style={{ marginLeft: "15%"}}>Cancel</Text></Button>
                        <Button onPress={() => this.props.callback()} style={{ width: 100, 
                            alignItems: 'center', borderRadius: 10, }} success>
                        <Text style={{ marginLeft: "15%", }}>{"Sync"}</Text></Button>
                    </View>
                </Content>
             </ModalBox>
        );
    }
} 