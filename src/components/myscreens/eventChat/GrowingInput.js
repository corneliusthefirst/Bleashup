import React, { PureComponent } from "react";
import { View, TextInput } from "react-native";
import ColorList from "../../colorList";
import BePureComponent from "../../BePureComponent";
import shadower from "../../shadower";
import Texts from "../../../meta/text";

export default class GrowingInput extends BePureComponent {
    constructor(props) {
        super(props);
        this.state = {
            height: 20,
        };
    }
    updateSize = (heigh) => {
        this.setStatePure({
            height: heigh >= this.maxHeight ? this.maxHeight : heigh,
        });
        // this.props.animateLayout()
    };  
    maxHeight = 100
    clear() {
        this._textInput.clear();
    }
    focus() {
        this._textInput.focus();
    }
    blur() {
        this._textInput.blur();
    }
    componentDidMount() {
        this.setStatePure({
            mounted: true,
        });
    }
    render() {
        return this.props.dontShowKeyboard ? null : (
            <View>
                <TextInput
                    autoCorrect={true}
                    value={this.props.textValue}
                    onChange={(event) => {
                        this.state.mounted && this.props.animateLayout();
                        this.props._onChange(event);
                    }}
                    placeholder={Texts.your_text}
                    onFocus={this.props.onFocus}
                    style={{
                        alignSelf: "flex-start",
                        marginHorizontal: 33,
                        maxHeight: this.maxHeight,
                        left: 0,
                        right: 0,
                        width: "88%",
                        //minHeight: 20,
                       height: this.state.height,
                        //marginLeft: "1%",
                    }}
                    placeholderTextColor="#66737C"
                    multiline={true}
                    onContentSizeChange={(e) =>{
                        this.updateSize(e.nativeEvent.contentSize.height)
                    }
                    }
                    ref={(r) => {
                        this._textInput = r;
                    }}
                />
            </View>
        );
    }
}
