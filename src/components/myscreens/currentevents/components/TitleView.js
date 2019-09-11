import React, { Component } from "react"
import { View,TouchableOpacity } from 'react-native';
import { Text,Left } from 'native-base';
import autobind from "autobind-decorator";
import { observer } from "mobx-react";
import SvgAnimatedLinearGradient from 'react-native-svg-animated-linear-gradient'
import Svg, { Circle, Rect } from 'react-native-svg'
import stores from "../../../../stores";
import DetailsModal from "../../invitations/components/DetailsModal";
import {forEach} from "lodash"
@observer export default class TitleView extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isDetailsModalOpened : false,
            isJoining : false

        }
    }
    componentDidMount() {
        this.formDetailModal(this.props.Event).then(details => {
            this.formCreator().then(creator =>{
                this.setState({
                    details: details,
                    creator : creator,
                    loaded :true
                })
            })
        })
    }
    formCreator(){
        return new Promise((resolve,reject)  =>{
            stores.TemporalUsersStore.getUser(this.props.Event.creator_phone).then((user)=>{
                resolve({name:user.nickname,status:user.status,image:user.profile})
            })
        })
    }
    formDetailModal(event) {
        return new Promise((resolve, reject) => {
            stores.Highlights.fetchHighlights(event.id).then(highlights => {
                let card = [];
                let i = 0;
                Description = { event_title: event.about.title, event_description: event.about.description }
                card.push(Description)
                if (highlights.length !== 0) {
                    forEach(highlights, hightlight => {
                        card.push(hightlight);
                        if (i === highlights.length - 1) {
                            resolve(card)
                        }
                        i++
                    })
                } else {
                    resolve(card)
                }
            })
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
    writeDateTime() {
        return "on the " + this.props.Event.period.date.year +
            "/" +
            this.props.Event.period.date.month +
            "/" +
            this.props.Event.period.date.day +
            "  at " +
            this.props.Event.period.time.hour +
            ":" +
            this.props.Event.period.time.mins +
            ":" +
            this.props.Event.period.time.secs
    }
    render() {
       return  <View>
           <View style={{

           }}>
               <View>
                   <TouchableOpacity onPress={() => requestAnimationFrame(() => {
                       this.navigateToEventDetails()
                   }
                   )}>
                       <View>
                           <Text
                               adjustsFontSizeToFit={true}
                               style={{
                                   fontSize: 20,
                                   fontWeight: "bold",
                                   fontFamily: "Roboto",
                               }}
                           >
                               {this.props.Event.about.title}{/*{" "}{this.props.Event.id}*/}
                           </Text>
                           <Text
                               style={{
                                   color: "#1FABAB",
                                   
                               }}
                               note
                           >
                               {this.writeDateTime()}
                           </Text>
                       </View>
                       <View>
                           <Left>
                               {this.props.Event.recursive ? <View style={
                                   {
                                       flexDirection: "column"
                                   }
                               }>
                                   <View>
                                       <Text style={{
                                           color: "#54F5CA"
                                       }} note>
                                           {this.props.Event.recursion.type}
                                       </Text>
                                   </View>

                                   <View>
                                       <Text note>
                                           {this.props.Event.recursion.days}
                                       </Text>
                                   </View>
                               </View> : null}
                           </Left>
                       </View>
                   </TouchableOpacity>
               </View>
           </View>{this.state.loaded ? <DetailsModal
               isToBeJoint={!(this.props.Event.joint)}
               join={() => {
                   this.props.join()
                   this.setState({
                       isDetailsModalOpened: false
                   })
               }}
               isOpen={this.state.isDetailsModalOpened}
               isJoining={this.state.isJoining}
               details={this.state.details}
               created_date={this.props.Event.created_at}
               location={this.props.Event.location.string}
               event_organiser_name={this.state.creator.name}
               onClosed={() => this.setState({ isDetailsModalOpened: false })}
           />:null}
       </View> 
            }
}