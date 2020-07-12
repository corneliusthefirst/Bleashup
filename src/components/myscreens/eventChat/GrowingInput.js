import React,{PureComponent} from "react"
import { View, TextInput } from 'react-native';
import ColorList from '../../colorList';
import BePureComponent from '../../BePureComponent';

export default class GrowingInput extends BePureComponent{
    constructor(props){
        super(props)
        this.state = {
            height: 15
        }
    }
    updateSize = (heigh) => {
        this.setStatePure({
            height: heigh >= 100 ? 100 : heigh
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
    componentDidMount(){
        this.setStatePure({
            mounted:true
        })
    }
    render(){
       return <View>
            <TextInput
                autoCorrect={true}
                value={this.props.textValue}
                onChange={(event) => {
                    this.state.mounted && this.props.animateLayout()
                    this.props._onChange(event)
                }}
                placeholder={"Your Message"}
                onFocus={this.props.onFocus}
                style={{
                    alignSelf: "flex-start",
                    marginLeft: this.props.textValue.length> 1 ? "2%" : "8%",
                    maxHeight: 100,
                    left: 0,
                    right: 0,
                    minHeight: 15,
                    width: "90%",
                    height: this.state.height,
                    borderRadius: 15,
                    //marginLeft: "3%",
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