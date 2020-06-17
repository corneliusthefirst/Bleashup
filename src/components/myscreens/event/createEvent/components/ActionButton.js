import React,{Component} from "react"
import { View, TouchableOpacity } from 'react-native';
import { Text,Button } from "native-base";
import ColorList from '../../../../colorList';
import shadower from '../../../../shadower';

export default class CreateButton extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return  (         
      <View style={{height:"10%",alignSelf:"center", width:this.props.width,alignItems:"center",}}>
        <TouchableOpacity style={{ width:"100%"}} >
                    <Button onPress={() => requestAnimationFrame(this.props.action)} style={{ borderWidth: 1, borderColor: ColorList.bodyIcon, backgroundColor: ColorList.bodyBackground, ...this.props.style}} rounded>
           <View style={{width:"100%",alignItems:"center"}}>
           <Text style={{ color: ColorList.bodyText, fontWeight: 'bold'}}>{this.props.title}</Text>
           </View> 
          </Button>
        </TouchableOpacity>
      </View>
      )
        
    }
}

/** <View style={{ alignSelf: "flex-end",  }}>
            <TouchableOpacity
                style={{ minHeight: 40, borderRadius: 8, ...shadower(2), backgroundColor: ColorList.headerIcon, 
                    justifyContent: 'center', padding: 10, }}
                onPress={() => requestAnimationFrame(this.props.action)}
            >
                <Text
                    style={{
                        alignSelf: 'center',
                        color: ColorList.headerBackground,
                        fontWeight: "bold",
                        fontSize: 20,
                    }}
                >
                    {this.props.title}
                </Text>
            </TouchableOpacity>
        </View> */