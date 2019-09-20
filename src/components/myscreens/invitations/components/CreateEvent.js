import React, { Component } from "react";
import { Header,Container,Content,Card,CardItem,Text,Footer,BodyTabs,Tabs,Tab,Right,FooterTab,Button,Left,
Body,ScrollableTab,Title,Icon } from "native-base";
import { StyleSheet, View ,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';

export default class CreateEvent extends Component {
  constructor(props){
    super(props)
  }

  render() {
    return (

   <Container style={{marginBottom:"23%"}}>
        <ActionButton buttonColor="#1CDBAB" position="center" backgroundTappable={true} btnOutRange="green">
         <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={() => {console.warn("these are log")}} size={70}>
            <Icon name="md-notifications-off" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#9b59b6' title="New Event" onPress={()=>{this.props.Parentprops.navigation.navigate("CreateEventView")}} size={60}>
            <Icon name="md-create" style={styles.actionButtonIcon} />
          </ActionButton.Item>   
          <ActionButton.Item buttonColor='#1abc9c' title="Tasks/Reminds" onPress={() => {this.props.Parentprops.navigation.navigate("MyTasksView")}} size={50}>
            <Icon name="tasks" type="FontAwesome" style={styles.actionButtonIcon} />
          </ActionButton.Item>

        </ActionButton>

   </Container>
          
    );
  }
}


const styles = StyleSheet.create({
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white'
  }
});
