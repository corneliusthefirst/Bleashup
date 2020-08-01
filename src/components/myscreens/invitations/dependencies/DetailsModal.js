
import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, DeviceEventEmitter, Image, TouchableHighlight, ScrollView } from 'react-native'
import CacheImages from '../../../CacheImages'
import ImageActivityIndicator from '../../currentevents/imageActivityIndicator';
import DeckSwiperModule from './deckswiper/index';
import  FontAwesome5  from 'react-native-vector-icons/FontAwesome5';

export default class DetailsModal extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        details: undefined,
        isOpen: false,
        created_date: undefined,
        event_organiser_name: undefined,
        location: undefined,
        isJoining: false,
        isToBeJoint: false,
        id: undefined
    }
    transparent = "rgba(52, 52, 52, 0.0)";
    details = []
    created_date = "";
    event_organiser_name = ""
    location = ""
    isToBeJoint = false
    id = ""
    componentDidMount() {
        this.setState({
            details: this.props.details ? this.props.details : this.details,
            isOpen: this.props.isOpen,
            created_date: this.props.created_date ? this.props.created_date : this.created_date,
            event_organiser_name: this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name,
            location: this.props.location ? this.props.location : this.location,
            isToBeJoint: this.props.isToBeJoint ? this.props.isToBeJoint : false,
            id: this.props.id ? this.props.id : this.id
        })
        this.id = this.props.id ? this.props.id : this.id
        this.details = this.props.details ? this.props.details : this.details
        this.created_date = this.props.created_date ? this.props.created_date : this.created_date;
        this.event_organiser_name = this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name;
        this.location = this.props.location ? this.props.location : this.location;
        this.isToBeJoint = this.props.isToBeJoint ? this.props.isToBeJoint : false
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            details: nextProps.details ? nextProps.details : this.details,
            isOpen: nextProps.isOpen,
            created_date: this.props.created_date ? this.props.created_date : this.created_date,
            event_organiser_name: this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name,
            location: this.props.location ? this.props.location : this.location,
            isToBeJoint: this.props.isToBeJoint ? this.props.isToBeJoint : this.isToBeJoint,
            id: this.props.id ? this.props.id : this.id
        })
    }



    render() {
       const  accept = this.state.accept
       const deny = this.state.deny

        return this.state.details ? (
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
                     height:"98%",width:"98%", flexDirection: 'column',borderRadius: 8, marginTop:-5 }}
                
            >

              <View style={{margin:5,alignItems:'center' }}>
               <TouchableOpacity  style={{}} onPress={this.props.onClosed}>
                 <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo"  />
               </TouchableOpacity>
               </View>

                <DeckSwiperModule details={this.props.details}/>

              
              
            
                <View style = {{flexDirection:"column",marginTop:"20%",marginLeft:"58%"}}>
                 
        
                        <TouchableOpacity>
                            <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB",marginTop:15 }}>
                                {this.props.location}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.props.OpenLinkZoom}>
                            <Image
                                source={require("../../../../../Images/google-maps-alternatives-china-720x340.jpg")}
                                style={{
                                    height:50,
                                    width: 300,
                                    borderRadius: 15,
                                    marginLeft:-86,
                                    marginTop:5,
                                    marginBottom:5
                                                  

                                }}
                                resizeMode="contain"
                                onLoad={() => { }}
                            />
                           
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.props.OpenLink} style={{}}>
                             <Text note> View On Map </Text>
                        </TouchableOpacity>
               
           </View>

           {this.props.isJoining ?(this.props.hasJoin?
             <View style={{flexDirection:'column',alignItems:'center',marginTop:7}}>
             <FontAwesome5 name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
             <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
             </View> :
             
             <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
              <TouchableOpacity onPress={this.props.onAccept}  style ={{marginLeft:40,alignItems:'center',width:100,marginTop:4,borderRadius:5}} success 
              ><Text style={{fontSize:18,fontWeight:"500",marginLeft:31}} onPress={this.props.joined}>Join</Text></TouchableOpacity>
              <View style={{flexDirection:'column'}}>
              <FontAwesome5 name="comment"  type="FontAwesome5" onPress={{}} style={{marginRight:40,color:"#1FABAB"}}/>
              <Text style={{marginTop:5,color:"#1FABAB",marginRight:40}}>chat</Text>
              </View>
             </View> )
              :
             (this.props.accept||this.props.deny ?              
             <View style={{flexDirection:'column',alignItems:'center',marginTop:7}}>
             <FontAwesome5 name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
             <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
             </View> : 
             
             <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
             <TouchableOpacity onPress={this.props.onAccept}  style ={{marginLeft:40,width:90,borderRadius:5}} success ><Text style={{marginLeft:21}}>Accept</Text>
             </TouchableOpacity>

              <View style={{flexDirection:'column',alignItems:'center'}}>
              <FontAwesome5 name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
              <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
              </View>

             <TouchableOpacity onPress={this.props.onDenied}  style ={{marginRight:40,width:90,borderRadius:5}} danger ><Text style={{marginLeft:25}}>Deny</Text>
             </TouchableOpacity>
              </View>
         
             )
           }

            <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop:this.props.location.length > 19?15:this.props.location.length > 38?5:35

                        }}
                    >
                        <Text style={{ marginLeft: 10 }} note>
                            {this.props.created_date}
                        </Text>
                        <Text style={{fontStyle: "italic",marginRight:7 }}  note>
                            Organised by {this.props.event_organiser_name}
                        </Text>
            </View>


            </Modal>
        ) : null
    }
}
