import React, { Component } from 'react';
import { Text, Badge, Icon, Label, Spinner, Toast, Thumbnail, Title } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import stores from '../../../stores';
import { View, TouchableWithoutFeedback } from 'react-native';
import { find,isEqual } from "lodash"
import EditNameModal from './EditNameModal';
import emitter from '../../../services/eventEmiter';
import { observer } from 'mobx-react';
import GState from '../../../stores/globalState';
import firebase from 'react-native-firebase';
import Image from 'react-native-scalable-image';
import CacheImages from '../../CacheImages';
import ChatStore from '../../../stores/ChatStore';
import testForURL from '../../../services/testForURL';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import shadower from '../../shadower';
import ColorList from '../../colorList';
import convertToHMS from '../highlights_details/convertToHMS';

export default class CommiteeItem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loaded: false,
            isEditNameModelOpened: false
        }
    }
    state = {

    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.props.newMessagesCount !== nextProps.newMessagesCount ||
            this.state.newThing !== nextState.newThing || this.props.ImICurrentCommitee !== nextProps.ImICurrentCommitee ||
            this.props.commitee && this.props.commitee.name !== nextProps.commitee.name || 
            this.props.commitee && nextProps.commitee && this.props.commitee.public_state !== nextProps.commitee.public_state ||
            this.props.commitee && nextProps.commitee && this.props.commitee.member && 
            nextProps.commitee.member && this.props.commitee.member.length !== nextProps.commitee.member.length 
             || this.state.loaded !== nextState.loaded
    }
    componentDidUpdate() {
        this.calculateCommittee()
    }
    componentDidMount() {
        this.calculateCommittee()
    }
    calculateCommittee() {
        let member = this.props.commitee &&
            this.props.commitee.member &&
            find(this.props.commitee.member, (ele) => ele !== null &&
                ele.phone === this.props.phone)
        setTimeout(() => {
            this.setState({
                master: member ? this.props.computedMaster : false,
                loaded: true,
                joint: member ? true : false
            })
        }, 50)
    }
    revertName() {
        // console.warn("edit failed message recieved!!")
        this.setState({
            newThing: !this.state.newThing
        })
        this.swap()
    }
    publish() {
        this.props.publishCommitee(this.props.commitee.id, !this.props.commitee.public_state)
        /*emitter.once('published', state => {
            this.setState({
                newThing: !this.state.newThing
            })
        })*/
    }
    join() {
        return new Promise((resolve, reject) => {
            if (this.props.commitee.public_state && !this.state.joint) {
                this.props.join(this.props.commitee.id)
                emitter.on("joint", () => {
                    this.setState({
                        joint: true
                    })
                    resolve()
                    //this._accordion.setSelected(-1);
                })
            } else {
                Toast.show({ text: "Cannot join this commitee; It is not opened to you" })
                reject()
            }
        })
    }
    leave() {
        if (this.state.joint) {
            this.props.leave(this.props.commitee.id)
            emitter.on("left", () => {
                this.setState({
                    left: true
                })
            })
        }
    }
    addMembers() {
        this.props.addMembers(this.props.commitee.id, this.props.commitee.member)
    }
    removeCommitee() {
        this.props.removeMember(this.props.commitee.id, this.props.commitee.member)
    }
    editName(newName) {
        /*this.previousName = this.props.commitee.name
        this.setState({
            commitee: { ...this.props.commitee, name: newName },
            isEditNameModelOpened: false,
            newThing: !this.state.newThing
        })*/
        this.props.editName(newName, this.props.commitee.id)
        /*emitter.once("edit-failed", () => {
            this.revertName()
        })*/
    }
    swap() {
        GState.currentRoomNewMessages = this.props.commitee.new_messages
        //GState.currentCommitee = this.props.commitee.id
        this.props.swapChats(this.props.commitee)
        //emitter.emit("current_commitee_changed", this.props.id)
        let phone = stores.LoginStore.user.phone.replace("00", "+");
        firebase.database().ref(`new_message/${phone}/${this.props.id}/new_messages`).set([])
        this.setState({
            newThing: !this.state.newThing
        })
    }
    swappCommitee() {
        if (this.accessible) {
            if (!this.state.joint) {
                this.join().then(() => {
                    this.swap()
                })
            } else {
                this.swap()
            }
        }
    }
    setActionPercentage() {
        actionsNumber = () => {
            if (this.state.master && this.props.commitee.public_state) {
                return 5
            } else if (!this.state.master && !this.props.commitee.public_state) {
                return 1
            } else if (!this.state.master && this.props.commitee.public_state && !this.state.joint) {
                return 2
            }
        }
    }
    formNickName(user) {
        return user.phone == stores.LoginStore.user.phone.replace("00", "+") ? "You" : user.nickname
    }
    toMB(data) {
        mb = 1000 * 1000
        return (data / mb).toFixed(2).toString() + "MB";
    }
    writeText(text) {
        return text ? <Text elipsizeMode={'tail'} numberOfLines={1} style={{ fontSize: 14, marginTop: "1%", alignSelf: 'flex-start', }}>{" : "}{text}</Text> : null
    }
    writeLatestMessage(message) {
        switch (message.type) {
            case "text":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Text elipsizeMode={'tail'} numberOfLines={1} style={{ fontWeight: "bold", fontSize: 16, color: ColorList.bodyText, width: '20%' }}>{this.formNickName(message.sender)}</Text>
                    <View style={{ width: '80%', alignSelf: 'flex-start', }}>
                        {this.writeText(message.text)}
                    </View>
                </View>
            case "photo":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Text elipsizeMode={'tail'} numberOfLines={1} style={{
                        fontWeight: "bold", fontSize: 16,
                        color: ColorList.bodyText, width: '30%', alignSelf: 'flex-start',
                    }}>{this.formNickName(message.sender)}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: "1%", width: '70%' }}>
                        <View style={{ width: '70%', alignSelf: 'flex-start', }}>
                            {this.writeText(message.text)}
                        </View>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-8%", borderRadius: 8, width: '30%' }}>
                            {testForURL(message.photo) ?
                                <CacheImages source={{ uri: message.photo }} thumbnails square small></CacheImages> :
                                <Thumbnail style={{ borderRadius: 5, }} square small source={{ uri: message.photo }}></Thumbnail>}
                        </View>
                    </View>
                </View>
            case "audio":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Title style={{ fontWeight: "bold", fontSize: 16, color: ColorList.bodyText }}>{this.formNickName(message.sender)}{": "}</Title>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 14, marginLeft: "3%", marginTop: "1%", width: "70%" }}>{message.text ?
                            message.text.slice(0, 15) + message.text.length < 15 ? "..." : "" :
                            message.duration ? convertToHMS(message.duration) :
                                message.total ? this.toMB(message.total) : ""}</Text>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-2%", }}>
                            <Icon type={"Entypo"} name={"mic"} style={{ fontSize: 30, color: ColorList.bodyText }}></Icon>
                        </View>
                    </View>
                </View>
            case "video":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Title style={{ fontWeight: "bold", fontSize: 16, color: ColorList.bodyText }}>{this.formNickName(message.sender)}{": "}</Title>
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: "1%", }}>
                        <Text style={{ fontSize: 14, marginLeft: "3%", width: "70%" }}>{message.text ?
                            message.text.slice(0, 15) : message.duration ? message.duration : message.total ? this.toMB(message.total) : ""}</Text>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-2%" }}>
                            <Icon type={"AntDesign"} name={"videocamera"} style={{ fontSize: 30, color: ColorList.bodyText }}></Icon>
                        </View>
                    </View>
                </View>
            case "attachement":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Title style={{ fontWeight: "bold", fontSize: 16, color: ColorList.bodyText }}>{this.formNickName(message.sender)}{": "}</Title>
                    <View style={{ display: 'flex', flexDirection: 'row', }}>
                        <Text style={{ fontSize: 14, marginLeft: "3%", alignSelf: 'flex-start', fontWeight: 'bold', width: "70%" }}>{message.file_name.split(".")
                        [message.file_name.split(".").length - 1].toUpperCase()}</Text>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-2%", }}>
                            <Icon type={"Octicons"} name={"file"} style={{ fontSize: 30, color: ColorList.bodyText }}></Icon>
                        </View>
                    </View>
                </View>
            default:
                return null
        }
    }
    render() {
        let mainStyles = {
            width: "98%",
            ...shadower(1),
            margin: '1%',
            opacity: this.accessible ? 1 : 0.2,
            borderBottomRightRadius: 5,
            borderTopRightRadius: 5,
            backgroundColor: this.props.ImICurrentCommitee ? ColorList.bodyDarkWhite : ColorList.bodyBackground,

        }
        this.accessible = this.state.joint || this.props.commitee.public_state
        return (
            this.state.loaded ? <View style={{
                ...mainStyles
            }}>
                <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                    if (GState.editingCommiteeName === false)
                        this.swappCommitee()
                })}>
                    <View>
                        <View style={{ display: 'flex', hieght: 100, width: "100%", flexDirection: "row", marginBottom: "2%", justifyContent: 'space-between', }}>
                            <View style={{ margin: '1%', flex: 2, display: 'flex', flexDirection: 'column', }}>
                                <Text elipsizeMode={'tail'} numberOfLines={1} style={{
                                    fontWeight: 'bold', fontSize: 14,
                                    color: GState.currentCommitee == this.props.commitee.id ? ColorList.headerIcon : "gray"
                                }}>{this.props.commitee.name}</Text>
                                {this.state.joint && this.props.commitee.newest_message ? <Text note>Latest Message :</Text> : null}
                            </View>
                            <View style={{
                                display: 'flex',
                                flex: 1,
                                margin: '2%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignSelf: 'flex-end',
                            }}>
                                {
                                    this.props.commitee &&
                                        this.props.commitee.name &&
                                        this.props.commitee.name.toLowerCase() === "General".toLowerCase() ? null :
                                        this.state.master ?
                                            <View style={{ marginTop: "-5%", }}>
                                                <TouchableWithoutFeedback onPress={() => {
                                                    GState.editingCommiteeName = true
                                                    requestAnimationFrame(() => {
                                                        this.setState({
                                                            isEditNameModelOpened: true,
                                                            newThing: !this.state.newThing
                                                        })
                                                        setTimeout(() => {
                                                            GState.editingCommiteeName = false
                                                        }, 300)
                                                    })
                                                }}>
                                                    <View><Icon style={{ fontSize: 30, color: ColorList.bodyText }} name="pencil" type="EvilIcons" /></View>
                                                </TouchableWithoutFeedback>
                                            </View> : null}
                                {this.state.joint && this.props.commitee.new_messages ? this.props.commitee.new_messages.length > 0 ? <Badge style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }} primary>
                                    <Text style={{ display: 'flex', justifyContent: 'center', }}>
                                        {this.props.commitee.new_messages.length}
                                    </Text>
                                </Badge> : null : null}
                            </View>
                        </View>
                        <View style={{ margin: '2%', }}>
                            {this.state.joint && this.props.commitee.newest_message ? this.writeLatestMessage(this.props.commitee.newest_message) : null}
                        </View>
                    </View>
                </TouchableOpacity>
                {this.state.isEditNameModelOpened ? <EditNameModal value={this.props.commitee.name} isOpen={this.state.isEditNameModelOpened} close={() => {
                    this.setState({
                        isEditNameModelOpened: false,
                        newThing: !this.state.newThing
                    })
                }}
                    editName={(newName) => {
                        this.editName(newName)
                    }}
                ></EditNameModal> : null}
                {//<MenuDivider color="#1FABAB" />
                }


            </View> : <View style={{
                ...mainStyles,
                height: this.props.commitee.newest_message?100:50
            }}>
                </View>
        );
    }
}