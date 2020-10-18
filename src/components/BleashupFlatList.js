import React, { Component } from "react"
import { FlatList, View, StyleSheet, Text } from "react-native";
import Spinner from './Spinner';
import BeComponent from './BeComponent';

const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
}
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        ((contentSize.height - paddingToBottom) * (0.20));
};
const isTooCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        ((contentSize.height - paddingToBottom) * (0.95));
};
export default class BleashupFlatList extends BeComponent {
    constructor(props) {
        super(props)
        this.state = {
            currentRender: this.props.initialRender ? this.props.initialRender : 4,
            currentNewRender: this.props.initialNewRender ? this.props.initialNewRender : 4,
            endReached: false,
            indexing: false
        }
        this.continueScroll = this.continueScroll.bind(this)
        this.renderItem = this.renderItem.bind(this)
        this.viewabilityConfig = {
            waitForInteraction: false,
            viewAreaCoveragePercentThreshold: 100
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
            this.setStatePure({
                currentRender: this.previousRendered + this.props.renderPerBatch
            })
        } else {
            this.setStatePure({
                endReached: true
            })
        }
    }
    resetCurrentRender() {
        this.setStatePure({
            currentRender: this.props.dataSource.length
        })
    }
    scrollToIndex(index) {
        this.resetCurrentRender()
        setTimeout(() => {
            let scroll = () => this.refs.bleashupFlatlist && this.refs.bleashupFlatlist.scrollToIndex({ animated: true, index: index })
            scroll()
            setTimeout(() => {
                scroll()
            }, 50)
        })
    }
    scrollToEnd(duration) {
        this.refs.bleashupFlatlist && this.refs.bleashupFlatlist.scrollToOffset({ animated: true, offset: 0, duration })
    }
    scrollToEndReal(duration) {
        this.resetCurrentRender()
        setTimeout(() => {
            this.refs.bleashupFlatlist && this.refs.bleashupFlatlist.scrollToEnd({ animated: true, duration })
            setTimeout(() => {
                this.refs.bleashupFlatlist && this.refs.bleashupFlatlist.scrollToEnd({ animated: true, duration })
            }, 100)
        }, 100)

    }
    resetItemNumbers() {
        this.setStatePure({
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
    continueScroll({ nativeEvent }) {
        if (isTooCloseToBottom(nativeEvent)) {
            this.props.loadMoreFromRemote && this.props.loadMoreFromRemote()
        }
        if (isCloseToBottom(nativeEvent)) {
            this.continueScrollDown()
        }
    }
    renderItem({ item, index }) {
        return <View style={styles.item}>{this.props.renderItem(item, index)}</View>
    }
    extraStyles = {
        height: this.props.fit ? null : '100%', backgroundColor: this.props.backgroundColor ?
            this.props.backgroundColor : "#ffffff"
    }
    render() {
        if (this.props.dataSource.length <= 0) {
            this.props.empty ? this.props.empty() : null
        }
        this.data = //this.props.dataSource 
            this.extractData()
        return (
            <View style={[styles.container, this.extraStyles, { ...this.props.styles }]}>
                {this.props.marginTop ? <View style={styles.padder}></View> : null}
                {this.data.length <= 0 && this.props.defaultItem ? this.props.defaultItem() : <FlatList
                    viewabilityConfig={this.viewabilityConfig}
                    onViewableItemsChanged={this.props.onViewableItemsChanged}
                    keyboardShouldPersistTaps={this.props.keyboardShouldPersistTaps || "handled"}
                    onScrollEndDrag={this.continueScroll}
                    enableEmptySections={false}
                    disableVirtualization={this.props.disableVirtualization}
                    getItemLayout={this.props.getItemLayout}
                    scrollEnabled={!this.props.disableScroll}
                    nestedScrollEnabled={true}
                    numColumns={this.props.numColumns ? this.props.numColumns : 1}
                    horizontal={this.props.horizontal ? this.props.horizontal : false}
                    onScroll={this.props.onScroll}
                    centerContent={true}
                    horizontal={this.props.horizontal}
                    windowSize={this.props.windowSize}
                    ref="bleashupFlatlist"
                    //canCancelContentTouches={true}
                    inverted={this.props.inverted ? this.props.inverted : false}
                    style={{ paddingHorizontal: 10, paddingTop: 5, }}
                    //ItemSeparatorComponent={this.props.ItemSeparatorComponent}
                    maxToRenderPerBatch={this.props.renderPerBatch ? this.props.renderPerBatch : this.props.inverted ? 5 : this.state.endReached ? 1 : 3}
                    //updateCellsBatchingPeriod={10}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={true}
                    keyExtractor={this.props.keyExtractor}
                    data={this.data}
                    extraData={this.props.extraData}
                    renderItem={this.renderItem}
                    ListFooterComponent={() =>
                        !this.props.fit && <View style={{ width: "100%", height: 200 }} >
                        </View>
                    }
                />}
            </View>)
    }
}
const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        height: '100%',
        backgroundColor: "#ffffff",
    },
    padder: {
        height: 5
    },
    item: {

    }
});