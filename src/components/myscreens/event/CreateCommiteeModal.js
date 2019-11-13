import React, { Component } from "react"
import { View, TouchableWithoutFeedback, TextInput, StatusBar } from 'react-native';
import { Container, Content, Form, Item, Input, Icon, Text } from "native-base";
import Modal from "react-native-modalbox"
export default class CreateCommiteeModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            publicStatus: false
        }
    }
    state = {}
    render() {
        return (
            <Modal
                backdropPressToClose={false}
                backdropOpacity={0.7}
                swipeToClose={false}
                backButtonClose={true}
                position={"top"}
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => this.props.close()}
                onOpened={() => {
                    this.setState({
                        publicStatus: true
                    })
                }}
                style={{
                    height: "30%",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: "#FEFFDE",
                    width: "100%"
                }}
            >
                <StatusBar barStyle="dark-content"></StatusBar>
                <View>
                    <Text note> the commitee name should not be greaterthan 50 characters</Text>
                    <Item>
                        <TextInput onChangeText={(text) => {
                            this.setState({
                                commiteeName: text
                            })
                        }} placeholder="Commitee Name" />
                    </Item>
                    <Item>
                        <View style={{ margin: '3%', }}>
                            <View style={{
                                display: "flex",
                                flexDirection: 'row',
                            }}>
                                <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => this.setState({ publicStatus: !this.state.publicStatus }))}>
                                    <Icon style={{ color: "#1FABAB" }} name={this.state.publicStatus ? "radio-button-checked" :
                                        "radio-button-unchecked"} type="MaterialIcons"></Icon>
                                </TouchableWithoutFeedback>
                                <Text style={{ marginLeft: "10%", marginTop: "1%", fontWeight: "bold" }}>
                                    Tobe accessible by any participant ?
                      </Text>
                            </View>
                        </View>
                    </Item>
                    <View style={{ marginLeft: "80%", marginTop: "5%", }}>
                        <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => {
                            this.props.createCommitee({publicState:this.state.publicStatus,commiteeName:this.state.commiteeName})
                        })}>
                            <Icon name="checkcircle" style={{
                                color: "#1FABAB",
                                fontSize: 40,
                            }} type="AntDesign"></Icon>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </Modal>
        );
    }
}