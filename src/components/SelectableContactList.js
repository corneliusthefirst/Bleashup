import React, { PureComponent } from "react";
import Modal from "react-native-modalbox";
import {
    Header,
    Left,
    Icon,
    Text,
    Label,
    Right,
    Title,
    Button,
} from "native-base";
import {
    View,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native";
import BleashupFlatList from "./BleashupFlatList";
import ProfileWithCheckBox from "./myscreens/currentevents/components/PofileWithCheckbox";
import { indexOf, reject, concat, find } from "lodash";
import Menu, { MenuDivider, MenuItem } from "react-native-material-menu";
import bleashupHeaderStyle from "../services/bleashupHeaderStyle";
import BleashupModal from "./mainComponents/BleashupModal";
import ColorList from "./colorList";
import CreationHeader from "./myscreens/event/createEvent/components/CreationHeader";

export default class SelectableContactList extends BleashupModal {
    initialize() {
        this.state = {
            members: [],
        };
    }
    componentDidMount() {
       this.openModalTimeout = setTimeout(
            () =>
                this.setStatePure({
                    checked: this.props.members,
                    members: this.props.members,
                    check: this.props.notcheckall ? false : true,
                }),
            200
        );
    }
    onOpenModal() {
        this.setStatePure({
            members: this.props.members
                ? this.props.members.filter((ele) => ele.phone !== this.props.phone)
                : [],
            checked: this.props.notcheckall
                ? []
                : this.props.members
                    ? this.props.members.filter((ele) => ele.phone !== this.props.phone)
                    : [],
            check: this.props.notcheckall ? false : true,
        });
    }
    onClosedModal() {
        this.setStatePure({
            members: [],
            checked: [],
            check: true,
        });
        this.props.close();
    }
    _keyExtractor = (item, index) => {
        return item ? item.phone : null;
    };
    delay = 0;
    swipeToClose=false
    modalBody() {
        return (
            <View>
                <CreationHeader
                    title={this.props.title || "select members"}
                    back={this.onClosedModal.bind(this)}
                    extra={<View style={{ marginBottom: 'auto', marginTop: 'auto', }}>
                        <TouchableOpacity
                            onPress={() =>
                                requestAnimationFrame(() => {
                                    this.props.removing
                                        ? this.props.saveRemoved(this.state.checked)
                                        : this.props.adding
                                            ? this.props.addMembers(this.state.checked)
                                            : this.props.takecheckedResult(this.state.checked);
                                    this.setStatePure({ checked: [] });
                                    this.props.close();
                                })
                            }
                        >
                            <Text
                                style={{ fontWeight: "bold", color: "#1FABAB", fontSize: 22 }}
                            >
                                {"OK"}
                            </Text>
                        </TouchableOpacity>
                    </View>}
                ></CreationHeader>
                <View style={{ height: ColorList.containerHeight - (ColorList.headerHeight + 20) }}>
                    {this.state.members.length <= 0 ? (
                        <Text
                            style={{
                                margin: "10%",
                            }}
                            note
                        >
                            {"sory! could not load members"}
                        </Text>
                    ) : (
                            <BleashupFlatList
                                listKey={"contacts"}
                                keyExtractor={this._keyExtractor}
                                dataSource={this.state.members}
                                firstIndex={0}
                                renderPerBatch={7}
                                initialRender={15}
                                numberOfItems={this.state.members.length}
                                renderItem={(item, index) => {
                                    // console.error(item, "pppppp")
                                    this.delay = this.delay >= 15 ? 0 : this.delay + 1;
                                    return item ? (
                                        <View style={{ margin: "2%" }}>
                                            <ProfileWithCheckBox
                                                delay={this.delay}
                                                checked={this.state.check}
                                                index={indexOf(this.state.checked, item.phone)}
                                                phone={item.phone}
                                                check={(phone) =>
                                                    this.setStatePure({
                                                        checked: concat(this.state.checked, [
                                                            find(this.state.members, { phone: phone }),
                                                        ]),
                                                        check: true,
                                                    })
                                                }
                                                uncheck={(phone) =>
                                                    this.setStatePure({
                                                        checked: reject(this.state.checked, { phone: phone }),
                                                        check: false,
                                                    })
                                                }
                                            ></ProfileWithCheckBox>
                                            <MenuDivider color="#1FABAB" />
                                        </View>
                                    ) : null;
                                }}
                            ></BleashupFlatList>
                        )}
                </View>
            </View>
        );
    }
}
