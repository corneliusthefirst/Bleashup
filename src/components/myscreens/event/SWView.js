/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Animated, TouchableOpacity, ScrollView, TouchableWithoutFeedback, Dimensions, PanResponder, StatusBar } from 'react-native';
import UpdateStateIndicator from '../currentevents/components/updateStateIndicator';
import { List, Icon, Label, Card, CardItem, Text, Header, Thumbnail, Title, Button,Toast } from 'native-base';
import Image from 'react-native-scalable-image';
import InvitationModal from '../currentevents/components/InvitationModal';
import autobind from 'autobind-decorator';
import { observer } from 'mobx-react';
import stores from '../../../stores';
import RouteView from './RouteView';
import ActionsView from './ActionsView';
import Commitee from './Commitee';
import moment from 'moment';
import CacheImages from '../../CacheImages';
import shadower from '../../shadower';
import { dateDiff, writeDateTime } from '../../../services/datesWriter';
import dateDisplayer from '../../../services/dates_displayer';
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import colorList from '../../colorList';
import SearchView from './searchView';
import ColorList from '../../colorList';
import rounder from '../../../services/rounder';
import BeNavigator from '../../../services/navigationServices';


const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

export default class SWView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scrollY: new Animated.Value(0),
            action: false,
        };
    }
    width = '9%'
    padding = '9%'
    indicatorMargin = {
        marginLeft: '5%',
        marginTop: '-7%',
        position: 'absolute',

    };

    @autobind navigateToEventChat() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate('Event', {
                    Event: this.props.Event,
                    tab: 'EventChat',
                });
            } else {
                Toast.show({
                    text: 'please join the event to see the updates about !',
                    buttonText: 'ok',
                });
            }
            this.props.seen();
        });
    }
    @autobind navigateToLogs() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate('ChangeLogs', { ...this.props });
            } else {
                this.setState({ isDetailsModalOpened: true });
            }
            this.props.seen();
        });
    }
    invite() {
        this.setState({
            openInviteModal: true,
        });
    }
    @autobind navigateToEventDetails() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate('Event', {
                    Event: this.props.Event,
                    tab: 'EventDetails',
                });
            } else {
                this.setState({ isDetailsModalOpened: true });
            }
            this.props.seen();
        });
    }
    actionColor = '#1FABAB'
    fontSize = 18
    textSize = 14
    actionHeight = '14.5%'
    height = '16%'
    original = '#1FABAB'
    transparent = 'rgba(52, 52, 52, 0.0)';
    blinkerSize = 26;
    refreshCommitees() {
        this.refs.Commitee.refreshCommitees();
    }

    setAction = () => {

        if (this.state.action == false) {
            this.setState({ action: true });
        } else {
            this.setState({ action: false });
        }
    }

    onSearch = () => {
        this.props.navigatePage('Home');
    }

    render() {
        return (<View style={{
            backgroundColor: colorList.bodyBackground,
            width: '100%',
            height: colorList.containerHeight,
            borderRadius: 5,
            borderBottomWidth: 0,
            flexDirection:'column-reverse',
            //margin: "1%",
        }}>
            <StatusBar color={'white'}></StatusBar>



            <View style={{ flexDirection: 'row', height: colorList.containerHeight  }}>

                <View style={{
                    backgroundColor: 'white', borderTopLeftRadius: 5,borderTopRightRadius: 5,
                    width: screenWidth * 0.18, ...shadower(1), padding: 2, height: '100%',flexDirection: 'column',
                }}>
                    <View style={{
                        alignItems: 'center',
                        justifyContent:'center',
                        borderTopLeftRadius:5,
                        borderTopRightRadius:5,
                        alignSelf: 'center',
                        height: 73,
                    }}><Button rounded style={{ backgroundColor: '#1FABAB', ...shadower() }} onPress={() => requestAnimationFrame(() => this.props.showActivityPhotoAction())}>
                            {this.props.event.background ? <CacheImages thumbnails
                                source={{ uri: this.props.event.background }}></CacheImages> : <CacheImages thumbnails source={require('../../../../assets/default_event_image.jpeg')} ></CacheImages>}
                        </Button>
                    </View>

                    <View style={{ height: 240, alignSelf: 'center' }}>
                        <ScrollView keyboardShouldPersistTaps={'handled'}
                            nestedScrollEnabled showsVerticalScrollIndicator={false} style={{ height: '100%' }}>
                        <RouteView isChat={this.props.isChat} refreshCommitee={() => this.refreshCommitees()}
                            event_id={this.props.event.id}
                            currentPage={this.props.currentPage}
                            setCurrentPage={(page) => {
                                this.props.setCurrentPage(page);
                            }}></RouteView>
                        </ScrollView>
                    </View>


                    <View style={{
                        width: '100%',
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        borderRadius: 8,
                    }}>
                        <TouchableOpacity style={{ alignSelf: 'center', ...shadower(2), borderRadius: 5, width: 55, height: 50, marginBottom: 5 }} onPress={() => requestAnimationFrame(() => this.onSearch()) }>
                            <View style={{ backgroundColor: colorList.bodyBackground, marginBottom: '15%', width: 55, borderRadius: 5, height: 50, justifyContent: 'center', alignItems: 'center' }}>
                                <Icon style={{ color: colorList.bodyIcon, fontSize: 35 }} type="EvilIcons" name="search"></Icon>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{
                        width: '100%',
                        alignSelf: 'center',
                        backgroundColor: 'white',
                        marginTop:5,
                    }}>
                        <TouchableOpacity style={{ alignSelf: 'center',  width: 55, height: 50, marginBottom: 5 }} onPress={() => this.props.openSettingsModal()} >
                            <View style={{...rounder(50,"white"), alignItems:'center' }}>
                            <Icon style={{ color: colorList.bodyIcon, fontSize: 35 }} type="EvilIcons" name="gear" onPress={() => this.props.openSettingsModal()}></Icon>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{height:50 ,justifyContent:'center', alignItems:'center',position:'absolute',bottom:0,width:screenWidth * 0.18}}>
                        <Icon style={{ color: colorList.bodyIcon, fontSize: 50 }} type="EvilIcons" name="user" onPress={() => BeNavigator.navigateTo("Profile")}></Icon>
                     </View>

                </View>




                {this.state.showCommittees && <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                    <View style={{
                        height: '100%',
                        width: screenWidth * 0.59,
                        backgroundColor: 'white',
                        ...shadower(2),
                    }}>
                        <Commitee
                            computedMaster={this.props.computedMaster}
                            master={this.props.master}
                            ref="Commitee"
                            participant={this.props.event.participant}
                            creator={this.props.creator}
                            join={(id) => { this.props.join(id); }}
                            showCreateCommiteeModal={() => this.props.showCreateCommiteeModal()}
                            leave={(id) => { this.props.leave(id); }}
                            removeMember={(id, members) => { this.props.removeMember(id, members); }}
                            addMembers={(id, currentMembers) => { this.props.addMembers(id, currentMembers); }}
                            publishCommitee={(id, state) => { this.props.publishCommitee(id, state); }}
                            editName={this.props.editName}
                            swapChats={(commitee) => { this.props.swapChats(commitee); }} phone={this.props.phone}
                            commitees={this.props.commitees}
                            event_id={this.props.event.id}>
                        </Commitee>
                    </View>
                </ScrollView>}
            </View>

        </View>);
    }
}


