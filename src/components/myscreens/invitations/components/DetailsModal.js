
import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, DeviceEventEmitter, Image } from 'react-native'
import { Button, Icon, Card, CardItem,Right,Left } from 'native-base'
import CacheImages from '../../../CacheImages'
import autobind from 'autobind-decorator';
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import ImageActivityIndicator from '../../currentevents/components/imageActivityIndicator';
import DeckSwiperModule from './deckswiper/index';

export default class DetailsModal extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
  transparent = "rgba(52, 52, 52, 0.0)";


    render() {

        return this.props.details ? (
            <Modal
                backdropPressToClose={false}
                swipeToClose={false}
                backdropOpacity={0.5}
                animationDuration={10}
                backButtonClose={true}
                position='bottom'
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                 style={{
                     height:"98%",width:"98%", flexDirection: 'column',borderRadius: 8, backgroundColor: '#FEFFDE',marginTop:"-1%"}}
                
            >

              <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
               <TouchableOpacity  style={{}} onPress={this.props.onClosed}>
                 <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo"  />
               </TouchableOpacity>
               </View>


               <View style={{flex:7,flexDirection:'column',width:"100%"}}>
                <DeckSwiperModule details={this.props.details}/>
               </View>
              
              
            
                <View style = {{flex:2,flexDirection:"column",marginTop:"10%",marginRight:3}}>
                 
                        <View style={{alignSelf:'flex-end',marginRight:10,width:"35%"}}>
                        <TouchableOpacity>
                            <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB" }}>
                                {this.props.location}
                            </Text>
                        </TouchableOpacity>
                        </View>

                        <View style={{alignSelf:'flex-end',alignSelf:'stretch',marginTop:"1%"}}>
                        <TouchableOpacity onPress={this.props.OpenLinkZoom}>
                            <Image
                                source={require("../../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                                style={{
                                    height:"100%",
                                    width:"35%",
                                    alignSelf:'flex-end',
                                    borderRadius: 15,
                                    marginRight:5
                                                  

                                }}
                                resizeMode="contain"
                                onLoad={() => { }}
                            />
                           
                        </TouchableOpacity>
                        </View>

                        <View style={{alignSelf:'flex-end',marginTop:"1%",marginRight:"2%"}}>
                        <TouchableOpacity onPress={this.props.OpenLink} style={{}}>
                             <Text note> View On Map </Text>
                        </TouchableOpacity>
                        </View>
               
           </View>


         {this.props.isJoining ? (this.props.hasJoin ?
                    <View style={{flex:2,flexDirection: 'column', alignItems: 'center', justifyContent:'center',marginTop:"2%" }}>
                        <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                        <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                    </View> :

                    <View style={{flex:2,flexDirection: 'row', justifyContent: 'space-between',alignItems:'center',marginTop:"2%" }}>
                        <View>
                        <Button onPress={this.props.joined} style={{ justifyContent:'center', marginLeft: 40, width: 100, borderRadius: 3 }} success >
                        <Text style={{fontWeight:"500",fontSize:18}}>Join</Text></Button>
                        </View>
                        <View style={{ flexDirection: 'column' }}>
                            <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ marginRight: 40, color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB", marginRight: 40 }}>chat</Text>
                        </View>
                    </View>)
                    :
                    (this.props.accept || this.props.deny ?
                        <View style={{flex:2,flexDirection: 'column', alignItems: 'center',justifyContent:'center',marginTop:"2%" }}>
                            <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                            <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                        </View> :

                        <View style={{flex:2,flexDirection: 'row', justifyContent: 'space-between',alignItems:'center',marginTop:"2%"}}>
                            <View>
                            <Button onPress={this.props.onAccept} style={{ width: 100,justifyContent:'center',borderRadius:4,marginLeft:20}} success ><Text>Accept</Text></Button>
                            </View>
                            <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                                <Icon name="comment" type="FontAwesome5" onPress={{}} style={{ color: "#1FABAB" }} />
                                <Text style={{ marginTop: 5, color: "#1FABAB" }}>chat</Text>
                            </View>
                             <View>
                            <Button onPress={this.props.onDenied} style={{  width: 100,justifyContent:'center',borderRadius:4 ,marginRight:20}} danger ><Text>Deny</Text></Button>
                            </View>
                        </View>

                    )
                }

           <View style={{flex:1,flexDirection: "column",justifyContent: 'flex-end',marginBottom:"1%"}}>
            <View style={{flexDirection: "row",justifyContent: "space-between"}}
                    >
                        <Text style={{ marginLeft: 10 }} note>
                            {this.props.created_date}
                        </Text>
                        <Text style={{fontStyle: "italic",marginRight:7 }}  note>
                            Organised by {this.props.event_organiser_name}
                        </Text>
            </View>
           </View>

            </Modal>
        ) : null
    }
}




/*marginTop:this.props.location.length > 19?15:this.props.location.length > 38?5:35*/