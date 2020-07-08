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
        this.setState({
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
                    marginLeft: 4,
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