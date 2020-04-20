import React ,{Component} from "react"
import { View, TextInput } from 'react-native';
import { Item } from "native-base";

export default class CreateTextInput extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return <View
            style={{
                height: this.props.height,
                alignItems: "center",
                margin: "2%",
                width:'100%'
            }}
        >
            <Item
                style={{
                    borderColor: "#1FABAB",
                    width: "95%",
                    margin: "2%",
                    height: "90%",
                }}
                rounded
            >
                <TextInput
                    style={{
                        width: "100%",
                        height: "100%",
                        margin: "2%",
                        marginBottom: "5%",
                    }}
                    value={this.props.value }
                    maxLength={this.props.maxLength||100}
                    placeholder={this.props.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    inverse
                    last
                    onChangeText={this.props.onChange}
                />
            </Item>
        </View>
    }
}