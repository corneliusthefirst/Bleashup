import React, { Component } from 'react';
import shadower from '../../shadower';
import { View, Dimensions, TouchableOpacity, TouchableWithoutFeedback,Text } from "react-native"
import CacheImages from '../../CacheImages';
import BleashupFlatList from '../../BleashupFlatList';
import PhotoViewer from '../event/PhotoViewer';
import testForURL from '../../../services/testForURL';
import VideoViewer from '../highlights_details/VideoModal';
import MediaSeparator from './MediaSeparator';
import buttoner from '../../../services/buttoner';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ColorList from '../../colorList';
import GState from '../../../stores/globalState';

let { height, width } = Dimensions.get('window');
export default class Video extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showPhoto: false
        }
    }
    state = {}
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.showVideo !== nextState.showVideo
    }
    render() {
        //console.warn(this.props.video)
        return <View style={{ height: '100%', alignSelf: 'center' }}>
        <View style={{flex:1,marginTop:5}}>
            <BleashupFlatList
                backgroundColor={"transparent"}
                numColumns={5}
                firstIndex={0}
                renderPerBatch={20}
                initialRender={40}
                numberOfItems={this.props.video.length}
                keyExtractor={(item, index) => item ? item.id : null}
                renderItem={(item, index) => {
                    return item.type === 'date_separator' ?<MediaSeparator item={item} style={{height:width/3,width:width/3,borderColor:"white",borderWidth:1}}>
                    </MediaSeparator>: <TouchableOpacity transparent style={{height:width/3,width:width/3}} onPress={() => {
                        this.setState({
                            showVideo: true,
                            created_at: item.created_at,
                            video:item.source
                        })
                    }}><View style={{ ...shadower(),alignSelf: 'center', }}>
                            {testForURL(item.thumbnailSource) ? <CacheImages style={{height:width/3,width:width/3,borderColor:"white",borderWidth:1}} source={{ uri: item.thumbnailSource }} square thumbnails ></CacheImages> :
                                <Image resizeMode={"cover"} style={{height:width/3,width:width/3,borderColor:"white",borderWidth:1}} source={{ uri: item.thumbnailSource }}></Image>}
                                <EvilIcons  name={"play"} style={{...GState.defaultIconSize,color:ColorList.bodyBackground,position: 'absolute',alignSelf:'center',marginTop: '35%',backgroundColor: 'black',
                                opacity:.5,
                                height:10,
                                borderRadius:10}}/>
                        </View>
                    </TouchableOpacity>
                }}
                dataSource={this.props.video}
            ></BleashupFlatList>
            </View>
            {this.state.showVideo ? <VideoViewer created_at={this.state.created_at} open={this.state.showVideo} video={this.state.video} hideVideo={() => {
                this.setState({
                    showVideo: false
                })
            }}></VideoViewer> : null}
        </View>
    }
}