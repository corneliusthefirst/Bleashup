
import React, { Component } from 'react';
import { View, Dimensions, StatusBar, LayoutAnimation } from 'react-native';
import PublicEvent from "./publicEvent.js"
import Relation from "./Relation"
import { observer } from 'mobx-react';
import BleashupScrollView from '../../../BleashupScrollView.js';
import BleashupFlatList from '../../../BleashupFlatList';
import Orientation from 'react-native-orientation-locker';
import { ReactNativeZoomableView } from '@dudigital/react-native-zoomable-view';
import Image from 'react-native-scalable-image';
import { Icon, ActionSheet } from 'native-base';
import ParticipantModal from '../../../ParticipantModal.js';
import { find } from "lodash"
import stores from '../../../../stores';
import PublishersModal from '../../../PublishersModal.js';
import LikerssModal from '../../../LikersModal.js';
import InvitationModal from './InvitationModal.js';
import DetailsModal from '../../invitations/components/DetailsModal.js';
import PhotoViewer from '../../event/PhotoViewer.js';
import CreateEvent from '../../event/createEvent/CreateEvent';
import BeNavigator from "../../../../services/navigationServices"
const screenWidth = Math.round(Dimensions.get('window').width);
const screenheight = Math.round(Dimensions.get('window').height);

export default class CurrentEvents extends Component {
    constructor(props) {
        super(props)
        this.state = {
            participants: [],
            event_id: null,
            isParticipantModalOpened: false,
            isActionButtonVisible: true,
            newData: []
        }
    }
    state = {

    }

    // 2. Define a variable that will keep track of the current scroll position
    _listViewOffset = 0

    _onScroll = (event) => {
        // Simple fade-in / fade-out animation
        const CustomLayoutLinear = {
            duration: 100,
            create: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            update: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity },
            delete: { type: LayoutAnimation.Types.linear, property: LayoutAnimation.Properties.opacity }
        }
        // Check if the user is scrolling up or down by confronting the new scroll position with your own one
        const currentOffset = event.nativeEvent.contentOffset.y
        const direction = (currentOffset > 0 && currentOffset > this._listViewOffset)
            ? 'down'
            : 'up'
        // If the user is scrolling down (and the action-button is still visible) hide it
        const isActionButtonVisible = direction === 'up'
        if (isActionButtonVisible !== this.state.isActionButtonVisible) {
            LayoutAnimation.configureNext(CustomLayoutLinear)
            this.setState({ isActionButtonVisible })
        }
        // Update your scroll position
        this._listViewOffset = currentOffset
    }



    showPhoto(url) {
        this.setState({
            showPhoto: true,
            photo: url
        })
    }
    componentWillMount() {
        Orientation.unlockAllOrientations();
        //BackHandler.addEventListener("hardwareBackPress", this.handleBackButton.bind(this))
    }
    //handleBackButton() {
     //   if (this.state.showPhoto) {
     //       this.setState({
       //         showPhoto: false
     //       })
     //       return true
     //   }
   // }
    componentWillUnmount() {
       // BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    };
    options = ["View Paricipants", "Shared By", "Cancel"]
    showActions(id) {
        let event = find(this.props.data, { id: id })
        let participants = event.participant
        ActionSheet.show({
            options: this.options, title: "Select Action", cancelButtonIndex: 2,
            modalStyle: { backgroundColor: "#FEFFDE" }, actionSheetStyle: { backgroundColor: "#FEFEDE" }
        }, (index) => {
            if (index === 0) {
                this.setState({
                    event_id: id,
                    currentCreator:event.creator_phone,
                    participant: participants,
                    isParticipantModalOpened: true
                })
            } else if (index === 1) {
                this.setState({
                    isPublisherModalOpened: true,
                    event_id: id
                })
            }
        })
    }

    delay = 0
    renderPerbatch = 10
    componentDidMount() {
        
    }

    render() {

        StatusBar.setHidden(false, true)
        return (
            <View style={{ height: "100%",  }}>
                <BleashupFlatList
                //backgroundColor={"white"} 
                    keyExtractor={(item, index) => item.id}
                    dataSource={this.props.data||[]}
                    onScroll={this._onScroll}
                    renderItem={(item, index) => {
                        this.delay = index % this.renderPerbatch == 0 ? 0 : this.delay + 1
                        return item.type && item.type == "relation" ?<Relation
                        key={item.id}
                            openDetails={(event) => {
                                this.setState({
                                    isDetailsModalOpened: true,
                                    event: event
                                })
                            }}
                            renderDelay={this.delay * 25}
                            showPhoto={(url) => this.showPhoto(url)} key={item.id}  {...this.props} Event={item} />
                            :<PublicEvent
                            key={item.id}
                                openDetails={(event) => {
                                    this.setState({
                                        isDetailsModalOpened: true,
                                        event: event
                                    })
                                }}
                                showActions={(event_id) => this.showActions(event_id)}
                                renderDelay={this.delay * 5}
                                showPhoto={(url) => this.showPhoto(url)} key={item.id}  {...this.props} Event={item} />
                    }}
                    firstIndex={0}
                    renderPerBatch={this.renderPerbatch}
                    initialRender={20}
                    numberOfItems={this.props.data.length}
                >
                </BleashupFlatList>
                {
                    // ******************Photo Viewer View ***********************//
                    <PhotoViewer photo={this.state.photo} open={this.state.showPhoto} hidePhoto={() => {
                        this.setState({
                            showPhoto: false
                        })
                    }}></PhotoViewer>
                }
                <ParticipantModal creator={this.state.currentCreator} isOpen={this.state.isParticipantModalOpened} hideTitle={false} participants={this.state.participant} onClosed={() => {
                    this.setState({
                        isParticipantModalOpened: false
                    })
                }}  ></ParticipantModal>
                 <PublishersModal isOpen={this.state.isPublisherModalOpened} event_id={this.state.event_id} onClosed={() => {
                    this.setState({
                        isPublisherModalOpened: false
                    })
                }}></PublishersModal>
                <InvitationModal
                    isOpen={this.state.isInvitationModalOpened}
                    public={this.state.event && this.state.event.public}
                    master={this.state.master}
                    eventID={this.state.event && this.state.event.id} close={() => {
                        this.setState({
                            isInvitationModalOpened: false
                        })
                    }}></InvitationModal>
                {this.state.isDetailsModalOpened ? <DetailsModal goToActivity={() => {
                    BeNavigator.navigateToActivity('EventDetails', this.state.event);
                }} isToBeJoint event={this.state.event}
                    isOpen={this.state.isDetailsModalOpened}
                    onClosed={() => {
                        this.setState({
                            isDetailsModalOpened: false
                        })
                    }}>
                </DetailsModal> : null}

                {this.state.isActionButtonVisible ? <CreateEvent {...this.props} /> : null}
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
import Relation from './Relation';
import Navigator from '../../../../services/navigationServices';
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
