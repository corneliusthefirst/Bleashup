import React,{Component} from "react"
import {Image,View,StatusBar} from "react-native"
import { Spinner} from "native-base"
import ColorList from '../../colorList';
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
            backgroundColor: ColorList.bodyBackground,
            justifyContent: 'center'
        }}>
            <StatusBar animated={true} backgroundColor={ColorList.headerBackground} barStyle="dark-content"></StatusBar>
            <Image resizeMode={"contain"} source={require("../../../../assets/Bleashup.png")}></Image>
            {!this.props.dontshowSpinner?<Spinner size="small" color="#1FABAB" />:null}
        </View>
    }
}