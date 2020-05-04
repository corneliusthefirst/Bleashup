import React,{Component} from "react"

import {View} from "react-native"
import {TouchableOpacity} from "react-native"
import TitleView from './TitleView';
import CacheImages from '../../../CacheImages';
import { Thumbnail } from 'native-base';
export default class ActivityProfile extends Component{
    constructor(props){
        super(props)
    }
    render(){
        return <View style={{flexDirection: 'row',flexWrap: 'wrap',paddingLeft:"4%"}}>
            <TouchableOpacity style={{ alignSelf: 'flex-start', width: '15%', alignItems: "center", paddingTop: "2%" }} onPress={() => this.props.Event.background && this.props.showPhoto && this.props.showPhoto(this.props.Event.background)} >
                <View style={{ alignSelf: 'flex-start', width: '100%', alignItems: "center", paddingTop: "2%" }} >
                    {this.props.Event.background ? <CacheImages small thumbnails square source={{ uri: this.props.Event.background }}
                        style={{
                            height: 50, justifyContent: 'center', width: 50, alignSelf: 'center',
                            borderRadius: 25
                        }}></CacheImages> : <View style={{ flex: 1 }}><Thumbnail small style={{ height: 50, width: 50,borderRadius: 25 }} medium source={require('../../../../../assets/default_event_image.jpeg')}></Thumbnail></View>
                    }
                </View>
            </TouchableOpacity>

            <View style={{ width: '75%', paddingLeft: 6, marginTop: '3%',paddingLeft:"6%" }}>
            <TitleView Event={this.props.Event||{}} openDetail={() => this.props.openDetails && this.props.openDetails(this.props.Event)} join={() => this.props.join && this.props.join()} joint={this.props.joint} seen={() => this.props.markAsSeen && markAsSeen()}
            ></TitleView>
            </View>

        </View>
    }
}