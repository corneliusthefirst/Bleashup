import React, { Component } from "react"
import { View,TouchableOpacity } from "react-native";
import ProfileView from "../invitations/components/ProfileView";
import ProfileSimple from '../currentevents/components/ProfileViewSimple';

export default class ProfileViewCall extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hide:false
        }
    }

   hide = (hidestate) => {
       console.warn(hidestate);
       this.setState({hide:hidestate})
   } 

  render(){
    return(
     
         !this.state.hide? 
         <TouchableOpacity  onPress={() => {requestAnimationFrame(() => {this.props.createRelation()}) }}>
         <ProfileView contact phoneInfo={this.props.phoneInfo} delay={this.props.delay} phone={this.props.phone} updateContact={this.props.updateContact} hideMe={(hidestate)=>{this.hide(hidestate)}} ></ProfileView>
         </TouchableOpacity>
         :<ProfileSimple profile={this.props.phoneInfo} invite  />
     
    )
 }
}
