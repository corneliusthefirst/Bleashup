
import React, { Component } from 'react';
import { View, Dimensions, StatusBar,StyleSheet } from 'react-native';
import PublicEvent from "./publicEvent.js"
import Relation from "./Relation"
import BleashupFlatList from '../../../BleashupFlatList';
import DetailsModal from '../../invitations/components/DetailsModal.js';
import PhotoViewer from '../../event/PhotoViewer.js';
import CreateEvent from '../../event/createEvent/CreateEvent';
import BeNavigator from "../../../../services/navigationServices"
import AnimatedComponent from '../../../AnimatedComponent.js';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

export default class CurrentEvents extends AnimatedComponent {
    initialize(){
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
    }
    _onScroll = (event) => {
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            this.setStatePure({ isActionButtonVisible })
        }
        this._listViewOffset = currentOffset
    }



    showPhoto(url) {
        this.setStatePure({
            showPhoto: true,
            photo: url
        })
    }
    delay = 0
    renderPerbatch = 10
    componentDidMount() {
        
    }
    openDetails(event){
        this.setStatePure({
            isDetailsModalOpened: true,
            event: event
        })
    }
    hidePhoto(){
        this.setStatePure({
            showPhoto: false
        })
    }
    hideDetails(){
        this.setStatePure({
            isDetailsModalOpened: false
        })
    }
    goToActivity(){
        BeNavigator.navigateToActivity('EventDetails', this.state.event);
    }
    render() {

        StatusBar.setHidden(false, true)
        return (
            <View style={styles.container}>
                <BleashupFlatList
                //backgroundColor={"white"} 
                    keyExtractor={(item, index) => item.id}
                    dataSource={this.props.data||[]}
                    onScroll={this._onScroll}
                    renderItem={(item, index) => {
                        this.delay = index % this.renderPerbatch == 0 ? 0 : this.delay + 1
                        return item.type && item.type == "relation" ?<Relation
                        key={item.id}
                            openDetails={this.openDetails}
                            renderDelay={this.delay * 25}
                            showPhoto={this.showPhoto} key={item.id}  Event={item} />
                            :<PublicEvent
                            key={item.id}
                                openDetails={this.openDetails}
                                renderDelay={this.delay * 5}
                                showPhoto={this.showPhoto} key={item.id} Event={item} />
                    }}
                    firstIndex={0}
                    renderPerBatch={this.renderPerbatch}
                    initialRender={20}
                    numberOfItems={this.props.data.length}
                >
                </BleashupFlatList>
                {
                    // ******************Photo Viewer View ***********************//
                    <PhotoViewer photo={this.state.photo} open={this.state.showPhoto} hidePhoto={this.hidePhoto}></PhotoViewer>
                }
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