import React, { PureComponent } from "react";
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native";
import BleashupFlatList from "./BleashupFlatList";
import ProfileWithCheckBox from "./myscreens/currentevents/components/PofileWithCheckbox";
import { indexOf, reject, concat, find, findIndex } from "lodash";
import Menu, { MenuDivider, MenuItem } from "react-native-material-menu";
import bleashupHeaderStyle from "../services/bleashupHeaderStyle";
import BleashupModal from "./mainComponents/BleashupModal";
import ColorList from "./colorList";
import CreationHeader from "./myscreens/event/createEvent/components/CreationHeader";
import GState from "../stores/globalState";
import Texts from '../meta/text';
import Searcher from "./myscreens/Contacts/Searcher";
import { startSearching, cancelSearch, justSearch } from "./myscreens/eventChat/searchServices";
import globalFunctions from './globalFunctions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo  from 'react-native-vector-icons/Entypo';
import rounder from "../services/rounder";

export default class SelectableContactList extends BleashupModal {
    initialize() {
        this.state = {
            members: [],
        };
        this.startSearching = startSearching.bind(this)
        this.cancelSearch = cancelSearch.bind(this)
        this.search = justSearch.bind(this)
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
        let members = this.props.members
            ? this.props.members.filter((ele) => ele && ele.phone !== this.props.phone)
            : []
        this.setStatePure({
            members: members,
            checked: this.props.notcheckall
                ? members.filter(ele => ele && ele.phone == this.props.firstMember)
                : members,
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
    toggleCheckedAll(allChecked) {
        if (allChecked) {
            this.setStatePure({
                checked: []
            })
        } else {
            let members = this.props.members
                ? this.props.members.filter((ele) => ele.phone !== this.props.phone)
                : []
            this.setStatePure({
                checked: members
            })
        }
    }
    swipeToClose = false
    modalBody() {
        let data = this.state.members && this.state.members.filter(ele =>
            globalFunctions.filterForRelation(ele, this.state.searchString || ""))
        let allChecked = this.state.checked && this.state.members &&
            this.state.checked.length == this.state.members.length
        return (
            <View>
                <CreationHeader
                    title={this.state.searching ? "" : (this.props.title || Texts.select_members)}
                    back={this.onClosedModal.bind(this)}
                    extra={<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                        {!this.state.searching ? <View
                            style={{ marginHorizontal: "3%", }}>
                            <TouchableOpacity style={{
                                width:50,justifyContent: 'center',
                                flexDirection: 'row',
                            }} onPress={() => requestAnimationFrame(() => {
                                this.toggleCheckedAll(allChecked)
                            })}>
                                <MaterialIcons
                                    style={{
                                        ...GState.defaultIconSize,
                                    }}
                                    name={allChecked ? "radio-button-checked" : "radio-button-unchecked"}
                                />
                            </TouchableOpacity>
                        </View> : null}
                        <View style={{
                            height: 35,
                            width: this.state.searching ? "90%" : 35
                        }}>
                            <Searcher
                                searching={this.state.searching}
                                searchString={this.state.searchString}
                                startSearching={this.startSearching}
                                cancelSearch={this.cancelSearch}
                                search={this.search}
                            >
                            </Searcher>
                        </View>
                        {this.state.checked && this.state.checked.length > 0 && !this.state.searching ? <TouchableOpacity
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
                        style={{
                            marginLeft: 20,
                            ...rounder(35,ColorList.bodyDarkWhite),
                            justifyContent: 'center',
                        }}
                        >
                            <Entypo
                                name={"arrow-bold-right"}
                                style={{
                                    ...GState.defaultIconSize,
                                    color:ColorList.indicatorColor,
                                    fontSize: 22
                                }}
                            />
                        </TouchableOpacity> : null}
                    </View>}
                ></CreationHeader>
                <View style={{ height: ColorList.containerHeight - (ColorList.headerHeight + 20) }}>
                    {this.state.members.length <= 0 ? (
                        <Text
                            style={{
                                margin: "10%",
                            }}
                        >
                            {Texts.loading_data}
                        </Text>
                    ) : (
                            <BleashupFlatList
                                listKey={"contacts"}
                                keyExtractor={this._keyExtractor}
                                dataSource={data}
                                firstIndex={0}
                                renderPerBatch={7}
                                initialRender={15}
                                numberOfItems={data.length}
                                renderItem={(item, index) => {
                                    // console.error(item, "pppppp")
                                    this.delay = this.delay >= 15 ? 0 : this.delay + 1;
                                    return item ? (
                                        <View style={{ margin: "2%" }}>
                                            <ProfileWithCheckBox
                                                searchString={this.state.searchString}
                                                delay={this.delay}
                                                checked={findIndex(this.state.checked, { phone: item.phone }) >= 0}
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
