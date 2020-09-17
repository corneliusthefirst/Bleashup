import React, { Component } from 'react';
import { observer } from 'mobx-react';
import BeComponent from '../../BeComponent';
import { View, TextInput, TouchableOpacity, BackHandler } from 'react-native';
import Texts from '../../../meta/text';
import rounder from '../../../services/rounder';
import ColorList from '../../colorList';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import GState from '../../../stores/globalState/index';
import shadower from '../../shadower';
import AnimatedComponent from '../../AnimatedComponent';


@observer class Searcher extends AnimatedComponent {
    initialize() {
        this.state = {
            searchString:this.props.searchString||""
        }
    }
    animationDuration = 250
    componentMounting() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
    unmountingComponent() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton.bind(this));
    }
    handleBackButton() {
        if (this.props.searching) {
            this.props.cancelSearch && this.props.cancelSearch()
            return true
        } else {
            return false
        }
    }
    debounceSearch(text) {
        this.setStatePure({
            searchString:text
        })
        if (this.searchTimeout) clearTimeout(this.searchTimeout)
       this.searchTimeout = setTimeout(() => {
            this.props.search && this.props.search(text)
            this.searchTimeout = null
        }, 500)
    }
    onChangeText(e) {
        let text = e;
        this.debounceSearch(text)
    }
    render() {
        return <View style={{
            flexDirection: 'column',
            ...shadower(1),
            height: "100%",
            backgroundColor: ColorList.bodyBackground,
            margin: '1%',
            borderRadius: 35,
        }}>
            {this.props.searching ? <View style={{
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                height: "100%",
                justifyContent: 'space-between',
            }}>
                <View>
                    <TextInput
                        autoCapitalize={"none"}
                        selectTextOnFocus
                        value={this.state.searchString}
                        style={{
                            minWidth: 200,
                            maxWidth: 250,
                            height: 35,
                            marginLeft: '2%',
                            alignSelf: "flex-start",
                        }}
                        autoFocus
                        placeholder={Texts.enter_your_search}
                        onChangeText={this.onChangeText.bind(this)}
                    >
                    </TextInput>
                </View>
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            //this.animationDuration = 800
                            setTimeout(() => {
                                //this.animateUI()
                                this.props.cancelSearch && this.props.cancelSearch()
                                this.animationDuration = this.defaultAnimationDuration
                            })
                        }
                        }
                        style={{
                            marginTop: "-40%",
                            alignSelf: 'center',
                            justifyContent: 'center',
                        }}
                >
                        <EvilIcons style={{
                            ...GState.defaultIconSize
                        }} name={"close"}>
                        </EvilIcons>
                    </TouchableOpacity>
                </View>
            </View> :
                <TouchableOpacity
                    style={{
                        ...rounder(35, ColorList.bodyBackground),
                        justifyContent: 'center',
                    }}
                    onPress={() => {
                        //this.animationDuration = 800
                        setTimeout(() => {
                            //this.animateUI()
                            this.props.startSearching && this.props.startSearching()
                            this.animationDuration = this.defaultAnimationDuration
                        })
                    }}
                >
                    <EvilIcons
                        name={"search"}
                        style={{ ...GState.defaultIconSize, color: ColorList.indicatorColor }}
                    >
                    </EvilIcons>
                </TouchableOpacity>}
        </View>
    }
}

export default Searcher