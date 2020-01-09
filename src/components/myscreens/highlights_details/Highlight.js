import React, { Component } from 'react';
import { View, Vibration, TouchableOpacity } from 'react-native';
import { Title, Text } from 'native-base';
import Swipeout from '../../SwipeOut';
import HighlightContent from './HighlightContent';
import moment from 'moment';
import ProfileModal from '../invitations/components/ProfileModal';
import stores from '../../../stores';
export default class HighLight extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showProfile: false
        }
    }
    renderContent(highlight) {
        return <HighlightContent modal={this.props.modal} showVideo={(url) => this.props.showVideo(url)} showPhoto={(uri) => this.props.showPhoto(uri)} PressingIn={() => {
            this.replying = true
        }} highlight={highlight}></HighlightContent>


    }
    state = {

    }
    componentDidMount() {
        this.props.highlight.creator ? stores.TemporalUsersStore.getUser(this.props.highlight.creator).then(creator => {
            this.setState({
                creator: creator
            })
        }) : null
    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.showProfile !== nextState.showProfile ||
            this.state.creator !== nextState.creator
    }
    handleReply() {
        console.warn('handling reply .....')
    }
    duration = 9
    textColor = "#FEFEDE"
    openingSwipeout() {
        this.closing = this.closing + 1
        if (!this.slept) {
            setTimeout(() => {

            }, 1000)
            this.slept = true
        } else {

        }
        if (this.replying) {
            if (!this.closed) {
                this.closing++
                this.closed = true
                this.closing = 0
                Vibration.vibrate(this.duration)
                this.props.showInput(this.props.highlight)
                setTimeout(() => {
                    this.closed = false
                }, 1000)
            }
            this.replying = false
        }
    }
    quickMention() {
        Vibration.vibrate(this.duration)
        this.props.showInput(this.props.highlight)
    }
    closingSwipeout() {
        /* if (this.replying) {
              if(!this.closed){
                  this.closing++
                  this.closed = true
  
                  this.closing = 0
                  Vibration.vibrate(this.duration)
                  setTimeout(() => {
                      this.closed = false
                  }, 1000)
              }
              this.replying = false
          }*/
    }
    showCreator() {
        this.setState({
            showProfile: true
        })
    }
    render() {
        return (
            <View style={{
                marginTop: '2%',
            }}>
                <Swipeout
                    disabled={this.props.disableSwipper ? this.props.disableSwipper : false}
                    ref={'chatSwipeOut'} onOpen={() => { this.openingSwipeout() }}
                    onClose={() => { this.closingSwipeout() }} autoClose={true} close={true}
                    left={[{
                        color: '#04FFB6', type: 'default', backgroundColor: "transparent", text: 'react',
                        onPress:
                            () => {
                                this.quickMention()
                            }

                    }]}
                    style={{ backgroundColor: 'transparent', width: "100%" }}>
                    <View style={{
                        maxWidth: "90%", minWidth: 120,
                        minHeight: 10, overflow: 'hidden', borderRadius: 10,
                        alignSelf: 'center', margin: '1%',
                        backgroundColor: this.props.background ? this.props.background : "#9EEDD3",
                    }}>
                        <View style={{ height: 50, opacity: 0.8, borderRadius: 8, }}>
                            <Text style={{
                                alignSelf: 'center',
                                margin: '3%', fontWeight: 'bold', fontSize: 22,
                            }}>
                                {this.props.highlight.title}
                            </Text>
                        </View>
                        <View>
                            {this.renderContent(this.props.highlight)}
                        </View>
                        <View>
                        </View>
                        <View style={{ flexDirection: "column", justifyContent: "space-between", bottom: 0, margin: 3, width: "98%" }}>
                            <TouchableOpacity onPress={() => {
                                this.showCreator()
                            }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 11, margin: 1, }} note>Created </Text>
                                {this.state.creator ? <Text style={{ margin: "1%", fontSize: 11, fontStyle: 'normal', }} note>by {this.state.creator.nickname} </Text> : null}
                                <Text style={{ margin: "1%", fontSize: 11, color: "gray" }} >{"On "}{moment(this.props.highlight.created_at).format("dddd, MMMM Do YYYY, h:mm:ss a")}</Text>
                            </TouchableOpacity>
                        </View>
                        {this.state.showProfile ? <ProfileModal isOpen={this.state.showProfile} profile={this.state.creator} onClosed={() => {
                            this.setState({
                                showProfile: false
                            })
                        }}></ProfileModal> : null}
                    </View>
                </Swipeout>
            </View>
        );
    }
}