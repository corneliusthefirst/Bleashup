import React, { Component } from "react";
import {
  Content, Card, CardItem, Text, Body, Container, Icon, Header,
  Form, Item, Title, Input, Left, Right, H3, H1, H2, Spinner,
  Button, InputGroup, DatePicker, Thumbnail, Alert
} from "native-base";

import { StyleSheet, View,Image,TouchableOpacity} from 'react-native';
import ActionButton from 'react-native-action-button';
import Modal from 'react-native-modalbox';
import autobind from "autobind-decorator";



export default class EventContribution extends Component {
    constructor(props) {
        super(props)

    }

    render() {
    	return(
                <Modal
                isOpen={this.props.parentComponent.state.ContributionState}
                onClosed={()=>{this.props.parentComponent.setState({ContributionState:false})}}
                style={{
                    height: "45%", borderRadius: 15,
                    backgroundColor:"#FEFFDE",borderColor:'black',borderWidth:1,width: "98%",flexDirection:'column',
                    marginTop:"-2%"
                }}
                position={'bottom'}
                backdropPressToClose={false}
                coverScreen={false}
                >
                </Modal>

    )}

    }