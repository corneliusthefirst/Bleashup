import React, { PureComponent } from "react";
import ModalBox from "react-native-modalbox";
import { Container, Spinner, Text, Item } from "native-base";
import BleashupFlatList from "../../BleashupFlatList";
import ProfileView from "../invitations/components/ProfileView";
import { TouchableOpacity, View } from "react-native";
import IntervalSeparator from "../reminds/IntervalSeparator";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import ColorList from "../../colorList";
import BleashupModal from "../../mainComponents/BleashupModal";
import CreationHeader from "./createEvent/components/CreationHeader";

export default class ContactListModal extends BleashupModal {
    constructor(props) {
        super(props);
    }
    initialize() {
        this.state = {
            loaded: false,
            contacts: [],
        };
    }
    state = {};
    _keyExtractor(item) {
        return item && item.phone ? item.phone : item;
    }
    onOpenModal() {
        setTimeout(() => {
            this.setState({
                contacts: this.props.contacts,
                //event_id: this.props.event_id,
                loaded: true,
                //hideTitle: this.props.hideTitle
            });
        }, 100);
    }
    onClosedModal() {
        this.props.onClosed();
    }
    delay = 0;
    modalBody() {
        return (
            <View>
                <View>
                    <CreationHeader 
                    back={this.onClosedModal.bind(this)}
                    title={this.props.title ? this.props.title : ""}>
                    </CreationHeader>
                </View>
                {this.state.loaded ? (
                    <View style={{ height: "95%" }}>
                        <BleashupFlatList
                            firstIndex={0}
                            renderPerBatch={20}
                            initialRender={20}
                            numberOfItems={this.props.contacts.length}
                            keyExtractor={this._keyExtractor}
                            dataSource={this.props.contacts}
                            renderItem={(item, index) => {
                                this.delay = this.delay >= 15 ? 0 : this.delay + 1;
                                return this.props.complexReport ? (
                                    <View key={index.toString()}>
                                        {item.type === "interval" ? (
                                            <IntervalSeparator
                                                to={item.to}
                                                actualInterval={
                                                    this.props.actualInterval &&
                                                    item.from === this.props.actualInterval.start &&
                                                    item.to === this.props.actualInterval.end
                                                }
                                                first={index === 0 ? true : false}
                                                from={item.from}
                                            ></IntervalSeparator>
                                        ) : (
                                                <Item style={{ margin: "1%" }} key={index.toString()}>
                                                    <View style={{ display: "flex", flexDirection: "row" }}>
                                                        <View style={{ margin: "2%", height: 60 }}>
                                                            <ProfileView
                                                                delay={this.delay}
                                                                phone={item}
                                                            ></ProfileView>
                                                        </View>
                                                    </View>
                                                </Item>
                                            )}
                                    </View>
                                ) : (
                                        <Item style={{ margin: "1%" }} key={index.toString()}>
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                <View style={{ margin: "2%", height: 60 }}>
                                                    <ProfileView
                                                        delay={this.delay}
                                                        phone={item}
                                                    ></ProfileView>
                                                </View>
                                            </View>
                                        </Item>
                                    );
                            }}
                        ></BleashupFlatList>
                    </View>
                ) : null}
            </View>
        );
    }
}
