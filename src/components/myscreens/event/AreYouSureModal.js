import React, { PureComponent } from 'react';
import { View, Text,ScrollView,TouchableOpacity } from "react-native"
import Modal from "react-native-modalbox"
import bleashupHeaderStyle from '../../../services/bleashupHeaderStyle';
import ColorList from '../../colorList';
import shadower from '../../shadower';
import Texts from '../../../meta/text';
import GState from '../../../stores/globalState';

export default class AreYouSure extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            content: null
        }
    }
    state = {}
    buttonStyle = {
        alignItems: 'center',
        backgroundColor: ColorList.bodyBackground,
        ...shadower(2),
        justifyContent: 'center',
        borderRadius: 10, width: 70, height: 40
    }
    render() {
        return (
            <Modal
                backdropOpacity={0.7}
                backButtonClose={true}
                position='center'
                coverScreen={true}
                //animationDuration={0}
                isOpen={this.props.isOpen}
                onClosed={() => {
                    this.props.closed()
                    this.setState({
                        message: null,
                        title: null,
                        callback: null,
                    })
                }}
                onOpened={() => {
                    setTimeout(() => {
                        this.setState({
                            content: this.props.content
                        })
                    }, 20)
                }}
                style={{
                    height: 200,
                    borderBottomLeftRadius: 8,
                    borderBottomRightRadius: 8,
                    
                    width: 300
                }}
            >
                <ScrollView style={{ flexDirection: 'column', }}>
                    <View style={{ width: "100%", height: 44 }}>
                        <View style={{...bleashupHeaderStyle,paddingLeft: '1%',}}>
                            <Text style={{ ...GState.defaultTextStyle, fontSize: 20, alignSelf: 'center', fontWeight: '400',  }}>{this.props.title}</Text>
                        </View>
                    </View>
                    <View style={{ margin: '5%', }}>
                        <Text style={{ ...GState.defaultTextStyle, color: 'grey' }}>{this.props.message}</Text>
                    </View>
                    <View style={{ 
                        width:"90%",
                        justifyContent: 'space-between',
                        height:80,
                        margin: 'auto', alignSelf: 'center',
                        flexDirection: 'row', }}>
                    <View style={{width:'50%'}}>
                        <TouchableOpacity onPress={() => this.props.closed()} 
                        style={this.buttonStyle} >
                        <Text style={{...GState.defaultTextStyle,
                            fontWeight: 'bold',}}>{Texts.cancel}</Text>
                        </TouchableOpacity>
                        </View>
                        <View style={{width:'50%'}}>
                        <TouchableOpacity  style={{
                            ...this.buttonStyle,backgroundColor: ColorList.delete,
                        }}  onPress={() => {
                            this.props.callback()
                            this.props.closed()
                        }}><Text>{this.props.ok ? this.props.ok : "Leave"}</Text>
                         </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        );
    }
}