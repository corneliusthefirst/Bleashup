import React, { PureComponent } from "react"
import {
    View,
    TouchableWithoutFeedback,
    TextInput,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import { Container, Content, Form, Item, Input, Icon, Text, Label } from 'native-base';
import Modal from "react-native-modalbox"
export default class CreateCommiteeModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            publicStatus: false
        }
    }
    validator(data) {
        if (data === "" || !data) {
            this.setState({
                commiteeNameErrror: true
            })
            return false
        } else if (data.toLowerCase() == "Generale".toLowerCase()) {
            this.setState({
                showGenralNameError: true
            })
            return false
        } else if (data.length > 20) {
            this.setState({
                nameTooLongError: true
            })
        } else {
            this.setState({
                nameTooLongError: false,
                showGenralNameError: false,
                commiteeNameErrror: false
            })
            return true
        }
    }
    state = {}
    render() {
        return (
            <Modal
                backdropPressToClose={false}
                backdropOpacity={0.7}
                //swipeToClose={false}
                backButtonClose={true}
                entry={"top"}
                position={"top"}
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.setState({
                        commiteeNameErrror: false,
                        commiteeName: "",
                        publicState: false
                    })
                    this.props.close()
                }
                }
                onOpened={() => {
                }}
                style={{
                    height: 300,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    backgroundColor: "#FEFFDE",
                    commiteeName: "",
                    width: "100%"
                }}
            >
                <StatusBar barStyle="dark-content"></StatusBar>
                <View>
                    <View><Text style={{ fontSize: 30, fontWeight: '400', marginBottom: "5%", marginLeft: "10%", }}>{"Create A Commitee"}</Text></View>
                    <Text style={{ fontSize: 12, }}> the commitee name should not be greaterthan 20 characters</Text>
                    {this.state.commiteeNameErrror ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>{"the commitee name cannot be empty"}</Text> : null}
                    {this.state.showGenralNameError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note> the commitee name cannot be same as General</Text> : null}
                    {this.state.nameTooLongError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>the name is too long</Text> : null}
                    <Item>
                        <TextInput style={{ width: "100%" }} onChangeText={(text) => {
                            this.setState({
                                commiteeName: text
                            })
                            this.validator(text)
                        }} placeholder="Commitee Name" />
                    </Item>
                    <Item>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            this.setState({ publicStatus: !this.state.publicStatus })
                        })}>
                            <View style={{ margin: '3%',width:"100%" }}>
                                <View style={{
                                    display: "flex",
                                    flexDirection: 'row',
                                }}>
                                    <Icon style={{ color: "#1FABAB" }} name={this.state.publicStatus ? "radio-button-checked" :
                                        "radio-button-unchecked"} type="MaterialIcons"></Icon>

                                    <Text style={{ marginLeft: "10%", marginTop: "1%", fontSize: 14, fontWeight: "bold" }}>
                                        Tobe accessible by any participant ?
                      </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Item>
                    <View style={{ marginLeft: "90%", marginTop: "4%", }}>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            if (this.validator(this.state.commiteeName)) this.props.createCommitee({ publicState: this.state.publicStatus, commiteeName: this.state.commiteeName })
                        })}>
                            <Icon name="checkcircle" style={{
                                color: "#1FABAB",
                                fontSize: 30,
                            }} type="AntDesign"></Icon>
                            <Label style={{ color: "#1FABAB", fontSize: 14, marginLeft: "10%", fontWeight: 'bold', }}>Next</Label>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}