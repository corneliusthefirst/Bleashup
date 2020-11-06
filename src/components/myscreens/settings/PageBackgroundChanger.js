import React from 'react';
import AnimatedComponent from "../../AnimatedComponent";
import { View, ImageBackground, Text, TouchableOpacity } from "react-native";
import GState from '../../../stores/globalState/index';
import bleashupHeaderStyle from "../../../services/bleashupHeaderStyle";
import Texts from "../../../meta/text";
import ColorList from '../../colorList';
import shadower from "../../shadower";
import { observer } from 'mobx-react';
import Pickers from '../../../services/Picker';
import FileExachange from '../../../services/FileExchange';
import stores from "../../../stores";
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';


@observer class BackgroundImageChanger extends AnimatedComponent {
    initialize() {
        this.handleImageChange = this.handleImageChange.bind(this)
        this.goBack = this.goBack.bind(this)
        this.removeBackground = this.removeBackground.bind(this)
    }
    goBack(){
        this.props.navigation.goBack()
    }
    handleImageChange() {
        Pickers.SnapPhoto(true).then(file => {
            (new FileExachange()).cachFile(file.source,true).then(newPath => {
                stores.States.persistNewBackground(newPath)
            })
        })
    }
    removeBackground(){
        stores.States.removeBackground()
    }
    render() {
        return <ImageBackground
            source={GState.backgroundImage}
            style={GState.imageBackgroundContainer}
        ><View style={{
            flex: 1,
        }}>
                <View style={{
                    width: '100%',
                    height: 50
                }}>
                    <View
                        style={{
                            ...bleashupHeaderStyle,
                            alignItems: 'center',
                            padding: 3,
                            flexDirection:'row',
                            justifyContent: 'space-between'
                        }}
                    >
                    <TouchableOpacity style={{
                        width:60
                    }} onPress={this.goBack}>
                    <MaterialIcons
                    name={'arrow-back'}
                    style={{
                        ...GState.defaultIconSize
                    }}
                    >
                    </MaterialIcons>
                    </TouchableOpacity>
                        <Text style={{
                            ...GState.defaultTextStyle,
                            fontWeight: 'bold',
                            flex: 1
                        }}>
                            {Texts.preview_your_background}
                        </Text>
                        <View style={{
                            minWidth: 60,
                            marginLeft: 15
                        }}>
                            <TouchableOpacity
                                onPress={this.handleImageChange}
                                style={GState.buttonStyle}><Text
                                    style={GState.buttonTextStyle}
                                >
                                    {Texts.change}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            minWidth: 60,
                            marginLeft: 15
                        }}>
                            <TouchableOpacity
                                onPress={this.removeBackground}
                                style={GState.buttonStyle}><Text
                                    style={{
                                        ...GState.buttonTextStyle,
                                        color:ColorList.redIcon
                                }}
                                >
                                    {Texts.remove}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </ImageBackground>
    }
}



export default BackgroundImageChanger