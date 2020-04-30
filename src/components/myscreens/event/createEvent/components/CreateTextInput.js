import React ,{Component} from "react"
import { View, TextInput } from 'react-native';
import { Input,Text } from 'native-base';
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
                justifyContent:"center"
                
            }}
        >

                <Input
                disabled={this.props.disabled}
                    style={{
                        width: "100%",
                        height: "100%",
    
                        borderBottomWidth:1,
                        borderColor:colorList.bodyIcon ,
                        color:colorList.bodyText,
                        textAlignVertical: "top",
                        borderRadius:5,
                        backgroundColor:this.props.backgroundColor?this.props.backgroundColor:colorList.bodyDarkWhite
                    }}
                    value={this.props.value }
                    maxLength={this.props.maxLength||100}
                    placeholder={`@${this.props.placeholder}`}
                    keyboardType="email-address"
                    autoCapitalize="sentences"
                    returnKeyType="next"
                    inverse
                    last
                    onChangeText={this.props.onChange}
                    multiline={this.props.multiline?this.props.multiline:false}
                    numberOfLines={this.props.numberOfLines?this.props.numberOfLines:1}
                />
            <View style={{position:'absolute',alignSelf: 'flex-end',margin: '2%',}}><Text>{`${this.props.value && this.props.value.length} / ${this.props.maxLength||100}`}</Text></View>
        </View>
    }
}


