import React ,{Component} from "react"
import { View, TextInput } from 'react-native';
import { Input } from 'native-base';
import colorList from './../../../../colorList';

export default class CreateTextInput extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return <View
            style={{
                height: this.props.height?this.props.height:colorList.containerHeight/9,
                alignItems: "center",
                width:'100%',
                
            }}
        >

                <Input
                    style={{
                        width: "80%",
                        height: "100%",
                        borderBottomWidth:1,
                        borderColor:colorList.bodyIcon ,
                        color:colorList.bodyText,
                        textAlignVertical: "top",
                        borderRadius:5,
                        backgroundColor:this.props.backgroundColor?this.props.backgroundColor:"white"
                    }}
                    value={this.props.value }
                    maxLength={this.props.maxLength||100}
                    placeholder={this.props.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    inverse
                    last
                    onChangeText={this.props.onChange}
                    multiline={this.props.multiline?this.props.multiline:false}
                    numberOfLines={this.props.numberOfLines?this.props.numberOfLines:1}
                />
            
        </View>
    }
}


