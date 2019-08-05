import React, { Component } from 'react'
import Modal from 'react-native-modalbox';
import { View, Text, TouchableOpacity } from 'react-native'
import { Button, Icon } from 'native-base'
import CacheImages from '../../../CacheImages';
import PhotoEnlargeModal from './PhotoEnlargeModal';

export default class PhotoModal extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        image: null,
        enlargeImage:false
    }
    image = null
    componentDidMount() {
        this.setState({
            image: this.props.image ? this.props.image : this.image,
            //isOpen: this.props.isOpen
        })
        this.image = this.props.image ? this.props.image : this.image
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            image: nextProps.image ? nextProps.image : this.image,
            //isOpen: nextProps.isOpen
        })
    }
    transparent = "rgba(52, 52, 52, 0.3)";

    render() {
        return this.state.image ? (
            <Modal
                coverScreen={true}
                isOpen={this.props.isOpen}
                onClosed={this.props.onClosed }
                style={{
                    justifyContent: 'center',
                    alignItems: 'center', height: "80%", borderRadius: 15,
                    backgroundColor: this.transparent, width: "95%"
                }}
                position={'center'}
            >
                <View>
                    <TouchableOpacity style={{}} onPress={this.props.onClosed} transparent>
                        <Icon style={{ color: "#1FABAB", fontSize: 35 }} name="cross" type="Entypo" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={()=> this.setState({enlargeImage:true})} >
                    <CacheImages thumbnails source={{ uri: this.state.image }} style={{ width: 340, height: 420, marginTop: 14 }} square />
                </TouchableOpacity>
            
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
           

            <PhotoEnlargeModal isOpen={this.state.enlargeImage} onClosed={()=> this.setState({enlargeImage:false})} image={this.state.image}  />

            </Modal>
        ) : null
    }

}