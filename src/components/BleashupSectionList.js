import React, { Component } from "react"
import { FlatList, View } from "react-native";
import { Spinner, CardItem, Text, List } from "native-base";
//import { observer } from "mobx-react";
import { SectionList } from 'react-navigation';
import { thisExpression } from "@babel/types";


const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
}
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        ((contentSize.height - paddingToBottom) * (0.95));
};
/*@observer*/ export default class BleashupSectionList extends Component {
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
    scrollToEnd() {
        this.refs.BleashupSectionList.scrollToOffset({ animated: true, offset: 0 })
    }
    resetItemNumbers() {
        this.setState({
            currentRender: this.props.initialRender,
            endReached: false
        })
    }
    render() {
        return (
            <View style={{ flexDirection: 'column', backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : "#FEFFDE", }}>
                <SectionList
                    onScrollEndDrag={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            this.continueScrollDown()
                        }
                    }
                    }
                    centerContent={true}
                    ref="bleashupSectionList"
                    canCancelContentTouches={true}
                    inverted={this.props.inverted ? this.props.inverted : false}
                    removeClippedSubviews={false}
                    maxToRenderPerBatch={this.props.inverted ? 5 : this.state.endReached ? this.props.renderPerBatch : 3}
                    //updateCellsBatchingPeriod={10}
                    renderSectionHeader={this.props.renderSectionHeader}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this.props.keyExtractor}
                    sections={this.props.dataSource.slice(this.props.firstIndex ? this.props.firstIndex : 0,
                        100)}
                    renderItem={({ item }) => this.props.renderItem(item, this.props.keyExtractor(item, 1))}
                    ListFooterComponent={() =>
                        this.props.numberOfItems < this.props.initialRender ? null : <CardItem style={{ width: "100%", height: 25 }} >
                            {this.state.endReached ? <Text style={{
                                marginLeft: "35%"
                            }}>no more data to load</Text> : <Spinner size={"small"}></Spinner>}
                        </CardItem>
                    }
                >

                </SectionList>
            </View>)
    }
}