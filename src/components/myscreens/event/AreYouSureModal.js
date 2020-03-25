import React, { PureComponent } from 'react';
import { Content, Text, Button } from 'native-base';
import { View } from "react-native"
import Modal from "react-native-modalbox"
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';

export default class AreYouSure extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }
    state = {}
    render() {
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='center'
                coverScreen={true}
                //animationDuration={0}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                    this.setState({
                        message: null,
                        title: null,
                        callback: null,
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            content: this.props.content
                        })
                    }, 20)
                }}
                style={{
                    height: 200,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: '#FEFFDE',
                    width: 300
                }}
            >
                <Content style={{ flexDirection: 'column', }}>
                    <View style={{ width: "100%", height: 44 }}>
                        <View style={{...bleashupHeaderStyle,paddingLeft: '1%',}}>
                            <Text style={{ fontSize: 20, alignSelf: 'center', fontWeight: '400',  }}>{this.props.title}</Text>
                        </View>
                    </View>
                    <View style={{ margin: '5%', }}>
                        <Text style={{ color: 'grey' }}>{this.props.message}</Text>
                    </View>
                    <View style={{ marginLeft: '10%', flexDirection: 'row', }}>
                    <View style={{width:'50%'}}>
                        <Button onPress={() => this.props.closed()} 
                        style={{  alignItems: 'center', 
                        borderRadius: 10, }} ><Text>Cancel</Text></Button>
                        </View>
                        <View style={{width:'50%'}}><Button onPress={() => {
                            this.props.callback()
                            this.props.closed()
                        }} style={{ alignItems: 'center',
                         borderRadius: 10, }} danger><Text>{this.props.ok ? this.props.ok : "Leave"}</Text></Button>
                        </View>
                    </View>
                </Content>
            </Modal>
        );
    }
}