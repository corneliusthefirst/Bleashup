
import React, { Component } from 'react';
import { View, Dimensions, StatusBar, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PublicEvent from "./publicEvent.js"
import Relation from "./Relation"
import BleashupFlatList from '../../../BleashupFlatList';
import DetailsModal from '../../invitations/components/DetailsModal.js';
import CreateEvent from '../../event/createEvent/CreateEvent';
import BeNavigator from "../../../../services/navigationServices"
import AnimatedComponent from '../../../AnimatedComponent.js';
import { _onScroll } from './sideButtonService';
import globalFunctions from '../../../globalFunctions';
import active_types from '../../eventChat/activity_types';
import ActivityPages from '../../eventChat/chatPages';
import GState from '../../../../stores/globalState/index';
import Texts from '../../../../meta/text';
import rounder from '../../../../services/rounder.js';
import ColorList from '../../../colorList.js';
import Entypo from 'react-native-vector-icons/Entypo';
import MessageActions from '../../eventChat/MessageActons.js';
import Vibrator from '../../../../services/Vibrator';
import AreYouSure from '../../event/AreYouSureModal.js';
import stores from '../../../../stores/index.js';
import Spinner from '../../../Spinner';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

export default class CurrentEvents extends AnimatedComponent {
    initialize() {
        this.state = {
            participants: [],
            mounted:true,
            isParticipantModalOpened: false,
            isActionButtonVisible: true,
            newData: []
        }
        this.openDetails = this.openDetails.bind(this)
        this.showPhoto = this.showPhoto.bind(this)
        this.hidePhoto = this.hidePhoto.bind(this)
        this.hideDetails = this.hideDetails.bind(this)
        this.goToActivity = this.goToActivity.bind(this)
        this._onScroll = _onScroll.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.startCreateActivity = this.startCreateActivity.bind(this)
        this.defaultItem = this.defaultItem.bind(this)
        this.showActions = this.showActions.bind(this)
        this.hideActions = this.hideActions.bind(this)
        this.showAreYouSure = this.showAreYouSure.bind(this)
        this.hidAreyouSure = this.hidAreyouSure.bind(this)
        this.deleSelectedEvent = this.deleSelectedEvent.bind(this)
    }



    startCreateActivity() {
        BeNavigator.navigateToCreateEvent()
    }
    showPhoto(url) {
        BeNavigator.openPhoto(url)
    }
    delay = 0
    renderPerbatch = 10
    componentDidMount() {
        if (this.props.data.length <= 0) {
            stores.Events.getAllCurrentEvents()
        }
        setTimeout(() => {
            this.setStatePure({
                mounted:true
            })
        })
    }
    openDetails(event) {
        this.setStatePure({
            isDetailsModalOpened: true,
            event: event
        })
    }
    hidePhoto() {
        this.setStatePure({
            showPhoto: false
        })
    }
    hideDetails() {
        this.setStatePure({
            isDetailsModalOpened: false
        })
    }
    goToActivity() {
        BeNavigator.navigateToActivity(ActivityPages.starts, this.state.event);
    }
    preDelete() {
        this.showAreYouSure()
    }
    showAreYouSure() {
        this.setStatePure({
            areyouSure: true,
            title: Texts.delete_activity,
            message: Texts.are_you_sure_to_delete_activity,
            ok: Texts.delete_,
            callback: this.deleSelectedEvent
        })
    }
    action = () => [
        {
            title: Texts.delete_,
            callback: () => this.preDelete(this.state.selectedItem),
            condition: () => true,
            iconName: "delete-forever",
            iconType: "MaterialCommunityIcons",
            color: ColorList.delete
        }
    ]
    renderItem(item, index) {
        this.delay = index % this.renderPerbatch == 0 ? 0 : this.delay + 1
        return item.type && item.type == active_types.relation ? <Relation
            animate={this.animateUI}
            searchString={this.props.searchString}
            key={item.id}
            openDetails={this.openDetails}
            onLongPress={this.showActions}
            renderDelay={this.delay * 25}
            showPhoto={this.showPhoto} key={item.id} Event={item} />
            : <PublicEvent
                animate={this.animateUI}
                onLongPress={this.showActions}
                searchString={this.props.searchString}
                key={item.id}
                openDetails={this.openDetails}
                renderDelay={this.delay * 5}
                showPhoto={this.showPhoto}
                key={item.id} Event={item} />

    }
    keyExtractor(item, index) {
        return item.id
    }
    getItemLayout(item, index) {
        return { length: 70, index, offset: 70 * index }
    }
    defaultItem() {
        return <View style={GState.descriptBoxStyle}>
            <View style={{
                alignSelf: 'center',
                marginBottom: "3%",
            }}><Text style={GState.featureBoxTitle}>{Texts.beup_activity}</Text>
            </View>
            <View style={{
                marginBottom: "3%",
            }}>
                <Text style={{ ...GState.defaultTextStyle, fontWeight: 'bold', }}>{Texts.beup_activity_description}</Text>
            </View>
            <View style={{
                alignSelf: 'center',
            }}>
                <TouchableOpacity style={{
                    ...rounder(45, ColorList.bodyBackground)
                }} onPress={this.startCreateActivity}>
                    <Entypo name={"plus"} style={GState.defaultIconSize} />
                </TouchableOpacity>
            </View>
        </View>
    }
    hideActions() {
        this.setStatePure({
            showActions: false
        })
    }
    deleSelectedEvent() {
        stores.Events.delete(this.state.selectedItem.id)
    }
    hidAreyouSure() {
        this.setStatePure({
            areyouSure: false
        })
    }
    showActions(item) {
        Vibrator.vibrateShort()
        this.setStatePure({
            showActions: true,
            selectedItem: item
        })
    }
    render() {
        let data = this.props.data && this.props.data.filter((ele) =>
            globalFunctions.filterAllActivityAndRelation(ele, this.props.searchString || ""))
        StatusBar.setHidden(false, true)
        return (
            <View style={styles.container}>
                {this.state.mounted?<BleashupFlatList
                    //backgroundColor={"white"}
                    defaultItem={this.defaultItem}
                    keyExtractor={this.keyExtractor}
                    dataSource={data || []}
                    onScroll={this._onScroll}
                    renderItem={this.renderItem}
                    firstIndex={0}
                    getItemLayout={this.getItemLayout}
                    renderPerBatch={this.renderPerbatch}
                    initialRender={20}
                    numberOfItems={(data && data.length) || 0}
                >
                </BleashupFlatList>:<View style={{
                    height:'100%',
                    width:'100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}><Spinner big></Spinner></View>}
                {this.state.isDetailsModalOpened ? <DetailsModal goToActivity={this.goToActivity} isToBeJoint event={this.state.event}
                    isOpen={this.state.isDetailsModalOpened}
                    onClosed={this.hideDetails}>
                </DetailsModal> : null}

                {this.state.isActionButtonVisible ? <CreateEvent {...this.props} /> : null}
                {this.state.showActions ? <MessageActions
                    isOpen={this.state.showActions}
                    onClosed={this.hideActions}
                    title={Texts.activity_actions}
                    actions={this.action}>
                </MessageActions> : null}
                {this.state.areyouSure ? <AreYouSure
                    title={this.state.title}
                    message={this.state.message}
                    ok={this.state.ok}
                    callback={this.state.callback}
                    isOpen={this.state.areyouSure}
                    closed={this.hidAreyouSure}
                >
                </AreYouSure> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { height: "100%", }
})