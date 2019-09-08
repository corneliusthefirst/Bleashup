<<<<<<< HEAD
import React, { Component } from "react"
=======

import React, { Component } from 'react';
import { StyleSheet, View, Dimensions, Text, Image, ScrollView } from 'react-native';
import PublicEvent from "./publicEvent.js"
import { CardItem, Card, Spinner, ListItem } from 'native-base';
import { observer } from 'mobx-react';
import { forEach } from "lodash"
import BleashupFlatList from '../../../BleashupFlatList';
const SCREEN_WIDTH = Dimensions.get('window').width;


@observer export default class CurrentEvents extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <View style={{ height: "100%", backgroundColor: "#FEFFDE"}}>
                <BleashupFlatList
                    keyExtractor={(item, index) => item.id}
                    dataSource={this.props.data}
                    renderItem={(item, index) => <PublicEvent key={item.id}  {...this.props} Event={item} />}
                    firstIndex={0}
                    renderPerBatch={1}
                    initialRender={3}
                    numberOfItems={this.props.data.length}
                >
                </BleashupFlatList>
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
>>>>>>> d77cdff071c96d88910ce440f2b6f954dd66a1e3

import {
    View,
    SectionList,
    FlatList,
<<<<<<< HEAD
    ListView
} from "react-native"

=======
    Dimensions,
    ListView
} from "react-native"
const SCREEN_WIDTH = Dimensions.get('window').width;
>>>>>>> d77cdff071c96d88910ce440f2b6f954dd66a1e3
import ImageActivityIndicator from "./imageActivityIndicator";
import PublicEvent from "./publicEvent";
import PrivateEvent from "./PrivateEvent";
import stores from "../../../../stores"
<<<<<<< HEAD
import { observer } from "mobx-react";
@observer class CurrentEvents extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: true,
        number: 5
    }
    previousNumber = this.state.number
    refreshCardList = (activeKey) => {
        this.setState((prevState) => {
            return {
                //give the key to delete to the deleted row key
                deletedRowKey: activeKey
            };

        });
        //flatlist here is a reference to flatlist
        this.refs.cardlist.scrollToEnd();
    }
    render() {
        return (<View>
            <ListView
                style={{ flex: 1 }}
                ref={"cardlist"}
                listKey={"id"}
                windowSize={3}
                onEndReachedThreshold={0.1}
                onEndReached={(distance) => {
                    console.warn("scroll end reached!")
                    this.setState({ number: this.previousNumber + 5 });
                    this.previousNumber = this.state.number
                }}
                extraData={this.state.isRerendered}
                maxToRenderPerBatch={2}
                extraData={this.state}
                initialNumToRender={2}
                keyExtractor={(item, index) => item.id}
                dataSource={stores.Events.events.slice(0, this.state.number)}
                renderRow={(item, sectionID, index, highlightRow) => {
                    return item.public ? (
                        <PublicEvent index={index}  {...this.props} Event={item} />
                    ) : (
                            <PrivateEvent index={index} {...this.props} parentCardList={this}
                                refresh={this.refreshCardList} Event={item} />
                        );

                }}
            >
            </ListView>
        </View>
=======
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
>>>>>>> d77cdff071c96d88910ce440f2b6f954dd66a1e3
        )
    }
}

<<<<<<< HEAD
export default CurrentEvents
=======
export default CurrentEvents*/
>>>>>>> d77cdff071c96d88910ce440f2b6f954dd66a1e3
