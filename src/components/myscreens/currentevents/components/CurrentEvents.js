
import React, { Component } from 'react';
import { View, Dimensions,BackHandler } from 'react-native';
import PublicEvent from "./publicEvent.js"
import { observer } from 'mobx-react';
import BleashupScrollView from '../../../BleashupScrollView.js';
import BleashupFlatList from '../../../BleashupFlatList';
import Orientation from 'react-native-orientation-locker';
import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view';
import Image from 'react-native-scalable-image';
import { Icon } from 'native-base';
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

@observer export default class CurrentEvents extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    showPhoto(url){
        this.setState({
            showPhoto:true,
            photo:url
        })
    }
    componentWillMount() {
        Orientation.unlockAllOrientations(); 
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    }
    handleBackButton() {
        if(this.state.showPhoto){
            this.setState({
                showPhoto:false
            })
            return true
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    };
    
    render() {
        return (
            <View style={{ height: "100%", backgroundColor: "#FEFFDE"}}>
                <BleashupFlatList
                    keyExtractor={(item, index) => item.id}
                    dataSource={this.props.data}
                    renderItem={(item, index) => <PublicEvent showPhoto={(url)=> this.showPhoto(url)} key={item.id}  {...this.props} Event={item} />}
                    firstIndex={0}
                    renderPerBatch={1}
                    initialRender={3}
                    numberOfItems={this.props.data.length}
                >
                </BleashupFlatList>
                {
                    // ******************Photo Viewer View ***********************//
                    this.state.showPhoto ?
                        <View style={{ height: screenheight, width: screenWidth, position: "absolute", backgroundColor: "black", }}>
                            <ReactNativeZoomableView
                                maxZoom={1.5}
                                minZoom={0.5}
                                zoomStep={0.5}
                                initialZoom={1}
                                bindToBorders={true}
                                onZoomAfter={this.logOutZoomState}>
                                <Image resizeMode={"contain"} width={screenWidth} height={screenheight}
                                    source={{ uri: this.state.photo }}></Image>
                            </ReactNativeZoomableView>
                            <Icon type="EvilIcons" onPress={() => {
                                this.setState({
                                    showPhoto: false
                                })
                            }} style={{ margin: '1%', position: 'absolute', fontSize: 30, color: "#FEFFDE" }} name={"close"}></Icon>
                        </View> : null
                }
            </View>
        )
    }
}





/*const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
}
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        ((contentSize.height - paddingToBottom) * (0.9));
};

@observer export default class CurrentEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentRender: this.initialRender,
            endReached: false
        }
    }
    initialRender = 3
    renderPerBatch = 3
    previousRendered = 0
    _renderEvents(array) {
        return array.map(element => {
            return <PublicEvent key={element.id} index={element.id}  {...this.props} Event={element} />
        })
    }
    continueScrollDown(renderPerBatch) {
        this.previousRendered = this.state.currentRender
        if (this.state.currentRender <= this.props.data.length - 1) {
            this.setState({
                currentRender: this.previousRendered + this.renderPerBatch
            })
        } else {
            this.setState({
                endReached: true
            })
        }
    }
    render() {
        return (
            <ScrollView
                nestedScrollEnabled={true}
                ref='_scrollView'
                onScroll={({ nativeEvent }) => {
                    // console.warn(nativeEvent)
                }}
                onScrollEndDrag={({ nativeEvent }) => {
                    if (isCloseToBottom(nativeEvent)) {
                        this.continueScrollDown(this.initialRender)
                    }
                }
                }
            >
                {
                    this._renderEvents(this.props.data.slice(0, this.state.currentRender))}
                <CardItem style={{ height: 25 }} >
                    {this.state.endReached ? <Text style={{
                        marginLeft: "35%"
                    }}>no more events to load</Text> : <Spinner size={"small"}></Spinner>}
                </CardItem>
            </ScrollView>
        )
    }
}
*/

/*@observer export default class CurrentEvents extends Component {
    constructor(props) {
        super(props)
        this.data = this.props.data._data;
        this.dataSize = this.props.data._size
        this.initialRender = 4;
        this.currentRendered = 4;
        this.renderPerBatch = 3
        this.scroll = 0;
        this.zero = 0;
        this.one = 1;
        this.two = 2;
        this.three = 3;
        this.state = {
            zero: 0,
            one: 1,
            two: 2,
            three: 3,
            endReached: false,
            topReached: true
        }
    }
    continueScrollDown(renderPerBatch) {
        if (this.currentRendered < this.dataSize) {
            this.zero += renderPerBatch
            this.one += renderPerBatch
            this.two += renderPerBatch
            this.three += renderPerBatch
            this.currentRendered += renderPerBatch
            this.setState({
                zero: this.zero,
                one: this.one,
                two: this.two,
                three: this.three,
                topReached: false
            })
            renderPerBatch == 3 ? this.refs._scrollView.scrollTo({ x: 0.5, y: 0.5, animated: true }) :
                this.refs._scrollView.scrollTo({ x: 0, y: 650.1, animated: true });
            this.scroll = 0;
        } else {
            this.setState({
                endReached: true
            })
        }
    }
    continueSrollUp(renderPerBatch) {
        if (this.currentRendered > this.initialRender) {
            this.zero -= renderPerBatch
            this.one -= renderPerBatch
            this.two -= renderPerBatch
            this.three -= renderPerBatch
            this.currentRendered -= renderPerBatch
            this.setState({
                zero: this.zero,
                one: this.one,
                two: this.two,
                three: this.three,
                //topReached: true
                endReached: false
            })
            this.scroll = 0;
            renderPerBatch == 3 ?
                this.refs._scrollView.scrollToEnd({ animated: true, duration: 5 }) :
                this.refs._scrollView.scrollTo({ x: 0.5, y: 400, animated: true });
        } else {
            this.setState({
                topReached: true
            })
        }
    }

    render() {
        return (
            <ScrollView
                nestedScrollEnabled={true}
                ref='_scrollView'
                onScroll={({ nativeEvent }) => {
                    this.scroll += 1;
                }}
                onScrollEndDrag={({ nativeEvent }) => {
                    if (this.scroll < 20) {
                        if (ifCloseToTop(nativeEvent)) {
                            this.setState({
                                topReached: false
                            })
                            this.continueSrollUp(this.renderPerBatch)
                        }
                        if (isCloseToBottom(nativeEvent)) {
                            this.continueScrollDown(this.renderPerBatch)
                        }
                    } else if (this.scroll <= 100 && this.scroll >= 20) {
                        if (ifCloseToTop(nativeEvent)) {
                            this.setState({
                                topReached: false
                            })
                            this.continueSrollUp(1)
                        }
                        if (isCloseToBottom(nativeEvent)) {
                            this.continueScrollDown(1);
                        }
                    } else {
                        this.scroll = 0
                    }
                }}
            >
                <View>
                    {this.state.topReached ? null : <CardItem style={{ height: 25 }} >
                        {<Spinner size={"small"}></Spinner>}
                    </CardItem>}
                    <PublicEvent key={this.data[this.state.zero] ? this.data[this.state.zero].item.id : undefined}  {...this.props} Event={this.data[this.state.zero] ? this.data[this.state.zero].item : undefined} />
                    <PublicEvent key={this.data[this.state.one] ? this.data[this.state.one].item.id : undefined}  {...this.props} Event={this.data[this.state.one] ? this.data[this.state.one].item : undefined} />
                    <PublicEvent key={this.data[this.state.two] ? this.data[this.state.two].item.id : undefined}  {...this.props} Event={this.data[this.state.two] ? this.data[this.state.two].item : undefined} />
                    <PublicEvent key={this.data[this.state.three] ? this.data[this.state.three].item.id : undefined}  {...this.props} Event={this.data[this.state.three] ? this.data[this.state.three].item : undefined} />
                    <CardItem style={{ height: 25 }} >
                        {this.state.endReached ? <Text style={{
                            marginLeft: "35%"
                        }}>no more events to load</Text> : <Spinner size={"small"}></Spinner>}
                    </CardItem>
                </View>
            </ScrollView >
        )
    }
}



*/





/*export default class CurrentEvents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.props.data.slice(0, 3)),
        };
        this.layoutProvider = new LayoutProvider((i) => {
            return this.state.list.getDataForIndex(i).type;
        }, (type, dim) => {
            switch (type) {
                case 'NORMAL':
                    dim.width = SCREEN_WIDTH;
                    dim.height = 500;
                    break;
                default:
                    dim.width = 0;
                    dim.height = 0;
                    break;
            };
        })
    }

    add3TinitialArra() {
        this.setState({
            list: new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(this.props.data.slice(0, 3))
        })
    }
    rowRenderer = (type, data) => {
        console.warn(data.item.id)
        return data.item.public ? (
            <PublicEvent index={data.item.id}  {...this.props} Event={data.item} />
        ) : (
                <PrivateEvent index={data.item.index} {...this.props} parentCardList={this}
                    Event={data.item.index} />
            );
    }

    render() {
        return (
            <View style={styles.container}>
                <RecyclerListView
                    style={{ flex: 1 }}
                    canChangeSize
                    renderAheadOffset={2 * 500}
                    initialOffset={0}
                    onEndReached={() => {
                        console.warn("end reached !!")
                        return this.add3TinitialArra()
                    }}
                    rowRenderer={this.rowRenderer}
                    dataProvider={this.state.list}
                    layoutProvider={this.layoutProvider}
                    scrollViewProps={{}}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        minHeight: 1,
        minWidth: 1,
    },
    body: {
        marginLeft: 10,
        marginRight: 10,
        maxWidth: SCREEN_WIDTH - (80 + 10 + 20),
    },
    image: {
        height: 80,
        width: 80,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        opacity: 0.5,
    },
    listItem: {
        flexDirection: 'row',
        margin: 10,
    },
});

/*import React, { Component } from "react"

import {
    View,
    SectionList,
    FlatList,
    Dimensions,
    ListView
} from "react-native"
const SCREEN_WIDTH = Dimensions.get('window').width;
import ImageActivityIndicator from "./imageActivityIndicator";
import PublicEvent from "./publicEvent";
import PrivateEvent from "./PrivateEvent";
import stores from "../../../../stores"
import { RecyclerListView, DataProvider, LayoutProvider } from "recyclerlistview";
import { Spinner } from "native-base";
import { forEach } from "lodash";
class CurrentEvents extends Component {
    constructor(props) {
        super(props)
    }

    rowRenderer = (type, data) => {
        console.warn(data.item);
        return data.item.public ? (
            <PublicEvent index={data.item.id}  {...this.props} Event={data.item} />
        ) : (
                <PrivateEvent index={index} {...this.props} parentCardList={this}
                    refresh={this.refreshCardList} Event={item} />
            );

    }

    render() {
        return (
            <RecyclerListView
                style={{ flex: 1 }}
                dataProvider={this.props.data}
                layoutProvider={new LayoutProvider(i => {
                    return this.props.data.getDataForIndex(i).type;
                }, (type, dim) => {
                    switch (type) {
                        case "NORMAL":
                            dim.width = SCREEN_WIDTH;
                            dim.height = 560;
                            break;
                        default:
                            dim.width = 0;
                            dim.height = 0;
                            break;
                    };
                })}
                rowRenderer={this.rowRenderer}
            />
        )
    }
}

export default CurrentEvents*/
