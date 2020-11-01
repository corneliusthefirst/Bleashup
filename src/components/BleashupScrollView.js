import React, { Component } from "react"
import { FlatList, View, ScrollView, Text } from "react-native";
import Spinner from './Spinner';
import BeComponent from './BeComponent';


const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
}
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        ((contentSize.height - paddingToBottom) * (0.70));
};
export default class BleashupScrollView extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {
            currentRender: this.props.initialRender ? this.props.initialRender : 4,
            endReached: false
        }
    }
    scrollToIndex(index){
        this.scrollTo(index,50)
        setTimeout(() => {
            this.scrollTo(index,100)
        },100)
    }
    scrollTo(index,delay) {
        this.setStatePure({
            currentRender: this.props.dataSource.length,
            endReached: true
        })
        setTimeout(() => {
            if (this.refs.scrollViewRef) {
                this.refs.scrollViewRef.scrollTo({
                    y:
                        this.props.getItemLayout(index).offset, animated: true
                })
            }
        }, delay)
    }
    initialRender = 3
    renderPerBatch = 3
    previousRendered = 0
    _renderItems(array) {
        return array.map((element, index) => {
            return this.props.renderItem(element, this.props.keyExtractor(element, 1), index)
        })
    }
    continueScrollDown() {
        this.previousRendered = this.state.currentRender
        if (this.state.currentRender <= this.props.dataSource.length - 1) {
            this.setStatePure({
                currentRender: this.previousRendered + this.props.renderPerBatch
            })
        } else {
            this.setStatePure({
                endReached: true
            })
        }
    }
    render() {
        return (
            <View style={{
                flexDirection: 'column',
                backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : "white",
                ...this.props.style
            }}>
                <ScrollView
                    ref={"scrollViewRef"}
                    onScroll={this.props.onScroll}
                    alwaysBounceVertical
                    nestedScrollEnabled={true}
                    onScrollEndDrag={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            this.continueScrollDown()
                        }
                    }
                    }
                    centerContent={true}
                    //canCancelContentTouches={true}
                    removeClippedSubviews={true}
                    //updateCellsBatchingPeriod={10}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this.props.keyExtractor}>
                    {this._renderItems(this.props.dataSource.slice(this.props.firstIndex ? this.props.firstIndex : 0,
                        this.state.currentRender))}
                    {this.props.numberOfItems < this.props.initialRender ? null : <View style={{ width: "100%", height: 25 }} >
                        {this.state.endReached ? <Text style={{
                            marginLeft: "35%"
                        }}>no more data to load</Text> : <Spinner size={"small"}></Spinner>}
                    </View>}
                </ScrollView>
            </View>)
    }
}