import React,{PureComponent} from 'react';
import {View} from "react-native"
import EmojiSelector from "react-native-emoji-selector";
import ColorList from '../../colorList';
import AnimatedPureComponent from '../../AnimatedPureComponent';


export default class ImojieSelector extends AnimatedPureComponent {
    constructor(props){
        super(props)
        this.state = {}
    }
    verboseLoggingFunction(error) { }
    filterFunctionByUnicode = (emoji) => {
        return emoji.lib.added_in === "6.0" || emoji.lib.added_in === "6.1";
    }
    render(){
       return <View style={{ width: "100%", height: 300,backgroundColor: ColorList.bodyBackground, alignSelf: 'center',}}>
            <EmojiSelector
                onEmojiSelected={(emoji) => this.props.handleEmojiSelected(emoji)}
                enableSearch={false}
                ref={(emojiInput) => (this._emojiInput = emojiInput)}
                resetSearch={this.state.reset}
                showSearchBar={false}
                loggingFunction={this.verboseLoggingFunction.bind(this)}
                verboseLoggingFunction={true}
                filterFunctions={[this.filterFunctionByUnicode]}
            ></EmojiSelector>
        </View>
    }
}
