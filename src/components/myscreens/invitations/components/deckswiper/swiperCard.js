import React, { Component } from "react";
import { Content, Card,Icon,CardItem, Container,DeckSwiper,Text, Body } from "native-base";
import {View,Image,ScrollView,TouchableOpacity} from 'react-native';
import Modal from 'react-native-modalbox';


export default class SwiperCard extends Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
               <Card style={{ elevation: 3, marginTop: 50 ,marginBottom:10}}>
                    <CardItem>
                        <Text note>description</Text>
                    </CardItem>
                    <CardItem style={{ height: 40 }}>
                        <Text style={{ color: "#1FABAB", fontSize: 18,marginLeft:24 }}>{this.props.item.event_title}</Text>
                    </CardItem>
                    <CardItem cardBody>
                        <Icon name="caretleft" type="AntDesign" style={{ color: "#1FABAB" }}
                            onPress={this.props.swipeleft} />

                      
                        <Text style={{ height: 300, flex: 1,fontStyle:'italic',fontWeight:"600" }} >
                            {this.props.descriptionStartData}
                      {this.props.descriptionEndData != "" ? <Text style={{ color: "blue" }} onPress={this.props.onOpen} > ...view all</Text>:
                      ("")}
                        </Text>
                      

                        <Icon name="caretright" style={{ color: "#1FABAB" }} type="AntDesign"
                            onPress={this.props.swiperight} />

                    </CardItem>
                    <Modal
                        isOpen={this.props.descriptionEnd}
                        onClosed={this.props.onClosed}
                        style={{ padding: 20, alignItems: 'center', height: 220, flex: 1, borderRadius: 15, backgroundColor: '#FEFFDE', width: 330 }}
                        position={'center'}
                        swipeArea={210}
                        backdropOpacity={0.1}
                    >
                       <ScrollView style={{}}>
                        <TouchableOpacity onPress={this.props.onClosed}>
                        <Text style={{fontStyle:'italic',fontWeight:"600",color:"green"}}>{this.props.descriptionStartData}...</Text>
                        <Text style={{fontStyle:'italic',fontWeight:"600"}}>...{this.props.descriptionEndData}</Text>
                         </TouchableOpacity>
                       </ScrollView>
                    </Modal>


                </Card>
    )


     }
}
