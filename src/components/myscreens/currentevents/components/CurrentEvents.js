
import React, { Component } from 'react';
import { View, Dimensions, StatusBar, StyleSheet } from 'react-native';
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
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

export default class CurrentEvents extends AnimatedComponent {
    initialize() {
        this.state = {
            participants: [],
            event_id: null,
            //event:this.props.data[0],
            //isDetailsModalOpened:true,
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
    }




    showPhoto(url) {
        BeNavigator.openPhoto(url)
    }
    delay = 0
    renderPerbatch = 10
    componentDidMount() {

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
    render() {
        let data = this.props.data && this.props.data.filter((ele) =>
            globalFunctions.filterAllActivityAndRelation(ele, this.props.searchString || ""))
        StatusBar.setHidden(false, true)
        return (
            <View style={styles.container}>
                <BleashupFlatList
                    //backgroundColor={"white"} 
                    keyExtractor={(item, index) => item.id}
                    dataSource={data || []}
                    onScroll={this._onScroll}
                    renderItem={(item, index) => {
                        this.delay = index % this.renderPerbatch == 0 ? 0 : this.delay + 1
                        return item.type && item.type == active_types.relation ? <Relation
                            searchString={this.props.searchString}
                            key={item.id}
                            openDetails={this.openDetails}
                            renderDelay={this.delay * 25}
                            showPhoto={this.showPhoto} key={item.id} Event={item} />
                            : <PublicEvent
                                searchString={this.props.searchString}
                                key={item.id}
                                openDetails={this.openDetails}
                                renderDelay={this.delay * 5}
                                showPhoto={this.showPhoto} key={item.id} Event={item} />
                    }}
                    firstIndex={0}
                    renderPerBatch={this.renderPerbatch}
                    initialRender={20}
                    numberOfItems={(data && data.length) || 0}
                >
                </BleashupFlatList>
                {<DetailsModal goToActivity={this.goToActivity} isToBeJoint event={this.state.event}
                    isOpen={this.state.isDetailsModalOpened}
                    onClosed={this.hideDetails}>
                </DetailsModal>}

                {this.state.isActionButtonVisible ? <CreateEvent {...this.props} /> : null}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { height: "100%", }
})