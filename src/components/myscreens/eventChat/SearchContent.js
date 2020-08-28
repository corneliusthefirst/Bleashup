import React from "react"
import BeComponent from '../../BeComponent';
import BleashupFlatList from '../../BleashupFlatList';
import { View, TouchableOpacity, TextInput } from 'react-native';
import ProfileSimple from '../currentevents/components/ProfileViewSimple';
import ActivityProfile from '../currentevents/components/ActivityProfile';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import globalFunctions from '../../globalFunctions';
import ColorList from '../../colorList';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import rounder from '../../../services/rounder';
import getRelation from '../Contacts/Relationer';
import Requester from './Requester';
import { reject } from 'lodash';
import Toaster from "../../../services/Toaster";
import Texts from '../../../meta/text';

export default class SearchContent extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {
            users: this.props.users,
            activity: this.props.activity,
            searchString:"",

        }
    }
    changeSeachString(e) {
        this.setStatePure({
            searchString: e.nativeEvent.text,
        });
    }
    sendTo(user) {
        if (!this.sending) {
            this.sending = true;
            getRelation(user).then((relation) => {
                Requester.sendMessage(
                    this.props.message,
                    relation.id,
                    relation.id,
                    true
                )
                    .then((response) => {
                        this.setStatePure({
                            users: reject(this.state.users, { phone: user.phone }),
                        });
                        this.sending = false;
                    })
                    /*.catch((error) => {
                        this.toastError()
                        this.sending = false;
                    });*/
            });
        }
    }
    sendToActivity(item) {
        if (!this.sending) {
            this.sending = true;
            Requester.sendMessage(this.props.message, item.id, item.id, true)
                .then((response) => {
                    this.setStatePure({
                        activity: reject(this.state.activity, { id: item.id }),
                    });
                    this.sending = false
                })
                .catch(() => {
                    this.sending = false;
                    this.toastError()
                });
        } else {
            Toaster({ text: "app busy! " });
        }
    }
    toastError(){
        Toaster({ text: Texts.cannot_send_message });
    }
    searching = true;

    searchHeader() {
        return (
            <View
                style={{
                    width: "100%",
                    height: 35,
                }}
            >
                    <View
                        style={{
                            marginTop: 5,
                            height: 30,
                            borderRadius: 20,
                            borderWidth: .8,
                            borderColor: ColorList.bodyIcon,
                            marginBottom: "auto",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "70%",
                        }}
                    >
                        <TextInput
                            maxLength={30}
                            value={this.state.searchString}
                            onChange={this.changeSeachString.bind(this)}
                            autoFocus
                            style={{
                                width: "100%",
                                fontSize: 12,
                                height: 35,
                            }}
                            placeholder={Texts.search_in_your_contact}
                        ></TextInput>
                    </View>
            </View>
        );
    }
    render() {
        let type = this.props.type
        let items = !type
            ? this.state.users
                ? globalFunctions.returnUserSearch(
                    this.state.users,
                    this.state.searchString
                )
                : []
            : globalFunctions.searchInActivities(
                this.state.activity,
                this.state.searchString
            );
        return <View>
            <View>{this.searchHeader()}</View>
            <View style={{
                height: "90%",
                width: "95%",
                alignSelf: 'center',
                marginTop: "auto",
            }}>
                <BleashupFlatList
                    fit
                    firstIndex={0}
                    initialRender={7}
                    renderPerBatch={20}
                    numberOfItems={items.length}
                    keyboardShouldPersistTaps={"always"}
                    dataSource={items}
                    keyExtractor={(item, index) => item.phone}
                    renderItem={(item, index) => (
                        <View
                            style={{
                                width: "95%",
                                flexDirection: "row",
                                alignSelf: "center",
                                height: ColorList.headerHeight - 5,
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    marginTop: "auto",
                                    marginBottom: "auto",
                                    width: 250,
                                    justifyContent: "flex-start",
                                }}
                            >
                                {!type ? (
                                    <ProfileSimple
                                        profile={item}
                                        searching
                                        searchString={this.state.searchString}
                                    ></ProfileSimple>
                                ) : (
                                        <ActivityProfile
                                            small
                                            searching
                                            searchString={this.state.searchString}
                                            Event={item}
                                        ></ActivityProfile>
                                    )}
                            </View>
                            <TouchableOpacity
                                onPress={() =>
                                    requestAnimationFrame(() =>
                                        type ? this.sendToActivity(item) : this.sendTo(item)
                                    )
                                }
                                style={{
                                    marginBottom: "auto",
                                    marginTop: "auto",
                                    justifyContent: "center",
                                    ...rounder(30, ColorList.indicatorColor),
                                }}
                            >
                                <MaterialIcons
                                    style={{
                                        fontSize: 15,
                                        alignSelf: "center",
                                        color: ColorList.bodyBackground,
                                    }}
                                    type={"MaterialIcons"}
                                    name={"send"}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                ></BleashupFlatList>
            </View>
        </View>
    }
}