import React, { Component } from 'react';
import { Text, Badge, Icon, Label, Spinner, Toast, Thumbnail } from 'native-base';
import { TouchableOpacity } from 'react-native-gesture-handler';
import stores from '../../../stores';
import { View } from 'react-native';
import { find } from "lodash"
import EditNameModal from './EditNameModal';
import emitter from '../../../services/eventEmiter';
import { observer } from 'mobx-react';
import GState from '../../../stores/globalState';
import firebase from 'react-native-firebase';
import Image from 'react-native-scalable-image';
import CacheImages from '../../CacheImages';
import ChatStore from '../../../stores/ChatStore';
import testForURL from '../../../services/testForURL';
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
            this.state.newThing !== nextState.newThing ||
            this.props.id !== nextProps.id || this.state.loaded !== nextState.loaded
    }

    componentDidMount() {
        if (this.props.commitee !== null) {
            let member = find(this.props.commitee.member, (ele) => ele !== null && ele.phone === this.props.phone)
            if (this.props.commitee.name === "Generale") {
                emitter.once("current_commitee_changed_by_main", commiteeName => {
                    //console.warn("change by main received")
                    GState.currentCommitee = this.props.commitee.id
                    GState.generalNewMessages = []
                    this.setState({
                        newThing: !this.state.newThing,
                        commitee: { ...this.state.commitee, new_messages: [] }
                    })
                    firebase.database().ref(`new_message/${phone}/${this.props.id}/new_messages`).set([])
                })
            }
            setTimeout(() => {
                this.setState({
                    commitee: this.props.commitee,
                    public: this.props.commitee.public_state,
                    master: member ? member.master : false,
                    loaded: true,
                    member: member,
                    joint: member ? true : false
                })
            }, 50)
        } else {
            stores.CommiteeStore.getCommitee(this.props.id).then(commitee => {
                this.member = find(commitee.member, (ele) => ele !== null && ele.phone === this.props.phone)
                setTimeout(() => {
                    this.setState({
                        commitee: commitee,
                        public: commitee.public_state,
                        master: this.member ? this.member.master : false,
                        loaded: true,
                        joint: this.member ? true : false
                    })
                }, 50)
            })
        }
        let phone = stores.LoginStore.user.phone.replace("00", "+");
        firebase.database().ref(`new_message/${phone}/${this.props.id}/new_messages`).once('value', snapshoot => {
            if (snapshoot.val()) {
                firebase.database().ref(`${this.props.id}`).orderByKey().limitToLast(1).once('value', snapshooter => {
                    let key = Object.keys(snapshooter.val())
                    value = snapshooter.val()
                    this.setState({
                        commitee: { ...this.state.commitee, new_messages: snapshoot.val() },
                        newThing: !this.state.newThing,
                        newest_message: value[key]
                    })
                })
            } else {
                let room = new ChatStore(this.props.id)
                room.loadLatestMessage().then(message => {
                    this.setState({
                        newThing: !this.state.newThing,
                        newest_message: message
                    })
                })
            }
        }).catch(error => {
            console.warn(error)
        })
    }
    revertName() {
        // console.warn("edit failed message recieved!!")
        this.setState({
            commitee: { ...this.state.commitee, name: this.previousName },
            newThing: !this.state.newThing
        })
    }
    publish() {
        this.props.publishCommitee(this.state.commitee.id, !this.state.commitee.public_state)
        emitter.once('published', state => {
            this.setState({
                commitee: { ...this.state.commitee, public_state: state },
                public: state,
                newThing: !this.state.newThing
            })
        })
    }
    join() {
        return new Promise((resolve, reject) => {
            if (this.state.public && !this.state.joint) {
                this.props.join(this.state.commitee.id)
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
            this.props.leave(this.state.commitee.id)
            emitter.on("left", () => {
                this.setState({
                    left: true
                })
            })
        }
    }
    addMembers() {
        this.props.addMembers(this.state.commitee.id, this.state.commitee.member)
        //this._accordion.setSelected(-1)
    }
    removeCommitee() {
        this.props.removeMember(this.state.commitee.id, this.state.commitee.member)
        //this._accordion.setSelected(-1)
    }
    editName(newName) {
        this.previousName = this.state.commitee.name
        this.setState({
            commitee: { ...this.state.commitee, name: newName },
            isEditNameModelOpened: false,
            newThing: !this.state.newThing
        })
        this.props.editName(newName, this.state.commitee.id)
        emitter.once("edit-failed", () => {
            this.revertName()
        })
    }
    swap() {
        GState.currentRoomNewMessages = this.state.commitee.new_messages
        this.props.swapChats(this.state.commitee)
        GState.currentCommitee = this.state.commitee.id
        emitter.emit("current_commitee_changed", this.props.id)
        let phone = stores.LoginStore.user.phone.replace("00", "+");
        firebase.database().ref(`new_message/${phone}/${this.props.id}/new_messages`).set([])
        this.setState({
            commitee: { ...this.state.commitee, new_messages: [] },
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
    listen() {
        if (GState.currentCommitee == this.props.id || (this.props.commitee && GState.currentCommitee == this.props.commitee.id)) {
            emitter.once("current_commitee_changed", (newCurrent) => {
                if (newCurrent == this.props.id && !GState.currentCommitee) {
                    emitter.once("current_commitee_changed", (newCurrent) => {
                        this.setState({
                            newThing: !this.state.newThing
                        })
                    })
                }
                emitter.once("current_commitee_changed_by_main", room => {
                    this.setState({
                        newThing: true
                    })
                })
                this.setState({
                    newThing: !this.state.newThing
                })
            })
        }else{
            
        }
    }
    setActionPercentage() {
        actionsNumber = () => {
            if (this.state.master && this.state.public) {
                return 5
            } else if (!this.state.master && !this.state.public) {
                return 1
            } else if (!this.state.master && this.state.public && !this.state.joint) {
                return 2
            }
        }
    }
    formNickName(user) {
        return user.phone == stores.LoginStore.user.phone.replace("00", "+") ? "You" : user.nickname
    }
    convertToHMS(secs) {
        var sec_num = parseInt(secs, 10)
        var hours = Math.floor(sec_num / 3600)
        var minutes = Math.floor(sec_num / 60) % 60
        var seconds = sec_num % 60

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":")

    }
    toMB(data) {
        mb = 1000 * 1000
        return (data / mb).toFixed(2).toString() + "MB";
    }
    
    writeLatestMessage(message) {
        switch (message.type) {
            case "text":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, }}>{this.formNickName(message.sender)}{" :"}</Text>
                    <Text style={{ fontSize: 18, marginTop: "1%", }}>{message.text.slice(0, 15)}</Text>
                </View>
            case "photo":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, }}>{this.formNickName(message.sender)}{" :"}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: "1%", }}>
                        <Text style={{ fontSize: 18, width: "74%" }}>{message.text ? message.text.slice(0, 15) : "  "}</Text>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-8%", borderRadius: 8, }}>
                            {testForURL(message.photo)?
                            <CacheImages source={{ uri: message.photo }} thumbnails square small></CacheImages>:
                            <Thumbnail style={{borderRadius: 5,}} square small source={{uri:message.photo}}></Thumbnail>}
                        </View>
                    </View>
                </View>
            case "audio":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, }}>{this.formNickName(message.sender)}{" :"}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row' }}>
                        <Text style={{ fontSize: 18, marginLeft: "3%", marginTop: "1%", width: "70%" }}>{message.text ?
                            message.text.slice(0, 15) + message.text.length < 15 ? "..." : "" :
                            message.duration ? this.convertToHMS(message.duration) :
                                message.total ? this.toMB(message.total) : ""}</Text>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-2%", }}>
                            <Icon type={"Entypo"} name={"mic"} style={{ fontSize: 30, color: "#0A4E52" }}></Icon>
                        </View>
                    </View>
                </View>
            case "video":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, }}>{this.formNickName(message.sender)}{" :"}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: "1%", }}>
                        <Text style={{ fontSize: 18, marginLeft: "3%", width: "70%" }}>{message.text ?
                            message.text.slice(0, 15) : message.duration ? message.duration : message.total ? this.toMB(message.total) : ""}</Text>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-2%" }}>
                            <Icon type={"AntDesign"} name={"videocamera"} style={{ fontSize: 30, color: "#0A4E52" }}></Icon>
                        </View>
                    </View>
                </View>
            case "attachement":
                return <View style={{ display: 'flex', flexDirection: 'row', }}>
                    <Text style={{ fontWeight: "bold", fontSize: 20, }}>{this.formNickName(message.sender)}{" :"}</Text>
                    <View style={{ display: 'flex', flexDirection: 'row', }}>
                        <Text style={{ fontSize: 20, marginLeft: "3%", alignSelf: 'flex-start', fontWeight: 'bold', width: "70%" }}>{message.file_name.split(".")
                        [message.file_name.split(".").length - 1].toUpperCase()}</Text>
                        <View style={{ alignSelf: 'flex-end', marginTop: "-2%", }}>
                            <Icon type={"Octicons"} name={"file"} style={{ fontSize: 30, color: "#0A4E52" }}></Icon>
                        </View>
                    </View>
                </View>
            default:
                return null


        }
    }
    render() {
        this.listen()
        this.accessible = this.state.joint || this.state.public
        return (
            this.state.loaded ? <View style={{
                opacity: this.accessible ? 1 : 0.1,
                borderBottomRightRadius: 8,
                width:265,
                borderTopRightRadius: 8,
                backgroundColor: GState.currentCommitee == this.state.commitee.id ? "#54F5CA" : null,
            }}>
                <View style={{ display: 'flex', hieght: 100, width: 250, flexDirection: "row", marginBottom: "2%", }}>
                    <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                        this.swappCommitee()
                    })}><View style={{ margin: '1%', width: 215, display: 'flex', flexDirection: 'column', }}>
                            <Text style={{
                                fontWeight: 'bold', fontSize: 24,
                            }}>{this.state.commitee.name}</Text>
                            {this.state.joint && this.state.newest_message ? <Text note>Latest Message :</Text> : null}
                            {this.state.joint && this.state.newest_message ? this.writeLatestMessage(this.state.newest_message) : null}
                        </View></TouchableOpacity>
                    <View style={{ display: 'flex', flexDirection: 'row', marginTop: "6%", }}>
                        {this.state.joint && this.state.commitee.new_messages ? this.state.commitee.new_messages.length > 0 ? <Badge primary>
                            <Text style={{ marginTop: "30%", }}>
                                {this.state.commitee.new_messages.length}
                            </Text>
                        </Badge> : null : null}
                        {this.state.commitee.name.toLowerCase() === "Generale".toLowerCase() ? null : this.state.master ?
                            <View style={{ marginTop: "-5%", marginRight: "15%", }}>
                                <TouchableOpacity onPress={() => {
                                    requestAnimationFrame(() => {
                                        this.setState({
                                            isEditNameModelOpened: true,
                                            newThing: !this.state.newThing
                                        })
                                    })
                                }}>
                                    <Icon style={{ fontSize: 30, color: "#0A4E52" }} name="pencil" type="EvilIcons" />
                                </TouchableOpacity>
                            </View> : null}
                    </View>
                </View>
                <EditNameModal isOpen={this.state.isEditNameModelOpened} close={() => {
                    this.setState({
                        isEditNameModelOpened: false,
                        newThing: !this.state.newThing
                    })
                }}
                    editName={(newName) => {
                        this.editName(newName)
                    }}
                ></EditNameModal>

            </View> : <Spinner size={"small"}></Spinner>
        );
    }
}