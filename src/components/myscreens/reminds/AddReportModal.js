
import React, { Component } from 'react';
import {
    Text, Icon, Item,
    Button,
} from "native-base";
import Textarea from 'react-native-textarea';
import { View, Dimensions, Keyboard } from 'react-native';
import Modal from 'react-native-modalbox';
import { ScrollView } from 'react-native-gesture-handler';

let { height, width } = Dimensions.get('window');

export default class AddReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            description: ''
        }
    }
    state = {

    }
    report() {
        this.props.report(this.state.description)
        Keyboard.dismiss()
    }
    onChangedEventDescription(value) {
        this.setState({ description: value })
    }
    render() {
        return (<Modal
            isOpen={this.props.isOpen}
            onClosed={() => this.props.onClosed(this.state.description)}
            style={{
                height: height / 3, borderRadius: 15, marginTop: "-3%",
                backgroundColor: "#FEFFDE", borderColor: 'black', borderWidth: 1, width: "98%",
            }}
            coverScreen={true}
            position={'bottom'}
            backButtonClose={true}
        //backdropPressToClose={false}
        >
            <View style={{ flex: 1, flexDirection: "column" }}>
                <View style={{ height: "15%" }}>
                    <Text style={{
                        alignSelf: 'flex-start', marginLeft: "1%", marginTop: "4%",
                        fontWeight: "500", fontSize: 18
                    }} note>say something about what you did </Text>
                </View>

                <View style={{ height: "65%" }}>
                    <Textarea containerStyle={{
                        width: "95%", margin: "1%",
                        height: 150,
                        borderRadius: 6, borderWidth: .7,
                        borderColor: "#1FABAB", alignSelf: 'center',
                        backgroundColor: "#f5fffa"
                    }} maxLength={200} style={{
                        margin: 1,
                        backgroundColor: "#f5fffa",
                        height: "95%", width: "98%"
                    }}
                        placeholder="Short Report Of Your Task/Remind" value={this.state.description} keyboardType="default"
                        onChangeText={(value) => this.onChangedEventDescription(value)} />

                </View>
                {this.state.description ? <View style={{ height: "10%", marginTop: ".5%" }}>
                    <View style={{
                        width: width / 4, height: "100%", alignSelf: "flex-end",
                        marginRight: "1%"
                    }} >
                        <Button onPress={() => this.props.report(this.state.description)} style={{
                            borderRadius: 8,
                            borderWidth: 1, marginRight: "2%", backgroundColor: "#FEFFDE",
                            borderColor: '#1FABAB', alignSelf: 'flex-end',
                            width: width / 4, height: height / 18, justifyContent: "center"
                        }}>
                            <Text style={{ color: "#1FABAB" }}>Report</Text>
                        </Button>
                    </View>
                </View> : null}
            </View>
        </Modal>)
    }
}