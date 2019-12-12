import React, { PureComponent } from 'react';
import { Content, Text, Button, Icon } from 'native-base';
import { View } from "react-native"
import Modal from "react-native-modalbox"

export default class PhotoInputModal extends PureComponent {
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
                    height: "50%",
                    borderRadius: 10, backgroundColor: '#FEFFDE', width: "90%"
                }}
            >
                <Content style={{ margin: "10%", flexDirection: 'column', }}>
                    <View style={{ width: "100%", height: 50 }}>
                        <Text style={{ fontSize: 30, alignSelf: 'center', fontWeight: 'bold', fontStyle: 'italic', }}>{"Select Action"}</Text>
                    </View>
                    <View style={{ margin: '5%', }}>
                        <Button onPress={() => this.props.showActivityPhoto()} transparent><Icon type={"Entypo"} name={"eye"}></Icon><Text>View Photo</Text></Button>
                        <Button onPress={() => this.props.openCamera()} transparent><Icon type={"MaterialIcons"} name={"insert-photo"}></Icon><Text>Select From Galery</Text></Button>
                        <Button onPress={() => this.props.openInternet()} transparent><Icon type={"Foundation"} name={"web"}></Icon><Text>Download From Web</Text></Button>
                    </View>
                </Content>
            </Modal>
        );
    }
}