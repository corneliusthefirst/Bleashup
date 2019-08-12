import React, { Component } from "react"

import {
    View,
    SectionList,
} from "react-native"

import { observer } from "mobx-react";
import ImageActivityIndicator from "./imageActivityIndicator";
import PublicEvent from "./publicEvent";
import PrivateEvent from "./PrivateEvent";
import stores from "../../../../stores"
import { Card, CardItem, Text } from "native-base";
@observer class NewEvents extends Component {
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
                    sections={[{
                        title: "first", data: stores.Events.newEvents.slice()
                    }]}
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
                <Card>
                    <CardItem>
                        <Text>serparator card</Text>
                    </CardItem>
                </Card>
            </View>
        )
    }
}
export default NewEvents
