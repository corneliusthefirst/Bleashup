import React, { Component } from "react";
import { View,Dimensions } from 'react-native';
import { Text,Icon } from "native-base";

let {height, width} = Dimensions.get('window');
export default class MessageBox extends Component {
    constructor(props) {
       super(props);
       this.state={
          text:"OKKL",
          width:"80%",
          swidth:360,
          tlength:0,
          isMount:false,
          sender:false,
          received:true,
          sent:false,
          time:"21:30"

        }
       
    } 
    
    length=(AW,n)=>{
       return (AW*n)/360;
    }


    setDimensions= ()=>{
 

        if(this.state.text.length < this.length(this.state.swidth,9)){
           console.warn("calculated accepted length",this.length(this.state.swidth,9));
           this.setState({width:"30%"})
        }
        else if(this.state.text.length< this.length(this.state.swidth,13)){
            this.setState({width:"40%"})
        }
        else if(this.state.text.length < this.length(this.state.swidth,16)){
            this.setState({width:"50%"})
        }
        else if(this.state.text.length < this.length(this.state.swidth,19)){
            this.setState({width:"60%"})
        }
        else if(this.state.text.length < this.length(this.state.swidth,23)){
            this.setState({width:"70%"})
        }
        else{
            this.setState({width:"80%"})
        }
    }

    componentDidMount(){
        this.setDimensions();
        this.setState({isMount:true})
    }
   

 
    render(){
        console.warn("width produced",this.state.width);

        return(this.state.isMount?

            <View  style={{flex:1,flexDirection:"column",justifyContent:"center"}}>

             
              <View  style={{width:"80%",backgroundColor:"#dddddd",alignSelf:"flex-end",borderRadius:8,marginRight:"5%",marginTop:3}}>
                <Text style={{padding:5}} >For example, you can use this property to center a child.</Text>

                   <View style={{flexDirection:"row",width:60,height:20,alignSelf:"flex-end",padding:2}}>
                          
                          <View style={{width:"65%",justifyContent:"center",}}>
                              <Text style={{fontSize:13,color:"black"}} >{this.state.time}</Text>
                          </View>

                          <View style={{width:"35%",justifyContent:"center",alignItems:"center"}}>
                           {!this.state.sender ? this.state.sent ? this.state.received ?
                            <Icon style={{ color: "yellow",fontSize:15}} type="Ionicons" name="ios-checkmark-circle"></Icon> 
                           :<Icon style={{ color: "red",fontSize:15}} type={"EvilIcons"} name="check"></Icon> 
                           :<Icon style={{ color: "#1FABAB",fontSize:15}} type="MaterialCommunityIcons" name="progress-check"></Icon> 
                           : null}
                          </View>

                    </View>

                <View style={{alignSelf:"flex-start",backgroundColor:"white",height:12,width:"98%",borderRadius:3}}>
                   
                </View>
               
              </View>


            <View  style={{width:this.state.width,backgroundColor:"#1FABAB",alignSelf:"flex-start",borderRadius:8,marginLeft:"5%",marginTop:3}}>
               
                     <Text style={{paddingTop:5,paddingLeft:5,paddingRight:5}}>{this.state.text}</Text>

                     <View style={{flexDirection:"row",width:60,height:20,alignSelf:"flex-end",padding:2}}>
                          
                          <View style={{width:"65%",justifyContent:"center",}}>
                              <Text style={{fontSize:13,color:"black"}} >{this.state.time}</Text>
                          </View>

                          <View style={{width:"35%",justifyContent:"center",alignItems:"center"}}>
                           {!this.state.sender ? this.state.sent ? this.state.received ?
                            <Icon style={{color: "yellow",fontSize:15}} type="Ionicons" name="ios-checkmark-circle"></Icon> 
                            :<Icon style={{ color: "red",fontSize:15}} type={"EvilIcons"} name="check"></Icon> 
                            :<Icon style={{ color: "white",fontSize:15 }} type="MaterialCommunityIcons"name="progress-check"></Icon> : null}
                          </View>

                    </View>

                    <View style={{alignSelf:"flex-end",backgroundColor:"white",height:12,width:"98%",borderRadius:3}}> 
                    </View>
               
            </View>


            </View>:null
        )
    }
}