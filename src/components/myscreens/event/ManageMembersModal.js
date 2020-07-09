import React from "react";
import { View, TouchableOpacity } from "react-native";
import BleashupFlatList from "../../BleashupFlatList";
import { Spinner, Text, Button, Icon } from "native-base";
import { findIndex, reject, uniqBy } from "lodash";
import stores from "../../../stores";
import SelectableProfileWithOptions from "./SelectableProfileWithOption";
import emitter from "../../../services/eventEmiter";
import CacheImages from "../../CacheImages";
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import BleashupModal from "../../mainComponents/BleashupModal";
import ColorList from '../../colorList';
import CreationHeader from "./createEvent/components/CreationHeader";
export default class ManageMembersModal extends BleashupModal {
    initialize() {
        this.state = {
            isOpen: false,
            loaded: false,
            participants: [],
            event_id: null,
            selected: [],
        };
    }

    toggleMaster(memberPhone) {
        this.setStatePure({
            selected: this.state.selected.map((ele) =>
                ele.phone === memberPhone ? { ...ele, master: !ele.master } : ele
            ),
        });
    }
    apply() {
        this.props.bandMembers(this.state.selected);
        emitter.once("parti_removed", () => {
            this.setStatePure({
                contacts: reject(
                    this.state.contacts,
                    (ele) => findIndex(this.state.selected, { phone: ele.phone }) >= 0
                ),
            });
        });
    }
    addMember(member) {
        this.setStatePure({
            selected: [...this.state.selected, member],
        });
    }
    remove(memberPhone) {
        this.setStatePure({
            selected: reject(this.state.selected, { phone: memberPhone }),
        });
    }
    _keyExtractor(item) {
        return item.phone;
    }
    onClosedModal() {
        this.props.onClosed();
        this.setStatePure({
            participants: [],
            selected: [],
            contacts: [],
            loaded: false,
            event_id: null,
            hideTitle: false,
        });
    }
    onOpenModal() {
       this.openModalTimeout = setTimeout(() => {
            this.setStatePure({
                contacts: uniqBy(this.props.participants, "phone").filter(
                    (ele) =>
                        !Array.isArray(ele) &&
                        ele &&
                        ele.phone !== stores.LoginStore.user.phone
                ),
                event_id: this.props.event_id,
                loaded: true,
                hideTitle: this.props.hideTitle,
            });
        }, 10);
    }
    delay = 0;
    swipeToClose=false
    modalBody() {
        return (
            <View>
                {this.state.loaded ? (
                    <View>
                        <View
                            style={{
                                width: "100%",
                                height: ColorList.headerHeight,
                            }}
                        >
                            <CreationHeader back={this.onClosedModal.bind(this)} title={"Remove Members"} 
                            extra={<View style={{ 
                                flexDirection: 'row',
                                marginBottom: 'auto',
                                marginTop: 'auto',
                                alignSelf: 'flex-end',
                            }}>
                                {this.state.selected.length > 0 && this.props.master ? (
                                    <TouchableOpacity
                                        style={{ marginTop: 'auto', marginBottom: 'auto', marginRight: "2%" }}
                                        onPress={() => requestAnimationFrame(() => this.apply())}
                                    >
                                        <Text style={{ color: "red", fontWeight: "bold" }}>
                                            {"Ban"}
                                        </Text>
                                    </TouchableOpacity>
                                ) : null}
                            </View>} ></CreationHeader>
                        </View>
                        <View style={{ height: "93%", margin: "2%" }}>
                            <BleashupFlatList
                                firstIndex={0}
                                renderPerBatch={5}
                                initialRender={20}
                                numberOfItems={this.state.contacts.length}
                                keyExtractor={this._keyExtractor}
                                dataSource={this.state.contacts}
                                renderItem={(item, index) => {
                                    this.delay = this.delay >= 15 ? 0 : this.delay + 1;
                                    return (
                                        <SelectableProfileWithOptions
                                            delay={this.delay}
                                            toggleMaster={(member) => this.toggleMaster(member)}
                                            selected={(member) => {
                                                this.addMember(member);
                                            }}
                                            changeMasterState={(newState) =>
                                                this.props.changeMasterState(newState)
                                            }
                                            checkActivity={(member) =>
                                                this.props.checkActivity(member)
                                            }
                                            creator={this.props.creator}
                                            mainMaster={this.props.master}
                                            unselected={(member) => this.remove(member)}
                                            key={index}
                                            contact={item}
                                        ></SelectableProfileWithOptions>
                                    );
                                }}
                            ></BleashupFlatList>
                        </View>
                    </View>
                ) : (
                        <Spinner size={"small"}></Spinner>
                    )}
            </View>
        );
    }
}
