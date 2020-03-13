import React,{Component} from "react"
import {Image,View,StatusBar} from "react-native"
import { Spinner} from "native-base"
export default class Waiter extends Component{
    constructor(props){
        super(props)
    }

    render(){
        return <View style={{
            alignItems: 'center',
            flex: 1,
            width:'100%',
            height:'100%',
            backgroundColor: '#FEFFDE',
            justifyContent: 'center'
        }}>
            <StatusBar animated={true} backgroundColor="#FEFFDE" barStyle="dark-content"></StatusBar>
            <Image resizeMode={"contain"} source={require("../../../../assets/Bleashup.png")}></Image>
            {!this.props.dontshowSpinner?<Spinner size="small" color="#1FABAB" />:null}
        </View>
    }
}