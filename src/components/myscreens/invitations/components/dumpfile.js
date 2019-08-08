

/*import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { Button, Icon, Card, CardItem, Right,Left } from 'native-base'
import CacheImages from '../../../CacheImages';
import autobind from "autobind-decorator";
import { TouchableHighlight, ScrollView } from 'react-native-gesture-handler';
import ImageActivityIndicator from '../../currentevents/imageActivityIndicator';
import DeckSwiper from './deckswiper';

export default class DetailsModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        profile: undefined,
       // isOpen: false
    }
    profile = null;
    componentDidMount() {
        this.setState({
            profile: this.props.profile ? this.props.profile : this.profile,
           // isOpen: this.props.isOpen
        })
        this.profile = this.props.profile ? this.props.profile : this.profile
    }
    /* shouldComponentUpdate(nextProps) {
         return (this.props.profile.name !== nextProps.profile.name)
             || (this.props.profile.image !== nextProps.profile.image)
             || (this.props.isOpen !== nextProps.isOpen) ? true : false;
     }
     componentDidUpdate(PreviousProp) {
         this.setState({
             profile: this.props.profile.name,
             isOpen: this.props.isOpen
         })
 
     }*/
    componentWillReceiveProps(nextProps) {
        this.setState({
            profile: nextProps.profile ? nextProps.profile : this.profile,
           // isOpen: nextProps.isOpen
        })

    }
    render() {
  return this.props.item ? 
  (      
         <Modal
                backdropPressToClose={false}
                swipeToClose={false}
                backdropOpacity={0.5}
                animationDuration={100}
                backButtonClose={true}
                position='bottom'
                position={'center'}
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                     height:this.props.accept||this.props.deny ? "95%": "98%",width:"98%", flexDirection: 'column',borderRadius: 8, backgroundColor: '#FEFFDE',marginTop:-5 }}
                
            >
                
                    <View style={{ flexDirection: 'row',height: "5%", marginTop: "6%" }}>
                    <Left/>
                        
                            <TouchableOpacity  style={{justifyContent: 'center'}}
                                onPress={ this.props.onClosed } transparent>

                                <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                            </TouchableOpacity>
                    <Right/>
                     
                   </View>

                <DeckSwiper details={this.props.details}/>

              
              
            
                <View style = {{flexDirection:"column",marginTop:(this.props.accept||this.props.deny) ? "25%" : "22%",marginLeft:"58%"}}>
                 
        
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
             <View style={{flexDirection:'column',alignItems:'center',marginTop:10}}>
             <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
             <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
             </View> :
             
             <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
              <Button onPress={this.props.onAccept}  style ={{alignItems:'center',marginRight:70,width:100,marginTop:4,borderRadius:5}} success ><Text style={{fontSize:18,fontWeight:"500",marginLeft:31}} onPress={this.props.joined}>Join</Text></Button>
              <View style={{flexDirection:'column'}}>
              <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{marginLeft:70,color:"#1FABAB"}}/>
              <Text style={{marginTop:5,color:"#1FABAB",marginLeft:70}}>chat</Text>
              </View>
             </View> )
              :
             (this.props.accept||this.props.deny ?              
             <View style={{flexDirection:'column',alignItems:'center',marginTop:10}}>
             <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
             <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
             </View> : 
             
             <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
             <Button onPress={this.props.onAccept}  style ={{marginRight:50,width:"25%"}} success ><Text style={{marginLeft:18,borderRadius:5}}>Accept</Text></Button>

              <View style={{flexDirection:'column',alignItems:'center'}}>
              <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
              <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
              </View>

             <Button onPress={this.props.onDenied}  style ={{marginLeft:50,width:"25%"}} danger ><Text style={{marginLeft:15,borderRadius:5}}>Deny</Text></Button>
              </View>
         
             )
           }

            <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop:this.props.location.length > 19?20:this.props.location.length > 38?10:35 

                        }}
                    >
                        <Text style={{ marginLeft: 10 }} note>
                            {this.props.created_date}
                        </Text>
                        <Text style={{fontStyle: "italic",marginRight:7 }}  note>
                            Organised by {this.props.event_organiser_name}
                        </Text>
            </View
      </Modal>

       ) : null
           

    }
}























/*
export default class DetailModal extends Component {
    constructor(props) {
        super(props)
    }


    render() {
        
       // return this.props.item ? (
           return(
            <Modal
                //backdropPressToClose={false}
                //swipeToClose={false}
               // backdropOpacity={0.5}
                //animationDuration={100}
               // backButtonClose={true}
                //position='bottom'
                position={'center'}
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed}
                style={{
                     height:this.props.accept||this.props.deny ? "95%": "98%",width:"98%", flexDirection: 'column',borderRadius: 8, backgroundColor: '#FEFFDE',marginTop:-5 }}
                
            >
                
                    <View style={{ flexDirection: 'row',height: "5%", marginTop: "6%" }}>
                    <Left/>
                        
                            <TouchableOpacity  style={{justifyContent: 'center'}}
                                onPress={ this.props.onClosed } transparent>

                                <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                            </TouchableOpacity>
                    <Right/>
                     
                   </View>

                <DeckSwiper details={this.props.details}/>

              
              
            
                <View style = {{flexDirection:"column",marginTop:(this.props.accept||this.props.deny) ? "25%" : "22%",marginLeft:"58%"}}>
                 
        
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
             <View style={{flexDirection:'column',alignItems:'center',marginTop:10}}>
             <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
             <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
             </View> :
             
             <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10}}>
              <Button onPress={this.props.onAccept}  style ={{alignItems:'center',marginRight:70,width:100,marginTop:4,borderRadius:5}} success ><Text style={{fontSize:18,fontWeight:"500",marginLeft:31}} onPress={this.props.joined}>Join</Text></Button>
              <View style={{flexDirection:'column'}}>
              <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{marginLeft:70,color:"#1FABAB"}}/>
              <Text style={{marginTop:5,color:"#1FABAB",marginLeft:70}}>chat</Text>
              </View>
             </View> )
              :
             (this.props.accept||this.props.deny ?              
             <View style={{flexDirection:'column',alignItems:'center',marginTop:10}}>
             <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
             <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
             </View> : 
             
             <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:15}}>
             <Button onPress={this.props.onAccept}  style ={{marginRight:50,width:"25%"}} success ><Text style={{marginLeft:18,borderRadius:5}}>Accept</Text></Button>

              <View style={{flexDirection:'column',alignItems:'center'}}>
              <Icon name="comment"  type="FontAwesome5" onPress={{}} style={{color:"#1FABAB"}}/>
              <Text style={{marginTop:5,color:"#1FABAB"}}>chat</Text>
              </View>

             <Button onPress={this.props.onDenied}  style ={{marginLeft:50,width:"25%"}} danger ><Text style={{marginLeft:15,borderRadius:5}}>Deny</Text></Button>
              </View>
         
             )
           }

            <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop:this.props.location.length > 19?20:this.props.location.length > 38?10:35 

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
     //   ) : null
           
           );

    }
}

*/


























 /*
    state = {
        details: undefined,
      //  isOpen: false,
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
       //     isOpen: this.props.isOpen,
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
    //        isOpen: nextProps.isOpen,
            created_date: this.props.created_date ? this.props.created_date : this.created_date,
            event_organiser_name: this.props.event_organiser_name ? this.props.event_organiser_name : this.event_organiser_name,
            location: this.props.location ? this.props.location : this.location,
            isToBeJoint: this.props.isToBeJoint ? this.props.isToBeJoint : this.isToBeJoint,
            id: this.props.id ? this.props.id : this.id
        })
    }

   

   
    /*
    @autobind close() {
        this.setState({ isOpen: true })
    }*/






















/*
                          {this.state.isToBeJoint ?
                            (this.state.isJoining ? <ImageActivityIndicator /> : 
                           
                            <TouchableOpacity  onPress={this.join} transparent>
                                <Text style={{ fontWeight: "300",fontSize: 20, color: "#54F5CA"}}>JOIN</Text>
                            </TouchableOpacity>) :
                            
                            <Button transparent>
                            <Text style={{ fontWeight: "300", fontSize: 20,color: this.transparent }}>JOIN</Text>
                            </Button>}

                <View style={{ marginLeft: "25%" }}>
                            {this.state.isToBeJoint ?
                                <Right>{this.state.isJoining ? <ImageActivityIndicator /> : <TouchableOpacity
                                    onPress={this.join}
                                    transparent><Text style={{
                                        fontWeight: "bold",
                                        fontSize: 20, color: "#54F5CA"
                                    }}>JOIN</Text></TouchableOpacity>}</Right> :
                                <Button transparent><Text style={{
                                    fontWeight: "bold", fontSize: 20,
                                    color: this.transparent
                                }}>JOIN</Text></Button>}
                        </View>
                    </View>


                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Text style={{ marginLeft: 7 }} note>
                            {this.state.created_date}
                        </Text>
                        <Text style={{ marginLeft: "-30%", fontStyle: "italic" }} note>
                            Organised by {this.state.event_organiser_name}
                        </Text>
                    </View>
                </View>


                <View style={{ width: "100%", height: 300 }}>
                    <DeckSwiper
                        ref={(c) => this._deckSwiper = c}
                        dataSource={this.props.item}
                        renderEmpty={() =>
                            <View style={{ alignSelf: "center" }}>
                                <Text>Over</Text>
                            </View>
                        }
                        renderItem={item => this.Desc(item)}
                    />
                </View>

                <View style={{ height: "20%" }}>
                    <View style={{ marginLeft: 160, }}>
                        <TouchableOpacity>
                            <Text ellipsizeMode="clip" numberOfLines={3} style={{ fontSize: 14, color: "#1FABAB" }}>
                                {this.state.location}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.OpenLinkZoom}>
                            <Image
                                source={require("../../Images/google-maps-alternatives-china-720x340.jpg")}
                                style={{
                                    height: 100,
                                    width: "70%",
                                    borderRadius: 15,
                                    marginTop: -10

                                }}
                                resizeMode="contain"
                                onLoad={() => { }}
                            />
                            <Text note> View On Map </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.OpenLink} style={{}}>

                        </TouchableOpacity>
                    </View>
*/