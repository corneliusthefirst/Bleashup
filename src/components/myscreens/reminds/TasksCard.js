import React, { Component } from "react";
import {
  Card, CardItem, Text, Icon, Title, Left, Button, Right
} from "native-base";

import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";
import stores from '../../../stores/index';
import moment from 'moment';
import { find, isEqual, findIndex } from "lodash";
import AccordionModule from '../invitations/components/Accordion';
import Creator from "./Creator";
import RemindsMenu from "./RemindsMenu";

let { height, width } = Dimensions.get('window')


export default class EventTasksCard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenTasks: false,
      isDone: this.props.item.isDone,
      created_date: "",
      created_time: "",
      period_date: "",
      newing: false,
      showAll:false,
      period_time: "",
      mounted: false,
      cardData: this.props.item,
      assignToMe: false,
      userphone: "",
      accordData: { title: "", content: "" },
      RemindCreationState: false,
      long: false
    }

  }
  componentDidMount() {
    console.warn("rendering reminds")
    setTimeout(() => {
      this.state.accordData.title = this.props.item.description.slice(0, 103)
      this.state.accordData.content = this.props.item.description.slice(103, this.props.item.description.length)
      this.setState({ accordData: this.state.accordData, long: this.props.item.description.length > 103, mounted: true })
    }, 20 + 20 * this.props.delay)
  }

  @autobind
  onDone() {
    this.props.markAsDone(this.props.item)
  }

  @autobind
  update() {
    this.props.update(this.props.item)
  }

  @autobind
  assignToMe() {
    console.warn("assigning to meee", findIndex(this.props.item.members,
       { phone: stores.LoginStore.user.phone }) < 0,
        this.props.item.members, stores.LoginStore.user.phone);
    this.props.assignToMe(this.props.item)
    /*stores.Events.getPaticipants(this.props.item.event_id).then((participants)=>{
    let currentParticipant = find(participants,{phone:this.state.userphone})
    this.props.item.members.push( currentParticipant )
    this.setState({cardData:this.props.item})
    let newRemind = {remind_id:this.props.item.id,members:this.props.item.members}
    stores.Reminds.updateMembers(newRemind,true).then(()=>{});
    })*/
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return this.state.mounted !== nextState.mounted ||
      !isEqual(this.props.item, nextProps.item) ||
      this.state.newing !== nextState.newing
  }
  componentDidUpdate(prevProps, prevState) {
    /*if (prevProps.item.description !== this.props.item.description) {
      console.warn("updating description")
      this.setState({ accordData: this.state.accordData, newing: !this.state.newing })
    }*/
  }
  componentWillUnmount(){
    console.warn("umounting reminds")
  }
  saveAll(alarms) {
    this.props.assignToMe(this.props.item, alarms)
  }
  accordData = {
    title: null,
    content: null
  }
  long = false
  render() {
    status = this.props.item.confirmed && findIndex(this.props.item.confirmed, { phone: stores.LoginStore.user.phone }) >= 0
    this.accordData.title = this.props.item.description.slice(0, 103)
    this.accordData.content = this.props.item.description.slice(103,
      this.props.item.description.length)
    this.long = this.props.item.description.length > 103
    return !this.state.mounted ? <Card style={{
      width: '98%', height: 200,
      marginLeft: "2%", marginRight: "2%",
    }}>
    </Card> : (
          <Card style={{ marginLeft: "2%", marginRight: "2%", }}>
            <CardItem>
            <View style={{ flexDirection: 'row', }}><TouchableOpacity onPress={() =>requestAnimationFrame(() =>{
              this.props.updateRemind(this.props.item)
            })
            } style={{width:'97%'}}><Text style={{ width: '100%', fontWeight: "500", fontSize: 14, color: "#1FABAB", alignSelf: 'flex-end', }} 
              note>{`Due on ${moment(this.props.item.recursive_frequency.recurrence).format('dddd, MMMM Do YYYY, h:mm:ss a')}  (view configs)`}</Text></TouchableOpacity>
              <RemindsMenu
                  master={this.props.master}
                  mention={() => this.props.mention({...this.props.item,creator:this.state.creator})}
                  updateRemind={() => this.props.updateRemind(this.props.item)}
                  showMembers={() => this.props.showMembers(this.props.item.members)}
                  addMembers={() => { this.props.addMembers(this.props.item.members, this.props.item) }}
                  removeMembers={() => this.props.removeMembers(this.props.item.members.filter(ele => this.props.master || 
                    ele.phone === stores.LoginStore.user.phone), this.props.item)}
                  viewDoneBy={() => this.props.showDonners(this.props.item.donners, this.props.item)}
                  viewConfirmed={() => this.props.showConfirmed(this.props.item.confirmed, this.props.item)}
                  deleteRemind={() => this.props.deleteRemind(this.props.item)}
                ></RemindsMenu>
                    </View>
            </CardItem>

            <CardItem>
              <Left>
                <Title style={{ fontWeight: "500", marginLeft: -1, fontSize: 20, color: "#696969" }}>{this.props.item.title}</Title>
              </Left>
            </CardItem>
            <CardItem carBody>
            <TouchableOpacity onPress={() => {
              this.setState({
                showAll:!this.state.showAll,
                newing : !this.state.newing
              })
            }}>
            <Text note style={{fontSize: 12,}} ellipsizeMode ={!this.state.showAll?'tail':null} numberOfLines={this.state.showAll?null:5}>{this.props.item.description}</Text>
            </TouchableOpacity>
            </CardItem>

            <CardItem style={{ width: "100%",marginTop: '2%', }}>
              {findIndex(this.props.item.members, { phone: stores.LoginStore.user.phone }) < 0 ?
                this.props.item.status == 'private' ? null :
                  <Button style={{ borderWidth: 2, borderRadius: 10, borderColor: "#1FABAB", width: "32%", alignItems: 'center', justifyContent: 'center', marginLeft: "67%" }}
                    onPress={() => this.assignToMe()} transparent >
                    <Text style={{ fontWeight: "500", color: "#696969", fontSize: 11 }}>Assign To Me</Text>
                  </Button>
                :
                (this.props.item.donners &&
                  findIndex(this.props.item.donners, { phone: stores.LoginStore.user.phone }) >= 0 ?
                  status ?
                    <Icon type="MaterialCommunityIcons" name="check-all" 
                    style={{ color: "#54F5CA", marginLeft: "90%" }}></Icon>
                    : <Icon type="AntDesign" name="check" style={{ color: "#1FABAB", 
                    marginLeft: "90%" }}></Icon>
                  :
                  <Button style={{ borderWidth: 2, marginTop: 5, borderRadius: 10, borderColor: "#1FABAB",
                   width: "21%", alignItems: 'center', justifyContent: 'center', 
                   marginLeft: "78%" }}
                    onPress={() => this.onDone()} transparent >
                    <Text style={{ fontWeight: "500", color: "#696969", 
                    fontSize: 12 }}>{"Done"}</Text>
                  </Button>


                )

              }


            </CardItem>

            <CardItem>
              <Creator giveCreator={(creator) => {
                this.setState({
                  creator:creator,
                  newing:!this.state.newing
                })
              }} creator={this.props.item.creator} created_at={this.props.item.created_at}></Creator>
            </CardItem>
          </Card>

      )
  }

}