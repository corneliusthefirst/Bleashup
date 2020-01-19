import React, { PureComponent } from 'react';
import { Content, Text, Button } from 'native-base';
import { View } from "react-native"
import Modal from "react-native-modalbox"

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
                animationDuration={0}
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
                    height: "40%",
                    borderRadius: 10, backgroundColor: '#FEFFDE', width: "90%"
                }}
            >
                <Content style={{ margin: "10%", flexDirection: 'column', }}>
                    <View style={{ width: "100%", height: 50 }}>
                        <Text style={{ fontSize: 30, alignSelf: 'center', fontWeight: 'bold', fontStyle: 'italic', }}>{this.props.title}</Text>
                    </View>
                    <View style={{ margin: '5%',  }}>
                        <Text style={{ color: 'grey'}}>{this.props.message}</Text>
                    </View>
                    <View style={{ alignSelf: 'flex-end', flexDirection: 'row', }}>
                        <Button onPress={() => this.props.closed()} style={{ width: 100, marginRight: 60, alignItems: 'center',borderRadius: 10, }} ><Text style={{marginLeft: "15%",}}>Cancel</Text></Button>
                        <Button onPress={() => {
                            this.props.callback()
                            this.props.closed()
                        }} style={{ width: 100, alignItems: 'center',borderRadius: 10, }}  danger><Text style={{ marginLeft: "15%", }}>{this.props.ok ? this.props.ok : "Leave"}</Text></Button>
                    </View>
                </Content>
            </Modal>
        );
    }
}