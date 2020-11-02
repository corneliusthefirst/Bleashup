import React, { Component } from 'react';
import { View, TouchableOpacity } from "react-native"
import BleashupFlatList from '../../BleashupFlatList';
import IntervalSeparator from './IntervalSeparator';
import ProfileView from '../invitations/components/ProfileView';
import Swipeout from '../eventChat/Swipeout';
import BePureComponent from '../../BePureComponent';
import BeComponent from '../../BeComponent';
import ColorList from '../../colorList';
import { format } from '../../../services/recurrenceConfigs';
import moment from 'moment';
import Spinner from '../../Spinner';
import Texts from '../../../meta/text';
import MessageActions from '../eventChat/MessageActons';
import Vibrator from '../../../services/Vibrator';
import GState from '../../../stores/globalState';
import rounder from '../../../services/rounder';
import shadower from '../../shadower';
import { _onScroll } from '../currentevents/components/sideButtonService';
import emitter from '../../../services/eventEmiter';
import { members_updated } from '../../../meta/events';
import ConcludeExportModal from './ConcludeExportModal';
import ConcerneeActions from '../event/createEvent/ConcerneeAction';


export default class ConcerneeList extends BeComponent {
    constructor(props) {
        super(props)
        this.onScroll = _onScroll.bind(this)
        this.hideExportMembers = this.hideExportMembers.bind(this)
        this.showExporter = this.showExporter.bind(this)
    }
    showExporter(){
        this.setStatePure({
            exportMembers:true
        })
    }
    hideExportMembers(){
        this.setStatePure({
            exportMembers:false
        })
    }
    state = {
        index: null,
        newing:false,
        isActionButtonVisible: true,
        mounted: false
    }
    _keyExtractor = (item, index) => index.toString()
    delay = 0
    getItemLayout(tem, index) {
        return { length: 60, offset: index * 60, index }
    }
    highlightItem(index) {
        this.setStatePure({
            index,
        })
        setTimeout(() => {
            this.setStatePure({
                index: null,
            })
        }, 2000)
    }
    refreshList() {
        this.setStatePure({
            newing: !this.state.newing
        })
    }
    componentDidMount() {
        setTimeout(() => {
            if (this.props.currentRemindUser) {
                let index = this.getMembers().findIndex(ele => ele === this.props.currentRemindUser.phone)
                index >= 0 && this.refs.flatlist && this.refs.flatlist.scrollToIndex(index)
            }
            this.setStatePure({
                mounted: true
            })
            emitter.on(members_updated, () => {
               this.mounted && this.refreshList()
            })
        })
    }
    returnDataForRepply(item) {
        return { phone: item, type: this.props.type, status: { date: moment(this.props.initDate, format).format() } }
    }
    showAction(item) {
        this.setStatePure({
            showAction: true,
            item
        })
    }
    unmountingComponent(){
        emitter.off(members_updated)
    }
    MembersAction = () => [
        {
            title: Texts.reply,
            callback: () => this.props.reply(this.state.item),
            iconName: "reply",
            condition: () => true,
            iconType: "Entypo",
            color: ColorList.replyColor,
        },
        {
            title: Texts.reply_privately,
            callback: () => this.props.replyPrivate(this.state.item),
            iconName: "reply",
            condition: () => !this.props.isRelation,
            iconType: "Entypo",
            color: ColorList.replyColor,
        }, {
            title: Texts.unassign,
            callback: () => this.props.removeMember(this.state.item),
            iconName: "deleteusergroup",
            condition: () => this.props.master,
            iconType: "AntDesign",
            color: "orange",
        }]
    hideAction() {
        this.setStatePure({
            showAction: false
        })
    }
    getMembers(){
        return (this.props.getMembers && this.props.getMembers()).map(ele => ele && ele.phone) || this.props.contacts
    }
    render() {
        let data = this.getMembers()
        return this.state.mounted ? <View>
            <BleashupFlatList
                onScroll={this.onScroll}
                firstIndex={0}
                ref={"flatlist"}
                renderPerBatch={5}
                initialRender={20}
                getItemLayout={this.getItemLayout.bind(this)}
                numberOfItems={data.length}
                keyExtractor={this._keyExtractor}
                dataSource={data}
                renderItem={(item, index) => {
                    let isCurrentIndex = index == this.state.index
                    this.delay = this.delay >= 20 ? 0 : this.delay + 1
                    return (this.props.complexReport ? <View key={index.toString()}>
                        {item.type === 'interval' ? <IntervalSeparator to={item.to}
                            actualInterval={this.props.actualInterval &&
                                item.from === this.props.actualInterval.start &&
                                item.to === this.props.actualInterval.end}
                            first={index === 0 ? true : false}
                            from={item.from}>
                        </IntervalSeparator> :
                            <View style={{
                                width: '100%',
                                alignSelf: 'center',
                                minHeight: 53,
                            }}
                                key={index.toString()}>
                                <View style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                }}>
                                    <View style={{ alignSelf: 'center', }}>
                                        <ProfileView
                                            delay={this.delay}
                                            phone={item.data.phone}>
                                        </ProfileView>
                                    </View>
                                </View></View>}
                    </View> :
                        <View
                            style={{
                                margin: '1%',
                                minHeight: 53,
                                padding: "1%",
                                backgroundColor: isCurrentIndex ? 
                                ColorList.remindsTransparent : 
                                ColorList.bodyBackground,
                                borderRadius: 5,
                                alignItems: 'center',
                                flexDirection: 'row',
                                width: "100%"
                            }}
                            key={index.toString()}
                            ><Swipeout style={{ 
                                flex: 1,
                             }} onLongPress={() => {
                                Vibrator.vibrateShort()
                                this.showAction(this.returnDataForRepply(item))
                            }} swipeRight={() => {
                                this.props.reply(this.returnDataForRepply(item))
                            }}>
                                <View
                                    style={{
                                        margin: '2%',
                                        width: "100%",
                                        alignSelf: 'center',
                                    }}><ProfileView
                                        showHighlighter={() => this.props.currentRemindUser &&
                                            this.props.currentRemindUser.phone == item &&
                                            this.highlightItem(index)}
                                        delay={this.delay} phone={item}>
                                    </ProfileView>
                                </View>
                            </Swipeout>
                        </View>)

                }}
            />
            {this.state.isActionButtonVisible && this.props.master ? <ConcerneeActions
                exportMembers={this.showExporter}
                addMembers={this.props.addMembers}
            >
            </ConcerneeActions> : null}
            {this.state.showAction  ? <MessageActions
                title={Texts.remind_member_action}
                actions={this.MembersAction}
                isOpen={this.state.showAction}
                onClosed={this.hideAction.bind(this)}
            ></MessageActions> : null}
            {this.state.exportMembers? <ConcludeExportModal
            donners={this.props.getMembers()}
            isOpen={this.state.exportMembers}
            onClosed={this.hideExportMembers}
            >
            </ConcludeExportModal>:null}
        </View> : <Spinner></Spinner>
    }
}