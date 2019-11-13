import React, { Component } from 'react';
import Modal from "react-native-modalbox"
import { Header, Left, Icon, Text, Label, Right, Title } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { View, TouchableWithoutFeedback } from 'react-native';
import BleashupFlatList from './BleashupFlatList';
import ProfileWithCheckBox from './myscreens/currentevents/components/PofileWithCheckbox';
import { indexOf, reject, concat,find } from "lodash"
export default class SelectableContactList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            members: []
        }
    }
    state = {

    }
    componentDidMount() {
        console.warn("executing component Did mount")
        setTimeout(() =>
            this.setState({
                checked: this.props.members,
                members: this.props.members,
                check: true
            })
            , 200)
    }
    _keyExtractor = (item, index) => item.phone;
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
                        members: this.props.members,
                        checked:this.props.members
                    })
                }}
                style={{
                    height: this.state.inviteViaEmail ? "30%" : "100%",
                    borderRadius: 8,
                    backgroundColor: "#FEFFDE",
                    width: "100%"
                }}
            ><Header>
                    <Left style={{ width: "90%" }}>
                        <Title>Select Members </Title>
                    </Left>
                    <Right>
                        <TouchableWithoutFeedback onPress={() => requestAnimationFrame(() => {
                            this.props.takecheckedResult(this.state.checked)
                            this.setState({
                                checked: [],

                            })
                        })
                        }>
                            <Icon
                                style={{ color: "#FEFFDE" }}
                                type="AntDesign"
                                name="checkcircle"
                            />
                        </TouchableWithoutFeedback>
                    </Right>
                </Header>
                <View >
                    {this.state.members.length <= 0 ? <Text style={{
                        margin: '10%',
                    }} note>{"sory! could not load members"}</Text> : <BleashupFlatList
                        listKey={"contacts"}
                        keyExtractor={this._keyExtractor}
                        dataSource={this.state.members}
                        firstIndex={0}
                        renderPerBatch={7}
                        initialRender={15}
                        numberOfItems={this.state.members.length}
                        renderItem={(item, index) =>
                            <View>
                                <ProfileWithCheckBox checked={this.state.check}
                                    index={indexOf(this.state.checked, item.phone)} phone={item.phone} check={(phone) =>
                                        this.setState({
                                            checked: concat(this.state.checked, [find(this.state.contacts, { phone: phone })]),
                                            check: true
                                        })
                                    }
                                    uncheck={(phone) =>
                                        this.setState({ checked: reject(this.state.checked, { phone: phone }), check: false })
                                    }></ProfileWithCheckBox>
                            </View>
                        }
                    /* refreshControl={
                       <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />
                     }*/
                    ></BleashupFlatList>}
                </View>
            </Modal>
        );
    }
} 