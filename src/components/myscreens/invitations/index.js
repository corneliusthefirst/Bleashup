import React, { Component } from "react";

import SentInvitations from '../sent-invitations/invitationCard';
import ReceivedInvitations from '../received-invitations/invitationCard';
import { Spinner } from "native-base";
import stores from "../../../stores";
import { observer } from "mobx-react";
import { sortBy } from "lodash"
import { View ,StatusBar,LayoutAnimation} from 'react-native';
import BleashupFlatList from '../../BleashupFlatList';
import CreateEvent from '../event/createEvent/CreateEvent';
import DetailsModal from "./components/DetailsModal";
import PhotoViewer from "../event/PhotoViewer";

@observer export default class InvitationView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isActionButtonVisible: true
    }
  }
  renderPerBatch = 6
  delay = 0


      // 2. Define a variable that will keep track of the current scroll position
      _listViewOffset = 0

      _onScroll = (event) => {
        // Simple fade-in / fade-out animation
        const CustomLayoutLinear = {
          duration: 100,
          create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
          update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
          delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
        }
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
          ? 'down'
          : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
          LayoutAnimation.configureNext(CustomLayoutLinear)
          this.setState({ isActionButtonVisible })
        }
        // Update your scroll position
        this._listViewOffset = currentOffset
      }
  
      

  _keyExtractor = (item, index) => item.invitation_id;
  render() {
    StatusBar.setHidden(false,true)
    return <View style={{ height: "100%", backgroundColor: "#FEFFDE" }}>
      {
        this.state.loadingInvitations ?
          <Spinner></Spinner> :
          <BleashupFlatList
            initialRender={this.renderPerBatch}
            renderPerBatch={this.renderPerBatch}
            firstIndex={0}
            onScroll={this._onScroll}
            keyExtractor={this._keyExtractor}
            dataSource={sortBy(stores.Invitations.invitations, "period")}
            numberOfItems={stores.Invitations.invitations.length}
            renderItem={(item, index) => {
              this.delay = (index % this.renderPerBatch) === 0 ? 0 : this.delay + 1
              return item.sent ? <SentInvitations
                showPhoto={(photo) => {
                  this.setState({
                    showPhoto:true,
                    photo:photo
                  })
                }}
              {...this.props} time_delay={this.delay * 300} item={item} key={index} parentCardList={this} /> :
                <ReceivedInvitations 
                  showPhoto={(photo) => {
                    this.setState({
                      showPhoto: true,
                      photo: photo
                    })
                  }}
                openDetails={(event) => this.setState({
                  isDetailsModalOpened: true,
                  event: event
                })} time_delay={this.delay * 300}  {...this.props} item={item} key={index}
                  parentCardList={this} />


            }}
          >
          </BleashupFlatList>}
      {this.state.isActionButtonVisible ? <CreateEvent {...this.props} /> : null}

      {this.state.isDetailsModalOpened ? <DetailsModal event={this.state.event}
        isOpen={this.state.isDetailsModalOpened}
        onClosed={() => {
          this.setState({
            isDetailsModalOpened: false
          })
        }}>
      </DetailsModal> : null}
      {this.state.showPhoto?<PhotoViewer photo={this.state.photo} open={this.state.showPhoto} hidePhoto={() =>{
        this.setState({
          showPhoto:false
        })
      }}></PhotoViewer>:null}
       
    </View>
  }
}  

