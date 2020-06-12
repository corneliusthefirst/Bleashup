import React,{PureComponent} from "react"
import { View, TextInput } from 'react-native';
import ColorList from '../../colorList';

export default class GrowingInput extends PureComponent{
    constructor(props){
        super(props)
        this.state = {
            height: 15
        }
    }
    updateSize = (heigh) => {
        this.setState({
            height: heigh >= 300 ? 300 : heigh
        });
       // this.props.animateLayout()
    }
    clear(){
        this._textInput.clear()
    }
    focus(){
        this._textInput.focus()
    }
    blur(){
        this._textInput.blur()
    }
    render(){
       return <View>
            <TextInput
                autoCorrect={true}
                value={this.props.textValue}
                onChange={(event) => this.props._onChange(event)}
                placeholder={"Your Message"}
                onFocus={this.props.onFocus}
                style={{
                    alignSelf: "flex-start",
                    maxHeight: 300,
                    left: 0,
                    right: 0,
                    width: "84%",
                    height: this.state.height,
                    borderRadius: 15,
                    marginLeft: "3%",
                }}
                placeholderTextColor="#66737C"
                multiline={true}
                onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)}
                ref={(r) => {
                    this._textInput = r;
                }}
            />
        </View>
    }
}