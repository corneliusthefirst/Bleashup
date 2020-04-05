import React, { Component } from 'react';
import shadower from '../../shadower';
import { View } from "react-native"
import CacheImages from '../../CacheImages';
import BleashupFlatList from '../../BleashupFlatList';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PhotoViewer from '../event/PhotoViewer';
import testForURL from '../../../services/testForURL';
import { Thumbnail, Button, Icon } from 'native-base';
import VideoViewer from '../highlights_details/VideoModal';
import MediaSeparator from './MediaSeparator';
import buttoner from '../../../services/buttoner';

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
        console.warn(this.props.video)
        return <View style={{ height: '100%', alignSelf: 'center', margin: '2%', }}>
            <BleashupFlatList
                backgroundColor={"transparent"}
                numColumns={5}
                firstIndex={0}
                renderPerBatch={20}
                initialRender={40}
                numberOfItems={this.props.video.length}
                keyExtractor={(item, index) => item ? item.id : null}
                renderItem={(item, index) => {
                    return item.type === 'date_separator' ? <View style={{margin: '4%',}}><MediaSeparator item={item}>
                    </MediaSeparator></View> : <Button transparent style={{ height: '100%' }} onPress={() => {
                        this.setState({
                            showVideo: true,
                            created_at: item.created_at,
                            video:item.source
                        })
                    }}><View style={{ ...shadower(), margin: '2.5%', borderRadius: 10, alignSelf: 'center', }}>
                            {testForURL(item.thumbnailSource) ? <CacheImages style={{ borderRadius: 5, }} source={{ uri: item.thumbnailSource }} square thumbnails large></CacheImages> :
                                <Thumbnail style={{ borderRadius: 5, }} source={{ uri: item.thumbnailSource }} square large></Thumbnail>}
                                <Icon type={'EvilIcons'} name={"play"} style={{color:'#FEFFDE',position: 'absolute',alignSelf:'center',marginTop: '35%',backgroundColor: 'black',
                                opacity:.5,
                                height:10,
                                borderRadius:10}}></Icon>
                        </View>
                    </Button>
                }}
                dataSource={this.props.video}
            ></BleashupFlatList>
            {this.state.showVideo ? <VideoViewer created_at={this.state.created_at} open={this.state.showVideo} video={this.state.video} hideVideo={() => {
                this.setState({
                    showVideo: false
                })
            }}></VideoViewer> : null}
        </View>
    }
}