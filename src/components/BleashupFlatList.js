import React, { Component } from "react"
import {  FlatList,View } from "react-native";
import { Spinner, CardItem, Text, List } from "native-base";
import { observer } from "mobx-react";
import { thisExpression } from "@babel/types";


const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
}
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        ((contentSize.height - paddingToBottom) * (0.95));
};
@observer export default class BleashupFlatList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentRender: this.props.initialRender ? this.props.initialRender : 4,
            endReached: false
        }
    }
    initialRender = 3
    renderPerBatch = 3
    previousRendered = 0
    _renderItems(array) {
        return array.map((element) => {
            return this.props.renderItem(element, this.props.keyExtractor(element, 1))
        })
    }
    continueScrollDown() {
        this.previousRendered = this.state.currentRender
        if (this.state.currentRender <= this.props.dataSource.length - 1) {
            this.setState({
                currentRender: this.previousRendered + this.props.renderPerBatch
            })
        } else {
            this.setState({
                endReached: true
            })
        }
    }
    render() {
        return (
            <View style={{ display: 'flex', backgroundColor: "#FEFFDE", }}>
                <FlatList
                    onScrollEndDrag={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            this.continueScrollDown()
                        }
                    }
                    }
                    centerContent={true}
                    ref="bleashupFlatlist"
                    canCancelContentTouches={true}
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={23}
                    //updateCellsBatchingPeriod={10}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this.props.keyExtractor}
                    data={this.props.dataSource.slice(this.props.firstIndex ? this.props.firstIndex : 0,
                        this.state.currentRender)}
                    renderItem={({ item }) => this.props.renderItem(item, this.props.keyExtractor(item, 1))}
                    ListFooterComponent={() =>
                        this.props.numberOfItems < this.props.initialRender ? null : <CardItem style={{ height: 25 }} >
                            {this.state.endReached ? <Text style={{
                                marginLeft: "35%"
                            }}>no more data to load</Text> : <Spinner size={"small"}></Spinner>}
                        </CardItem>
                    }
                >
                </FlatList>
            </View>)
    }
}