import React, { Component } from "react"

import {
    View,
    SectionList,
    FlatList,
    ListView
} from "react-native"

import ImageActivityIndicator from "./imageActivityIndicator";
import PublicEvent from "./publicEvent";
import PrivateEvent from "./PrivateEvent";
import stores from "../../../../stores"
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
            <FlatList
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
                data={stores.Events.events.slice(0, this.state.number)}
                renderItem={({ item, index }) => {
                    return item.public ? (
                        <PublicEvent index={index}  {...this.props} Event={item} />
                    ) : (
                            <PrivateEvent index={index} {...this.props} parentCardList={this}
                                refresh={this.refreshCardList} Event={item} />
                        );

                }}
            >
            </FlatList>
        </View>
        )
    }
}

export default CurrentEvents
