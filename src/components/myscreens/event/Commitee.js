import React, { Component } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Text, Content, Icon } from 'native-base';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import firebase from 'react-native-firebase';
import stores from '../../../stores';
export default class Commitee extends Component {
constructor(props){
    super(props)
    this.state = {
        currentRoom:"General"
    }
}
state = {}
componentDidMount() {
    stores.LoginStore.getUser().then((user)=>{
        firebase.messaging().requestPermission().then(staus =>{
            firebase.messaging().getToken().then(token =>{
                console.warn(token)
                firebase.database().ref(`notifications_tokens/${user.phone.replace('00', '+')}`).set(token)
                firebase.database().ref(`rooms/${this.props.event_id}/${this.state.currentRoom}` ).set({
                  name: "general",
                   description: "this is the Activity Chenneral discusssion group",
                    members: [{phone: "+237650594616",master:true}, { phone : "+237694765457",master:false}, {phone:"+237698683806",master:true}]
               })
            }).catch(error =>{
                console.warn(error)
            })
        })
    })   
}
render() {
    return (
        <View style={{ height:"100%",flex: 1,}}>
            <View style={{ borderTopRightRadius: 15, borderBottomRightRadius: 15,
            backgroundColor: "#1FABAB", height: 35, width: "95%",display: 'flex',flexDirection: 'row',}}>
                <Text style={{ marginTop: "1%",fontWeight: 'bold',marginLeft: "3%",fontSize: 20, alignSelf: 'center', width: "90%" }}>Commitees</Text>
                <TouchableWithoutFeedback onPress={()=> this.props.showSelectableMembers()}><Icon style={{marginLeft: "-6%",marginTop: "1%", color:"#0A4E52"}} 
                    name="pluscircle" type="AntDesign"></Icon></TouchableWithoutFeedback>
            </View>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View style={{margin: 5,height:"100%"}}>
            <Text>Reading and writing data
                    This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
                triggered once for the initial state of the data and again anytime the data changes.Reading and writing data
                    This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
                triggered once for the initial state of the data and again anytime the data changes.Reading and writing data
                    This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
triggered once for the initial state of the data and again anytime the data changes.Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
                triggered once for the initial state of the data and again anytime the data changes.Reading and writing data
                    This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
triggered once for the initial state of the data and again anytime the data changes   This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
                triggered once for the initial state of the data and again anytime the data changes.Reading and writing data
                    This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
                triggered once for the initial state of the data and again anytime the data changes.Reading and writing data
                    This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
triggered once for the initial state of the data and again anytime the data changes.Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
                triggered once for the initial state of the data and again anytime the data changes.Reading and writing data
                    This document covers the basics of retrieving data and how to order and filter Firebase data.
                    
                    Firebase data is retrieved by attaching an asynchronous 
                    listener to a firebase.database.Reference. The listener is 
triggered once for the initial state of the data and again anytime the data changes</Text></View></ScrollView></View>
    );
}
}