import React, { Component } from "react";
import { View, Animated, TouchableWithoutFeedback, Dimensions, PanResponder } from 'react-native';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import UpdateStateIndicator from "../currentevents/components/updateStateIndicator";
import { List, Icon, Label, Card, CardItem, Text, Header, Thumbnail, Title, Button } from 'native-base';
import Image from 'react-native-scalable-image';
import InvitationModal from "../currentevents/components/InvitationModal";
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import stores from "../../../stores";
import RouteView from "./RouteView";
import ActionsView from "./ActionsView";
import Commitee from "./Commitee";
import moment from "moment";
import CacheImages from '../../CacheImages';
import shadower from "../../shadower";
import { dateDiff, writeDateTime } from "../../../services/datesWriter";
import dateDisplayer from '../../../services/dates_displayer';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import SearchView from "./searchView";


const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

export default class SWView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            scrollY: new Animated.Value(0),
            action:false,
            search:false
        }
    }
    width = "9%"
    padding = "9%"
    indicatorMargin = {
        marginLeft: "5%",
        marginTop: "-7%",
        position: 'absolute',

    };

    @autobind navigateToEventChat() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "EventChat"
                });
            } else {
                Toast.show({
                    text: "please join the event to see the updates about !",
                    buttonText: "ok"
                })
            }
            this.props.seen()
        })
    }
    @autobind navigateToLogs() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("ChangeLogs", { ...this.props })
            } else {
                this.setState({ isDetailsModalOpened: true })
            }
            this.props.seen()
        })
    }
    invite() {
        this.setState({
            openInviteModal: true
        })
    }
    @autobind navigateToEventDetails() {
        stores.Events.isParticipant(this.props.Event.id, stores.Session.SessionStore.phone).then(status => {
            if (status) {
                this.props.navigation.navigate("Event", {
                    Event: this.props.Event,
                    tab: "EventDetails"
                });
            } else {
                this.setState({ isDetailsModalOpened: true })
            }
            this.props.seen()
        })
    }
    actionColor = "#1FABAB"
    fontSize = 18
    textSize = 14
    actionHeight = "14.5%"
    height = "16%"
    original = "#1FABAB"
    transparent = "rgba(52, 52, 52, 0.0)";
    blinkerSize = 26;
    refreshCommitees() {
        this.refs.Commitee.refreshCommitees()
    }

   setAction = ()=>{
    
       if(this.state.action == false){
           this.setState({action:true});
       }else{
           this.setState({action:false})
       }
   }

   setSearch = ()=>{
    if(this.state.search == false){
        this.setState({search:true});
       
    }else{
        this.setState({search:false})
    }
  }

    render() {
        return <View style={{
            backgroundColor: "#FEFFDE",
            width: "100%",
            borderRadius: 5,
            borderBottomWidth: 0,
            //margin: "1%",
        }}>
            <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={false}>
                <View style={{ flexDirection: 'row',height:924}}>
                    <View style={{
                        backgroundColor: 'white', borderRadius: 5,
                        width: screenWidth * .18, ...shadower(5),
                        borderRadius: 5, paddingLeft: '2.5%', padding: "2%", height: '98%', margin: '2%', marginBottom: '2%',
                    }}>
                        <View style={{
                            alignItems: 'center',
                            height: 70, margin: '1%', padding: '6%',
                        }}><Button rounded style={{ backgroundColor: '#1FABAB', ...shadower() }} onPress={() => requestAnimationFrame(() => this.props.showActivityPhotoAction())}>
                                {this.props.event.background ? <CacheImages thumbnails
                                    source={{ uri: this.props.event.background }}></CacheImages> : <CacheImages thumbnails source={require('../../../../assets/default_event_image.jpeg')} ></CacheImages>}
                            </Button>
                        </View>
                        <View style={{ height: 300, alignSelf: 'center', }}>

                        
                        <View  style={{height:25,width:55,justifyContent:"center",alignItems:"center",backgroundColor:"mintcream",borderRadius:10,marginBottom: 8}}>
                           <Text style={{ color:"#1FABAB",fontSize:14}} >pages</Text>
                        </View>
            
                          <View style={{ height: 215, alignSelf: 'center', }}>
                            <RouteView isChat={this.props.isChat} refreshCommitee={() => this.refreshCommitees()}
                                event_id={this.props.event.id}
                                currentPage={this.props.currentPage}
                                setCurrentPage={(page) => {
                                    this.props.setCurrentPage(page)
                                }}></RouteView>
                            </View>

                            <TouchableOpacity style={{ alignSelf: 'center',...shadower(2),borderRadius: 5,width: 55, height: 50}} onPress={this.setSearch}>
                               <View style={{backgroundColor: '#FEFFDE',marginBottom: '15%',width: 55,borderRadius: 5,height: 50,justifyContent:"center",alignItems:"center"}}>
                                 <Icon style={{ color:"#1FABAB",fontSize:50}} type="EvilIcons" name="search"></Icon>
                               </View>
                            </TouchableOpacity>

                        </View>



                        <TouchableOpacity  style={{height:25,width:55,marginTop:"15%",marginBottom:"20%",alignSelf:"center"}} onPress={this.setAction}>
                        <View  style={{height:25,width:55,justifyContent:"center",alignItems:"center",backgroundColor:"mintcream",borderRadius:10}}>
                           <Text style={{ color:"#1FABAB",fontSize:14}} >actions</Text>
                        </View>
                        </TouchableOpacity>

                 {this.state.action?
                  <View style={{
                    width: '100%',
                    height: 400,
                    alignSelf: 'center',
                    backgroundColor: 'white',
                    borderRadius: 8
                }}>
                    <ActionsView 
                        calendared={this.props.calendared}
                        period={this.props.period}
                        exitActivity={this.props.exitActivity}
                        handleSync={this.props.handleSync}
                        publish={() => this.props.publish()}
                        leaveActivity={() => this.props.leaveActivity()}
                        inviteContacts={() => this.props.inviteContacts()}
                        openSettingsModal={() => this.props.openSettingsModal()}
                        ShowMyActivity={(a) => this.props.ShowMyActivity(a)}
                        showMembers={() => this.props.showMembers()}></ActionsView>
                </View>
                 :null}       
                       
                    </View>
                          {this.state.search==false?
                                        <View style={{
                                            height: '100%',
                                            width: screenWidth * .56,
                                            backgroundColor: 'white',
                                            ...shadower(2),
                                        }}>
                                            
                                            <View style={{ height: 70 }}><View style={{
                                                height: '62%',
                                                width: "101%",
                                            }}><View style={{
                                                paddingLeft: '2%',
                                                ...bleashupHeaderStyle, marginLeft: '-1%', marginRight: 0,
                                                alignSelf: 'center',
                                                flexDirection: 'row',
                                            }}><View style={{ marginLeft: '1%', width: '85%' }}><Title style={{
                                                fontWeight: 'bold',
                                                fontSize: 14,
                                                marginTop: 2,
                                                color: "#0A4E52",
                                                alignSelf: 'flex-start',
                                            }}>{this.props.event.about.title}</Title>
                                                        {this.props.event.period ? <Title style={{
                                                            alignSelf: 'flex-start',
                                                            fontWeight: this.props.event.closed ? "bold" : "400",
                                                            color: this.props.event.closed ? "red" : dateDiff(this.props.event) > 0 ? "gray" : "#1FABAB", fontSize: 12,
                                                        }}>{this.props.event.closed ? "Closed" : writeDateTime(this.props.event)}</Title> : null}
                                                        {/*this.props.event.interval > 1 && this.props.event.frequency !== 'yearly' && this.dateDiff(this.props.event) < 0 ?
                                                            <Text style={{
                                                                color: "#1FABAB"
                                                            }} note>
                                                                {`after every ${this.props.event.interval > 1 ? this.props.event.interval :
                                                                    null} ${this.writeInterval(this.props.event.frequency)} till 
                                                                         ${moment(this.props.event.recurrence ? this.props.event.recurrence :
                                                                        null).format("dddd, MMMM Do YYYY")}`}
                                                                         </Text> : null*/}
                                                    </View><View style={{ width: '14%' }}><Icon onPress={() => {
                                                        this.props.navigateHome()
                                                    }} style={{
                                                        alignSelf: 'center', color: "#1FABAB", margin: '2%',
                                                        marginBottom: "6%"
                                                    }} name="close" type="EvilIcons"></Icon></View></View></View></View>
                                            <Commitee
                                                computedMaster={this.props.computedMaster}
                                                master={this.props.master}
                                                ref="Commitee"
                                                participant={this.props.event.participant}
                                                creator={this.props.creator}
                                                join={(id) => { this.props.join(id) }}
                                                showCreateCommiteeModal={() => this.props.showCreateCommiteeModal()}
                                                leave={(id) => { this.props.leave(id) }}
                                                removeMember={(id, members) => { this.props.removeMember(id, members) }}
                                                addMembers={(id, currentMembers) => { this.props.addMembers(id, currentMembers) }}
                                                publishCommitee={(id, state) => { this.props.publishCommitee(id, state) }}
                                                editName={this.props.editName}
                                                swapChats={(commitee) => { this.props.swapChats(commitee) }} phone={this.props.phone}
                                                commitees={this.props.commitees}
                                                event_id={this.props.event.id}>
                                            </Commitee>
                                        </View>:<SearchView></SearchView>}

                </View>
            </ScrollView>
        </View>
    }
}