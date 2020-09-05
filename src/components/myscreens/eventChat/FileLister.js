import React, { Component } from 'react';
import shadower from '../../shadower';
import { View, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback} from "react-native"
import CacheImages from '../../CacheImages';
import BleashupFlatList from '../../BleashupFlatList';
import testForURL from '../../../services/testForURL';
import moment from 'moment';
import Pickers from '../../../services/Picker';
import MediaSeparator from './MediaSeparator';
import  FontAwesome  from 'react-native-vector-icons/FontAwesome';
import ColorList from '../../colorList';

let { height, width } = Dimensions.get('window');
export default class File extends Component {
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
    openFile(source) {
        Pickers.openFile(source)
    }
    render() {
        console.warn(this.props.file)
        return <View style={{ height: '100%', margin: '2%', }}>
            <BleashupFlatList
                backgroundColor={"transparent"}
                firstIndex={0}
                renderPerBatch={20}
                initialRender={15}
                numberOfItems={this.props.file.length}
                keyExtractor={(item, index) => item ? item.id : null}
                renderItem={(item, index) => {
                    return item.type === 'date_separator' ? <MediaSeparator item={item}>
                    </MediaSeparator> : <View style={{
                        ...shadower(3), margin: '2%', borderRadius: 10,
                         opacity: .8, alignSelf: 'center', width: '100%',
                    }}>
                        <View style={{ flexDirection: 'row', }}>
                            <View style={{ width: "60%", height: '100%' }}>
                                <Text elipsizeMode={'tail'} numberOfLines={4} style={{ margin: '2%', }}>{item.file_name}</Text>
                            </View>
                            <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                                <Text elipsizeMode={"tail"} numberOfLines={1}
                                    style={{ fontSize: 30, color: "#0A4E52", alignSelf: 'flex-start', marginTop: '30%', }}>{item.file_name.split(".")
                                    [item.file_name.split(".").length - 1].toUpperCase()}
                                </Text>
                            </View>
                            <View style={{ width: '15%', alignItems: 'center', justifyContent: 'center', flex: 1, }}>
                                <FontAwesome onPress={() => {
                                    this.openFile(item.source)
                                }} type="FontAwesome" style={{
                                    color: ColorList.bodyIcon,
                                    fontSize: 22, marginTop: '40%',
                                }} name="folder-open"/>
                            </View>
                        </View>
                        <View style={{ margin: '2%', }}>
                            <Text>{moment(item.created_at).calendar()}</Text>
                        </View>
                    </View>
                }}
                dataSource={this.props.file}
            ></BleashupFlatList>
        </View>
    }
}