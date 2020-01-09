import React, { Component } from "react"
import { FlatList, View } from "react-native";
import { Spinner, CardItem, Text, List } from "native-base";
import { observer } from "mobx-react";
import { groupBy, chain, orderBy } from "lodash"
import { thisExpression } from "@babel/types";
import { moment } from "moment"

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
            currentNewRender: this.props.initialNewRender ? this.props.initialNewRender : 4,
            endReached: false
        }
    }
    initialRender = 3
    renderPerBatch = 3
    previousNewRender = 0
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

    continueScrollTop() {
        /* this.previousNewRender = this.state.currentNewRender
         console.warn(this.previousNewRender, "[[[")
         if (this.state.currentNewRender <= this.props.newData.length - 1) {
             this.setState({
                 currentNewRender: this.previousNewRender - this.props.newRenderPerBatch
             })
         } else {
             this.setState({
                 // endReached: true
             })
         }*/
    }
    scrollToEnd() {
        this.refs.bleashupFlatlist.scrollToOffset({ animated: true, offset: 0 })
    }
    resetItemNumbers() {
        this.setState({
            currentRender: this.props.initialRender,
            endReached: false
        })
    }
    previousData = []
    extractData() {
        let temporaryResult = []
        let possibleFilter = []
        return this.props.dataSource.slice(this.previousData.length, this.state.currentRender)

    }
    renderNewData() {
        return this.props.newData ? this.props.newData : [];
    }
    render() {
        return (
            <View style={{ flexDirection: 'column', backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : "#FEFFDE", }}>
                <FlatList
                    onScrollEndDrag={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            this.continueScrollDown()
                        } else if (ifCloseToTop(nativeEvent)) {
                            this.continueScrollTop()
                        }
                    }
                    }
                    horizontal={this.props.horizontal?this.props.horizontal:false}
                    onScroll={this.props.onScroll}
                    centerContent={true}
                    //horizontal={this.props.horizontal}
                    ref="bleashupFlatlist"
                    canCancelContentTouches={true}
                    inverted={this.props.inverted ? this.props.inverted : false}
                    removeClippedSubviews={false}
                    maxToRenderPerBatch={this.props.renderPerBatch ? this.props.renderPerBatch : this.props.inverted ? 5 : this.state.endReached ? 1 : 3}
                    //updateCellsBatchingPeriod={10}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this.props.keyExtractor}
                    data={this.renderNewData().concat(this.extractData())}
                    renderItem={({ item, index }) => this.props.renderItem(item, index)}
                    ListFooterComponent={() =>
                        this.state.currentRender >= this.props.numberOfItems - 1 ? null : <CardItem style={{ width: "100%", height: 25 }} >
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