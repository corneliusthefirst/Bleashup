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
        return item.id
    }
    render() {
        return (
            <Modal
                backdropPressToClose={true}
                swipeToClose={false}
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
                        setTimeout(() => {
                            this.setState({
                                events: this.props.events,
                                loaded: true,
                            })
                        }, 20)
                }}
                style={{
                    height: "95%",borderTopLeftRadius: 8,borderTopRightRadius: 8
                    , width: "100%"
                }}>
                <View>{this.state.loaded ?
                    <View>
                        <View style={{
                            width: "100%", height: 44, margin: '2%',opacity:.8,
                            borderBottomWidth: .8, borderColor: "#1FABAB",alignSelf: 'center',paddingLeft: '2%',
                        }}>
                            <Text style={{ color: '#A91A84', fontWeight: 'bold' }} note>{"sync"}</Text>
                            <View style={{flexDirection: 'row',}}><Text style={{
                                fontWeight: 'bold',
                                fontSize: 18,
                            }}>{"Manage events"}</Text><Text note style={{
                                fontSize: 12, fontStyle: 'italic', margin: '1%',
                            }}>{"(events from your calendar)"}</Text></View>
                            </View>
                        <View style={{ height: "90%" }}>
                            <BleashupFlatList
                                firstIndex={0}
                                renderPerBatch={5}
                                initialRender={10}
                                numberOfItems={this.state.events.length}
                                keyExtractor={this._keyExtractor}
                                dataSource={this.state.events}
                                renderItem={(item, index) =>
                                    <View key={index} style={{ margin: '1%' }}>
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