import React, { PureComponent } from "react"
import {
    View,
    TouchableWithoutFeedback,
    TextInput,
    StatusBar,
    TouchableOpacity,
    Text
} from 'react-native';
import Modal from "react-native-modalbox"
import  EvilIcons  from 'react-native-vector-icons/EvilIcons';
import  AntDesign  from 'react-native-vector-icons/AntDesign';
export default class EditNameModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            publicStatus: false,
            commiteeName: this.props.value
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
        } else if (data === this.props.value) {
            this.setState({
                updatedNameError: true
            })
            return false
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
                backdropPressToClose={true}
                backdropOpacity={0.4}
                //swipeToClose={false}
                backButtonClose={true}
                entry={"top"}
                position={"bottom"}
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
                    height: "55%",
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    commiteeName: "",
                    width: "100%"
                }}
            >
                <StatusBar animated={true} barStyle="dark-content"></StatusBar>
                <View>
                    <View style={{ display: 'flex', flexDirection: 'row', marginBottom: "10%", }}>
                        <EvilIcons style={{ color: "#0A4E52", fontSize: 35, marginRight: "5%", marginTop: "1%", }} name={"pencil"}/>
                        <Text style={{ fontSize: 25, fontWeight: '400', }}>{"Edit Committee Name"}</Text>
                    </View>
                    <Text style={{ fontSize: 12, }}> the commitee name should not be greaterthan 20 characters.</Text>
                    {this.state.commiteeNameErrror ? <Text style={{ color: "red", fontWeight: 'bold', }} note>{"the commitee name cannot be empty"}</Text> : null}
                    {this.state.showGenralNameError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note> the commitee name cannot be same as General.</Text> : null}
                    {this.state.nameTooLongError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>the name is too long.</Text> : null}
                    {this.state.updatedNameError ? <Text style={{ color: "#A91A84", fontWeight: 'bold', }} note>updated name cannot be same as current commitee name.</Text> : null}

                    <View>
                        <TextInput maxLength={20} style={{ width: "100%" }} value={this.state.commiteeName} onChangeText={(text) => {
                            this.setState({
                                commiteeName: text
                            })
                            this.validator(text)
                        }} placeholder="Committee Name" />
                    </View>
                    <View style={{ marginLeft: "90%", marginTop: "5%", }}>
                        <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                            if (this.validator(this.state.commiteeName)) this.props.editName(this.state.commiteeName)
                        })}>
                            <AntDesign name="checkcircle" style={{
                                color: "#1FABAB",
                                fontSize: 30,
                            }} type="AntDesign"/>
                            <Text style={{
                                color: "#1FABAB",
                                fontSize: 14,
                                fontWeight: 'bold',
                                marginLeft: "15%",
                            }}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        );
    }
}