import React, { Component } from "react"
import { FlatList, View,Dimensions } from "react-native";
import { Spinner, CardItem, Text, List } from "native-base";
import { observer } from "mobx-react";
import { groupBy, chain, orderBy } from "lodash"
import { thisExpression } from "@babel/types";
import { moment } from "moment"

let {height, width} = Dimensions.get('window');

const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
}
const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
        ((contentSize.height - paddingToBottom) * (0.95));
};
@observer export default class BleashupHorizontalFlatList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentRender: this.props.initialRender ? this.props.initialRender : 4,
            currentNewRender: this.props.initialNewRender ? this.props.initialNewRender : 4,
            endReached: false,
            isMounted:false,
            initialScrollIndex:0
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

    /*
    scrollToEnd() {
        this.refs.horizotalBleashupFlatlist.scrollToOffset({ animated: true, offset: 0 })
        
    }*/
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

   componentDidMount(){
    setTimeout(() => {
        this.setState({isMounted:true});
    },500);
    
   }




    render() {
        return (
         <View style={{ flexDirection: 'column', backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : "#FEFFDE", }}>
             {this.state.isMounted ?  
                 <FlatList
                    onScrollEndDrag={({ nativeEvent }) => {
                        if (isCloseToBottom(nativeEvent)) {
                            this.continueScrollDown()
                        } else if (ifCloseToTop(nativeEvent)) {
                            this.continueScrollTop()
                        }
                    }
                    }
                    onScroll={this.props.onScroll}
                    centerContent={true}
                    ref={this.props.refHorizontal}
                    canCancelContentTouches={true}
                    horizontal={true}
                    inverted={this.props.inverted ? this.props.inverted : false}
                    removeClippedSubviews={false}
                    maxToRenderPerBatch={this.props.renderPerBatch ? this.props.renderPerBatch : this.props.inverted ? 5 : this.state.endReached ? 1 : 3}
                    //updateCellsBatchingPeriod={10}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={this.props.keyExtractor}
                    getItemLayout={this.props.getItemLayout}
                    data={this.renderNewData().concat(this.extractData())}
                    renderItem={({ item, index }) => this.props.renderItem(item, index)}

                >
                </FlatList> : <Spinner size={"small"}></Spinner> }
            </View>
        )
    }
}
