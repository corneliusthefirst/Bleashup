import React, { Component } from 'react';

import { View } from "react-native"
import ModalBox from 'react-native-modalbox';
import { Button, Content, Text, Title } from 'native-base';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';

export default class CalendarSynchronisationModal extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <ModalBox
                backdropOpacity={0.7}
                backButtonClose={true}
                //backdropPressToClose={false}
                //swipeToClose={false}
                position='center'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                }}
                style={{
                    height: 160,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                     width: "70%"
                }}
            >
                <Content showsVerticalScrollIndicator={false} style={{
                    flexDirection: 'column',
                }}>
                    <View style={{
                        width: "100%",
                        height: 44,
                        alignSelf: 'center',
                    }}>
                        <View style={{
                            ...bleashupHeaderStyle,
                            paddingLeft: '1%',
                        }}><Title style={{
                            fontSize: 18,
                            alignSelf: 'center',
                            fontWeight: 'bold',
                            color: '#0A4E52'
                        }}>{"Calendar sync"}</Title>
                        </View>
                    </View>
                    <View style={{ margin: '3%', alignSelf: 'center', }}>
                        <Text style={{
                            color: 'gray',
                            fontSize: 12,
                        }}>{this.props.synced ?
                            'This activity is synced with your device calendar' :
                            'This activity is not yet synced with your calendar'}</Text>
                    </View>
                    <View style={{
                        alignSelf: 'center',
                        flexDirection: 'row',
                        marginTop: '6%',
                        width: "100%", marginLeft: '20%',
                    }}>
                        {this.props.synced ? <View style={{ width: '50%' }}>
                            <Button onPress={() => this.props.unsync()} style={{
                                borderRadius: 10, alignItems: 'center',
                            }}
                                light><Text>{"unsync"}</Text>
                            </Button>
                        </View> :
                            <View>
                                <Button onPress={() => this.props.callback()} style={{
                                    alignItems: 'center',
                                    borderRadius: 10,
                                }} success>
                                    <Text>{"sync"}</Text>
                                </Button>
                            </View>}
                    </View>
                </Content>
            </ModalBox>
        );
    }
} 