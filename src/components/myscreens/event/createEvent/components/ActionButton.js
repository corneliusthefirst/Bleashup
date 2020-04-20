import React,{Component} from "react"
import { View, TouchableOpacity } from 'react-native';
import { Text } from "native-base";
import ColorList from '../../../../colorList';
import shadower from '../../../../shadower';

export default class CreateButton extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{ alignSelf: "flex-end",  }}>
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
        </View>
    }
}