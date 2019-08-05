import React, { Component } from "react"

import {
    View,
    SectionList,
} from "react-native"

import ImageActivityIndicator from "./imageActivityIndicator";
import PublicEvent from "./publicEvent";
import PrivateEvent from "./PrivateEvent";
import stores from "../../../stores"
import { observer } from "mobx-react";
@observer class CurrentEvents extends Component {
    constructor(props) {
        super(props)
    }
    state = {
        isLoading: true
    }
    componentDidMount() {
        this.setState({ isLoading: false })
    }
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
        return (
            this.state.isLoading ? <ImageActivityIndicator></ImageActivityIndicator> : <View>
                <SectionList
                    style={{ flex: 1 }}
                    ref={"cardlist"}
                    listKey={"id"}
                    keyExtractor={(item, index) => item.id}
                    sections={[{ title: "", data: stores.Events.newEvents.slice() }, { title: "", data: stores.Events.events }]}
                    renderItem={({ item, index, section }) => {
                        return item.public ? (
                            <PublicEvent index={index} {...this.props} Event={item} />
                        ) : (
                                <PrivateEvent index={index} {...this.props} parentCardList={this}
                                    refresh={this.refreshCardList} Event={item} />
                            );

                    }}
                >
                </SectionList>
            </View>
        )
    }
}

export default CurrentEvents