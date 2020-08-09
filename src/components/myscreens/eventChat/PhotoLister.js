import React, { Component } from 'react';
import shadower from '../../shadower';
import { View, Dimensions, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import CacheImages from '../../CacheImages';
import BleashupFlatList from '../../BleashupFlatList';
import PhotoViewer from '../event/PhotoViewer';
import testForURL from '../../../services/testForURL';
import moment from 'moment';
import MediaSeparator from './MediaSeparator';

let { height, width } = Dimensions.get('window');
export default class Photo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showPhoto: false,
            mounted:false
        }
    }
    componentDidMount() {
        setTimeout(() => {
            this.setState({
                mounted: true
            })
        }, 100)
    }
    state = {}
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return this.state.showPhoto !== nextState.showPhoto ||
            this.state.mounted !== nextState.mounted
    }
    render() {
        //console.warn(this.props.photo)
        return !this.state.mounted ? <Spinner size="small"></Spinner> : <View style={{ height: '100%', alignSelf: 'center' }}>
            <View style={{ flex: 1, marginTop: 5 }}>
                <BleashupFlatList
                    backgroundColor={"transparent"}
                    numColumns={3}
                    firstIndex={0}
                    renderPerBatch={20}
                    initialRender={40}
                    numberOfItems={this.props.photo.length}
                    keyExtractor={(item, index) => item ? item.id : null}
                    renderItem={(item, index) => {
                        //console.warn("rendering itenmmm")
                        return item.type === 'date_separator' ? <MediaSeparator item={item} style={{ height: width / 3, width: width / 3, borderColor: "white", borderWidth: 1 }}>
                        </MediaSeparator> : <Button transparent style={{ height: width / 3, width: width / 3 }} onPress={() => {
                            console.warn("Pressing touchable")
                            this.setState({
                                showPhoto: true,
                                created_at: item.created_at,
                                photo: item.photo
                            })
                        }}><View style={{ ...shadower(), alignSelf: 'center', }}>
                                    {testForURL(item.photo) ? <CacheImages style={{ borderColor: "white", borderWidth: 1, height: width / 3, width: width / 3 }} source={{ uri: item.photo }} square thumbnails ></CacheImages> :
                                        <Thumbnail style={{ borderColor: "white", borderWidth: 1, height: width / 3, width: width / 3 }} source={{ uri: item.photo }} square ></Thumbnail>}
                                </View>
                            </Button>
                    }}
                    dataSource={this.props.photo}
                ></BleashupFlatList>
            </View>
            {this.state.showPhoto ? <PhotoViewer created_at={this.state.created_at} open={this.state.showPhoto} photo={this.state.photo} hidePhoto={() => {
                this.setState({
                    showPhoto: false
                })
            }}></PhotoViewer> : null}
        </View>
    }
}