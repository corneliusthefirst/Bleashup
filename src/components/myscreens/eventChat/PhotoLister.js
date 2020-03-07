import React, { Component } from 'react';
import shadower from '../../shadower';
import { View } from "react-native"
import CacheImages from '../../CacheImages';
import BleashupFlatList from '../../BleashupFlatList';
import { TouchableOpacity,TouchableWithoutFeedback } from 'react-native-gesture-handler';
import PhotoViewer from '../event/PhotoViewer';
import testForURL from '../../../services/testForURL';
import { Thumbnail, Button } from 'native-base';

export default class Photo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showPhoto:false
        }
    }
    state = {}
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.showPhoto !== nextState.showPhoto
    }
    render() {
        console.warn(this.props.photo)
        return <View style={{ height: '100%',alignSelf: 'center', margin: '2%',}}>
            <BleashupFlatList
                backgroundColor={"transparent"}
                numColumns={5}
                firstIndex={0}
                renderPerBatch={20}
                initialRender={40}
                numberOfItems={this.props.photo.length}
                keyExtractor={(item, index) => item ? item.id : null}
                renderItem={(item, index) => {
                    console.warn("rendering itenmmm")
                    return <Button transparent style={{height:'100%'}} onPress={() => {
                        console.warn("Pressing touchable")
                        this.setState({
                            showPhoto: true,
                            created_at:item.created_at,
                            photo: item.photo
                        })
                    }}><View style={{ ...shadower(), margin: '2.5%', borderRadius: 10, alignSelf: 'center', }}>
                            {testForURL(item.photo) ? <CacheImages style={{borderRadius: 5,}} source={{ uri: item.photo }} square thumbnails large></CacheImages> :
                                <Thumbnail style={{borderRadius: 5,}} source={{ uri: item.photo }} square large></Thumbnail>}
                    </View>
                    </Button>
                }}
                dataSource={this.props.photo}
            ></BleashupFlatList>
            {this.state.showPhoto ? <PhotoViewer created_at={this.state.created_at} open={this.state.showPhoto} photo={this.state.photo} hidePhoto={() => {
                this.setState({
                    showPhoto: false
                })
            }}></PhotoViewer> : null}
        </View>
    }
}