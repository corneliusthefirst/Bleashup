import React, { PureComponent } from "react"
import Modal from "react-native-modalbox"
import { View, TouchableOpacity } from 'react-native';
import BleashupFlatList from "../../BleashupFlatList";
import { Spinner, Text, Button, Icon } from 'native-base';
import stores from '../../../stores';
import ForeignEvent from "./ForeignEvent";
import request from '../../../services/requestObjects';
import HomeRequest from './HomeRequester';
export default class ForeignEventsModal extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            loaded: false,
        };
    }
    state = {}
    componentDidMount() {
        setTimeout(() => {

        }, 20)
    }
    manageHere(e) {
    }
    inviteConcernee(e) {
        console.warn(e)
    }
    _keyExtractor(item) {
        return item.phone
    }
    render() {
        return (
            <Modal
                backdropPressToClose={false}
                //swipeToClose={false}
                backdropOpacity={0.7}
                backButtonClose={true}
                //entry={"top"}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.onClosed()
                    this.setState({
                        participants: [],
                        selected: [],
                        loaded: false,
                        event_id: null,
                        hideTitle: false
                    })
                }}
                onOpened={() => {
                    stores.Contacts.getContacts().then(contacts => {
                        setTimeout(() => {
                            this.setState({
                                events: this.props.events,
                                loaded: true,
                            })
                        }, 20)
                    })
                }}
                style={{
                    height: "97%",
                    borderRadius: 8, backgroundColor: '#FEFFDE', width: "100%"
                }}>
                <View>{this.state.loaded ?
                    <View>
                        <View style={{
                            width: "99%", height: 44, margin: '2%',
                            borderBottomWidth: .8, borderColor: "#1FABAB"
                        }}>
                            <Text style={{
                                fontWeight: 'bold', fontStyle: 'italic',
                                fontSize: 24,
                            }}>{"Events From Calendar"}</Text><Text note style={{
                                fontSize: 14, fontStyle: 'italic', marginLeft: "0%",
                            }}>{"Some Events where Found from Your Calendar Manage Them From Here"}</Text></View>
                        <View style={{ height: "90%" }}>
                            <BleashupFlatList
                                firstIndex={0}
                                renderPerBatch={5}
                                initialRender={10}
                                numberOfItems={this.state.events.length}
                                keyExtractor={this._keyExtractor}
                                dataSource={this.state.events}
                                renderItem={(item, index) =>
                                    <View style={{ margin: '1%' }}>
                                        <ForeignEvent inviteConcernee={(e) => this.inviteConcernee(e)} manageHere={(e) => this.manageHere(e)} event={item}>
                                        </ForeignEvent>
                                    </View>
                                }
                            >
                            </BleashupFlatList></View></View> : <Spinner size={"small"}></Spinner>}
                </View>
            </Modal>

        );
    }
}